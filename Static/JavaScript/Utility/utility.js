var Common = {
    cwShortenedDomain: "cwle.in",
    doc: $(document),
    googleApiKey: (typeof googleApiKey === 'undefined' ? "" : googleApiKey),
    redirectToComparePage: function (compareCars) {
        var comparecar1 = compareCars[0].split(':');
        var comparecar2 = compareCars[1].split(':');
        var dataList = [{ id: comparecar1[1], text: comparecar1[0].toLowerCase() }, { id: comparecar2[1], text: comparecar2[0].toLowerCase() }]
        var userInput = suggestions.count + '_' + suggestions.position + '_' + suggestReqTerm + '_' + comparecar1[0].toLowerCase() + '_' + comparecar2[0].toLowerCase();
        cwTracking.trackAction('M-Site-Homepage', 'FirstPanel-Mobile-HP', 'NewCars-Successful-Selection-Value-Click', userInput);
        window.location.href = '/compare-cars/' + Common.getCompareUrl(dataList) + '/?source=25';
        return false;
    },
    getCompareUrl: function (dataList) {
        try {
            var compareUrl = "", i;
            dataList.sort(function (a, b) {
                return Number(a.id) > Number(b.id);
            });
            for (i = dataList.length - 1; i >= 0; i--) {
                compareUrl += dataList[i].text;
                if (i !== 0) {
                    compareUrl += "-vs-";
                }
            }
            return compareUrl;
        }
        catch (e) {
            throw new Error(e);
        }
    },
    utils: {
        isInDescOrder: function (inputArray) {
            if (inputArray instanceof Array) {
                for (var i = 0; i < inputArray.length - 1; i++) {
                    if (inputArray[i] < inputArray[i + 1]) {
                        return false;
                    }
                }
                return true;
            }
            else {
                throw new Error("This function accepts an array as input.");
            }
        },
        setUrlTitleOnScroll: function (currScroll, scrollPositionDict, urlTitleObject) {
            if (scrollPositionDict.length > 0) {
                var dictLength = scrollPositionDict.length;
                if (currScroll < scrollPositionDict[0].key && document.title != urlTitleObject[0].Title) {
                    document.title = urlTitleObject[scrollPositionDict[0].value].Title;
                    window.history.replaceState(currScroll, urlTitleObject[scrollPositionDict[0].value].Title, urlTitleObject[scrollPositionDict[0].value].Url);
                    return true;
                }
                else if (currScroll > scrollPositionDict[dictLength - 1].key && document.title != urlTitleObject[scrollPositionDict[dictLength - 1].value].Title) {
                    document.title = urlTitleObject[scrollPositionDict[dictLength - 1].value].Title;
                    window.history.replaceState(currScroll, urlTitleObject[scrollPositionDict[dictLength - 1].value].Title, urlTitleObject[scrollPositionDict[dictLength - 1].value].Url);
                    return true;
                }
                else {
                    for (var checkScrollDict = 0; checkScrollDict < dictLength - 1; ++checkScrollDict) {
                        if ((scrollPositionDict[checkScrollDict].key <= currScroll) && (currScroll <= scrollPositionDict[checkScrollDict + 1].key) && document.title != urlTitleObject[scrollPositionDict[checkScrollDict].value].Title) {
                            document.title = urlTitleObject[scrollPositionDict[checkScrollDict].value].Title;
                            window.history.replaceState(currScroll, urlTitleObject[scrollPositionDict[checkScrollDict].value].Title, urlTitleObject[scrollPositionDict[checkScrollDict].value].Url);
                            return true;
                            break;
                        }
                    }
                }
            }
            return false;
        },
        firePageView: function (inputUrl) {
            try {
                ga('create', 'UA-337359-1', 'auto', { 'useAmpClientId': true });
                ga('send', 'pageview', inputUrl);
            }
            catch (e) {
                setTimeout(function () { Common.utils.firePageView(inputUrl) }, 300);
            }
        },
        storageAvailable: function (type) {
            try {
                var storage = window[type],
                    x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            catch (e) {
                return false;
            }
        },
        formatNumeric: function (inputPrice) {
            var inputPrice = inputPrice.toString();
            var formattedPrice = "";
            var breakPoint = 3;
            for (var i = inputPrice.length - 1; i >= 0; i--) {

                formattedPrice = inputPrice.charAt(i) + formattedPrice;
                if ((inputPrice.length - i) == breakPoint && inputPrice.length > breakPoint) {
                    formattedPrice = "," + formattedPrice;
                    breakPoint = breakPoint + 2;
                }
            }
            return formattedPrice;
        },

        showLoading: function () {            // function for showing image Loading
            $('#m-blackOut-window').show();
            $('#cwmLoadingIcon').show();
        },

        hideLoading: function () {             // function for hiding image Loading
            $('#m-blackOut-window').hide();
            $('#cwmLoadingIcon').hide();
        },

        formatSpecial: function (url) {
            reg = /[^/\-0-9a-zA-Z\s]*/g;
            url = url.replace(reg, '');
            var formattedUrl = url.toLowerCase().replace(/ /g, "").replace(/-/g, "").replace("/", "");
            return formattedUrl;
        },

        prefillUserDetails: function () {
            $("input[prefill]").each(function (count, element) {
                element = $(element);
                switch (element.attr('prefill')) {
                    case 'name':
                        element.val(Common.utils.getUserName());
                        break;
                    case 'email':
                        element.val(Common.utils.getUserEmail());
                        break;
                    case 'mobile':
                        element.val(Common.utils.getUserMobile());
                        break;
                }
            });
        },

        eventTracking: function () {
            $(document).on("click", "[data-role='click-tracking']", function () {
                Common.utils.callTracking($(this));
            });
        },
        trackClicks: function () {
            $(document).on("click", "[data-role*='click']", function () {
                var _self = $(this);
                if (_self.data('role') == 'click-tracking') return;
                var action = '_click';
                Common.utils.callTracking(_self, action);
            });
        },
        trackImpressions: function () {
            $("[data-role*='impression']").each(function (count, element) {
                var action = '_shown';
                Common.utils.callTracking($(this), action);
            });
        },
        trackImpressionsBySection: function (div) {
            $(div + " [data-role*='impression']").each(function (count, element) {
                var action = '_shown';
                Common.utils.callTracking($(this), action);
            });
        },
        callTracking: function (node, action) {
            if (action == undefined) action = '';
            try {
                var evCat = node.data('cat') ? node.data('cat') : '',
                    evAct = node.data('action') ? node.data('action') + action : '',
                    evLab = node.data('label') ? node.data('label') : '',
                    evEvent = node.data('event') ? node.data('event') : (action === '_shown' ? 'CWNonInteractive' : (action === '_click' ? 'CWInteractive' : ''));
                cwTracking.trackAction(evEvent, evCat, evAct, evLab);
            } catch (e) {
                console.log(e);
            }
        },
        filterModelName: function (modelName) {
            if (modelName == null || modelName == '') {
                return '';
            }
            var index = modelName.indexOf('[');
            if (index >= 0) {
                return modelName.substring(0, index);
            }
            else {
                return modelName;
            }

        },

        getUserName: function () {
            var name = $.cookie('_CustomerName');
            if (name == null) {
                name = $.cookie('TempCurrentUser');
                name = name != null ? name.split(':')[0] : "";
            }
            return name;
        },
        getUserMobile: function () {
            var mobile = $.cookie('_CustMobile');
            if (mobile == null || mobile == "") {
                mobile = $.cookie('TempCurrentUser');
                mobile = mobile != null ? mobile.split(':')[1] : undefined;
            }
            return mobile;
        },
        getUserEmail: function () {
            var email = $.cookie('_CustEmail');
            if (email == null) {
                email = $.cookie('TempCurrentUser');
                email = email != null ? email.split(':')[2] : undefined;
            }
            return email;
        },
        setEachCookie: function (cname, cvalue) {
            var expires = "expires=" + permanentCookieTime();
            document.cookie = cname + "=" + cvalue + "; " + expires + "; domain=" + defaultCookieDomain + "; path =/";
        },
        ajaxCall: function (api, param) {

            if (typeof (api) == "object") return $.ajax(api);

            var ajaxobject = {};
            if (typeof (param) == "object") {
                if (typeof (api) == "string") ajaxobject.url = api;
                if (typeof (param.type) != "undefined") ajaxobject.type = param.type; else { ajaxobject.type = "GET"; }
                if (typeof (param.success) == "function") ajaxobject.success = param.success;
                if (typeof (param.failure) == "function") ajaxobject.failure = param.failure;
                if (typeof (param.data) != "undefined") ajaxobject.data = param.data;
                if (typeof (param.dataType) != "undefined") ajaxobject.dataType = param.dataType;
                if (typeof (param.contentType) != "undefined") ajaxobject.contentType = param.contentType;
                if (typeof (param.headers) != "undefined") ajaxobject.headers = param.headers;
            }
            else {
                ajaxobject.url = api;
                ajaxobject.type = "GET";
            }
            return $.ajax(ajaxobject);
        },
        getSplitCityName: function (locationName) {  //function to split cityName from city,state format
            if (locationName != null && locationName != undefined && $.trim(locationName) != "") {
                locationName = locationName.split(',')[0];
            }
            return locationName;
        },
        unlockPopup: function (setScrollTimeout) {
            $("#blackOut-window, .blackOut-window").hide();
            var html = document.getElementsByTagName('html')[0];
            var scrollTop = parseInt(html.style.top);
            $('html').removeClass('lock-browser-scroll');
            if (typeof setScrollTimeout !== 'undefined' && setScrollTimeout) {
                setTimeout(function () {
                    $('html,body').scrollTop(-scrollTop);
                });
            }
            else {
                $('html,body').scrollTop(-scrollTop);
            }
        },
        lockPopup: function () {
            var html_el = $('html'), body_el = $('body');
            $(".blackOut-window").show();
            if (Common.doc.height() > $(window).height()) {
                var scrollTop = (html_el.scrollTop()) ? html_el.scrollTop() : body_el.scrollTop(); // Works for Chrome, Firefox, IE...
                if (scrollTop < 0) { scrollTop = 0; }
                html_el.addClass('lock-browser-scroll').css('top', -scrollTop);
            }
        },
        loadGoogleApi: function (callback, input) {
            var googleMapsApiJsPath = "";
            if (Common.googleApiKey.length > 0) {
                googleMapsApiJsPath = "https://maps.googleapis.com/maps/api/js?key=" + Common.googleApiKey + "&libraries=places&sensor=false";
            }
            else {
                googleMapsApiJsPath = "https://maps.googleapis.com/maps/api/js?libraries=places&sensor=false";
            }
            $.getScript(googleMapsApiJsPath).done(function () {
                if (callback != null && typeof (callback) == "function") callback(input);
            });
        },
        getValueFromQS: function (name) {
            var hash = window.location.href.split('?');
            if (hash.length > 1) {
                var params = hash[1].split('&');
                var result = {};
                var propval, filterName, value;
                var isFound = false;
                var paramsLength = params.length;
                for (var i = 0; i < paramsLength; i++) {
                    var propval = params[i].split('=');
                    filterName = propval[0];
                    if (filterName.toLowerCase() == name.toLowerCase()) {
                        value = propval[1];
                        isFound = true;
                        break;
                    }
                }
                if (isFound && value !== undefined && value.length > 0) {
                    if (value.indexOf('+') > 0)
                        return value.replace(/\+/g, " ");
                    else
                        return value;
                }
                else
                    return "";
            }
            else
                return "";
        },

        IsValuePresentInQS: function (name, qs) {
            var params = qs.split('&');
            var propVal, filterName;
            var isFound = false;
            var paramsLength = params.length;
            for (var i = 0; i < paramsLength; i++) {
                propVal = params[i].split('=');
                filterName = propVal[0];
                if (filterName.toLowerCase() == name.toLowerCase()) {
                    isFound = true;
                    break;
                }
            }
            return isFound;
        },

        updateQSParam: function (uri, key, value) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
                return uri + separator + key + "=" + value;
            }
        },

        removeYearFromModelName: function (name) {
            if (name.indexOf('[') > 0)
                return name.split('[')[0];
            else
                return name;

        },
        isElementInViewportTopBottom: function (el) {
            if (typeof jQuery === "function" && el instanceof jQuery) {
                el = el[0];
            }
            var rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.bottom <= $(window).height()
            );
        },
        isElementInViewportLeftRight: function (el) {
            if (typeof jQuery === "function" && el instanceof jQuery) {
                el = el[0];
            }
            var rect = el.getBoundingClientRect();
            return (
                rect.left >= 0 &&
                rect.right <= $(window).width()
            );
        },
        setSessionCookie: function (name, value) {
            $.cookie(name, value, { path: '/' });
        },

        isQuotationPage: function () {
            if (location.pathname == "/m/research/quotation.aspx") {
                return true;
            }
            return false;
        },

        trackUserTimings: function (category, timing, value, label) {
            ga('create', 'UA-337359-1', 'auto');
            ga('send', {
                hitType: 'timing',
                timingCategory: category,
                timingVar: timing,
                timingLabel: label ? label : '',
                timingValue: value
            });
        },
        trackTopMenu: function (action, label) {
            dataLayer.push({
                event: 'TopMenu', cat: 'TopMenu-Mobile', act: action, lab: label || "NA"
            });
        },
        debounce: function (fn, wait) {
            var timeout;
            return function () {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    fn.apply(this, arguments)
                }, (wait || 1));
            }
        },
        throttle: function (fn, threshhold, scope) {
            threshhold || (threshhold = 250);
            var last,
                deferTimer;
            return function () {
                var context = scope || this;

                var now = +new Date,
                    args = arguments;
                if (last && now < last + threshhold) {
                    // hold on to it
                    clearTimeout(deferTimer);
                    deferTimer = setTimeout(function () {
                        last = now;
                        fn.apply(context, args);
                    }, threshhold);
                } else {
                    last = now;
                    fn.apply(context, args);
                }
            };
        },
        getCookieByName: function (name) {
            var allCookies = "; " + document.cookie;            //adding '; ' so can split cookie value into two parts
            var parts = allCookies.split("; " + name + "=");    //spliting cookie into two parts 1) '....; {name}=' 2) '{value}; ......'
            var cookieValue = "";
            if (parts.length >= 2) {                            //if cookie exists then it will split into two or more parts
                cookieValue = parts.pop().split(";").shift();   //from second part extracting value
            }
            return cookieValue;
        },
        //this is also present in Carwale\Static\m\js\v2\app\common.js
        //so update it if you update this
        getShortnedUrl: function (longUrl, apiKey, urlShortenerDomain) {
            urlShortenerDomain = urlShortenerDomain || Common.cwShortenedDomain
            var data = {
                dynamicLinkInfo: {
                    domainUriPrefix: urlShortenerDomain,
                    link: longUrl
                }
            };
            var apiUrl = "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=" + apiKey;
            return $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                url: apiUrl,
                contentType: "application/json; charset=utf-8",
            });
        }
    },
    openExternalLinkCallback: function (url) {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
                JSON.stringify({
                    'callbackName': 'openExternalLink',
                    'url': url,
                })
            );
        }
        else {
            location.href = url;
        }
    },
    openExternalLinkWithAppCheck: function(url, appUrl) {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
                JSON.stringify({
                    'callbackName': 'openExternalLinkWithAppCheck',
                    'url': url,
                    'appUrl': appUrl
                })
            );
        }
        else {
            window.open(url, "_blank");
        }
    }
}

//move this code at any other file in next phase
$(".infoBtn").click(function () {
    $(this).parents("li").flip(true).siblings().flip(false);
});

$(".closeBtn").click(function () {
    $(this).parents("li").flip(false);
});

$(document).ready(function () {
    Common.utils.eventTracking();
    Common.utils.trackImpressions();
    Common.utils.trackClicks();
    Common.utils.prefillUserDetails();
});
