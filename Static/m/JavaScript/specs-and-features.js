function setFeatureAccordion() {
    var ver_acc = document.getElementsByClassName("specs-accordion");
    var i;
    for (i = 0; i < ver_acc.length; i++) {
        ver_acc[i].addEventListener("click", function () {
            this.classList.toggle("current");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
}

setFeatureAccordion();
