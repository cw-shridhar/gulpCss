!(function(e) {
    "function" == typeof define && define.amd ?
        define(["jquery"], e) :
        "object" == typeof exports ?
        (module.exports = e(require("jquery"))) :
        e(jQuery);
})(function(e) {
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
            left: d.pageXOffset || h.scrollLeft || a.body.scrollLeft
        };
    }

    function i() {
        if (f.length) {
            var i = 0,
                l = e.map(f, function(e) {
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
                        c.left < r.left + o.width ?
                        u || a.data("inview", !0).trigger("inview", [!0]) :
                        u && a.data("inview", !1).trigger("inview", [!1]);
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
        add: function(t) {
            f.push({ data: t, $element: e(this), element: this }), !l && f.length && (l = setInterval(i, 250));
        },
        remove: function(e) {
            for (var t = 0; t < f.length; t++) {
                var n = f[t];
                if (n.element === this && n.data.guid === e.guid) {
                    f.splice(t, 1);
                    break;
                }
            }
            f.length || (clearInterval(l), (l = null));
        }
    }),
    e(d).on("scroll resize scrollstop", function() {
            o = r = null;
        }), !h.addEventListener &&
        h.attachEvent &&
        h.attachEvent("onfocusin", function() {
            r = null;
        });
});

window.addEventListener("load", function () {
    analytics.eventTracking();
    analytics.trackImpressions();
}, false);

var analytics = (function() {
    return {
        eventTracking: function() {
            $(document).on("click", "[data-role='click-tracking']", function() {
                analytics.callTracking($(this));
            });
        },
        trackImpressions: function() {
            $("[cwt]").off("inview");
            $("[cwt]").get().forEach(function(entry, index, array) {
                if(analytics.isElementInViewport(entry)){
                    analytics.callTracking($(entry), "_shown");
                }
            });
            $("[cwt]").on("inview", function(event, visible) {
                if (visible == true) {
                    analytics.callTracking($(this), "_shown");
                } else {
                    var node = $(this);
                    node.off("inview");
                    node.on("cwt");
                }
            });
        },
        isElementInViewport: function(element) {
            var rect = element.getBoundingClientRect();
            return rect.bottom > 0 &&
                rect.right > 0 &&
                rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
                rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
        },
        firePageView: function(location, pageId) {
            if (typeof window !== "undefined") {
                const loc = location || window.location;
                window.dataLayer = window.dataLayer || [];
                const pageTitle = typeof document !== "undefined" ? document.title : "";
                const pagePath = loc.pathname + loc.search;
                const pageLocation = window.location.href + (pageId ? "?p=" + pageId : "");
                // window.dataLayer.push({
                //     event: "Pageview",
                //     pagePath: pagePath,
                //     pageTitle: pageTitle,
                //     pageLocation: pageLocation,
                // });
                ga('send', {
                    hitType: 'pageview',
                    page: pageLocation
                });
            }
        },
        callTracking: function(node, action) {
            if(node)
            {
                var bhriguEvCat = node.data("bhrigu-cat");
                if (bhriguEvCat) {
                    var bhriguEvAct = node.data("bhrigu-action")
                    ? node.data("bhrigu-action")
                    : "";
                    var bhriguEvLab = node.data("bhrigu-label")
                    ? node.data("bhrigu-label")
                    : "";
                    if (cwTracking && cwTracking.trackCustomDataV1 !== "undefined")
                    cwTracking.trackCustomDataV1(bhriguEvCat, bhriguEvAct, bhriguEvLab,false);
                }
            }
            try {
                var evCat = node.data("cat") ? node.data("cat") : "",
                    evAct = node.data("action") ? node.data("action") : "",
                    evLab = node.data("label") ? node.attr("data-label") : "",
                    evEvent = node.data("event") ?
                    node.data("event") :
                    action === "_shown" ?
                    "CWNonInteractive" :
                    action === "_click" ?
                    "CWInteractive" :
                    "";
                analytics.trackAction(evEvent, evCat, evAct, evLab);
            } catch (e) {
                console.log(e);
            }
        },
        trackAction: function(actionEvent, actionCat, actionAct, actionLabel) {
            var pushObject;

            if (actionLabel != undefined && actionLabel.length > 0)
                pushObject = {
                    event: actionEvent,
                    cat: actionCat,
                    act: actionAct,
                    lab: actionLabel,
                    transport: "beacon"
                };
            else
                pushObject = {
                    event: actionEvent,
                    cat: actionCat,
                    act: actionAct,
                    transport: "beacon"
                };

            if (typeof window !== "undefined") {
                ga('send', {
                    hitType: 'event',
                    eventCategory: pushObject.cat,
                    eventAction: pushObject.act,
                    eventLabel: pushObject.lab,
                    transport: 'beacon',
                    nonInteraction: pushObject.event === "CWNonInteractive" || pushObject.event === "CTNonInteractive"
                });
            }
        }
    }
})();

