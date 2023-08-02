function toggleCarSynopsis() {
    var read_btn = document.getElementById("about-read-more");
    var symposis_content = document.getElementById("synopsis-content");

    if(symposis_content.classList.contains("min_synopsis")) {
        // expand synopsis
        symposis_content.classList.remove("min_synopsis");
        read_btn.style.textAlign = "left";
        read_btn.textContent = "Read Less";
    } else {
        // collapse synopsis
        symposis_content.classList.add("min_synopsis");
        read_btn.style.textAlign = "right";
        read_btn.textContent = "Read More";
    }
}


if(isFuturistic) {
    toggleCarSynopsis();
}