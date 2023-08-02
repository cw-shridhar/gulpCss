
var Loader = {
	isDesktop: window.innerWidth > 768,
    showOxygenLoaderOnSection: function (div) {
        $('.oxygen-loader').removeClass('hide');
        div.html($('.oxygenLoaderContainer__js').html());
    },

    hideOxygenLoaderFromSection: function (div) {
        $('.oxygen-loader').addClass('hide');
        div.html('');
    },

    showFullPageLoader: function () {
        Loader.isDesktop ? Common.utils.lockPopup() : lockPopup();
        var elements = document.getElementsByClassName('speedometer__container');
        for (var i = 0; i < elements.length; i++) {
            elements[i].className = elements[i].className.replace("hide", "");
        }
    },

    hideFullPageLoader: function () {
        var elements = document.getElementsByClassName('speedometer__container');
        for (var i = 0; i < elements.length; i++) {
            var classNameList = elements[i].className.split(" ");
            if (classNameList.indexOf("hide") === -1) {
                elements[i].className += " hide";
            }
        }
        Loader.isDesktop ? Common.utils.unlockPopup() : unlockPopup();
    },
}
