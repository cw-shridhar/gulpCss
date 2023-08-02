var userMobNo = {
    userMobile: function (mobileField) {
        var isValid = false,
			mobileValue = mobileField,
			reMobile = /^[6789]\d{9}$/;

        if (mobileValue.val() == "") {
            field.setError(mobileField, 'Please provide your mobile number');
        }
        else if (mobileValue.val().length != 10) {
            field.setError(mobileField, 'Enter your 10 digit mobile number');
        }
        else if (!reMobile.test(mobileValue.val())) {
            field.setError(mobileField, 'Please provide a valid 10 digit Mobile number');
        }
        else {
            field.hideError(mobileField);
            isValid = true;
        }
        return isValid;
    },
    userOTP: function (otpField) {
        var isValid = false,
			otpValue = otpField;
        if (otpValue.val().trim() == "") {
            field.setError(otpField, 'Please provide your OTP number');
        }
        else {
            field.hideError(otpField);
            isValid = true;
        }
        return isValid;
    },

    userProfileId: function (profileField) {
        var profilereg = new RegExp("^[s|d]{1}[1-9][0-9]+", "i");

    var isValid = false;
    if (profileField.val() == "") {
        field.setError(profileField, 'Please provide your profile id');
    }
    else if (profileField.val().match(profilereg) == null) {
        field.setError(profileField, 'Invalid profile id');
    }
    else {
        field.hideError(profileField);
        isValid = true;
    }
    return isValid;
},
}
var userPincode = {
    pincodeRegex: new RegExp("^[1-9][0-9]{5}$"),
    validate: function (value) {
        return userPincode.pincodeRegex.test(value);
    }
}

var secTimer = {
    interval: undefined,
    zeroPad: function (time) {
        var numZeropad = time + '';
        if (numZeropad.length < 2) {
            numZeropad = "0" + numZeropad;
        }
        return numZeropad;
    },
    counterOn: function (counter) {
        var initialCounter = counter;
        secTimer.interval = setInterval(function () {
            counter--;
            if (counter >= 0) {
                $('.timeBox').html(secTimer.zeroPad(counter));
                if (!$('.timeBox').hasClass('active')) {
                    $('.timeBox').addClass('active');
                }
            }
            if (counter === 0) {
                $('.resend-text').addClass('counter-hidden');
                $('.counter-text').hide();
                $('.timeBox').html(secTimer.zeroPad(initialCounter));
                $('.timeBox').removeClass('active');
                clearInterval(secTimer.interval);
            }
        }, 1000);
    }
}