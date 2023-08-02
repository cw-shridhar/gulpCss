const cmsUrls = (function() {

  _getNewsListingUrl = (makeMaskingName, modelMaskingName) => {
    if(modelMaskingName && makeMaskingName) {
      return `/${makeMaskingName}-cars/${modelMaskingName}/news/`;
    }

    if(makeMaskingName) {
      return `/${makeMaskingName}-cars/news/`;
    }

    return "/news/";
  }

  _getExpertReviewsListingUrl = (makeMaskingName, modelMaskingName) => {
    if(modelMaskingName && makeMaskingName) {
      return `/${makeMaskingName}-cars/${modelMaskingName}/reviews/${modelMaskingName}-expert-reviews/`;
    }

    if(makeMaskingName) {
      return `/${makeMaskingName}/reviews/`;
    }

    return "/reviews/expert/";
  }

  _getComparsionReviewListingUrl = () => {
    return "/compare-cars/expert-comparisons/";
  }

  _getImagesListingUrl = (makeMaskingName, modelMaskingName) => {
    if(modelMaskingName) {
      return `/pictures/?model=${modelMaskingName}`;
    }

    if(makeMaskingName) {
      return `/${makeMaskingName}-cars/pictures/`;
    }

    return "/pictures/";
  }

  _getVideosListingUrl = (makeMaskingName, modelMaskingName) => {
    if(modelMaskingName) {
      return `/car-videos/?model=${modelMaskingName}`;
    }

    if(makeMaskingName) {
      return `/${makeMaskingName}-cars/videos/`;
    }

    return "/car-videos/";
  }

  _get360ListingUrl = (makeMaskingName, modelMaskingName) => {
    if(modelMaskingName) {
      return `/360-view/?model=${modelMaskingName}`;
    }

    if(makeMaskingName) {
      return `/${makeMaskingName}-cars/360-view/`;
    }

    return "/360-view/";
  }

  getListingUrl = (makeMaskingName, modelMaskingName) => {
    switch (contentListingTabId) {
      case cmsTab.ExpertReviews:
        return _getExpertReviewsListingUrl(makeMaskingName, modelMaskingName);
      case (contentListingTabId == cmsTab.ComparisonReviews):
        return _getComparsionReviewListingUrl();
      case (contentListingTabId == cmsTab.Images):
        return _getImagesListingUrl(makeMaskingName, modelMaskingName);
      case (contentListingTabId == cmsTab.Videos):
        return _getVideosListingUrl(makeMaskingName, modelMaskingName);
      case (contentListingTabId == cmsTab.ThreeSixtyView):
        return _get360ListingUrl(makeMaskingName, modelMaskingName);
      default:
        return _getNewsListingUrl(makeMaskingName, modelMaskingName);
    }
  }

  createModelVideoUrl = (makeMaskingName, modelMaskingName) => {
    if (makeMaskingName && modelMaskingName) {
      return (
        "/" +
        makeMaskingName +
        "-cars/" +
        modelMaskingName +
        "/videos/"
      );
    }
    return "";
  }

  createUserReviewReadUrl = (makeMaskingName, modelMaskingName) => {
    if (makeMaskingName && modelMaskingName) {
      return (
        "/" +
        makeMaskingName +
        "-cars/" +
        modelMaskingName +
        "/reviews/" +
        modelMaskingName +
        "-user-reviews/"
      );
    }
  }

  createUserReviewWriteUrl = (makeMaskingName, modelMaskingName) => {
    if (makeMaskingName && modelMaskingName) {
      return (
        "/reviews/postnewreview?make=" +
        makeMaskingName +
        "&model=" +
        modelMaskingName
      );
    }
  }

  return {
    getListingUrl,
    createModelVideoUrl,
    createUserReviewReadUrl,
    createUserReviewWriteUrl,
  }
})();