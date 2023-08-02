document.addEventListener("DOMContentLoaded", function () {
    try {
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            loop: true,
            preloadImages: false,
            lazyLoading: true
        });
    } catch (e) { }
});