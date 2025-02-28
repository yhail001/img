(function(){
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


/* logos-slide stuff? literally no idea what this does*/
var original = document.querySelector('.logos-slide');
var copy = original.cloneNode(true);
original.parentNode.appendChild(copy);

