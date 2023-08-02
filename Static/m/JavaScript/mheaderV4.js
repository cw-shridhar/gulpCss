const mheaderV4 =  (function() {
    toggleSideNav = () => {
        const blackOutWindow = document.querySelector(".js-blackout-window");
        const navBarContainer = document.querySelector(".js-navbar-container");
        if(blackOutWindow.classList.contains("display-none")) {
            blackOutWindow.classList.remove("display-none");
            navBarContainer.classList.add("navbar-container-active");
            document.body.classList.add("overflow-hidden");
        }
        else {
            blackOutWindow.classList.add("display-none");
            navBarContainer.classList.remove("navbar-container-active");
            document.body.classList.remove("overflow-hidden");
        }
    }

    toggleHeaderSearchOverlay = () => {
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

    handleGlobalSearch = debounce(searchText => {
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

    headerCarSearch = () => {
        var searchText = $("#header-car-search").val();
        handleGlobalSearch(searchText);
    }

    /**
     * Accordion title must have a class called "js-nav-title"
     * Its next sibling element will act as container for the accordion content and will expand/collapse
     * Refer => Views\Shared\_MHeader_V4.cshtml
     */
    const navTitles = document.querySelectorAll(".js-nav-title");
    if (navTitles) {
        navTitles.forEach(title => {
            title.addEventListener("click", () => {
                title.classList.toggle("active");
                const navContent = title.nextElementSibling;
                if (navContent.classList.contains("height-0")) {
                    navContent.classList.remove("height-0");
                    navContent.classList.add("height-auto", "overflow-intial");
                } else {
                    navContent.classList.add("height-0");
                    navContent.classList.remove("height-auto", "overflow-intial")
                }
            }, false);
        });
    }

    return {
        toggleSideNav,
        toggleHeaderSearchOverlay,
        headerCarSearch
    };
})();
