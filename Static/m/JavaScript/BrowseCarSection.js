function toggleBrowseCarsContent(index) {
    const tabPrefix = "browse-cars-list-item-";
    const tabContentPrefix = "browse-cars-content-";

    // Toggle tags
    const browseCarTabs = document.getElementsByClassName("browse-cars-list-item");
    for(let i = 0 ; i < browseCarTabs.length ; i++) {
        if(browseCarTabs[i].classList.contains(tabPrefix + index)) {
            browseCarTabs[i].classList.add("active");
        } else {
            browseCarTabs[i].classList.remove("active");
        }
    }

    // Toggle content
    const browseCarsContents = document.getElementsByClassName("browse-cars-content");
    for(let j = 0 ; j < browseCarsContents.length ; j++) {
        if(browseCarsContents[j].classList.contains(tabContentPrefix + index)) {
            browseCarsContents[j].style.display = "block";
        } else {
            browseCarsContents[j].style.display = "none";
        }
    }
}

function toggleViewMoreBodyTypes() {
    const btn = document.getElementById("expand-body-type-btn");
    const moreBodyTypes = document.getElementsByClassName("more-body-type-item");

    if(btn && btn.textContent === "View More Body Type") {
        // Show more body types

        btn.textContent = "View Less Body Type";
        for (let i = 0; i < moreBodyTypes.length; i++) {
            moreBodyTypes[i].style.display = "block";
        }
    } else {
        // Hide more body types
        btn.textContent = "View More Body Type";
        for (let i = 0; i < moreBodyTypes.length; i++) {
            moreBodyTypes[i].style.display = "none";
        }
    }
}

function toggleViewMoreOptions() {
    const btn = document.querySelector(".js-expand-more-btn");
    const moreOptions = document.querySelectorAll(".js-more-options");

    if(!btn) {
        return;
    }
    if(btn.textContent === "View More Options") {
        btn.textContent = "View Less Options";
        moreOptions.forEach(options =>
            options.classList.remove("display-none")
        )
    }
    else {
        btn.textContent = "View More Options";
        moreOptions.forEach(options =>
            options.classList.add("display-none")
        )
    }
}
