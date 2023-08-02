var currentImperfectionImage,
  currentImperfectionImageIndex,
  imperfectionHeading,
  imperfectionRemarks,
  swiperBody,
  swiperXDown = null,
  swiperYDown = null;

$(document).ready(function () {
  setSelectors();
  imperfectionSwiper.on("click", "#leftArrow", swipeLeftAction);
  imperfectionSwiper.on("touchstart", "#swiperBody", handleTouchStart);
  imperfectionSwiper.on("click", "#rightArrow", swipeRightAction);
  imperfectionSwiper.on("touchmove", "#swiperBody", handleTouchMove);
});

function setSelectors() {
  imperfectionSwiper = $("#imperfectionSwiper");
  currentImperfectionImage = $("#imperfectionCurrentImage");
  imperfectionHeading = $("#imperfectionHeading");
  imperfectionRemarks = $("#imperfectionRemarks");
  currentImperfectionImageIndex = $("#imperfectionImageIndex");
  swiperBody = $("#swiperBody");
}

function getTouches(event) {
  return event.touches || event.originalEvent.touches;
}

function handleTouchStart(event) {
  const firstTouch = getTouches(event)[0];
  swiperXDown = firstTouch.clientX;
  swiperYDown = firstTouch.clientY;
}

function handleTouchMove(event) {
  if (!swiperXDown || !swiperYDown) {
    return;
  }

  var swiperXUp = event.touches[0].clientX;
  var swiperYUp = event.touches[0].clientY;

  var swiperXDiff = swiperXDown - swiperXUp;
  var swiperYDiff = swiperYDown - swiperYUp;

  if (Math.abs(swiperXDiff) > Math.abs(swiperYDiff)) {
    if (swiperXDiff > 0) {
      swipeRightAction();
    } else {
      swipeLeftAction();
    }
  }
  swiperXDown = null;
  swiperYDown = null;
}

function swipeRightAction() {
  var currentData = getNextImageIndexAndImperfectionArea();
  setImperfectionData(currentData);
}

function swipeLeftAction() {
  var currentData = getPreviousImageIndexAndImperfectionArea();
  setImperfectionData(currentData);
}

function setImperfectionData(currentData) {
  var currentImageIndex = currentData[0];
  var currentImperfectionArea = currentData[1];
  analytics.trackAction(
    "CWInteractive",
    "UsedCarDetails",
    "DentMapDetails",
    "DentImagesScrolled"
  );
  setSwiperData(currentImperfectionArea, currentImageIndex);
  highlightPoint(currentImperfectionArea);
}

function setSwiperData(key = "", index = 0) {
  if (
    globalImperfectionData[key] &&
    globalImperfectionData[key].imperfectionDetails &&
    globalImperfectionData[key].imperfectionDetails[index] &&
    globalImperfectionData[key].imperfectionDetails[index].imageLink
  ) {
    currentImperfectionImage.attr(
      "src",
      globalImperfectionData[key].imperfectionDetails[index].imageLink
    );
    currentImperfectionImage.attr("data-image-index", index);
    currentImperfectionImage.attr("data-imperfection-area", key.toString());
    var heading =
      globalImperfectionData[key].imperfectionDetails[index].heading;
    currentImperfectionImage.attr("alt", heading);
    currentImperfectionImage.attr("title", heading);
    currentImperfectionImage.attr("data-imperfection-area", key);
    currentImperfectionImageIndex.html(
      (globalImperfectionData[key].startImageIndex + index + 1).toString()
    );
    imperfectionHeading.html(heading);
    imperfectionRemarks.html(
      globalImperfectionData[key].imperfectionDetails[index].remarks
    );
  }
}

function getNextImageIndexAndImperfectionArea() {
  var currentImageIndex = parseInt(
    currentImperfectionImage.attr("data-image-index")
  );
  var currentImperfectionArea = currentImperfectionImage.attr(
    "data-imperfection-area"
  );
  if (
    globalImperfectionData &&
    globalImperfectionData[currentImperfectionArea] &&
    globalImperfectionData[currentImperfectionArea].imperfectionDetails &&
    currentImageIndex <
      globalImperfectionData[currentImperfectionArea].imperfectionDetails
        .length -
        1
  ) {
    return [currentImageIndex + 1, currentImperfectionArea];
  } else {
    let nextImperfectionPoint =
      globalImperfectionData[currentImperfectionArea].nextImperfectionPoint;
    return [0, nextImperfectionPoint];
  }
}

function getPreviousImageIndexAndImperfectionArea() {
  var currentImageIndex = parseInt(
    currentImperfectionImage.attr("data-image-index")
  );
  var currentImperfectionArea = currentImperfectionImage.attr(
    "data-imperfection-area"
  );
  if (
    globalImperfectionData &&
    globalImperfectionData[currentImperfectionArea] &&
    globalImperfectionData[currentImperfectionArea].imperfectionDetails &&
    currentImageIndex > 0
  ) {
    return [currentImageIndex - 1, currentImperfectionArea];
  } else {
    let previousImperfectionPoint =
      globalImperfectionData[currentImperfectionArea].previousImperfectionPoint;
    return [
      globalImperfectionData[previousImperfectionPoint].imperfectionDetails
        .length - 1,
      previousImperfectionPoint,
    ];
  }
}
