var ratingData = {
  userDetails: {
    name: $.cookie("_CustomerName") || "",
    email: $.cookie("_CustEmail") || "",
  },
  carDetails: {
    versionId: versionId || 0,
  },
  rating: {
    userRating: 0,
  },
  reviewId: 0,
  reviewDetails: { title: "", description: "" },
};
var ratingSubmitted;
var feedbackTitle = "Rate Your Car";
var feedbackSubtitle = "The car exceeds all the expectations";
var versionName = "";
var currentLogo = "feedback-0";
var setCurrentLogo = function (id) {
  currentLogo = "feedback-" + id;
};
var responseMeassage;
var submitRating;
var emailError;
var nameError;
var feedbackTitleSelector;
var feedbackSubtitleSelector;
var carRatingBoxError;
var verisonSelectionError;
var txtUserName;
var reviewTitle;
var detailedReview;
var ratingLogo;
var selectedVersion;
var reviewSection;
var reviewQuestionList;
var desktopVesrionDropdown;
var platformId = isMobileDevice ? 43 : 1;
var totalQuestionCount;

var cacheSelectors = function () {
  responseMeassage = $("#responsemessage");
  submitRating = $("#submitrating");
  emailError = $("#emailError");
  nameError = $("#nameError");
  feedbackTitleSelector = $("#feedbackTitle");
  feedbackSubtitleSelector = $("#feedbackSubtitle");
  carRatingBoxError = $("#carRatingBox .error-text");
  verisonSelectionError = $("#verisonSelectionError");
  txtUserName = $("#txtUserName");
  reviewTitle = $("#reviewTitle");
  detailedReview = $("#mainReview");
  txtEmailID = $("#txtEmailID");
  ratingLogo = $(".rating-logo");
  selectedVersion = $(".js-selected-version__name");
  reviewSection = $("#js-review-section");
  desktopVesrionDropdown = $(
    "#rate-car-form .js-selectcustom-input-box-holder"
  );
  reviewQuestionList = $(".question-field");
  totalQuestionCount = reviewQuestionList.length;
};

var rateCarEventCategory = "RateYourCar";
var rateCarEventLabel = "modelId=" + modelId + "|source=" + platformId;
var rateCar = function () {
  _rateCar = {};
  _rateCar.submitRating = function () {
    submitRating.attr("disabled", true);
    var submitData = [];
    for (var questionId in ratingData.rating.ratingQuestions) {
      var answerId = ratingData.rating.ratingQuestions[questionId].answerId;
      submitData.push({ questionId: +questionId, answerId: answerId });
    }
    $.ajax({
      url: "/api/userreviewsct/savereview/",
      type: "post",
      contentType: "application/json",
      headers: { 'ServerDomain': 'CarWale' },
      data: JSON.stringify({
        carDetails: ratingData.carDetails,
        userDetails: ratingData.userDetails,
        rating: {
          userRating: ratingData.rating.userRating,
          ratingQuestions: submitData,
        },
        reviewId: 0,
        reviewDetails: {
          title: ratingData.reviewDetails.title,
          description: ratingData.reviewDetails.description,
        },
      }),
      headers: {
        CWK: "KYpLANI09l53DuSN7UVQ304Xnks=",
        sourceId: platformId,
        platformId: platformId,
        ServerDomain: 'CarWale'
      },
      success: function (response) {
        ratingSubmitted = true;
        submitRating.removeAttr("disabled");
        if (response.isDuplicate) {
          responseMeassage.text(response).show();
        } else {
          location.href =
            "/user-reviews/write-review/?customerName=" + response;
        }
      },
      error: function () {
        submitRating.removeAttr("disabled");
        responseMeassage.text("Error occurred. Please try again later.").show();
      },
    });
  };
  _rateCar.onRatingAnswerClick = function (event) {
    var questionId = $(event.target).attr("data-questionId");
    var questionNum = parseInt($(event.target).attr("data-questionNum"));
    var answerId = $(event.target).attr("data-answerId");
    ratingData.rating.ratingQuestions[questionId].answerId = answerId;
    $("#error-question-" + questionId).hide();
  };

  _rateCar.setReviewAnswers = function (event) {
    var questions = Array.prototype.slice.call($(".question"));
    questions.forEach(function (item, i) {
      ratingData.rating.ratingQuestions[item.dataset.questionid].answerId =
        item.value;
    });
  };

  _rateCar.onRatingMouseEnter = function (event) {
    feedbackTitleSelector.text($(event.target).attr("data-feedbackTitle"));
    feedbackSubtitleSelector.text(
      $(event.target).attr("data-feedbackSubtitle")
    );
    ratingLogo.removeClass(currentLogo);
    setCurrentLogo($(event.target).attr("data-value"));
    ratingLogo.addClass(currentLogo);
    carRatingBoxError.hide();
  };

  _rateCar.onRatingMouseLeave = function (event) {
    feedbackTitleSelector.text(feedbackTitle);
    feedbackSubtitleSelector.text(feedbackSubtitle);
    ratingLogo.removeClass(currentLogo);
    setCurrentLogo(ratingData.rating.userRating);
    ratingLogo.addClass(currentLogo);
    if (
      ratingData.rating.userRating == 0 &&
      $("#carRatingBox .answer-star-list").data("errorMsgShow")
    ) {
      carRatingBoxError.show();
    }
  };
  _rateCar.onRatingClick = function (event) {
    ratingData.rating.userRating = $(event.target).attr("data-value");
    feedbackTitle = $(event.target).attr("data-feedbackTitle");
    feedbackSubtitle = $(event.target).attr("data-feedbackSubtitle");
    feedbackTitleSelector.text(feedbackTitle);
    feedbackSubtitleSelector.text(feedbackSubtitle);
    ratingLogo.removeClass(currentLogo);
    setCurrentLogo(ratingData.rating.userRating);
    ratingLogo.addClass(currentLogo);
    carRatingBoxError.hide();
  };

  //find versionId index in array of rating details object
  _rateCar.findVersionId = function (versionArray) {
    var versionLen = versionArray ? versionArray.length : 0;
    for (var index = 0; index < versionLen; index++) {
      if (versionArray[index].versionId == ratingData.carDetails.versionId)
        return index;
    }
    return -1;
  };

  //find modelId index in Model based rating details array of object
  _rateCar.findModelRatingHistory = function (modelArray) {
    var versionLen = modelArray ? modelArray.length : 0;
    for (var index = 0; index < versionLen; index++) {
      if (modelArray[index].modelId == modelId) return index;
    }
    return -1;
  };
  //creating version rating detail object for storing in local storage
  _rateCar.setRatingHistoryObject = function () {
    var versionRatingHistoryObject = {};
    var ratingQuestions = {};

    if (ratingData.carDetails.versionId) {
      versionRatingHistoryObject.versionId = ratingData.carDetails.versionId;
      if (versionName) {
        versionRatingHistoryObject.versionName = versionName;
      }
    }

    if (ratingData.rating.userRating) {
      versionRatingHistoryObject.userRating = ratingData.rating.userRating;
      //versionRatingHistoryObject.icon = currentIcon;
    }
    for (var questionId in ratingData.rating.ratingQuestions) {
      ratingQuestions[questionId] =
        ratingData.rating.ratingQuestions[questionId];
    }

    versionRatingHistoryObject.ratingQuestions = ratingQuestions;
    return versionRatingHistoryObject;
  };

  //creating model based rating detail object for storing in local storage
  _rateCar.setModelHistoryRatingObject = function (data) {
    var versionRatingHistoryObject = _rateCar.setRatingHistoryObject();
    if (data) {
      var versionIndex = _rateCar.findVersionId(data["versionsRatingData"]);
      if (versionIndex < 0) {
        data["versionsRatingData"].push(versionRatingHistoryObject);
      } else {
        data["versionsRatingData"][versionIndex] = versionRatingHistoryObject;
      }
      return data;
    } else {
      var modelRatingHistoryObject = {};
      modelRatingHistoryObject.modelId = modelId;
      modelRatingHistoryObject.versionsRatingData = [
        versionRatingHistoryObject,
      ];
      return modelRatingHistoryObject;
    }
  };
  return _rateCar;
};

function mileageDetailsValidation(event) {
  var questionId = event.getAttribute("data-questionid");
  var val = event.value;
  var errorField = document.getElementById("mileageError-" + questionId);

  if (questionId == 147) {
    if (val.length == 0) {
      $("#mileageError-" + questionId).html("Please Enter City Mileage");
      errorField.style.visibility = "visible";
    }
    else {
      if (parseFloat(val) < 1 || parseFloat(val) > 60) {
        $("#mileageError-" + questionId).html("Please Enter Proper City Mileage");
        errorField.style.visibility = "visible";
      }
      else {
        $("#mileageError-" + questionId).html("");
        errorField.style.visibility = "hidden";
      }
    }
  }
  else if (questionId == 149) {
    if (val.length == 0) {
      $("#mileageError-" + questionId).html("Please Enter Highway Mileage");
      errorField.style.visibility = "visible";
    }
    else {
      if (parseFloat(val) < 1 || parseFloat(val) > 60) {
        $("#mileageError-" + questionId).html("Please Enter Proper Highway Mileage");
        errorField.style.visibility = "visible";
      }
      else {
        $("#mileageError-" + questionId).html("");
        errorField.style.visibility = "hidden";
      }
    }
  }
  else if (questionId == 151) {
    if (val.length == 0) {
      $("#mileageError-" + questionId).html("Please Enter Maintenance");
      errorField.style.visibility = "visible";
    }
    else {
      $("#mileageError-" + questionId).html("");
      errorField.style.visibility = "hidden";
    }
  }
  else {
    if (val.length == 0) {
      $("#mileageError-" + questionId).html("Please Enter Owned for");
      errorField.style.visibility = "visible";
    }
    else {
      $("#mileageError-" + questionId).html("");
      errorField.style.visibility = "hidden";
    }
  }
}
// $("#submitrating").click(function () {
//   var errorLabel = { label: "" };
//   rateYourCar.setReviewAnswers();
//   rateYourCar.submitRating();
//   SetCookieInDays("_CustomerName", ratingData.userDetails.name, 365);
//   SetCookieInDays("_CustEmail", ratingData.userDetails.email, 365);
// });

function submitRatingClick() {
  var errorLabel = { label: "" };
  rateYourCar.setReviewAnswers();
  rateYourCar.submitRating();
  SetCookieInDays("_CustomerName", ratingData.userDetails.name, 365);
  SetCookieInDays("_CustEmail", ratingData.userDetails.email, 365);
}

/**************************
 * TODO: Need to handle this with updated dropdown plugin and assign a callback function for click events
 **************************/
$(".js-select-version").click(function () {
  ratingData.carDetails.versionId = $(this).attr("data-versionid");
  versionName = $(this).attr("data-versionName");
  reviewSection.removeClass("rate-car-container--disabled");
  setRatingCookie(modelId, ratingData.carDetails.versionId);

  //if rating data available for respective version in local strorage prefill it.
  prefillRatingData();

  selectedVersion.text(versionName);
  verisonSelectionError.addClass("hide");
  selectedVersion.removeClass("text-center");
  if (isMobileDevice) {
    rateYourCar.closeModelVersionPopup();
    if (window.location.hash == "#version") {
      window.history.back();
    }
  }
});

var getVersionIndexFromCookie = function (modelVersions, modelId) {
  var modelIndex;
  var length = modelVersions.length;
  for (modelIndex = 0; modelIndex < length; modelIndex++) {
    var pair = modelVersions[modelIndex].split("~");
    if (pair[0] == modelId) {
      return modelIndex;
    }
  }
  return -1;
};

var setRatingCookie = function (modelId, versionId) {
  var currentCookie = $.cookie("reviewedVersions");
  if (currentCookie) {
    var modelVersions = currentCookie.split("&");
    var index = getVersionIndexFromCookie(modelVersions, modelId);
    if (index >= 0) {
      modelVersions[index] = modelId + "~" + versionId;
    } else {
      modelVersions.push(modelId + "~" + versionId);
    }
    currentCookie = modelVersions.join("&");
  } else {
    currentCookie = modelId + "~" + versionId;
  }
  var expire = new Date();
  expire.setTime(new Date().getTime() + parseInt(expiryTime) * 60000);
  document.cookie =
    "reviewedVersions=" +
    currentCookie +
    ";path=" +
    location.pathname +
    ";domain=" +
    document.domain +
    ";expires=" +
    expire.toUTCString();
};

//save modified ratings in local storage for version
var saveUnsubmittedRatingData = function () {
  var ratingValue = clientCache.get("ratingHistoryData_v1");
  var historyRatingData = ratingValue ? ratingValue.val : null;
  if (!historyRatingData) {
    historyRatingData = [
      {
        modelId: modelId,
        versionsRatingData: [rateYourCar.setRatingHistoryObject()],
      },
    ];
  } else {
    var index = rateYourCar.findModelRatingHistory(historyRatingData);
    var modelHistoryRating = rateYourCar.setModelHistoryRatingObject(
      historyRatingData[index]
    );
    if (index < 0) {
      historyRatingData.push(modelHistoryRating);
    } else {
      historyRatingData[index] = modelHistoryRating;
    }
  }
  clientCache.set({
    key: "ratingHistoryData_v1",
    value: historyRatingData,
    expiryTime: parseInt(expiryTime),
  }); //set expiryTime 10 days
};
var resetRatingField = function (questionId) {
  $(
    "#q-" +
    questionId +
    "-" +
    ratingData.rating.ratingQuestions[questionId].answerId
  ).prop("checked", false);
  ratingData.rating.ratingQuestions[questionId].answerId = 0;
  $("#js-feedback-text-quest-" + questionId).text("");
};
var resetUserRating = function () {
  $("#rate-" + ratingData.rating.userRating).prop("checked", false);
  ratingLogo.removeClass(currentLogo);
  ratingData.rating.userRating = 0;
  setCurrentLogo(ratingData.rating.userRating);
  ratingLogo.addClass(currentLogo);
  feedbackTitle = "Rate Your Car";
  feedbackSubtitle = "The car exceeds all the expectations";
  feedbackTitleSelector.text(feedbackTitle);
  feedbackSubtitleSelector.text(feedbackSubtitle);
};
//prefill data if rating details available in local storage
var prefillRatingData = function () {
  var ratingValue = clientCache.get("ratingHistoryData_v1");
  resetUserRating();
  for (var questionId in ratingData.rating.ratingQuestions) {
    resetRatingField(questionId);
  }
  var historyRatingData = ratingValue ? ratingValue.val : null;
  if (historyRatingData) {
    var modelIndex = rateYourCar.findModelRatingHistory(historyRatingData);
    if (modelIndex >= 0) {
      var versionsRatingDataArray =
        historyRatingData[modelIndex]["versionsRatingData"];
      if (versionsRatingDataArray) {
        var versionIndex = _rateCar.findVersionId(versionsRatingDataArray);
        var savedRatingData =
          versionIndex >= 0 ? versionsRatingDataArray[versionIndex] : null;
        if (savedRatingData && savedRatingData["versionId"]) {
          ratingData.carDetails.versionId = savedRatingData["versionId"];
          reviewSection.removeClass("rate-car-container--disabled");
          verisonSelectionError.hide();
          if (!savedRatingData["versionName"]) {
            var selectedElement = $(
              "#rate-car-form .js-select-version[data-versionId=" +
              ratingData.carDetails.versionId +
              "]"
            );
            if (selectedElement && selectedElement.length > 0) {
              versionName = selectedElement.attr("data-versionname");
              savedRatingData["versionName"] = versionName;
            }
          }
          selectedVersion.text(savedRatingData["versionName"]);
          selectedVersion.removeClass("text-center");
          if (isMobileDevice) {
            rateYourCar.closeModelVersionPopup();
          }
        }

        if (savedRatingData && savedRatingData["userRating"]) {
          ratingData.rating.userRating = savedRatingData["userRating"];
          $("#rate-" + ratingData.rating.userRating).prop("checked", true);
          ratingLogo.removeClass(currentLogo);
          setCurrentLogo(ratingData.rating.userRating);
          ratingLogo.addClass(currentLogo);
          feedbackTitle = $(
            "#carRatingBox label[data-value=" +
            ratingData.rating.userRating +
            "]"
          ).attr("data-feedbackTitle");
          feedbackTitleSelector.text(feedbackTitle);
          feedbackSubtitle = $(
            "#carRatingBox label[data-value=" +
            ratingData.rating.userRating +
            "]"
          ).attr("data-feedbackSubtitle");
          feedbackSubtitleSelector.text(feedbackSubtitle);
        } else {
          resetUserRating();
        }
        for (var questionId in ratingData.rating.ratingQuestions) {
          if (
            savedRatingData &&
            savedRatingData["ratingQuestions"][questionId].answerId != 0
          ) {
            var answerId =
              savedRatingData["ratingQuestions"][questionId].answerId;
            ratingData.rating.ratingQuestions[questionId].answerId = answerId;
            var starRadio = $("#q-" + questionId + "-" + answerId);
            starRadio.prop("checked", true);
            $("#js-feedback-text-quest-" + questionId).text(
              starRadio.next().data("text")
            );
          } else {
            resetRatingField(questionId);
          }
        }
      }
    }
  }
  responseMeassage.text("").hide();
  carRatingBoxError.hide();
  for (var questionId in ratingData.rating.ratingQuestions) {
    $("#error-question-" + questionId).hide();
  }
};

var handleRatingPagechange = function () {
  ratingSubmitted = false;
  var promptMessage = "Leave Page ?\nChanges that you made may not be saved .";
  var promptOnLeave = function (event) {
    if (modelId > 0 && ratingData.carDetails.versionId > 0) {
      saveUnsubmittedRatingData();
    }
    if (!ratingSubmitted) {
      if (event) {
        event.returnValue = promptMessage;
      }
      return promptMessage;
    }
  };
  window.onbeforeunload = promptOnLeave;
};

var validateVersionName = function (versionName) {
  var isValidVersion = false;
  $(".js-version-name").map(function () {
    if ($(this).text() === versionName) {
      isValidVersion = true;
    }
  });
  return isValidVersion;
};
var triggerMoreRatingChange = function () {
  var button = $(this),
    questionField = button.closest(".question-type-star");

  var feedbackText = $(this).attr("data-text");
  questionField.find(".feedback-text").text(feedbackText);
  button.parent().parent().find(".error-text").hide();
};
var showFeedbackText = function (event) {
  var parent = $(this).closest(".answer-star-list");
  var checkedState = parent.find("input[type=radio]:checked").length,
    button = $(this).prev("input[type='radio']"),
    questionField = button.closest(".question-type-star"),
    feedbackText = "";
  if (event.type === "click" || event.type === "mouseenter") {
    feedbackText = $(this).attr("data-text");
    parent.parent().find(".error-text").hide();
  }
  if (checkedState && event.type === "mouseleave") {
    feedbackText = parent.find("input[type=radio]:checked").attr("data-text");
    parent.parent().find(".error-text").hide();
  }
  if (!checkedState && event.type === "mouseleave") {
    if (parent.data("errorMsgShow")) {
      parent.parent().find(".error-text").show();
    }
  }
  questionField.find(".feedback-text").text(feedbackText);
};
function removeURLParameter(url, parameter) {
  //prefer to use l.search if you have a location/link object
  var urlparts = url.split('?');
  if (urlparts.length >= 2) {

    var prefix = encodeURIComponent(parameter) + '=';
    var pars = urlparts[1].split(/[&;]/g);

    //reverse iteration as may be destructive
    for (var i = pars.length; i-- > 0;) {
      //idiom for string.startsWith
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }

    url = urlparts[0] + '?' + pars.join('&');
    return url;
  } else {
    return url;
  }
}

$(document).ready(function () {
  cacheSelectors();
  var ratingQuestions = {};
  for (var i = 0; i < totalQuestionCount; i++) {
    var key = reviewQuestionList[i]
      .getElementsByTagName("input")[0]
      .getAttribute("data-questionid");
    ratingQuestions[key] = {
      answerId: 0,
    };
  }
  ratingData.rating.ratingQuestions = ratingQuestions;
  history.scrollRestoration = "manual"; // written to avoid page flicker
  rateYourCar = new rateCar();
  var url = removeURLParameter(window.location.href, "versionId");
  window.history.replaceState("", document.title, url); // to remove version
  var answerStarList = reviewQuestionList
    .find("input[type=radio]")
    .on("change", triggerMoreRatingChange);
  answerStarList.find("label").on("click", showFeedbackText);
  if (url.length > 1) {
    setRatingCookie(modelId, versionId);
  }
  //set versionId from cookie
  var currentCookie = $.cookie("reviewedVersions");
  if (versionId <= 0 && currentCookie) {
    var modelVersions = currentCookie.split("&");
    var index = getVersionIndexFromCookie(modelVersions, modelId);
    if (index >= 0) {
      ratingData.carDetails.versionId = modelVersions[index].split("~")[1];
    }
  }
  //prefill data if rating details available in local storage for respective model
  prefillRatingData();
  ratingSubmitted = false;
  handleRatingPagechange();

  $("#carRatingBox label").on({
    click: _rateCar.onRatingClick,
  });
  if (!isMobileDevice) {
    $("#carRatingBox label").on({
      mouseenter: rateYourCar.onRatingMouseEnter,
      mouseleave: rateYourCar.onRatingMouseLeave,
    });
  }
  $("#rateCarQuestion label").on({
    click: _rateCar.onRatingAnswerClick,
  });
  txtEmailID.on({
    change: function (event) {
      ratingData.userDetails.email = event.target.value;
    },
  });
  txtUserName.on({
    change: function (event) {
      ratingData.userDetails.name = event.target.value;
    },
  });
  reviewTitle.on({
    change: function (event) {
      ratingData.reviewDetails.title = event.target.value;
    },
  });
  detailedReview.on({
    change: function (event) {
      ratingData.reviewDetails.description = event.target.value;
    },
  });
  if (!isMobileDevice) {
    $(document).on("hover", ".answer-star-list label", showFeedbackText);
  }

  if ($("#version-select").text().trim() == "" || $("#version-select").text().trim() == null) {
    $("#submitrating").attr("disabled", true);
  } else {
    $("#submitrating").attr("disabled", false);
  }
});

$("#mainReview").keyup(function () {
  var count = 100 - $("#mainReview").val().length;
  if (!!count) {
    count = Math.max(count, 1) - 1;
    if (count <= 0 || isNaN(count)) {
      $("#reviewCount").html("");
    } else {
      $("#reviewCount").html("Minimum " + count + " Characters");
    }
  }
});

function reviewCount(event) {
  var val = event.value;
  if (val.length < 5) {
    $("#titleError").html("Minimum length should be 5");
    $("#titleError")[0].style.visibility = "visible";
  }
  else {
    $("#titleError").html("");
    $("#titleError")[0].style.visibility = "hidden";
  }
}