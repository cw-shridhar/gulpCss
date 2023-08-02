(function() {
    const  exteriorContainer = document.querySelector(".exterior-section");
    const interiorContainer = document.querySelector(".interior-section");

    let exteriorAccPanel = document.querySelector(".js-exterior-acc-panel");
    let interiorAccPanel = document.querySelector(".js-interior-acc-panel");

    const exteriorAccordian = document.querySelector(".exterior-img-acc");
    const interiorAccordian = document.querySelector(".interior-img-acc");
    const exteriorSection = document.querySelector(".js-exterior-acc-panel");
    const interiorSection = document.querySelector(".js-interior-acc-panel");
    const allTabs = document.querySelectorAll(".image-compare-tabs");

    exteriorImages = JSON.parse(exteriorImages.replace(/(&quot\;)/g, "\""));
    interiorImages = JSON.parse(interiorImages.replace(/(&quot\;)/g, "\""));
    models = JSON.parse(models.replace(/(&quot\;)/g, "\""));


    exteriorSection?.classList.remove("display-none");
    interiorSection?.classList.remove("display-none");


    exteriorAccordian?.addEventListener("click", clickEvent => {
        clickEvent.target.classList.toggle("active-image-type");
        exteriorContainer.classList.toggle("display-none");
    })

    interiorAccordian?.addEventListener("click", clickEvent => {
        clickEvent.target.classList.toggle("active-image-type");
        interiorContainer.classList.toggle("display-none");
    })

    allTabs?.forEach(tab => {
        tab.addEventListener("click", clickEvent => {
            if (tab.classList.contains("selected-tab")) {
                return;
            }
            const imageCategory = tab.id;
            removeTabSelection(imageCategory);
            tab.classList.add("selected-tab");
            const firstModelId = tab.dataset.firstModelId;
            const secondModelId = tab.dataset.secondModelId;
            const categoryImages = tab.id == "Exterior" ? exteriorImages : interiorImages;
            const firstModelName = tab.dataset.baseModelName;
            const secondModelName = tab.dataset.comparedModelName;
            const modelDetails = {
                firstModelName,
                secondModelName,
                exteriorImagesPageUrl: tab.dataset.exteriorimagespageurl,
            };
            updateImages(categoryImages[firstModelId], categoryImages[secondModelId], modelDetails, tab.id);
        })
    });

    const removeTabSelection = imageCategory => {
        for(const tab of allTabs) {
            if (tab.id === imageCategory) {
                tab.classList.remove("selected-tab");
            }
        }
    }


    const tagNames = ["Front Left View", "Left View", "Rear Left View", "Rear View",
        "Front View", "DashBoard", "Infotainment Display", "Dashbaord Display",
        "AC Controls", "Rear Passenger Seats"];

    const updateImages = (firstModelImages, secondModelImages, modelDetails, imageCategory) => {
        const imageCategoryLowerCase = imageCategory.toLowerCase();
        $(`.js-${imageCategoryLowerCase}-acc-panel`).empty();
        let imageSection;
        if (imageCategory === "Exterior") {
            imageSection = exteriorAccPanel;
        }
        else {
            imageSection = interiorAccPanel;
        }

        let htmlText = '';
        const {
            firstModelName,
            secondModelName,
            exteriorImagesPageUrl
        } = modelDetails;
        for (let i = 0; i < tagNames.length; i++) {
            const tagName = tagNames[i];
            const firstModelImage = firstModelImages[tagName];
            const comparedModelImage = secondModelImages[tagName];
            if (firstModelImage == null || comparedModelImage == null) {
                continue;
            }

            htmlText +=
                `<h5 class="image-type-heading">${firstModelName} vs <a title="${secondModelName} ${tagName}" class="image-type-heading" href="${exteriorImagesPageUrl}${comparedModelImage["name"]}">${secondModelName} ${tagName}</a>
                </h5>
                <div class="compare-cars">
                    <img class="cmp-car-image" loading="lazy"
                    src="${comparedModelImage["path"]}" title="${secondModelName} ${comparedModelImage["altImageName"]}"  alt="${secondModelName} ${comparedModelImage["altImageName"]}">
                        <span class="img-name-tag">${secondModelName}</span>
                </div>
                <div class="compare-cars">
                    <img class="cmp-car-image" loading="lazy"
                    src="${firstModelImage["path"]}" title="${firstModelName} ${firstModelImage["altImageName"]}" alt="${firstModelName} ${firstModelImage["altImageName"]}">
                        <span class="img-name-tag">${firstModelName}</span>
                </div>`
        }
        if (htmlText) {
            imageSection.innerHTML = htmlText;
            imageSection.classList.remove("display-none");

        }
        else {
            imageSection.classList.add("display-none");
        }
    }
})();