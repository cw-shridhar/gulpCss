let isMobile = window.matchMedia("(max-width: 800px)").matches ? true : false;
let accordions = document.querySelectorAll(".js-cmp-cars-images-accordion");
let exteriorAccordian = document.querySelector(".js-cmp-cars-images-accordion.exterior-img-acc");
let interiorAccordian = document.querySelector(".js-cmp-cars-images-accordion.interior-img-acc");
let accPanels = document.querySelectorAll(".js-car-acc-panel");
let exteriorAccPanel = document.querySelector(".js-exterior-acc-panel");
let interiorAccPanel = document.querySelector(".js-interior-acc-panel");
let similarCarCards = document.querySelectorAll(".js-cmp-model-card");
let similarCarTabs = document.querySelectorAll(".similar-model-tab");
let prevSelectedCarCard = document.querySelector(".cmp-model-card--selected");
let prevSelectedCarTab = document.querySelector(".selected-tab");
let IsExteriorSectionPresent = 1;
let IsInteriorSectionPresent = 1;
let IsExteriorPage = parseInt(document.getElementById("pagename").dataset.isexteriorpage);
const tagNames = ["Front Left View", "Left View", "Rear Left View", "Rear View",
    "Front View", "DashBoard", "Infotainment Display", "Dashbaord Display",
    "AC Controls", "Rear Passenger Seats"];

let modelImagesJson = {};
baseModelImages = JSON.parse(baseModelImages.replace(/(&quot\;)/g, "\""));
modelImagesJson[similarCarCards && similarCarCards[0].getAttribute("data-modelId")] = JSON.parse(firstSimilarCarImages.replace(/(&quot\;)/g, "\""));

if (isDiscontinuedReplacedModel === "True") {
    updateImages(modelImagesJson[similarCarCards[0].getAttribute("data-modelId")], similarCarCards[0].getAttribute("data-modelname"), similarCarCards[0].getAttribute("data-exteriorimagespageurl"), similarCarCards[0].getAttribute("data-interiorimagespageurl"), true);
}

// No baseModelImages - remove all compare radio buttons
if (Object.keys(baseModelImages).length === 0) {
    similarCarCards.forEach(e => {
        e.querySelector(".cmp-model-card-selection")?.remove();
    });
}

// No images in exterior section on server load
if (exteriorAccPanel && exteriorAccPanel.childElementCount == 0) {
    exteriorAccordian.style.display = "none";
    IsExteriorSectionPresent = 0;
}
//No images in interior section on server load
if (interiorAccPanel && interiorAccPanel.childElementCount == 0) {
    interiorAccordian.style.display = "none";
    IsInteriorSectionPresent = 0;
}

//No First Similar Car images - remove it's compare radio button
if (!IsExteriorSectionPresent && !IsInteriorSectionPresent && similarCarCards[0].querySelector(".cmp-model-card-selection")) {
    similarCarCards[0].querySelector(".cmp-model-card-selection").classList.add("visibility-hidden");
}

function handleAccordion(acc, isModelClicked, isPageView) {
    isModelClicked
        ?
        acc.classList.add("active-image-type") :
        acc.classList.toggle("active-image-type");
    let panel = acc.nextElementSibling;
    if (!panel.classList.contains("display-none") && !isModelClicked) {
        panel.classList.add("display-none");
    } else {
        hidePanels(acc);
        if (!isPageView) {
            let elementToScroll = acc;
            elementToScroll && $('html,body').animate({ scrollTop: $(elementToScroll).offset().top - 50 }, "fast");
        }
        panel.classList.remove("display-none");
    }
};

if(isDiscontinuedReplacedModel !== "True") {
    if (IsExteriorPage && IsExteriorSectionPresent) {
        handleAccordion(
            exteriorAccordian,
            false, true
        );
    }
    
    if (!IsExteriorPage && IsInteriorSectionPresent) {
        handleAccordion(
            interiorAccordian,
            false, true
        );
    }
}

if (isMobile) {
    similarCarTabs.forEach(similarCarCard => {
        let modelId = similarCarCard.getAttribute("data-modelId");
        let modelName = similarCarCard.getAttribute("data-modelname");
        let exteriorImagesPageUrl = similarCarCard.getAttribute("data-exteriorImagesPageUrl");
        let interiorImagesPageUrl = similarCarCard.getAttribute("data-interiorImagesPageUrl");
        similarCarCard.addEventListener("click", function (event) {
            if (prevSelectedCarTab != similarCarCard) {
                console.log(modelId, modelName, exteriorImagesPageUrl, interiorImagesPageUrl);
                if (prevSelectedCarTab) {
                    prevSelectedCarTab.classList.remove("selected-tab");
                }
                similarCarCard.classList.add("selected-tab");
                prevSelectedCarTab = similarCarCard;

                if (Object.keys(baseModelImages).length > 0) {
                    if (modelId in modelImagesJson) {
                        updateImages(modelImagesJson[modelId], modelName, exteriorImagesPageUrl, interiorImagesPageUrl, false);
                    }
                    else {
                        $.ajax({
                            url: "/api/images/widgetview/?modelId=" + modelId,
                            type: "post",
                            contentType: "application/json",
                            headers: { 'ServerDomain': 'CarWale' },
                            success: function (data) {
                                modelImagesJson[modelId] = JSON.parse(data);
                                updateImages(modelImagesJson[modelId], modelName, exteriorImagesPageUrl, interiorImagesPageUrl, false);
                            },
                            error: function (response) {
                                console.log("Error in fetching model images");
                            },
                        });
                    }
                }
            }
        });
    });
}

else {
    similarCarCards.forEach(similarCarCard => {
        let modelId = similarCarCard.getAttribute("data-modelId");
        let modelName = similarCarCard.getAttribute("data-modelname");
        let exteriorImagesPageUrl = similarCarCard.getAttribute("data-exteriorImagesPageUrl");
        let interiorImagesPageUrl = similarCarCard.getAttribute("data-interiorImagesPageUrl");
        similarCarCard.addEventListener("click", function (event) {
            if (prevSelectedCarCard != similarCarCard) {
                if (prevSelectedCarCard) {
                    prevSelectedCarCard.classList.remove("cmp-model-card--selected");
                }
                similarCarCard.classList.add("cmp-model-card--selected");
                prevSelectedCarCard = similarCarCard;
                if (Object.keys(baseModelImages).length > 0) {
                    if (modelId in modelImagesJson) {
                        updateImages(modelImagesJson[modelId], modelName, exteriorImagesPageUrl, interiorImagesPageUrl, false);
                    }
                    else {
                        $.ajax({
                            url: "/api/images/widgetview/?modelId=" + modelId,
                            type: "post",
                            contentType: "application/json",
                            headers: { 'ServerDomain': 'CarWale' },
                            success: function (data) {
                                modelImagesJson[modelId] = JSON.parse(data);
                                updateImages(modelImagesJson[modelId], modelName, exteriorImagesPageUrl, interiorImagesPageUrl, false);
                            },
                            error: function (response) {
                                console.log("Error in fetching model images");
                            },
                        });
                    }
                }
            }
        });
    });
}

function updateImages(comparedModelImages, modelName, exteriorImagesPageUrl, interiorImagesPageUrl, isPageView) {

    if (Object.keys(comparedModelImages).length === 0) {
        if (isMobile) {
            document.querySelector(".selected-tab").classList.add("display-none");
        }
        else {
            if (document.querySelector(".cmp-model-card--selected").querySelector(".cmp-model-card-selection")) {
                document.querySelector(".cmp-model-card--selected").querySelector(".cmp-model-card-selection").classList.add("visibility-hidden");
            }
        }
        exteriorAccordian.style.display = "none";
        exteriorAccPanel.classList.add("display-none");
        interiorAccordian.style.display = "none";
        interiorAccPanel.classList.add("display-none");
        return;
    }

    $(".js-exterior-acc-panel").empty();
    $(".js-interior-acc-panel").empty();

    let htmlText = '';
    for (let i = 0; i < tagNames.length && i < 5; i++) {
        const tagName = tagNames[i];
        const baseModelImage = baseModelImages[tagName];
        const comparedModelImage = comparedModelImages[tagName];
        if (baseModelImage == null || comparedModelImage == null) {
            continue;
        }

        htmlText +=
            `<h5 class="image-type-heading"><a title="${modelName} ${tagName}" class="image-type-heading" href="${exteriorImagesPageUrl}${comparedModelImage["name"]}">${modelName} ${tagName}</a> vs ${baseModelName}
            </h5>
            <div class="compare-cars">
                <img class="cmp-car-image" loading="lazy"
                src="${comparedModelImage["path"]}" title="${modelName} ${comparedModelImage["altImageName"]}"  alt="${modelName} ${comparedModelImage["altImageName"]}">
                    <span class="img-name-tag">${modelName}</span>
            </div>
            <div class="compare-cars">
                <img class="cmp-car-image" loading="lazy"
                src="${baseModelImage["path"]}" title="${baseModelName} ${baseModelImage["altImageName"]}" alt="${baseModelName} ${baseModelImage["altImageName"]}">
                    <span class="img-name-tag">${baseModelName}</span>
            </div>`
    }
    if (htmlText) {
        htmlText +=
            `<a title="${modelName} Exterior Images" href="${exteriorImagesPageUrl}"><button class="check-all-images-btn">
        Check all ${modelName} Exterior Images
        </button></a>`
        exteriorAccordian.innerHTML = `${modelName} vs ${baseModelName} Exterior Images
        <i class="cmp-car-acc-arrow-icon"></i>`;
        exteriorAccPanel.innerHTML = htmlText;
        exteriorAccordian.style.display = "";
        if (!isPageView && IsExteriorPage) {
            handleAccordion(exteriorAccordian, true, false);
        }
    }
    else {
        exteriorAccordian.style.display = "none";
        exteriorAccPanel.classList.add("display-none");
    }
    htmlText = '';
    for (let i = 5; i < tagNames.length; i++) {
        const tagName = tagNames[i];
        const baseModelImage = baseModelImages[tagName];
        const comparedModelImage = comparedModelImages[tagName];
        if (baseModelImage == null || comparedModelImages[tagName] == null) {
            continue;
        }
        htmlText +=
            `<h5 class="image-type-heading"><a title="${modelName} ${tagName}" class="image-type-heading" href="${exteriorImagesPageUrl}${comparedModelImage["name"]}">${modelName} ${tagName}</a> vs ${baseModelName}
            </h5>
            <div class="compare-cars">
                <img class="cmp-car-image" loading="lazy"
                src="${comparedModelImage["path"]}" title="${modelName} ${comparedModelImage["altImageName"]}" alt="${modelName} ${comparedModelImage["altImageName"]}">
                    <span class="img-name-tag">${modelName}</span>
            </div>
            <div class="compare-cars">
                <img class="cmp-car-image" loading="lazy"
                src="${baseModelImage["path"]}"  title="${baseModelName}  ${baseModelImage["altImageName"]}" alt="${baseModelName}  ${baseModelImage["altImageName"]}">
                    <span class="img-name-tag">${baseModelName}</span>
            </div>`;
    }
    if (htmlText) {
        htmlText +=
            `<a title="${modelName} Interior Images" href="${interiorImagesPageUrl}"><button class="check-all-images-btn">
        Check all ${modelName} Interior Images
        </button></a>`
        interiorAccordian.innerHTML = `${modelName} vs ${baseModelName} Interior Images
        <i class="cmp-car-acc-arrow-icon"></i>`;
        interiorAccPanel.innerHTML = htmlText;
        interiorAccordian.style.display = "";
        if (!isPageView && !IsExteriorPage) {
            handleAccordion(interiorAccordian, true, false);
        }
    }
    else {
        interiorAccordian.style.display = "none";
        interiorAccPanel.classList.add("display-none");
    }
};

for (let i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener(
        "click",
        () => handleAccordion(accordions[i]),
        false, false
    );
}

// Function to Hide all shown Panels
function hidePanels(clickedPanel) {
    for (let i = 0; i < accordions.length; i++) {
        if (clickedPanel !== accordions[i]) {
            accPanels[i].classList.add("display-none");
            accordions[i].classList.remove("active-image-type");
        }
    }
}

if (!isMobile) {
    let scrollableCardPrevBtn = document.querySelector(".js-cmp-model-nav--prev");
    let scrollableCardNextBtn = document.querySelector(".js-cmp-model-nav--next");

    let similarCarCardSwiper = new Swiper(".js-cmp-model-img__wrapper", {
        loop: false,
        slidesPerView: 3,
        spaceBetween: 16,
    });

    if (scrollableCardPrevBtn) {
        scrollableCardPrevBtn.addEventListener("click", function () {
            similarCarCardSwiper.slidePrev(100);
            navDisableHandling();
        });
    }
    if (scrollableCardNextBtn) {
        scrollableCardNextBtn.addEventListener("click", function () {
            similarCarCardSwiper.slideNext(100);
            navDisableHandling();
        });
    }

    function navDisableHandling() {
        if (similarCarCardSwiper.isBeginning) {
            scrollableCardPrevBtn.classList.add("display-none");
        }
        else {
            scrollableCardPrevBtn.classList.add("nav-active");
            scrollableCardPrevBtn.classList.remove("display-none");
        }
        if (similarCarCardSwiper.isEnd) {
            scrollableCardNextBtn.classList.add("display-none");
        }
        else {
            scrollableCardNextBtn.classList.remove("display-none");
        }
    }
}
