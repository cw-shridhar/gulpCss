const searchInput = document.querySelector(".js-search-spec-feature");
const searchContainer = document.querySelector(".js-search-container");
const specsSuggestionsList = document.querySelector(".js-spec-feature-suggestions");
const stickyModelCardHeight = 130;
const specsAndFeatures = [];
let isSearchActive = false;

document.querySelectorAll(".js-spec-feature").forEach(suggestion => {
    specsAndFeatures.push({ name: suggestion.textContent, value: suggestion.dataset.value });
});

document.addEventListener("click", function(e){
    const isClickInside = searchInput.contains(e.target)
    if (isSearchActive && !isClickInside) {
        resetSearch();
    }
})

function searchSpecOrFeature() {
    // reset list
    specsSuggestionsList.innerHTML = "";

    const searchTerm = searchInput.value.toLowerCase();
    if(searchTerm === "") {
        return;
    }

    var regex = new RegExp(searchTerm, "gi");

    specsAndFeatures.map(function(specOrFeature, index) {
        if(regex.test(specOrFeature.name)) {
            const li = document.createElement("li");
            li.classList.add("color-dark-gray");
            addClassesToSuggestion(li);

            var formattedName = specOrFeature.name.replace(regex, function (str) {
                return "<span class='color-charcoal'>" + str + "</span>";
            });

            li.dataset.testingId = "spec-feature-suggestion-item-" + index;

            li.innerHTML = formattedName;
            li.addEventListener("click", function() {
                const subHeading = document.querySelector(`#${specOrFeature.value}`);
                const top = parseInt(subHeading.getBoundingClientRect().top, 10);
                const distance = top + parseInt(window.pageYOffset, 10) - stickyModelCardHeight;
                window.scrollTo({top: distance, behavior: "smooth"});

                // reset
                resetSearch();

            });
            specsSuggestionsList.appendChild(li);
        }
    });

    if(!specsSuggestionsList.innerHTML) {
        const li = document.createElement("li");
        li.textContent = "No Result Found";
        li.classList.add("color-charcoal");
        addClassesToSuggestion(li);
        li.dataset.testingId = "spec-feature-suggestion-item-not-found";
        specsSuggestionsList.appendChild(li);
    }
}

function resetSearch() {
    searchInput.value = "";
    specsSuggestionsList.innerHTML = "";
    isSearchActive = false;
}

function openSearch() {
    isSearchActive = true;
    if (similaritiesCheckbox.checked) {
        deSelectShowSimilarites();
    }
    if (differencesCheckbox.checked) {
        deSelectHighlightDifferences();
    }
}

function addClassesToSuggestion(li) {
    li.classList.add("font-15", "border-bottom", "pt-4", "pr-4", "pb-4", "pl-3", "cursor-pointer", "bg-white");
}
