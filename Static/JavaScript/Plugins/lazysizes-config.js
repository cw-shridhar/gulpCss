(function configureLazySizes() {
    window.lazySizesConfig = window.lazySizesConfig || {};
    window.lazySizesConfig.lazyClass = 'lazy';
    window.lazySizesConfig.srcAttr = 'data-original';
    window.lazySizesConfig.expand = 0;

    // TODO: Remove below implementation and replace swiper's lazy load specific attributes with lazysizes
    // Get images from swiper
    var swiperContainers = document.querySelectorAll('.swiper-container:not(.noSwiper)');
    var swiperLazyImages = [];
    Array.prototype.forEach.call(swiperContainers, function (swiper) {
        var images = swiper.querySelectorAll('img.swiper-lazy');
        swiperLazyImages = swiperLazyImages.concat(Array.prototype.slice.call(images));
    })

    // Configure swiper images' attributes for lazysizes plugin
    swiperLazyImages.forEach(function (image) {
        if (!image.classList.contains('lazy')) {
            image.classList.add('lazy');
            image.classList.remove('swiper-lazy');
            image.setAttribute('data-original', image.getAttribute('data-src'));
            image.removeAttribute('data-src');

            // Add `src` attribute for images with missing `src` attribute
            // (Without `src` attribute lazysizes plugin fails to lazy load images)
            if (image.getAttribute('src') === null) {
                image.setAttribute('src', '');
            }
        }
    });

    // Handle background image lazyloading
    document.addEventListener('lazybeforeunveil', function (event) {
        if (event.target.nodeName === 'DIV' || event.target.nodeName === 'SECTION') {
            var imageURL = event.target.getAttribute('data-original');
            if (imageURL) {
                event.target.style.backgroundImage = 'url(' + imageURL + ')';
            }
        }
    });
})();
