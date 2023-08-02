const allBrandsList = document.querySelector(".js-brands-list");
const moreBrandsBtn = document.querySelector(".js-more-brands-btn");
function toggleMoreBrands() {
    if(!allBrandsList || !moreBrandsBtn) {
        return;
    }

    if(allBrandsList.classList.contains("active")) {
        allBrandsList.classList.remove("active");
        moreBrandsBtn.textContent = "View More Brands";
        moreBrandsBtn.classList.remove("active");
    } else {
        allBrandsList.classList.add("active");
        moreBrandsBtn.textContent = "Collapse";
        moreBrandsBtn.classList.add("active");
    }
}
