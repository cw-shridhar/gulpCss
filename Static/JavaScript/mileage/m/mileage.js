var accordionContainer = document.querySelectorAll(".js_accordion_container");
extraIds.push({ id: "m_city", tag: "input" });
var reviewId = 0;
var platformId = false ? 43 : 1;

for (var i = 0; i < accordionContainer.length; i++) {
  var accordionButton = accordionContainer[i].querySelectorAll(
    ".js_accordion_tab"
  );
  for (var j = 0; j < accordionButton.length; j++) {
    accordionButton[j].addEventListener("click", function () {
      var nextContainer = this.nextElementSibling;
      if (this.lastElementChild.classList.contains("current")) {
        nextContainer.classList.add("display-none");
        this.lastElementChild.classList.remove("current");
      } else {
        nextContainer.classList.remove("display-none");
        this.lastElementChild.classList.add("current");
      }
    });
  }
}

var MileageForm = (function () {
  var mileageFormContainer, inputBoxs, continueButton, formSectionCount;
  function _setSelector() {
    mileageFormContainer = document.querySelector("#mileage_form");
    inputBoxs = mileageFormContainer.querySelectorAll(".mileage_inpbox");
    continueButton = mileageFormContainer.querySelectorAll(
      ".js-mileage-continue"
    );
    formSectionCount = mileageFormContainer
      .querySelector(".mileage-form__count")
      .querySelector("span");
  }

  function _handleLablePosition() {
    var inputBoxs = document.querySelectorAll(".mileage_inpbox");
    var mileageFormContainer = document.querySelector("#mileage_form");
    for (var i = 0; i < inputBoxs.length - 4; i++) {
      inputBoxs[i].value = "";
    }
    for (var i = 0; i < inputBoxs.length - 4; i++) {
      inputBoxs[i].addEventListener("click", function () {
        var activeLable = mileageFormContainer.querySelectorAll(
          ".label-active"
        );
        for (var j = 0; j < activeLable.length; j++) {
          var activeInput = "";
          if (activeLable)
            activeInput = activeLable[j]
              .closest(".mileage-form_input")
              .querySelector("input").value;
          if (activeLable[j] && activeInput.length === 0) {
            activeLable[j].classList.remove("label-active");
          }
        }
        // this.closest(".mileage-form_input")
        //   .querySelector("label")
        //   .classList.add("label-active");
      });
      inputBoxs[i].addEventListener("input", function () {
        var inputValue = this.value;
        var inputErrorContainer = this.closest(
          ".mileage-form_input"
        ).querySelector(".mileage_er_msg");
        if (inputValue.length == 0) {
          inputErrorContainer.classList.add("error-active");
          inputErrorContainer.querySelector("span").classList.remove("active");
        } else {
          //todo handle all error state
          inputErrorContainer.querySelector("span") &&
            inputErrorContainer.querySelector("span").classList.add("active");
          var reg = /^[1|2|3|4|5|6|7|8|9][0-9]*\.?[0-9]*$/;
          if (this.id === "m_city_mileage" || this.id === "m_high_mileage") {
            inputValue.match(reg) &&
              inputValue.length >= 1 &&
              inputValue.length <= 5
              ? inputErrorContainer.classList.remove("error-active")
              : inputErrorContainer.classList.add("error-active");
          }
          if (this.id === "m_monthly_cost") {
            parseInt(inputValue) > 0 && parseInt(inputValue) <= 10000
              ? inputErrorContainer.classList.remove("error-active")
              : inputErrorContainer.classList.add("error-active");
          }
          if (this.id === "m_age_car") {
            parseInt(inputValue) > 0 && parseInt(inputValue) <= 20
              ? inputErrorContainer.classList.remove("error-active")
              : inputErrorContainer.classList.add("error-active");
          }
        }
      });
    }
  }

  function _handleEmptyError() {
    var firstContainer = document.querySelector("#form-container-first");
    var inputBoxs = firstContainer.querySelectorAll(".mileage_inpbox");
    for (var i = 0; i < inputBoxs.length; i++) {
      var inputValue = inputBoxs[i].value;
      var inputErrorContainer = inputBoxs[i]
        .closest(".mileage-form_input")
        .querySelector(".mileage_er_msg");
      if (inputValue.length == 0) {
        inputErrorContainer.classList.add("error-active");
        inputErrorContainer.querySelector("span").classList.remove("active");
      } else {
        //todo handle all error state
        var reg = /^[1|2|3|4|5|6|7|8|9][0-9]*\.?[0-9]*$/;
        if (
          inputBoxs[i].id === "m_city_mileage" ||
          inputBoxs[i].id === "m_high_mileage"
        ) {
          inputValue.match(reg) &&
            inputValue.length >= 1 &&
            inputValue.length <= 5
            ? inputErrorContainer.classList.remove("error-active")
            : inputErrorContainer.classList.add("error-active");
        }
        if (inputBoxs[i].id === "m_monthly_cost") {
          parseInt(inputValue) > 0 && parseInt(inputValue) <= 10000
            ? inputErrorContainer.classList.remove("error-active")
            : inputErrorContainer.classList.add("error-active");
        }
        if (inputBoxs[i].id === "m_age_car") {
          parseInt(inputValue) >= 0 && parseInt(inputValue) <= 20
            ? inputErrorContainer.classList.remove("error-active")
            : inputErrorContainer.classList.add("error-active");
        }
      }
    }
  }

  function _handleContinueButton() {
    for (var i = 0; i < continueButton.length; i++) {
      continueButton[i].addEventListener("click", function () {
        var sectionContainer = this.closest(".form-container__content");
        if (sectionContainer.id === "form-container-first") {
          _handleEmptyError();
          var activeErrorElement = sectionContainer.querySelector(
            ".error-active"
          );
          if (!activeErrorElement) {
            sectionContainer.classList.remove("active");
            sectionContainer.nextElementSibling.classList.add("active");
            formSectionCount.innerHTML = "2";
          }
        }
        if (sectionContainer.id === "form-container-second") {
          // Add condtion for error state
          _handleRatingError();
          var activeErrorElement1 = sectionContainer.querySelector(
            ".error-active"
          );
          if (!activeErrorElement1) {
            sectionContainer.classList.remove("active");
            sectionContainer.nextElementSibling.classList.add("active");
            formSectionCount.innerHTML = "3";
            var cityName = GetCookieByName("cookie_ct_city");
            if (!!cityName) {
              $("#m_city").val(cityName);
            }
          }
        }
        if (sectionContainer.id === "form-container-third") {
          check_mileage_lead_name(1);
          check_mileage_lead_email(1);
          check_mileage_lead_version(1);
          var activeErrorElement2 = sectionContainer.querySelector(
            ".error-active"
          );
          if (!activeErrorElement2) {
            sectionContainer.classList.remove("active");
            sectionContainer.nextElementSibling.classList.add("active");
            $(".mileage-form__count")[0].style.display = "none";
            initiateObject();
          }
        }
      });
    }
  }
  function registerEvents() {
    _setSelector();
    _handleLablePosition();
    _handleContinueButton();
  }
  return {
    registerEvents: registerEvents,
  };
})();

window.addEventListener("load", function () {
  MileageForm.registerEvents();
});

function ratemem(rating, type) {
  if (!type) {
    type = "";
  }
  for (i = 0; i <= 5; i++) {
    document.getElementById("rating" + type + i).style.display = "none";
  }
  $("#hasvoted" + type).val(rating);
  document.getElementById("rating" + type + rating).style.display = "block";
  if (type == "") {
    $("#err_carrate").addClass("disp_none");
    $("#err_carrate").removeClass("disp_block");
    $("#err_carrate").html("");
  } else if (type == "_mileage") {
    $("#err_carrate_mileage").addClass("disp_none");
    $("err_carrate_mileage").removeClass("disp_block");
    $("#err_carrate_mileage").html("");
  }
  if ($("#hasvoted").val() > 0) {
    $("#rating").hide();
  }
  if ($("#hasvoted_exteriors").val() > 0) {
    $("#rating_ext").hide();
  }
  if ($("#hasvoted_interiors").val() > 0) {
    $("#rating_int").hide();
  }
  if ($("#hasvoted_ridequality").val() > 0) {
    $("#rating_ride_qt").hide();
  }
}

function initiateObject() {
  var ratingData = {
    userDetails: {
      name: "",
      email: "",
    },
    carDetails: {
      versionId: $("#m_version").val(),
    },
    rating: {
      userRating: 0,
    },
    reviewId: 0,
    cityId: 0,
    reviewDetails: {
      title: $("#reviewTitle").val(),
      description: $("#mainReview").val(),
    },
  };
  var cityId = $("#m_city").data("cityId");
  if (cityId != undefined) {
    ratingData.cityId = cityId;
  }
  ratingData.rating.userRating = $("#hasvoted").val();
  ratingData.rating.ratingQuestions = [
    { questionId: 141, answerId: $("#hasvoted_exteriors").val() },
    { questionId: 143, answerId: $("#hasvoted_interiors").val() },
    { questionId: 145, answerId: $("#hasvoted_ridequality").val() },
    { questionId: 147, answerId: $("#m_city_mileage").val() },
    { questionId: 149, answerId: $("#m_high_mileage").val() },
    { questionId: 151, answerId: $("#m_monthly_cost").val() },
    { questionId: 153, answerId: $("#m_age_car").val() },
  ];
  ratingData.userDetails.name = $("#m_name").val();
  ratingData.userDetails.email = $("#m_email").val();
  postRatings(ratingData);
}

function postReview() {
  var flag = _handleReviewError();
  if (!flag) {
    return;
  }
  var userDetails = {
    name: $("#m_name").val(),
    email: $("#m_email").val(),
  };
  $.ajax({
    url: "/api/userreviewsct/savereviewonly/",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify({
      reviewDetails: {
        title: $("#reviewTitle").val(),
        description: $("#mainReview").val(),
      },
      reviewId: reviewId,
      userDetails: userDetails,
    }),
    headers: {
      CWK: "KYpLANI09l53DuSN7UVQ304Xnks=",
      sourceId: platformId,
      platformId: platformId,
      ServerDomain: 'CarWale'
    },
    success: function (response) {
      ratingSubmitted = true;
      if (response.isDuplicate) {
        responseMeassage.text(response.message).show();
      } else {
        document.getElementById("Thank_you-section").style.display = "block";
        document.getElementById("mileage_form").style.display = "none";
        document.getElementById("Thankyou_name").innerHTML =
          "Thank You " + response;
      }
    },
    error: function () {
      responseMeassage.text("Error occurred. Please try again later.").show();
    },
  });
}

function postRatings(ratingData) {
  var submitData = [];
  for (var index in ratingData.rating.ratingQuestions) {
    var answerId = ratingData.rating.ratingQuestions[index].answerId;
    var questionId = ratingData.rating.ratingQuestions[index].questionId;
    submitData.push({ questionId: +questionId, answerId: answerId });
  }
  $.ajax({
    url: "/api/userreviewsct/savereview/",
    type: "post",
    contentType: "application/json",
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
      if (response.isDuplicate) {
        responseMeassage.text(response.message).show();
      } else {
        reviewId = response;
      }
    },
    error: function () {
      responseMeassage.text("Error occurred. Please try again later.").show();
    },
  });
}
function overm_r(val, type) {
  if (!type) {
    type = "";
  }
  if (parseInt(val) > 5) {
    val = 5;
  }
  for (i = 0; i <= 5; i++) {
    document.getElementById("rating" + type + i).style.display = "none";
  }
  if (type == "_mileage") {
    var rateTitle = document.getElementById("rateTitle" + type + val).value;
    var rateText = document.getElementById("rateText" + type + val).value;
    $(".rateText_mileage").html(rateText);
    $(".rateTitle_mileage").html(rateTitle);
    $("#rate_img_mileage").attr(
      "src",
      "https://" +
      images_domain +
      "/images-mobiles/rate_star_" +
      val +
      ".svg?v=2"
    );
  } else {
    if (type == "") {
      var rateTitle = document.getElementById("rateTitle" + type + val).value;
      var rateText = document.getElementById("rateText" + type + val).value;
      $(".rateTitle").html(rateTitle);
      $(".rateText").html(rateText);
      $("#rate_img").attr(
        "src",
        `${window.CloudfrontCDNHostURL}/images-mobiles/rate_star_` +
        val +
        ".svg?v=2"
      );
    } else {
    }
  }
  document.getElementById("rating" + type + val).style.display = "block";
}
window.addEventListener(
  "load",
  function () {
    getVersions(ModelId);
  },
  false
);

function getVersions(ModelId) {
  var url =
    "/api/v3/versions/" +
    "?modelId=" +
    ModelId +
    "&type=new&itemIds=29,26&application=1";
  $.ajax({
    type: "get",
    url: url,
    contentType: "application/json",
    headers: { 'ServerDomain': 'CarWale' },
    success: function (response) {
      $.each(response.variants, function (key, item) {
        var div_data =
          "<option class='custom-option' data-value=" +
          item.versionId +
          " value=" +
          item.versionId +
          " data-mask=" +
          item.versionMaskingName +
          " data-testing-id=" +
          item.versionId +
          " onclick='mmvDropdown.selectversion(this)'>" +
          item.versionName +
          "</option>";
        $(div_data).appendTo("#m_version");
      });
    },
    error: function (error) {
      reject(error);
    },
  });
}

function check_mileage_lead_mcity(n) {
  var txtmcity = document.getElementById("m_city_mileage").value;
  var errorClass = document.getElementById("er_msg_city");
  if (txtmcity.length == 0 && n == 1) {
    errorClass.style.display = "block";
    $("#er_msg_city").html("Please enter City Mileage");
    return "Please enter City Mileage";
  } else if (n == 1) {
    if (parseFloat(txtmcity) < 1 || parseFloat(txtmcity) > 50) {
      errorClass.style.display = "block";
      $("#er_msg_city").html("Please enter proper mileage between 1 to 50");
      return "Please enter proper City Mileage";
    } else {
      errorClass.style.display = "none";
      $("#er_msg_city").html("");
      return "";
    }
  } else if (txtmcity) {
    var reg = /^[1|2|3|4|5|6|7|8|9][0-9]*\.?[0-9]*$/;
    if (!txtmcity.match(reg)) {
      txtmcity_ = txtmcity.replace(/[^0-9]\./g, "");
      console.log(txtmcity_);
      $("#m_city_mileage").val("");
      errorClass.style.display = "block";
      $("#er_msg_city").html("Please enter mileage in number");
      return "Please enter mileage in number";
    } else {
      if (txtmcity.length >= 1 && txtmcity.length <= 5) {
        errorClass.style.display = "none";
        $("#er_msg_city").html("");
        return "";
      } else {
        errorClass.style.display = "block";
        $("#er_msg_city").html("Mileage text length should be less than 6");
        return "Mileage text length should be less than 6";
      }
    }
  }
}

function check_mileage_lead_mhighway(n) {
  var txtmhighway = document.getElementById("m_high_mileage").value;
  var errorClass = document.getElementById("er_msg_highway");
  if (txtmhighway.length == 0 && n == 1) {
    errorClass.style.display = "block";
    $("#er_msg_highway").html("Please enter Highway Mileage");
    return "Please enter Highway Mileage";
  } else if (n == 1) {
    if (parseFloat(txtmhighway) < 5 || parseFloat(txtmhighway) > 50) {
      errorClass.style.display = "block";
      $("#er_msg_highway").html("Please enter proper mileage between 1 to 50");
      return "Please enter proper mileage between 1 to 50";
    } else {
      errorClass.style.display = "none";
      $("#er_msg_highway").html("");
      return "";
    }
  } else if (txtmhighway) {
    var reg = /^[1|2|3|4|5|6|7|8|9][0-9]*\.?[0-9]*$/;
    if (!txtmhighway.match(reg)) {
      txtmhighway_ = txtmhighway.replace(/[^0-9\.]/g, "");
      $("#m_high_mileage").val(txtmhighway_);
      errorClass.style.display = "block";
      $("#er_msg_highway").html("Please enter mileage in number");
      return "Please enter mileage in number";
    } else {
      if (txtmhighway.length >= 1 && txtmhighway.length <= 5) {
        errorClass.style.display = "none";
        $("#er_msg_highway").html("");
        return "";
      } else {
        errorClass.style.display = "block";
        $("#er_msg_highway").html("Mileage text length should be less than 6");
        return "Mileage text length should be less than 6";
      }
    }
  } else {
    errorClass.style.display = "none";
    $("#er_msg_highway").html("");
    return "";
  }
}

function check_maintenance_valid(n) {
  var mcost = document.getElementById("m_monthly_cost").value;
  var errorClass = document.getElementById("er_msg_monthly_cost");
  if ($("#m_monthly_cost").val() == "" && n == 1) {
    errorClass.style.display = "block";
    $("#er_msg_monthly_cost").html("Please enter Maintenance Cost");
    return "Please enter Maintenance Cost\n";
  } else if (mcost) {
    var RegExp = /^[0-9]*$/;
    if (RegExp.test(mcost)) {
      if (parseInt(mcost) > 0 && parseInt(mcost) <= 10000) {
        errorClass.style.display = "none";
        $("#er_msg_monthly_cost").html("");
        return "";
      } else {
        mcost_ = mcost.replace(/[^0-9]/g, "");
        $("#m_monthly_cost").val(mcost_);
        errorClass.style.display = "block";
        $("#er_msg_monthly_cost").html("Please enter Maintenance Cost");
        return "Please enter proper Maintenance Cost\n";
      }
    } else {
      mcost_ = mcost.replace(/[^0-9]/g, "");
      $("#m_monthly_cost").val(mcost_);
      errorClass.style.display = "block";
      $("#er_msg_monthly_cost").html("Please enter Maintenance Cost");
      return "Please enter proper Maintenance Cost\n";
    }
  } else if (mcost < 0 || mcost > 10000) {
    errorClass.style.display = "block";
    $("#er_msg_monthly_cost").html("Please enter Maintenance Cost");
    return "Please enter proper Maintenance Cost\n";
  } else {
    errorClass.style.display = "none";
    $("#er_msg_monthly_cost").html("");
    return "";
  }
}

function check_car_age_valid(n) {
  var carage = document.getElementById("m_age_car").value;
  var errorClass = document.getElementById("er_msg_age_car");
  if (carage.length == 0 && n == 1) {
    errorClass.style.display = "block";
    $("#er_msg_age_car").html("Please enter Owned For");
    return "Please enter Owned For";
  } else if (carage) {
    errorClass.style.display = "none";
    $("#er_msg_age_car").html("");
    return "";
  }
}

function _handleRatingError() {
  var secondContainer = document.querySelector("#form-container-second");
  var inputBoxs = secondContainer.querySelectorAll(".mileage_inpbox");
  for (var i = 0; i < inputBoxs.length; i++) {
    var inputValue = inputBoxs[i].value;
    var inputErrorContainer = inputBoxs[i]
      .closest(".mileage-form_rate_input")
      .querySelector(".mileage_er_msg");
    if (inputValue.length == 0) {
      inputErrorContainer.classList.add("error-active");
      inputErrorContainer.querySelector("span").classList.remove("active");
    } else {
      inputErrorContainer.classList.remove("error-active");
    }
  }
}

$("#mainReview").keyup(function () {
  var count = 100 - $("#mainReview").val().length;
  if (count <= 0 || isNaN(count)) {
    $("#reviewCount").html("");
  } else {
    $("#reviewCount").html("Minimum " + count + " Characters");
  }
});


function _handleReviewError() {
  var title = $("#reviewTitle").val();
  var description = $("#mainReview").val();
  if (title.length >= 5 && description.length >= 100) return true;
  else {
    if (title.length < 5) {
      $("#titleError")[0].style.display = "block";
    } else {
      $("#titleError")[0].style.display = "none";
    }
    if (description.length < 100) {
      $("#reviewError")[0].style.display = "block";
    } else {
      $("#reviewError")[0].style.display = "none";
    }
    return false;
  }
}

function check_mileage_lead_email(n) {
  var txtEmail = document.getElementById("m_email").value;
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  txtEmail = txtEmail.trim();
  if (txtEmail.length >= 1 && n == 1) {
    if (txtEmail.match(re)) {
      $("#err_email").addClass("disp_none");
      $("#err_email").removeClass("disp_block error-active");
      $("#err_email .er_msg_ri").html("");
      return "";
    } else {
      $("#err_email").addClass("disp_block error-active");
      $("#err_email").removeClass("disp_none");
      $("#err_email .er_msg_ri").html("Enter proper EMail ID");
      return "Enter proper EMail ID\n";
    }
  } else if (n == 1) {
    $("#err_email").addClass("disp_block error-active");
    $("#err_email").removeClass("disp_none");
    $("#err_email .er_msg_ri").html("Email should not be empty");
    return "Email should not be empty\n";
  } else {
    $("#err_email").addClass("disp_none");
    $("#err_email").removeClass("disp_block error-active");
    $("#err_email .er_msg_ri").html("");
    return "";
  }
}

function check_mileage_lead_name(n) {
  var letters = /^[A-Za-z\.\ \'\/]+$/;
  if ($("#m_name").val().length == 0 && n == 1) {
    $("#err_name").addClass("disp_block  error-active");
    $("#err_name").removeClass("disp_none");
    $("#err_name .er_msg_ri").html("Name should not be empty");
    return "Name should not be empty\n";
  } else if (!$("#m_name").val().match(letters) && n == 1) {
    $("#err_name").addClass("disp_block  error-active");
    $("#err_name").removeClass("disp_none");
    $("#err_name .er_msg_ri").html("Name must contain alphabets only");
    return "Name must contain alphabets only\n";
  } else if (($("#m_name").val().length < 3 || $("#m_name").val().length > 50) && n == 1) {
    $("#err_name").addClass("disp_block  error-active");
    $("#err_name").removeClass("disp_none");
    $("#err_name .er_msg_ri").html("Name length should be 3 to 50 characters");
    return "Name length should be 3 to 50 characters\n";
  } else {
    $("#err_name").addClass("disp_none");
    $("#err_name").removeClass("disp_block  error-active");
    $("#err_name .er_msg_ri").html("");
    return "";
  }
}

function check_mileage_lead_version(n) {
  if ($("#m_version").val() == "" && n == 1) {
    $("#err_version").addClass("disp_block error-active");
    $("#err_version").removeClass("disp_none");
    $("#err_version .er_msg_ri").html("Please select a version");
    return "Please select a version\n";
  } else {
    $("#err_version").addClass("disp_none");
    $("#err_version").removeClass("disp_block error-active");
    $("#err_version .er_msg_ri").html("");
    return "";
  }
}

function mileage_namevalidation(event) {
  var regex = new RegExp("^[a-zA-Z .]+$");
  var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (!regex.test(key) && event.which != 0 && event.which != 8) {
    event.preventDefault();
    return false;
  }
}

var pageNoList = {};
function loadMoreReviews(versionId, totalCount) {
  if (pageNoList[versionId] == undefined) {
    pageNoList[versionId] = 1;
  }
  addContentLoader(versionId);
  pageNoList[versionId]++;
  $.ajax({
    url: "/api/mileage/user-reported-mileage/?makeId=" + makeId,
    type: "post",
    contentType: "application/json",
    headers: { 'ServerDomain': 'CarWale' },
    data: JSON.stringify({
      ModelId: ModelId,
      VersionId: versionId,
      PageNumber: pageNoList[versionId],
      PageSize: 15
    }),
    success: function (data) {
      apiSuccessCall(JSON.parse(data), versionId, totalCount);
    },
    error: function (response, status) {
      defaultErrorHandling(response, status, versionId);
    },
  });
}

function apiSuccessCall(mileageReviews, versionId, totalCount) {
  for (let i = 0; i < mileageReviews.length; i++) {
    let review = mileageReviews[i];
    let row = document.createElement("tr");
    row.setAttribute( "data-testing-id", "mileage-table-user-review-after-load-more" );
    row.setAttribute("class", "review_body");

    let user_name = document.createElement("td");
    user_name.setAttribute("class", "review_value user_name");
    user_name.innerHTML = review["UserName"].length > 0 ? review["UserName"] : "-";
    let line_break = document.createElement("br");
    let city_name = document.createElement("span");
    city_name.setAttribute("class", "city_name");
    city_name.innerHTML = review["CityName"] != null && review["CityName"].length > 0 ? "(" + review["CityName"] + ")" : "";
    user_name.append(line_break, city_name);

    let city_mileage = document.createElement("td");
    city_mileage.setAttribute("class", "review_value");
    city_mileage.innerHTML = review["CityMileage"] === 0 ? "-" : review["CityMileage"] + " " + mileageUnit;

    let highway_mileage = document.createElement("td");
    highway_mileage.setAttribute("class", "review_value");
    highway_mileage.innerHTML = review["HighwayMileage"] === 0 ? "-" : review["HighwayMileage"] + " " + mileageUnit;

    row.append(user_name, city_mileage, highway_mileage);

    $("#load_more_button_" + versionId).before(row);
  }
  hideContentLoader();
  $("#load_more_button_" + versionId).show();
  if (pageNoList[versionId] >= Math.ceil(totalCount / 15)) {
    $("#load_more_button_" + versionId).hide();
    return;
  }
}

function defaultErrorHandling(response, status, versionId) {
  $("#load_more_button_" + versionId).hide();
}

function addContentLoader(versionId) {
  $("#load_more_button_" + versionId).hide();
  for (let i = 0; i < 6; i++) {
    let row = document.createElement("tr");
    row.setAttribute("class", "content_loader_container");

    let column = document.createElement("td");
    column.setAttribute("colspan", 4);

    let loader_container = document.createElement("div");
    loader_container.setAttribute("class", "content_loader");

    let content_data = document.createElement("div");
    content_data.setAttribute("class", "content_data");

    loader_container.append(content_data);
    column.append(loader_container);
    row.append(column);

    $("#load_more_button_" + versionId).before(row);
  }
}

function hideContentLoader() {
  document.querySelectorAll(".content_loader_container")
    .forEach(e => {
      e.remove();
    });
}

function toggleread() {
  var read_btn = document.getElementById("read-more");
  var seotext_content = document.getElementById("seotext-content");

  if (seotext_content.classList.contains("seotext_read_less")) {
    // expand
    seotext_content.classList.remove("seotext_read_less");
    read_btn.textContent = "View Less";
  } else {
    // collapse
    seotext_content.classList.add("seotext_read_less");
    read_btn.textContent = "Read More";
  }
}