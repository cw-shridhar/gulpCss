//Owner - Akansha Srivastava
//Date - 03.05.2015
//Purpose - used for CarWale Internal Tracking

!(function (e) {
  "function" == typeof define && define.amd
    ? define(["jquery"], e)
    : "object" == typeof exports
    ? (module.exports = e(require("jquery")))
    : e(jQuery);
})(function (e) {
  function t() {
    var t,
      n,
      i = { height: d.innerHeight, width: d.innerWidth };
    return (
      i.height ||
        ((t = a.compatMode),
        (t || !e.support.boxModel) &&
          ((n = "CSS1Compat" === t ? h : a.body),
          (i = { height: n.clientHeight, width: n.clientWidth }))),
      i
    );
  }
  function n() {
    return {
      top: d.pageYOffset || h.scrollTop || a.body.scrollTop,
      left: d.pageXOffset || h.scrollLeft || a.body.scrollLeft,
    };
  }
  function i() {
    if (f.length) {
      var i = 0,
        l = e.map(f, function (e) {
          var t = e.data.selector,
            n = e.$element;
          return t ? n.find(t) : n;
        });
      for (o = o || t(), r = r || n(); i < f.length; i++)
        if (e.contains(h, l[i][0])) {
          var a = e(l[i]),
            d = { height: a[0].offsetHeight, width: a[0].offsetWidth },
            c = a.offset(),
            u = a.data("inview");
          if (!r || !o) return;
          c.top + d.height > r.top &&
          c.top < r.top + o.height &&
          c.left + d.width > r.left &&
          c.left < r.left + o.width
            ? u || a.data("inview", !0).trigger("inview", [!0])
            : u && a.data("inview", !1).trigger("inview", [!1]);
        }
    }
  }
  var o,
    r,
    l,
    f = [],
    a = document,
    d = window,
    h = a.documentElement;
  (e.event.special.inview = {
    add: function (t) {
      f.push({ data: t, $element: e(this), element: this }),
        !l && f.length && (l = setInterval(i, 250));
    },
    remove: function (e) {
      for (var t = 0; t < f.length; t++) {
        var n = f[t];
        if (n.element === this && n.data.guid === e.guid) {
          f.splice(t, 1);
          break;
        }
      }
      f.length || (clearInterval(l), (l = null));
    },
  }),
    e(d).on("scroll resize scrollstop", function () {
      o = r = null;
    }),
    !h.addEventListener &&
      h.attachEvent &&
      h.attachEvent("onfocusin", function () {
        r = null;
      });
});

var cwTracking = (function(){
  return {
  hostPath: cwTrackingPath,
  platform: typeof __PLATFORM_ID__ !== "undefined" ? __PLATFORM_ID__ : 1,
  hasFocus: false,
  pageTracker: "",
  pageViewID: "pageTimer",
  isMobileSite: function () {
    var check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  },
  type: {
    impression: "imp",
    click: "click",
  },

  getSource: function () {
    var url = document.referrer;
    if (url.length === 0) return "src=direct";
    else if (url.indexOf(cwTracking.hostPath) < 0) return "src=" + url;

    return "";
  },

  addBhriguCookies: function () {
    var allCookies = document.cookie
      .split(";")
      .map(function (x) {
        return x.trim().split("=");
      })
      .reduce(function (a, b) {
        a[b[0]] = b[1];
        return a;
      }, {});
    var bhriguCookiesStr = "";
    var bhriguCookies = window.bhriguCookies.split(",");
    for (var i = 0; i < bhriguCookies.length; i++) {
      var bhriguCookie = bhriguCookies[i];
      var cookieValue = allCookies[bhriguCookie] || "";
      if (cookieValue !== "" && cookieValue !== undefined) {
        bhriguCookiesStr =
          bhriguCookiesStr + bhriguCookie + "=" + cookieValue + "; ";
      }
    }
    var bhriguCookieQs = encodeURIComponent(bhriguCookiesStr.trim());
    return "bhrigu_cookies=" + bhriguCookieQs;
  },

  getPageUrl: function () {
    var url = document.location.href;
    if (url.indexOf("?") >= 0) return "pi=" + url.split("?")[0];
    else if (url.indexOf("#") >= 0) return "pi=" + url.split("#")[0];
    else return "pi=" + url;
  },

  getQSFromUrl: function () {
    var url = document.location.href;
    var qs = "";
    if (url.indexOf("?") >= 0) {
      qs = url.split("?")[1];
    } else if (url.indexOf("#") >= 0) {
      qs = url.split("#")[1];
    }
    return this._processQs(qs);
  },

  _processQs: function (qs) {
    if (qs.length > 0) {
      qs = qs.replace(/&+/g, "|");
      return "qs=" + qs;
    } else return "";
  },

  getReferrer: function () {
    var url = document.referrer;
    var host = location.host;
    var referrer = "";
    if (url.length > 0 && url.indexOf(host) >= 0) {
      var relativePath = url.split(cwTracking.hostPath)[1];
      referrer += "ref=";
      if (!(relativePath === undefined || relativePath === null)) {
        referrer += relativePath.replace(/&+/g, "|");
      }
    }
    return referrer;
  },

  addToQS: function (qs, value) {
    if (qs.length > 0) qs += "&" + value;
    else qs = value;
    return qs;
  },

  getAttributeValue: function (type) {
    switch (type) {
      case "imp":
        return "cwti";
        break;
      case "click":
        return "cwtc";
        break;
      default:
        return "cwcti";
    }
  },

  getCompleteQS: function (node, type) {
    var cat,
      lbl,
      act,
      qs = "",
      attrValue = cwTracking.getAttributeValue(type),
      sendQS = false;
    if (node.is("[qs]")) sendQS = true;
    cat = node.data(attrValue + "cat");
    lbl = node.data(attrValue + "lbl");
    act = node.data(attrValue + "act");
    qs = cwTracking.getFinalQS(cat, act, lbl, sendQS);
    return qs;
  },

  addLabelToQsAndReturnQs: function (lbl, qs) {
    lbl = lbl + "|platformid=" + cwTracking.platform;
    qs = cwTracking.addToQS(qs, "lbl=" + lbl);
    return qs;
  },

  isValidQS: function (str) {
    return typeof str !== "undefined" && str.length > 0;
  },

  getSectionQS: function (qsObj) {
    var qs = "";
    if (cwTracking.isValidQS(qsObj.cat)) {
      qs = cwTracking.addToQS(qs, "cat=" + qsObj.cat);
    }
    if (cwTracking.isValidQS(qsObj.act)) {
      qs = cwTracking.addToQS(qs, "act=" + qsObj.act);
    }
    if (cwTracking.isValidQS(qsObj.lbl)) {
      qs = cwTracking.addLabelToQsAndReturnQs(qsObj.lbl, qs);
    }
    if (cwTracking.isValidQS(qsObj.src)) {
      qs = cwTracking.addToQS(qs, qsObj.src);
    }
    if (cwTracking.isValidQS(qsObj.pageUrl)) {
      qs = cwTracking.addToQS(qs, qsObj.pageUrl);
    }
    if (cwTracking.isValidQS(qsObj.ref)) {
      qs = cwTracking.addToQS(qs, qsObj.ref);
    }
    if (qsObj.sendQS) {
      if (cwTracking.isValidQS(qsObj.urlQs)) {
        qs = cwTracking.addToQS(qs, qsObj.urlQs);
      }
    }
    return qs;
  },

  getFinalQS: function (cat, act, lbl, sendQS) {
    var urlQs, qs;
    var bhriguCookieQs = cwTracking.addBhriguCookies();
    qs = this._commonQsTrackingProcess(cat, act, lbl);
    if (bhriguCookieQs != undefined && bhriguCookieQs.length > 0)
      qs = cwTracking.addToQS(qs, bhriguCookieQs);
    if (sendQS) {
      urlQs = cwTracking.getQSFromUrl();
      if (urlQs) qs = cwTracking.addToQS(qs, urlQs);
    }
    return qs;
  },

  _commonQsTrackingProcess: function (cat, act, lbl) {
    var src,
      pageUrl,
      ref,
      qs = "";
    src = cwTracking.getSource();
    pageUrl = cwTracking.getPageUrl();
    ref = cwTracking.getReferrer();
    if (cat !== undefined && cat.length > 0)
      qs = cwTracking.addToQS(qs, "cat=" + cat);
    if (act !== undefined && act.length > 0)
      qs = cwTracking.addToQS(qs, "act=" + act);
    if (lbl !== undefined && lbl.length > 0)
      qs = cwTracking.addToQS(qs, "lbl=" + lbl);
    if (src !== undefined && src.length > 0) qs = cwTracking.addToQS(qs, src);
    if (pageUrl !== undefined && pageUrl.length > 0)
      qs = cwTracking.addToQS(qs, pageUrl);

    if (ref !== undefined && ref.length > 0) qs = cwTracking.addToQS(qs, ref);
    return qs;
  },
  trackAction: function (actionEvent, actionCat, actionAct, actionLabel) {
    var pushObject;
    if (actionLabel)
      pushObject = {
        event: actionEvent,
        cat: actionCat,
        act: actionAct,
        lab: actionLabel,
      };
    else pushObject = { event: actionEvent, cat: actionCat, act: actionAct };
    setTimeout(function () {
      dataLayer.push(pushObject);
    }, 0);
  },
  trackCustomData: function (cat, act, lbl, sendQS) {
    var qs = cwTracking.getFinalQS(cat, act, lbl, sendQS);
    cwTracking.sendRequest(qs);
  },

  trackCustomDataV1: function (cat, act, lbl, sendQS) {
    var qs = cwTracking.getFinalQS(cat, act, lbl, sendQS);
    cwTracking.sendRequestV1(qs);
  },

  trackCustomDataWithQs: function (cat, act, lbl, currQs) {
    var qs = this._commonQsTrackingProcess(cat, act, lbl);
    if (currQs) {
      currQs = this._processQs(currQs);
      qs = cwTracking.addToQS(qs, currQs);
    }
    this.sendRequest(qs);
  },

  trackDataFromNode: function (node, type) {
    var qs = cwTracking.getCompleteQS(node, type);
    cwTracking.sendRequest(qs);
  },

  sendRequest: function (qs) {
    return;
    var bhriguCookieQs = cwTracking.addBhriguCookies();
    if (
      bhriguCookieQs != undefined &&
      bhriguCookieQs.length > 0 &&
      !qs.includes("bhrigu_cookies")
    )
      qs = cwTracking.addToQS(qs, bhriguCookieQs);
    if (qs.length > 0) qs = "&" + qs;
    var url = cwTracking.getHandlerUrl() + $.now() + qs;
    if (navigator && "sendBeacon" in navigator) {
      navigator.sendBeacon(url); // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
    } else {
      var img = new Image();
      img.src = url;
    }
  },

  sendRequestV1: function (qs) {
    var bhriguCookieQs = cwTracking.addBhriguCookies();
    if (
      bhriguCookieQs != undefined &&
      bhriguCookieQs.length > 0 &&
      !qs.includes("bhrigu_cookies")
    ) {
      qs = cwTracking.addToQS(qs, bhriguCookieQs);
    }
    if (qs.length > 0) qs = "&" + qs;
    var url = cwTracking.getHandlerUrl() + $.now() + qs;
    if (navigator && "sendBeacon" in navigator) {
      navigator.sendBeacon(url); // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
    } else {
      var img = new Image();
      img.src = url;
    }
  },

  getHandlerUrl: function () {
    return window.bhriguHost + "/bhrigu.gif?t=";
  },

  trackImpression: function () {
    $("[cwt]").unbind("inview");
    $("[cwt]").bind("inview", function (event, visible) {
      if (visible == true) {
        cwTracking.trackDataFromNode($(this), cwTracking.type.impression);
      } else {
        var node = $(this);
        node.unbind("inview");
        node.removeAttr("cwt");
      }
    });
  },

  trackInviewJcarouselImpression: function () {
    $(".jcarousel")
      .off("jcarousel:visiblein")
      .on("jcarousel:visiblein", "li", function () {
        var node = $(this).find("[data-role*='inview-imp']");

        if (node.length > 0) {
          cwTracking.callImpressionTracking(node);
        }
      });
  },

  trackInviewImpression: function () {
    $("[data-role*='inview-imp']").unbind("inview");
    $("[data-role*='inview-imp']").bind("inview", function (event, visible) {
      var node = $(this);

      if (node.closest(".jcarousel").length === 1 && visible === true) {
        if (
          node.closest(".jcarousel").jcarousel("visible").has(this).length > 0
        ) {
          cwTracking.callImpressionTracking(node);
        }
      } else if (visible === true) {
        cwTracking.callImpressionTracking(node);
      }
    });
  },

  trackPerformace: function () {
    var len = 0,
      action = "",
      performanceQS = "",
      performanceTimings;
    if (
      window.performance !== undefined &&
      window.performance.timing !== undefined
    ) {
      performanceTimings = JSON.stringify(window.performance.timing);
      performanceTimings = JSON.parse(performanceTimings);
      for (var prop in performanceTimings) {
        performanceQS += prop + "=" + performanceTimings[prop] + "|";
      }
      performanceQS += cwTracking.trackNavigatorString();
      len = performanceQS.length;
      if (len > 0) performanceQS = performanceQS.substr(0, len - 1);
      if (cwTracking.isMobileSite()) action = "Msite";
      else action = "DesktopSite";
      cwTracking.trackCustomData(
        "Performance",
        action,
        performanceQS || "NA",
        false
      );
    }
  },

  trackNavigatorString: function () {
    var navigatorObjString = "";
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined" &&
      typeof window.navigator.connection !== "undefined"
    ) {
      {
        var navigatorObject = window.navigator.connection;
        //Cannot use object.entries as navigator Object does not have its own properties
        for (var key in navigatorObject) {
          if (
            navigatorObject[key] !== null &&
            typeof navigatorObject[key] !== "function"
          )
            navigatorObjString += key + "=" + navigatorObject[key] + "|";
        }
      }
    }
    return navigatorObjString;
  },

  trackInviewGA: function (node) {
    var cat, lbl, act, role;
    cat = node.data("cat");
    lbl = node.data("label");
    act = node.data("action");
    role = node.data("role");
    if (role.indexOf("click") >= 0 && act.indexOf("shown") === -1) {
      act = act + "_shown";
    }
    if (cwTracking.isApp()) {
      cwTracking.trackActionForApp("CWNonInteractive", cat, act, lbl);
    } else {
      cwTracking.trackAction("CWNonInteractive", cat, act, lbl);
    }
  },
  isApp: function () {
    return window.navigator.userAgent.indexOf("NATIVE/WV") > -1;
  },
  isAndroid: function () {
    return (
      typeof Android !== "undefined" &&
      Android !== null &&
      typeof Android.sendEvent != "undefined"
    );
  },
  uiEvents: function () {
    var sourceLabel = "source=" + (cwTracking.isMobileSite() ? 43 : 1);
    cwTracking.trackCustomData("PageViews", "", sourceLabel, true);
    cwTracking.pageTracker = new TimeTracker("Timing", "Page");
    cwTracking.hasFocus = document.hasFocus();
    if (cwTracking.hasFocus) {
      cwTracking.pageTracker.startTimer(cwTracking.pageViewID);
    }
    if (cwTracking.isIOS()) {
      cwTracking.addIOSEventTracking();
    } else {
      cwTracking.addEventTracking();
    }
    $(document).on("click", "[data-cwtccat]", function () {
      cwTracking.trackDataFromNode($(this), cwTracking.type.click);
    });
    cwTracking.trackImpression();
    cwTracking.trackInviewImpression();
    cwTracking.trackInviewJcarouselImpression();
    $(document).ajaxComplete(function () {
      cwTracking.trackImpression();
      cwTracking.trackInviewImpression();
    });
  },
  eventTracking: function () {
    $(document).on("click", "[data-role='click-tracking']", function () {
      cwTracking.callTracking($(this));
    });
  },
  trackClicks: function () {
    $(document).on("click", "[data-role*='click']", function () {
      var _self = $(this);
      if (_self.data("role") == "click-tracking") return;
      var action = "_click";
      cwTracking.callTracking(_self, action);
    });
  },
  trackImpressions: function () {
    $("[data-role*='impression']").each(function (count, element) {
      var action = "_shown";
      cwTracking.callTracking($(this), action);
    });
  },
  callTracking: function (node, action) {
    if (action == undefined) action = "";
    try {
      var evCat = node.data("cat") ? node.data("cat") : "",
        evAct = node.data("action") ? node.data("action") + action : "",
        evLab = node.data("label") ? node.attr("data-label") : "",
        evEvent = node.data("event")
          ? node.data("event")
          : action === "_shown"
          ? "CWNonInteractive"
          : action === "_click"
          ? "CWInteractive"
          : "";
      cwTracking.trackAction(evEvent, evCat, evAct, evLab);
    } catch (e) {
      console.log(e);
    }
  },
  prepareLabel: function (trackingparam) {
    var label = "";
    if (trackingparam && typeof trackingparam == "object") {
      for (var property in trackingparam) {
        label = label + property + "=" + trackingparam[property] + "|";
      }
    }
    return label.substring(0, label.length - 1);
  },

  callImpressionTracking: function (node) {
    var role = node.data("role");
    if (role.indexOf("inview-imp") >= 0) {
      if (role.indexOf("rpt-imp") <= 0) {
        node.unbind("inview");
        node.data("role", role.replace("inview-imp", ""));
      }
      cwTracking.trackInviewGA(node);
      return true;
    }
    return false;
  },

  trackActionForApp: function (actionEvent, actionCat, actionAct, actionLabel) {
    var eventType = actionEvent === "CWInteractive";
    if (typeof Android !== "undefined" && Android !== null) {
      Android.sendEvent(actionCat, actionAct, actionLabel, eventType);
    } else {
      var eventData = {
        ActionCat: actionCat,
        Action: actionAct,
        Label: actionLabel,
        EventType: eventType,
      };
      window.webkit.messageHandlers.sendEvent.postMessage(
        JSON.stringify(eventData)
      );
    }
  },
  trackPageViewForApp: function (screenId, actionEvent) {
    var eventType = actionEvent === "CWInteractive";
    if (typeof Android !== "undefined" && Android !== null) {
      Android.sendView(screenId, eventType);
    } else {
      var eventData = {
        EventType: eventType,
        ScreenId: screenId,
      };
      window.webkit.messageHandlers.sendView.postMessage(
        JSON.stringify(eventData)
      );
    }
  },
  isSafari: function () {
    var userAgent = window.navigator.userAgent.toLowerCase();
    return userAgent.indexOf("safari") > -1 && userAgent.indexOf("chrome") < 0;
  },
  isIOS: function () {
    var userAgent = window.navigator.userAgent.toLowerCase();
    return userAgent.indexOf("ios") > -1 || cwTracking.isSafari();
  },
  // Adds tracking for chrome, firefox and uc
  addEventTracking: function () {
    // Need focus and blur because visibility change is not fired on alt + tab
    cwTracking.addFocusEvent();
    cwTracking.addBlurEvent();
    cwTracking.addVisibilityChange();
  },
  // Adds tracking for safari
  addIOSEventTracking: function () {
    cwTracking.addFocusEvent();
    cwTracking.addBlurEvent();
    cwTracking.addIOSPageHide();
  },
  addFocusEvent: function () {
    // On Click when page coming from blur state
    window.addEventListener("focus", function () {
      if (!cwTracking.pageTracker.isTimerPresent(cwTracking.pageViewID)) {
        cwTracking.pageTracker.startTimer(cwTracking.pageViewID);
      }
    });
  },
  addBlurEvent: function () {
    window.addEventListener("blur", function () {
      cwTracking.pageTracker.captureTimer(cwTracking.pageViewID);
      cwTracking.pageTracker.sendRequest();
    });
  },
  addIOSPageHide: function () {
    // Page Change/Unload
    window.addEventListener("pagehide", function () {
      cwTracking.pageTracker.captureTimer(cwTracking.pageViewID);
      cwTracking.pageTracker.sendRequest();
    });
  },
  addVisibilityChange: function () {
    window.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cwTracking.pageTracker.captureTimer(cwTracking.pageViewID);
        cwTracking.pageTracker.sendRequest();
      } else {
        cwTracking.pageTracker.startTimer(cwTracking.pageViewID);
      }
    });
  },
  };
})();

function TimeTracker(cat, act) {
  this.cat = cat;
  this.act = act;
  this.timeSpent = {};
  this.timeStart = {};
  this.pageUrl = cwTracking.getPageUrl();
  this.ref = cwTracking.getReferrer();
  this.urlQs = cwTracking.getQSFromUrl();
  this.src = cwTracking.getSource();
  this.lastReqTime = new Date().getTime();
  this.minRequestInterval = 500;
}

TimeTracker.prototype.isTimerPresent = function (identifier) {
  return this.timeStart.hasOwnProperty(identifier);
};

// Stores the current time for identifier which helps to calculate time spent
TimeTracker.prototype.startTimer = function (identifier) {
  if (!this.isTimerPresent(identifier)) {
    this.timeStart[identifier] = new Date().getTime();
  } else {
    console.warn("Timer already started");
  }
};

// Stores the timespent for the given identifier
// Calculates timespent based on current time
TimeTracker.prototype.captureTimer = function (identifier) {
  if (this.isTimerPresent(identifier)) {
    var currentTimeSpent =
      typeof this.timeSpent[identifier] === "undefined"
        ? 0
        : this.timeSpent[identifier];
    this.timeSpent[identifier] =
      new Date().getTime() - this.timeStart[identifier] + currentTimeSpent;
    delete this.timeStart[identifier];
  }
};

TimeTracker.prototype.reset = function () {
  this.timeSpent = {};
  this.timeStart = {};
  this.pageUrl = cwTracking.getPageUrl();
  this.ref = cwTracking.getReferrer();
  this.urlQs = cwTracking.getQSFromUrl();
  this.src = cwTracking.getSource();
};

// Resets timer and timespent for given identifier
TimeTracker.prototype.resetTimer = function (identifier) {
  if (this.timeSpent.hasOwnProperty(identifier)) {
    this.timeSpent[identifier] = 0;
    this.timeStart[identifier] = new Date().getTime();
  }
};

// Sends tracking request
// Keeps track of active timers
// Resets all timers
TimeTracker.prototype.sendRequest = function () {
  return true; //bhrigu request not sending as of now
  if (new Date().getTime() - this.lastReqTime < this.minRequestInterval) {
    this.reset();
    return false;
  }
  var lbl = Object.entries(this.timeSpent)
    .map(function (x) {
      return x[0] + "=" + x[1];
    })
    .join("|");
  if (lbl.length < 1) {
    return false;
  }
  var qsObj = {
    cat: this.cat,
    act: this.act,
    lbl: lbl,
    ref: this.ref,
    pageUrl: this.pageUrl,
    urlQs: this.urlQs,
    src: this.src,
    sendQS: true,
  };
  var qs = cwTracking.getSectionQS(qsObj);
  cwTracking.sendRequest(qs);
  this.reset();
  this.lastReqTime = new Date().getTime();
  return true;
};

$(window).on("load", function () {
  setTimeout(function () {
    cwTracking.trackPerformace();
  }, 100);
});

$(document).ready(function () {
  cwTracking.uiEvents();
  cwTracking.eventTracking();
  cwTracking.trackImpressions();
  cwTracking.trackClicks();
});
