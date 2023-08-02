function toggleSideNav() {
    var displayValue = $(".side-nav-overlay").css("display");
    if(displayValue == "block") {
        $(".side-nav-overlay").toggle();
        $(".side-nav-container").toggleClass("side-nav-container-active");
        $("body").css("overflow", "");
    }else{
        $(".side-nav-container").toggleClass("side-nav-container-active");
        $(".side-nav-overlay").toggle();
        $("body").css("overflow", "hidden");
    }
}

function toggleHeaderSearchOverlay() {
    var displayValue = $(".header-search-overlay").css("display");
    if(displayValue == "block") {
        $(".header-search-overlay").toggle();
        $(".header-search-container").hide();
        $("body").css("overflow", "");
    }else{
        GetGlobalSearchCampaigns.bindCampaignData();
        $(".header-search-overlay").toggle();
        $(".header-search-container").show();
        $("body").css("overflow", "hidden");
        $("#header-car-search").focus();
    }
}

const handleGlobalSearch = debounce(searchText => {
    $("#header-search-car-list").empty();

    if(searchText == null || searchText === "") {
        return;
    }

    var url = "/api/v3/autocomplete/?";
    const options = {
        source: "1,2,3,5,11,15,13,10,16,17,4,8,18,6,7",
        value: searchText,
        size: 5,
        showFeatured: true,
        isNcf: false,
        applicationId : 3,
        showNoResult: true,
      };
    $.ajax({
        type: "GET",
        url: url,
        headers: { 'ServerDomain': 'CarWale' },
        data: options
    })
    .done(function(response){
        if(response === null || response.length === 0) {
            return;
        }

        for(var i = 0 ; i < response.length ; i++) {
            var listText = response[i]["displayName"];
            var regex = new RegExp(searchText, "gi");
            var strongText = listText.replace(regex, function(str) {
                return "<strong>" + str + "</strong>"
            });
            var listUrl = response[i]["payload"]["url"]
            let additonalInfo = response[i]["additionalInfo"];

            let li = document.createElement("li");
            li.setAttribute("class", "autocomplete-result");
            li.setAttribute("data-index", i+1);

            let anchorEl = document.createElement("a");
            anchorEl.classList.add("autocomplete-result-text", "full-width");
            anchorEl.setAttribute("href", listUrl);
            anchorEl.setAttribute("title", strongText);
            anchorEl.innerHTML = strongText;

            let spanEL = document.createElement("span");
            spanEL.setAttribute("class", "autocomplete-result-tags");
            if(response[i]["isFeatured"]) {
                additonalInfo = "Ad";
                spanEL.classList.add("ad");
            }
            spanEL.innerText = additonalInfo;

            li.append(anchorEl, spanEL);

            $("#header-search-car-list").append(li);
        }
    })
    .fail(function(){
        console.error("Error occured");
        return;
    });
});

function headerCarSearch() {
    var searchText = $("#header-car-search").val();
    handleGlobalSearch(searchText);
}