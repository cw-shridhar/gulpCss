var recentStocksApiPath = "/api/recently-added-stocks/?cityId=";
var nocarImagePath = `${window.ImgdCDNHostURL}/0x0/cw/static/used/no-car-images.svg`;

function hideRecentlyAddedStocks() {
    $(".popularCars-usedCars").addClass("hide");
    $(".recentCars-usedCars-client").addClass("hide");
}

function getRecentlyAddedStocks(queryString) {
    var cityId = getValueFromQS("city", queryString);
    $.ajax({
        url: recentStocksApiPath + cityId,
        method: "GET",
        headers:{
        ServerDomain: "CarWale"
        },
        success: function (response) {
            if (!response || (response && response.length <= 0)) {
                return;
            }
            else {
                $(".recentCars-usedCars-client .carousal-wrapper").empty();
                var numberOfStocks = response.length;
                var recentlyAddedStocksHtmlBinding = [];
                $(".recentCars-usedCars-client .title-blk").text("Best Matched Cars");
                var cityName = Common.utils.getCookieByName("cd-city-ct");
                $(".recentCars-usedCars-client .view_all").prop("title","Used cars in " + cityName);
                for (var i = 0; i < numberOfStocks; i++) {
                    if(response[i].mainImageurl === "")
                    {
                        response[i].mainImageurl = nocarImagePath;
                    }
                    var rank = 1;
                    recentlyAddedStocksHtmlBinding
                        .push("<div class=\"carousal-slide swiper-slide-next\">" +
                            "<div class=\"swiper-card\" data-testing-id=\"Recently-Added-Cars-card\">" +
                            "<div class=\"siwper-inner latest_launch_cls\">" +
                            "<div class=\"swip-img\">" +
                            "<a href=\"" + response[i].url + "\"" +
                            "data-role=\"click-tracking\" data-event=\"CWInteractive\" " +
                            "data-cat=\"UsedCarSearch\" data-action=\"ClickedRecentlyAddedCars\"" +
                            "data-label=\"profile_no="+response[i].ProfileId+"|orderNumber="+rank+"\" title=\"" + response[i].carName + "\">" +
                            "<img src=\"" + response[i].mainImageurl+"\" class=\"lazyload load_img\" alt=\"Used " + response[i].carName +
                            " in " + response[i].cityName + "\"" +
                            "title=\"Used " + response[i].carName + " in " + response[i].cityName + "\">" +
                            "</a></div><div class=\"clear\"></div>" +
                            "<div class=\"populr\"><ul><li><strong>" +
                            "<a href=\"" + response[i].url + "\" class=\"carousal_carname\"" +
                            "data-role=\"click-tracking\" data-event=\"CWInteractive\"" +
                            "data-cat=\"UsedCarDetails\" data-action=\"ClickedRecentlyAddedCars\"" +
                            "data-label=\"profile_no="+response[i].ProfileId+"|orderNumber="+rank+"\"" +
                            "title=\"" + response[i].carName + "\">" + response[i].carName +
                            "</a></strong></li>" +
                            "<li class=\"prc_laks\"><span>" + response[i].price + " </span>" +
                            "<span class=\"price_subtext\"></span></li>" +
                            "<li><div class=\"km-fuel-yr\"><div class=\"km detail\">" +
                            "<div class=\"dot\"></div>" +response[i].km +" km" + "</div>" +
                            "<div class=\"fuel detail\"><div class=\"dot\"></div>"+response[i].fuel+"</div>" +
                            "<div class=\"yr detail\"><div class=\"dot\"></div>"+response[i].makeYear+"</div>"+
                            "</div></li>"+
                            "</ul></div></div></div></div>");
                    rank++;
                }
                $(".recentCars-usedCars-client .carousal-wrapper").append(recentlyAddedStocksHtmlBinding.join(""));
                $(".recentCars-usedCars-client").removeClass("hide");
            }
        }
    });
}