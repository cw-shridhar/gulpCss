const fullScreenCarousel = document.querySelector(".full-sreen-carousel");
const fullScreenCarouselWrapper = document.querySelector(".full-screen-carousel-wrapper");
const imageCarousel = document.querySelector(".model-img-carousel-wrapper");
const nextElementToCarousel = imageCarousel.nextElementSibling;
const swiperContainer = document.querySelector(".js-swiper-container-image");
const allImageSlides = document.querySelectorAll(".js-carousel-slide-image");
let lastClickedImage;
let isFullScreenCarouselOpen = false;
let isDoubleClick = false;
const offsetHeight = swiperContainer.offsetHeight;
swiperContainer.style.height = offsetHeight + "px";
swiperContainer.classList.add("animate-height");

const closeFullScreenCarousel = () =>  {
    nextElementToCarousel.parentElement.insertBefore(imageCarousel, nextElementToCarousel);
    fullScreenCarousel.classList.add("display-none");
    document.body.style.overflow = "scroll";
    imageCarousel.classList.remove("center-carousel");
    isFullScreenCarouselOpen = false;
    if (lastClickedImage) {
        lastClickedImage.style.inset = "";
    }
    swiperContainer.style.height = offsetHeight + "px";
}

const handleGalleryImageClick = clickEvent => {
    fullScreenCarousel.classList.remove("display-none");
    isFullScreenCarouselOpen = true;
    const imageElement = clickEvent.target;
    const carouselImage = getCarouselImage(imageElement);
    slideToCarouselImage(carouselImage);
    fullScreenCarouselWrapper.appendChild(imageCarousel);
    document.body.style.overflow = "hidden";
    imageCarousel.classList.add("center-carousel");
    if (lastClickedImage) {
        lastClickedImage.style.inset = "";
    }
}

document.querySelectorAll(".swiper-slide").forEach(x => {
    let hasTouchedOnce = false;
    x.addEventListener("click", function(event) {
        if (!isFullScreenCarouselOpen) {
            return;
        }
        if(!hasTouchedOnce) {
            hasTouchedOnce = true;
            setTimeout(function() {hasTouchedOnce = false; }, 300);
        }
        else {
            event.preventDefault();
            const imageElement = event.target;
            if (!isDoubleClick) {
                isDoubleClick = true;
                swiperContainer.style.height = `${0.7 * window.innerHeight}px`;
                if (hasClickedAtBottom(event)) {
                    imageElement.style.inset = "auto";
                    lastClickedImage = imageElement;
                }
            }
            else {
                swiperContainer.style.height = offsetHeight + "px";
                isDoubleClick = false;
                imageElement.style.inset = "";
            }
        }
    });
});

document.querySelectorAll(".swiper-slide").forEach(x => {
    x.addEventListener("touchmove", touchMoveEvent => {
        if (isFullScreenCarouselOpen) {
            const image = touchMoveEvent.target;
            const imageZoomedInHeight = image.getBoundingClientRect().height;
            if (imageZoomedInHeight !== image.height) {
                isDoubleClick = true;
                swiperContainer.style.height = `${0.7 * Math.min(imageZoomedInHeight, window.innerHeight)}px`;
            }
        }
    });
});

const hasClickedAtBottom = imageClickEvent => {
    const distanceFromImageTop = imageClickEvent.clientY - imageClickEvent.target.getBoundingClientRect().top;
    const imageHeight = imageClickEvent.target.getBoundingClientRect().height;
    return distanceFromImageTop >= imageHeight * 0.6;
}

const slideToCarouselImage =  carouselImage => {
    const imageWrapper = carouselImage.parentElement.parentElement;
    const index = parseInt(imageWrapper.dataset.slideId);
    imageSwiperClone.slideTo(index);
    const imageName = imageWrapper.dataset.imageName;
    imageNameElem.innerHTML = imageName;
    activeImageCount.innerHTML = index + 1;
    imageH1.textContent = carouselImage.dataset.h1;
    const carName = carouselImage.dataset.make + " " + carouselImage.dataset.model;
    imageDescription.textContent = "Check out " + carName + " - " + imageName +
                        ". We have " + (totalImageCount - 1) + " more " + carouselImage.dataset.model + " Image on CarTrade.";
    const newImageUrl = defaultImageUrl + carouselImage.dataset.imageurl;
    window.history.replaceState(null, null, newImageUrl);
    if (lastClickedImage) {
        lastClickedImage.style.inset = "";
    }
}

const getCarouselImage = clickedGalleryImage => {
    const imageId = clickedGalleryImage.dataset.id;
    const carouselImage = Array.from(allImageSlides).find(slide => slide.dataset.id === imageId);
    return  carouselImage;
}

