var EditCarFlow = {
    userSearchType: {
        mobile: 1,
        profileId: 2
    },
    searchValue: '',
    searchType: 0,
    isRedirect: false,
    listingContainer: '',
    
    editSellcarDocReady: function () {
        EditCarFlow.replaceHistoryState();
        EditCarFlow.setSelectors();
        EditCarFlow.registerEvents();
        EditCarFlow.initData();
        editCarTracking.trackForMobile(editCarTracking.actionType.searchPageLoad, "SearchPageLoad");
    },

    replaceHistoryState: function() {
        var queryParams = location.search.substring(1);
        if(queryParams)
        {
            var queryStringObj = JSON.parse('{"' + decodeURI(queryParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
            var str = [];
            for(var key in queryStringObj){
                if(key!=="authtoken"){
                    str.push(encodeURIComponent(key) + "=" + encodeURIComponent(queryStringObj[key]));
                }
            }
            var otpPageUrl = str.join("&");
            history.replaceState(null, null, "?"+otpPageUrl);
        }
    },

    initData: function(){
        var searchValueElement = document.getElementById('searchValue');
        var searchTypeElement = document.getElementById('searchType');
        EditCarFlow.isRedirect = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("isredirect").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1")) === "true";
        EditCarFlow.searchValue = searchValueElement ? searchValueElement.dataset.value || '' : '';
        EditCarFlow.searchType = searchTypeElement ? Number(searchTypeElement.dataset.value) || 0 : 0;
        if (EditCarFlow.isRedirect) {
            if (secTimer.interval != undefined) {
                clearInterval(secTimer.interval);
            }
            secTimer.counterOn(30);
        }
    },

    //Variables declared for selectors
    setSelectors: function () {
        EditCarFlow.MobSearch = '#MobSearch';
        EditCarFlow.ProIdSearch = '#ProIdSearch';
        EditCarFlow.submitEditSearch = '#submitEditSearch';
        EditCarFlow.submitEditSearchForm = '#submit-edit-search-form';
        EditCarFlow.resendText = '.resend-text';
        EditCarFlow.counterText = '.counter-text';
        EditCarFlow.reqOtp = '#req-otp';
        EditCarFlow.getOtp = '.get-otp';
        EditCarFlow.searchResult = '.searchresult';
        EditCarFlow.popUp = '.popup-container';
        EditCarFlow.container = '.container';
        EditCarFlow.editSearchForm = '.edit-search-form';
        EditCarFlow.listingContainer = '.sellcar-edit-list-container';
    },

    //All events for the selectors
    registerEvents: function () {
        $(document).on("submit", EditCarFlow.submitEditSearchForm, function (e) {
            EditCarFlow.submitEditSearchfunc(e);
        });
        $(".tabHr.tran-ease-out-all").hide();
        $("#loading").hide();
        EditCarFlow.AddOrRemoveDoneClass();
        $(document).on('click', '.button-tab li', function () {
            $(EditCarFlow.MobSearch).focus();
            $(EditCarFlow.ProIdSearch).focus();
        });

        $(document).on("click", EditCarFlow.resendText, function () {
            if(!$('.timeBox').hasClass('active'))                
             EditCarFlow.onResendTextClick();
        
        });

        $(document).on("submit", "#verify-otp-submit", function (event) {
            if(!!event) {
                event.preventDefault();
            }
            var otpText = $(EditCarFlow.getOtp).val();
            if (userMobNo.userOTP($(EditCarFlow.getOtp))) {
                editCarCommon.setLoadingScreen();
                if (EditCarFlow.isRedirect) {
                    return window.location.href = "/sell-used-car/myaccount/manage/?type=" + EditCarFlow.searchType + "&value=" + EditCarFlow.searchValue + "&otpCode="+(otpText || '')+"&isredirect=true&authtoken=" + ($.cookie("encryptedAuthToken") || '');
                }
             EditCarFlow.fetchMyListings(EditCarFlow.searchType, EditCarFlow.searchValue, otpText)
                  .done(function (response) {
                        $(EditCarFlow.container).html(response);
                        $(EditCarFlow.popUp).hide();
                        if (EditCarFlow.searchType === EditCarFlow.userSearchType.profileId && $(EditCarFlow.listingContainer).length) {
                            EditCarFlow.bringSearchedListingToTop(EditCarFlow.searchValue);
                        }
                        if ($(EditCarFlow.listingContainer).length)
                        {
                            $(EditCarFlow.popUp).hide();
                            editCarTracking.trackForMobile(editCarTracking.actionType.listingViewLoad, "ListingViewLoad");
                        }
                        else
                        {
                            $(EditCarFlow.searchResult).addClass('edit-otp-form');
                            EditCarFlow.AddOrRemoveDoneClass();
                        }
                        var url = $(EditCarFlow.listingContainer).length ? "/sell-used-car/myaccount/manage/?type=" + EditCarFlow.searchType + "&value=" + EditCarFlow.searchValue + "&isredirect=true&authtoken=" + ($.cookie('encryptedAuthToken') ? $.cookie('encryptedAuthToken') : "") : null;
                        if (!history.state)
                            historyObj.addToHistory("landingPage", "", url);
                        else
                            historyObj.replaceHistory("landingPage", "", url);
                        editCarCommon.removeLoadingScreen();
                        editCarTracking.trackForMobile(editCarTracking.actionType.otpVerified, EditCarFlow.searchValue);
                    }).fail(function (xhr) {
                        editCarCommon.removeLoadingScreen();
                        if (xhr.status === 403) {
                            field.setError($(EditCarFlow.getOtp), "Invalid OTP");
                        }
                        else
                        {
                            editCarCommon.showModal(xhr.responseText);
                        }
                    });
            }
            else {
                $(EditCarFlow.getOtp).focus();
            }

        });
        $(document).on("click", ".back-arrow-unit", function () {
            history.back();
        });
        $(document).on('click', '.modal-box .modal__close', function () {
            history.back();
        });
    },

    AddOrRemoveDoneClass: function() {
        $('.input-box input').blur(function () {
            var tmpval = $(this).val();
            if (tmpval.length > 0) {
                $(this).parent().addClass('done');
            }
            else {
                $(this).parent().removeClass('done');
            }
        });
    },

    //Function on submit of form
    submitEditSearchfunc: function (event) {
        if(!!event) {
            event.preventDefault();
        }
        if ($('#EditMobile').is(':visible')) {
            EditCarFlow.searchType = EditCarFlow.userSearchType.mobile;
            EditCarFlow.searchValue = $(MobSearch).val();
            if (!userMobNo.userMobile($(MobSearch))) {
                $(EditCarFlow.MobSearch).focus();
                return;
            }
        }
        else {
            EditCarFlow.searchType = EditCarFlow.userSearchType.profileId;
            EditCarFlow.searchValue = $(EditCarFlow.ProIdSearch).val();
            $(EditCarFlow.ProIdSearch).focus();
            if (!userMobNo.userProfileId($(EditCarFlow.ProIdSearch))) {
                return;
            }
        }
        editCarTracking.trackForMobile(EditCarFlow.searchType === EditCarFlow.userSearchType.mobile ? editCarTracking.actionType.mobileSearch : editCarTracking.actionType.profileSearch, EditCarFlow.searchValue);
        editCarCommon.setLoadingScreen();
        EditCarFlow.fetchMyListings(EditCarFlow.searchType, EditCarFlow.searchValue, '', $.cookie("encryptedAuthToken")).done(function (response) {
            EditCarFlow.bindListings(response);
            editCarCommon.removeLoadingScreen();
        }).fail(function (xhr) {
            editCarCommon.removeLoadingScreen();
            if (xhr.status === 404) {
                field.setError($(EditCarFlow.ProIdSearch), "Profile Id not found or deleted");
            }
            else
            {
                editCarCommon.showModal(xhr.responseText);
            }
        });
    },
    bindListings:function(response){
        if (EditCarFlow.searchType === EditCarFlow.userSearchType.profileId && $(EditCarFlow.listingContainer).length) {
            EditCarFlow.bringSearchedListingToTop(EditCarFlow.searchValue);
        }
        if (response.search("formOtp") <= 0)
        {
           $(EditCarFlow.container).html(response);
           $(EditCarFlow.popUp).hide();
            editCarTracking.trackForMobile(editCarTracking.actionType.listingViewLoad, "ListingViewLoad");
        }
        else
        {
            $(EditCarFlow.searchResult).html(response);
            $(EditCarFlow.editSearchForm).hide();
            $(EditCarFlow.searchResult).addClass('edit-otp-form');
            EditCarFlow.AddOrRemoveDoneClass();
            $(EditCarFlow.searchResult).show();
            editCarTracking.trackForMobile(editCarTracking.actionType.otpScreenLoad, EditCarFlow.searchValue);
        }
        
        $(EditCarFlow.getOtp).focus();
        if (secTimer.interval != undefined) {
            clearInterval(secTimer.interval);
        }
        secTimer.counterOn(30);
        var url = $(EditCarFlow.listingContainer).length ? "/sell-used-car/myaccount/manage/?type=" + EditCarFlow.searchType + "&value=" + EditCarFlow.searchValue + "&isredirect=true&authtoken=" + $.cookie("encryptedAuthToken") : null;
        if (!history.state)
            historyObj.addToHistory("landingPage","",url);
        else
            historyObj.replaceHistory("landingPage","",url);
    },
    bringSearchedListingToTop: function (profileId) {
        var listingContainer = $(EditCarFlow.listingContainer);
        var listing = listingContainer.children("#" + profileId.toUpperCase());// profile or listing to be moved to top
        listingContainer.prepend(listing); // move listing to top
    },
    fetchMyListings: function (type, value, otpCode, authToken, platformsrc) {
        var platform = platformsrc || $('.edit-search-form').attr('data-platform');
        var param = {
            type: type,
            value: value,
            otpCode: otpCode || '',
            authToken: authToken || '',
            platform: platform || '',
        }
        var settings = {
            url: '/sell-used-car/myaccount/manage/',
            type: "GET",
            data: param,
            headers: {
                sourceId: 43
            }
        }
        return $.ajax(settings);
    },

    //Function of resend otp
    onResendTextClick: function () {
        clearInterval(secTimer.interval);
        secTimer.counterOn(30);
        $(EditCarFlow.getOtp).val('').focus();
        if ($(EditCarFlow.resendText).hasClass('counter-hidden')) {
            $(EditCarFlow.resendText).removeClass('counter-hidden');
            $(EditCarFlow.counterText).show();
            $(EditCarFlow.getOtp).val('').focus();
            if (secTimer.interval != undefined) {
                clearInterval(secTimer.interval);
            }
            secTimer.counterOn(30);
            EditCarFlow.fetchMyListings(EditCarFlow.searchType, EditCarFlow.searchValue).fail(function (xhr) {
                editCarCommon.showModal(xhr.resendText);
            });
        }
        else {
            event.preventDefault();
        }
        editCarTracking.trackForMobile(editCarTracking.actionType.otpResent, EditCarFlow.searchValue);
    },
}
$(window).on('popstate', function () {
    //this listing page pop need a way to move to edit-flow-listing.js
    if (history.state && history.state.currentState == 'landingPage' && $('#modalPopUp').children().hasClass('stop-showing-ad-popup-container')) {
        EditCarListing.resetStopAdPopUp();
    }
    else if (history.state && history.state.currentState == 'landingPage' && $(EditCarListing.adBottomSlidePopup).hasClass("expandedBottom"))
    {
        EditCarListing.hideAdDetailList();
    }
    else if (history.state && history.state.currentState == 'landingPage' && editCarCommon.isVisible())
    {
        editCarCommon.hideModal();
    }
    else if (!history.state) {
        $(EditCarFlow.editSearchForm).show();
        $(EditCarFlow.searchResult).hide();
        EditCarListing.removeCachedInquiry();
    }
});

$(document).ready(function () {
    var authCookie = document.cookie.match(/encryptedAuthToken/g);
   if (authCookie && authCookie.length > 1) {
        document.cookie = 'encryptedAuthToken' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;path=/sell-used-car/myaccount/manage;domain=' + document.domain;
        document.cookie = 'encryptedAuthToken' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;path=/sell-used-car/myaccount/manage;domain=' + document.domain.substring(document.domain.indexOf('.'));
    }
    EditCarFlow.editSellcarDocReady();
});

