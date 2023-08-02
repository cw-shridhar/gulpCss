var recoleaddata, secondkey;
//primaryLeadId, modelId, name, mobile, email
function callRecoAPI(secondkey) {
  secondkey = secondkey;
  const recoUrl =
    "/api/v2/campaign/recommendations/?modelid=" +
    modelId +
    "&cityid=" +
    cityId +
    "&areaid=" +
    areaId +
    "&zoneid=" +
    zoneId +
    "&platformid=" +
    platformId +
    "&mobile=" +
    txtMobile +
    "&recommendationcount=3" +
    "&showDistinctMakes=true" +
    "&boost=true" +
    "&application=1";
  $.ajax({
    type: "GET",
    url: recoUrl,
    headers: { ServerDomain: "CarWale" },
    contentType: "application/json",
  })
    .done(function (recoData) {
      // console.log(recoData);
      document.getElementById("lead_reco_user_name").textContent = txtName;
      document.getElementById("rec_popup").style.display = " block";
      camp_response_recommend(recoData);
    })
    .fail(function () {
      // console.log("reco lead submission failed.");
      hide_rec_pop(secondkey);
    });
}

// #TODO: To take a call before deleting
function camp_response_recommend(saveData) {
  // Reccomendation API success response
  //get_make_model_img();

  if (saveData != undefined) {
    if (saveData["length"] > 0) {
      var append_data = "";
      var append_data_main = "";
      var select_all_flag = "";
      append_data_main +=
        '<span class="label_p">&nbsp;</span><input type="checkbox" name="Check_All_Rec" id="Check_All_Rec" value="Check All" onClick="check_all_rec(document.recform.check_list_rec);"><span></span>';
      $(".main_chkbx_rec").html(append_data_main);
      for (i in saveData) {
        var city_text = "";
        var price_value = "";
        //saveData[i].carPricesOverview = null;
        if (saveData[i].carPricesOverview) {
          if (
            saveData[i].carPricesOverview.city.name != "null" &&
            saveData[i].carPricesOverview.city.name != null &&
            saveData[i].carPricesOverview.priceStatus == 1
          ) {
            city_text =
              "On-Road Price " + saveData[i].carPricesOverview.city.name;
            price_value = saveData[i].carPricesOverview.price;
          } else if (saveData[i].carPricesOverview.priceStatus == 0) {
            city_text = "Avg. Ex-Showroom";
            price_value = saveData[i].carPricesOverview.price;
          }
        } else {
          // console.log(
          //   "Error!!!: Price is not avaialable and carPricesOverview is null"
          // );
        }
        if (price_value != "") {
          var carImageData = saveData[i].carData.carImageBase;
          var imageUrl =
            `${window.CloudfrontCDNHostURL}/images4/notavailable800x450.jpg`;
          if (carImageData && carImageData.originalImgPath) {
            imageUrl =
              carImageData.hostUrl + "110x61" + carImageData.originalImgPath;
          }
          append_data +=
            '<div class="make_are_rec"><div class="make_Rec"> <div class="rec_img"><img src="' +
            imageUrl +
            '" style="width: 100px; height: 56px;"></div><div class="rec_data_text"><div class="rec_mm">' +
            saveData[i].carData.carModel.makeName +
            " " +
            saveData[i].carData.carModel.modelName +
            '</div><div class="rec_prc">' +
            price_value +
            "</div><div>" +
            city_text +
            '</div></div></div><div class="make_chekc_Rec"><label><span class="label_p">&nbsp;</span> <input type="checkbox" name="check_list_rec" id="' +
            saveData[i].campaignList[0]["dealerId"] +
            '" class="rec_check_id" value="' +
            saveData[i].campaignList[0]["id"] +
            "#" +
            saveData[i].campaignList[0]["dealerId"] +
            "#" +
            saveData[i].carData.carModel.modelId +
            "#" +
            saveData[i].carData.carVersion.versionId +
            '" onClick="check_each_rec();"><span></span></label></div></div>';
        }
      }
      if (append_data != "") {
        /*For extra space above the button when large number of dealers displayed starts here*/
        append_data += '<div class="make_are_rec btm_padding">&nbsp;</div>';
        /*For extra space above the button when large number of dealers displayed ends here*/
        if (select_all_flag == "checked") {
          $("#submit_rec").removeClass("disab");
        } else {
          $("#submit_rec").addClass("disab");
        }
        if (select_all_flag == "checked") {
          $("#selall_rec").html("Remove All");
        } else {
          $("#selall_rec").html("Select All");
        }
        $("#dealer_checks_rec").html(append_data);

        show_recommendcars_form();
        ///////////////////////////
        if ($("#ispan").val() == "yes") {
          document.getElementById("pan_popup1").style.display = "none";
        } else {
          document.getElementById("popup1").style.display = "none";
        }
        /////////////////////////////
      } else {
        hide_rec_pop(secondkey);
      }
    } else {
      hide_rec_pop(secondkey);
    }
  } else {
    hide_rec_pop(secondkey);
  }
}

function show_recommendcars_form() {
  //Display recommendation form
  $("#rec_popup").show();
}

function hide_rec_pop(key) {
  //Close recommendation form
  document.getElementById("rec_popup").style.display = "none";
  leadFormPopup.show_popup2(key); // Last Popup Opne
}

function check_all_rec() {
  if (document.recform.Check_All_Rec.checked == true) {
    $(".rec_check_id").prop("checked", true);
    $("#submit_rec").removeClass("disab");
    $("#selall_rec").html("Remove All");
  } else {
    $(".rec_check_id").prop("checked", false);
    $("#submit_rec").addClass("disab");
    $("#selall_rec").html("Select All");
  }
}

function check_each_rec() {
  if (
    $("input:checkbox.rec_check_id").length ==
    $("input:checkbox.rec_check_id:checked").length
  ) {
    // If all check boxes length == checked check boxes length
    $("#submit_rec").removeClass("disab");
    $("#Check_All_Rec").prop("checked", true);

    $("#selall_rec").html("Remove All");
  } else {
    if (
      $("input:checkbox.rec_check_id").length ==
      $("input:checkbox.rec_check_id:not(:checked)").length
    ) {
      // If all check boxes length == unchecked check boxes length
      $("#submit_rec").addClass("disab");
      $("#selall_rec").html("Select All");
    } else {
      $("#submit_rec").removeClass("disab");
      $("#selall_rec").html("Select All");
    }
    $("#Check_All_Rec").prop("checked", false);
  }
}

function submit_rec_frm(chk) {
  //Submit recommendation form
  try {
    $("#chk_emi_click").val(0);
  } catch (e) { }

  var carWithCamp = [];

  if ($("input:checkbox.rec_check_id").length > 1) {
    // If more than one check boxes are checked
    for (i = 0; i < chk.length; i++) {
      if (chk[i].checked == true) {
        var camp_dealer = chk[i].value.split("#");
        const abc = {
          modelId: camp_dealer[2],
          dealerId: camp_dealer[1],
          campId: camp_dealer[0],
          verrsion: camp_dealer[3],
        };
        carWithCamp.push(abc);
      }
    }
  } else {
    // If single check boxes is checked
    var camp_dealer = $("input:checkbox.rec_check_id:checked").val().split("#");
    const abc = {
      modelId: camp_dealer[2],
      dealerId: camp_dealer[1],
      campId: camp_dealer[0],
      versionId: camp_dealer[3],
    };
    carWithCamp.push(abc);
  }
  if (carWithCamp === null || carWithCamp.length < 1) {
    return;
  }
  var carInquires = [];
  carWithCamp.forEach(function updateCarInquires(element) {
    const dealer = {
      CarDetail: {
        ModelId: element.modelId,
        VersionId: element.versionId,
      },
      Seller: {
        AssignedDealerId: targetedDealerId,
        CampaignId: element.campId,
      },
    };
    carInquires.push(dealer);
  });
  var recoLeadData = {
    CarInquiry: carInquires,
    EncryptedLeadId: "",
    LeadSource: {
      ABTest: abTest,
      ApplicationId: "3",
      CwCookie: cwCookies,
      IsCitySet: cityId > 0 ? 1 : 0,
      NewPageId: newPageId,
      PageId: pageId,
      PlatformId: platformId,
      PropertyId: propertyId,
      SourceType: "3",
      UtmzCookie: utmzCookie,
    },
    Others: {
      CampaignCTAText: "CT_GetBestOffers",
    },
    PrimaryEncryptedLeadId: firstkey,
    UserInfo: {
      Name: txtName,
      Mobile: txtMobile,
      Email: txtEmail,
    },
    UserLocation: {
      CityId: cityId,
      AreaId: areaId,
    },
  };
  recoLeadData = JSON.stringify(recoLeadData);
  $.ajax({
    type: "POST",
    url: "/api/dealer/inquiries/",
    contentType: "application/json",
    headers: { ServerDomain: "CarWale" },
    data: recoLeadData,
  })
    .done(function (thirdkey) {
      // console.log(thirdkey);
      encryptedLeadIds.push(thirdkey);
      hide_rec_pop(thirdkey);
    })
    .fail(function () {
      // console.log("reco lead submission failed.");
      hide_rec_pop(secondkey);
    });
}
