$(document).ready(function () {
    let category = "Mobile-Make_NewCarLead";
    document.querySelectorAll('.model_container')
        .forEach(e => {
            let targetType = parseInt(e.getAttribute("data-targetType"));
            let makeName = e.getAttribute("data-make");
            let modelName = e.getAttribute("data-model")
            //fire impression tracking events
            leadFormTracking.fireCampaignCallEvent(true, category, "NewCarLeadCampaignCalled_on_PageLoad", leadFormPopup.getEventLabel(true, targetType, makeName, modelName));
            leadFormTracking.fireCampaignReturnEvent(true, category, makeName, modelName, targetType);
        });
    if (appliedFilters) {
        const parseResult = new DOMParser().parseFromString(appliedFilters, "text/html");
        const parsedUrl = parseResult.documentElement.textContent;
        preSelectFiltersFromQS(parsedUrl);
    }
    addPageMarkerObserver();
});

function addPageMarkerObserver() {
    const options = {
        threshold: [0.0],
    };
    let observer = new IntersectionObserver(handleIntersect, options);
    let marker = document.querySelector("#image-carousel-wrapper");
    if (marker) {
        observer.observe(marker);
    }
}

function handleIntersect(entries, observer) {
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
            let lazyImage = entries[i].target.querySelectorAll(".lazyload")
            for (let j = 0; j < lazyImage.length; j++) {
                imageElement = lazyImage[j];
                $(imageElement).attr("src", $(imageElement).attr("data-lazyload-src"));
                $(imageElement).removeAttr("data-lazyload-src");
            }
            observer.unobserve(entries[i].target);
        }
    }
}

function toggleVersionListVisibility(modelId) {
    document.querySelector(`#version-list-${modelId}`).classList.toggle("display-none");
    document.querySelector(`.js-version-button-arrow-${modelId}`).classList.toggle("rotate-upside-down");
}