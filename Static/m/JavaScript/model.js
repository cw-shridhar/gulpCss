var subpage2 = "home";
var urlParams = new URLSearchParams(window.location.search);
var parameter = urlParams.get("q");

//todo : enbale this to lazy oad btf scrpts
//window.addEventListener( LOADBTFSCRIPTS, () => { loadLocalScripts(BTFJSFILES) } );
$(document).ready(function () {
    GetGlobalSearchCampaigns.bindRecentlyViewModels(makeName, modelName, currentModelId);
    if (parameter === 'lead') {
        var versionId = urlParams.get("lead_id");
        var propertyId = urlParams.get("property_id");
        window.history.pushState({}, "", window.location.href.split("?")[0]);
        leadFormPopup.click_camp_call(versionId, propertyId);
    }
    else if (parameter === 'city') {
        redirectToPic();
    }
    else if(parameter === 'dealer') {
        locationPopup.showLocationPopUp(true, true, redirectToNewCityDealerDetails);
    }

    //fire impression tracking events
    const lead = "-Model_NewCarLead";
    let category = "Mobile" + lead;
    if(window.isAndroidWebView === "True") {
        category = "Android" + lead;
    } else if (window.isIosWebView === "True") {
        category = "Ios" + lead;
    }
    leadFormTracking.fireCampaignCallEvent(true, category, "NewCarLeadCampaignCalled_on_PageLoad", leadFormPopup.getEventLabel(true, campaignTargetType, makeName, modelName));
    leadFormTracking.fireCampaignReturnEvent(true, category, makeName, modelName, campaignTargetType);

    // Header logic
    var hclass = "";
    if (subpage2 == "home" || subpage2 == "price_seo" || subpage2 == "price") {
        hclass = "active";
    } else {
        var left_space = $('.overall-specs-tabs-container ul li.active').offset().left;
    }
    function a() {
        $("#bw-header").addClass("fixed"),
            $("#bw-header").show(),
            $("body").addClass("listing-navbar-active")
    }
    function e(a) { }
    var t = $(window)
        , s = $("#listItemsFooter")
        , o = $(".overall-specs-tabs-container")
        , l = $("#makeOverallTabsWrapper")
        , r = $("#makeSpecsFooter")
        , i = o.height();
    $(".overall-specs-tabs-wrapper li").length - 1 < 2 && $(".overall-specs-tabs-wrapper li").css({
        display: "inline-block",
        width: "auto"
    }),
        l.find(".overall-specs-tabs-wrapper li").first().addClass(hclass),
        $(window).on("scroll", function () {
            function d(a, t, s) {
                if (n > f) {
                    $("#overallSpecsTab").css("display", "none");
                    if ($("#overallSpecsTab2").hasClass("fixed-tab-nav") && n > b - i) {
                        $("#overallSpecsTab2").css("display", "none");
                    } else {
                        $("#overallSpecsTab2").css("display", "block");
                        if (subpage2 == 'color' || subpage2 == 'mileage' || subpage2 == 'images' || subpage2 == 'reviews' || subpage2 == 'price' || subpage2 == 'price_seo') {
                            $('.footer_navi').waypoint(function () {
                                $("#overallSpecsTab2").removeClass("fixed-tab-nav");
                                $("#overallSpecsTab2").css("display", "none");
                            });
                        }
                        $("#overallSpecsTab2").addClass("fixed-tab-nav");
                    }
                }
                if (n < f) {
                    $("#overallSpecsTab").css("display", "block");
                    $("#overallSpecsTab2").css("display", "none");
                    if ($("#overallSpecsTab2").hasClass("fixed-tab-nav")) {
                        $("#overallSpecsTab2").removeClass("fixed-tab-nav");
                    }
                }
            }
            var n = t.scrollTop()
                , c = s.offset().top
                , f = l.offset().top
                , b = r.offset().top;
            $("#bw-header").offset().top > 90 ? n > $("#bw-header").offset().top && a() : $("#bw-header").offset().top < 90 && a(),
                $("body").hasClass("listing-navbar-active") && (n > c - 120 ? ($("#bw-header").removeClass("fixed"),
                    $("body").removeClass("listing-navbar-active")) : (0 == n || n < 100) && ($("#bw-header").removeClass("fixed"),
                        $("body").removeClass("listing-navbar-active"))),
                n > f ? o.addClass("fixed-tab-nav") : n < f && o.removeClass("fixed-tab-nav"),
                o.hasClass("fixed-tab-nav") && n > b - i && o.removeClass("fixed-tab-nav"),
                $("#makeTabsContentWrapper .bw-model-tabs-data").each(function () {
                    var a = $(this).offset().top - o.height()
                        , e = a + $(this).outerHeight();
                    if (n >= a && n <= e) {
                        o.find("li").removeClass("active"),
                            $("#makeTabsContentWrapper .bw-mode-tabs-data").removeClass("active"),
                            $(this).addClass("active");
                        var t = o.find('li[data-tabs="#' + $(this).attr("id") + '"]');
                        o.find(t).addClass("active")
                    }
                });
            var v = $("#makeTabsContentWrapper")
                , p = v.find(".bw-model-tabs-data:eq(3)")
                , h = v.find(".bw-model-tabs-data:eq(6)")
                , m = v.find(".bw-model-tabs-data:eq(9)");
            0 != p.length && d(p, 250, 0),
                0 != h.length && d(h, 500, 250),
                0 != m.length && d(m, 750, 500)
        }),
        $.scrollToTop = function () {
            $("body,html").animate({
                scrollTop: 0
            }, 1e3)
        }
        ,
        $(".overall-specs-tabs-wrapper li").click(function () { })
});
