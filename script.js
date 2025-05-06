document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.header');

    // Sticky header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Intersection Observer for fade-in effects
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1
    });

    const sectionsToObserve = document.querySelectorAll(
        '.home, .about, .testimony, .wrapper, .timeline-container ul li, .card-list .card-item, .timeline-container'
    );

    sectionsToObserve.forEach((section) => observer.observe(section));
});
