var selectedFilters = {};
var selectedMakesId = [];
var queryStringForListPage = "";
const FILTER_KEYS = ["bodytype", "budget", "car", "city", "filterbyadditional",
                    "fuel", "kms", "owners", "trans", "year" , "color"];
let USED_FILTER_ENUM = {
    CITY: "city",
    VERIFIED_CARS: "verifiedCars",
    FUEL: "fuel",
    KMS: "kms",
    TRANSMISSION: "transmission",
    BODY_TYPE: "bodyType",
    OWNERS: "owners",
    COLORS: "colors",
    PICTURES: "pictures"
};
let previousSelectedCityName = $("#cityName").val();
/*global recentlyViewedCars, analytics, fireTrackingForAppliedFilters, $, slider, resetSliders, getFilterFromQueryParams, initializeFilters, USED_FILTER_ENUM, previousSelectedCityName */
/*eslint no-undef: "error"*/

function bindCitiesInDOM(data) {
    var clist = '';
    for (var index in data.PopularCities) {
        clist += '<li data-testing-id="city-name" class="static citylistopt" data-title="' + data.PopularCities[index].CityMaskingName + '" data-title1="new" data-title2="' + data.PopularCities[index].CityMaskingName + '"><label><span> \
        '+ data.PopularCities[index].CityName + ' \
    </span><span class="radiobtn"><input type="radio" name="city" id="' + data.PopularCities[index].CityId + '" value="' + data.PopularCities[index].CityName + '" data-testing-id="' + data.PopularCities[index].CityMaskingName + '" \
     onclick="filterSelection(this.id, this.name);"></span></label></li>';
    }
    for (var index in data.OtherCities) {
        clist += '<li class="static citylistopt" data-title="' + data.OtherCities[index].CityMaskingName + '" data-title1="new" data-title2="' + data.OtherCities[index].CityMaskingName + '"><label><span> \
        '+ data.OtherCities[index].CityName + ' \
    </span><span class="radiobtn"><input type="radio" name="city" id="' + data.OtherCities[index].CityId + '" value="' + data.OtherCities[index].CityName + '" data-testing-id="' + data.OtherCities[index].CityMaskingName + '" \
     onclick="filterSelection(this.id, this.name);"></span></label></li>';
    }
    $("#filt_ul_city").html(clist);
    var selectedCityId = $("#cityIdFromParams");
    if (selectedCityId) {
        let selectedCityRadioInput = $('input[type=radio][name=city][id=' + selectedCityId.val() + ']');
        if (selectedCityRadioInput) {
            selectedCityRadioInput.prop('checked', true);
            $("#city_cnt_id").text(1);
            $("#city_cnt").css("display", "table");
        }
    }
}
function getCitiesList() {
    $.ajax({
        url: '/buy-used-cars/api/getallcities/',
        type: 'get',
        contentType: "application/json",
        success: function (data) {
            bindCitiesInDOM(data)
        }
    });
}

function show_hide(vb) {
    try {
        _scroll_value = document.body.scrollTop;
        $('#_scorll_value').val(_scroll_value);

        $('.mcontainer1').removeClass('opened');
        $('.mslider').addClass('closed');
        $('.filterHead').removeClass('sort-filter')
        $('.popup-close-button').removeClass('sort-popup-close')
        $('.btn-filter').removeClass('sort-btn-filter')

        if (document.getElementById(vb).style.display == 'block') {
            //  document.getElementById("filterdisplay").style.display = "block";        	  
            document.getElementById("filtrdiv").style.display = "none";
            document.getElementById(vb).style.display = "none";
            document.getElementById("filter_heading").innerHTML = "Filter by";
            $('#fix3').removeClass('active-head');
            //document.getElementById("wrapper").display = "block";
            document.getElementById("wrapper").style.backgroundColor = "#f0f0f0";
        } else {
            document.getElementById("closeFloatbarId4").style.display = "table";
            document.getElementById("closeFloatbarId3").style.display = "none";
            document.getElementById("filtrdiv").style.display = "block";
            document.getElementById(vb).style.display = "block";
            document.getElementById("filter_heading").innerHTML = "Filter by";

            //document.getElementById("wrapper").display = "none";
            document.getElementById("wrapper").style.backgroundColor = "#3b3b3b";
            let defaultTabOnFilterOpen = "certification";
            filtTabShow(defaultTabOnFilterOpen, 1);
            //handle model
            var modelSelected = document.getElementById("modelFromUrl").value;
            var makeSelected = document.getElementById("makeFromUrl").value;
            if (modelSelected && modelSelected !== "0") {
                var makeDetails = {};
                makeDetails.id = makeSelected;
                makeDetails.selectedModel = modelSelected;
                getdpModels(makeDetails);
            }
            else
            {
                setModelCheckboxValue({shouldSetCollapsibleState: true});
                handleMmvCount();
            }
            // call city api
            getCitiesList();
            setAbsureFilter();
            initializeOtherFilters();
            handleCNT();
        }
        // setPopupHistory("#" + vb);
        //setselectpiccnt();
        disableScroll();
    } catch (e) { }
}

function initializeOtherFilters()
{
    let otherFilters = [
        USED_FILTER_ENUM.FUEL,
        USED_FILTER_ENUM.KMS,
        USED_FILTER_ENUM.TRANSMISSION,
        USED_FILTER_ENUM.BODY_TYPE,
        USED_FILTER_ENUM.COLORS,
        USED_FILTER_ENUM.PICTURES,
        USED_FILTER_ENUM.OWNERS
    ];
    otherFilters.forEach(
        filter => {
            initializeFilters(filter);
        }
    )
}

function setAbsureFilter() {
    initializeFilters("verifiedCars");
    return;
}

function handleMmvCount()
{
    let makeCountText = $("#make_cnt_id");
    let makeCount = $("#make_cnt");
    if(!makeCountText || !makeCount)
    {
        return;
    }
    let modelList = [];
    let makeOnlyList = [];
    let skipMakeId = 0;
    $('input[name="models"]:checked').each(function () {
        let makeModelValue = $(this).attr('value');
        if(!makeModelValue)
        {
            return;
        }
        let [makeId, modelId] = makeModelValue.split(".").map(Number);
        if(modelId === 0)
        {
            skipMakeId = makeId;
            if(!isNaN(makeId))
            {
                makeOnlyList.push(makeId);
            }
        }
        if(!isNaN(modelId) && makeId !== skipMakeId)
        {
            modelList.push(makeModelValue);
        }
    });
    let selectedCount = makeOnlyList.length + modelList.length;
    if(selectedCount > 0)
    {
        makeCountText.text(selectedCount);
        makeCount.css("display", "table");
    }
    else
    {
        makeCount.hide();
    }
}

function handleCNT() {
    const DISPLAY_TABLE = "table", DISPLAY_NONE = "none";
    handleMmvCount();
    let selectedPrice;
    selectedPrice = slider ? slider.getRangeOfSlider({ sliderId: "price" }) : "";
    if (selectedPrice) {
        document.getElementById("price_cnt_id").innerText = selectedPrice ? 1 : "";
        document.getElementById("price_cnt").style.display = DISPLAY_TABLE;
    }
    else
    {
        document.getElementById("price_cnt_id").innerText = "";
        document.getElementById("price_cnt").style.display = DISPLAY_NONE;
    }
    var selectedCityLength = $('input[name="city"]:checked').val();
    document.getElementById("city_cnt_id").innerText = selectedCityLength ? "1 " : "";
    document.getElementById("city_cnt").style.display = selectedCityLength ? DISPLAY_TABLE : DISPLAY_NONE;
    var selectedFuelLength = $('input[name="fuel[]"]:checked').length;
    document.getElementById("fuel_cnt_id").innerText = selectedFuelLength ? selectedFuelLength : "";
    document.getElementById("fuel_cnt").style.display = selectedFuelLength ? DISPLAY_TABLE : DISPLAY_NONE;
    var selectedKMS = $('input[name="kms_range[]"]:checked').val();
    if (selectedKMS) {
        document.getElementById("kms_cnt_id").innerText = 1;
        document.getElementById("kms_cnt").style.display = DISPLAY_TABLE;
    }
    else
    {
        document.getElementById("kms_cnt_id").innerText = "";
        document.getElementById("kms_cnt").style.display = DISPLAY_NONE;
    }
    let selectedAge;
    selectedAge = slider ? slider.getRangeOfSlider({ sliderId: "age" }) : "";
    if (selectedAge) {
        document.getElementById("age_cnt_id").innerText = selectedAge ? 1 : "";
        document.getElementById("age_cnt").style.display = DISPLAY_TABLE;
    }
    else
    {
        document.getElementById("age_cnt_id").innerText = "";
        document.getElementById("age_cnt").style.display = DISPLAY_NONE;
    }
    var selectedModes = $('input[name="gearbox[]"]:checked').length;
    document.getElementById("trans_cnt_id").innerText = selectedModes ? selectedModes : "";
    document.getElementById("trans_cnt").style.display = selectedModes ? DISPLAY_TABLE : DISPLAY_NONE;
    var selectedBTypes = $('input[name="bodytype[]"]:checked').length;
    document.getElementById("btype_cnt_id").innerText = selectedBTypes ? selectedBTypes : "";
    document.getElementById("btype_cnt").style.display = selectedBTypes ? DISPLAY_TABLE : DISPLAY_NONE;
    var selectedOwners = $('input[name="car_owner[]"]:checked').length;
    document.getElementById("owner_cnt_id").innerText = selectedOwners ? selectedOwners : "";
    document.getElementById("owner_cnt").style.display = selectedOwners ? DISPLAY_TABLE : DISPLAY_NONE;
    updateVerifiedCarsFilterCounts();
    updateColorFiltersCounts();
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}
// var _global_slug = "";
// var i = 0;
// function setPopupHistory(slug) {
//     _global_slug = slug;
//     window.history.pushState("popup", "popup", slug);
// }
function filtTabShow(tname) {
  var filtlist = [
    "city",
    "make",
    "certification",
    "price",
    "fuel",
    "kms",
    "age",
    "trans",
    "btype",
    "pic",
    "owner"
  ];
  filtlist.push("colors");
  for (i in filtlist) {
    var currFiltElement = document.getElementById("filt_" + filtlist[i]);
    if (!document.getElementById("filt_" + filtlist[i])) {
      continue;
    }
    document.getElementById("filt_" + filtlist[i]).style.display = "none";
    document.getElementById("filter_" + filtlist[i]).className = "tablink";
  }
  if (!document.getElementById("filt_" + tname)) {
    return;
  }
  document.getElementById("filt_" + tname).style.display = "block";
  document.getElementById("filter_" + tname).className = "tablink activetab";
  upMeAlways(tname);
}

function getParameterByName(name) {
    var url = url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function upMeAlways(tname) {
    document.getElementById("filt_" + tname).children[0].scrollTop = 0;
    if (tname == "make") {
        $('#filt_ul_' + tname + ' li').first().focus();
    } else {
        $('#filt_' + tname + ' ul li:first input').focus();
    }
    let sliderIds = slider ? slider.getAllSliderIds() : [];
    if(Array.isArray(sliderIds) && sliderIds.includes(tname))
    {
        slider.setSlider({ sliderId: tname });
    }
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

function show_hide_sort_function() {
    try {
        _scroll_value = document.body.scrollTop;
        $('#_scorll_value').val(_scroll_value);
        $('.mcontainer1').removeClass('opened');
        $('.mslider').addClass('closed');
        $('.filterHead').addClass('sort-filter')
        $('.popup-close-button').addClass('sort-popup-close')
        $('.btn-filter').addClass('sort-btn-filter')

        document.getElementById("filter_heading").innerHTML = "Sort by";
        document.getElementById("closeFloatbarId4").style.display = "none";
        // $('#fix3').addClass('active-head');
        // document.getElementById("filterdisplay").style.display = "none";
        // document.getElementById("closeFloatbarId3").style.display = "block";
        document.getElementById("closeFloatbarId3").style.display = "none";
        document.getElementById("filtrdiv").style.display = "block";
        document.getElementById("filtoptdiv").style.display = "none";
        document.getElementById("sortoptdisplay").style.display = "block";
        //document.getElementById("nav_foot").style.display = "none"; 
        dataLayer.push({
            'category': 'UsedCarSearch',
            'action': "Sort_By",
            'label': "Sort_By_option_clicked",
            'event': 'CWInteractive'
        });
        // @manikanta
        // setPopupHistory("#sortoptdisplay");
    } catch (e) { }
}

function isSpecialScreen() {
    var userAgent = window.navigator.userAgent;
    return (userAgent.includes("iPad") || userAgent.includes("iPhone") || userAgent.includes("iPod"));
}

function hide_filters() {
    $('#citySearch').val('');
    $('.citylistopt').show();
    if (document.getElementById("strip_s")) {
        document.getElementById("strip_s").style.display = "none";
    }

    resetFilters();
    // unselectprev();
    try {
        if (isSpecialScreen() || 1) {
            document.body.scrollTop = parseInt($('#_scorll_value').val());
            setTimeout(function () {
                document.getElementById("closeFloatbarId4").style.display = "none";
                document.getElementById("filtoptdiv").style.display = "none";
                document.getElementById("sortoptdisplay").style.display = "none";
                document.getElementById("filtrdiv").style.display = "none";
                document.getElementById("wrapper").style.backgroundColor = "#f0f0f0";
            }, 30);
            $('#fix3').removeClass('active-head');

        } else {
            $('html,body,div.buyUsedCarNew').removeClass('window-body');
            document.getElementById("closeFloatbarId4").style.display = "none";
            document.getElementById("filtoptdiv").style.display = "none";
            document.getElementById("sortoptdisplay").style.display = "none";
            document.getElementById("filtrdiv").style.display = "none";
            document.getElementById("wrapper").style.backgroundColor = "#f0f0f0";
        }
        // function call added by manikanta for adjusting floating filter
        // findposcrool();
        // clearPopupHistory();
        enableScroll();
    } catch (e) { }
}

function resetFilters()
{
    resetSliders({ shouldReset: false });
}

function closeAllCities() {
    selector = $('[name="city"][type=radio]:checked');
    $('ul.drop-down.open').removeClass('open');
    $('[name="city"][type=radio]').prop('checked', false);
    $('[data-name="list_area"][type=radio]').prop('checked', false);
    $(selector).prop('checked', true);
    //$('#city_cnt').html('');  
}

function sortByFn(vv) {

    try {
        showLoader();
        var queryStringForListPage = stockList.GetFilterValues();
        updateDeferredDealerList();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("stockListContent").innerHTML = xhttp.responseText;
                activatedSwiper();
                if (checkFncIsDefined(buyerFormV2Msite.getFavouritesFromStorage)) {
                    buyerFormV2Msite.getFavouritesFromStorage();
                }
                hide_filters();
                $(window).scrollTop(0);
                resetPagesFetched();
                analytics.eventTracking();
                analytics.trackImpressions();
            }
        }
        const queryObject = queryStringToJSON(queryStringForListPage);
        queryObject.deferredDealers = getDeferredDealerIds();
        if(queryObject.additionaltags)
        {
            queryObject.additionaltags = queryObject.additionaltags.split(" ");
        }
        queryObject.segmentIds = $("#segment-ids").html();
        xhttp.open("POST", "/buy-used-cars/api/stocks/filters/", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhttp.send(JSON.stringify(queryObject));
        var searchParams = new URLSearchParams(window.location.search)
        searchParams.delete("so");
        searchParams.delete("sc");
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString() + queryStringForListPage;
        history.pushState(null, '', newRelativePathQuery);
    } catch (e) { }
}

function isAllModelsSelected(makeId, modelId)
{
    let modelCheckboxes = $(`input[name="models"][data-makeid="${makeId}"]`);
    if(!modelCheckboxes)
    {
        return false;
    }
    let isAllModelsChecked = true;
    modelCheckboxes.each(function(){
        if($(this).attr("id") !== "0" && !$(this).is(":checked"))
        {
            isAllModelsChecked = false;
            return false;
        }
    });
    return isAllModelsChecked;
}

function updateVerifiedCarsFilterCounts()
{
    var cert = $('input[name="certification"]:checked').length;
    var selectedVerifiedCarsLength = $('input[name="additional-tags"]:checked').length;
    if (cert || selectedVerifiedCarsLength ) {
        document.getElementById("cert_cnt_id").innerText = cert + selectedVerifiedCarsLength;
        document.getElementById("cert_cnt").style.display = "table";
    } else {
        document.getElementById("cert_cnt_id").innerText = 0;
        document.getElementById("cert_cnt").style.display = "none";
    }

}


function updateColorFiltersCounts()
{
    var colorsCountElement = document.getElementById("colors_cnt_id");
    var colorsCountContainer = document.getElementById("colors_cnt");
    if(!colorsCountElement || !colorsCountContainer)
    {
        return;
    }
    var selectedColorsLength = $('input[name="filter-colors"]:checked').length;
    if (selectedColorsLength>0) {
        colorsCountElement.innerText = selectedColorsLength;
        colorsCountContainer.style.display = "table";
    } else {
        colorsCountElement.innerText = 0;
        colorsCountContainer.style.display = "none";
    }
}


function filterSelection(value, filterName, filterData) {
    switch (filterName) {
        case "city":
            if (document.getElementById("cityIdFromParams")) {
                document.getElementById("cityIdFromParams").value = $('input[name="city"]:checked').attr('id');
            }
            selectedFilters["fltr_city"] = $('input[name="city"]:checked').attr('id');
            selectedFilters["fltr_city_name"] = $('input[name="city"]:checked').val();
            if (!selectedFilters["fltr_city"]) {
                document.getElementById("city_cnt").style.display = "none";
            } else {
                document.getElementById("city_cnt_id").innerText = 1;
                document.getElementById("city_cnt").style.display = "table";
            }
            break;
        case "certification":
        case "car_pic":
            selectedFilters["certification"] = $('input[name="certification"]:checked').val();
            selectedFilters["certification"] += ("+" + $('input[name="car_pic"]:checked').val());
            updateVerifiedCarsFilterCounts();
            break;
        case "additional-tags":
            updateVerifiedCarsFilterCounts();
            break;
        case "colors":
            updateColorFiltersCounts();
            break;
        case "price":
            selectedFilters["price"] = value;
            if (!selectedFilters["price"]) {
                document.getElementById("price_cnt").style.display = "none";
            } else {
                document.getElementById("price_cnt_id").innerText = 1;
                document.getElementById("price_cnt").style.display = "table";
            }
            break;
        case "fuel":
            selectedFilters["fuel"] = undefined;
            $('input[name="fuel[]"]:checked').each(function () {
                selectedFilters["fuel"] = selectedFilters["fuel"] ? selectedFilters["fuel"] + "+" + $(this).val() : $(this).val();
            });
            var selectedFuels = $('input[name="fuel[]"]:checked').length;
            if (!selectedFuels) {
                document.getElementById("fuel_cnt").style.display = "none";
            } else {
                document.getElementById("fuel_cnt_id").innerText = selectedFuels;
                document.getElementById("fuel_cnt").style.display = "table";
            }
            break;
        case "models":
            selectedFilters["models"] = undefined;
            let isAllModelsClicked = parseInt(value, 10) === 0;
            if(isAllModelsClicked && !!filterData)
            {
                let allModelsCheckbox = $(`.js-all-models-checkbox[data-makeid='${filterData.makeId}'`);
                let modelContainer = $("#chmodels_" + filterData.makeId);
                if(modelContainer && !!allModelsCheckbox)
                {
                    let isAllModelsChecked = allModelsCheckbox.is(":checked");
                    modelContainer.find(":checkbox").each(function(){
                        $(this).prop("checked", isAllModelsChecked);
                    });
                }
            }
            else
            {
                $('input[name="models"]:checked').each(function () {
                    selectedFilters["models"] = selectedFilters["models"] ? selectedFilters["models"] + "+" + $(this).val() : $(this).val();
                });
                if(!!filterData)
                {
                    let allModelsCheckbox = $(`.js-all-models-checkbox[data-makeid="${filterData.makeId}"`);
                    if(allModelsCheckbox)
                    {
                        allModelsCheckbox.prop("checked", isAllModelsSelected(filterData.makeId));
                    }
                }
            }
            handleMmvCount();
            break;
        case "kms":
            selectedFilters["kms"] = $('input[name="kms_range[]"]:checked').val();
            if (!selectedFilters["kms"]) {
                document.getElementById("kms_cnt").style.display = "none";
            } else {
                document.getElementById("kms_cnt_id").innerText = 1;
                document.getElementById("kms_cnt").style.display = "table";
            }
            break;
        case "age":
            selectedFilters["age"] = value;
            if (!selectedFilters["age"]) {
                document.getElementById("age_cnt").style.display = "none";
            } else {
                document.getElementById("age_cnt_id").innerText = 1;
                document.getElementById("age_cnt").style.display = "table";
            }
            break;
        case "gear":
            selectedFilters["gear"] = undefined;
            $('input[name="gearbox[]"]:checked').each(function () {
                selectedFilters["gear"] = selectedFilters["gear"] ? selectedFilters["gear"] + "+" + $(this).attr("data-value") : $(this).attr("data-value");
            });
            var selectedModes = $('input[name="gearbox[]"]:checked').length;
            if (!selectedModes) {
                document.getElementById("trans_cnt").style.display = "none";
            } else {
                document.getElementById("trans_cnt_id").innerText = selectedModes;
                document.getElementById("trans_cnt").style.display = "table";
            }
            break;
        case "btype":
            selectedFilters["btype"] = undefined;
            $('input[name="bodytype[]"]:checked').each(function () {
                selectedFilters["btype"] = selectedFilters["btype"] ? selectedFilters["btype"] + "+" + $(this).val() : $(this).val();
            });
            var selectedBTypes = $('input[name="bodytype[]"]:checked').length;
            if (!selectedBTypes) {
                document.getElementById("btype_cnt").style.display = "none";
            } else {
                document.getElementById("btype_cnt_id").innerText = selectedBTypes;
                document.getElementById("btype_cnt").style.display = "table";
            }
            break;
        case "owner":
            selectedFilters["owner"] = undefined;
            $('input[name="car_owner[]"]:checked').each(function () {
                selectedFilters["owner"] = selectedFilters["owner"]
                    ? selectedFilters["owner"] + "+" + $(this).val()
                    : $(this).val();
            });
            var selectedOwners = $('input[name="car_owner[]"]:checked').length;
            if (!selectedOwners) {
                document.getElementById("owner_cnt").style.display = "none";
            } else {
                document.getElementById("owner_cnt_id").innerText = selectedOwners;
                document.getElementById("owner_cnt").style.display = "table";
            }
            break;
    }
}

function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

function getFilteredResult() {
    document.getElementById("modelFromUrl").value = "0";
    document.getElementById("makeFromUrl").value = "0";
    document.getElementById("carFromUrl").value = "0";
    hideNearbyCities();
    hidePopularModels();
    hideRecentlyAddedStocks();
    CollapseSearchPageDescription();
    if (typeof recentlyViewedCars !== "undefined") {
        recentlyViewedCars.hideRecentlyViewedCars();
    }
    displayLoader();
    try {
        document.getElementsByClassName('txt_filterpopup').citySearch.value = "";
        var queryStringForListPage = stockList.GetFilterValues();
        let selectedCityName = selectedFilters["fltr_city_name"];
        $('#cityName').val(selectedCityName);
        updateDeferredDealerList();
        var hiddenStockCountElem;
        if (selectedFilters["fltr_city"]) {
            var currentTime = new Date();
            currentTime.setDate(currentTime.getDate() + 30);
            var currentDomain = window.location.hostname;
            if (currentDomain !== "localhost") {
                currentDomain.replace("www.", "");
                currentDomain = "." + currentDomain;
            }
            document.cookie = "cd-city-id = " + selectedFilters["fltr_city"] + ";expires=" + currentTime + ";path=/;domain=" + currentDomain;
            document.cookie = "cd-city-ct = " + selectedCityName + ";expires=" + currentTime + ";path=/;domain=" + currentDomain;
        }
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("stockListContent").innerHTML = xhttp.responseText;
                activatedSwiper();
                if (checkFncIsDefined(buyerFormV2Msite.getFavouritesFromStorage)) {
                    buyerFormV2Msite.getFavouritesFromStorage();
                }
                hide_filters();
                $(window).scrollTop(0);
                hiddenStockCountElem = document.getElementById("hiddenTotalStockCount");
                var stockCount = parseInt(hiddenStockCountElem.innerHTML.trim());
                if (hiddenStockCountElem == null || stockCount <= 10) {
                    getNearbyCities(queryStringForListPage);
                    getPopularModels(queryStringForListPage);
                    getRecentlyAddedStocks(queryStringForListPage);
                    if (typeof recentlyViewedCars !== "undefined") {
                        // empty string is passed for excluded profile Id on search page call
                        // since we can show any stock irrespective of profile id
                        recentlyViewedCars.callRecentlyViewedCarsApi("", "msiteSearchPage");
                    }
                }
                if (typeof setLeadButtonText !== "undefined" && typeof setLeadButtonText === "function") {
                    setLeadButtonText();
                }
                var headerMobile = makeTitleClient(filtersApplied);
                headerMobile = (hiddenStockCountElem && stockCount > 0 ? stockCount : "") + " " + headerMobile;
                $("h1").html("");
                $("h1").html(headerMobile);
                resetPagesFetched();
                analytics.eventTracking();
                analytics.trackImpressions();
            }
        }
        const queryObject = queryStringToJSON(queryStringForListPage);
        queryObject.deferredDealers = getDeferredDealerIds();
        if(queryObject.additionaltags)
        {
            queryObject.additionaltags = queryObject.additionaltags.split(" ");
        }
        queryObject.segmentIds = $("#segment-ids").html();
        xhttp.open("POST", "/buy-used-cars/api/stocks/filters/", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhttp.send(JSON.stringify(queryObject));
        var filtersApplied = {};
        var queryString = "";
        if (queryStringForListPage && queryStringForListPage.charAt(0) === "&") {
            queryString = queryStringForListPage.substring(1);
            getFiltersFromQueryParams(queryString, filtersApplied, "mobile");
        }
        bindFaqs(queryStringForListPage);
        bindAbsureBanner(queryStringForListPage);
        bindSeoData(queryStringForListPage);
        window.history.pushState(
            undefined,
            undefined,
            `${window.location.pathname}?${queryString}`);
        fireTrackingForAppliedFilters(queryObject);
        trackAppliedFilters(queryObject);
        previousSelectedCityName = selectedCityName;
    } catch (error) {
    }
}

function replaceTemplatePlaceholder() {
    var args = arguments;
    if (args.length <= 1) {
        return args;
    }
    var result = args[0];
    for (var i = 1; i < args.length; i++) {
        result = result.replace(new RegExp("\\{" + (i - 1) + "\\}", "g"), args[i]);
    }
    return result;
}

function createAbsureOfferList(offerList) {
    var offerTemplate = "<li class=\"absure4s-offer__list-item\">" +
        "<div class=\"absure4s-offer-details\" data-testing-id=\"absure-offers-details\">" +
        "<div class=\"absure4s-promise-title__container\">" +
        "<img src=\"{0}\" />" +
        "<span>{1}</span>" +
        "</div>" +
        "<p>{2}</p>" +
        "</div></li>";
    var offersList = "";
    if (offerList && offerList.length > 0) {
        offerList.forEach(function (element) {
            var offer = replaceTemplatePlaceholder(offerTemplate, element.offerLogo, element.offerText, element.offerDescription);
            offersList += offer;
        });
    }
    return offersList;
}

function isOnlyAbsureFilterSelected(searchUrl) {
    if (!searchUrl) {
        return false;
    }
    if (searchUrl[0] === "&") {
        searchUrl = searchUrl.substring(1, searchUrl.length);
    }
    var appliedAdditionalFilters = [];
    var queryParamsList = searchUrl.split("&");
    for (var i = 0; i < queryParamsList.length; i++) {
        var param = queryParamsList[i].split("=");
        if (param.length > 1 && param[0] === "filterbyadditional") {
            appliedAdditionalFilters = param[1].split("+");
            break;
        }
    }

    if (appliedAdditionalFilters.length === 1 && appliedAdditionalFilters[0] === "4") {
        return true;
    }
    return false;
}

function createAbsureBanner(response, searchUrl) {
    if (!response || !response.absure4sOffers || response.absure4sOffers.length <= 0) {
        return "";
    }
    var isOnlyAbsureSelected = isOnlyAbsureFilterSelected(searchUrl);
    var bannerHtml = "<div class=\"absure4s-banner__container\">" +
        "<div class=\"absure4s-banner\">" +
        "<div class=\"absure4s-logo\" data-testing-id=\"absure-banner\">"
        + "<img src=\"{0}\" title=\"absure 4s logo\" /></div>" +
        "<ul class=\"absure4s-offer__list\">{1}</ul></div>";
    bannerHtml = replaceTemplatePlaceholder(bannerHtml, response.absureLogo, createAbsureOfferList(response.absure4sOffers));
    if (response.absureBannerCtaLink && response.absureBannerCtaText && !isOnlyAbsureSelected) {
        bannerHtml += "<div class=\"absure4s-banner__cta-link-block\">" +
            "<a class=\"absure4s-banner__cta-link\" href=\"{0}\" data-testing-id=\"view-all-absure-link\" title=\"view all absure cars\">{1}</a></div>";
        bannerHtml = replaceTemplatePlaceholder(bannerHtml, response.absureBannerCtaLink, response.absureBannerCtaText);
    }
    bannerHtml += "</div>";
    return bannerHtml;
}

function bindAbsureBanner(searchUrl) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            jsonResponse = JSON.parse(xhttp.response);
            var responseHtml = createAbsureBanner(jsonResponse, searchUrl);
            document.getElementById("absure-banner-details").innerHTML = responseHtml;
        }
    }
    xhttp.open("GET", "/api/absure4s/banner?" + searchUrl, true);
    xhttp.setRequestHeader('ServerDomain', 'CarWale');
    xhttp.send();
}

function bindSeoData(searchUrl) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200 && xhttp.response) {
            var jsonResponse = JSON.parse(xhttp.response)
            _bindSeoDescription(jsonResponse, "mobile")
        }
    }
    xhttp.open("GET", "/api/v1/used-description/?" + searchUrl, true);
    xhttp.setRequestHeader("ServerDomain", "CarWale");
    xhttp.send();
}

function displayLoader() {
    try {
        document.getElementById("loaderbg").style.display = "block";
        document.getElementById("loaderblk").style.display = "block";
        setTimeout("hideLoader()", 800);
    } catch (e) { }
}

function hideLoader() {
    try {
        document.getElementById("loaderbg").style.display = "none";
        document.getElementById("loaderblk").style.display = "none";
    } catch (e) { }
}

function activatedSwiper() {
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        loop: true,
        preloadImages: false,
        lazyLoading: true
    });
}

function getdpModels(info) {
    if (info.checked === false) {
        selectedMakesId.pop(info.id);
        var ul = document.getElementById("chmodels_" + info.id);
        ul.style.display = "none";
        ul.innerHTML = "";
        selectedFilters["models"] = undefined;
        $('input[name="models"]:checked').each(function () {
            selectedFilters["models"] = selectedFilters["models"] ? selectedFilters["models"] + "+" + $(this).val() : $(this).val();
        });
    } else {
        try {
            selectedMakesId.push(info.id);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var response = xhttp.responseText;
                    var ul = document.getElementById("chmodels_" + info.id);
                    ul.innerHTML = response;
                    ul.style.display = "block";
                    $(".js-make-collapsible[id='" + info.id + "'").addClass("ref-down-arrow");
                    setModelCheckboxValue({});
                    handleMmvCount();
                }
            }
            xhttp.open("GET", "/buy-used-cars/api/getrootsbymakeid/?make=" + info.id + "&model=" + info.selectedModel, true);
            xhttp.send();
        } catch (error) { }
    }
}

function setModelCheckboxValue({ shouldSetCollapsibleState = false })
{
    if(shouldSetCollapsibleState)
    {
        $(".js-make-collapsible").removeClass("ref-down-arrow");
        $(".js-all-models-container").hide();
    }
    let carFromUrl = $("#carFromUrl");
    if(!carFromUrl || !carFromUrl.val())
    {
        $(".js-make-collapsible").addClass("ref-up-arrow");
        $("input[name='models']").prop("checked", false);
        return;
    }
    var carList = carFromUrl.val().split(" ");
    carList.forEach(car => {
        if(car.includes("."))
        {
            $("input[value='" + car + "'").prop("checked", true);
        }
        else
        {
            let makeId = parseInt(car, 10);
            $(".js-make-collapsible[id='" + makeId + "'").addClass("ref-down-arrow");
            $("input[name='models'][data-makeid='" + makeId + "'").prop("checked", true);
        }
    });
}

function resetPagesFetched() {
    currentPageId = 1;
    if (loadedPages && loadedPages.length > 0) {
        loadedPages = [];
    }
}
function _applyRadioFilter(parentId, name, values, filterName) {
    if (parentId == null || name === "" || filterName === "" || typeof values === "undefined" || values.trim() === "") {
        return;
    }
    $.each(
        $("#" + parentId).find(`input:radio[name="${name}"]`),
        function (index, element) {
            if ($(element).val() == values) {
                $(element).prop("checked", true);
                filterSelection($(element).val(), filterName);
            }
        }
    );
}
function _setCheckboxFilter(parentId, name, values, filterName) {
    if (typeof values === "undefined" || values.trim() === "" || parentId == null || name === "" || filterName === "") {
        return;
    }
    var valueList = values.split("+");
    for (var i = 0; i < valueList.length; i++) {
        $.each(
            $("#" + parentId).find(`input[name="${name}"]`),
            function (index, element) {
                if ($(element).val() == valueList[i]) {
                    $(element).prop("checked", true);
                    filterSelection($(element).val(), filterName);
                }
            }
        );
    }
}
function _bindBudgetAppliedFilter(values) {
    _applyRadioFilter("filt_price", "carrate[]", values, "price");
}
function _bindFuelFilter(values) {
    _setCheckboxFilter("filt_fuel", "fuel[]", values, "fuel");
}
function _bindKmsFilter(values) {
    _applyRadioFilter("filt_kms", "kms_range[]", values, "kms");
}

function _bindAgeFilter(values) {
    _applyRadioFilter("filt_age", "car_age[]", values, "age");
}

function getNameFromTransmissionId(value) {
    return $("#filt_trans").find(`[data-value="${value}"`).val();
}

function _bindTransmissionFilter(values) {
    if (typeof values === "undefined" || values.trim() === "") {
        return;
    }
    resetTransmissionFilter();
    var trans = values.split("+");
    for (var i = 0; i < trans.length; i++) {
        values = getNameFromTransmissionId(trans[i]);
        _setCheckboxFilter("filt_trans", "gearbox[]", values, "gear");
    }
}

function _bindBodyTypeFilter(values) {
    _setCheckboxFilter("filt_btype", "bodytype[]", values, "btype");
}

function _bindOwnerFilter(values) {
    _setCheckboxFilter("filt_owner", "car_owner[]", values, "owner");
}

function resetTransmissionFilter() {
    $.each(
        $("#filt_trans").find(`input[name="gearbox[]"]`),
        function (index, element) {
            if ($(element).prop("checked") === true) {
                $(element).prop("checked", false);
                filterSelection($(element).val(), "gear");
            }
        }
    );
}

function _bindAdditionalAppliedFilter(values) {
    // if filter by addition not present select all cars option
    // if present select the applied option
    var queryParams = getQueryParamsObject();
    var filterbyadditional = "";
    for (var i = 0; i < queryParams.length; i++) {
        if (queryParams[i].field == "filterbyadditional") {
            filterbyadditional = queryParams[i].value;
            break;
        }
    }
    if (!filterbyadditional) {
        return;
    } else {
        var filterbyadditionalList = filterbyadditional.split("+");
        for (var i = 0; i < filterbyadditionalList.length; i++) {
            var additionFilter = filterbyadditionalList[i];

            if (additionFilter == "1") {
                $("#certification").prop("checked", true);
            }
            else if (additionFilter == "2") {
                $("#carpic_imagesonly").prop("checked", true);
            }
            else if (additionFilter == "4") {
                $("#absure").prop("checked", true);
            }
        }
    }
}

function _bindAdditionalTagsAppliedFilter() {
    var queryParams = getQueryParamsObject();
    if (!Array.isArray(queryParams) || queryParams.length == 0) {
      return;
    }
    var additionalTags = "";
    for (var i = 0; i < queryParams.length; i++) {
      if (!queryParams[i]) {
        continue;
      }
      if (queryParams[i].field === "additionaltags") {
        additionalTags = queryParams[i].value;
        break;
      }
    }
    if (!additionalTags) {
      return;
    }
    var additionalTagList = additionalTags.split("+");
    for (var i = 0; i < additionalTagList.length; i++) {
      var additionalTag = additionalTagList[i];

      if (additionalTag == "8") {
        $("#certifiedCars").prop("checked", true);
      } else if (additionalTag == "7") {
        $("#qualityReport").prop("checked", true);
      }
    }
}

function _bindColorsAppliedFilter() {
  var queryParams = getQueryParamsObject();
  if (!Array.isArray(queryParams) || queryParams.length == 0) {
    return;
  }
  var color = "";
  for (var i = 0; i < queryParams.length; i++) {
    if (!queryParams[i]) {
      continue;
    }
    if (queryParams[i].field === "color") {
      color = queryParams[i].value;
      break;
    }
  }
  if (!color) {
    return;
  }
  var colorList = color.split("+");
  if (!Array.isArray(colorList) || colorList.length == 0) {
    return;
  }
  for (var i = 0; i < colorList.length; i++) {
    $("#filterColor-" + colorList[i]).prop("checked", true);
  }
}

function _bindSortFilter(queryParams) {
    if (queryParams == null) {
        return;
    }
    var scValue = "";
    var soValue = "";
    $("#sort").find("option").prop("selected", false);

    for (var i = 0; i < queryParams.length; i++) {
        if (queryParams[i].field == "sc") {
            scValue = parseInt(queryParams[i].value, 10);
            continue;
        }
        if (queryParams[i].field == "so") {
            soValue = parseInt(queryParams[i].value, 10);
            continue;
        }

    }
    var value = sortUtils.getRadioInputValue({ scValue, soValue });
    $.each($("#sortoptdisplay").find('input:radio[name="sortv"]'), function (index, element) {
        if ($(element).val() === value) {
            $(element).prop("checked", true);
        }
    });
}

function getQueryParamsObject() {
    var completeQS = window.location.search.replace("?", "");
    var tempParams = completeQS.substring(0, completeQS.length).split("&");
    var params = [];
    if (tempParams.length > 0) {
        for (var i = 0; i < tempParams.length; i++) {
            params.push({
                field: tempParams[i].split("=")[0],
                value: tempParams[i].split("=")[1],
            });
        }
    }
    return params;
}

function _bindRootfilter(make, root) {
    var makeId = "#chmodels_" + make, rootId = "#" + root;
    var rootElement = $(makeId).find(rootId);
    rootElement.prop("checked", true);
    filterSelection(rootElement[0], "models");
}

function _bindRootDetailsFilter(make, root) {
    var makeElement = $("#filt_make").find(`#${make}`);
    makeElement.prop("checked", true);
    var val = document.getElementById("chmodels_" + make).style.display;
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var rootList = document.getElementById("chmodels_" + make);
                if (rootList.style.display === "none") {
                    var response = xhttp.responseText;
                    rootList.innerHTML = response;
                    rootList.style.display = "block";
                }
                if (root !== "") {
                    _bindRootfilter(make, root);
                }
            }
        }
        xhttp.open("GET", "/buy-used-cars/api/getrootsbymakeid/?make=" + make + "&model=", true);
        xhttp.send();
    } catch (error) { }
}

function _bindMakeRootFilter(values) {
    var cars = values.split("+");
    for (var i = 0; i < cars.length; i++) {
        var car = cars[i], make = "", root = "";
        if (car === "" || car == "0") {
            continue;
        }
        else if (car.includes('.')) {
            var makeRoot = car.split(".");
            make = makeRoot[0];
            root = makeRoot[1];
        }
        else {
            make = car;
        }
        _bindRootDetailsFilter(make, root);
    }
    handleMmvCount();
}

function _bindFiterOptionsFromQueryString() {
    var queryParams = getQueryParamsObject();
    for (var i = 0; i < queryParams.length; i++) {
        var field = queryParams[i].field;
        if (field == "budget") {
            _bindBudgetAppliedFilter(queryParams[i].value);
        }
        else if (field == "fuel") {
            _bindFuelFilter(queryParams[i].value);
        }
        else if (field == "kms") {
            _bindKmsFilter(queryParams[i].value);
        }
        else if (field == "year") {
            _bindAgeFilter(queryParams[i].value);
        }
        else if (field == "trans") {
            _bindTransmissionFilter(queryParams[i].value);
        }
        else if (field == "bodytype") {
            _bindBodyTypeFilter(queryParams[i].value);
        }
        else if (field == "owners") {
            _bindOwnerFilter(queryParams[i].value);
        }
        else if (field == "car") {
            _bindMakeRootFilter(queryParams[i].value);
        }
    }
    _bindAdditionalAppliedFilter(queryParams);
    _bindAdditionalTagsAppliedFilter();
    _bindColorsAppliedFilter();
    _bindSortFilter(queryParams);
}

window.onload = function () {
    _bindFiterOptionsFromQueryString();
}
