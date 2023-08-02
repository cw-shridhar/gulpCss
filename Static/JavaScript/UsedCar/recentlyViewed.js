var recentlyViewedCars = (function () {
    var _localStorageKey = "ct_recentlyViewedCars";
    var parentContainer = $(".car-carousel-template-container");
    var templateContainer = $(".car-carousel-template");
    var cardTemplate = $(".car-carousel-template").find(".recentlyViewedCard");
    var templateContainerDesktop = $(".recentlyViewedCars");
    var cardTemplateDesktop = templateContainerDesktop.find("ul");
    var _isApiCalled = false;

    var hideRecentlyViewedCars = function () {
        _isApiCalled = false;
        parentContainer.hide();
    };

    var _setLocalStorage = function (value) {
        if (typeof value === "undefined") {
            return;
        }
        if (
            typeof window !== "undefined" &&
            typeof window.localStorage !== "undefined"
        ) {
            var jsonVal = JSON.stringify(value);
            window.localStorage.setItem(_localStorageKey, jsonVal);
        }
    };
    var _getLocalStorage = function () {
        var value = localStorage.getItem(_localStorageKey);
        if (typeof value === "undefined") {
            return undefined;
        } else {
            return JSON.parse(value);
        }
    };
    var _getCurrentRecentlyViewedList = function () {
        return _getLocalStorage() || [];
    };
    var _removeDuplicateProfileId = function (profileId) {
        var currentList = _getCurrentRecentlyViewedList();
        if (!profileId) {
            return currentList;
        }
        var updatedList = [];
        for (var index = 0; index < currentList.length; index++) {
            if (currentList[index].trim().toLowerCase() !== profileId) {
                updatedList.push(currentList[index]);
            }
        }
        return updatedList;
    };
    var removeProfileIdFromLocalStorage = function (profileId) {
        if (!profileId) {
            return false;
        }
        profileId = profileId.trim().toLowerCase();
        var updatedList = _removeDuplicateProfileId(profileId);
        _setLocalStorage(updatedList);
        return true;
    };
    var callRecentlyViewedCarsApi = function (excludeProfileId, pageSource) {
        if (_isApiCalled === true) {
            return;
        }
        _isApiCalled = true;
        excludeProfileId = excludeProfileId || "";
        excludeProfileId = excludeProfileId.toLowerCase().trim();
        var profileIds = _getCurrentRecentlyViewedList();
        if (
            !profileIds ||
            (profileIds.length === 1 && profileIds[0] === excludeProfileId)
        ) {
            return;
        }
        var qs = "ids=";
        if (profileIds.length === 0) {
            return;
        }
        for (
            var currentIndex = 0;
            currentIndex < profileIds.length;
            currentIndex++
        ) {
            if (excludeProfileId !== profileIds[currentIndex]) {
                qs = qs + profileIds[currentIndex] + ",";
            }
        }
        qs = qs.substring(0, qs.length - 1);
        $.ajax({
            type: "GET",
            url: "/buy-used-cars/api/v1/stocks/?" + qs,
            dataType: "json",
            success: function (respose) {
                bindResponse(respose, pageSource);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                _isApiCalled = false;
            },
        });
    };
    var msitePageBinding = function (response, pageSource) {
        var templateContainerText = templateContainer
            .html()
            .replaceAll(/\{\{header\}\}/gi, "Recently Viewed Cars");
        var cardTemplateText = cardTemplate.html();
        var childrenTemplate = "";
        for (var index = 0; index < response.length; index++) {
            //if car is sold out dont show
            if (response[index].isSold === true) {
                removeProfileIdFromLocalStorage(response[index].profileId);
                continue;
            }
            childrenTemplate += replacePlaceHoldersForCarDetails(
                response[index],
                cardTemplateText,
                index, "301",
                pageSource
            );
        }
        childrenTemplate = childrenTemplate.replaceAll(
            "data-src",
            "src"
          );
        parentContainer.empty();
        parentContainer.append(templateContainerText);
        parentContainer.find(".recentlyViewedCard").empty();
        parentContainer.find(".recentlyViewedCard").append(childrenTemplate);
    }

    var desktopDetailsPageBinding = function (response, pageSource) {
        var templateContainerText = templateContainerDesktop
            .html()
            .replaceAll(/\{\{header\}\}/gi, "Recently Viewed Cars");
        var cardTemplateText = cardTemplateDesktop.html();
        var childrenTemplate = "";
        for (var index = 0; index < response.length; index++) {
            //if car is sold out dont show
            if (response[index].isSold === true) {
                removeProfileIdFromLocalStorage(response[index].profileId);
                continue;
            }
            childrenTemplate += replacePlaceHoldersForCarDetails(
                response[index],
                cardTemplateText,
                index,
                "302", pageSource
            );
        }
        parentContainer.empty();
        parentContainer.append(templateContainerText);
        parentContainer.find("ul").empty();
        parentContainer.find("ul").append(childrenTemplate);
    }

    var bindTracking = function () {
        parentContainer.find(".recentlyViewedCard a").on("click", function (event) {
            var profileid = document.getElementById("recentlyviewedcars_profileid").innerHTML;
            if (!profileid) {
                return;
            }
            var trackingElement = parentContainer.find(
                "a[data-profileId='" + profileid + "']"
            );
            if (!trackingElement) {
                return;
            }
            var trackingData = trackingElement.data();

            if (typeof analytics === "undefined") {
                return;
            }
            analytics.trackAction(
                "CWInteractive",
                trackingData.cat,
                trackingData.action,
                trackingData.label
            );
        });
    };

    var bindTrackingSearchPage = function () {
        parentContainer.find(".recentlyViewedCard a").on("click", function (event) {
            var eventCategory = $(this).attr("data-cat");
            var eventLabel = $(this).attr("data-label");
            var eventAction = $(this).attr("data-action");
            analytics.trackAction(
                "CWInteractive",
                eventCategory,
                eventAction,
                eventLabel
            );
        });
    };

    var bindResponse = function (response, pageSource) {
        switch (pageSource) {
            case "msiteDetailsPage": {
                msitePageBinding(response, pageSource);
                bindTracking();
                break;
            }
            case "desktopDetailsPage": {
                desktopDetailsPageBinding(response, pageSource);
                bindTracking();
                break;
            }
            case "msiteSearchPage": {
                msitePageBinding(response, pageSource);
                bindTrackingSearchPage();
                break;
            }
        }
        parentContainer.show();
    }

    var addTracking = function (childrenTemplate, pageSource, index, profileId) {
        var trackingParams = {
            "data-role": "click-tracking",
            "data-event": "CWInteractive",
            "data-label": "",
            "data-cat": "",
            "data-action": "ClickedRecentlyViewedCars",
        }
        if (pageSource === "msiteSearchPage") {
            trackingParams["data-label"] = "orderNumber" + (index + 1) + "|profileId=" + profileId;
            trackingParams["data-cat"] = "UsedCarSearch";
        }
        else if (pageSource === "desktopDetailsPage" || pageSource === "msiteDetailsPage") {
            trackingParams["data-label"] = "profileId=" + profileId + "|order=" + (index + 1) + "|platformId=" + "301";
            trackingParams["data-cat"] = "UsedCarDetails";
        }
        $(childrenTemplate).find("a").attr(trackingParams);
    }

    var replacePlaceHoldersForCarDetails = function (
        carDetails,
        nodeString,
        index,
        platformId,
        pageSource
    ) {
        if (typeof carDetails.mainImageUrl !== "undefined") {
            nodeString = nodeString.replaceAll(/\{\{carImage\}\}/gi, carDetails.mainImageUrl);
        }
        else {
            nodeString = nodeString.replaceAll(/\{\{carImage\}\}/gi, `${window.CloudfrontCDNHostURL}/images4/notavailable300x225.jpg`);
        }
        if (nodeString === "") {
            return "";
        }
        nodeString = nodeString.replaceAll(/(\{\{km\}\})/gi, carDetails.kilometers);
        nodeString = nodeString.replaceAll(/(\{\{fuel\}\})/gi, carDetails.fuelName);
        nodeString = nodeString.replaceAll(/(\{\{cityName\}\})/gi, carDetails.cityName);
        nodeString = nodeString.replaceAll(
            /\{\{makeYear\}\}/gi,
            carDetails.makeYear
        );
        nodeString = nodeString.replaceAll(/\{\{carName\}\}/gi, carDetails.carName);
        nodeString = nodeString.replaceAll(
            /\{\{carPrice\}\}/gi,
            carDetails.priceFormatted
        );

        var node = $("<div></div>").append(nodeString);

        // add href and img src
        $.each(node.find("a"), function () {
            $(this).prop("href", carDetails.carDetailsLink);
            $(this).attr("data-profileId", carDetails.profileId);
        });
        if (typeof carDetails.mainImageUrl !== "undefined" && carDetails.mainImageUrl !== "") {
            $.each(node.find("img"), function () {
                var imagePathList = carDetails.mainImageUrl.split("/");
                if (platformId === "301") {
                    imagePathList[3] = "370X208";
                } else {
                    imagePathList[3] = "227X128";
                }
                var newPath = imagePathList.join("/");
                $(this).attr("src", newPath);
            });
        }
        addTracking(node, pageSource, index, carDetails.profileId);
        return node.html();
    };
    var addProfileIdToLocalStorage = function (profileId) {
        if (!profileId) {
            return false;
        }
        profileId = profileId.trim().toLowerCase();
        var updatedList = _removeDuplicateProfileId(profileId);
        if (updatedList.length > 9) {
            updatedList.pop(); //remove the top element
        }
        updatedList.unshift(profileId); //push at 0 position
        _setLocalStorage(updatedList);
        return true;
    };
    return {
        addProfileIdToLocalStorage: addProfileIdToLocalStorage,
        removeProfileIdFromLocalStorage: removeProfileIdFromLocalStorage,
        callRecentlyViewedCarsApi: callRecentlyViewedCarsApi,
        hideRecentlyViewedCars: hideRecentlyViewedCars,
    };
})();
