var showMoreContent;
function expandCollapseReview(id) {
    var userReviewConatiner = document.querySelector("#js-user-review__content-" + id);
    var reviewDetailConatiner = userReviewConatiner.querySelector(".js-more-reviews__detail"),
        expandBtn = userReviewConatiner.querySelector(".js-expand__btn"),
        collapseBtn = userReviewConatiner.querySelector(".js-collapse__btn"),
        textTruncate = userReviewConatiner.querySelector(".user-review__description");

    if(expandBtn.classList.contains("hide")) {
        // When collapse is clicked
        expandBtn.classList.remove("hide");
        collapseBtn.classList.add("hide");
        textTruncate.classList.add("text-truncate");
        reviewDetailConatiner.classList.add("hide");
    } else {
        // when read more is clicked
        collapseBtn.classList.remove("hide");
        expandBtn.classList.add("hide");
        textTruncate.classList.remove("text-truncate");
        reviewDetailConatiner.classList.remove("hide");
    }
    if (showMoreContent) {
        $(".js-more-reviews__detail").hide();
    }
}
