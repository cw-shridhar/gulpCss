var resendOtp = (function () {
    var otpAttemptsDict = {};

    function getCount(mobile) {
        var attemptCount = parseInt(otpAttemptsDict[mobile]);
        if (attemptCount) {
            return attemptCount;
        }
        return 0;
    }

    function canResend(mobile) {
        return getCount(mobile) < 2;
    }

    function add(mobile) {
        if (mobile) {
            var obj = {};
            var count = getCount(mobile);
            obj[mobile] = ++count;
            otpAttemptsDict = $.extend({}, otpAttemptsDict, obj);
        }
    }

    function getOtp(mobile, callback) {
        if (mobile) {
            var settings = {
                url: "/api/v1/used/sell/verify/",
                type: "POST",
                data: mobile,
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    sourceid: parentContainer.getSourceId(),
                    'ServerDomain': 'CarWale',
                    applicationid: 3
                }
            };
            $.ajax(settings).done(function (response) {
                if (callback) {
                    callback(response);
                }
            });
        }
    }

    return {
        canResend: canResend,
        add: add,
        getOtp : getOtp
    };

})();
