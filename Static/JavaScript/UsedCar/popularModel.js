function hidePopularModels() {
    $(".popularCars-usedCars").addClass("hide");
    $(".popularCars-usedCars-client").addClass("hide");
}

function getPopularModels(queryString) {
    var cityId = getValueFromQS("city", queryString);
    $.ajax({
        url: "/buy-used-cars/api/used-popular-model/?cityId=" + cityId,
        method: "GET",
        success: function (response) {
            if (!response) {
                return;
            }
            else {
                $(".popularCars-usedCars-client .carousal-wrapper").empty();
                var numberOfModels = response.length;
                if (numberOfModels <= 0) {
                    return;
                }
                var popularModelsHtmlBinding = [];
                $(".popularCars-usedCars-client .title-blk").text("Popular Used Cars");
                var cityName = Common.utils.getCookieByName("cd-city-ct");
                $(".popularCars-usedCars-client .view_all").prop("title","Popular used cars in " + cityName);
                for (var i = 0; i < numberOfModels; i++) {
                    if(response[i].mainImageurl === "")
                    {
                        response[i].mainImageurl = `${window.ImgdCDNHostURL}/0x0/cw/static/used/no-car-images.svg`;
                    }
                    popularModelsHtmlBinding
                        .push("<div class=\"carousal-slide swiper-slide-next\">" +
                            "<div class=\"swiper-card\" data-testing-id=\"popular-" + response[i].carName + "\">" +
                            "<div class=\"siwper-inner latest_launch_cls\">" +
                            "<div class=\"swip-img\">" +
                            "<a href=\"" + response[i].url + "\"" +
                            "data-role=\"click-tracking\" data-event=\"CWInteractive\" " +
                            "data-cat=\"UsedCarSearch\" data-action=\"PopularModelClicked\"" +
                            "data-label=\"model_name=" + response[i].carName + "\" title=\"" + response[i].carName + "\">" +
                            "<img src=\"" + response[i].mainImageurl + "\" class=\"lazyload load_img\" alt=\"Used " + response[i].carName +
                            " in " + response[i].cityName + "\"" +
                            "title=\"Used " + response[i].carName + " in " + response[i].cityName + "\">" +
                            "</a></div><div class=\"clear\"></div>" +
                            "<div class=\"populr\"><ul><li><strong>" +
                            "<a href=\"" + response[i].url + "\" class=\"carousal_carname\"" +
                            "data-role=\"click-tracking\" data-event=\"CWInteractive\"" +
                            "data-cat=\"UsedCarDetails\" data-action=\"PopularModelClicked\"" +
                            "data-label=\"model_name=" + response[i].carName + "\"" +
                            "title=\"" + response[i].carName + "\">" + response[i].carName +
                            "</a></strong></li>" +
                            "<li class=\"prc_laks\"><span>" + response[i].price + " </span>" +
                            "<span class=\"price_subtext\">" + response[i].priceSubText + "</span></li>" +
                            "</ul></div></div></div></div>");
                }
                $(".popularCars-usedCars-client .carousal-wrapper").append(popularModelsHtmlBinding.join(""));
                $(".popularCars-usedCars-client").removeClass("hide");
            }
        }
    });
}
