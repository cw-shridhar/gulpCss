const SELECTED_TAB_TEXT_STYLE = {
	"font-weight": "600",
	"color": "#272a41",
	"line-height": "14px"
};

const SELECTED_TAB_BORDER_STYLE = {
	"border-bottom": "5px solid #f07e7c"
};

const UNSELECTED_TAB_TEXT_STYLE = {
	"font-weight": "normal",
	"color": "#56586a",
	"line-height": "15px"
};

const UNSELECTED_TAB_BORDER_STYLE = {
	"border-bottom": "1px solid #f07e7c"
};

function updateFeaturedCarsFooterLink(tabId) {
	if (tabId === "popular_tab") {
		$(".featured_cars_footer a p span").text("All Popular Cars");
		$(".featured_cars_footer a").attr("href", "/new-cars/popular-cars-in-india");
		$(".featured_cars_footer a").attr("title", "All Popular Cars");
	}
	if (tabId === "upcoming_tab") {
		$(".featured_cars_footer a p span").text("All Upcoming Cars");
		$(".featured_cars_footer a").attr("href", "/upcoming-cars/");
		$(".featured_cars_footer a").attr("title", "All Upcoming Cars");
	}
	if (tabId === "latest_tab") {
		$(".featured_cars_footer a p span").text("All Latest Cars");
		$(".featured_cars_footer a").attr("href", "/new-car-launches/");
		$(".featured_cars_footer a").attr("title", "All Latest Cars");
	}
}

function updateNewsAndReviewsFooterLink(tabId) {
	if (tabId === "news_tab") {
		$(".news_and_reviews_footer a p span").text("All Popular News");
		$(".news_and_reviews_footer a").attr("href", "/news");
	}
	if (tabId === "reviews_tab") {
		$(".news_and_reviews_footer a p span").text("All Popular Reviews");
		$(".news_and_reviews_footer a").attr("href", "/reviews/expert");
	}
}

function updateSlugBody(tabId, bodyClass) {
	var bodyId = tabId + "_cars";
	var selectedSlugClass = "." + bodyClass;
	$(selectedSlugClass).each(function (index, body) {
		if ($(body).attr("id") === bodyId) {
			$(body).show();
		} else {
			$(body).hide();
		}
	});
}

function updateTab(tabClass, tabId, bodyClass) {
	var selectedTabClass = "." + tabClass;
	$(selectedTabClass).each(function (index, tab) {
		$(tab).css(UNSELECTED_TAB_BORDER_STYLE);
		$(tab).children("p").css(UNSELECTED_TAB_TEXT_STYLE);
	});

	var selectedTab = "#" + tabId;
	$(selectedTab).css(SELECTED_TAB_BORDER_STYLE);

	var selectedTabParagraph = selectedTab + " p";
	$(selectedTabParagraph).css(SELECTED_TAB_TEXT_STYLE);

	updateSlugBody(tabId, bodyClass);

	if (tabClass === "featured_cars_tab") {
		updateFeaturedCarsFooterLink(tabId);
	}

	if (tabClass === "news_and_reviews_tab") {
		updateNewsAndReviewsFooterLink(tabId);
	}
}
