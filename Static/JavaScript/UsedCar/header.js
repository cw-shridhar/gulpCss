const globalSearchContainer = document.querySelector(".js-global-search-section");
const globalSearchInput = document.getElementById("topsearch_query");
const suggestionsList = document.getElementById("header-search-car-list");
const blackoutWindow = document.querySelector(".black-out-window");

function removeCityCookie() {
    let currentTime = new Date();
    currentTime.setDate(currentTime.getDate() - 30);
    let currentDomain = window.location.hostname;
    if (currentDomain !== "localhost") {
        currentDomain.replace("www.", "");
        currentDomain = "." + currentDomain;
    }
    document.cookie = "cd-city-id = '';expires=" + currentTime + ";path=/;domain=" + currentDomain;
    document.cookie = "cd-city-ct = '';expires=" + currentTime + ";path=/;domain=" + currentDomain;
}

function toTopHover() {
    $("#toTop img").attr("src", `${window.CloudfrontCDNHostURL}/images4/top-btn2-hover.svg`);
}

function toTopHOut() {
    $("#toTop img").attr("src", `${window.CloudfrontCDNHostURL}/images4/top-btn2.svg`);
}

window.onscroll = function () {
    displayToTop()
};

function displayToTop() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        $("#toTop").fadeIn();
        $("#menunew3").show();
    } else {
        $("#toTop").fadeOut();
        $("#menunew3").hide();
    }
}

function toTopClicked() {
    window.scroll({ top: 0, behavior: "smooth" });
}

function openGlobalSearch() {
    globalSearchContainer.style.display = "block";
    GetGlobalSearchCampaigns.bindCampaignData();
}

function closeGlobalSearch() {
    setTimeout(() => {
        globalSearchContainer.style.display = "none";
    }, 250);
}

const handleGlobalSearch = debounce(searchText => {
    console.log("called");
    // empty the list
    suggestionsList.innerHTML = "";

    if (!searchText) {
        return;
    }

    let url = `/api/v3/autocomplete/?source=1,2,3,5,11,15,13,10,16,17,4,8,18,6,7&value=${searchText}&size=5&showFeatured=true&isNcf=false&applicationId=3&showNoResult=true`;
    fetch(url, {
        headers: { "ServerDomain": "CarWale" }
    })
        .then(res => res.json())
        .then(response => {
            for (let i = 0; i < response.length; i++) {
                const listText = response[i]["displayName"];
                const regex = new RegExp(searchText, "gi");
                const strongText = listText.replace(regex, function (str) {
                    return "<strong>" + str + "</strong>"
                });
                const listUrl = response[i]["payload"]["url"]
                const additonalInfo = response[i]["additionalInfo"];
                if (response[i]["isFeatured"]) {
                    additonalInfo = "Ad";
                }

                const li = document.createElement("li");
                li.setAttribute("class", "autocomplete-result");
                li.setAttribute("data-index", i + 1);

                const anchorEl = document.createElement("a");
                anchorEl.setAttribute("class", "autocomplete-result-text p-0 m-0");
                anchorEl.setAttribute("href", listUrl);
                anchorEl.setAttribute("title", listText);
                anchorEl.innerHTML = strongText;

                const spanEL = document.createElement("span");
                spanEL.setAttribute("class", "autocomplete-result-tags");
                if (response[i]["isFeatured"]) {
                    spanEL.classList.add("ad");
                }
                spanEL.innerText = additonalInfo;

                li.append(anchorEl, spanEL);
                suggestionsList.appendChild(li);
            }
        })
        .catch(err => {
            console.error("Error occured");
        });
});

function headerCarSearch() {
    let searchText = globalSearchInput.value;
    handleGlobalSearch(searchText)
}
