const sections = document.querySelectorAll('.section');
const sectBtns = document.querySelector('.controls'); // Changed to target the container
const sectBtn = document.querySelectorAll('.control');

function PageTransitions() {
  // Button click active class
  sectBtns.addEventListener('click', (e) => { // Event listener on the controls container
    const clickedBtn = e.target.closest('.control'); // Find the clicked button, or return null

    if (!clickedBtn) return;  // If not clicked on a control button, ignore.
    
    // Remove active class from all buttons
    sectBtn.forEach(btn => btn.classList.remove('active-btn'));

    // Add active class to clicked button
    clickedBtn.classList.add('active-btn');


    // Activate the related section
    const id = clickedBtn.dataset.id;
    sections.forEach(section => section.classList.remove('active'));
    const element = document.getElementById(id);
    if (element) {
         element.classList.add('active');
    }
   
  });
}

PageTransitions();