let extraIds = [];
let callback;

const locationPopup = (function () {
    const popularCitiesPerRow = 4;
    const locationPattern = new RegExp("^[A-Za-z]+$");
    const popularCityIds = [1, 2, 10, 12, 105, 198, 220, 176, 128, 244];
    let userLocation = [];
    let hasLocationChanged = false;
    let shouldNotRefreshGlobal;
    let shouldAskOnlyCityGlobal;
    let popularCityElements = {};

    const locationPopupOverlay = document.querySelector(".location-popup-overlay");
    const popularCitiesContainer = document.querySelector(".popular-cities");
    const popularCitiesHeading = document.querySelector(".popular-cities-heading");
    const searchResultsContainer = document.querySelector(".search-results");
    const otherCitiesHeading = document.querySelector(".other-cities-heading");
    const searchIcon = document.querySelector("#search-icon");
    const selectedCityBlock = document.querySelector("#selected-city-block");
    const selectedAreaBlock = document.querySelector("#selected-area-block");
    const citySearchElement = document.querySelector(".city-search");
    const areaSearchElement = document.querySelector(".area-search");
    const confirmLocationElement = document.querySelector(".confirm-location");
    const detectLocationElement = document.querySelector(".detect-location");

    showLocationPopUp = (shouldNotRefresh, shouldAskOnlyCity, cb,) => {
        shouldNotRefreshGlobal = shouldNotRefresh;
        shouldAskOnlyCityGlobal = shouldAskOnlyCity;
        analytics.trackAction("CTNonInteractive", "LocationScreen", "Opened");
        ctTracking.trackEvent({
            'category': "LocationScreen",
            'action': "Opened"
        });
        callback = cb;
        console.log("msite val");
        if (!navigator.permissions?.query) {
            detectLocationElement.addEventListener("click", handleClickOnDetectLocation);
            handlePermissionNotDenied();
            return;
        }
        navigator.permissions.query({
            name: "geolocation"
        })
            .then(permissionStatus => {
                if (permissionStatus.state === "denied") {
                    handlePermissionDenied();
                }
                else {
                    detectLocationElement.addEventListener("click", handleClickOnDetectLocation);
                }
                handlePermissionNotDenied();
            })
    }

    handlePermissionNotDenied = () => {
        const cityId = GetCookieByName("cookie_cw_cityid");
        const cityName = GetCookieByName("cookie_ct_city");
        const areaName = GetCookieByName("cookie_cw_area_name");
        locationPopupOverlay.style.display = "block";
        document.body.style.overflow = "hidden";
        fillLocationInPopup(cityId, cityName, areaName);
    }

    handleClickOnDetectLocation = () => {
        analytics.trackAction("CTInteractive", "LocationScreen", "GetCurrentLocationClicked");
        ctTracking.trackEvent({
            'category': "LocationScreen",
            'action': "GetCurrentLocationClicked"
        });
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
                JSON.stringify({
                    "callbackName": "detectAddressInWebView"
                })
            );
        }
        else {
            navigator.geolocation.getCurrentPosition((geoLocation) => {
                setLocationFromGeolocation(geoLocation.coords.longitude, geoLocation.coords.latitude);
            }, handlePermissionDenied);
        }
    }
    deselectCity = () => {
        searchIcon.style.display = "block";
        selectedCityBlock.style.display = "none";
        selectedAreaBlock.style.display = "none";
        citySearchElement.style.display = "block";
        citySearchElement.value = "";
        citySearchElement.focus();
        areaSearchElement.style.display = "none";
        areaSearchElement.value = "";
        document.querySelector(".location-popup-header-text").innerHTML = 'Select Your City';
        resetPopup();

        confirmLocationElement.style.display = "none";
        detectLocationElement.style.display = "flex";
    }

    deselectArea = () => {
        selectedAreaBlock.style.display = "none";
        areaSearchElement.style.display = "block";
        areaSearchElement.value = "";
        areaSearchElement.focus();
        confirmLocationElement.style.display = "none";
        detectLocationElement.style.display = "flex";
        document.querySelector(".location-popup-header-text").innerHTML = 'Select Your Area';
    }

    hideLocationPopUp = () => {
        let callbackreturn = null;
        locationPopupOverlay.style.display = "none";
        document.body.style.overflow = "";
        if (callback) {
            callbackreturn = callback();
            hasLocationChanged = false;
        }
        !callbackreturn && hasLocationChanged && reloadPageOnLocationUpdate();
    }

    handlePermissionDenied = () => {
        document.querySelector(".detect-location-text").innerHTML = "Location Access Blocked";
        detectLocationElement.removeEventListener("click", handleClickOnDetectLocation);
    }

    setLocationFromGeolocation = async (longitude, latitude) => {
        const url = `/api/locations/nearest/?latitude=${latitude}&longitude=${longitude}`;
        const response = await fetch(url, {
            headers: { 'ServerDomain': 'CarWale' },
        });
        const locations = await response.json();
        if (!locations || locations.length <= 0) {
            return;
        }
        const { cityName, cityId, areaName = "", areaId = 0, zoneId = 0 } = locations[0] || {};
        if (!cityName) {
            return;
        }
        SetCookieInDays("cookie_cw_cityid", cityId, 365);
        SetCookieInDays("cookie_ct_city", cityName, 365);
        SetCookieInDays("cookie_cw_area_id", areaId, 365);
        SetCookieInDays("cookie_cw_area_name", areaName, 365);
        SetCookieInDays("cookie_zone_id", zoneId, 365);
        fillLocationInPopup(cityId, cityName, areaName);
        userLocation = locations[0];
        hasLocationChanged = true;
    }

    confirmGeolocation = () => {
        if (userLocation.length == 0) {
            locationPopupOverlay.style.display = "none";
            document.body.style.overflow = "";
            return;
        }
        const { cityId, cityName, areaId, areaName, zoneId } = userLocation;
        if (isUsedCarPage()) {
            events && events.publish("globalCityChanged", { cityId, cityName })
            closeLocationPopup(cityId, cityName, 0, "", 0);
            return;
        }
        closeLocationPopup(cityId, cityName, areaId, areaName, zoneId);
    }

    function isUsedCarPage() {
        let isUsedCarPageInput = $("#isUsedCarPage");
        return (
            isUsedCarPageInput &&
            isUsedCarPageInput.length > 0 &&
            isUsedCarPageInput[0] &&
            isUsedCarPageInput[0].value === "True"
        );
    }

    fillLocationInPopup = (cityId, cityName, areaName) => {
        if (!cityName || shouldAskOnlyCityGlobal) {
            citySearchElement.focus();
            return;
        }
        searchIcon.style.display = "none";
        selectedCityBlock.style.display = "flex";
        selectedCityBlock.firstElementChild.innerHTML = cityName;
        if (areaName) {
            selectedAreaBlock.style.display = "flex";
            selectedAreaBlock.firstElementChild.innerHTML = areaName;
        }
        citySearchElement.style.display = "none";
        if (!isUsedCarPage() && !areaName && ([...popularCityIds, 160].includes(parseInt(cityId, 10)))) {
            areaSearchElement.style.display = "block";
            document.querySelector(".location-popup-header-text").innerHTML = 'Select Your Area';
            areaSearchElement.focus();
        }
        else {
            areaSearchElement.style.display = "none";
        }
        popularCitiesContainer.style.display = "none";
        searchResultsContainer.style.display = "none";
        detectLocationElement.style.display = "none";
        otherCitiesHeading.style.display = "none";
        confirmLocationElement.style.display = "block";
    }

    searchForCity = () => {
        var searchTerm = citySearchElement.value;
        let validPattern = locationPattern.test(searchTerm);
        if (!searchTerm) {
            resetPopup();
            return;
        }
        if (!validPattern) {
            handlePopularCitiesWidget([]);
            handleOtherCitiesWidget([], searchTerm);
            return;
        }
        getCities(searchTerm).then(cities => {
            handlePopularCitiesWidget(cities);
            handleOtherCitiesWidget(cities, searchTerm);
        })
    }

    searchForArea = () => {
        var searchTerm = areaSearchElement.value;
        if (!searchTerm) {
            searchResultsContainer.textContent = "";
            return;
        }
        getAreas(searchTerm, GetCookieByName("cookie_cw_cityid")).then(areas => {
            handleAreaWidget(areas, searchTerm);
        });
    }

    getCities = (searchTerm) => {
        var record = 10;
        var url = "/api/v3/autocomplete/city/?term=" + searchTerm + "&record=" + record;
        return fetch(url, {
            headers: { 'ServerDomain': 'CarWale' },
        })
            .then(response => response.json())
            .catch(err => {
                return [];
            })
    }

    getAreas = (searchTerm, cityId) => {
        var record = 10;
        var url = "/api/v2/autocomplete/areas/?term=" + searchTerm + "&record=" + record + "&cityid=" + cityId;
        return fetch(url, {
            headers: { 'ServerDomain': 'CarWale' },
        })
            .then(response => response.json())
            .catch(err => {
                return [];
            })
    }

    resetPopup = () => {
        popularCitiesContainer.textContent = "";
        popularCitiesContainer.appendChild(popularCitiesHeading);
        for (let i = 0; i < popularCityIds.length; i += popularCitiesPerRow) {
            const citiesRow = document.createElement("div");
            citiesRow.classList.add("popular-cities-row");
            for (let j = i; j < i + popularCitiesPerRow && j < popularCityIds.length; j++) {
                citiesRow.appendChild(popularCityElements[popularCityIds[j]]);
            }
            popularCitiesContainer.appendChild(citiesRow);
        }
        otherCitiesHeading.style.display = 'none';
        searchResultsContainer.style.display = 'none';
        popularCitiesContainer.style.display = "block";
    }

    handlePopularCitiesWidget = (cities) => {
        const popularCities = cities.filter(city => popularCityIds.includes(city.payload.cityId));
        if (popularCities.length === 0) {
            popularCitiesContainer.style.display = "none";
            return;
        }
        popularCitiesContainer.textContent = "";
        popularCitiesContainer.appendChild(popularCitiesHeading);
        for (let i = 0; i < popularCities.length; i += 3) {
            const citiesRow = document.createElement("div");
            citiesRow.classList.add("popular-cities-row");
            for (let j = i; j < i + 3 && j < popularCities.length; j++) {
                citiesRow.appendChild(popularCityElements[popularCities[j].payload.cityId]);
            }
            popularCitiesContainer.appendChild(citiesRow);
        }
        popularCitiesContainer.style.display = "block";
    }

    handleOtherCitiesWidget = (cities, searchTerm) => {
        const otherCities = cities.filter(city => !popularCityIds.includes(city.payload.cityId));
        if (otherCities.length === 0) {
            searchResultsContainer.style.display = "none";
            otherCitiesHeading.style.display = "none";
            return;
        }
        searchResultsContainer.textContent = "";
        for (const otherCity of otherCities) {

            var regex = new RegExp(searchTerm, "gi");
            var liText = otherCity.result;
            var strongText = liText.replace(regex, function (str) {
                return "<strong class='pointer-events-none'>" + str + "</strong>";
            });
            const areaElement = document.createElement("li");
            areaElement.classList.add("other-city");
            areaElement.innerHTML = strongText;
            const { cityId, cityName } = otherCity.payload;
            areaElement.setAttribute("data-city-id", cityId);
            areaElement.setAttribute("data-city-name", cityName);
            areaElement.setAttribute("data-testing-id", cityName);
            areaElement.onclick = handleCityClick;
            searchResultsContainer.appendChild(areaElement);
        }
        searchResultsContainer.style.display = "block";
        otherCitiesHeading.style.display = "block";
    }

    handleAreaWidget = (areas, searchTerm) => {
        searchResultsContainer.textContent = "";
        for (const area of areas) {

            var regex = new RegExp(searchTerm, "gi");
            var liText = area.result;
            var strongText = liText.replace(regex, function (str) {
                return "<strong class='pointer-events-none'>" + str + "</strong>";
            });
            const areaElement = document.createElement("li");
            areaElement.classList.add("other-city");
            areaElement.innerHTML = strongText;
            const { cityId, cityName, areaId, zoneId, areaName } = area.payload;
            areaElement.setAttribute("data-city-id", cityId);
            areaElement.setAttribute("data-city-name", cityName);
            areaElement.setAttribute("data-area-id", areaId);
            areaElement.setAttribute("data-testing-id", cityName);
            areaElement.setAttribute("data-area-id", areaId);
            areaElement.setAttribute("data-zone-id", zoneId);
            areaElement.setAttribute("data-area-name", areaName);
            areaElement.onclick = handleAreaClick;
            searchResultsContainer.appendChild(areaElement);
        }
        searchResultsContainer.style.display = "block";
    }

    handleCityClick = (event) => {
        hasLocationChanged = true;
        let target = event.target;
        if (target.nodeName !== "DIV" && target.nodeName !== "LI") {
            target = target.parentNode;
        }
        const cityId = parseInt(target.getAttribute("data-city-id"), 10);
        const cityName = target.getAttribute("data-city-name");
        if (isUsedCarPage()) {
            events && events.publish("globalCityChanged", { cityId, cityName })
            closeLocationPopup(cityId, cityName, 0, "", 0);
            return;
        }
        if (![...popularCityIds, 160].includes(cityId) || shouldAskOnlyCityGlobal) {
            const cityItem = document.querySelector("#m_city");
            if (cityItem) {
                cityItem.value = cityName;
            }
            closeLocationPopup(cityId, cityName);
        }
        else {
            activateAreaSearch(cityId, cityName);
        }
    }

    handleAreaClick = (event) => {
        hasLocationChanged = true;
        const target = event.target;
        const cityId = target.getAttribute("data-city-id");
        const cityName = target.getAttribute("data-city-name");
        const areaId = target.getAttribute("data-area-id");
        const areaName = target.getAttribute("data-area-name");
        const zoneId = target.getAttribute("data-zone-id");
        closeLocationPopup(cityId, cityName, areaId, areaName, zoneId);
    }

    closeLocationPopup = (cityId, cityName, areaId = 0, areaName = "", zoneId = 0) => {
        SetCookieInDays("cookie_cw_cityid", cityId, 365);
        SetCookieInDays("cookie_ct_city", cityName, 365);
        SetCookieInDays("cookie_cw_area_id", areaId, 365);
        SetCookieInDays("cookie_cw_area_name", areaName, 365);
        SetCookieInDays("cookie_zone_id", zoneId, 365);
        if (callback) {
            hasLocationChanged = false;
            hideLocationPopUp();
            // callback();
        }
        else if (!shouldNotRefreshGlobal) {
            reloadPageOnLocationUpdate();
        }
        else {
            locationPopupOverlay.style.display = "none";
            document.body.style.overflow = "";
        }
    }

    activateAreaSearch = (cityId, cityName) => {
        SetCookieInDays("cookie_cw_cityid", cityId, 365);
        SetCookieInDays("cookie_ct_city", cityName, 365);
        DeleteCookie("cookie_cw_area_id");
        DeleteCookie("cookie_cw_area_name");
        DeleteCookie("cookie_zone_id");
        if (isUsedCarPage()) {
            events && events.publish("globalCityChanged", { cityId, cityName })
            closeLocationPopup(cityId, cityName, 0, "", 0);
            return;
        }
        searchIcon.style.display = "none";
        selectedCityBlock.style.display = "flex";
        popularCitiesContainer.style.display = "none";
        areaSearchElement.style.display = "block";
        areaSearchElement.focus();
        citySearchElement.style.display = "none";
        otherCitiesHeading.style.display = "none";
        searchResultsContainer.textContent = "";
        document.querySelector(".selected-city-name").innerHTML = cityName;
        document.querySelector(".location-popup-header-text").innerHTML = 'Select Your Area';
    }

    setLocationFromCookies = () => {
        const cityName = GetCookieByName("cookie_ct_city");
        const cityId = GetCookieByName("cookie_cw_cityid");
        const areaName = GetCookieByName("cookie_cw_area_name");

        if (!cityId || !cityName) {
            return;
        }
        const address = areaName ? `${cityName}, ${areaName}` : cityName;
        locationUtils.showToolTip(address);
    }

    const hasPageRefreshed = sessionStorage.getItem("pageRefereshOnLocationUpdate");
    if (hasPageRefreshed) {
        setLocationFromCookies();
    }

    redirectToCity = () => {
        let cityId = GetCookieByName("cookie_cw_cityid");
        if (cityId && currentModelUrl) {
            redirectToPicPage(cityId, currentModelUrl);
        }
    }

    checkOnRoadPrice = (modelUrl) => {
        var cityId = GetCookieByName("cookie_cw_cityid");
        if (cityId === "") {
            showLocationPopUp(false, true, function () {
                cityId = GetCookieByName("cookie_cw_cityid");
                redirectToPicPage(cityId, modelUrl);
            });
            return;
        }
        redirectToPicPage(cityId, modelUrl);
    }

    redirectToPicPage = (cityId, modelUrl) => {
        if (!cityId) {
            return;
        }
        var cityMaskingName = "";
        var url = "/api/city/" + cityId;
        fetch(url, {
            type: "GET",
            headers: { 'ServerDomain': 'CarWale' },
        })
            .then(res => res.json())
            .then(res => {
                cityMaskingName = res.cityMaskingName;
                const queryParam = typeof (versionQueryParam) != "undefined" ? "?v=" + versionQueryParam : "";
                var url = `${modelUrl}price-in-${cityMaskingName}/${queryParam}`;
                sessionStorage.setItem("pageRefereshOnLocationUpdate", true);
                window.location.href = url;
            })
            .catch(() => {
                var cityName = GetCookieByName("cookie_ct_city");
                cityName = cityName.toLowerCase().replace(" ", "-");
                const queryParam = typeof (versionQueryParam) != "undefined" ? "?v=" + versionQueryParam : "";
                var url = `${modelUrl}price-in-${cityName}/${queryParam}`;
                window.location.href = url;
                return;
            });
    }

    document.querySelectorAll(".popular-city").forEach(popularCity => {
        popularCity.onclick = handleCityClick;
        popularCityElements[popularCity.id] = popularCity;
    });

    reloadPageOnLocationUpdate = () => {
        sessionStorage.setItem("pageRefereshOnLocationUpdate", true);
        return location.reload();
    }

    return {
        deselectCity,
        deselectArea,
        hideLocationPopUp,
        showLocationPopUp,
        confirmGeolocation,
        searchForCity,
        searchForArea,
        redirectToCity,
        checkOnRoadPrice,
        setLocationFromGeolocation
    };

})();

document.addEventListener("DOMContentLoaded", function () {
    const params = new URL(window.location).searchParams;
    const q = params.get("q");
    if (!q) {
        return;
    }
    if (q === "openLocationPopup") {
        locationPopup.showLocationPopUp();
        window.history.replaceState(null, null, `${window.location.origin}${window.location.pathname}`);
    }
});

if (window.ReactNativeWebView) {
    const setLocationFromGeolocation = (longitude, latitude) => {
        locationPopup.setLocationFromGeolocation(longitude, latitude);
    }
}
