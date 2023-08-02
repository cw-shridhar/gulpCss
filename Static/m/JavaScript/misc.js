var scrollLockFunc = (function () {
    function lockScroll() {
        var html_el = $('html'),
			body_el = $('body');

        if (Common.doc.height() > $(window).height()) {
            var scrollTop = (html_el.scrollTop()) ? html_el.scrollTop() : body_el.scrollTop(); // Works for Chrome, Firefox, IE...

            if (scrollTop < 0) {
                scrollTop = 0;
            }
            html_el.addClass('lock-browser-scroll').css('top', -scrollTop);
            if (scrollTop > 40) {
                setTimeout(function () {
                    $('#header').addClass('header-fixed-with-bg');
                }, 10);
            }
        }
        Common.isScrollLocked = true;
    }

    function unlockScroll() {
        var scrollTop = parseInt($('html').css('top'));

        $('html').removeClass('lock-browser-scroll');
        $('html, body').scrollTop(-scrollTop);
        Common.isScrollLocked = false;
    }

    return {
        lockScroll: lockScroll,
        unlockScroll: unlockScroll,
    }
})();

var popUp = (function () {
    function showPopUp() {
        element = $("." + $('#modalPopUp').attr("data-current"));
        $('#modalBg').show();
        $('.modal-box').show();
        (element).appendTo($(".modal-box")).show();
        scrollLockFunc.lockScroll();
    }
    function hidePopUp() {
        element = $("." + $('#modalPopUp').attr("data-current"));
        $('#modalBg').hide();
        $('.modal-box').hide().empty();
        (element).appendTo(".popup-box-container");
        scrollLockFunc.unlockScroll();
    }
    return {
        showPopUp: showPopUp,
        hidePopUp: hidePopUp
    }

})();

var iphoneInputFocus = {
    OnFocus: function () {
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
            $("body").css({ "position": "fixed", "width": "100%" });
        }
    },
    OutFocus: function () {
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
            $("body").css({ "position": "", "width": "" });
        }
    }
};