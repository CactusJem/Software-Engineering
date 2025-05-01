const backendURL = 'http://cpanel-jamesko.melsa.net.id/api'; // Change to your actual URL

// DOM Elements
const homeScreen = document.getElementById("home");
const seekerScreen = document.getElementById("seeker");
const employerScreen = document.getElementById("employer");
const jobListElement = document.getElementById("jobList");
const loadingElement = document.getElementById("loading");
const jobForm = document.getElementById("jobForm");

// Navigation functions
function showSeeker() {
  homeScreen.classList.add("hidden");
  seekerScreen.classList.remove("hidden");
  fetchJobs();
}

function showEmployer() {
  homeScreen.classList.add("hidden");
  employerScreen.classList.remove("hidden");
}

function goHome() {
  homeScreen.classList.remove("hidden");
  seekerScreen.classList.add("hidden");
  employerScreen.classList.add("hidden");
}

// Job fetching and display
async function fetchJobs() {
  try {
    jobListElement.innerHTML = "";
    loadingElement.style.display = "flex";
    
    const response = await fetch(`${backendURL}/jobs.php`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    loadingElement.style.display = "none";
    
    if (data.length === 0) {
      jobListElement.innerHTML = `
        <div class="job-card">
          <h4>No jobs available</h4>
          <p>There are currently no job listings. Please check back later.</p>
        </div>
      `;
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
        </div>
      `;
      jobListElement.appendChild(jobCard);
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    loadingElement.style.display = "none";
    jobListElement.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error loading jobs. Please try again later.</p>
      </div>
    `;
  }
}

// Job posting function
async function postJob(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById("submitBtn");
  const originalBtnText = submitBtn.innerHTML;
  
  // Get form values
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
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Posting...`;
    
    const response = await fetch(`${backendURL}/post-job.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Show success message
    const successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <p>Job posted successfully!</p>
    `;
    
    jobForm.insertBefore(successMessage, jobForm.firstChild);
    
    // Clear form fields
    jobForm.reset();
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Remove success message after 5 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
    
  } catch (error) {
    console.error("Error posting job:", error);
    
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <p>Failed to post job. Please try again.</p>
    `;
    
    jobForm.insertBefore(errorMessage, jobForm.firstChild);
    
    // Scroll to top to show error message
    window.scrollTo({ top: 0, behavior: "smooth" });
    
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Add any initialization code here
});