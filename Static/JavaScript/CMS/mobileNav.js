function isMediaTab(contentListingTabId) {
  if (contentListingTabId == ContentListingTabs.Videos || contentListingTabId == ContentListingTabs.Images) {
    return true;
  } else {
    return false;
  }
}

function isThreeSixtyTab(contentListingTabId) {
  return contentListingTabId === ContentListingTabs.ThreeSixtyView;
}

window.onload = function () {
  if (isMediaTab(contentListingTabId)) {
    document.getElementById("media-nav").classList.add("active");
  } else if (isThreeSixtyTab(contentListingTabId)) {
    document.getElementById("threesixty-nav").classList.add("active");
  }
  else {
    document.getElementById("content-nav").classList.add("active");
  }
};
