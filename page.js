const backendURL = ''; //replace with your url
const EMPLOYER_ACCESS_KEY = 'jobsecure2025';

const homeScreen = document.getElementById("home");
const seekerScreen = document.getElementById("seeker");
const employerScreen = document.getElementById("employer");
const jobListElement = document.getElementById("jobList");
const loadingElement = document.getElementById("loading");
const jobForm = document.getElementById("jobForm");

function showSeeker() {
  homeScreen.classList.add("hidden");
  seekerScreen.classList.remove("hidden");
  fetchJobs();
}

function showEmployer() {
  homeScreen.classList.add("hidden");
  employerScreen.classList.remove("hidden");
  document.getElementById("employerAuth").classList.remove("hidden");
  document.getElementById("employerForm").classList.add("hidden");
}

function verifyAccess() {
  const key = document.getElementById("accessKey").value.trim();
  const errorMsg = document.getElementById("authError");
  if (key === EMPLOYER_ACCESS_KEY) {
    document.getElementById("employerAuth").classList.add("hidden");
    document.getElementById("employerForm").classList.remove("hidden");
    errorMsg.classList.add("hidden");
  } else {
    errorMsg.classList.remove("hidden");
  }
}

function goHome() {
  homeScreen.classList.remove("hidden");
  seekerScreen.classList.add("hidden");
  employerScreen.classList.add("hidden");
}

async function fetchJobs() {
  try {
    jobListElement.innerHTML = "";
    loadingElement.style.display = "flex";

    const response = await fetch(`${backendURL}/jobs.php`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    loadingElement.style.display = "none";

    if (data.length === 0) {
      jobListElement.innerHTML = `
        <div class="job-card">
          <h4>No jobs available</h4>
          <p>There are currently no job listings. Please check back later.</p>
        </div>`;
      return;
    }

    data.forEach(job => {
      const jobCard = document.createElement("div");
      jobCard.className = "job-card";
      jobCard.innerHTML = `
        <h4>${job.title}</h4>
        <p>${job.description}</p>
        <div class="job-details">
          <p><strong><i class="fas fa-building"></i> Company:</strong> ${job.company}</p>
          <p><strong><i class="fas fa-map-marker-alt"></i> Location:</strong> ${job.location}</p>
          <p><strong><i class="fas fa-money-bill-wave"></i> Salary:</strong> ${job.salary}</p>
          <p><strong><i class="fas fa-phone"></i> Contact:</strong> ${job.contactNumber}</p>
          <p><strong><i class="fas fa-envelope"></i> Email:</strong> ${job.contactEmail}</p>
        </div>`;
      jobListElement.appendChild(jobCard);
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    loadingElement.style.display = "none";
    jobListElement.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error loading jobs. Please try again later.</p>
      </div>`;
  }
}

async function postJob(event) {
  event.preventDefault();
  const submitBtn = document.getElementById("submitBtn");
  const originalBtnText = submitBtn.innerHTML;

  const formData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    location: document.getElementById("location").value,
    salary: document.getElementById("salary").value,
    company: document.getElementById("company").value,
    contactNumber: document.getElementById("contactNumber").value,
    contactEmail: document.getElementById("contactEmail").value
  };

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Posting...`;

    const response = await fetch(`${backendURL}/post-job.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <p>Job posted successfully!</p>`;
    jobForm.insertBefore(successMessage, jobForm.firstChild);
    jobForm.reset();
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => successMessage.remove(), 5000);
  } catch (error) {
    console.error("Error posting job:", error);
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <p>Failed to post job. Please try again.</p>`;
    jobForm.insertBefore(errorMessage, jobForm.firstChild);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const chatbox = document.getElementById('chatbox');
  const message = input.value.trim();
  if (!message) return;

  chatbox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  input.value = '';
  chatbox.scrollTop = chatbox.scrollHeight;

  const loadingId = 'ai-loading-' + Date.now();
  chatbox.innerHTML += `<p id="${loadingId}"><strong>JobFinder AI:</strong> <i class="fas fa-spinner fa-spin"></i> Thinking...</p>`;
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    const res = await fetch(`${backendURL}/ai-proxy.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    document.getElementById(loadingId).remove();
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();
    if (data.error) {
      chatbox.innerHTML += `<p style="color:red;"><strong>Error:</strong> ${data.error}</p>`;
    } else if (data.choices && data.choices[0]) {
      const reply = data.choices[0].message.content.trim();
      chatbox.innerHTML += `<p><strong>JobFinder AI:</strong> ${reply}</p>`;
    } else {
      chatbox.innerHTML += `<p style="color:red;"><strong>Error:</strong> Unexpected response format from server.</p>`;
    }
  } catch (err) {
    document.getElementById(loadingId).remove();
    console.error("Fetch error:", err);
    chatbox.innerHTML += `<p style="color:red;"><strong>Error:</strong> Unable to reach GPT. Details: ${err.message}</p>`;
    chatbox.innerHTML += `<p style="color:#777; font-size:0.8rem;">Troubleshooting: Make sure ai-proxy.php exists in the same directory as this HTML file.</p>`;
  }
  chatbox.scrollTop = chatbox.scrollHeight;
}
