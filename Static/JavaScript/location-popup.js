var selectedCityId = -1;
var extraIds = [];
var currentModelUrl;

const locationPopup = (function () {
    const locationPattern = new RegExp("^[A-Za-z]+$");
    const debounceDelay = 500;
    let isAreaRequired = true;
    let notRefresh = true;
    let callBackRes = null;

    let selectedCity = document.getElementById("selected-city");
    let cityContainer = document.getElementById("city-container");
    let areaContainer = document.getElementById("area-container");
    let locationPopupTitle = document.getElementById("location-popup-title");
    let cityLocationIcon = document.getElementById("city-location-icon");
    let cityList = document.getElementById("city-list");
    let locationErrorText = document.getElementById("location-error-text");

    selectCityFromCookie = (cityName, cityId) => {
        selectedCity.innerText = cityName;
        selectedCityId = cityId;
        locationPopupTitle.innerText = "Please Tell Us Your Area";
        cityContainer.style.display = "none";
        areaContainer.style.display = "block";
    }

    selectCity = (e) => {
        let cityName = e.currentTarget.dataset.city_name;
        let cityId = e.currentTarget.dataset.city;

        SetCookieInDays("cookie_cw_cityid", cityId, 365);
        SetCookieInDays("cookie_ct_city", cityName, 365);
        SetCookieInDays("_CustCityIdMaster", cityId, 365);
        SetCookieInDays("_CustCityMaster", cityName, 365);
        SetCookieInDays("cookie_cw_area_id", "", 0);
        SetCookieInDays("cookie_cw_area_name", "", 0);
        SetCookieInDays("cookie_zone_id", "", 0);

        selectedCity.innerText = cityName;
        selectedCityId = cityId;
        loadExtraId(cityName, cityId);

        let majorCities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Chennai", "Kolkata", "Lucknow", "Chandigarh"];
        if (!majorCities.includes(cityName) || !isAreaRequired) {
            hideLocationPopUp();
            return;
        }

        locationPopupTitle.innerText = "Please Tell Us Your Area";
        cityContainer.style.display = "none";
        areaContainer.style.display = "block";
    }

    setLocationCookies = (e) => {
        let listItem = e.currentTarget;
        SetCookieInDays("cookie_zone_id", listItem.getAttribute("data-zone_id"), 365);
        SetCookieInDays(
            "cookie_cw_area_id",
            listItem.getAttribute("data-cw_area_id"),
            365
        );
        SetCookieInDays("cookie_cw_area_name", listItem.getAttribute("data-cw_area"), 365);
        hideLocationPopUp();
    }

    const handleSearchForCity = debounce(term => {
        locationPopupTitle.innerText = "Please Tell Us Your City";
        locationErrorText.style.display = "none";
        cityList.innerHTML = "";

        let validPattern = locationPattern.test(term);
        if (term === "") {
            cityLocationIcon?.classList?.remove("input-has-content");
            return;
        }

        if (!validPattern) {
            locationErrorText.style.display = "block";
            return;
        }

        cityLocationIcon?.classList?.add("input-has-content");

        let record = 5;
        let url = "/api/v3/autocomplete/city/?term=" + term + "&record=" + record;
        fetch(url, {
            method: "GET",
            headers: { 'ServerDomain': 'CarWale' }
        })
            .then(response => response.json())
            .then(response => {
                if (response === null || response.length === 0) {
                    locationErrorText.style.display = "block";
                    return;
                }
                for (let i = 0; i < response.length; i++) {
                    let regex = new RegExp(term, "gi");
                    let liText = response[i]["result"];
                    let strongText = liText.replace(regex, function (str) {
                        return "<strong>" + str + "</strong>";
                    });
                    let li = document.createElement("li");
                    li.setAttribute("data-city", response[i]["payload"].cityId);
                    li.setAttribute("data-city_name", response[i]["payload"].cityName);
                    li.setAttribute("data-testing-id", response[i]["payload"].cityName);
                    li.setAttribute("id", "city-list-item-" + response[i]["payload"].cityId);
                    li.addEventListener("click", (li) => { selectCity(li); });
                    li.innerHTML = strongText;
                    cityList.appendChild(li);
                }
            })
            .catch(err => {
                locationErrorText.style.display = "block";
                return;
            });
    }, debounceDelay);

    const handleSearchForArea = debounce(term => {
        locationPopupTitle.innerText = "Please Tell Us Your Area";
        locationErrorText.style.display = "none";
        let areaList = document.getElementById("area-list");
        let areaLocationIcon = document.getElementById("area-location-icon");
        areaList.innerHTML = ""

        let validPattern = locationPattern.test(term);
        if (term === "" || selectedCityId === -1) {
            areaLocationIcon?.classList?.remove("input-has-content");
            return;
        }

        if (!validPattern) {
            locationErrorText.style.display = "block";
            return;
        }

        areaLocationIcon?.classList?.add("input-has-content");

        let record = 5;
        let url =
            "/api/v2/autocomplete/areas/?term=" +
            term +
            "&record=" +
            record +
            "&cityid=" +
            selectedCityId;
        fetch(url, {
            method: "GET",
            headers: { 'ServerDomain': 'CarWale' }
        })
            .then(response => response.json())
            .then(response => {
                if (response === null || response.length === 0) {
                    locationErrorText.style.display = "block";
                    return;
                }

                for (let i = 0; i < response.length; i++) {
                    let regex = new RegExp(term, "gi");
                    let liText = response[i]["payload"].areaName;
                    let strongText = liText.replace(regex, function (str) {
                        return "<strong>" + str + "</strong>";
                    });
                    let li = document.createElement("li");
                    li.setAttribute("data-zone_id", response[i]["payload"].zoneId);
                    li.setAttribute("data-cw_area_id", response[i]["payload"].areaId);
                    li.setAttribute("data-cw_city_id", response[i]["payload"].cityId);
                    li.setAttribute("data-cw_area", response[i]["payload"].areaName);
                    li.setAttribute("data-cw_city", response[i]["payload"].cityName);
                    li.setAttribute("id", "area-list-item-" + response[i]["payload"].areaId);
                    li.addEventListener("click", (li) => { setLocationCookies(li); });
                    li.innerHTML = strongText;
                    areaList.appendChild(li);
                }
            })
            .catch(err => {
                locationErrorText.style.display = "block";
                return;
            });
    }, debounceDelay);

    loadLocationCookies = () => {
        let cityName = GetCookieByName("cookie_ct_city");
        let cityId = GetCookieByName("cookie_cw_cityid");
        let areaName = GetCookieByName("cookie_cw_area_name");
        const hasPageRefreshed = sessionStorage.getItem("pageRefereshOnLocationUpdate");

        // city and area selected
        if (cityId !== "" && cityName !== "" && areaName !== "") {
            if(hasPageRefreshed) {
                locationUtils.showToolTip(`${cityName}, ${areaName}`);
            }
            selectCityFromCookie(cityName, cityId);
            loadExtraId(cityName, cityId);
            return;
        }

        // only city was selected
        if (cityId !== "" && cityName !== "") {
            if(hasPageRefreshed) {
                locationUtils.showToolTip(cityName);
            }
            selectCityFromCookie(cityName, cityId);
            loadExtraId(cityName, cityId);
            return;
        }

        cityContainer.style.display = "block";
        areaContainer.style.display = "none";
    };

    loadExtraId = (cityName, cityId) => {
        document.getElementById("search-city").innerText = "";  //city-list
        cityList.innerHTML = "";
        if (extraIds.length != 0) {
            extraIds.forEach(function (element, i) {
                let cityElem = document.getElementById(element.id);
                cityElem.innerText = cityName;
                cityElem.setAttribute("data-cityId", cityId);
            });
        }
    }

    redirectToCity = () => {
        let cityId = GetCookieByName("cookie_cw_cityid");
        if (cityId && currentModelUrl) {
            redirectToPicPage(cityId, currentModelUrl);
        }
    }

    checkOnRoadPrice = (modelUrl) => {
        let cityId = GetCookieByName("cookie_cw_cityid");
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
        if(!cityId) {
            return;
        }
        let cityMaskingName = "";

        let url = "/api/city/" + cityId;
        fetch(url, {
            type: "GET",
            headers: { 'ServerDomain': 'CarWale' },
        })
            .then(res => res.json())
            .then(res => {
                cityMaskingName = res.cityMaskingName;
                const queryParam = typeof(versionQueryParam) != "undefined" ? "?v=" + versionQueryParam : "";
                window.location.href = `${modelUrl}price-in-${cityMaskingName}/${queryParam}`;
            })
            .catch(() => {
                let cityName = GetCookieByName("cookie_ct_city");
                cityName = cityName.toLowerCase().replace(" ", "-");
                const queryParam = typeof(versionQueryParam) != "undefined" ? "?v=" + versionQueryParam : "";
                window.location.href = `${modelUrl}price-in-${cityName}/${queryParam}`;
                return;
            });
    }

    showLocationPopUp = (
        shouldNotRefresh,
        shouldAskOnlyCity,
        callBack
    ) => {
        notRefresh = !!shouldNotRefresh;
        document.getElementsByClassName("location-popup-overlay")[0].style.display = "block";
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        isAreaRequired = !shouldAskOnlyCity;

        if (shouldAskOnlyCity) {
            closeAreaSearch();
        }

        if (callBack) {
            callBackRes = callBack;
        }
    }

    hideLocationPopUp = () => {
        document.getElementsByClassName("location-popup-overlay")[0].style.display = "none";
        document.getElementsByTagName("body")[0].style.overflow = "";
        sessionStorage.setItem("pageRefereshOnLocationUpdate", true);
        if (GetCookieByName("cookie_ct_city") && !notRefresh) {
            location.reload();
        }
        if (callBackRes !== null) {
            callBackRes();
        }
    }

    searchForCity = () => {
        handleSearchForCity(document.getElementById("search-city").value);
    }

    searchForArea = () => {
        handleSearchForArea(document.getElementById("search-area").value);
    }

    closeAreaSearch = () => {
        locationPopupTitle.innerText = "Please Tell Us Your City";
        locationErrorText.style.display = "none";
        document.getElementById("search-area").innerText = "";
        document.getElementById("area-list").innerHTML = "";
        selectedCityId = -1;
        areaContainer.style.display = "none";
        cityContainer.style.display = "block";
        cityList.innerHTML = "";
        document.getElementById("search-city").innerText = "";
        setTimeout(function () {
            cityLocationIcon?.classList.remove("input-has-content");
        }, 100);
    }

    loadLocationCookies();
    return {
        redirectToCity,
        checkOnRoadPrice,
        showLocationPopUp,
        hideLocationPopUp,
        searchForCity,
        searchForArea,
        closeAreaSearch,
    };
})();

document.addEventListener("DOMContentLoaded", function () {
    const params = new URL(window.location).searchParams;
    const q = params.get("q");
    if (!q) {
        return;
    }

    if (q === "openLocationPopup") {
        showLocationPopUp();
        window.history.replaceState(null, null, `${window.location.origin}${window.location.pathname}`);
    }
});
