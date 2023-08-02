var currentPageId = 1;
var loadedPages = [];

if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
}

/*global recentlyViewedCars, analytics, $, selectedMakesId, slider */
/*eslint no-undef: "error"*/

function throttle(fn, threshhold, scope) {
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
}

var stockList = (function () {
    var bindData = function (xhttp) {
        var div = document.createElement("div");
        div.innerHTML += xhttp.responseText;
        document.getElementById("stockListContent").append(div);

        swiperSelector = "#searchResults_" + currentPageId + " .swiper-container";
        var swiper = new Swiper(swiperSelector, {
            pagination: ".swiper-pagination",
            paginationClickable: true,
            loop: true,
            preloadImages: true,
            lazyLoading: true
        });
    };

    var fetchNextPageData = function () {
        currentPageId = parseInt(currentPageId);
        if (!loadedPages.includes(currentPageId)) {
            loadedPages.push(currentPageId);
            var lcr = 0;
            var lcrElement = document.getElementById("lcr");
            if (lcrElement) {
                lcr = lcrElement.innerText.trim() || 0;
                lcrElement.remove();
            }
            showSkeleton();
            hideComponentsBelowStocklist();
            var queryStringForStockListPage = stockList.GetFilterValues();
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    currentPageId = currentPageId + 1;
                    bindData(xhttp);
                    hideSkeleton();
                    showComponentsBelowStocklist();
                    if (checkFncIsDefined(buyerFormV2Msite.getFavouritesFromStorage)) {
                        buyerFormV2Msite.getFavouritesFromStorage();
                    }
                    analytics.firePageView(null, currentPageId);
                }
                stockList.selectLeadButtonText();
                analytics.eventTracking();
                analytics.trackImpressions();
            }
            var nextpageNumber = parseInt(currentPageId) + 1;
            queryStringForStockListPage = queryStringForStockListPage + (nextpageNumber > 0 ?("&pn=" + nextpageNumber):"") + "&isnextpage=true" +
            (lcr > 0 ?("&lcr=" + lcr):"");
            const queryObject = queryStringToJSON(queryStringForStockListPage);
            queryObject.deferredDealers = getDeferredDealerIds();
            if(queryObject.additionaltags)
            {
                queryObject.additionaltags = queryObject.additionaltags.split(" ");
            }
            queryObject.segmentIds = $("#segment-ids").html();
            var excludedStocks = document.getElementById("excluded-stocks");
            queryObject.excludeStocks = excludedStocks.innerHTML.trim().replaceAll("+", " ");
            xhttp.open("POST", "/buy-used-cars/api/stocks/filters/" , true);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=utf-8");
            xhttp.send(JSON.stringify(queryObject));
        }
    };

    return {
        fetchNextPageData: fetchNextPageData,
        isElementInViewPort: function (currentPageId) {
            var elementId = ".fetch-next-page-" + currentPageId;
            var el = document.querySelector(elementId);
            if (el) {
                return window.scrollY /
                    (document.documentElement.scrollHeight - window.innerHeight) > 0.8;
            }
            return false;
        },
        selectLeadButtonText: function () {
            var coo = {};
            try {
                coo = formcookies();
            } catch (error) {
                var cookies = {};
                if (document.cookie && document.cookie != '') {
                    var split = document.cookie.split(';');
                    for (var i = 0; i < split.length; i++) {
                        var name_value = split[i].split("=");
                        name_value[0] = name_value[0].replace(/^ /, '');
                        cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
                    }
                }
                coo = cookies;
            }
            if (coo['cookie_buyform_mobile']) {
                $(".get-seller-details").html("1-CLICK&nbsp;VIEW DETAILS");
            } else {
                $(".get-seller-details").html("CONTACT SELLER");
            }
        },
        getCertificationFilter:function(selectedListFilters){
            //this method is used to get the additional filter values which are applied
            //in case no additional filters are applied it returns emty string
            //eg: additional filters include : certified, absure, cars with only photo
            // this method will return these filters
            var certified = $('input[name="certification"]:checked').val();
            if(certified!=="" && certified!=="0"){
            selectedListFilters["certification"] = certified;
            }
            let checkedCarPicSelector = $('input[name="car_pic"]:checked')
            let allCarPhotos = checkedCarPicSelector && checkedCarPicSelector.val() ? checkedCarPicSelector.val() : "";
            if(allCarPhotos!=="" && allCarPhotos!=="0"){
                if(typeof (selectedListFilters["certification"])!=="undefined")
                {
                    selectedListFilters["certification"] += "+"+allCarPhotos;
                }
                else{
                    selectedListFilters["certification"] = allCarPhotos;
                }
            }
        },
        GetFilterValues: function () {
            var selectedListFilters = [];
            selectedListFilters["fltr_city"] = $('input[name="city"]:checked').attr('id');
            stockList.getCertificationFilter(selectedListFilters);
            $('input[name="fuel[]"]:checked').each(function () {
                selectedListFilters["fuel"] = selectedListFilters["fuel"] ? selectedListFilters["fuel"] + "+" + $(this).val() : $(this).val();
            });
            let modelList = [];
            let shouldSkipMakeMapping = {};
            $('input[name="models"]:checked').each(function () {
                let makeModelValue = $(this).attr('value');
                if(!makeModelValue || makeModelValue.length <= 0)
                {
                    return;
                }
                let [ makeId ] = makeModelValue.split(".").map(Number);
                let modelId = parseInt(makeModelValue.split(".")[1], 10);
                if(modelId === 0)
                {
                    shouldSkipMakeMapping[makeId] = true;
                }
                else
                {
                    shouldSkipMakeMapping[makeId] = shouldSkipMakeMapping[makeId] ? true : false;
                }
                if(!shouldSkipMakeMapping[makeId])
                {
                    modelList.push(makeModelValue);
                }
            });
            selectedListFilters["models"] = modelList.join("+");
            selectedListFilters["makeOnly"] = Object.keys(shouldSkipMakeMapping).filter(m => shouldSkipMakeMapping[m]).join("+");
            selectedMakesId = Object.keys(shouldSkipMakeMapping).map(String);
            $('input[name="gearbox[]"]:checked').each(function () {
                selectedListFilters["gear"] = selectedListFilters["gear"] ? selectedListFilters["gear"] + "+" + $(this).attr('data-value') : $(this).attr('data-value');
            });

            selectedListFilters["additional-tags"] = "";
            $('input[name="additional-tags"]:checked').each(function () {
                if(selectedListFilters["additional-tags"])
                {
                    selectedListFilters["additional-tags"]  = selectedListFilters["additional-tags"] + "+" + $(this).val()
                }
                else{
                    selectedListFilters["additional-tags"] =  $(this).val();
                }
            });
            selectedListFilters["price"] = slider ? slider.getRangeOfSlider({sliderId: "price" }) : "";
            selectedListFilters["age"] = slider.getRangeOfSlider({sliderId: "age" });
            selectedListFilters["color"] = "";
            $('input[name="filter-colors"]:checked').each(function () {
                if(selectedListFilters["color"])
                {
                    selectedListFilters["color"]  = selectedListFilters["color"] + "+" + $(this).val()
                }
                else{
                    selectedListFilters["color"] =  $(this).val();
                }
            });
            selectedListFilters["kms"] = $('input[name="kms_range[]"]:checked').val();
            $('input[name="bodytype[]"]:checked').each(function () {
                selectedListFilters["btype"] = selectedListFilters["btype"] ? selectedListFilters["btype"] + "+" + $(this).val() : $(this).val();
            });
            $('input[name="car_owner[]"]:checked').each(function () {
                selectedListFilters["owner"] = selectedListFilters["owner"]
                    ? selectedListFilters["owner"] + "+" + $(this).val()
                    : $(this).val();
            });
            var sortFilter = "so=-1&sc=-1";
            $("input[name=\"sortv\"]:checked").each(function () {
                let { sc, so } = sortUtils.getSortValue($(this).val());
                sortFilter = "so=" + so + "&sc=" + sc;
            });
            var queryStringForStockListPage = "";
            if (selectedListFilters["fltr_city"]) {
                queryStringForStockListPage += "&city=" + selectedListFilters["fltr_city"];
            }
            if (selectedListFilters["certification"]) {
                queryStringForStockListPage += "&filterbyadditional=" + selectedListFilters["certification"];
            }
            if (selectedListFilters["price"]) {
                queryStringForStockListPage += "&budget=" + selectedListFilters["price"];
            }
            if (selectedListFilters["fuel"]) {
                queryStringForStockListPage += "&fuel=" + selectedListFilters["fuel"];
            }
            if (selectedListFilters["kms"]) {
                queryStringForStockListPage += "&kms=" + selectedListFilters["kms"];
            }
            if (selectedListFilters["age"]) {
                queryStringForStockListPage += "&year=" + selectedListFilters["age"];
            }
            if(selectedListFilters["additional-tags"]){
                queryStringForStockListPage += "&additionaltags=" + selectedListFilters["additional-tags"];
            }
            if(selectedListFilters["color"]){
                queryStringForStockListPage += "&color=" + selectedListFilters["color"];
            }

            queryStringForStockListPage += getQueryStringForCar(
                {
                    selectedMakes: selectedListFilters["models"],
                    selectedModels: selectedListFilters["makeOnly"]
                }
            );
            if (!selectedListFilters["models"] && document.getElementById("carFromUrl").value != "0") {
                selectedListFilters["models"] = document.getElementById("carFromUrl").value;
                if (selectedListFilters["models"] !== "") {
                    queryStringForStockListPage += "&car=" + selectedListFilters["models"];
                }
            }
            if (selectedListFilters["makeOnly"] && selectedListFilters["makeOnly"] !== "0") {
                if(queryStringForStockListPage.includes("car="))
                {
                    var selectedMakes = selectedListFilters["makeOnly"].split("+");
                    selectedMakes = selectedMakes.filter( function( make ) {
                        return selectedMakesId.indexOf( make ) < 0;
                      } );
                    if(selectedMakes.length > 0)
                    {
                        queryStringForStockListPage += "+" + selectedMakes.join("+");
                    }
                }
                else {
                    queryStringForStockListPage += "&car=" + selectedListFilters["makeOnly"];
                }
            }
            if (selectedListFilters["gear"]) {
                queryStringForStockListPage += "&trans=" + selectedListFilters["gear"];
            }
            if (selectedListFilters["btype"]) {
                queryStringForStockListPage += "&bodytype=" + selectedListFilters["btype"];
            }
            if (selectedListFilters["owner"]) {
                queryStringForStockListPage += "&owners=" + selectedListFilters["owner"];
            }
            var queryString = ""
            if (queryStringForStockListPage !== "") {
                queryString = queryStringForStockListPage + "&" + sortFilter
            } else {
                queryString = "&"+sortFilter
            }
            return queryString;
        },
    };
})();

var hideComponentsBelowStocklist = function() {
    document.getElementsByClassName("faq-section-wrapper")[0].classList.add("hide");
    document.getElementsByClassName("breadcrumbs")[0].classList.add("hide");
    document.getElementsByClassName("footer")[0].classList.add("hide");
}

var showSkeleton = function() {
    document.getElementById("skeleton-loader-wrapper").classList.remove("hide");
}

var showComponentsBelowStocklist = function() {
    document.getElementsByClassName("faq-section-wrapper")[0].classList.remove("hide");
    document.getElementsByClassName("breadcrumbs")[0].classList.remove("hide");
    document.getElementsByClassName("footer")[0].classList.remove("hide");
}

var hideSkeleton = function() {
    document.getElementById("skeleton-loader-wrapper").classList.add("hide");
}

var loadDataThrottled = throttle(function () {
    if (stockList.isElementInViewPort(currentPageId)) {
        stockList.fetchNextPageData();
    }
}, 100);

window.addEventListener('scroll', loadDataThrottled);

window.addEventListener('DOMContentLoaded', function (e) {
    if (document.getElementById("currentPageNumber")) {
        currentPageId = document.getElementById("currentPageNumber").value;
    }
    var hiddenStockCountElem = document.getElementById("hiddenTotalStockCount");
    var stockCount = parseInt(hiddenStockCountElem.innerHTML.trim(), 10);
    if (typeof recentlyViewedCars !== "undefined" && stockCount <= 10) {
        // empty string is passed for excluded profile Id on search page call
        // since we can show any stock irrespective of profile id
        recentlyViewedCars.callRecentlyViewedCarsApi("", "msiteSearchPage");
    }
    stockList.selectLeadButtonText();
});

window.onpopstate = function () {
    window.redirectToWhatsapp = null;
    buyerFormV2Msite.skipRecommendations();
}

function getQueryStringForCar({ selectedMakes, selectedModels})
{
    let queryString = ""
    if(selectedMakes)
    {
        queryString += "&car=" + selectedMakes;
    }
    if(selectedModels && !selectedMakes)
    {
        queryString += "&car=" + selectedModels;
    }
    else if(selectedModels && selectedMakes)
    {
        queryString += "+" + selectedModels;
    }
    return queryString;
}

