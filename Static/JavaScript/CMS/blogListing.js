const articlesList = document.querySelector("#content-list");
let pageNo = 1;
let initialPosition = 0;
const pageSize = 10;
const blogCategoryType = 45;
const url = "/api/contentlist/articlesbysubcategory/";

function loadMoreArticles(lastArticle) {
	const starIndex = (pageNo * pageSize) + 1;
	const endIndex = (pageNo + 1) * pageSize;
	fetch(`${url}?applicationid=3&categoryidlist=${blogCategoryType}&subCategoryId=${subCategoryId}&startindex=${starIndex}&endindex=${endIndex}&isMobile=${isMobile}`,{
		headers: { 'ServerDomain': 'CarWale' }
	})
	.then(function(res) {
		// if not 2xx response
		if(!res.ok) {
			lastArticleObserver.unobserve(lastArticle.target);
			const err = new Error(`${res.status} response`);
			throw err;
		}

		return res.text();
	})
	.then(data => {
		if(!data) {
			console.warn("No data found");
		} else {
			lastArticleObserver.unobserve(lastArticle.target);
			pageNo += 1;
			articlesList.innerHTML += data;

			// Observe new last article
			lastArticleObserver.observe(document.querySelector("#content-list li:last-child"));
		}
	})
	.catch(e => console.error("Error occured"));
}

const lastArticleObserver = new IntersectionObserver(entries => {
	const lastArticle = entries[0];
	if(!lastArticle.isIntersecting) {
		return;
	}

	loadMoreArticles(lastArticle);
},
{
	threshold: 0,
	rootMargin: rootMargin
});

// only observe last article
lastArticleObserver.observe(document.querySelector("#content-list li:last-child"));

window.onscroll = function () {
	displayToTop();
  };

function displayToTop() {
	var curr = document.documentElement.scrollTop || document.body.scrollTop;
	if (curr > initialPosition || curr < 20) {
		$("#toTop").fadeOut();
	} else {
		$("#toTop").fadeIn();
	}
	initialPosition = curr;
}

function toTopClicked() {
	window.scroll({ top: 0, behavior: "smooth" });
}
