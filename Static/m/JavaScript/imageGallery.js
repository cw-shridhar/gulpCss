const exteriorTab = document.querySelector("#exterior");
const interiorTab = document.querySelector("#interior");
const galleryTabContainer = document.querySelector(".image-category-tab-container");
let selectedTab = galleryTabContainer.querySelector(".selected-tab");
const imageCount = 16;
const imageSize = "640x348";
const isInteriorPage = selectedTab.id === "interior";

const handleGalleryTabClick = tabClickEvent => {
    const clickedTab = tabClickEvent.target;
    if (clickedTab === selectedTab) {
        return;
    }
    const [sectionToShow , sectionToHide  ] = clickedTab === exteriorTab ? [exteriorImagesSection, interiorImagesSection ] :
                                                                            [interiorImagesSection , exteriorImagesSection] ;
    showSection(sectionToShow);
    hideSection(sectionToHide);
    selectedTab = clickedTab;
}

const reloadToExteriorSection = () => {
    location.href = `${defaultImageUrl}#gallery-heading`;
}

const exteriorImagesSection = {
    containerId: "exterior-image-gallery",
    tabId: "exterior",
    loadMoreClickCount: 0,
    api: `/api/modelImagesByCategory/?modelId=${carModelId}&category=2`,
    images: JSON.parse(exteriorImages.replace(/(&quot\;)/g, "\"")),
    loadMoreButtonId: "load-more-exterior"
}

const interiorImagesSection = {
    containerId: "interior-image-gallery",
    tabId: "interior",
    loadMoreClickCount: 0,
    api: `/api/modelImagesByCategory/?modelId=${carModelId}&category=1`,
    images: JSON.parse(interiorImages.replace(/(&quot\;)/g, "\"")),
    loadMoreButtonId: "load-more-interior"
}

const addEventListeners = () =>  {
    const currentSectionData = selectedTab.id === "exterior" ? exteriorImagesSection : interiorImagesSection;
    document.querySelector(".load-more")?.addEventListener("click", () => loadMoreGalleryImages(currentSectionData));
    exteriorTab.addEventListener("click", isInteriorPage ? reloadToExteriorSection : handleGalleryTabClick);
    interiorTab.addEventListener("click", handleGalleryTabClick);
    document.querySelectorAll("#gallery-image-url").forEach(element => {
        element.addEventListener("click", e => {
            e.preventDefault();
        });
    });
    document.querySelectorAll(".gallery-image").forEach(image => {
        image.addEventListener("click", handleGalleryImageClick);
    })
}

const idToElementMapping = {
    "exterior": exteriorTab,
    "interior": interiorTab,
    "exterior-image-gallery": document.querySelector("#exterior-image-gallery"),
    "interior-image-gallery": document.querySelector("#interior-image-gallery"),
};

const showSection = sectionData => {
    const {tabId, containerId, api, images} = sectionData;
    idToElementMapping[tabId].classList.add("selected-tab");
    if (idToElementMapping[containerId]) {
        idToElementMapping[containerId].classList.remove("display-none");
        return;
    }
    //container doesn't exist. so create one
    if (images.length > 0) {
        createGallerySection(sectionData, images)
    }
    else {
        getApiData(api).then(images => createGallerySection(sectionData, images));
    }
}

const hideSection = sectionData => {
    const {tabId, containerId} = sectionData;
    idToElementMapping[tabId].classList.remove("selected-tab");
    idToElementMapping[containerId].classList.add("display-none");
}

const createGallerySection = (sectionData, images) => {
    if (images.length <= 0) {
        idToElementMapping[sectionData.tabId].classList.add("display-none");
    }
    sectionData.images = images;
    const {containerId} = sectionData;
    const container = document.createElement("div");
    container.classList.add("mb-4");
    container.id = containerId;
    container.appendChild(getImagesFragment(images));
    if (images.length > imageCount) {
        const loadMoreButton = document.createElement("button");
        loadMoreButton.classList.add("load-more");
        loadMoreButton.textContent = "Load More";
        loadMoreButton.id = sectionData.loadMoreButtonId;
        loadMoreButton.addEventListener("click", () => loadMoreGalleryImages(sectionData));
        container.appendChild(loadMoreButton);
    }
    document.querySelector("#gallery-section").appendChild(container);
    idToElementMapping[containerId] = container;
}

const getImagesFragment = (images, offsetForImageIndex = 0) => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < images.length && i < imageCount; i += 2) {
        const imageRowElement = document.createElement("div");
        imageRowElement.classList.add("image-row");
        for (let j = i; j < i + 2 && j < images.length; j++) {
            const {path, imageTitle, id} = images[j];
            const imageElement = document.createElement("img");
            imageElement.src = path;
            imageElement.style.width = '49.4%';
            imageElement.alt = imageTitle;
            imageElement.title = imageTitle;
            imageElement.loading = "lazy";
            imageElement.dataset.index = j + offsetForImageIndex;
            imageElement.dataset.id = id;
            imageElement.addEventListener("click", handleGalleryImageClick);
            imageRowElement.appendChild(imageElement);
        }
        fragment.appendChild(imageRowElement);
    }
    return fragment;
}

const loadMoreGalleryImages = sectionData => {
    const {loadMoreClickCount, loadMoreButtonId, images} = sectionData;
    const startIndex = (loadMoreClickCount + 1) * imageCount;
    const endIndex = startIndex + imageCount;
    const imagesToShow = images.slice(startIndex, endIndex);
    const imagesFragment = getImagesFragment(imagesToShow, startIndex);
    const loadMoreButton = document.getElementById(loadMoreButtonId);
    idToElementMapping[sectionData.containerId].insertBefore(imagesFragment, loadMoreButton);
    ++sectionData.loadMoreClickCount;
    if (endIndex >= images.length) {
        loadMoreButton.classList.add("display-none");
    }
}

addEventListeners();
