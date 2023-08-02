function closeMakePopup() {
    document.querySelector(".js-blackOutWindow").classList.add("display-none");
    document.querySelector(".js-make-dropdown-wrapper").style.display = "none";
}

function showMakePopup() {
    document.querySelector(".js-blackOutWindow").classList.remove("display-none");
    document.querySelector(".js-make-dropdown-wrapper").style.display = "block";
}

function goToDealerMakeListingOrDetailsPage(makeName, makeMaskingName) {
    if (makeName) {
        var makeNameDiv = document.getElementById("makeName");
        makeNameDiv.textContent = makeName;
        if (!makeNameDiv.classList.contains("selector-text-active")) {
            makeNameDiv.classList.add("selector-text-active");
        }
        var makeFloatingTextDiv = document.getElementById("makeFloatingText");
        if (makeFloatingTextDiv.classList.contains("display-none")) {
            document.getElementById("makeFloatingText").classList.remove("display-none");
        }
        closeMakePopup();
        var cityNameDiv = document.getElementById("cityName");
        if (cityNameDiv.classList.contains("selector-text-active")) {
            window.location.href = `/showrooms-dealers/${makeMaskingName}/${cityMaskingName}`;
        }
        else {
            window.location.href = `/showrooms-dealers/${makeMaskingName}/`;
        }
    }
}

function redirectToDealerDetails() {
    var cityId = GetCookieByName("cookie_cw_cityid");
    var newCityMaskingName = "";
    var url = "/api/city/" + cityId;

    $.ajax({
        url: url,
        type: "GET",
        headers: { 'ServerDomain': 'CarWale' },
        success: function (data) {
            newCityMaskingName = data.cityMaskingName;
            if (newCityMaskingName && newCityMaskingName !== cityMaskingName) {
                var url = `${window.location.href}${newCityMaskingName}/`;
                window.location.href = url;
                return true;
            }
        },
        error: function (response, status) {
            var cityName = GetCookieByName("cookie_ct_city");
            newCityMaskingName = cityName.toLowerCase().replace(" ", "-");
            if (newCityMaskingName && newCityMaskingName !== cityMaskingName) {
                var url = `${window.location.href}${newCityMaskingName}/`;
                window.location.href = url;
                return true;
            }
        },
    });
}

function redirectToNewCityDealerDetails() {
    var cityId = GetCookieByName("cookie_cw_cityid");
    var newCityMaskingName = "";
    var url = "/api/city/" + cityId;

    $.ajax({
        url: url,
        type: "GET",
        headers: { 'ServerDomain': 'CarWale' },
        success: function (data) {
            newCityMaskingName = data.cityMaskingName;
            if (newCityMaskingName && newCityMaskingName !== cityMaskingName) {
                var redirectUrl = `/showrooms-dealers/${makeMaskingName}/${newCityMaskingName}`;
                window.location.href = redirectUrl;
            }
        },
        error: function (response, status) {
            var cityName = GetCookieByName("cookie_ct_city");
            newCityMaskingName = cityName.toLowerCase().replace(" ", "-");
            if (newCityMaskingName && newCityMaskingName !== cityMaskingName) {
                var redirectUrl = `/showrooms-dealers/${makeMaskingName}/${newCityMaskingName}`;
                window.location.href = redirectUrl;
            }
        },
    });
}
