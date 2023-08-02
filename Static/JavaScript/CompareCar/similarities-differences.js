const similaritiesCheckbox = document.getElementById("showSimilarities");
const differencesCheckbox = document.getElementById("showDifferences");
const similaritiesCheckboxSticky = document.getElementById("showSimilaritiesSticky");
const differencesCheckboxSticky = document.getElementById("showDifferencesSticky");
const similarities = document.querySelectorAll(".js-similar");
const differences = document.querySelectorAll(".js-different");
const specFeatureCategories = document.querySelectorAll(".js-spec-feature-category");

function showSimilarities() {
    if (!similaritiesCheckbox.checked) {
        deSelectShowSimilarites();
        return;
    }
    if (differencesCheckbox.checked) {
        deSelectHighlightDifferences();
    }
    selectShowSimilarites();
}

function highlightDifferences() {
    if (!differencesCheckbox.checked) {
        deSelectHighlightDifferences();
        return;
    }
    if (similaritiesCheckbox.checked) {
        deSelectShowSimilarites();
    }
    selectHighlightDifferences();
}

function showSimilaritiesSticky() {
    similaritiesCheckbox.checked = similaritiesCheckboxSticky.checked;
    showSimilarities();
}

function highlightDifferencesSticky() {
    differencesCheckbox.checked = differencesCheckboxSticky.checked;
    highlightDifferences();
}

function selectShowSimilarites() {
    similaritiesCheckbox.checked = true;
    similaritiesCheckboxSticky.checked = true;
    differences?.forEach(difference => difference.classList.add("display-none"));

    //remove categories with no content
    specFeatureCategories?.forEach(
        category => {
            let categoryContent = category.nextElementSibling;
            if (categoryContent.scrollHeight === 0) {
                category.classList.add("display-none");
            }
        });
}

function deSelectShowSimilarites() {
    similaritiesCheckbox.checked = false;
    similaritiesCheckboxSticky.checked = false;
    differences?.forEach(difference => difference.classList.remove("display-none"));

    //remove display-none from hidden categories
    specFeatureCategories?.forEach(
        category => {
            category.classList.remove("display-none");
        });
}


function selectHighlightDifferences() {
    differencesCheckbox.checked = true;
    differencesCheckboxSticky.checked = true;
    similarities?.forEach(similarity => similarity.classList.add("display-none"));

    //remove categories with no content
    specFeatureCategories?.forEach(
        category => {
            let categoryContent = category.nextElementSibling;
            if (categoryContent.scrollHeight === 0) {
                category.classList.add("display-none");
            }
        });
}

function deSelectHighlightDifferences() {
    differencesCheckbox.checked = false;
    differencesCheckboxSticky.checked = false;
    similarities?.forEach(similarity => similarity.classList.remove("display-none"));

    // remove display-none from hidden categories
    specFeatureCategories?.forEach(
        category => {
            category.classList.remove("display-none");
        });
}
