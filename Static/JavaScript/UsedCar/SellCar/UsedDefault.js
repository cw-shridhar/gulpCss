$(document).ready(function () {
    $(".view-more-cities").click(function (e) {
        e.preventDefault();
        var a = $(this).parent().parent().find(".more-major-cities");
        a.slideToggle();
        $("html, body").animate({ scrollTop: $(".more-major-cities").offset().top }, 1000);
        var b = $(this).find("span");
        b.text(b.text() === "more" ? "less" : "more");
    });
});

/* Used Cars Budget - Find carscode starts */
var shiftKeyFlag = true;

$("#minMaxContainer").click(openUsedBudget); // End of minMaxContainer click

function openUsedBudget() {
    var minBudget = $('#minInput').val();
    var maxBudget = $('#maxInput').val();
    minBudget = (minBudget == "" || minBudget == "0") ? 0 : parseFloat(minBudget);
    maxBudget = (maxBudget == "0" || maxBudget == "0." || maxBudget == "00" || maxBudget == "000" || maxBudget == "0000" || maxBudget == "00000") ? 1 : parseFloat(maxBudget);
    if (maxBudget != "" && minBudget > maxBudget) {
        $('#maxInput').addClass('border-red').next().removeClass('hide');
    }
    else {
        $("#minMaxContainer").toggleClass('open', '');
        $("#budgetListContainer, #minPriceList").toggleClass("hide show");
        minValueFunc();
    }
}
$("#minInput").on("click", function () {
    $('#maxInput').removeClass('border-red').next().addClass('hide');
    $("#minPriceList").removeClass("hide").addClass("show");
    $("#maxPriceList").css("display", "none");
}); // End of minInput click event

$("#minInput").on("keydown", function (e) {
    if (!shiftKeyFlag)
        e.preventDefault();
    if (e.which == 16) {
        e.preventDefault();
        shiftKeyFlag = false;
    }
    if (e.which == 13 || e.which == 9) {
        $('#maxInput').focus().click();
        return false;
    }
    if ((e.which == 190 || e.which == 110) && $("#minInput").val().indexOf('.') != -1) {
        return false;
    }
    if (e.which != 8 && e.which != 40 && e.which != 46 && e.which != 37 && e.which != 39
            && e.which != 0 && e.which != 190 && e.which != 110
                && (e.which < 48 || e.which > 57) && (e.which < 96 || e.which > 105)) {
        return false;
    }
}).on("keyup", function (e) {
    if (!shiftKeyFlag && e.which == 16)
        shiftKeyFlag = true;
    var p = $(this).val();
    var budgetBtnText = $("#budgetBtn").html();
    if ((budgetBtnText == "Choose your budget" || budgetBtnText == "L - ") && p == ".") {
        p = "0.";
        $("#minInput").val("0.");
    }
    var q = $('#maxInput').val();
    if (q != "")
        $("#budgetBtn").html(p + "L" + " - " + q + "L");
    else
        $("#budgetBtn").html(p + "L" + " - ");
});

$("#maxInput").on("click", function () {
    $(this).removeClass('border-red').next().addClass('hide');
    var x = 0, q = "";
    x = $("#minInput").val();
    if (x == "")
        x = "0";
    q = $(this).val();
    if (q != "")
        $("#budgetBtn").html(x + "L" + " - " + q + "L");
    else
        $("#budgetBtn").html(x + "L" + " - ");
    getValuesForMaxDropDown(x);
    $("#minPriceList").removeClass("show").addClass("hide");
    maxValueFunc(x);
}); // End of maxInput click event

$("#maxInput").on("keydown", function (e) {
    var decimalFlag = 0;
    if (!shiftKeyFlag)
        e.preventDefault();
    if (e.which == 16) {
        e.preventDefault();
        shiftKeyFlag = false;
    }
    if (e.which == 13 || e.which == 9) {
        budget = validateBudget(0);
        if (budget.wrongURLFlag != 1) {
            $("#maxPriceList").css("display", "none");
            $("#budgetListContainer").removeClass("show").addClass("hide");
            $("#minMaxContainer").removeClass('open');
        }
        return false;
    }
    if ((e.which == 190 || e.which == 110) && $(this).val().indexOf('.') != -1) {
        return false;
    }
    else if (e.which != 8 && e.which != 40 && e.which != 46 && e.which != 37 && e.which != 39
                && e.which != 0 && e.which != 190 && e.which != 110
                    && (e.which < 48 || e.which > 57) && (e.which < 96 || e.which > 105)) {
        return false;
    }
}).on("keyup", function (e) {
    if (!shiftKeyFlag && e.which == 16)
        shiftKeyFlag = true;
    var x = $("#minInput").val();
    var q = $(this).val();
    var budgetBtnText = $("#budgetBtn").html();
    if ((budgetBtnText.indexOf('-') != -1) && q == ".") {
        q = "0.";
        $(this).val("0.");
    }
    $("#budgetBtn").html(x + "L" + " - " + q + "L");
});

$("#btnFindCar").click(function () {
    var cityName = objUsedCar.Name;
    var thisId = $(this).attr('id');
    var searchUrl = "/m/used/cars-for-sale/", budget = new Object();
    var custCityLandingpage = -1;
    if ($("#usedCarsList").val() != "What's your location?") custCityLandingpage = 0;
    if (objUsedCar.Name)
        cityName = Common.utils.formatSpecial(objUsedCar.Name);
    var cityId = objUsedCar.Id;
    var budgetFlag = 0, cityFlag = 0;

    if (cityName != undefined) {
        searchUrl += "?city=" + cityId;
        cityFlag = 1;
        SetCookieInDays("_CustCityLandingPage", custCityLandingpage);
    }
    budget = validateBudget(0);
    if (budget.wrongURLFlag == 0) {
        if(budget.maxBudget != "" || budget.minBudget != 0)
            searchUrl += (cityFlag ? "&" : "?") + "budget=" + budget.minBudget + "-" + budget.maxBudget;
        location.href = searchUrl;
    }
});
$("#usedCarsinMajorCities>div>ul,#usedCarsinMajorCities>div>div>ul").on("click", function () {
    SetCookieInDays("_CustCityLandingPage", 0);
});

function validateBudget(wrongURLFlag) {
    var minBudget = "", maxBudget = "", budgetText = "";
    var regexInt = /^[0]+$/, regexFloat = /^[0]+\.[0]+$/;

    budgetText = $('#budgetBtn').html();
    minBudget = $('#minInput').val();
    maxBudget = $('#maxInput').val();

    if (minBudget == "" || minBudget == "0." || regexFloat.test(minBudget))
        minBudget = 0;
    minBudget = parseFloat(minBudget);

    if (maxBudget == "0." || regexInt.test(maxBudget) || regexFloat.test(maxBudget))
        maxBudget = 1;
    if (maxBudget != "")
        maxBudget = parseFloat(maxBudget);

    if (maxBudget != "" && minBudget > maxBudget) {
        $('#maxInput').addClass('border-red').next().removeClass('hide');
        wrongURLFlag = 1;
    }
    else {
        $('#maxInput').removeClass('border-red').next().addClass('hide');
    }
    return { wrongURLFlag: wrongURLFlag, minBudget: minBudget, maxBudget: maxBudget };
}

function minValueFunc() {
    $("#minPriceList").find("li").click(function () {
        var selectedMin = $(this).attr("data-min-price");
        if (selectedMin == "Any") {
            selectedMin = "0";
        }
        $("#minInput").val(selectedMin);
        var maxTextValue = $("#maxInput").val();
        if (maxTextValue == "")
            $("#budgetBtn").html(selectedMin + "L -");
        else
            $("#budgetBtn").html(selectedMin + "L - " + maxTextValue + "L");

        $("#minPriceList").removeClass("show").addClass("hide");
        $('#maxInput').focus();
        getValuesForMaxDropDown(selectedMin);
        maxValueFunc(selectedMin);
    });
} // End of minValueFunc

function maxValueFunc(a) {
    $("#maxPriceList").css("display", "block").find("li").click(function () {
        var selectedMax = $(this).attr("data-max-price");
        if (selectedMax != "Any") {
            $("#maxInput").val(selectedMax);
            $("#budgetBtn").html(a + "L" + " - " + selectedMax + "L");
        }
        else {
            $("#maxInput").val("");;
            $("#budgetBtn").html(a + "L" + " - ");
        }
        $("#maxPriceList").css("display", "none");
        $("#budgetListContainer").removeClass("show").addClass("hide");
        $("#minMaxContainer").removeClass('open');
    });
} // End of maxValueFunc

function getValuesForMaxDropDown(minValue) {
    var arrayPrices = [1, 3, 4, 6, 8, 12, 20];
    var tempArray = [], minV, maxPriceStart, maxPriceIndex, newValue = 0, flag = 0;

    if (minValue == "" || minValue == "Any")
        minValue = 0;
    minV = parseFloat(minValue);

    var priceIndexData = getMaxPriceIndex(arrayPrices, minV, flag, tempArray);
    maxPriceIndex = priceIndexData.maxPriceIndex;
    flag = priceIndexData.flag;
    tempArray = priceIndexData.tempArray;
    if (arrayPrices[arrayPrices.length - 1] == minV)
        newValue += arrayPrices[arrayPrices.length - 1];

    if (flag == 1) {
        $('#maxPriceList').find('li').each(function () {
            bindMaxPriceDropDown($(this), tempArray[maxPriceIndex]);
            maxPriceIndex += 1;
        });
    }
    else {
        $('#maxPriceList').find('li').each(function () {
            if (maxPriceIndex == arrayPrices.length) {
                newValue = newValue + 10;
                bindMaxPriceDropDown($(this), newValue);
            }
            else {
                bindMaxPriceDropDown($(this), arrayPrices[maxPriceIndex]);
                newValue = arrayPrices[maxPriceIndex];
                maxPriceIndex += 1;
            }
        });
    }
} // End of getValuesForMaxDropDown

function getMaxPriceIndex(arrayPrices, minV, flag, tempArray) {
    $.each(arrayPrices, function (index, value) {
        if (minV == 0)
            maxPriceIndex = -1;
        if (value == minV) {
            maxPriceIndex = index;
        }
        else if (minV < arrayPrices[0])
            maxPriceIndex = -1;
        else if (index > 0 && (minV > arrayPrices[index - 1]) && (minV < arrayPrices[index])) {
            maxPriceIndex = index - 1;
        }
        else if ((minV >= arrayPrices[index] && (arrayPrices.length == index + 1))) {
            flag = 1;
            for (var i = 0; i < arrayPrices.length + 1 ; i++) {
                tempArray.push(minV);
                minV = parseInt(minV + 10);
            }
            maxPriceIndex = 0;
        }
    });
    return { maxPriceIndex: maxPriceIndex + 1, flag: flag, tempArray: tempArray };
} // End of getMaxPriceIndex

function bindMaxPriceDropDown(thisElement, pricevalue) {
    if (thisElement.attr('data-max-price') != "Any") {
        thisElement.attr('data-max-price', pricevalue);
        thisElement.text(pricevalue + " Lakh");
    }
} // bindMaxPriceDropDown


$(document).mouseup(function (e) {
    var container = $("#budgetListContainer");
    if (container.hasClass('show') && $("#budgetListContainer").is(":visible")) { //do this only when its in open state otherwise do nothing
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            var elementId = $('#' + e.target.id).parent().attr('id');
            var elementClass = $('#' + e.target.id).parent().attr('class');
            if (elementClass != undefined)
                elementClass = elementClass.split(' ')[0];
            if (elementId != "minMaxContainer" && elementId != "btnFindCar" && elementClass != "used-budget-box") //dont trigger click for btnFindCar and minMaxContainer
                $('#minMaxContainer').trigger('click');
        }
    }
});