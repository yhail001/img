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
            const formData = new FormData(contactForm);
            const formDataObject = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });
            
            try {
                const response = await fetch('public/api/contactForm.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataObject)
                });
    
                let result;
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    result = await response.json();
                } else {
                    // Handle non-JSON responses
                    const text = await response.text();
                    throw new Error(`Received non-JSON response: ${text}`);
                }
    
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
                console.error("Form submission error:", error);
                
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
    
                const messageEl = document.getElementById('formMessage');
                messageEl.textContent = 'Network error. Please check your connection and try again.';
                messageEl.className = 'form-message error';
                messageEl.style.display = 'block';
                
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 5000);
            }
        });
    }
});


/* logos-slide stuff? literally no idea what this does*/
var original = document.querySelector('.logos-slide');
var copy = original.cloneNode(true);
original.parentNode.appendChild(copy);