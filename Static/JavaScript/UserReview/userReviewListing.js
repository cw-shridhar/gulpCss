var pageNumber = 1;
var pageSize = 10;

function handleSuccess(data) {
    if (pageNumber >= Math.ceil(totalCount / pageSize))
        $("#loadMore").hide();
    $("#loadMore").before(data);
    var currentReviewCount = $("#loadMore button").text().split(" ")[2];
    var newReviewCount = Math.max(currentReviewCount - pageSize, 0);
    $("#loadMore button").html("View All " + newReviewCount + " Reviews <span class='arrow-down'></span>");
}

function defaultErrorHandling(response, error) {
    if (pageNumber == 1) {
        var node = document.createElement("div");
        node.className = "no_content";
        node.textContent = "No Content Available";
        $("#more-reviews").html(node);
    }
}

function loadMoreReviews(id, makeId) {
    var url = "/api/v2/userreviews/list/?applicationId=3&IsMobile=" + isMobile + "&reviewId=" + id + "&makeId=" + makeId;
    pageNumber++;
    getReviewList(url, handleSuccess);
}

function getReviewList(url, successCallback) {
    $.ajax({
        url: url,
        type: "post",
        contentType: "application/json",
        headers: { 'ServerDomain': 'CarWale' },
        data: JSON.stringify({
            ModelId: modelId ? modelId : 0 ,
            VersionId: versionId ? versionId : 0,
            PageNumber: pageNumber,
            PageSize: pageSize,
            ReviewCriteria: reviewCriteria,
            StarFilter: starFilter
        }),
        success: function (data) {
            successCallback(data);
        },
        error: function (response, status) {
            defaultErrorHandling(response, status);
        },
    });
}