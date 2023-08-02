// type => latest, upcoming, popular
// priceType => budget, premium, luxury

function toggleCarouselContent(type, priceType) {
	// update tabs
	const tabClass = type + "-car-carousel-tab";
	const targetTabId = type + "-" + priceType + "-tab";
	const tabs = document.getElementsByClassName(tabClass);

	for(let i = 0 ; i < tabs.length ; i++) {
		if(tabs[i].id === targetTabId) {
			tabs[i].classList.add("active-tab");
		} else {
			tabs[i].classList.remove("active-tab");
		}
	}

	// update carousel content
	const carouselClass = type + "-car-carousel-list";
	const targetCarouselId = type + "-" + priceType + "-cars";
	const carousels = document.getElementsByClassName(carouselClass);

	for(let i = 0 ; i < carousels.length ; i++) {
		if(carousels[i].id === targetCarouselId) {
			carousels[i].classList.remove("display-none");
		} else {
			carousels[i].classList.add("display-none");
		}
	}
}
