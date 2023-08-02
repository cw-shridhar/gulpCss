const aboutUs = (function() {
    const aboutUsBtn = document.getElementById("js-aboutUs-btn");
    const contactUsBtn = document.getElementById("js-contactUs-btn");
    const aboutUs = document.getElementById("js-aboutUs");
    const contactUs = document.getElementById("js-contactUs");
    let offsetPosition = 0;
    
    scroll = (sectionId) => {
        if (sectionId === "js-aboutUs") {
            offsetPosition = aboutUs.getBoundingClientRect().top + window.pageYOffset - 50;
            aboutUsBtn.classList.add("active-btn");
            contactUsBtn.classList.remove("active-btn");
        } else {
            offsetPosition = contactUs.getBoundingClientRect().top + window.pageYOffset - 50;
            contactUsBtn.classList.add("active-btn");
            aboutUsBtn.classList.remove("active-btn");
        }

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
       });
    }

    return { scroll }
})();