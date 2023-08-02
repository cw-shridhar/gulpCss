let allColors = JSON.parse(document.getElementById("comparedColorsData").innerHTML);

let isMobile = window.matchMedia("(max-width: 800px)").matches ? true : false;

let fixedColorSwiper, dynamicColorSwiper;
let fixedColorBlockSwiper, dynamicColorBlockSwiper;

let slideToSwiper = function (swiper, className, imgSwiper) {
    if (swiper.clickedIndex >= 0) {
        let clickedSlide = swiper.slides[swiper.clickedIndex];
        let thumbsActiveSlide = document.querySelector("." + className);
        if (thumbsActiveSlide) {
            thumbsActiveSlide.classList.remove(className);
        }
        clickedSlide.classList.add(className);
        imgSwiper.slideTo(swiper.clickedIndex, 500);
    }
};

if (isMobile) {
    dynamicColorBlockSwiper = new Swiper(".js-color-block-dynamic", {
        loop: false,
        slidesPerView: 6,
        spaceBetween: 12,
        onTap: swiper => {
            slideToSwiper(swiper, "dynamic-thumbs-slide-active", dynamicColorSwiper);
        },
    });
}

let fixedColorsList = document.querySelectorAll(".js-color-block-fixed .swiper-slide");
let dynamicColorsList = document.querySelectorAll(".js-color-block-dynamic .swiper-slide");
let fixedColorNameElement = document.querySelector(".js-fixed-color-name");

let dynamicSwiperWrapper = document.querySelector(".js-swiper-wrapper-dynamic");
let dynamicColorNameElement = document.querySelector(".js-dynamic-color-name");
let dynamicModelNameElement = document.querySelector(".js-dynamic-model-name");

// For desktop Card Swiper Nav Button
const fixedCardPrevBtn = document.querySelector(".js-fixed-card-prev");
const fixedCardNextBtn = document.querySelector(".js-fixed-card-next");

let dynamicCardPrevBtn = document.querySelector(".js-dynamic-card-prev");
let dynamicCardNextBtn = document.querySelector(".js-dynamic-card-next");

// For Msite colors Card Swiper nav Button
const fixedNavPrevBtn = document.querySelector(".js-fixed-nav-prev");
const fixedNavNextBtn = document.querySelector(".js-fixed-nav-next");

let dynamicNavPrevBtn = document.querySelector(".js-dynamic-nav-prev");
let dynamicNavNextBtn = document.querySelector(".js-dynamic-nav-next");

let compareColorsWrapper = document.querySelector(".js-compare-colors-wrapper");

function initializeFixedSwiper() {
    fixedColorSwiper = new Swiper(".js-compare-carousel-fixed", {
        loop: false,
        zoom: true,
        preloadImages: false,
        lazyLoading: true,
        onSlideChangeEnd: swiper => {
            slideColorBlockSwiper(swiper, fixedColorBlockSwiper, "fixed-thumbs-slide-active", "js-fixed-color-slide", false);
        },
    });
}
function initializeDynamicSwiper() {
    dynamicColorSwiper = new Swiper(".js-compare-carousel-dynamic", {
        loop: false,
        zoom: true,
        preloadImages: false,
        lazyLoading: true,
        onSlideChangeEnd: swiper => {
            slideColorBlockSwiper(swiper, dynamicColorBlockSwiper, "dynamic-thumbs-slide-active", "js-dynamic-color-slide", true);
        },
    });
}

// Cmp Color Card Click
let compareColorCards = document.querySelectorAll(".js-cmp-model-card");
let prevSelectedColorCard = document.querySelector(".cmp-model-card--selected");
Initiate();
for (let compareColorCard of compareColorCards) {
    compareColorCard.addEventListener("click", function (event) {
        if (!event.target.classList.contains("cmp-model-card--selected")) {
            if (prevSelectedColorCard) {
                prevSelectedColorCard.classList.remove("cmp-model-card--selected");
            }
            compareColorCard.classList.add("cmp-model-card--selected");
            prevSelectedColorCard = compareColorCard;
            getApiColorsData(compareColorCard);
        }
    })
}

// Get Colors for Clicked Card
function getApiColorsData(selectedCard) {
    let selectedCardData = selectedCard.dataset;
    if (allColors[selectedCardData.modelid]) {
        InitiateDynamicSwiperUpdation(allColors[selectedCardData.modelid], selectedCard);
    }
    else {
        $.ajax({
            url: "/api/colours/model-car-images/?modelId=" + selectedCardData.modelid,
            type: "post",
            contentType: "application/json",
            headers: { ServerDomain: "CarWale" },
            success: function (data) {
                let colorsResponse = JSON.parse(data);
                allColors[selectedCardData.modelid] = colorsResponse;
                InitiateDynamicSwiperUpdation(colorsResponse, selectedCard);
            },
            error: function (response) {
                console.log(response);
            },
        });
    }
}
function InitiateDynamicSwiperUpdation(colorsData, selectedCard) {
    let selectedCardData = selectedCard.dataset;
    if (colorsData.length <= 0) {
        selectedCard.lastElementChild.classList.add("visibility-hidden");
        if (compareColorsWrapper) {
            compareColorsWrapper.classList.add("hide");
        }
    }
    else {
        selectedCard.lastElementChild.classList.remove("visibility-hidden");
        if (compareColorsWrapper) {
            compareColorsWrapper.classList.remove("hide");
        }
        updateDynamicSwiper(colorsData, selectedCardData.makename, selectedCardData.modelname, selectedCardData.modelmaskingname, selectedCardData.colourspageurl);
    }
}
//  Update the Color Carousel for New Card
function updateDynamicSwiper(colorsData, makeName, modelName, modelMaskingName, coloursPageUrl) {
    // Main carousel
    let imgSlidesText = "";
    for (let i = 0; i < colorsData.length; i++) {
        colorsData[i].hexCode = Array.isArray(colorsData[i].hexCode) ? colorsData[i].hexCode : colorsData[i].hexCode.split(",");
        imgSlidesText += `
                <div class="swiper-slide" data-color-name="${colorsData[i].name}" data-color-id="${colorsData[i].id}" data-modelName="${modelName}"
                data-coloursPageUrl="${coloursPageUrl}" data-modelMaskingName="${modelMaskingName}" data-slide-id="${i}">
                    <div class="swiper-zoom-container compare-colors-img-wrapper">
                        <img class="compare-colors-img" alt="${makeName} ${modelName} - ${colorsData[i].name}" src="${colorsData[i].imagePath}"
                        title="${makeName} ${modelName} - ${colorsData[i].name}" data-make="${makeName}" data-model="${modelName}" loading="lazy">
                    </div>
                    ${typeof colorsData[i].hexCode == "string" || (Array.isArray(colorsData[i].hexCode) && colorsData[i].hexCode.length === 1)
                ? `<div class="compare-colors-bottom-border" style="background-color: #${colorsData[i].hexCode};"></div>`
                : `<div class="compare-colors-bottom-border" style="width: 50%;background-color: #${colorsData[i].hexCode[0]};border-right: 1000px solid #${colorsData[i].hexCode[1]};"></div>`
            }
                </div> `;
    }
    if (dynamicSwiperWrapper) {
        dynamicSwiperWrapper.innerHTML = imgSlidesText;
    }

    if (dynamicColorNameElement) {
        let pageUrl = coloursPageUrl + getColourPageUrl(modelMaskingName, colorsData[0].name, colorsData[0].id);
        dynamicColorNameElement.innerHTML = `<a href="${pageUrl}" class="compare-color-name-link" title="${modelName} ${colorsData[0].name}">${colorsData[0].name}</a>`;
    }

    if (dynamicModelNameElement) {
        dynamicModelNameElement.innerHTML = modelName;
    }

    let colorBlockSwiperText = "";
    for (let i = 0; i < colorsData.length; i++) {
        colorsData[i].hexCode = Array.isArray(colorsData[i].hexCode) ? colorsData[i].hexCode : colorsData[i].hexCode.split(",");
        colorBlockSwiperText += `
            <div class="swiper-slide js-dynamic-color-slide ${i == 0 ? "dynamic-thumbs-slide-active" : ""}">
                <div class="color-block" title="${makeName} ${modelName} - ${colorsData[i].name}">
                ${typeof (colorsData[i].hexCode) == 'string' || (Array.isArray(colorsData[i].hexCode) && colorsData[i].hexCode.length === 1)
                ? `<div style="background-color: #${colorsData[i].hexCode}; height: 100%;"></div>`
                : `<div style="background-color: #${colorsData[i].hexCode[0]}; height: 50%;"></div><div style="background-color: #${colorsData[i].hexCode[1]}; height: 50%;"></div>`
            }
                </div>
            </div> `;
    }


    // Color block carousel
    let dynamicColorSwiperWrapper = document.querySelector(".js-color-block-swiper-dynamic");
    if (dynamicColorSwiperWrapper) {
        dynamicColorSwiperWrapper.innerHTML = colorBlockSwiperText;
        dynamicColorsList = document.querySelectorAll(".js-color-block-dynamic .swiper-slide");
    }


    dynamicColorSwiper.init();
    initializeDynamicSwiper();
    if (isMobile) {
        dynamicColorSwiper.init();
        navButtonHandling(dynamicNavPrevBtn, dynamicNavNextBtn, dynamicColorBlockSwiper);
        dynamicColorSwiper.init();
        dynamicColorBlockSwiper.init();
    }
    else if (dynamicColorsList && !isMobile) {
        dynamicColorSwiper.init();
        navHandleForColorCards(dynamicColorsList, dynamicColorSwiper, "dynamic-thumbs-slide-active", dynamicCardPrevBtn, dynamicCardNextBtn);
        dynamicColorSwiper.init();
        dynamicCardPrevBtn.classList.add("display-none");
        dynamicCardNextBtn.classList.remove("display-none");
        navButtonHandling(dynamicCardPrevBtn, dynamicCardNextBtn, dynamicColorSwiper);
    }
}

function Initiate() {
    initializeDynamicSwiper();
    if (isMobile) {
        dynamicColorSwiper.init();
        navButtonHandling(dynamicNavPrevBtn, dynamicNavNextBtn, dynamicColorBlockSwiper);
        dynamicColorSwiper.init();
        dynamicColorBlockSwiper.init();
    }
    else if (dynamicColorsList && !isMobile) {
        dynamicColorSwiper.init();
        navHandleForColorCards(dynamicColorsList, dynamicColorSwiper, "dynamic-thumbs-slide-active", dynamicCardPrevBtn, dynamicCardNextBtn);
        dynamicColorSwiper.init();
        navButtonHandling(dynamicCardPrevBtn, dynamicCardNextBtn, dynamicColorSwiper);
    }
}

// Handle Color's block When Model Color Change
let slideColorBlockSwiper = function (swiper, colorBlockSwiper, className, slideClass, isDynamic) {
    let activeSlide = swiper.slides[swiper.activeIndex];
    let colorName = activeSlide.getAttribute("data-color-name");
    let colorId = activeSlide.getAttribute("data-color-id");
    let coloursPageUrl = activeSlide.getAttribute("data-coloursPageUrl");
    let modelName = activeSlide.getAttribute("data-modelName");
    let modelMaskingName = activeSlide.getAttribute("data-modelMaskingName");
    let thumbsActiveSlide = document.querySelector("." + className);
    let thumbsAllSlidesFixed = document.querySelectorAll("." + slideClass);
    if (!isDynamic && fixedColorNameElement) {
        fixedColorNameElement.innerHTML = colorName;
    }
    if (isDynamic && dynamicColorNameElement) {
        let pageUrl = coloursPageUrl + getColourPageUrl(modelMaskingName, colorName, colorId);
        dynamicColorNameElement.innerHTML = `<a href="${pageUrl}" class="compare-color-name-link" title="${modelName} ${colorName}">${colorName}</a>`;
    }
    if (isMobile) {
        colorBlockSwiper.slideTo(swiper.activeIndex);
    }
    if (thumbsActiveSlide) {
        thumbsActiveSlide.classList.remove(className);
    }
    thumbsAllSlidesFixed[swiper.activeIndex].classList.add(className);
    if(!isMobile)
    {
        if(isDynamic)
        {
            navDisableHandling(dynamicCardPrevBtn, dynamicCardNextBtn, swiper);
        }
        else
        {
            navDisableHandling(fixedCardPrevBtn, fixedCardNextBtn, swiper);
        }
    }
};

// Navigation handle of Colors Card List ( Desktop Only )
function navHandleForColorCards(colorsList, imgSwiper, className, navPrevButton, navNextButton) {
    for (let index = 0; index < colorsList.length; index++) {
        colorsList[index].addEventListener("click", function (e) {
            let thumbsActiveSlide = document.querySelector("." + className);
            if (thumbsActiveSlide) {
                thumbsActiveSlide.classList.remove(className);
            }
            colorsList[index].classList.add(className);
            imgSwiper.slideTo(index, 500);
            index === 0 ? navPrevButton.classList.add("display-none") : navPrevButton.classList.remove("display-none");
            index === colorsList.length - 1 ? navNextButton.classList.add("display-none") : navNextButton.classList.remove("display-none");
        });
    }
}

initializeDynamicSwiper();
initializeFixedSwiper();
if (!isMobile) {
    fixedColorSwiper.init();
    navHandleForColorCards(fixedColorsList, fixedColorSwiper, "fixed-thumbs-slide-active", fixedCardPrevBtn, fixedCardNextBtn);
    fixedColorSwiper.init();

    dynamicColorSwiper.init();
    navHandleForColorCards(dynamicColorsList, dynamicColorSwiper, "dynamic-thumbs-slide-active", dynamicCardPrevBtn, dynamicCardNextBtn);
    dynamicColorSwiper.init();
}

function getColourPageUrl(modelMaskingName, colorName, colorId) {
    let imageTag = colorName.toLowerCase().replace(/\s/g, "-");
    return modelMaskingName + "-" + imageTag + "-" + colorId + "/";
}

function navButtonHandling(navPrevButton, navNextButton, swiper) {
    if(navPrevButton) {
        navPrevButton.addEventListener("click", function () {
            swiper.slidePrev(100);
            if(!isMobile) {
                navDisableHandling(navPrevButton, navNextButton, swiper);
            }
        });
    }
    if (navNextButton) {
        navNextButton.addEventListener("click", function () {
            swiper.slideNext(100);
            if(!isMobile) {
                navDisableHandling(navPrevButton, navNextButton, swiper);
            }
        });
    }
}

function navDisableHandling(navPrevButton, navNextButton, swiper) {
    if (swiper.isBeginning) {
        navPrevButton.classList.add("display-none");
    }
    else {
        navPrevButton.classList.remove("display-none");
    }
    if (swiper.isEnd) {
        navNextButton.classList.add("display-none");
    }
    else {
        navNextButton.classList.remove("display-none");
    }
}

if (isMobile) {
    // Fixed colors list swiper
    fixedColorBlockSwiper = new Swiper(".js-color-block-fixed", {
        loop: false,
        slidesPerView: 6,
        spaceBetween: 12,
        onTap: swiper => {
            slideToSwiper(swiper, "fixed-thumbs-slide-active", fixedColorSwiper);
        },
    });
    navButtonHandling(fixedNavPrevBtn, fixedNavNextBtn, fixedColorBlockSwiper);

} else {
    let scrollableCardPrevBtn = document.querySelector(".js-cmp-model-nav-prev");
    let scrollableCardNextBtn = document.querySelector(".js-cmp-model-nav--next");

    // colors All Card Swiper
    let colorCardSwiper = new Swiper(".js-cmp-model-img__wrapper", {
        loop: false,
        slidesPerView: 3,
        spaceBetween: 16,
    });
    navButtonHandling(scrollableCardPrevBtn, scrollableCardNextBtn, colorCardSwiper);
    navButtonHandling(fixedCardPrevBtn, fixedCardNextBtn, fixedColorSwiper);
}

