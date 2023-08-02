document.addEventListener("DOMContentLoaded", function () {
    let allColorBoxes = document.querySelectorAll(".js-color-wrap");
    let prevBtn = document.querySelector(".js-colors-swiper__navigation--prev");
    let nextBtn = document.querySelector(".js-colors-swiper__navigation--next");
    let modelColorsContainer = document.querySelector(".js-model-colors-container");
    let colorNameElem = document.querySelector(".js-colors-swiper-color-name");
    let colorNameElemModel = document.querySelector(".js-colors-swiper-color-name--model");
    let activeColorCount = document.querySelector(".js-active-color-count");
    let activeImageDownloadButton = document.querySelector(".js-color-download-icon");
    let colourData = document.getElementById("colour-data");
    let defaultColourUrl = colourData.dataset.coloururl;
    let colourh1 = document.getElementById("colour-heading");
    let colourNameWithLinks = document.getElementById("color-names-with-links");

    let colorsSwiper = new Swiper('.js-colors-carousel', {
        loop: false,
        zoom: true,
        preloadImages: false,
        lazyLoading: true,
        initialSlide: targetImageId,
    });

    colorsSwiper.on('sliderMove', function () {
        colourh1.classList.add("heading-overflow");
    });

    colorsSwiper.on('transitionEnd', function () {
        let activeSlide = colorsSwiper.slides[colorsSwiper.activeIndex];
        let activeImageElem = activeSlide.querySelector(".js-colors-swiper__image");
        activeImageDownloadButton.setAttribute('data-href', activeImageElem.src);
        activeImageDownloadButton.setAttribute('data-filename', activeImageElem.title);
        let activeIndex = activeSlide.getAttribute("data-slide-id");
        let colorName = activeSlide.getAttribute("data-color-name");
        let colourDescription = document.getElementById("colour-description");
        let modelName = activeImageElem.dataset.model;
        let carName = activeImageElem.dataset.make + " " + activeImageElem.dataset.model;

        activeIndex == 0 ? prevBtn.classList.add("hide") : prevBtn.classList.remove("hide");
        activeIndex == allColorBoxes.length - 1 ? nextBtn.classList.add("hide") : nextBtn.classList.remove("hide");

        modelColorsContainer.querySelector(".colors-swiper-active-color").classList.remove("colors-swiper-active-color");
        allColorBoxes[activeIndex].classList.add("colors-swiper-active-color");
        if (colorNameElem) {
            colorNameElem.innerHTML = colorName;
        }
        if (colorNameElemModel) {
            colorNameElemModel.innerHTML = colorName;
        }
        activeColorCount.innerHTML = (parseInt(activeIndex) + 1);

        let newColourUrl = defaultColourUrl + activeImageElem.dataset.imagepath;

        if (isDiscontinuedReplacedModel !== "True") {
            // Update URL
            window.history.replaceState(null, null, newColourUrl);
    
            // Update canonical url
            let canonicalTag = document.querySelector('link[rel="canonical"]');
            if (activeIndex == 0) {
                canonicalTag.href = window.location.origin + defaultColourUrl;
            } else {
                canonicalTag.href = window.location.origin + newColourUrl;
            }
        }

        // Update H1
        if (colourh1) {
            colourh1.textContent = `${carName} ${colorName} Colour`;
        }

        // Update description

        if (colourDescription) {
            let colourNamesStringWithLinks = colourNameWithLinks.dataset.string;
            colourDescription.textContent = `Find the HD image of ${carName} ${colorName}. ${modelName} is available in total ${colourCount} colours in India - `;
            colourDescription.insertAdjacentHTML("beforeend", colourNamesStringWithLinks);
        }

        // Update SEO title
        document.title = carName + " " + colorName + " Image";

        // Update SEO description
        document.getElementsByTagName('meta')["description"].content = `Check HD image of ${carName} in ${colorName} Colour. Check all ${colourCount} different ${carName} Colours - ${colourNamesString}`;
    });

    prevBtn.addEventListener("click", function () {
        colorsSwiper.slidePrev(100);
        colourh1.classList.add("heading-overflow");
    })
    nextBtn.addEventListener("click", function () {
        colorsSwiper.slideNext(100);
        colourh1.classList.add("heading-overflow");
    })

    for (let i = 0; i < allColorBoxes.length; i++) {
        allColorBoxes[i].addEventListener("click", function (e) {
            let id = e.currentTarget.getAttribute("data-color-index");
            colorsSwiper.slideTo(id);
            colourh1.classList.add("heading-overflow");
        })
    }

    // Download image
    if (activeImageDownloadButton) {
        activeImageDownloadButton.addEventListener("click", function () {
            forceDownload(this, "jpg");
        });
    }
});