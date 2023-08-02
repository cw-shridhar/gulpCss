const ImageTypes = {
    All: 0,
    Interior: 1,
    Exterior: 2
}
let imageSwiperClone;
let imageH1 = document.getElementById("image-heading");
let imageDescription = document.getElementById("image-description");
let imageNameElem = document.querySelector(".js-model-image-name");
let activeImageCount = document.querySelector(".js-active-image-count");
const defaultImageUrl = document.getElementById("image-data")?.dataset.defaultimageurl;
document.addEventListener("DOMContentLoaded", function () {
    let prevBtnImage = document.querySelector(".js-image-carousel-custom-prev");
    let nextBtnImage = document.querySelector(".js-image-carousel-custom-next");
    let activeImageDownloadButtonImage = document.querySelector(".js-download-icon-wrapper");
    let totalImagesCount = document.querySelectorAll(".js-carousel-slide-image");
    let thumbsPrevBtn = document.querySelector(".js-model-img-thumbs-swiper-prev");
    let thumbsNextBtn = document.querySelector(".js-model-img-thumbs-swiper-next");
    let thumbsAllSlides = document.querySelectorAll(".js-model-img-thumbs-swiper-slide");

    if (pageName == "Gallery") {
        if (imageType == ImageTypes.Interior) {
            let li = document.getElementById("interior_tab");
            if (li) {
                li.classList.add("active");
                li.firstChild.classList.add("active");
            }
        }
        else {
            let li = document.getElementById("exterior_tab");
            if (li) {
                li.classList.add("active");
                li.firstChild.classList.add("active");
            }
        }
    }

    let slideOnThumbnailImageClick = function (swiper) {
        if (swiper.clickedIndex >= 0) {
            imageSwiper.slideTo(swiper.clickedIndex, 500);
            let clickedSlide = swiper.slides[swiper.clickedIndex];
            let thumbsActiveSlide = document.querySelector(".model-img-thumbs-slide-active");
            if (thumbsActiveSlide) {
                thumbsActiveSlide.classList.remove("model-img-thumbs-slide-active");
            }
            clickedSlide.classList.add('model-img-thumbs-slide-active')
        }
    };

    let thumbsSwiper = new Swiper('.js-model-img-thumbs-swiper', {
        direction: 'vertical',
        slidesPerColumn: 2,
        spaceBetween: 8,
        slidesPerView: "5",
        onTap: slideOnThumbnailImageClick,
        preloadImages: false,
        lazyLoading: true,
        initialSlide: onLoadTarget,
    });

    let slidethumbsSwiper = function (swiper) {
        if (thumbsSwiper.container?.length > 0) {
            thumbsSwiper.slideTo(parseInt(swiper.activeIndex / 2));
            let thumbsActiveSlide = document.querySelector(".model-img-thumbs-slide-active");
            if (thumbsAllSlides) {
                if (thumbsActiveSlide) {
                    thumbsActiveSlide.classList.remove("model-img-thumbs-slide-active");
                }
                thumbsAllSlides[swiper.activeIndex].classList.add("model-img-thumbs-slide-active");
            }
        }
    };

    let imageSwiper = new Swiper('.js-swiper-container-image', {
        loop: false,
        zoom: true,
        preloadImages: false,
        lazyLoading: true,
        onSlideChangeEnd: slidethumbsSwiper,
        initialSlide: onLoadTarget
    });
    imageSwiperClone = imageSwiper;

    if (imageSwiper.container.length > 0) {
        imageSwiper.on('sliderMove', function () {
            if (imageH1) {
                imageH1.classList.add("heading-overflow");
            }
        });

        imageSwiper.on('transitionEnd', function () {
            if (typeof swiperContainer !== "undefined") {
                isDoubleClick = false;
                swiperContainer.style.height = offsetHeight + "px";
            }
            let activeSlide = imageSwiper.slides[imageSwiper.activeIndex];
            let activeImageElem = activeSlide.querySelector(".js-carousel-slide-image");
            if (activeImageDownloadButtonImage) {
                activeImageDownloadButtonImage.setAttribute('data-href', activeImageElem.src);
                activeImageDownloadButtonImage.setAttribute('data-filename', activeImageElem.title);
            }
            let activeIndex = activeSlide.getAttribute("data-slide-id");
            let imageName = activeSlide.getAttribute("data-image-name");
            if (imageNameElem) {
                imageNameElem.innerHTML = imageName;
            }
            if (activeImageCount) {
                activeImageCount.innerHTML = (parseInt(activeIndex) + 1);
            }

            if (prevBtnImage) {
                hideShowPrevButton(activeIndex, prevBtnImage)
            }

            if (totalImagesCount && nextBtnImage) {
                activeIndex == totalImagesCount.length - 1 ? nextBtnImage.classList.add("hide") : nextBtnImage.classList.remove("hide");
            }

            if (pageName == "Gallery") {
                let prevSlide = imageSwiper.slides[imageSwiper.activeIndex - 1];
                let nextSlide = imageSwiper.slides[imageSwiper.activeIndex + 1];
                let carName = activeImageElem.dataset.make + " " + activeImageElem.dataset.model;

                $("#image-prev-button")[0].href = "#";
                $("#image-next-button")[0].href = "#";
                if (prevSlide) {
                    $("#image-prev-button")[0].href = defaultImageUrl + prevSlide.querySelector(".js-carousel-slide-image").dataset.imageurl;
                }
                if (nextSlide) {
                    $("#image-next-button")[0].href = defaultImageUrl + nextSlide.querySelector(".js-carousel-slide-image").dataset.imageurl;
                }
                let newImageUrl = defaultImageUrl + activeImageElem.dataset.imageurl;

                if (isDiscontinuedReplacedModel !== "True") {
                    // Update URL
                    window.history.replaceState(null, null, newImageUrl);

                    // Update canonical url
                    let canonicalTag = document.querySelector('link[rel="canonical"]');
                    if (activeIndex == 0) {
                        canonicalTag.href = window.location.origin + defaultImageUrl;
                    } else {
                        canonicalTag.href = window.location.origin + newImageUrl;
                    }
                }

                // Update H1
                if (imageH1) {
                    imageH1.textContent = activeImageElem.dataset.h1;
                }

                //Update meta title
                document.title = `${carName} - ${imageName} | ${carName} Images`;

                //Update meta description
                document.getElementsByTagName('meta')["description"].content = "Check " + carName + " - " + imageName +
                    " Image. Explore all " + totalImageCount + " HD images of " + carName + ".";

                //Update seo description
                if (imageDescription) {
                    imageDescription.textContent = "Check out " + carName + " - " + imageName +
                        ". We have " + (totalImageCount - 1) + " more " + activeImageElem.dataset.model + " Image on CarTrade.";
                }
                let readMoreBtn = document.getElementById("image-read-more");
                if (imageDescription && imageDescription.textContent.length <= 100 && readMoreBtn) {
                    readMoreBtn.style.display = "none";
                }
            }
        });
    }

    if (thumbsSwiper.container?.length > 0) {
        thumbsSwiper.on('transitionEnd', function () {
            if (thumbsPrevBtn) {
                hideShowPrevButton(thumbsSwiper.activeIndex, thumbsPrevBtn);
            }
            if (thumbsAllSlides && thumbsNextBtn) {
                thumbsAllSlides.length < 10 || thumbsSwiper.activeIndex === Math.ceil(((thumbsAllSlides.length) / 2) - 5) ? thumbsNextBtn.classList.add("hide") : thumbsNextBtn.classList.remove("hide");
            }
        });
    }

    if (prevBtnImage) {
        prevBtnImage.addEventListener("click", function () {
            if (typeof swiperContainer !== "undefined") {
                isDoubleClick = false;
                swiperContainer.style.height = offsetHeight + "px";
            }
            imageSwiper.slidePrev(100);
            if (imageH1) {
                imageH1.classList.add("heading-overflow");
            }
        });
    }

    if (nextBtnImage) {
        nextBtnImage.addEventListener("click", function () {
            if (typeof swiperContainer !== "undefined") {
                isDoubleClick = false;
                swiperContainer.style.height = offsetHeight + "px";
            }
            imageSwiper.slideNext(100);
            if (imageH1) {
                imageH1.classList.add("heading-overflow");
            }
        });
    }

    if (thumbsPrevBtn) {
        thumbsPrevBtn.addEventListener("click", function () {
            thumbsSwiper.slidePrev(100);
        })
    }
    if (thumbsNextBtn) {
        thumbsNextBtn.addEventListener("click", function () {
            thumbsSwiper.slideNext(100);
        })
    }

    $("#image-prev-button").on("click", function () {
        event.preventDefault();
    });
    $("#image-next-button").on("click", function () {
        event.preventDefault();
    });

    if (activeImageDownloadButtonImage) {
        activeImageDownloadButtonImage.addEventListener("click", function () {
            forceDownload(this, "jpg");
        });
    }
})

function hideShowPrevButton(activeIndex, prevBtn) {
    activeIndex === 0 ? prevBtn.classList.add("hide") : prevBtn.classList.remove("hide");
}
