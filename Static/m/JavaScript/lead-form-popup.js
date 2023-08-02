/*global GetCookieByName*/
var txtName = "",
  txtMobile = "",
  txtEmail = "",
  modelId = "",
  versionId = "",
  campaignId = "",
  dealerName = "",
  lastkey = "",
  emailRequired = "False",
  category = "",
  label = "",
  makeName,
  modelName;
targetedDealerId = -1;
targetType = 0;
var encryptedLeadIds = [];
var dealerList = [];
var currentCityId = GetCookieByName("cookie_cw_cityid");
var currentAreaId = GetCookieByName("cookie_cw_area_id");
var campaignData = document.getElementById("campign_data");
var currentCityName = GetCookieByName("cookie_ct_city");
var currentAreaName = GetCookieByName("cookie_cw_area_name");
var cityName = GetCookieByName("cookie_ct_city");
var areaName = GetCookieByName("cookie_cw_area_name");
var cityId, areaId, abTest, pageId, newPageId, platformId, utmzCookie, cwCookies, zoneId, widgetName;
if (campaignData) {
  cityId = campaignData.getAttribute("data-cityid"),
    areaId = campaignData.getAttribute("data-areaid"),
    abTest = campaignData.getAttribute("data-abtest"),
    pageId = campaignData.getAttribute("data-pageid"),
    newPageId = campaignData.getAttribute("data-newpageid"),
    setPlatformId();
    utmzCookie = campaignData.getAttribute("data-utmzcookie"),
    cwCookies = campaignData.getAttribute("data-cwcookies"),
    zoneId = campaignData.getAttribute("data-zoneid");
}
var isAreaRequired = false;

function setPlatformId() {
  if(window.isAndroidWebView === "True"){
    platformId = Platform.Andriod.toString();
  }
  else if(window.isIosWebView === "True"){
    platformId = Platform.IOS.toString();
  }
  else{
    platformId = campaignData.getAttribute("data-platformid");
  }
}

const leadFormPopup = (() => {
  const dealerEndpoint = "/api/dealers/ncs/v2/?";
  let isDealerDropdownCreated = false;

  const campaignType = {
    DS: 0,
    ES: 1,
    Booster: 2,
    PX: 3,
    Finance: 4,
  };

  const CtaWidgetName = {
    43: "_PrimaryCTA",
    44: "_PrimarySpiltCTA",
    46: "_PrimaryCTA",
    47: "_OpenLeadForm",
    48: "_EMILink",
    49: "_EMICalculator",
    50: "_EMILink",
    53: "_VersionTable",
  };

  let crossSellCampaignData;

  function shouldAskForLocationDetails() {
    if (targetType !== campaignType.PX) {
      return false;
    }
    return cityId <= 0 || (isAreaRequired && areaId <= 0);
  }

  function showPopupWithDealerDropdown() {
    getDealersList().then(function(dealersList) {
      dealerList = dealersList;
      show_popup1();
    })
  }

  function getDealersList() {
    const applicationId = 1;
    const dealersCount = -1;
    const dealerApi = `${dealerEndpoint}applicationId=${applicationId}&campaignid=${campaignId}&modelid=${modelId}&cityid=${cityId}&areaId=${areaId}&dealersCount=${dealersCount}`;
    return fetch(dealerApi, {
        credentials: "include",
        headers: {
          ServerDomain: "CarWale"
        },
      })
      .then(function(response) {
        if (!response.ok || response.status === 204) {
          return [];
        }
        return response.json();
      })
      .catch(function(error) {
        console.log(error);
        reportError(error);
      })
  }

  function locationCallBack() {
    cityId = GetCookieByName("cookie_cw_cityid");
    zoneId = GetCookieByName("cookie_zone_id");
    areaId = GetCookieByName("cookie_cw_area_id");
    cityName = GetCookieByName("cookie_ct_city");
    areaName = GetCookieByName("cookie_cw_area_name");
    isAreaRequired = checkIfAreaRequired(cityId, areaId);
    if (cityId > 0 && !isAreaRequired) {
      leadFormTracking.fireCampaignCallEvent(false, category, "NewCarLeadCampaignCalled_on_LocationSelection", label);
      const campignUrl =
        "/api/dealerAdV2/?modelid=" +
        modelId +
        "&versionId=" +
        versionId +
        "&cityid=" +
        cityId +
        "&zoneid=" +
        zoneId +
        "&platformid=" +
        platformId +
        "&applicationid=3" +
        "&count=1" +
        "&areaId=" +
        areaId;
      fetch(campignUrl, {
          method: "GET",
          headers: {
            ServerDomain: "CarWale",
            sourceid: 3,
            "Content-Type": "application/json"
          },
        })
        .then(res => res.json())
        .then(function(data) {
          if (data != null && data.campaign != null && data.campaignType == 1) {
            dealerName = data.campaign.contactName;
            campaignId = data.campaign.id;
            emailRequired = data.campaign.isEmailRequired ? "True" : "False";
            targetType = data.campaign.targetType;
            label = getEventLabel(false, targetType, makeName, modelName);
            leadFormTracking.fireCampaignReturnEvent(false, category, makeName, modelName, targetType);
            createCrossSellCampaignElement(data);
            show_popup1();
          } else {
            leadFormTracking.fireCampaignReturnEvent(false, category, makeName, modelName, -1);
            document.getElementById("sry_pan_no_dealers").style.display = "Block";
          }
        })
        .catch(function() {
          // console.log("Api fail for campign.");
        });
    } else {
      label = getEventLabel(false, targetType, makeName, modelName, widgetName) +
        getCityAreaLabelText(cityName, areaName, cityId);
      leadFormTracking.fireCitySelectionFormCloseEvent();
      reloadPageOnCitySelection();
    }
  }

  function createCrossSellCampaignElement(campaignData) {
    const crossSellCampaign = campaignData.crossSellCampaign;
    if(crossSellCampaign && crossSellCampaign.featuredCarData && crossSellCampaign.campaign) {
      const carData = crossSellCampaign.featuredCarData;
      const spanEle = document.createElement("span");
      spanEle.classList.add("js-cross-sell-campaign");
      spanEle.setAttribute("data-modelName", carData.modelName);
      spanEle.setAttribute("data-modelId", carData.modelId);
      spanEle.setAttribute("data-makeName", carData.makeName);
      spanEle.setAttribute("data-versionId", carData.versionId);
      spanEle.setAttribute("data-campaignId", crossSellCampaign.campaign.id);
      spanEle.setAttribute("data-isChecked", crossSellCampaign.campaign.isTurboCrossSell);
      spanEle.setAttribute("data-targetVersionId", versionId);
      spanEle.setAttribute("data-targetCampaignId", campaignId);
      document.body.appendChild(spanEle);
    }
  }

  function show_popup1() {
    document.getElementById("name").value = localStorage.getItem("leadform_name");
    document.getElementById("mobile").value = localStorage.getItem("leadform_mobile");
    if (emailRequired === "True") {
      document.getElementById("email").value = localStorage.getItem("leadform_email");
    }
    if (platformId !== Platform.Desktop.toString()) {
      toggle_bg_pop("disable");
    } else {
      document.body.style.overflow = "hidden";
      document.getElementById("changecar_pop").style.display = "block";
    }
    var emailBlock = document.getElementById("email_block");
    var dealerBlock = document.getElementById("dealer_drop_down_block");
    const crossSellCampaignBlock = document.getElementById("js-cross-sell-campaign-block");
    crossSellCampaignData = getCrossSellCampaignData();

    document.getElementById("popup1").style.display = "block";

    leadFormTracking.fireLeadFormDisplayEvent();

    if (emailRequired === "True") {
      emailBlock.style.display = "block";
    } else if (emailBlock !== undefined) {
      document.getElementById("email_block").style.display = "none";
    }
    if (dealerList !== null && dealerList.length > 0 && targetType === 1) {
      if (dealerList.length === 1) {
        if (dealerBlock !== undefined) {
          document.getElementById("dealer_drop_down_block").style.display =
            "none";
        }
        targetedDealerId = dealerList[0].id;
      } else if (!isDealerDropdownCreated) {
        document.getElementById("dealer_drop_down_block").style.display = "block";
        var select_ele = document.getElementById("dealer_list");
        for (var index = 0; index < dealerList.length; index++) {
          var tag = document.createElement("option");
          tag.value = dealerList[index].id;
          tag.text = dealerList[index].name;
          select_ele.appendChild(tag);
        }
        isDealerDropdownCreated = true;
      }
    } else if (dealerBlock !== undefined) {
      document.getElementById("dealer_drop_down_block").style.display = "none";
    }
    document.getElementById("dealer_pop_name").textContent = dealerName;
    if(crossSellCampaignData)
    {
      const makeName = crossSellCampaignData.getAttribute("data-makeName");
      const modelName = crossSellCampaignData.getAttribute("data-modelName");
      const isChecked = crossSellCampaignData.getAttribute("data-isChecked");
      crossSellCampaignBlock.classList.remove("display-none");
      document.querySelector(".js-cross-sell-car-name").innerHTML = `${makeName} ${modelName}`;
      if(isChecked === "True" && !document.querySelector(".js-cross-sell-checkbox").checked)
      {
        document.querySelector(".js-cross-sell-checkbox").click();
      }
    }
    else
    {
      crossSellCampaignBlock.classList.add("display-none");
    }
  }

  function getCrossSellCampaignData() {
    const allCrossSellCampaignData = document.querySelectorAll(".js-cross-sell-campaign");
    for(const crossSellCampaign of allCrossSellCampaignData)
    {
      let targetVersionId = parseInt(crossSellCampaign.getAttribute("data-targetVersionId"), 10);
      if(crossSellCampaign.getAttribute("data-targetCampaignId") == campaignId && (targetVersionId <= 0 || (targetVersionId > 0 && targetVersionId == versionId)))
      {
        return crossSellCampaign;
      }
    }
    return null;
  }

  function reloadPageOnCitySelection() {
    let redirect = document.getElementById("variantId_leadFormRedirection");
    if (redirect) {
      window.location.href = redirect.getAttribute("data-redirecturl");
    } else if (currentCityId !== GetCookieByName("cookie_cw_cityid") || currentAreaId != GetCookieByName("cookie_cw_area_id")) {
      location.reload();
    }
  }

  // Hide Popup 1 Block
  function hide_popup1(openReco) {
    (!openReco && reloadPageOnCitySelection());
    document.getElementById("popup1").style.display = "none";
    if (platformId !== Platform.Desktop.toString()) {
      toggle_bg_pop("enable");
    } else {
      document.body.style.overflow = "visible";
      document.getElementById("changecar_pop").style.display = "none";
    }
  }

  function submitPopUpAPI() {
    var primaryLeadData = {
      CarInquiry: [{
        CarDetail: {
          ModelId: modelId.toString(),
          VersionId: versionId,
        },
        Seller: {
          AssignedDealerId: targetedDealerId,
          CampaignId: campaignId,
        },
      }, ],
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
        SourceType: "1",
        UtmzCookie: utmzCookie,
      },
      Others: {
        CampaignCTAText: "CT_GetBestOffers",
      },
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
    const crossCampaignLeadData = getCrossSellCampaignLeadData();
    if(crossCampaignLeadData)
    {
      primaryLeadData.CarInquiry.push(crossCampaignLeadData);
    }
    const primaryLeadJsonData = JSON.stringify(primaryLeadData);
    fetch("/api/dealer/inquiries/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ServerDomain: "CarWale"
        },
        body: primaryLeadJsonData,
      })
      .then(function(firstkey) {
        if (firstkey !== null) {
          leadFormTracking.fireLeadConversionEvent();
          leadFormTracking.fireOnSubmitLeadTrackingEvent();
          encryptedLeadIds.push(firstkey);
          callMLAAPI(firstkey);
        }
      })
      .catch(function(err) {
        leadFormTracking.fireErrorOnLeadSubmitEvent(err.statusText, "API", "Submit_Button")
        hide_popup1();
      });
  }

  function getCrossSellCampaignLeadData() {
    const targetedDealerId = -2;
    if(crossSellCampaignData && document.querySelector(".js-cross-sell-checkbox").checked)
    {
      return {
        CarDetail: {
          ModelId: crossSellCampaignData.getAttribute("data-modelId"),
          VersionId: parseInt(crossSellCampaignData.getAttribute("data-versionId"), 10),
        },
        Seller: {
          AssignedDealerId: targetedDealerId,
          CampaignId: parseInt(crossSellCampaignData.getAttribute("data-campaignId"), 10),
        },
      }
    }
  }

  function checkIfAreaRequired(cityId, areaId) {
    var majorCities = [1, 2, 10, 12, 105, 128, 160, 176, 198, 220, 244];
    if (majorCities.includes(parseInt(cityId))) {
      //if area is not set return true
      return (isNaN(parseInt(areaId)) ? 0 : parseInt(areaId)) <= 0;
    }
    return false;
  }

  function getCampaignTypeString(targetType) {
    let campaignString = Object.keys(campaignType).find(key => campaignType[key] === parseInt(targetType));
    return campaignString === undefined ? "No" : campaignString.toString();
  }




  //public function

	function click_camp_call(id, propertyType, dealerId) {
		// Enable lead submit button
		document.getElementById("lead_submit_btn").disabled = false;
		versionId = id;
		currentCityId = GetCookieByName("cookie_cw_cityid");
		currentAreaId = GetCookieByName("cookie_cw_area_id");
		let leadInput;
		if (dealerId) {
			leadInput = document.getElementById(dealerId);
		}
		else {
			leadInput = document.getElementById(id);
		}
		modelId = leadInput.getAttribute("data-modelid");
		campaignId = leadInput.getAttribute("data-campignid");
		dealerName = leadInput.getAttribute("data-dealerName");
		emailRequired = leadInput.getAttribute("data-emailrequired");
		targetType = parseInt(leadInput.getAttribute("data-targettype"));
		category = leadInput.getAttribute("data-cat");
		makeName = leadInput.getAttribute("data-make");
		modelName = leadInput.getAttribute("data-model");
		propertyId = propertyType;
		widgetName = CtaWidgetName[propertyType];
		label = getEventLabel(false, targetType, makeName, modelName, widgetName)
			+ getCityAreaLabelText(cityName, areaName, cityId);
		isAreaRequired = checkIfAreaRequired(cityId, areaId);
		if (!shouldAskForLocationDetails()) {
			if (targetType === campaignType.ES) {
				showPopupWithDealerDropdown();
			}
			else {
				show_popup1();
			}
		}
		else {
			leadFormTracking.fireCitySelectionFormDisplayEvent();
			locationPopup.showLocationPopUp(true, false, locationCallBack);
		}
	}

  function popup1_validation(val) {
    // val -> 0:No ED, 1:E, 2:D, 3:ED
    // Disable lead submit button
    event.preventDefault();
    document.getElementById("lead_submit_btn").disabled = true;
    document.querySelector("#exp_lead_name_er").classList.add("disp_none");
    document.querySelector("#exp_lead_name_er").classList.remove("disp_block");
    document.querySelector("#exp_lead_name_er .er_msg_ri").innerHTML = "";

    document.querySelector("#exp_lead_mob_er").classList.add("disp_none");
    document.querySelector("#exp_lead_mob_er").classList.remove("disp_block");
    document.querySelector("#exp_lead_mob_er .er_msg_ri").innerHTML = "";

    document.querySelector("#exp_lead_email_er").classList.add("disp_none");
    document.querySelector("#exp_lead_email_er").classList.remove("disp_block");
    document.querySelector("#exp_lead_email_er .er_msg_ri").innerHTML = "";

    document.querySelector("#exp_lead_drop_down_er").classList.add("disp_none");
    document.querySelector("#exp_lead_drop_down_er").classList.remove("disp_block");
    document.querySelector("#exp_lead_drop_down_er .er_msg_ri").innerHTML = "";

    txtName = document.getElementById("name").value;
    txtMobile = document.getElementById("mobile").value;
    var isError = "";
    let label = "Name:" + txtName + "|Number:" + txtMobile;
    if (emailRequired === "True") {
      txtEmail = document.getElementById("email").value;
      if (txtEmail.length < 1) {
        document.querySelector("#exp_lead_email_er").classList.remove("disp_none");
        document.querySelector("#exp_lead_email_er").classList.add("disp_block");
        document.querySelector("#exp_lead_email_er .er_msg_ri").innerHTML = "EmailId is required";
        isError = isError + "EmailId is required\n";
      }
      label = label + "|Email:" + txtEmail;
    }
    if (dealerList !== null && dealerList.length > 1) {
      targetedDealerId = parseInt(document.getElementById("dealer_list").value);
      if (targetedDealerId === -1) {
        document.querySelector("#exp_lead_drop_down_er").classList.remove("disp_none");
        document.querySelector("#exp_lead_drop_down_er").classList.add("disp_block");
        document.querySelector("#exp_lead_drop_down_er .er_msg_ri").innerHTML = "Select atlest one dealer";
        isError = isError + "Select atlest one dealer\n";
      }
      label = label + "|Dealer:" + targetedDealerId;
    }
    var num = document.getElementById("mobile").value.length;

    isError += check_lead_name(1);
    isError += check_lead_mobile(1);
    const isDealerSelectionRequired = document.getElementById("dealer_drop_down_block").style.display === "block";
    if (isDealerSelectionRequired) {
      targetedDealerId = parseInt(document.getElementById("dealer_list").value);
      if (targetedDealerId == -1) {
        document.querySelector("#exp_lead_drop_down_er> .er_msg_ri").innerHTML = "Please select a dealer";
        isError += "Please select a dealer";
      }
    }

    if (isError.length > 1) {
      document.getElementById("popup2").style.display = "none";
      document.getElementById("popup1").style.display = "block";
      document.getElementById("lead_submit_btn").disabled = false;
      leadFormTracking.fireErrorOnLeadSubmitEvent(isError, "Validation", label);
    } else {
      try {
        if (txtName != "") {
          document.querySelector("#name").classList.add("has-content");
        } else {
          document.querySelector("#name").classList.remove("has-content");
        }
        if (txtMobile != "") {
          document.querySelector("#mobile").classList.add("has-content");
        } else {
          document.querySelector("#mobile").classList.remove("has-content");
        }
        submitPopUpAPI();
      } catch (e) { }
      localStorage.setItem("leadform_name", txtName);
      localStorage.setItem("leadform_mobile", txtMobile);
      if (emailRequired === "True") {
        localStorage.setItem("leadform_email", txtEmail);
      }
    }
  }

  function getEventLabel(isCampaignCalled, targetType, makeName, modelName, widgetName) {
    let campaign = isCampaignCalled ? "" : "_NoCampaign";
    if (!isCampaignCalled && targetType >= 0) {
      campaign = "_" + getCampaignTypeString(targetType) + "Campaign";
    }
    if (widgetName == undefined) {
      widgetName = "";
    } else {
      widgetName = "_" + widgetName;
    }
    return "NewCarLead" + campaign + widgetName + "_" + makeName + "_" + modelName;
  }

  function getCityAreaLabelText(currentCityName, currentAreaName, currentCityId) {
    currentAreaName = (currentCityId ? (checkIfAreaRequired(currentCityId) ?
      currentAreaName || "AreaNotSelected" + (areaName ? "_" + areaName : "") : "AreaNotRequired") : "AreaNotRequired");
    let actionText = currentCityName ?
      "_CitySelected_" + currentCityName + (currentAreaName === "" ? "" : "_" + currentAreaName) :
      ("_CityNotSelected" + (cityName ? "_" + cityName : "") + (areaName ? "_" + areaName : ""));
    return actionText;
  }

  function nopan_hidepop() {
    location.reload();
  }
  // Popup 2 Block
  function show_popup2(key) {
    lastkey = key;
    clear_validations();
    leadFormTracking.fireSellCarSlugShownEvent();
    document.getElementById("popup2").style.display = "block";
    try {
      document.querySelector(".mla_pop_name").innerHTML = txtName + "!";
    } catch (e) {}
  }

  function hide_popup2() {
    reloadPageOnCitySelection();
    if (platformId !== Platform.Desktop.toString()) {
      toggle_bg_pop("enable");
    } else {
      document.body.style.overflow = "visible";
      document.getElementById("changecar_pop").style.display = "none";
    }
    document.getElementById("popup1").style.display = "none";
    document.getElementById("popup2").style.display = "none";
  }

  function open_leadForm_validation(id, propertyType) {
    versionId = id;
    const leadInput = document.getElementById(id);
    modelId = leadInput.getAttribute("data-modelid");
    campaignId = leadInput.getAttribute("data-campignid");
    dealerName = leadInput.getAttribute("data-dealerName");
    emailRequired = leadInput.getAttribute("data-emailrequired");
    targetType = parseInt(leadInput.getAttribute("data-targettype"));
    propertyId = propertyType;
    cityName = GetCookieByName("cookie_ct_city");
    areaName = GetCookieByName("cookie_cw_area_name");

    category = leadInput.getAttribute("data-cat");
    let makeName = leadInput.getAttribute("data-make");
    let modelName = leadInput.getAttribute("data-model");

    widgetName = CtaWidgetName[propertyType];
    label = getEventLabel(false, targetType, makeName, modelName, widgetName) +
      getCityAreaLabelText(cityName, areaName, cityId);

    document.querySelector("#exp_lead_name_er").classList.add("disp_none");
    document.querySelector("#exp_lead_name_er").classList.remove("disp_block");
    document.querySelector("#exp_lead_name_er .er_msg_ri").innerHTML = "";

    document.querySelector("#exp_lead_mob_er").classList.add("disp_none");
    document.querySelector("#exp_lead_mob_er").classList.remove("disp_block");
    document.querySelector("#exp_lead_mob_er .er_msg_ri").innerHTML = "";

    txtName = document.getElementById("name1")?.value;
    txtMobile = document.getElementById("mobile1")?.value;
    var isError = "";
    var num = document.getElementById("mobile1")?.value?.length;

    if (txtName.length == 0) {
      document.querySelector("#exp_lead_name_er").classList.remove("disp_none");
      document.querySelector("#exp_lead_name_er").classList.add("disp_block");
      document.querySelector("#exp_lead_name_er .er_msg_ri").innerHTML = "Name should not be empty";
      isError = isError + "Name should not be empty\n";
    } else if (txtName.length < 2) {
      document.querySelector("#exp_lead_name_er").classList.remove("disp_none");
      document.querySelector("#exp_lead_name_er").classList.add("disp_block");
      document.querySelector("#exp_lead_name_er .er_msg_ri").innerHTML = "Name length should be more than 1 character";
      isError = isError + "Name length should be more than 1 character\n";
    } else {
      var nre = /^[A-Za-z\ ]+$/;
      if (!txtName.match(nre)) {
        document.querySelector("#exp_lead_name_er").classList.remove("disp_none");
        document.querySelector("#exp_lead_name_er").classList.add("disp_block");
        document.querySelector("#exp_lead_name_er .er_msg_ri").innerHTML = "Name must contain alphabets only";
        isError = isError + "Name must contain alphabets only\n";
      }
    }
    if (num == 0) {
      document.querySelector("#exp_lead_mob_er").classList.remove("disp_none");
      document.querySelector("#exp_lead_mob_er").classList.add("disp_block");
      document.querySelector("#exp_lead_mob_er .er_msg_ri").innerHTML = "Mobile number should not be empty";
      isError = isError + "Mobile number should not be empty\n";
    } else if (num != 10) {
      document.querySelector("#exp_lead_mob_er").classList.remove("disp_none");
      document.querySelector("#exp_lead_mob_er").classList.add("disp_block");
      document.querySelector("#exp_lead_mob_er .er_msg_ri").innerHTML = "Mobile number should be of 10 digits";
      isError = isError + "Mobile number should be of 10 digits\n";
    } else {
      var re = /^[6789]\d{9}$/;
      if (!txtMobile.match(re)) {
        document.querySelector("#exp_lead_mob_er").classList.remove("disp_none");
        document.querySelector("#exp_lead_mob_er").classList.add("disp_block");
        document.querySelector("#exp_lead_mob_er .er_msg_ri").innerHTML = "Enter valid 10 digit mobile number";
        isError = isError + "Enter valid 10 digit mobile number\n";
      }
    }

    if (isError.length > 1) {
      document.getElementById("popup2").style.display = "none";
      document.getElementById("openPopup1").style.display = "block";
      leadFormTracking.fireErrorOnLeadSubmitEvent(versionId, "Validation", "Name:" + txtName + "|Number:" + txtMobile);
    } else {
      try {
        if (txtName != "") {
          document.querySelector("#name1").classList.add("has-content");
        } else {
          document.querySelector("#name1").classList.remove("has-content");
        }
        if (txtMobile != "") {
          document.querySelector("#mobile1").classList.add("has-content");
        } else {
          document.querySelector("#mobile1").classList.remove("has-content");
        }
        hide_popup1(true);
        leadFormTracking.fireLeadFormDisplayEvent();
        leadFormTracking.fireOpenLeadFormCtaClickEvent();
        submitPopUpAPI();
        document.getElementById("find_dealer_main").style.display = "none";
      } catch (e) {}
    }
  }

  // update data attributes of offers btn in EMI calculator in compare details pages
  function updateEmiOfferAttributes(makeName, modelName, variantId) {
    document.querySelector("#emi-offers-btn").setAttribute("data-make", makeName);
    document.querySelector("#emi-offers-btn").setAttribute("data-model", modelName);
    document.querySelector("#emi-offers-btn").setAttribute("data-variantId", variantId);
    let targetType = document.getElementById(variantId).dataset.targettype;
    let dataLabel = getEventLabel(false, targetType, makeName, modelName, "EMICalculator") +
      getCityAreaLabelText(cityName, areaName, cityId);
    document.querySelector("#emi-offers-btn").setAttribute("data-label", dataLabel);
  }

  // Hide Popup 1 Block
  function hide_popup1(openReco) {
    (!openReco && reloadPageOnCitySelection());
    document.getElementById("popup1").style.display = "none";
    if (platformId !== Platform.Desktop.toString()) {
      toggle_bg_pop("enable");
    } else {
      document.body.style.overflow = "visible";
      document.getElementById("changecar_pop").style.display = "none";
    }
  }

	return {
		click_camp_call: click_camp_call,
		getEventLabel: getEventLabel,
		getCityAreaLabelText,
		nopan_hidepop,
		show_popup2,
		hide_popup2,
		open_leadForm_validation,
		updateEmiOfferAttributes,
    popup1_validation,
    hide_popup1: hide_popup1
	};
})();
