const searchInput = document.querySelector(".js-search-spec-feature");
const searchContainer = document.querySelector(".js-search-container");
const suggestionsList = document.querySelector(".js-spec-feature-suggestions");
const stickyModelCards = document.querySelector(".js-car-stick-top");
const searchOverlay = document.querySelector(".search-container-overlay");
const stickModelCardHeight = 120;
let specsAndFeatures = [];

document.querySelectorAll(".js-spec-feature").forEach(suggestion => {
	specsAndFeatures.push({ name: suggestion.textContent, accordion: suggestion.dataset.accordion, value: suggestion.dataset.value });
});


function searchSpecOrFeature() {
    // reset list
    suggestionsList.innerHTML = "";

    const searchTerm = searchInput.value.toLowerCase();
    if(searchTerm === "") {
        return;
    }

    var regex = new RegExp(searchTerm, "gi");

    specsAndFeatures.map(function(specOrFeature, index) {
        if(regex.test(specOrFeature.name)) {
            const li = document.createElement("li");
            li.classList.add("spec-feature-suggestion-item");

            var formattedName = specOrFeature.name.replace(regex, function (str) {
                return "<span class='highlight'>" + str + "</span>";
            });

            li.dataset.testingId = "spec-feature-suggestion-item-" + index;

            li.innerHTML = formattedName;
            li.addEventListener("click", function() {
                const accordion = document.querySelector(`.js-${specOrFeature.accordion}-accordion`);
                accordion.classList.add("active");
                const accordionContent = accordion.nextElementSibling;
                accordionContent.style.maxHeight = `${accordionContent.scrollHeight + 1}px`;
                const subHeading = document.querySelector(`#${specOrFeature.value}`);
                const top = parseInt(subHeading.getBoundingClientRect().top);
                const distance = top + parseInt(window.pageYOffset) - stickModelCardHeight;
                window.scrollTo({top: distance, behavior: "smooth"});

                // reset
                resetCompareSearch();

            });
            suggestionsList.appendChild(li);
        }
    });

    if(!suggestionsList.innerHTML) {
        const li = document.createElement("li");
        li.textContent = "No Result Found";
        li.classList.add("spec-feature-suggestion-item");
        li.classList.add("not-found");
        li.dataset.testingId = "spec-feature-suggestion-item-not-found";
        suggestionsList.appendChild(li);
    }
}

function resetCompareSearch() {
    searchInput.value = "";
    suggestionsList.innerHTML = "";
    searchContainer.classList.remove("active");
    searchOverlay.classList.remove("active");
    searchSpecFeaturesButton.classList.remove("selected");
}

function clearSpecFeatureSearch() {
    searchInput.value = "";
    suggestionsList.innerHTML = "";
}

function openSearch() {
    if (similaritiesButton.classList.contains("selected")) {
        deSelectShowSimilarites();
    }
    if (differencesButton.classList.contains("selected")) {
        deSelectHighlightDifferences();
    }
    searchSpecFeaturesButton.classList.add("selected");
    searchContainer.classList.add("active");
    stickyModelCards.classList.add("inactive");
    searchOverlay.classList.add("active");
}
