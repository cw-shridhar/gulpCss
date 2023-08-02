const modelApi = "/api/v1/models/?makeId=-1&type=new&year=-1&application=3";
const makeApi = "/api/makes";
const downArrowUrl = `${window.CloudfrontCDNHostURL}/images4/downarrow.svg`;
const mmvPopupContainer = document.querySelector(".mmv-popup");
const carsContainer = document.querySelector(".cars-container");
const makeModelSearchElement = document.querySelector(".make-model-search");
const selectedMakeNode = document.querySelector("#selected-make-block");
const selectedModelNode = document.querySelector("#selected-model-block");
const makeSearchPlaceholder = "Type to Select Make";
const modelSearchPlaceholder = "Type to Select Model";
let selectedMakeId = -1, selectedModelId = -1;
let allMakeNodes, allModelNodes;
let modelClickCallback;
let hasRendered = false;

const getApiData = apiUrl => {
    return fetch(apiUrl, {
        headers: { 'ServerDomain': 'CarWale' },
    })
        .then(res => res.json());
}

const closeMmvPopup = () => {
    // add scroll to body
    document.body.style.overflowY = "auto";
    mmvPopupContainer.classList.add("display-none");
    if (typeof blackoutWindow !== 'undefined' && blackoutWindow) {
        blackoutWindow.classList.add("display-none");
    }
}

const showMmvPopup = (toRenderInBackground) => {
    if (!hasRendered) {
        render();
        hasRendered = true;
    }
    if (!toRenderInBackground) {
        displayMmvPopup();
    }
}

const showMmvPopupInResetState = () => {
    showMmvPopup();
    unselectMake();
}

const displayMmvPopup = () => {
    // remove scroll from body
    document.body.style.overflowY = "hidden";
    mmvPopupContainer.classList.remove("display-none");
    if (typeof blackoutWindow !== 'undefined' && blackoutWindow) {
        blackoutWindow.classList.remove("display-none");
    }
    makeModelSearchElement.focus();
}

const render = () => {
    const allMakesApiCall = getApiData(makeApi);
    const allModelsApiCall = getApiData(modelApi);
    Promise.all([allMakesApiCall, allModelsApiCall])
        .then(makeModels => renderByMmvData({
            allMakes: makeModels[0].sort((m1, m2) => m2.PriorityOrder - m1.PriorityOrder),
            allModels: makeModels[1],
            handleModelClick: openVersionSelectionPopup
        }));
}

const getMakeWiseModels = allModels => {
    const makeWiseModels = {};
    for (const model of allModels) {
        if (!makeWiseModels[model.makeId]) {
            makeWiseModels[model.makeId] = [model];
        }
        else {
            makeWiseModels[model.makeId].push(model);
        }
    }
    for (const makeId in makeWiseModels) {
        makeWiseModels[makeId].sort((m1, m2) => m1.modelName < m2.modelName ? -1 : 1);
    }
    return makeWiseModels;
}

const handleMakeClick = event => {
    let makeNode = event.target;
    makeNode = makeNode.classList.contains("mmv-popup-make") ? makeNode : makeNode.parentNode;
    scrollToTop(makeNode);
    if (selectedMakeId !== makeNode.dataset.makeId) {
        unselectModel();
    }
    selectedMakeId = makeNode.dataset.makeId;
    selectedMakeNode.querySelector(".selected-make-name").textContent = makeNode.dataset.makeName;
    selectedMakeNode.classList.remove("display-none");
    makeModelSearchElement.placeholder = modelSearchPlaceholder;
    const arrowImageNode = makeNode.querySelector(".down-arrow");
    arrowImageNode.classList.add("rotate-upside-down");
    makeModelSearchElement.value = "";
    makeModelSearchElement.focus();
    openMakeAccordion(selectedMakeId);

}


const openMakeAccordion = clickedMakeId => {
    for (const modelNode of allModelNodes) {
        const makeId = modelNode.dataset.makeId;
        if (clickedMakeId === makeId) {
            modelNode.classList.remove("display-none");
        }
        else {
            modelNode.classList.add("display-none");
        }
    }
}

const handleModelClick = event => {
    const modelNode = event.target;
    const modelAttributes = modelNode.dataset;
    selectedModelId = modelAttributes.modelId;
    selectedMakeId = modelAttributes.makeId;
    const { modelName, makeName } = modelAttributes;
    selectedModelNode.querySelector(".selected-model-name").textContent = modelName;
    selectedMakeNode.querySelector(".selected-make-name").textContent = makeName;
    selectedModelNode.classList.remove("display-none");
    selectedMakeNode.classList.remove("display-none");
    makeModelSearchElement.classList.add("display-none");
    makeModelSearchElement.value = "";
    searchForMakeModel();
    let modelJson =
    {
        "modelId": selectedModelId,
        "makeName": makeName,
        "modelName": modelName
    };
    let name = getVersionCallBackName();
    modelClickCallback(modelJson, name);
}

function getVersionCallBackName() {
    if (typeof pageName !== 'undefined') {
        switch (pageName) {
            case "Compare":
                return redirectToCompareDetailsPage;
            case "EmiCalculatorLandingPage":
                return redirectToModelEmiPage;
            default:
                return versionClickCallback;
        }
    }
    return versionClickCallback;
}

const versionClickCallback = version => {
    console.log(version);
}

const createMakeNode = make => {
    const makeNode = document.createElement("div");
    makeNode.classList.add("mmv-popup-make");
    makeNode.dataset.makeId = make.makeId;
    makeNode.dataset.makeName = make.makeName;
    makeNode.onclick = handleMakeClick;

    makeNode.appendChild(getImageNode({
        className: "mr-3",
        width: "46",
        height: "28",
        url: make.logoUrl
    }));

    const makeNameNode = document.createElement("p");
    makeNameNode.classList.add("make-name");
    makeNameNode.textContent = make.makeName;
    makeNode.appendChild(makeNameNode);

    makeNode.appendChild(getImageNode({
        width: "12",
        height: "12",
        url: downArrowUrl,
        className: "down-arrow"
    }))

    return makeNode;
}

const createModelNode = model => {
    const modelNode = document.createElement("div");
    modelNode.classList.add("mmv-popup-model-name");
    modelNode.classList.add("display-none");
    modelNode.textContent = model.modelName;
    modelNode.dataset.makeId = model.makeId;
    modelNode.dataset.modelName = model.modelName;
    modelNode.dataset.makeName = model.makeName;
    modelNode.dataset.modelId = model.modelId;
    modelNode.dataset.versionId = model.versionId;
    modelNode.onclick = handleModelClick;
    return modelNode;
}


const renderByMmvData = makeModelData => {
    const { allMakes, allModels, handleModelClick } = makeModelData;
    modelClickCallback = handleModelClick;
    setMakeImages(allMakes);
    const makeWiseModels = getMakeWiseModels(allModels);
    const fragment = document.createDocumentFragment();
    for (const make of allMakes) {
        if (makeWiseModels[make.makeId]) {
            fragment.appendChild(createMakeNode(make));
            for (const model of makeWiseModels[make.makeId]) {
                fragment.appendChild(createModelNode(model));
            }
        }
    }
    carsContainer.appendChild(fragment);
    allMakeNodes = document.querySelectorAll(".mmv-popup-make");
    allModelNodes = document.querySelectorAll(".mmv-popup-model-name");
}

const setMakeImages = allMakes => {
    for (const make of allMakes) {
        make.logoUrl = `${make.hostUrl}0x0${make.logoUrl}`;
    }
}


const getImageNode = attributes => {
    const { className, width, height, url } = attributes;
    const imageNode = document.createElement("img");
    imageNode.src = url;
    imageNode.loading = "lazy";
    imageNode.width = width;
    imageNode.height = height;
    imageNode.classList.add(className);
    return imageNode;
}

const downArrowImageNode = getImageNode({
    width: "12px",
    height: "12px",
    url: downArrowUrl
});


const searchForMakeModel = (shouldShowModelsForEmptyQuery) => {
    const searchQuery = makeModelSearchElement.value.toLowerCase();
    const matchingMakes = {};
    let firstMatchingModel;
    if (allModelNodes) {
        for (const modelNode of allModelNodes) {
            const makeId = modelNode.dataset.makeId;
            const modelName = modelNode.textContent;
            if ((selectedMakeId === -1 || selectedMakeId === makeId) && searchQuery && modelName.toLowerCase().includes(searchQuery)) {
                const matchedPart = modelName.substr(modelName.toLowerCase().indexOf(searchQuery), searchQuery.length);
                modelNode.innerHTML = modelName.replace(matchedPart, `<strong class="pointer-events-none">${matchedPart}</strong>`);
                modelNode.classList.remove("display-none");
                matchingMakes[makeId] = 1;
                if (!firstMatchingModel) {
                    firstMatchingModel = modelNode;
                }
            }
            else if (shouldShowModelsForEmptyQuery && selectedMakeId === makeId && !searchQuery) {
                modelNode.innerHTML = modelName;
                modelNode.classList.remove("display-none");
            }
            else {
                modelNode.innerHTML = modelName;
                modelNode.classList.add("display-none");
            }
        }
    }
    const makeNode = document.querySelector(`[data-make-id='${firstMatchingModel?.dataset?.makeId}']`);
    scrollToTop(makeNode);
    if (allMakeNodes) {
        for (const makeNode of allMakeNodes) {
            const makeId = makeNode.dataset.makeId;
            const makeNameNode = makeNode.querySelector(".make-name");
            const makeName = makeNameNode?.textContent;
            if (!makeName) {
                continue;
            }
            if (searchQuery && makeName.toLowerCase().includes(searchQuery) && selectedMakeId === -1) {
                const matchedPart = makeName.substr(makeName.toLowerCase().indexOf(searchQuery), searchQuery.length);
                makeNameNode.innerHTML = makeName.replace(matchedPart, `<strong class="pointer-events-none">${matchedPart}</strong>`);
                if (!firstMatchingModel) {
                    openMakeAccordion(makeId);
                    scrollToTop(makeNode);
                }
            }
            else {
                makeNameNode.innerHTML = makeName;
            }
        }
    }
}

const unselectModel = () => {
    selectedModelId = -1;
    selectedModelNode.classList.add("display-none");
    makeModelSearchElement.placeholder = modelSearchPlaceholder;
    makeModelSearchElement.classList.remove("display-none");
    makeModelSearchElement.value = "";
    makeModelSearchElement.focus();
    searchForMakeModel();
}

const unselectMake = () => {
    unselectModel();
    selectedMakeId = -1;
    selectedMakeNode.classList.add("display-none");
    makeModelSearchElement.placeholder = makeSearchPlaceholder;
    makeModelSearchElement.classList.remove("display-none");
    scrollToTop(carsContainer.firstElementChild);
}

const scrollToTop = element => {
    if (element) {
        const topFixedElementHeight = 122;
        carsContainer.scroll(0, element.offsetTop - topFixedElementHeight);
    }
}

const unselectMakeFromVersionPopup = () => {
    closeVersionSelectionPopup();
    showMmvPopup();
    unselectMake();
}

const unselectModelFromVersionPopup = () => {
    unselectModel();
    closeVersionSelectionPopup();
    showMmvPopup();
    //click the already selected make
    if (document.querySelector(`[data-make-id="${selectedMakeId}"]`)) {
        document.querySelector(`[data-make-id="${selectedMakeId}"]`).click();
    }
    else {
        setTimeout(function () {
            document.querySelector(`[data-make-id="${selectedMakeId}"]`)?.click();
        }, 500);
    }
}
