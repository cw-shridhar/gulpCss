$(document).ready(function () {
  $(".des_read_more").click(function () {
    $("#read_more_des").removeClass("min_cls");
    $("#read_more_des").addClass("max_cls");
    $(".read_less").css("display", "block");
    $(".des_read_more").css("display", "none");
  });

  $(".read_less").click(function () {
    $("#read_more_des").removeClass("max_cls");
    $("#read_more_des").addClass("min_cls");
    $(".des_read_more").css("display", "inline-block");
    $(".read_less").css("display", "none");
  });
});

function versionColapsible(id) {
  let elementDisplay = document.getElementById("versionsList-" + id).style.display;
  let dropDownBtn = document.getElementById(id);
  if (elementDisplay == "none") {
    document.getElementById("versionsList-" + id).style.display = "block";
    document.getElementById("versionsList-" + id).style.height = "auto";
    dropDownBtn.classList.add("active");
    analytics.trackAction("CTInteractive", "FilterPage_Version", "VariantDropdownOpen");
    ctTracking.trackEvent({
      'category': "FilterPage_Version",
      'action': "VariantDropdownOpen"
    });
  } else {
    document.getElementById("versionsList-" + id).style.display = "none";
    document.getElementById("versionsList-" + id).style.height = "0px";
    dropDownBtn.classList.remove("active");
    analytics.trackAction("CTInteractive", "FilterPage_Version", "VariantDropdownClose");
    ctTracking.trackEvent({
      'category': "FilterPage_Version",
      'action': "VariantDropdownClose"
    });
  }
}

window.onload = function () {
  if (appliedFilters) {
    const parseResult = new DOMParser().parseFromString(appliedFilters, "text/html");
    const parsedUrl = parseResult.documentElement.textContent;
    preSelectFiltersFromQS(parsedUrl);
  }
  preSelectFiltersFromQS(window.location.search);
  addPageMarkerObserver();
};
