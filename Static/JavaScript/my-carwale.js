function removeCarRequest(inquiryId) {
  var left = (screen.width - 300) / 2;
  var top = (screen.height - 250) / 2;
  window.open(
    "/sell-used-car/myaccount/manage/remove-listing?id=" + inquiryId + "&authtoken=" + ($.cookie('encryptedAuthToken') ? $.cookie('encryptedAuthToken') : ""),
    "remove",
    "menu=no,address=no,scrollbars=no,width=300,height=250,left=" +
      left +
      ",top=" +
      top
  );
};

function editListing(inquiryId) {
  var url = "/sell-used-car/myaccount/manage/edit/?id=" + inquiryId + "&authToken=" + ($.cookie('encryptedAuthToken') ? $.cookie('encryptedAuthToken') : "");
 location.href = url;    
};

function uploadCarPhotos(carId) {
  window.location.href = "/sell-used-car/myaccount/view-images/?car=" + "s" + carId + "&authtoken=" + ($.cookie('encryptedAuthToken') ? $.cookie('encryptedAuthToken') : "");
}

$(document).on("click", "#upload-photo-button", function() {
  uploadCarPhotos($(this).attr("data-listingid"));
})

function renewCar(carId) {
  var left = (screen.width - 425) / 2;
  var top = (screen.height - 230) / 2;
  window.open(
    "RenewCar.aspx?id=" + carId,
    "renew",
    "menu=no,address=no,scrollbars=no,width=425,height=230,left=" +
      left +
      ",top=" +
      top
  );
};

function view(inquiryId, spnInquiryCount) {
  var caption = "My Used Car Purchase Inquiries (" + spnInquiryCount + ")";
  var url =
    "/mycarwale/my-purchase-requests/?id=" + inquiryId + "&requestdate=7";
  var applyIframe = true;
  var GB_Html = "";
  GB_show(caption, url, 250, 600, applyIframe, GB_Html);
};

function carSelected() {
  var reasonSelected = document.getElementById("remove_cars").value;
  if (reasonSelected === "2" || reasonSelected === "3") {
    document.getElementById("buyer-select-box").hidden = false;
    document.getElementById("deal-price-box").hidden = false;
    document.getElementById("whatchangeyourmind").hidden = true;
    if (reasonSelected == "3") {
      document.getElementById("sold_to_select_box").hidden = false;
      if (document.getElementById("sold_to").value === "7") {
        document.getElementById("whomyousoldcar").hidden = false;
      } else {
        document.getElementById("whomyousoldcar").hidden = true;
      }
    } else {
      document.getElementById("sold_to_select_box").hidden = true;
      document.getElementById("whomyousoldcar").hidden = true;
    }
  }
   else {
    if (document.getElementById("individual").checked) {
      document.getElementById("individual").checked = false;
    }
    if (document.getElementById("dealer").checked) {
      document.getElementById("dealer").checked = false;
    }
    document.getElementById("deal-price").value = "";
    document.getElementById("sold_to").value = "0";
    document.getElementById("buyer-error-text").hidden = true;
    document.getElementById("price-error-text").hidden = true;
    document.getElementById("buyer-select-box").hidden = true;
    document.getElementById("deal-price-box").hidden = true;
    document.getElementById("error_sold_to").hidden = true;
    document.getElementById("sold_to_select_box").hidden = true;
    document.getElementById("whatchangeyourmind").hidden = false;
    document.getElementById("whomyousoldcar").hidden = true;
  }
  document.getElementById("error_reason").innerText = "";
  document.getElementById("error_reason").hidden = true;
};

function deleteListing(inquiryId) {
  document.getElementById("delListing_" + inquiryId).innerText =
    "Processing please wait...";
  $.ajax({
    type: "POST",
    headers: {
      ServerDomain: "CarWale",
    },
    url: "/api/listings/" + inquiryId + "/archivelisting/?authToken=" + ($.cookie('encryptedAuthToken') ? $.cookie('encryptedAuthToken') : ""),
    success: function(response) {
      $("#inquiry").html(
        "<span class=margin-left10><strong>This listing has been deleted successfully.</strong><span>"
      );
      $("#inquiry").css("background-color", "#ecf4e8");
    },
    error: function(response) {
      $("#delListing_" + inquiryId).text("Delete this listing");
    },
  });
};

function onSoldToChange() {
  if (document.getElementById("sold_to").value === "7") {
    document.getElementById("whomyousoldcar").hidden = false;
  } else if (document.getElementById("sold_to").value !== "0") {
    document.getElementById("error_sold_to").innerText = "";
    document.getElementById("error_sold_to").hidden = true;
    document.getElementById("whomyousoldcar").hidden = true;
  } else {
    //no condition.
  }
};

function buyerTypeChange(event) {
  var buyerType = event.value;
  if (buyerType === "1" || buyerType === "2") {
    document.getElementById("buyer-error-text").hidden = true;
  }
};

function dealPriceInput() {
  var price = document.getElementById("deal-price").value;
  if (price) {
    document.getElementById("price-error-text").hidden = true;
  }
};

function dealWhomYouSoldCarInput() {
  var answer = document.getElementById("txt-whomyousoldcar").value;
  if (answer && answer.trim() !== "") {
    document.getElementById("whomyousold-error-text").innerText =
      "";
  }
}

function dealWhatChangeYourMindInput() {
  var answer = document.getElementById("txt-whatchangeyourmind").value;
  if (answer && answer.trim() !== "") {
    document.getElementById("whatchangeyourmind-error-text").innerText =
    "";
  }
}

function experienceChange(event) {
  var customerExperience = event.value;
  if (customerExperience === "good" || customerExperience === "average") {
    document.getElementById("comment-textarea").hidden = false;
    document.getElementById("comment-label").innerText =
      "Let us know what we can improve";
  } else if (customerExperience === "bad") {
    document.getElementById("comment-textarea").hidden = false;
    document.getElementById("comment-label").innerText =
      "Please let us know what went wrong";
  } else {
    document.getElementById("comment-textarea").hidden = true;
  }
};

function validateDeleteRequest() {
  var validation = true;
  var reasonSelected = document.getElementById("remove_cars").value;
  if (reasonSelected === "0") {
    validation = false;
    document.getElementById("error_reason").innerText =
      "Please select a reason.";
    document.getElementById("error_reason").hidden = false;
  }
  if (reasonSelected === "6") {
    var reasonForNotSelling = document.getElementById("txt-whatchangeyourmind")
      .value;
    if (!reasonForNotSelling || reasonForNotSelling.trim() === "") {
      validation = false;
      document.getElementById("whatchangeyourmind-error-text").innerText =
        "Please enter the reason for not selling.";
      document.getElementById("whatchangeyourmind-error-text").hidden = false;
    }
  }
  if (reasonSelected === "2" || reasonSelected === "3") {
    if (reasonSelected === "3") {
      if (document.getElementById("sold_to").value === "0") {
        validation = false;
        document.getElementById("error_sold_to").innerText =
          "Please select a platform.";
        document.getElementById("error_sold_to").hidden = false;
      } else if (document.getElementById("sold_to").value === "7") {
        var whomYouSoldCar = document.getElementById("txt-whomyousoldcar")
          .value;
        if (!whomYouSoldCar || whomYouSoldCar.trim() === "") {
          validation = false;
          document.getElementById("whomyousold-error-text").innerText =
            "Please enter the platform where you sold.";
          document.getElementById("whomyousold-error-text").hidden = false;
        }
      } else {
        //no condition.
      }
    }
    if (
      !document.getElementById("individual").checked &&
      !document.getElementById("dealer").checked
    ) {
      validation = false;
      document.getElementById("buyer-error-text").innerText =
        "Please select the buyer type";
      document.getElementById("buyer-error-text").hidden = false;
    }
    var expectedPrice = document.getElementById("deal-price").value;
    if (!expectedPrice) {
      validation = false;
      document.getElementById("price-error-text").innerText =
        "please enter price.";
      document.getElementById("price-error-text").hidden = false;
    } else if (!parseInt(expectedPrice.trim()) > 0) {
      validation = false;
      document.getElementById("price-error-text").innerText =
        "please enter valid price.";
      document.getElementById("price-error-text").hidden = false;
    } else {
      //no condition.
    }
  }
  return validation;
};

function populateReasonBasedInfo(jsonObj) {
  var reasonSelected = document.getElementById("remove_cars").value;
  if (reasonSelected === "2" || reasonSelected === "3") {
    var buyerType = "";
    if (document.getElementById("individual").checked) {
      buyerType = "1";
    } else if (document.getElementById("dealer").checked) {
      buyerType = "2";
    }
    if (buyerType !== "") {
      var item2 = {};
      item2["questionId"] = 3;
      item2["answer"] = buyerType;
      jsonObj.push(item2);
    }
    if (document.getElementById("deal-price").value) {
      var item3 = {};
      item3["questionId"] = 4;
      item3["answer"] = document.getElementById("deal-price").value;
      jsonObj.push(item3);
    }
  }
  return jsonObj;
};

function populateDelistingJsonObj() {
  var jsonObj = [];
  var reasonSelected = document.getElementById("remove_cars").value;
  if (reasonSelected !== "0") {
    var item = {};
    item["questionId"] = 1;
    item["answer"] = reasonSelected;
    jsonObj.push(item);
  }
  if (
    reasonSelected === "3" &&
    document.getElementById("sold_to").value !== "0"
  ) {
    var item1 = {};
    item1["questionId"] = 2;
    item1["answer"] = document.getElementById("sold_to").value;
    jsonObj.push(item1);
  }
  jsonObj = populateReasonBasedInfo(jsonObj);
  var experience = "";
  if (document.getElementById("good-experience").checked) {
    experience = "good";
  } else if (document.getElementById("avg-experience").checked) {
    experience = "average";
  } else if (document.getElementById("bad-experience").checked) {
    experience = "bad";
  } else {
    //nothing to do.
  }
  if (experience !== "") {
    var item4 = {};
    item4["questionId"] = 5;
    item4["answer"] = experience;
    item4["comments"] = document.getElementById("txtComments").value;
    jsonObj.push(item4);
  }
  if (reasonSelected === "6") {
    var item5 = {};
    item5["questionId"] = 6;
    item5["answer"] = document.getElementById("txt-whatchangeyourmind").value;
    jsonObj.push(item5);
  }
  if (
    reasonSelected === "3" &&
    document.getElementById("sold_to").value === "7"
  ) {
    var item6 = {};
    item6["questionId"] = 7;
    item6["answer"] = document.getElementById("txt-whomyousoldcar").value;
    jsonObj.push(item6);
  }
  var deListingDetails = {};
  deListingDetails["DeListingInfo"] = jsonObj;
  return JSON.stringify(deListingDetails);
};

function getCookie(e) {
  var t, o, n, a = document.cookie.split(";");
  for (t = 0; t < a.length; t++)
      if (o = a[t].substr(0, a[t].indexOf("=")),
          n = a[t].substr(a[t].indexOf("=") + 1),
          o = o.replace(/^\s+|\s+$/g, ""),
          o == e)
          return unescape(n)
}

function removeSelectedCar(inquiryId) {
  var selectedItem = document.getElementById("remove_cars");
  var selectedValue = selectedItem.options[selectedItem.selectedIndex].value;
  if (!validateDeleteRequest()) {
    return false;
  }
  var deleteComments = populateDelistingJsonObj();
  var xmlhttp = new XMLHttpRequest();
  var userResponse = {};
  userResponse.InquiryId = inquiryId;
  userResponse.SelectedValue = selectedValue;
  userResponse.DeleteComments = deleteComments;
  userResponse.UserComments = document.getElementById("txtComments").value;
  xmlhttp.open("POST", "/sell-used-car/myaccount/stop-user-ad/?authtoken=" + (getCookie("encryptedAuthToken") ? getCookie("encryptedAuthToken") : ""));
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4) {
      window.close();
      opener.location.href = opener.location.href;
    }
  };
  xmlhttp.send(JSON.stringify(userResponse));
};
