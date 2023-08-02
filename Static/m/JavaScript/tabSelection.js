function changeReviewTab(tabName) {
    let allTabs = document.querySelectorAll(".js-expert-review-tab");
    let expertReviewContainers = document.querySelectorAll(".js-expert-review-container");
    allTabs.forEach(tab => {
        tab.classList.remove("active");
    });

    expertReviewContainers.forEach(container => {
        container.classList.add("display-none");
    });

    document.getElementById("tab-" + tabName)?.classList.add("active");
    document.getElementById("expert-review-container-" + tabName)?.classList.remove("display-none");
}
