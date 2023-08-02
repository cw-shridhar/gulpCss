function trackCustomData(category, action, label, sendQueryString) {
    let queryString = ctTrackCustomData.getFinalQueryString(category, action, label, sendQueryString);
    ctTrackCustomData.sendBhriguRequest(queryString);
}

const ctTrackCustomData = (() => {
    function getFinalQueryString(category, action, label, sendQueryString) {
        let urlQueryString, queryString;
        let bhriguCookieQueryString = getBhriguCookies();
        queryString = commonQueryStringTrackingProcess(category, action, label);
        if (bhriguCookieQueryString != undefined && bhriguCookieQueryString.length > 0) {
            queryString = addToQueryString(queryString, bhriguCookieQueryString);
        }
        if (sendQueryString) {
            urlQueryString = getQueryStringFromUrl();
            if (urlQueryString) {
                queryString = addToQueryString(queryString, urlQueryString)
            }
        }
        return queryString;
    }
    function getBhriguCookies() {
        let allCookies = document.cookie
            .split(";")
            .map(function (x) {
                return x.trim().split("=");
            })
            .reduce(function (a, b) {
                a[b[0]] = b[1];
                return a;
            }, {});
        let bhriguCookiesStr = "";
        let bhriguCookies = window.bhriguCookies.split(",");
        for (let i = 0; i < bhriguCookies.length; i++) {
            let bhriguCookie = bhriguCookies[i];
            let cookieValue = allCookies[bhriguCookie] || "";
            if (cookieValue !== "" && cookieValue !== undefined) {
                bhriguCookiesStr = bhriguCookiesStr + bhriguCookie + "=" + cookieValue + "; ";
            }
        }
        let bhriguCookieQueryString = encodeURIComponent(bhriguCookiesStr.trim());
        return "bhrigu_cookies=" + bhriguCookieQueryString;
    }
    function commonQueryStringTrackingProcess(category, action, label) {
        let src,
            pageUrl,
            ref,
            queryString = "";
        src = getSource();
        pageUrl = getPageUrl();
        ref = getReferrer();
        if (category !== undefined && category.length > 0) {
            queryString = addToQueryString(queryString, "cat=" + category);
        }
        if (action !== undefined && action.length > 0) {
            queryString = addToQueryString(queryString, "act=" + action);
        }
        if (label !== undefined && label.length > 0) {
            queryString = addToQueryString(queryString, "lbl=" + label);
        }
        if (src !== undefined && src.length > 0) {
            queryString = addToQueryString(queryString, src)
        };
        if (pageUrl !== undefined && pageUrl.length > 0) {
            queryString = addToQueryString(queryString, pageUrl);
        }
        if (ref !== undefined && ref.length > 0) {
            queryString = addToQueryString(queryString, ref)
        };
        return queryString;
    }
    function getSource() {
        let url = document.referrer;
        if (url.length === 0) {
            return "src=direct";
        }
        else if (url.indexOf(ctTrackingPath) < 0) {
            return "src=" + url
        };
        return "";
    }
    function getPageUrl() {
        let url = document.location.href;
        if (url.indexOf("?") >= 0) {
            return "pi=" + url.split("?")[0];
        }
        else if (url.indexOf("#") >= 0) {
            return "pi=" + url.split("#")[0]
        }
        else {
            return "pi=" + url
        };
    }
    function getReferrer() {
        let url = document.referrer;
        let host = location.host;
        let referrer = "";
        if (url.length > 0 && url.indexOf(host) >= 0) {
            let relativePath = url.split(ctTrackingPath)[1];
            referrer += "ref=";
            if (!(relativePath === undefined || relativePath === null)) {
                referrer += relativePath.replace(/&+/g, "|");
            }
        }
        return referrer;
    }
    function addToQueryString(queryString, value) {
        if (queryString.length > 0) {
            queryString += "&" + value
        }
        else {
            queryString = value
        };
        return queryString;
    }
    function getQueryStringFromUrl() {
        let url = document.location.href;
        let queryString = "";
        if (url.indexOf("?") >= 0) {
            queryString = url.split("?")[1];
        } else if (url.indexOf("#") >= 0) {
            queryString = url.split("#")[1];
        }
        return processQueryString(queryString);
    }
    function sendBhriguRequest(queryString) {
        let bhriguCookieQueryString = getBhriguCookies();
        if (
            bhriguCookieQueryString != undefined &&
            bhriguCookieQueryString.length > 0 &&
            !queryString.includes("bhrigu_cookies")
        ) {
            queryString = addToQueryString(queryString, bhriguCookieQueryString);
        }
        if (queryString.length > 0) {
            queryString = "&" + queryString
        };
        let url = getHandlerUrl() + Date.now() + queryString;
        if (navigator && "sendBeacon" in navigator) {
            navigator.sendBeacon(url); // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
        } else {
            let img = new Image();
            img.src = url;
        }
    }
    function getHandlerUrl() {
        return window.bhriguHost + "/bhrigu.gif?t=";
    }
    function processQueryString(queryString) {
        if (queryString.length > 0) {
            queryString = queryString.replace(/&+/g, "|");
            return "qs=" + queryString;
        }
        else {
            return ""
        };
    }
    function isMobileSite() {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
            ) {
                check = true;
            }
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }
    return {
        getFinalQueryString,
        sendBhriguRequest,
        isMobileSite
    }

})();

const ctTracking = (() => {

    const eventTrigger = "EventTriggerGA4";

    const DataRole = {
        Impression: "impression",
        Click: "click-tracking"
    }

    function pushingEventInDataLayer(element) {
        if (!element) {
            return;
        }

        trackEvent({
            'category': element.dataset.cat,
            'action': element.dataset.action,
            'label': element.dataset.label,
            'eventName': element.dataset.eventName,
        });
    }

    function registerClickTracking() {
        const trackingElements = document.querySelectorAll(`[data-role="${DataRole.Click}"]`);
        if (trackingElements.length > 0) {
            for (let i = 0; i < trackingElements.length; i++) {
                trackingElements[i].addEventListener('click', function () {
                    pushingEventInDataLayer(trackingElements[i]);
                })
            }
        }
    }

    const options = {
        threshold: 1
    };

    function impressionObserverCallback(entries, observer) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                pushingEventInDataLayer(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    function registerImpressionTracking() {
        const trackingElements = document.querySelectorAll(`[data-role="${DataRole.Impression}"]`);
        if (trackingElements.length > 0) {
            for (let i = 0; i < trackingElements.length; i++) {
                const impressionObserver = new IntersectionObserver(impressionObserverCallback, options);
                impressionObserver.observe(trackingElements[i])
            }
        }
    }

    function registerEventTracking() {
        registerImpressionTracking();
        registerClickTracking();
    }

    function trackEvent(eventInformation = {
        category,
        action,
        label,
        eventName,
    }) {
        if (!eventInformation) {
            return;
        }

        let category = eventInformation.category ? eventInformation.category : "";
        let action = eventInformation.action ? eventInformation.action : "";
        let label = eventInformation.label ? eventInformation.label : "";
        let eventName = eventInformation.eventName ? eventInformation.eventName : `${category}_${action}`;
        if (!eventName) {
            return;
        }

        let eventObject = {
            'event': eventTrigger,
            'eventName': eventName
        };
        if (label) {
            eventObject.lab = label;
        }

        dataLayer.push(eventObject);
    }

    return {
        registerEventTracking,
        trackEvent,
    };
})();

window.addEventListener("load", (event) => {
    ctTracking.registerEventTracking();
});

window.addEventListener('DOMContentLoaded', (event) => {
    let cat = "PageViews";
    let act = "";
    let sourceLabel = "source=" + (ctTrackCustomData.isMobileSite() ? Platform.Mobile : Platform.Desktop);
    let sendQueryString = true;
    trackCustomData(cat, act, sourceLabel, sendQueryString);
});