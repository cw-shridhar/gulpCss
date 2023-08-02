// This file will contain utilities that are common for both msite and desktop site

var lowerExpectedPriceLimit = 20000;
var upperExpectedPriceLimit = 1e8 - 1;

var cardetailsUtil = (function () {
    function removeModelYear(arrModelResp) {
        if (arrModelResp && arrModelResp.length) {
            arrModelResp.sort(function (a, b) {
                return a.text.split('[')[0].trim().toLowerCase() < b.text.split('[')[0].trim().toLowerCase() ? -1
                    : (a.text.split('[')[0].trim().toLowerCase() > b.text.split('[')[0].trim().toLowerCase() ? 1 : 0)
            });
            var length = arrModelResp.length;
            for (var i = 0; i < length; i++) {
                if (i === length - 1) {
                    arrModelResp[i].text = arrModelResp[i].text.split('[')[0].trim();
                    break;
                }
                var first = arrModelResp[i].text.split('[')[0].trim();
                var second = arrModelResp[i + 1].text.split('[')[0].trim();
                if (first.toLowerCase() === second.toLowerCase()) {
                    i++;
                }
                else {
                    arrModelResp[i].text = first;
                }
            }
            return arrModelResp;
        }
    };

    var numberToWords = (function () {
        var unitsPlace = ["", "one ", "two ", "three ", "four ", "five ", "six ", "seven ", "eight ", "nine ", "ten ", "eleven ", "twelve ", "thirteen ",
                          "fourteen ", "fifteen ", "sixteen ", "seventeen ", "eighteen ", "nineteen "];
        var tensPlace = ["", "", "twenty ", "thirty ", "forty ", "fifty ", "sixty ", "seventy ", "eighty ", "ninety "];
        var convert = function (n) {
            if (n < 0) return;
            if (n < 20) {
                return unitsPlace[n];
            }
            else if (n < 100) {
                return (tensPlace[Math.floor(n / 10)] + unitsPlace[n % 10]);
            }
            else if (n < 1000) {
                return unitsPlace[Math.floor(n / 100)] + "hundred " + (n % 100 > 0 ? "and " + convert(n % 100) : "");
            }
            else if (n < 100000) {
                return convert(Math.floor(n / 1000)) + "thousand " + convert(n % 1000);
            }
            else if (n < 10000000) {
                return convert(Math.floor(n / 100000)) + "lakh " + convert(n % 100000);
            }
            else if (n < 1000000000) {
                return convert(Math.floor(n / 10000000)) + "crore " + convert(n % 10000000);
            }
            return "";
        };
        return convert;
    })();

    function capitalizeFirstLetter(s) {
        if (s) {
            var str = s.toString();
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    };

    var priceValidator = (function () {
        function isBelowLowerLimit(
          onRoadPrice,
          expectedPrice,
          recomendedPrice,
          carAge
        ) {
          if (isNaN(expectedPrice) || isNaN(carAge)) {
            return false;
          }
          var recoPrice = parseInt(recomendedPrice, 10);
          var onRoadPrice = parseInt(onRoadPrice, 10);
          var price = parseInt(expectedPrice, 10);
          var isPriceBelowLimit =
            (carAge <= 3 && price <= 200000 - lowerExpectedPriceLimit * carAge) ||
            price <= lowerExpectedPriceLimit;
          if (recoPrice > 0) {
            isPriceBelowLimit = isPriceBelowLimit || price <= 0.5 * recoPrice;
          }
          if (onRoadPrice > 0) {
            isPriceBelowLimit =
              isPriceBelowLimit ||
              price <= 0.1 * onRoadPrice ||
              (carAge > 3 && price <= onRoadPrice * Math.pow(0.75, carAge));
          }
          if (isPriceBelowLimit) {
            return true;
          }
          return false;
        }
    
        function isAboveUpperLimit(
          onRoadPrice,
          expectedPrice,
          recomendedPrice,
          carAge
        ) {
          if (isNaN(expectedPrice) || isNaN(carAge)) {
            return false;
          }
          var recoPrice = parseInt(recomendedPrice, 10);
          var onRoadPrice = parseInt(onRoadPrice, 10);
          var price = parseInt(expectedPrice, 10);
          var isPriceAboveLimit =
            (carAge >= 15 && price >= 5000000) || price >= upperExpectedPriceLimit;
          if (recoPrice > 0) {
            isPriceAboveLimit = isPriceAboveLimit || price >= 2 * recoPrice;
          }
          if (onRoadPrice > 0) {
            isPriceAboveLimit =
              isPriceAboveLimit ||
              price >= 1.05 * onRoadPrice ||
              (carAge < 15 && price >= onRoadPrice * Math.pow(0.98, carAge));
          }
          if (isPriceAboveLimit) {
            return true;
          }
          return false;
        }
    
        return {
          isBelowLowerLimit: isBelowLowerLimit,
          isAboveUpperLimit: isAboveUpperLimit,
        };
      })();
    
    return {
        removeModelYear: removeModelYear,
        numberToWords: numberToWords,
        capitalizeFirstLetter: capitalizeFirstLetter,
        priceValidator: priceValidator
    }
})();

var geoLocation = (function () {
    var city = { name: "", id: "" };
    var locationErrorCode = {
        USER_DENIED: 1,
        INFO_UNAVAILABLE: 2,
        UNKNOWN: 3,
    };

    function isSupported() {
        return ('geolocation' in navigator) && navigator.geolocation != 'undefined';
    }

    function validateRequest(geoOptions) {
        return (typeof geoOptions == 'undefined' || typeof geoOptions == 'object');
    }

    function getCurrentCity(geoOptions) {
        return new Promise(function (resolve, reject) {
            if (!isSupported() || !validateRequest(geoOptions)) {
                reject("geolocation is not supported or invalid parmeter geoOptions[it should be object]");
            }

            var successHandler = function (position) {
                Loader.showFullPageLoader();
                var url = "/webapi/geocity/getcityfromlatlong/?latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude;
                try {
                    $.get({ url, headers: {ServerDomain: "CarWale"} }).done(function (response) {
                        city.id = response.cityId;
                        city.name = response.cityName;
                        Loader.hideFullPageLoader();
                        resolve(city);
                    }).fail(function (xhr) {
                        Loader.hideFullPageLoader();
                        reject(xhr.responseText);
                    });
                } catch (err) {
                    Loader.hideFullPageLoader();
                    reject(err);
                }
            };

            var errorHandler = function (error) {
                var errorMessage;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "User denied the request for Geolocation."
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable."
                        break;
                    case error.TIMEOUT:
                        errorMessage = "The request to get user location timed out."
                        break;
                    case error.UNKNOWN_ERROR:
                        errorMessage = "An unknown error occurred."
                        break;
                    default:
                        errorMessage = "";
                }
                reject(errorMessage);
            };

            navigator.geolocation.getCurrentPosition(successHandler, errorHandler, geoOptions);
        });
    }

    function getIosNativeCurrentCity() {
            if (typeof webkit === "undefined"
                || typeof webkit.messageHandlers === "undefined"
                || typeof webkit.messageHandlers.getLocation === "undefined"
                || typeof webkit.messageHandlers.getLocation.postMessage === "undefined")
            {
                geoLocation.nativeAppHandlers.nativeAppErrorHandler(locationErrorCode.UNKNOWN);
            } else {
                webkit.messageHandlers.getLocation.postMessage("");
            }
    };

    function getAndroidNativeCurrentCity() {
            if (typeof Android === "undefined" || typeof Android.getLocation === "undefined") {
                geoLocation.nativeAppHandlers.nativeAppErrorHandler(locationErrorCode.UNKNOWN);
            } else {
                Android.getLocation();
            }
    };

    var nativeAppHandlers = (function () {

        var nativeAppErrorHandler = function (errorCode) {
            errMsg = "";
            switch (errorCode) {
                case locationErrorCode.USER_DENIED:
                    errMsg = "User denied the request for Geolocation."
                    break;
                case locationErrorCode.INFO_UNAVAILABLE:
                    errMsg = "Location information is unavailable."
                    break;
                case locationErrorCode.UNKNOWN:
                    errMsg = "An unknown error occurred."
                    break;
                default:
                    errMsg = "An unknown error occurred."
            }
            console.log("Location Api call error: ", errMsg);
        }

        var nativeAppSuccessHandler = function (latitude, longitude) {
            if (latitude > 90.0 || latitude < -90.0 || longitude > 180.0 || longitude < -180.0) {
                console.log("Invalid coordinates");
            } else {
                var url = "/webapi/geocity/getcityfromlatlong/?latitude=" + latitude + "&longitude=" + longitude;
                try {
                    Loader.showFullPageLoader();
                    $.get({ url, headers: {ServerDomain: "CarWale"}}).done(function (response) {
                        city.id = response.cityId;
                        city.name = response.cityName;
                        setTimeout(function () {
                            if (cityForm.isProcessCitySelection(city))
                            cityForm.processCitySelection(city.id, city.name);
                        }, 100);
                        Loader.hideFullPageLoader();
                    }).fail(function (xhr) {
                        Loader.hideFullPageLoader();
                        console.log("XHR Error Occurred", xhr.responseText);
                    });
                } catch (err) {
                    console.log("Unknown Error", err);
                    Loader.hideFullPageLoader();
                }
            }
        }

        return {
            nativeAppErrorHandler: nativeAppErrorHandler,
            nativeAppSuccessHandler: nativeAppSuccessHandler,
        };
    })();


    return {
        getCurrentCity: getCurrentCity,
        getAndroidNativeCurrentCity: getAndroidNativeCurrentCity,
        getIosNativeCurrentCity: getIosNativeCurrentCity,
        nativeAppHandlers: nativeAppHandlers,
    }
})();

function getIntFromString(str) {
    if (!str) {
        return 0;
    }
    var num = parseInt(str, 10);
    return !isNaN(num) ? num : 0;
};
