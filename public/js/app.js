(function() {
    // Section Navigation (Scroll to Section)
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");

            const targetSectionId = button.dataset.id; // Get the section ID
            const targetSection = document.getElementById(targetSectionId);

            if (targetSection) {
                targetSection.scrollIntoView({behavior: 'smooth', block: 'start'}); // Smooth scroll to section
            }
        });
    });
})();

// Contact Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Get form data
            const formData = new FormData(contactForm);  // Use FormData

            try {
                const response = await fetch('https://php-b00y.onrender.com/public/contactform.php', { // Update the URL here
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Debugging: Log the raw response text

                const result = await response.json();

                // Reset form state
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;

                const messageEl = document.getElementById('formMessage');

                if (response.ok && result.success) {
                    // Show success message
                    messageEl.textContent = 'Thank you for your message! We will get back to you soon.';
                    messageEl.className = 'form-message success';
                    messageEl.style.display = 'block';
                    this.reset();
                } else {
                    // Show error message
                    messageEl.textContent = `There was an error sending your message: ${result.message || 'Please try again'}`;
                    messageEl.className = 'form-message error';
                    messageEl.style.display = 'block';
                }

                // Hide message after 5 seconds
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 5000);

            } catch (error) {
                console.error('Error:', error);
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;

                const messageEl = document.getElementById('formMessage');
                messageEl.textContent = 'Network error. Please check your connection and try again.';
                messageEl.className = 'form-message error';
                messageEl.style.display = 'block';
            }
        });
    }
});

/* logos-slide stuff? literally no idea what this does*/
var original = document.querySelector('.logos-slide');
var copy = original.cloneNode(true);
original.parentNode.appendChild(copy);