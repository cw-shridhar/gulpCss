var modelAccordion = document.getElementsByClassName("js_accordion_container");
handleAccordion();
function show_hide(vb) {
  try {
    if (document.getElementById(vb).style.display == "block") {
      document.getElementById("filtrdiv").style.display = "none";
      document.getElementById(vb).style.display = "none";
      document.getElementById("filter_heading").innerHTML = "Filter";
      document.getElementById("wrapper").style.display = "block";
      document.getElementById("closeFloatbarId1").style.display = "table";
      $("#idbybody").css("overflow", "visible");
    } else {
      document.getElementById(vb).style.display = "block";
      document.getElementById("closeFloatbarId1").style.display = "table";
      document.getElementById("filter_heading").innerHTML = "Filter";
      document.getElementById("filtrdiv").style.display = "block";
      document.getElementById("wrapper").style.display = "none";
      document.getElementById("closeFloatbarId1").style.display = "none";
      document.getElementById("filtrdiv").style.overflow = "hidden";
      $("#idbybody").css("overflow", "hidden");
    }
  } catch (e) {
    console.log(e);
  }
}

function hide_filters() {
  try {
    $("#idbybody").css("overflow", "visible");
    document.getElementById("filtoptdiv").style.display = "none";
    document.getElementById("filtrdiv").style.display = "none";
    document.getElementById("wrapper").style.display = "block";
    document.getElementById("closeFloatbarId1").style.display = "table";
    _gtm_push(
      "New Cars|Make Page Refine",
      "Close",
      "Close",
      "eventNew Cars|Make Page Refine"
    );
    clearPopupHistory();
  } catch (e) { }
}

// calling pre apply Filters on load
window.onload = function () {
  if (appliedFilters) {
    const parseResult = new DOMParser().parseFromString(
      appliedFilters,
      "text/html"
    );
    const parsedUrl = parseResult.documentElement.textContent;
    preSelectFiltersFromQS(parsedUrl);
  }
  preSelectFiltersFromQS(window.location.search);
  updateCount();
  addPageMarkerObserver();
};

function handleAccordion() {
  let i;
  for (i = 0; i < modelAccordion.length; i++) {
    let accordianButton = modelAccordion[i].querySelector(".version_visibility_toggler");
    accordianButton.addEventListener("click", function () {
      let toggleBtn = this;
      let isOpen = toggleBtn.classList.contains("current");
      let panel = this.nextElementSibling;

      if (isOpen) {
        toggleBtn.classList.remove("current");
        panel.classList.add("hide_accordian_card");
        analytics.trackAction("CTInteractive", "FilterPage_Version", "VariantDropdownClose");
        ctTracking.trackEvent({
          'category': "FilterPage_Version",
          'action': "VariantDropdownClose"
        });
      } else {
        toggleBtn.classList.add("current");
        panel.classList.remove("hide_accordian_card");
        analytics.trackAction("CTInteractive", "FilterPage_Version", "VariantDropdownOpen");
        ctTracking.trackEvent({
          'category': "FilterPage_Version",
          'action': "VariantDropdownOpen"
        });
      }
    });
  }
}
function readMore() {
  let textContainer = document.getElementById("read_more_synop");
  let readMoreBtn = document.querySelector(".js-read-more-btn");
  if (textContainer.classList.contains("min_cls_synop")) {
    textContainer.classList.remove("min_cls_synop");
    textContainer.classList.add("max_cls_synop");
    readMoreBtn.textContent = "Read Less";
    readMoreBtn.classList.remove("min_read_synop");
    readMoreBtn.classList.add("max_read_synop");
  } else {
    textContainer.classList.remove("max_cls_synop");
    textContainer.classList.add("min_cls_synop");
    readMoreBtn.textContent = "Read More";
    readMoreBtn.classList.remove("max_read_synop");
    readMoreBtn.classList.add("min_read_synop");
  }
}
