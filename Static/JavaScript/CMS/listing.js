let pageNumber = 1;
let url = "";
let initialPosition = 0
let lastArticle = null;
const ul = document.querySelector("#content_list");

function addContentOnScroll() {
  if (contentListingTabId == cmsTab.ThreeSixtyView) {
    url = "/api/page/contentlist/threesixtyview/?applicationid=1"; //360 data of CW
  }
  else if (contentListingTabId == cmsTab.Videos || contentListingTabId == cmsTab.Images) {
    url = "/api/page/contentlist/mediaview/?applicationid=3";  //videos will be shown for ct and cw
  } else {
    url = "/api/page/contentlist/articlesview/?applicationid=3"; // article content will be shown for ct
  }

  pageNumber++;
  let qs = `&categoryidlist=${categoryId}&pageNo=${pageNumber}&pageSize=10&isMobile=${isMobile}&makeid=${makeId}&modelid=${modelId}&makeMaskingName=${makeMaskingName}&modelMaskingName=${maskingName}`;
  

  fetch(url + qs, {
    headers : {
      'ServerDomain': 'CarWale',
    },
  })
    .then(res => {
      if(!res.ok) {
        lastArticleObserver.unobserve(lastArticle.target);
        return "";
      }

      return res.text();
    })
    .then(data => {
      if(!data || !data.includes("</li>")) {
        lastArticleObserver.unobserve(lastArticle.target);
        return;
      }
      ul.innerHTML += data;
      lastArticleObserver.unobserve(lastArticle.target);
      lastArticleObserver.observe(document.querySelector("#content_list li:last-child"));
    })
    .catch(e => {
      lastArticleObserver.unobserve(lastArticle.target);
    });
}

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

const lastArticleObserver = new IntersectionObserver(entries => {
  lastArticle = entries[0];
  if (!lastArticle.isIntersecting) {
    return;
  }

  addContentOnScroll();
},
{
  threshold: 0,
  rootMargin: rootMargin
});

// only observe last article
if (document.querySelector("#content_list li:last-child")) {
  lastArticleObserver.observe(document.querySelector("#content_list li:last-child"));
}