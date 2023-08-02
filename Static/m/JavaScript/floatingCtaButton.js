$(window).on("scroll", function () {
    if ($('.buttons_container').length == '1') {
        let floatingBtn = document.getElementsByClassName("floating_btn")[0];
        let makeName = floatingBtn.getAttribute("data-make");
        let modelName = floatingBtn.getAttribute("data-model");
        let campaignTargetType = parseInt(floatingBtn.getAttribute("data-targetType"));
        let cityName = GetCookieByName("cookie_ct_city");
        let areaName = GetCookieByName("cookie_cw_area_name");
        let cityId = GetCookieByName("cookie_cw_cityid");
        let cityAreaLabelText = leadFormPopup.getCityAreaLabelText(cityName, areaName, cityId);
        if ($(document).scrollTop() > 50) {
            $(".but-fexed").addClass("offer-active");
            try {
                $(".floating_btn").attr("data-label", leadFormPopup.getEventLabel(false, campaignTargetType, makeName, modelName, "_PrimarySplitCTA") + cityAreaLabelText);
                $(".floating_btn").attr("onclick", "leadFormPopup.click_camp_call(" + currentVersionId + ", " + splitFloatingProperty + ")");
            } catch (e) { }
        }
        else {
            $(".but-fexed").removeClass("offer-active");
            try {
                $(".floating_btn").attr("data-label", leadFormPopup.getEventLabel(false, campaignTargetType, makeName, modelName, "_PrimaryCTA") + cityAreaLabelText);
                $(".floating_btn").attr("onclick", "leadFormPopup.click_camp_call(" + currentVersionId + ", " + singleFloatingProperty + ")");
            } catch (e) { }
        }
    }
});

if ($('#price_btn_cta_modelverpq').length == '1') {
    $('#footer').css("margin-bottom", "49px");
}

function redirectToPic(id, modelUrlPic) {
    var cityId = GetCookieByName("cookie_cw_cityid");
    if (cityId) {
        if (!id) {
            id = urlParams.get("versionId");
        }
        if (!modelUrlPic) {
            modelUrlPic = window.location.href.split('?')[0];
        }
        if (id == null) {
            locationPopup.checkOnRoadPrice(modelUrlPic);
            return;
        }

        var cityMaskingName = "";

        var url = "/api/city/" + cityId;
        $.ajax({
            type: "GET",
            url: url,
            headers: { 'ServerDomain': 'CarWale' },
        })
            .done(function (res) {
                cityMaskingName = res.cityMaskingName;
                var url = modelUrlPic + "price-in-" + cityMaskingName + "/?v=" + id;
                window.location.href = url;
            })
            .fail(function () {
                var cityName = GetCookieByName("cookie_ct_city");
                cityName = cityName.toLowerCase().replace(" ", "-");
                var url = modelUrlPic + "price-in-" + cityName + "/?v=" + id;
                window.location.href = url;
                return;
            });
    }
    else {
        locationPopup.showLocationPopUp(false, false, function () {
            cityId = GetCookieByName("cookie_cw_cityid");
            if (!cityId) {
                return;
            }
            redirectToPic(id, modelUrlPic);
        });
    }
}