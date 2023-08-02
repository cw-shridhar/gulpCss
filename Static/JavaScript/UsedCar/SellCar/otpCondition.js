var sellCarOtp = (function () {
    var carData = {};
    var otpInputBox, otpMobNo, editableIcon, otpNoField, getOtp, resendText, counterText, reqOtp, verifyOtp, loader, resendPrevent;
    var NumberChanged = false;

    if (typeof events !== 'undefined') {
        events.subscribe("mobileUnverified", setOtpScreen);
        events.subscribe("otpDocReady", setSelectors);
    };

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
    function setOtpScreen(eventObj) {
        if (eventObj && eventObj.data) {
            carData = appState.setSelectedData(carData, eventObj.data);

        }
        showverifyScreen();
        setRetryAttempt(carData.sellCarCustomer.mobile);       
        popUp.showPopUp();
        analytics.trackAction("CWInteractive", "Sell Car - Desktop", "OTP shown", cityForm.getCityData().cityName);
        $(otpMobNo).val(carData.sellCarCustomer.mobile);
        if (secTimer.interval != undefined) {
            clearInterval(secTimer.interval);
        }
        secTimer.counterOn(30);
        parentContainer.removeLoadingScreen();
        NumberChanged = false;
    }
    function isNumberChanged() {
        return NumberChanged;
    }

    function hideOtpPopup(data) {
        popUp.hidePopUp();
        if (typeof events !== 'undefined') {
            var eventObj = {
                data: data,
            };
            events.publish("mobileVerified", eventObj);
        }
    }

    function setRetryAttempt(mobile) {
        if (typeof resendOtp != 'undefined' && !resendOtp.canResend(mobile)) {
            //hide the attempt div
            $(resendText).hide();
            $(resendPrevent).show();
        }
        else {
            $(resendText).show();
            $(resendPrevent).hide();
        }
    }

    function processVerifiedMobile(data) {
        if (isNumberChanged()) {
            $(reqOtp).hide();
            $(otpNoField).hide();
            $(resendText).hide();
            $(editableIcon).hide();
            $(verifyOtp).hide();
            field.setMessage($(otpMobNo), "Mobile number is already verified.You will be redirected.");
            setTimeout(function () { hideOtpPopup(data); }, 5000);

        } else {
            hideOtpPopup(data);
        }
    }

    function setSelectors() {
        otpInputBox = '#otpInputBox';
        otpMobNo = '.otp-mob-no';
        editableIcon = '.editable-icon';
        otpNoField = '.otp-no-field';
        getOtp = '.get-otp';
        resendText = '.resend-text';
        counterText = '.counter-text';
        reqOtp = '#req-otp';
        verifyOtp = '#verify-otp';
        resendPrevent = ".resend-prevent-text";
        loader = '.sell-car-loader';
        registerDomEvents();
    }
    function registerDomEvents() {
        $(document).on('click', '.resend-text', onResendTextClick);
        $(document).on("click", '.editable-icon', editMobileNumber);
        $(document).on("click", '#req-otp', requestOtp);
        $(document).on("click", '#verify-otp', verifyOtpCode);
    }

    function onResendTextClick() {
        if ($('.timeBox').hasClass('active'))
            return;
        var mobile = carData.sellCarCustomer.mobile;
        $(resendText).removeClass('counter-hidden');
        $(counterText).show();
        $(getOtp).val('').focus();
        field.hideError($(getOtp));
        if (secTimer.interval != undefined) {
            clearInterval(secTimer.interval);
        }
        secTimer.counterOn(30);
        if (typeof resendOtp != 'undefined') {
            resendOtp.getOtp(mobile, processResendOtpResponse);
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

    function requestOtp() {
        $(otpInputBox).addClass('labeled-mob-no');

        if ($(otpInputBox).hasClass('invalid')) {
            $(this).removeClass('labeled-mob-no');
        }
        userMobNo.userMobile($(otpMobNo));
        if ($(otpInputBox).hasClass('invalid')) {
            $(editableIcon).show();
        }
        else {
            $(loader).show();
            $(getOtp).val('').focus();
            field.hideError($(getOtp));
            clearInterval(secTimer.interval);
            secTimer.counterOn(30);
            updateContactDetails($(otpMobNo).val());
            NumberChanged = true;
        }
    }

    function editMobileNumber() {
        $(editableIcon).hide();
        $(otpInputBox).removeClass('labeled-mob-no');
        $(verifyOtp).hide();
        $(otpMobNo).focus();
        $(otpNoField).hide();
        $(resendText).hide();
        $(reqOtp).show();
        $(resendPrevent).hide();
        $(resendText).removeClass('counter-hidden');
        $(counterText).show();
        if (secTimer.interval != undefined) {
            clearInterval(secTimer.interval);
        }
        secTimer.counterOn(30);
        field.hideError($(otpMobNo));
        analytics.trackAction("CWInteractive", "Sell Car - Desktop", "Number Edit", cityForm.getCityData().cityName);
    }

    function showverifyScreen() {
        field.hideError($(otpMobNo));
        $(loader).hide();
        $(reqOtp).hide();
        $(otpNoField).show();
        $(resendText).show();
        $(editableIcon).show();
        $(reqOtp).hide();
        $(verifyOtp).show();
        $(resendPrevent).hide();
    };
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
                if (typeof events != 'undefined') {
                    events.publish("updateCarDetails", carData);
                    events.publish("updateContactDetails", { data: carData, callback: onMobileVerified });
                }
                showverifyScreen();
            }).fail(function (xhr) {
                field.setError($(otpMobNo), JSON.parse(xhr.responseText).description);
                $(editableIcon).show();
                $(loader).hide();
            });
        }
    }

    function verifyOtpCode() {
        $(verifyOtp).attr("disabled", "disabled");
        var sourceModule = 2;//Sellcar source module for vernam
        if (userMobNo.userOTP($(getOtp))) {
            $(loader).show();
            var settings = {
              url:
                "/api/v1/mobile/" +
                carData.sellCarCustomer.mobile +
                "/verification/verifyotp/?otpCode=" +
                $(getOtp).val() +
                "&sourceModule=" +
                sourceModule,
              headers: { sourceid: 302, ServerDomain: "CarWale" },
              type: "GET",
            };
            $.ajax(settings).done(function (response, msg, xhr) {
                $(verifyOtp).removeAttr("disabled");
                $(loader).hide();
                analytics.trackAction("CWInteractive", "Sell Car - Desktop", "Otp Verified", cityForm.getCityData().cityName);
                popUp.hidePopUp();
                if (typeof events !== 'undefined') {
                    var eventObj = {
                        data: carData,
                    };
                    events.publish("mobileVerified", eventObj);
                }
            }).fail(function (xhr) {
                $(verifyOtp).removeAttr("disabled");
                $(loader).hide();
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
            $(verifyOtp).removeAttr("disabled");
        }
    }
    return { updateContactDetails: updateContactDetails }
})();

$(document).ready(function () {
    if (typeof events !== 'undefined') {
        events.publish("otpDocReady");
    }
    if (navigator.userAgent.indexOf('Mac OS X') != -1) {
        $("body").addClass("mac");
    }
});
