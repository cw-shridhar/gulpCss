/*Code to Fetch Trending Cars And User History */
var GetGlobalSearchCampaigns = {
    platform: {
        Mobile: 43,
        Desktop: 1
    },

    application: {
        CarWale: 1,
        BikeWale: 2,
        CarTrade: 3
    },

    registerEvents: function (platform) {
        $(document).on("click", ".trending-section", function (e) {
            if (!$(".ui-autocomplete-input").is(":focus")) {
                if (e.target.className !== "common-global-search")
                    $('.common-global-search').hide();
                if (e.target.className !== "homepage-banner")
                    $('.homepage-banner-search').hide();
                $('body').removeClass('trending-section');
            }
        });
        GetGlobalSearchCampaigns.platformId = platform;
    },

    globalCarClick: function (data, index, type) {
        var isMobile = GetGlobalSearchCampaigns.platformId == GetGlobalSearchCampaigns.platform.Mobile;
        GetGlobalSearchCampaigns.logClicks(data, type, 'global-search-popup-cars', index, isMobile);
        window.location = '/' + data.makeMaskingName + '-cars/' + data.maskingName + '/';
    },

    bindCampaignData: function (isMobile) {
        // bind recently viewed models html
        GetGlobalSearchCampaigns.bindHistoryHtml(JSON.parse(localStorage.getItem("recentlyViewedModels")) ?? []);
        GetGlobalSearchCampaigns.bindTrendingCarData();
    },

    removeHistoryModelsFromTrending: function (jsonData) {
        var trendingCarData;
        if (typeof jsonData == 'object') {
            trendingCarData = jsonData.trendingCars;
        }
        else {
            trendingCarData = JSON.parse(jsonData);
        }
        var arrUserHistory = JSON.parse(localStorage.getItem("recentlyViewedModels")) ?? [];

        if ($.type(trendingCarData) !== "array") {
            if (typeof jsonData == 'object') {
                trendingCarData = JSON.parse(trendingCarData);
            }
            else {
                trendingCarData = trendingCarData.trendingCars;
            }
        }
        if (trendingCarData != null) {
            for (var i = 0; i < arrUserHistory.length; i++) {
                trendingCarData = trendingCarData.filter(function (obj) { return obj.modelId.toString() !== arrUserHistory[i].ModelId });
            }
            if (jsonData.sponsoredModel != null)
                trendingCarData.splice(jsonData.sponsoredModel.adPosition - 1, 0, jsonData.sponsoredModel);
            //update bindTrendingHtml function to bind trending data
            GetGlobalSearchCampaigns.bindTrendingHtml(trendingCarData.slice(0, 5));
        }
    },

    bindTrendingHtml: function (data) {
        if (data.length == 0) {
            $('.trending-search').empty();
        }
        else {
            $('.trending-list').empty();
            for (index = 0; index < data.length; index++) {
                var item = data[index];
                const li = document.createElement("li");
                li.classList.add("global-search-item");
                const anchor = document.createElement("a");
                const upcomingSpan = item.isUpcoming ? "<span class='autocomplete-result-tags'>Coming Soon</span>" : "";
                let trendingIcon = `<svg class="mr-3" viewBox="0 0 16 16" tabindex="-1" width="16" height="16" focusable="false" aria-hidden="true" role="img"><path d="M.25 12.39a.5.5 0 010-.71l5-5a.49.49 0 01.36-.15.47.47 0 01.39.11l3 3 5.18-5.19h-2.82a.5.5 0 01-.5-.5.51.51 0 01.5-.5h4a.52.52 0 01.35.15.43.43 0 01.19.4v4a.5.5 0 01-1 0V5.17l-5.54 5.54a.5.5 0 01-.35.14H9a.5.5 0 01-.35-.14l-3-3L1 12.39a.49.49 0 01-.75 0z"></path></svg>`;
                anchor.classList.add("font-valhalla", "full-width", "m-0", "p-0");
                anchor.href = `/${item.makeMaskingName}-cars/${item.maskingName}/`;
                if(item.hasOwnProperty("adPosition")) {
                    trendingIcon = "<span class='global-trending-ad mr-3'>AD</span>";
                }
                anchor.innerHTML = `${trendingIcon} ${item.makeName} ${item.modelName} ${upcomingSpan}`;
                anchor.title = `${item.makeName} ${item.modelName}`;
                li.appendChild(anchor);
                $('.trending-list').append(li);
            }
        }
    },

    bindHistoryHtml: function (data) {
        if (data.length == 0) {
            $('.history-search').empty();
        }
        else {
            $('.recent-list').empty();
            for (index = 0; index < data.length; index++) {
                var item = data[index];
                const li = document.createElement("li");
                li.classList.add("global-search-item");
                const anchor = document.createElement("a");
                anchor.classList.add("font-valhalla", "full-width", "m-0", "p-0");
                anchor.href = item.Url;
                anchor.innerHTML = `<svg viewBox="0 0 16 16" class="mr-3" width="16" height="16" tabindex="-1" focusable="false" aria-hidden="true" role="img"><path d="M8 15.9A7.9 7.9 0 1115.9 8 7.9 7.9 0 018 15.9zM8 1.1A6.9 6.9 0 1014.9 8 6.91 6.91 0 008 1.1zM11.54 12a.5.5 0 01-.34-.13l-3.86-3.5A.52.52 0 017.18 8V4.46a.5.5 0 011 0v3.32l3.7 3.39a.51.51 0 010 .71.54.54 0 01-.34.12z"></path></svg> ${item.CarName}`;
                anchor.title = item.CarName;
                li.appendChild(anchor);
                $('.recent-list').append(li);
            }
        }
    },

    bindRecentlyViewModels : function(makeName, modelName, modelId) {
        let recentModels = JSON.parse(localStorage.getItem("recentlyViewedModels")) ?? [];
        let model = {
            "ModelId" : modelId,
            "CarName" : makeName + " " + modelName,
            "Url": window.location.href,
            "UpdatedOn": new Date(),
        }
        for(let i=0;i<recentModels.length; i++)
        {
            if(recentModels[i].ModelId == model.ModelId)
            {
                recentModels.splice(i,1);
            }
        }
        if(recentModels.length === 5) {
            recentModels[0] = model;
            recentModels.sort((a,b)=> new Date(a.UpdatedOn).getTime() - new Date(b.UpdatedOn).getTime());
        }
        else
        {
            recentModels.push(model);
        }
        localStorage.setItem("recentlyViewedModels", JSON.stringify(recentModels));
    },

    fetchTrendingCarsfromApi : function() {
        var config = {};
        let cityId = GetCookieByName("cookie_cw_cityid");
        config.contentType = "application/json";
        config.async = true;
        config.data = { count: 10, platformid: GetGlobalSearchCampaigns.platform.Mobile, applicationId: GetGlobalSearchCampaigns.application.CarTrade, cityId: cityId };
        return Common.utils.ajaxCall('/api/trending/models/', config);
    },

    bindTrendingCarData: function () {
        let cityId = GetCookieByName("cookie_cw_cityid");
        let trendindCarsData = sessionStorage.getItem("trendingCars_" + cityId);
        if (trendindCarsData == null) {
            $.when(GetGlobalSearchCampaigns.fetchTrendingCarsfromApi()).done(function (jsonData) {
                if (jsonData != null) {
                    sessionStorage.setItem("trendingCars_" + cityId, JSON.stringify(jsonData));
                }
                GetGlobalSearchCampaigns.removeHistoryModelsFromTrending(jsonData);
            });
        }
        else
        {
            GetGlobalSearchCampaigns.removeHistoryModelsFromTrending(trendindCarsData);
        }
    },
}
