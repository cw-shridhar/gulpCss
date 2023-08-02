var headingDescription = document.querySelector(".heading__description"),
  readMoreBtn = document.querySelector(".js-read-more-btn"),
  readLessBtn = document.querySelector(".js-read-less-btn"),
  headingReadmore = document.querySelector(".heading__readmore"),
  contest_readmore = $(".contest__readmore");

headingReadmore &&
  headingReadmore.addEventListener("click", function () {
    headingDescription.classList.toggle("text-truncate");
    readMoreBtn.classList.toggle("hide");
    readLessBtn.classList.toggle("hide");
  });

contest_readmore && contest_readmore.on("click", function () {
  var readMoreContestBtn = this.getElementsByClassName("js-contest-read-more-btn")[0];
  var readLessContestBtn = this.getElementsByClassName("js-contest-read-less-btn")[0];
  readMoreContestBtn.classList.toggle("hide");
  readLessContestBtn.classList.toggle("hide");
  var parentId = this.getAttribute("data-parent-container");
  document.getElementById(parentId).classList.toggle("contest-item-truncate");
});

function searchBox(id) {
  var qs = "source=2,3&size=5&showFeatured=false&isNcf=false";
  var url = "/api/v3/autocomplete/?";
  var value = document.querySelector("#" + id + " .js_searchBar").value;
  if (value.length > 0) {
    qs = qs + "&value=" + value;
    getListingData(url, qs, handleAutoComplete.bind(null, id));
  } else {
    hideDropDown(id);
  }
}

function getListingData(url, qs, successCallback) {
  $.ajax({
    url: url + qs,
    type: "get",
    contentType: "application/json",
    headers: { 'ServerDomain': 'CarWale' },
    success: function (data) {
      successCallback(data);
    },
    error: function (response, status) {
      console.log(response, status);
    },
  });
}

function handleAutoComplete(id, response) {
  var li = "";
  if (response && response.length) {
    response.forEach(function (response) {
      if (response && response.displayName && response.suggestionType) {
        var displayName = response.payload.modelName;
        var url = getUrl(
          id,
          response.payload.makeMaskingName,
          response.payload.maskingName
        );
        li =
          li +
          "<li class='drop-down__menu-item' ><a href='" +
          url +
          "'  data-testing-id='model-list'>" +
          displayName +
          "</a></li>";
      }
    });
  }
  var ulWrapper = "<ul>" + li + "</ul>";
  getDropDownElement(id).innerHTML = ulWrapper;
  showDropDown(id);
}

function hideDropDown(id) {
  getDropDownElement(id).style.display = "none";
}

function showDropDown(id) {
  getDropDownElement(id).style.display = "block";
}

function clearSearchBox(id) {
  getInputElement(id).value = "";
  getClearElement(id).style.display = "none";
}

function getUrl(id, makeMaskingName, maskingName) {
  if (id == "readReview") {
    return cmsUrls.createUserReviewReadUrl(makeMaskingName, maskingName);
  } else {
    return cmsUrls.createUserReviewWriteUrl(makeMaskingName, maskingName);
  }
}

function getInputElement(id) {
  return document.querySelector("#" + id + " .js_searchBar");
}
function getClearElement(id) {
  return document.querySelector("#" + id + " .js_clear");
}
function getDropDownElement(id) {
  return document.querySelector("#" + id + " .js_dropDown");
}

window.onclick = function (event) {
  if (!event.target.matches(".content_search_block")) {
    hideDropDown("readReview");
    hideDropDown("writeReview");
  }
};
