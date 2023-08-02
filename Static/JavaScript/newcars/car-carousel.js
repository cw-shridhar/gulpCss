// type => latest, upcoming, popular
// priceType => budget, premium, luxury

function toggleCarousel(type, priceType) {
	// update tabs
	const tabClass = type + "-car-carousel-tab";
	const targetTabId = type + "-" + priceType + "-tab";
	const tabs = document.getElementsByClassName(tabClass);

	if(tabs && tabs.length > 0) {
		for(let i = 0 ; i < tabs.length ; i++) {
			if(tabs[i].id === targetTabId) {
				tabs[i].classList.add("active-tab");
			} else {
				tabs[i].classList.remove("active-tab");
			}
		}
	}

	// update carousel wrappers
	const carouselClass = type + "-car-carousel-wrapper";
	const targetCarouselId = type + "-" + priceType + "-car-carousel-wrapper";
	const carousels = document.getElementsByClassName(carouselClass);

	if(carousels && carousels.length > 0) {
		for(let i = 0 ; i < carousels.length ; i++) {
			if(carousels[i].id === targetCarouselId) {
				carousels[i].classList.remove("display-none");
			} else {
				carousels[i].classList.add("display-none");
			}
		}
	}
}
