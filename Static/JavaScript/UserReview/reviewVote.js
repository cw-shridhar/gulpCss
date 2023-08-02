var platformIdForReview = isMobile ? 43 : 1;
var reg = new RegExp("^[0-9]*$");

function upVoteReview(e) {
  var localReviewId = e.currentTarget.getAttribute("data-reviewid");
  var increment = e.currentTarget.getAttribute("data-increment");
  // $('#upvoteBtn' + "-" + localReviewId)[0].style.color = "#00afa0";
  $("#upvoteBtn" + "-" + localReviewId)[0].classList.toggle(
    "like-icon-highlight"
  );
  $("#upvoteCount" + "-" + localReviewId)[0].classList.toggle(
    "like-dislike-count-highlight"
  );
  if (increment == "1") {
    $(e.currentTarget).attr("data-increment", "2");
    $("#upvoteCount" + "-" + localReviewId).text(
      parseInt($("#upvoteCount" + "-" + localReviewId).text()) + 1
    );
    $("#upvoteBtn" + "-" + localReviewId).addClass("active");
    $("#downvoteBtn" + "-" + localReviewId).attr("disabled", "disabled");
  } else {
    $(e.currentTarget).attr("data-increment", "1");
    $("#upvoteCount" + "-" + localReviewId).text(
      parseInt($("#upvoteCount" + "-" + localReviewId).text()) - 1
    );
    $("#downvoteBtn" + "-" + localReviewId).removeAttr("disabled");
  }
  voting(localReviewId, 1, increment);
}
function downVoteReview(e) {
  var localReviewId = e.currentTarget.getAttribute("data-reviewid");
  var increment = e.currentTarget.getAttribute("data-increment");
  $("#downvoteBtn" + "-" + localReviewId)[0].classList.toggle(
    "dislike-icon-highlight"
  );
  $("#downvoteCount" + "-" + localReviewId)[0].classList.toggle(
    "like-dislike-count-highlight"
  );
  if (increment == "1") {
    $(e.currentTarget).attr("data-increment", "2");
    $("#downvoteBtn" + "-" + localReviewId).addClass("active");
    $("#upvoteBtn" + "-" + localReviewId).attr("disabled", "disabled");
    $("#downvoteCount" + "-" + localReviewId).text(
      parseInt($("#downvoteCount" + "-" + localReviewId).text()) + 1
    );
  } else {
    $(e.currentTarget).attr("data-increment", "1");
    $("#downvoteCount" + "-" + localReviewId).text(
      parseInt($("#downvoteCount" + "-" + localReviewId).text()) - 1
    );
    $("#upvoteBtn" + "-" + localReviewId).removeAttr("disabled");
  }
  voting(localReviewId, 2, increment);
}
function voting(id, vote, voteAction) {
  $.ajax({
    type: "POST",
    url: "/api/userreviews/votev1",
    dataType: "json",
    contentType: "application/json",
    headers: { 'ServerDomain': 'CarWale' },
    data: JSON.stringify({
      ReviewId: id,
      Vote: vote,
      VoteValueAction: voteAction,
    }),
    headers: {
      CWK: "KYpLANI09l53DuSN7UVQ304Xnks=",
      sourceId: platformIdForReview,
      ServerDomain: "CarWale",
    },
    success: function (response) {},
  });
}
