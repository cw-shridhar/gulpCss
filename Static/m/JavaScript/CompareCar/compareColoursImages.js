(function() {
    const allTabs = document.querySelectorAll(".js-colour-images-tab");
    const colorsImagesData = JSON.parse(colorsData.replace(/(&quot\;)/g, "\""));
    const swiperElements = [];

    const initializeDynamicSwiper = (modelId) => {
        return new Swiper(".js-color-carousel-" + modelId, {
            loop: false,
            zoom: true,
            preloadImages: false,
            lazyLoading: true,
            onSlideChangeEnd: swiper => {
                slideColorBlockSwiper(swiper, modelId);
            },
        });
    }

    const slideColorBlockSwiper = (swiper, modelId) => {
        let activeIndex = swiper.activeIndex;
        let activeSlide = swiper.slides[activeIndex];
        let colorName = activeSlide.getAttribute("data-color-name");
        const { modelColorNameElement, allColorBoxes} = swiperElements[modelId];
        if (modelColorNameElement) {
            modelColorNameElement.innerHTML = colorName;
        }
        allColorBoxes.forEach(box => {
            box.classList.remove("active-color");
        })
        allColorBoxes[activeIndex].classList.add("active-color");
    };

    const navButtonNextHandling = (navButton, swiper) => {
        if (navButton) {
            navButton.addEventListener("click", function () {
                swiper.slideNext(100);
            });
        }
    }

    const navButtonPrevHandling = (navButton, swiper) => {
        if (navButton) {
            navButton.addEventListener("click", function () {
                swiper.slidePrev(100);
            });
        }
    }

    const handleColorBlockClick = (allColorBoxes, modelColorSwiper) => {
        for (let i = 0; i < allColorBoxes.length; i++) {
            allColorBoxes[i].addEventListener("click", function (e) {
                let id = e.currentTarget.getAttribute("data-color-index");
                modelColorSwiper.slideTo(id);
            })
        }
    }

    (function() {
        for(let modelId in colorsImagesData) {
            let modelColorSwiper;
            let modelColorNameElement = document.querySelector(".js-color-name-" + modelId);
            let allColorBoxes = document.querySelectorAll(".js-color-wrap-" + modelId);
            let modelNavPrevBtn = document.querySelector(".js-nav-prev-" + modelId);
            let modelNavNextBtn = document.querySelector(".js-nav-next-" + modelId);
            modelColorSwiper = initializeDynamicSwiper(modelId);
            if(modelColorSwiper.container.length > 0) {
                modelColorSwiper.init();
                navButtonNextHandling(modelNavNextBtn, modelColorSwiper);
                navButtonPrevHandling(modelNavPrevBtn, modelColorSwiper);
                handleColorBlockClick(allColorBoxes, modelColorSwiper);
                const swiperDetails = {
                    modelColorSwiper,
                    modelColorNameElement,
                    allColorBoxes
                }
                swiperElements[modelId] = swiperDetails;
            }
        }
    })();

    allTabs?.forEach(tab => {
        tab.addEventListener("click", () => {
            if (tab.classList.contains("selected-tab")) {
                return;
            }
            removeTabSelection();
            tab.classList.add("selected-tab");
            const firstModelId = tab.dataset.firstModelId;
            const secondModelId = tab.dataset.secondModelId;

            document.querySelectorAll(".color-carousel").forEach(carousel => {
                carousel.classList.add("display-none");
            });

            let firstSwiperElement = swiperElements[firstModelId].modelColorSwiper;
            let secondSwiperElement = swiperElements[secondModelId].modelColorSwiper;
            if(firstSwiperElement) {
                document.querySelector("#colour-image-carousel-" + firstModelId)?.classList.remove("display-none");
                firstSwiperElement.init();
            }
            if(secondSwiperElement) {
                document.querySelector("#colour-image-carousel-" + secondModelId)?.classList.remove("display-none");
                secondSwiperElement.init();
            }

        })
    });

    const removeTabSelection = () => {
        for(const tab of allTabs) {
            tab.classList.remove("selected-tab");
        }
    }
})();
