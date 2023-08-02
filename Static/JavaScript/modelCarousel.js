function changeModelCarouselTab(className) {
    // Update images carousel tabs
    const targetTabClass = `js-model-carousel-tab-${className}`;
    const modelCarouselTabs = document.querySelectorAll(".js-model-carousel-tab");
    modelCarouselTabs.forEach(tab => {
        if(tab.classList.contains(targetTabClass)) {
			tab.classList.add("active");
		} else {
			tab.classList.remove("active");
		}
    });

    // update containers
	const targetContainer = `js-model-carousel-container-${className}`;
    const modelCarouselContainer = document.querySelectorAll(".js-model-carousel-container");
    modelCarouselContainer.forEach(carouselContainer => {
        if (carouselContainer.classList.contains(targetContainer)) {
            carouselContainer.classList.remove("display-none");
        } else {
            carouselContainer.classList.add("display-none");
        }
    });
}

let colourCarousel = document.querySelector(".colour-carousel");
const colourObserver = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting) {
        initializeColourSwiper(colourCarousel, ".js-colors-carousel");
        colourObserver.unobserve(entries[0].target);
    }
});
if(colourCarousel) {
    colourObserver.observe(colourCarousel);
}

function initializeColourSwiper(swiperWrapper, swiperName) {
    let allColorBoxes = swiperWrapper.querySelectorAll(".js-color-wrap");
    let prevBtn = swiperWrapper.querySelector(".js-colors-swiper__navigation--prev");
    let nextBtn = swiperWrapper.querySelector(".js-colors-swiper__navigation--next");
    let modelColorsContainer = swiperWrapper.querySelector(".js-model-colors-container");
    let colorNameElemModel = swiperWrapper.querySelector(".js-colors-swiper-color-name--model");
    let colorsSwiper = new Swiper(swiperName, {
        loop: false,
        zoom: true,
        preloadImages: false,
        lazyLoading: true,
        initialSlide: targetImageId,
    });

    colorsSwiper.on('transitionEnd', function () {
        let activeSlide = colorsSwiper.slides[colorsSwiper.activeIndex];
        let activeIndex = activeSlide.getAttribute("data-slide-id");
        let colorName = activeSlide.getAttribute("data-color-name");
        colorsSwiper.isBeginning ? prevBtn.classList.add("hide") : prevBtn.classList.remove("hide");
        colorsSwiper.isEnd ? nextBtn.classList.add("hide") : nextBtn.classList.remove("hide");

        modelColorsContainer.querySelector(".colors-swiper-active-color")?.classList.remove("colors-swiper-active-color");
        allColorBoxes[activeIndex]?.classList.add("colors-swiper-active-color");
        if (colorNameElemModel) {
            colorNameElemModel.innerHTML = colorName;
        }
    });

    if(prevBtn) {
        prevBtn.addEventListener("click", function () {
            colorsSwiper.slidePrev(100);
        })
    }
    if(nextBtn) {
        nextBtn.addEventListener("click", function () {
            colorsSwiper.slideNext(100);
        })
    }

    for (let i = 0; i < allColorBoxes.length; i++) {
        allColorBoxes[i].addEventListener("click", function (e) {
            let id = e.currentTarget.getAttribute("data-color-index");
            colorsSwiper.slideTo(id);
        })
    }
}

const videosCarousel = document.querySelector(".js-videos-carousel");
if(videosCarousel != null) {
    const videosObserver = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
            let videosSwiper = new Swiper('.js-videos-carousel', {
                loop: false,
            });

            let videosPrevBtn = document.querySelector(".js-videos-swiper__navigation--prev");
            let videosNextBtn = document.querySelector(".js-videos-swiper__navigation--next");

            if(videosPrevBtn) {
                videosPrevBtn.addEventListener("click", function () {
                    videosSwiper.slidePrev(100);
                })
            }
            if(videosNextBtn) {
                videosNextBtn.addEventListener("click", function () {
                    videosSwiper.slideNext(100);
                })
            }
            videosObserver.unobserve(entries[0].target);
        }
    });
    videosObserver.observe(videosCarousel);
}

// let coloursWidgetSwiperWrapper = document.querySelector(".js-colours-widget-swiper-wrapper");
// const coloursWidgetObserver = new IntersectionObserver(entries => {
//     if(entries[0].isIntersecting) {
//         initializeColourSwiper(coloursWidgetSwiperWrapper, ".js-colours-widget-swiper");
//         coloursWidgetObserver.unobserve(entries[0].target);
//     }
// });
// if(coloursWidgetSwiperWrapper) {
//     coloursWidgetObserver.observe(coloursWidgetSwiperWrapper);
// }
