document.addEventListener("DOMContentLoaded", function () {
  if (!globalImperfectionData) {
    return;
  }
  const globalImperfectionDataKeys = Object.keys(globalImperfectionData);
  if (!globalImperfectionDataKeys || globalImperfectionDataKeys.length == 0) {
    return;
  }
  const imperfectionKey = globalImperfectionDataKeys[0];
  if (!imperfectionKey) {
    return;
  }
  highlightPoint(imperfectionKey);
  setSwiperData(imperfectionKey);
});

const disableAllActivePoints = () => {
  let activeHighlightedPoints = document.getElementsByClassName(
    "active-imperfection-area"
  );
  if (activeHighlightedPoints && activeHighlightedPoints.length > 0) {
    activeHighlightedPoints = Array.from(activeHighlightedPoints);
    activeHighlightedPoints.forEach(currentPoint => {
      currentPoint.classList.remove("active-imperfection-area");
      currentPoint.classList.add("inactive-imperfection-area");
    });
  }
};

const highlightPoint = imperfectionArea => {
  if (!imperfectionArea) {
    return;
  }
  disableAllActivePoints();
  const pointToBeHighlighted = document.querySelector(
    '[data-imperfection-area="' + imperfectionArea + '"]'
  );
  if (!pointToBeHighlighted) {
    return;
  }
  pointToBeHighlighted.classList.remove("inactive-imperfection-area");
  pointToBeHighlighted.classList.add("active-imperfection-area");
};

$("#dentMapContainer").click(event => {
  const targetImperfectionArea = event.target.getAttribute(
    "data-imperfection-area"
  );
  if (!targetImperfectionArea) {
    return;
  }
  analytics.trackAction(
    "CWInteractive",
    "UsedCarDetails",
    "DentMapDetails",
    "DentPointClicked"
  );
  highlightPoint(targetImperfectionArea);
  setSwiperData(targetImperfectionArea);
});
