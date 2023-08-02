window.onload = function () {
    if (appliedFilters) {
      const parseResult = new DOMParser().parseFromString(
        appliedFilters,
        "text/html"
      );
      const parsedUrl = parseResult.documentElement.textContent;
      preSelectFiltersFromQS(parsedUrl);
    }
};

function showFilterPopup(filterPopup) {
    if (document.getElementById(filterPopup).style.display == "block") {
        document.getElementById(filterPopup).style.display = "none";
        document.querySelector(".js-filter-container").classList.add("display-none");
        document.getElementById("filter_heading").innerHTML = "Filter";
        document.getElementById("idbybody").classList.remove("overflow-hidden");
    } else {
        document.getElementById(filterPopup).style.display = "block";
        document.querySelector(".js-filter-container").classList.remove("display-none");
        document.getElementById("filter_heading").innerHTML = "Filter";
        document.querySelector(".js-filter-container").classList.add("overflow-hidden");
        document.getElementById("idbybody").classList.add("overflow-hidden");
    }
}

function hide_filters() {
    document.getElementById("idbybody").classList.remove("overflow-hidden");
    document.getElementById("filtoptdiv").style.display = "none";
    document.querySelector(".js-filter-container").classList.add("display-none");
}


function toggleVersionListVisibility(modelId) {
    document.querySelector(`#version-list-${modelId}`).classList.toggle("display-none");
    document.querySelector(`.js-version-button-arrow-${modelId}`).classList.toggle("rotate-upside-down");
}