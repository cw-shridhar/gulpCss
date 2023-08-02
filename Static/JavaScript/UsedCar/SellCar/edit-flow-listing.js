var EditCarListing = {
    editSellcarDocReady: function () {
        EditCarListing.setSelectors();
        EditCarListing.historyReplaceState();
        EditCarListing.registerEvents();
    },
    cachedInquiryId: '',// used for caching inquiries recieved
    s3fetchUrl: '',
    //Variables declared for selectors
    setSelectors: function () {
        EditCarListing.stopAdPopup = '.stop-showing-ad-popup-container';
        EditCarListing.reasonsInputBox = '#reasonsInputBox';
        EditCarListing.reasonsSelectBox = '#getReason';
        EditCarListing.modalBg = '#modalBg';
        EditCarListing.adBottomSlidePopup = '.ad-bottom-slide-popup';
        EditCarListing.stopAdContainer = '.stop-showing-ad-popup-container';
        EditCarListing.acknwoledgementSlider = '.acknowledgement-msg-card';
        EditCarListing.modalBgLayout = '.modal-bg-layout';
        EditCarListing.soldToSelectBox = '#soldTo';
        EditCarListing.soldPriceInput= '.deal-price';
    },

    historyReplaceState: function(){
        var queryParams = location.search.substring(1);
        if(queryParams)
        {
            var queryStringObj = JSON.parse('{"' + decodeURI(queryParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
            if(queryStringObj["otpCode"])
            {
                var str = [];
                for(var key in queryStringObj){
                    if(key!=="authtoken" && key!=="otpCode"){
                        str.push(encodeURIComponent(key) + "=" + encodeURIComponent(queryStringObj[key]));
                    }
                }
                str.push(encodeURIComponent("authtoken") + "=" + encodeURIComponent($.cookie("encryptedAuthToken") || ''));
                var otpPageUrl =str.join("&");
                history.replaceState(null, null, "?"+otpPageUrl);
            }
        }
    },

    //All events for the selectors
    registerEvents: function () {
        $(document).on('click', '#remove-car', function () {
            var inqId = $(this).attr('data-listingid');
            if (EditCarListing.validateDeleteRequest()) {
                editCarCommon.setLoadingScreen();
                var selectedVal = $("#getReason option:selected").val();
                var deleteDetails = EditCarListing.populateDelistingJsonObj();
                var settings = {
                    url: '/sell-used-car/myaccount/manage/' + inqId + '/?authToken=' + ($.cookie('encryptedAuthToken') ? $.cookie('encryptedAuthToken') : ""),
                    type: "PATCH",
                    data: {
                        statusid: selectedVal,
                        deletecomments: deleteDetails,
                    }
                }
                $.ajax(settings).done(function (response) {
                    $('.mylistingContainer').empty();
                    EditCarListing.resetStopAdPopUp();
                    //DO NOT BIND html before cloing pop up
                    //It will break the pop up container
                    $('.mylistingContainer').html(response);
                    editCarCommon.removeLoadingScreen();
                }).fail(function (xhr) {
                    EditCarListing.resetStopAdPopUp();
                    editCarCommon.removeLoadingScreen();
                    editCarCommon.showModal(xhr.responseText);
                });
                iphoneInputFocus.OutFocus();

            }
            else {
                field.setError($(EditCarListing.reasonsSelectBox), 'Please choose a reason to continue');
            }
        });
        $(document).on('click', '.mylistingContainer .modal-box .modal__close', function () {
            history.back();
            $('body').removeClass('lock-browser-scroll');
        });
        $(window).on('popstate', function () {
            if ($(EditCarListing.acknwoledgementSlider).hasClass('ack-slider-active')) {
                EditCarListing.hideAcknowledgementSlider();
            }
            else if ($('#modalPopUp').children().hasClass('stop-showing-ad-popup-container')) {
                EditCarListing.resetStopAdPopUp();
            }
            else if ($(EditCarListing.adBottomSlidePopup).hasClass("expandedBottom")) {
                EditCarListing.hideAdDetailList();
            }
            else if (editCarCommon.isVisible()) {
                editCarCommon.hideModal();
            }
            else if (location.pathname == "/sell-used-car/myaccount/login/") {
                window.location.href = "/sell-used-car/myaccount/login/";
            }
            if (Common.utils.getValueFromQS("editable")) {
                EditCarListing.removeDisabledEditPopup();
            }
        });

        $(document).on('click', '.stop-ad-link', function () {
            var inqId = $(this).attr('data-listingid');
            $('#modalPopUp').attr("data-current", "stop-showing-ad-popup-container");
            $('#remove-car').attr("data-listingid", inqId);
            editCarTracking.trackForMobile(editCarTracking.actionType.stopAdd, inqId);
            popUp.showPopUp(setTimeout(function () {
                if ($('.form-control-box').find('.chosen-container').length > 0) {
                    $(".chosen-select").next('').remove();
                }
                ChosenInit($('.stop-showing-ad-popup-container'));
            }, 0));
            
            iphoneInputFocus.OnFocus();
            history.pushState('stopAdPopup', '');
        });

        $(document).on('click', '.js-delete-my-ad', function () {
            var inqId = $(this).attr('data-listingid');
            editCarCommon.setLoadingScreen();
            editCarTracking.trackForMobile(editCarTracking.actionType.deleteAdd, inqId);
            var settings = {
                url: '/sell-used-car/myaccount/manage/' + inqId + '/?authToken=' + ($.cookie('encryptedAuthToken') ? $.cookie('encryptedAuthToken') : ""),
                type: "PATCH",
                data: {
                    isarchived: true
                }
            }

            $.ajax(settings).done(function (response) {
                $('.mylistingContainer').empty();
                $('.mylistingContainer').html(response);
                editCarCommon.removeLoadingScreen();
            }).fail(function (xhr) {
                editCarCommon.removeLoadingScreen();
                editCarCommon.showModal(xhr.responseText);
            });
            iphoneInputFocus.OutFocus();
        });

        $(document).on('click', '.close-icon', function () {
            iphoneInputFocus.OutFocus();
            if ($(EditCarListing.acknwoledgementSlider).hasClass('ack-slider-active')) {
                EditCarListing.hideAcknowledgementSlider();
            }
            else if ($(EditCarListing.adBottomSlidePopup).hasClass("expandedBottom")) {
                EditCarListing.hideAdDetailList();
            }
            else {
                EditCarListing.resetStopAdPopUp();
            }
            if (Common.utils.getValueFromQS("editable")) {
                EditCarListing.removeDisabledEditPopup();
            }
            $('body').removeClass('lock-browser-scroll');
        });
        $(document).on('click', '#view-ad-detail', function () {
            EditCarListing.viewAdDetailList($(this).attr('data-listingid'));
        });
        $(document).on('click', '.modal-bg-layout, #ad-inq-close', function () {
            history.back();
        });
        $(document).on('change', EditCarListing.reasonsSelectBox, function () {
            var reasonSelected = $(EditCarListing.reasonsSelectBox).val();
            var buyerType = $('input[type=radio][name="sellinquiry-buyer"]').val();
            if(reasonSelected === "2" || reasonSelected === "3")
            {
                $('#buyer-select-box').show();
                $('#deal-price-box').show();
                if(reasonSelected === "3")
                {
                    $('#soldToInputBox').show();
                }
                else
                {
                    $('#soldToInputBox').hide();
                }
            }
            else
            {
                if(buyerType === "1")
                {
                    document.getElementById("individual").checked = false;
                }
                if(buyerType === "2")
                {
                    document.getElementById("dealer").checked = false;
                }
                $('.deal-price').val("");
                $('#soldTo').val('0')
                $('.buyer-error-text').hide();
                $('.price-error-text').hide();
                $('#buyer-select-box').hide();
                $('#deal-price-box').hide();
                $('.soldto-error-text').hide();
                $('#soldToInputBox').hide();
            }
            EditCarListing.removeReasonValidationError();
        });
        

        $(document).on('change', EditCarListing.soldToSelectBox, function(){
            const price = $('#soldTo').val();
            if(price)
            {
                $('.soldto-error-text').hide();
            }
        });

        $(document).on('input', EditCarListing.soldPriceInput, function(){
            var price = $(EditCarListing.soldPriceInput).val();
            if( price )
            {
                $('.price-error-text').hide();
            }
        });

       
        $(document).on('click', '#cancel-reason', function () {
            iphoneInputFocus.OutFocus();
            EditCarListing.resetStopAdPopUp();
        });

        // event listeners for Ackwolegdement slider
        $(document).on('click', '.cross-btn', function () {
            EditCarListing.hideAcknowledgementSlider();
        });
        // end

        $(document).on('click', '#downloadReceipt', function () {
            var apiUrl = this.data("url");
            var inquiryId = this.data("listingid");
            var key = this.data("pdfkey");
            var expiredInMins = 1000;
            var receipturl = fetchReceiptAwsUrl(apiUrl, key, expiredInMins);
            if (receipturl) {
                window.open(receipturl);
            }

        });

       if ($('.sellcar-edit-list-container').length) {
            editCarTracking.trackForMobile(editCarTracking.actionType.listingViewLoad, "ListingViewLoad");
        }
        $('.success-msg__btn-close').on('click', function () {
            $('.success-msg__block').hide();
            if (typeof (clientCache) != undefined) {
                clientCache.remove('congratsSlug', true);
            }
        });

        if (typeof (clientCache) != undefined) {
            var returnValue = clientCache.get('congratsSlug', true);
            if (returnValue && returnValue.id) {
                $('.success-msg__block').show();
                setTimeout(function () {
                    $('.success-msg__block').fadeOut("slow", function () {
                        clientCache.remove('congratsSlug', true);
                    });
                }, 3000);
            }
        }
        if (Common.utils.getValueFromQS("editable")) {
            editCarCommon.setLoadingScreen();
            setTimeout(function () {
                $(EditCarListing.modalBg).show();
                $('#modalPopUp').attr("data-current", "disableEditListing");
                $("#modalPopUp").append('<div class="cross-default-15x16 cross-lg-dark-grey rightfloat close-icon"></div><div style="position:relative;top:1em;font-weight:700">Editing Disabled</div><span style="position:relative;top:2em">Since this car has been inspected, editing is disabled. To edit, please call on <a style="color: #00afa0" href="tel:+918530482263"</a>+91-8530482263</span>').show();
                history.pushState('disableEditListing', '');
                editCarCommon.removeLoadingScreen();
            }, 1000);
        }
    },

    // show acknowledgement slider
    showAcknowledgementSlider: function () {
        var paymentStatus = Common.utils.getValueFromQS("payst");
        if (paymentStatus && $("[data-payst='" + paymentStatus + "']").length) {
            setTimeout(function () { $(EditCarListing.modalBgLayout).show(); }, 0);
            $("[data-payst='" + paymentStatus + "']").removeClass('closed').removeClass('hide').addClass('ack-slider-active');
            history.pushState("ackslidershown", null, null);
        }
    },
    // hide acknowledgement sreen, replace url to avoid browser back
    hideAcknowledgementSlider: function () {
        var url = EditCarListing.utils.removeFromQS("payst", window.location.href);
        history.replaceState(null, document.title, url);
        location.reload();
    },
    resetStopAdPopUp: function () {
        formField.emptySelect($(EditCarListing.reasonsSelectBox));
        $('.js-comment-box').val('');
        EditCarListing.removeReasonValidationError();
        $(".select-box").removeClass('done');
        popUp.hidePopUp();
    },

    //Function for validating Reason selection
    reasonSelectionVal: function () {
        if ($(EditCarListing.reasonsSelectBox).val() !== "0") {
            return true;
        }

        return false;
    },

    
    buyerTypeChange: function(event) {
        var buyerType = event.value;
        if(buyerType === "1" || buyerType === "2")
        {
            $('.buyer-error-text').hide();
        }
    },

    sellCarExperienceChange: function(event) {
        var customerExperience = event.value;
        if(customerExperience === "good" || customerExperience === "average")
        {
            $('.comment-textarea').show();
            $('.comment-label').text('Let us know what we can improve?');
        }
        else if(customerExperience === "bad")
        {
            $('.comment-textarea').show();
            $('.comment-label').text('Please let us know what went wrong?');
        }
        else
        {
            $('.comment-textarea').hide();
        }
    },

    populateDelistingJsonObj: function () {
        var jsonObj = [];
        if($(EditCarListing.reasonsSelectBox).val() !== "0")
        {
            var item = {};
            item['questionId'] = 1;
            item['answer'] = $(EditCarListing.reasonsSelectBox).val();
            jsonObj.push(item);
        }
        if($(EditCarListing.soldToSelectBox).val() !== "0")
        {
            var item1 = {};
            item1['questionId'] = 2;
            item1['answer'] = $(EditCarListing.soldToSelectBox).val();
            jsonObj.push(item1);
        }
        var buyerType = "";
        if(document.getElementById('individual').checked)
        {
            buyerType = "1";
        }
        else if(document.getElementById('dealer').checked)
        {
            buyerType = "2";
        }
        if(buyerType !== "")
        {
            var item2 = {};
            item2['questionId'] = 3;
            item2['answer'] =  buyerType;
            jsonObj.push(item2);
        }
        if($('.deal-price').val())
        {
            var item3 = {};
            item3['questionId'] = 4;
            item3['answer'] = $('.deal-price').val();
            jsonObj.push(item3);
        }
        var experience = "";
        if(document.getElementById('good-experience').checked)
        {
            experience = "good";
        }
        else if(document.getElementById('avg-experience').checked)
        {
            experience = "average";
        }
        else if(document.getElementById('bad-experience').checked)
        {
            experience = "bad";
        }
        else
        {
            //nothing to do.
        }
        if(experience !== "")
        {
            var item4 = {};
            item4['questionId'] = 5;
            item4['answer'] = experience;
            item4['comments'] = $('#comment').val();
            jsonObj.push(item4);
        }
        var deListingDetails = {};
        deListingDetails['DeListingInfo'] = jsonObj;
        return JSON.stringify(deListingDetails);
    },

    validateDeleteRequest: function () {
        var validationStatus = true;
        var reasonSelected = $(EditCarListing.reasonsSelectBox).val();
        if(reasonSelected === "0")
        {
            validationStatus = false;
            $('.reason-error-text').text('Please select a reason.');
            $('.reason-error-text').show();
        }
        if(reasonSelected === "2" ||reasonSelected === "3")
        {
            if(reasonSelected === "3")
            {
                if($(EditCarListing.soldToSelectBox).val() === "0")
                {
                    validationStatus = false;
                    $('.soldto-error-text').text('Please select the platform.');
                    $('.soldto-error-text').show();
                }
            }
            if( !document.getElementById("individual").checked && !document.getElementById("dealer").checked)
            {
                validationStatus = false;
                $('.buyer-error-text').text('Please select the buyer type.');
                $('.buyer-error-text').show();
            }
            var expectedPrice = $('.deal-price').val();
            if(!expectedPrice)
            {
                validationStatus = false;
                $('.price-error-text').text('please enter price');
                $('.price-error-text').show();
            }
            else if(!parseInt(expectedPrice.trim())>0)
            {
                validationStatus = false;
                $('.price-error-text').text('please enter valid price');
                $('.price-error-text').show();
            }
            else{
                //no condition.
            }
        }
        return validationStatus;
    },

    removeReasonValidationError: function () {
        $('.reason-error-text').hide();
    },
    removeDisabledEditPopup: function () {
        var url = EditCarListing.utils.removeFromQS("editable", window.location.href);
        $('#modalPopUp').empty();
        window.history.replaceState(null, document.title, url);
        if (!document.referrer) {
            history.pushState("editFromAutoLogin", null, null);
        }
        history.back();
    },


    //Function to view Ad Details popup
    viewAdDetailList: function (inquiryId) {
        setTimeout(function () {
            if (inquiryId != EditCarListing.cachedInquiryId) {
                $(EditCarListing.adBottomSlidePopup).empty();
                $(EditCarListing.modalBg).show();
                var platform = $('.mylistingContainer').attr('data-platform').trim();
                var url = "/sell-used-car/myaccount/manage/" + inquiryId + "/inquiries/?platform=" + platform + "&authtoken=" + ($.cookie('encryptedAuthToken') ? $.cookie('encryptedAuthToken') : "");
                editCarCommon.setLoadingScreen();
                $(EditCarListing.adBottomSlidePopup).load(url, function (response, status) {
                    editCarCommon.removeLoadingScreen();
                    if (status == 'error') {
                        EditCarListing.hideAdDetailList();
                        editCarTracking.trackForMobile(editCarTracking.actionType.viewInq, inquiryId + "|" + "N");
                        editCarCommon.showModal(response);
                        return;
                    }
                    $(EditCarListing.adBottomSlidePopup).addClass('expandedBottom');
                    editCarTracking.trackForMobile(editCarTracking.actionType.viewInq, inquiryId + "|" + "Y");
                    EditCarListing.cachedInquiryId = inquiryId;
                });
            }
            else {
                $(EditCarListing.adBottomSlidePopup).addClass('expandedBottom');
                $(EditCarListing.modalBg).show();
            }
        }, 100)
        scrollLockFunc.lockScroll();
        history.pushState('viewInquiries', '');
    },

    removeCachedInquiry: function () {
        EditCarListing.cachedInquiryId = "";
    },
    //Function to hide Ad Details popup
    hideAdDetailList: function () {
        $(EditCarListing.adBottomSlidePopup).removeClass('expandedBottom');
        $(EditCarListing.modalBg).hide();
        scrollLockFunc.unlockScroll();
    },
    utils: {
        removeFromQS: function (name, url) {
            var prefix = name + '=';
            var pars = url.split(/[&;]/g);
            for (var i = pars.length; i-- > 0;) {
                if (pars[i].indexOf(prefix) > -1) {
                    pars.splice(i, 1);
                }
            }
            url = pars.join('&');
            return url;
        }
    },
    fetchReceiptAwsUrl: function (url, key, expiredInMins) {
        if (key != "" && url) {
            return $.ajax({
                type: "GET", url: url, dataType: 'json',
                async: false, headers: { 'key': key, expiredInMins: expiredInMins }
            }).done(function (response) {
                if (response != null && response != "") {
                    return response;
                }
            });
        }
    }
}

$(document).ready(function () {
    EditCarListing.editSellcarDocReady();
    EditCarListing.showAcknowledgementSlider();
});