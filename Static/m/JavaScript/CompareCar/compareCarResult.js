const bottomFloatingBar = document.querySelector(".bottom-floating-bar");
const comparisonDetailsContainer = document.querySelector(".js-comparison-details-container");
const similaritiesButton = document.getElementById("similarities-button");
const differencesButton = document.getElementById("differences-button");
const searchSpecFeaturesButton = document.getElementById("spec-features-button");
const similarities = document.querySelectorAll(".js-similar");
const differences = document.querySelectorAll(".js-different");
const specFeatureAccordionTitles = document.querySelectorAll(".js-spec-feature-accordion-title");

function compareCarTopBottomSticky() {
  if (
    typeof jQuery != "undefined" &&
    (document.readyState == "interactive" || document.readyState == "complete")
  ) {
    var distance = comparisonDetailsContainer.offsetHeight;
    $(document).on("scroll", function () {
      if ($(window).scrollTop() >= distance) {
        if ($(this).scrollTop() >= $(".js-similarcomp").position().top) {
          $(".car-stick-top").addClass("inactive");
          bottomFloatingBar.classList.add("inactive");
          resetCompareSearch();
        } else {
          $(".car-stick-top").removeClass("inactive");
          bottomFloatingBar.classList.remove("inactive");
        }
      } else {
        $(".car-stick-top").addClass("inactive");
        bottomFloatingBar.classList.add("inactive");
        resetCompareSearch();
      }
    });
  } else {
    setTimeout("compareCarTopBottomSticky()", 1000);
  }
}
setTimeout("compareCarTopBottomSticky()", 2000);

function showSimilarities() {
  if (similaritiesButton.classList.contains("selected")) {
    deSelectShowSimilarites();
    return;
  }
  if (differencesButton.classList.contains("selected")) {
    deSelectHighlightDifferences();
  }
  resetCompareSearch();
  selectShowSimilarites();
}

function highlightDifferences() {
  if (differencesButton.classList.contains("selected")) {
    deSelectHighlightDifferences();
    return;
  }
  if (similaritiesButton.classList.contains("selected")) {
    deSelectShowSimilarites();
  }
  resetCompareSearch();
  selectHighlightDifferences();
}

function selectShowSimilarites() {
  similaritiesButton.classList.add("selected");
  differences?.forEach(difference => difference.classList.add("display-none"));

  //remove categories with no content
  specFeatureAccordionTitles?.forEach(
    accordionTitle => {
      let accordionContent = accordionTitle.nextElementSibling;
      if (accordionContent.scrollHeight == 0) {
        accordionTitle.classList.add("display-none");
      }
    });
}

function deSelectShowSimilarites() {
  similaritiesButton.classList.remove("selected");
  differences?.forEach(difference => difference.classList.remove("display-none"));

  //remove display-none from hidden categories
  specFeatureAccordionTitles?.forEach(
    accordionTitle => {
      accordionTitle.classList.remove("display-none");
      let accordionContent = accordionTitle.nextElementSibling;
      //for already opened accordions - if content increases to adjust the height accordingly
      if (accordionContent.style.maxHeight) {
        accordionContent.style.maxHeight = `${accordionContent.scrollHeight + 1}px`;
      }
    });
}


function selectHighlightDifferences() {
  differencesButton.classList.add("selected");
  similarities?.forEach(similarity => similarity.classList.add("display-none"));

  //expand all accordions and remove categories with no content
  specFeatureAccordionTitles?.forEach(
    accordionTitle => {
      accordionTitle.classList.add("active");
      let accordionContent = accordionTitle.nextElementSibling;
      if (accordionContent.scrollHeight == 0) {
        accordionTitle.classList.add("display-none");
      }
      else {
        accordionContent.style.maxHeight = `${accordionContent.scrollHeight + 1}px`;
      }
    });
}

function deSelectHighlightDifferences() {
  differencesButton.classList.remove("selected");
  similarities?.forEach(similarity => similarity.classList.remove("display-none"));

  // collapse all accordions and remove display-none from hidden categories
  specFeatureAccordionTitles?.forEach(
    accordionTitle => {
      accordionTitle.classList.remove("active");
      accordionTitle.classList.remove("display-none");
      let accordionContent = accordionTitle.nextElementSibling;
      accordionContent.style.maxHeight = null;
    });
}
