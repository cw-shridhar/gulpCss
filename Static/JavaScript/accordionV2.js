let accordions = document.getElementsByClassName("js-accordion-title");

for (i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let accordionContent = this.nextElementSibling;
        if (accordionContent.style.maxHeight) {
            accordionContent.style.maxHeight = null;
        } else {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
        }
    });
}

