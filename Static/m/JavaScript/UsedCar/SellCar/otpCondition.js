var SellCarOtp = (function () {
    var carData = {};
    var otpInputBox, otpMobNo, editableIcon, getOtp, resendText, counterText, reqOtp, verifyOtp, loader, resendPrevent;

    if (typeof events !== 'undefined') {
        events.subscribe("mobileUnverified", setOtpScreen);
        events.subscribe("otpDocReady", onOtpDocReady);
    };

    function onOtpDocReady() {
        setSelectors();
        registerEvents();
    }

    function setOtpScreen(eventObj) {
        if (eventObj && eventObj.data) {
            carData = appState.setSelectedData(carData, eventObj.data);
        }
        $('.otp-mobile-field .margin-bottom40').css('margin-bottom', '40px');
        setVerificationScreen();
        $(loader).hide();
        setRetryAttempt(carData.sellCarCustomer.mobile);
        popUp.showPopUp();
        sellCarTracking.forMobile("otpshown", "Sell Car|" + cityForm.getCityData().cityName);
        $(otpMobNo).val(carData.sellCarCustomer.mobile);
        parentContainer.removeLoadingScreen();
    }

    function setRetryAttempt(mobile) {
        if (typeof resendOtp != 'undefined' && !resendOtp.canResend(mobile)) {
            $(resendText).hide();
            $(resendPrevent).show();
        }
        else {
            $(resendText).show();
            $(resendPrevent).hide();
        }
    }

    function setSelectors() {
        otpInputBox = '#otpInputBox';
        otpMobNo = '.otp-mob-no';
        editableIcon = '.editable-icon';
        getOtp = '.get-otp';
        resendText = '.resend-text';
        counterText = '.counter-text';
        reqOtp = '#req-otp';
        verifyOtp = '#verify-otp';
        loader = '.sell-car-loader';
        resendPrevent = ".resend-prevent-text";
    }

    function registerEvents() {
        $(document).on('click', resendText, onResendTextClick);
        $(document).on("click", editableIcon, onEditableIconClick);
        $(document).on("click", reqOtp, onReqOtpClick);
        $(document).on("click", verifyOtp, onVerifyOtpClick);
        $(document).on('click', '.close-icon', onCloseIconClick);
    }

    function onResendTextClick() {
        if ($('.timeBox').hasClass('active'))
            return;
        if ($(resendText).hasClass('counter-hidden')) {
            $(resendText).removeClass('counter-hidden');
            $(counterText).show();
            field.hideError($(getOtp));
            $(getOtp).val('').focus();
            if (secTimer.interval != undefined) {
                clearInterval(secTimer.interval);
            }
            secTimer.counterOn(30);
            if (typeof resendOtp != 'undefined') {
                resendOtp.getOtp(carData.sellCarCustomer.mobile, processResendOtpResponse);
            }
        }
        else {
            event.preventDefault();
        }
    }

    function processResendOtpResponse(response) {
        if (typeof resendOtp != 'undefined') {
            resendOtp.add(carData.sellCarCustomer.mobile);
            if (!resendOtp.canResend(carData.sellCarCustomer.mobile)) {
                $(resendText).hide();
                $(resendPrevent).show();


            }
        }
    }

    function onEditableIconClick() {
        $(otpInputBox).removeClass('labeled-mob-no');
        $('.otp-popup-container').addClass('edit-otp');
        $(otpMobNo).focus();
        $(reqOtp).show();
        $(resendText).removeClass('counter-hidden');
        $(counterText).show();
        field.hideError($(otpMobNo));
        sellCarTracking.forMobile("otpnumberchanged", "Sell Car|" + cityForm.getCityData().cityName);
    }

    function onReqOtpClick() {
        $(otpInputBox).addClass('labeled-mob-no');
        userMobNo.userMobile($(otpMobNo));
        if ($(otpInputBox).hasClass('invalid')) {
            $(otpMobNo).focus();
            $(otpInputBox).removeClass('labeled-mob-no');

        }
        else {
            $(loader).show();
            updateContactDetails($(otpMobNo).val())
        }
    }

    function onVerifyOtpClick() {
        verifyOtpCode();
    }

    function onCloseIconClick() {
        clearInterval(secTimer.interval);
    }

    function updateContactDetails(mobileNumber) {
        if (carData) {
            carData = appState.setSelectedData(carData, { sellCarCustomer: { mobile: mobileNumber } }, true);
            var settings = {
                url: "/api/used/sell/contactdetails/?tempid=" + encodeURIComponent($.cookie("TempInquiry")),
                type: "POST",
                data: carData.sellCarCustomer,
                headers: { ServerDomain: "CarWale" },
            }
            $.ajax(settings).done(function (response) {
                $('.otp-mobile-field .margin-bottom40').css('margin-bottom', '40px');
                setVerificationScreen();
                if (typeof events != 'undefined') {
                    events.publish("updateCarDetails", carData);
                    events.publish("updateContactDetails", { data: carData, callback: onMobileVerified });
                }
            }).fail(function (xhr) {
                $('.otp-mobile-field .margin-bottom40').css('margin-bottom', '65px');
                field.setError($(otpMobNo), JSON.parse(xhr.responseText).description);
                $(editableIcon).show();
                $(loader).hide();
            });
        }
        
    }

    function setVerificationScreen() {
        if (secTimer.interval != undefined) {
            clearInterval(secTimer.interval);
        }
        secTimer.counterOn(30);
        $(reqOtp).hide();
        $('.otp-popup-container').removeClass('edit-otp');
        field.hideError($(getOtp));
        field.hideError($(otpMobNo));
        $(getOtp).val('').focus();
        $(verifyOtp).show();
        $(otpInputBox).addClass('labeled-mob-no');
        $('.otp-popup-container').removeClass('edit-otp');
    }

    function onMobileVerified(response, data) {
        if (response.isMobileVerified) {
            processVerifiedMobile(data);
        }
        else {
            //show OTP screen
            if (typeof events !== 'undefined') {
                var eventObj = {
                    data: data,
                };
                events.publish("mobileUnverified", eventObj);
            }

        }
    }

    function processVerifiedMobile(data) {
        $(reqOtp).hide();
        $('.otp-popup-container').addClass('edit-otp');
        $(resendText).hide();
        $(editableIcon).hide();
        $(verifyOtp).hide();
        field.setMessage($(otpMobNo), "Mobile number is already verified.You will be redirected.");
        setTimeout(function () {
            popUp.hidePopUp();
            if (typeof events !== 'undefined') {
                var eventObj = {
                    data: data,
                };
                events.publish("mobileVerified", eventObj);
            }
        }, 5000);
    }

    function verifyOtpCode() {
        parentContainer.setLoadingScreen();
        var sourceModule = 2;//Sellcar source module for vernam
        if (userMobNo.userOTP($(getOtp))) {
            var settings = {
              url:
                "/api/v1/mobile/" +
                carData.sellCarCustomer.mobile +
                "/verification/verifyotp/?otpCode=" +
                $(getOtp).val() +
                "&sourceModule=" +
                sourceModule,
              headers: { sourceid: 301, ServerDomain: "CarWale" },
              type: "GET",
            };
            $.ajax(settings).done(function (response, msg, xhr) {
                parentContainer.removeLoadingScreen();
                sellCarTracking.forMobile("otpverified", "Sell Car|" + cityForm.getCityData().cityName);
                history.back();
                if (typeof events !== 'undefined') {
                    var eventObj = {
                        data: carData,
                    };
                    events.publish("mobileVerified", eventObj);
                }
            }).fail(function (xhr) {
                parentContainer.removeLoadingScreen();
                if (xhr.status === 404) {
                    field.setError($(getOtp), 'Invalid Otp');
                }
                else if (xhr.statusText && xhr.statusText.trim().length) {
                    field.setError($(getOtp), xhr.statusText.trim());
                }
                else {
                    field.setError($(getOtp), 'Something went wrong, please try again later!');
                }
            });
        }
        else {
            parentContainer.removeLoadingScreen();
        }
    }

})();

$(document).ready(function () {
    if (typeof events !== 'undefined') {
        events.publish("otpDocReady");
    }
});
