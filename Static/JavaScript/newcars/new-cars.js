handleExpandViewMoreBrandsUpfront = () => {
    const queryObj = new URLSearchParams(location.search);
    if (queryObj && queryObj.get("expandBrands") == "true") {
        const allBrandsContainer = document.querySelector(".js-all-brands-container");
        allBrandsContainer.scrollIntoView();
        isMobile ? viewhide() : viewMore();
        history.replaceState(null, null,
            `${location.origin}${location.pathname}`
        );
    }
};

scrollToPriceRangeWidget = () => {
    const queryObj = new URLSearchParams(location.search);
    if (queryObj && queryObj.get("scrollToPriceRangeWidget") == "true") {
        const priceRangeContainer = document.querySelector(".js-price-range-container");
        priceRangeContainer.scrollIntoView();
        history.replaceState(null, null,
            `${location.origin}${location.pathname}`
        );
    }
};

handleExpandViewMoreBrandsUpfront();
scrollToPriceRangeWidget();

