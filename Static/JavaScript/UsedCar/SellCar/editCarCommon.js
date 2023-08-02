//https://stackoverflow.com/questions/6421769/popstate-on-pages-load-in-chrome
(function () {
    if (!window.addEventListener)
        return;
    var blockPopstateEvent = document.readyState != "complete";
    window.addEventListener("load", function () {
        // The timeout ensures that popstate-events will be unblocked right
        // after the load event occured, but not in the same event-loop cycle.
        setTimeout(function () { blockPopstateEvent = false; }, 0);
    }, false);
    window.addEventListener("popstate", function (evt) {
        if (blockPopstateEvent && document.readyState == "complete") {
            evt.preventDefault();
            evt.stopImmediatePropagation();
        }
    }, false);
})();

var editCarCommon = (function () {
    function showModal(htmlString, modalBox) {
        modalBox = modalBox || $('#modalPopUp');
        $('body').addClass('lock-browser-scroll').find('#modalBg').show();  
        modalBox.html(htmlString).show();
        historyObj.addToHistory('showModal');
        scrollLockFunc.lockScroll();
    }
    function  hideModal(modalBox) {
        modalBox = modalBox || $('#modalPopUp');        
        $('body').removeClass('lock-browser-scroll').find('#modalBg').hide();
        modalBox.html('').hide();
        scrollLockFunc.unlockScroll();
    }
    function isVisible(modalBox) {
        modalBox = modalBox || $('#modalPopUp');
        return modalBox.is(':visible');
    }
    function modalPopupTemplate(obj) {
        var template = '';
        template += '<div class="error-popup-template">';
        template += '<span class="modal__close cross-default-15x16"></span>';
        template += '<p class="modal__header">' + obj.heading + '</p>';
        if (obj.description.length > 0) {
            template += '<p class="modal__description">' + obj.description + '</p>';
        }
        if (obj.isNoButtonActive) {
            template += '<a href="' + obj.noButtonLink + '" class="btn btn-white btn-124-36 modal_navigate_away">' + obj.noButtonText + '</a>';
        }
        if (obj.isYesButtonActive) {
            template += '<a href="' + obj.yesButtonLink + '" class="btn btn-orange btn-124-36 modal__close">' + obj.yesButtonText + '</a>';
        }
        template += '</div>';
        return template;
    }
    function showModalJson(json, modalBox) {
        modalBox = modalBox || $('#modalPopUp');
        var parsedJson = JSON.parse(json);
        $('#modalBg').show();
        modalBox.html(modalPopupTemplate(parsedJson)).show();
        historyObj.addToHistory('showModal');
        scrollLockFunc.lockScroll();
    }
    function setLoadingScreen(loader) {
        loader = loader || "#loadingScreen";
        $(loader).show();
    }

    function removeLoadingScreen(loader) {
        loader = loader || "#loadingScreen";
        $(loader).hide();
    }
    return {
        showModal: showModal,
        hideModal: hideModal,
        isVisible: isVisible,
        showModalJson: showModalJson,
        setLoadingScreen: setLoadingScreen,
        removeLoadingScreen: removeLoadingScreen
    }
})();

var historyObj = (function () {
    function addToHistory(currentState, title, url) {
        history.pushState({
            currentState: currentState
        }, title, url);
    }
    function replaceHistory(currentState, title, url) {
        history.replaceState({
            currentState: currentState
        }, title, url)
    }

    return {
        addToHistory: addToHistory,
        replaceHistory: replaceHistory
    }
})();