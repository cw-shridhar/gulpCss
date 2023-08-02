var filtersApplied = {};
var isScrollOrNextPageCall = false;
var scrollHandler = (function () {
  function _scrollToTopIconHandler() {
    if (
      $(document).height() - ($(window).scrollTop() + $(window).height()) <
      300
    ) {
      $(
        "#lddet_more,#carloan-btn,.applozic-launcher.mck-button-launcher, #search_section"
      ).addClass("scrollerstopchat");
    } else if ($(window).scrollTop() > 200) {
      $(
        "#lddet_more,#carloan-btn,.applozic-launcher.mck-button-launcher, #search_section"
      ).removeClass("scrollerstopchat");
      $("#tp_btn_new").fadeIn("slow");
    } else {
      $(
        "#lddet_more,#carloan-btn,.applozic-launcher.mck-button-launcher, #search_section"
      ).removeClass("scrollerstopchat");
      $("#tp_btn_new").fadeOut("slow");
    }
    if ($('#tp_btn_new').offset().top + $('#tp_btn_new').height() >= $('.footerblk').offset().top - 20) {
      $('#tp_btn_new').css('position', 'absolute');
    }
    if ($(document).scrollTop() + window.innerHeight < $('.footerblk').offset().top) {
      $('#tp_btn_new').css('position', 'fixed'); // restore when you scroll up
    }
  }

  function _registerClickEvents() {
    $("#tp_btn_new").click(function () {
      /*event.preventDefault();*/
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        "slow"
      );
    });
  }

  function registerEvents() {
    _registerClickEvents();
    window.addEventListener("scroll", function () {
      _scrollToTopIconHandler();
    });
  }

  return {
    registerEvents: registerEvents,
  };
})();

var trackingHandler = (function () {
  function trackFilter(action, label) {
    if (typeof analytics === "undefined") {
      return;
    }
    analytics.trackAction("CWInteractive", "UsedCarSearch", action, label);
  }
  return { trackFilter: trackFilter };
})();

var queryStringUtility = (function () {
  function getQueryParamsObject() {
    var completeQS = window.location.hash.replace("#", "");
    var tempParams = completeQS.substring(0, completeQS.length).split("&");
    var params = [];
    if (tempParams.length > 0) {
      for (var i = 0; i < tempParams.length; i++) {
        params.push({
          field: tempParams[i].split("=")[0],
          value: tempParams[i].split("=")[1],
        });
      }
    }
    return params;
  }
  function getFilterFromQS(name) {
    var hash = window.location.hash.replace("#", "");
    var params = hash.split("&");
    var result = {};
    var propVal, filterName, value;
    var isFound = false;
    var paramsLength = params.length;
    for (var i = 0; i < paramsLength; i++) {
      var propVal = params[i].split("=");
      filterName = propVal[0];
      if (filterName == name) {
        value = propVal[1];
        isFound = true;
        break;
      }
    }
    if (isFound && value.length > 0) {
      if (value.indexOf("+") > 0) return value.replace(/\+/g, " ");
      else return value;
    } else return "";
  }
  function removeFilterFromQS(name, url) {
    if (url.length > 0) {
      var prefix = name + "=";
      var pars = url.split(/[&;]/g);
      for (var i = pars.length; i-- > 0;) {
        if (pars[i].indexOf(prefix) > -1) {
          pars.splice(i, 1);
        }
      }
      url = pars.join("&");
      return url;
    } else return "";
  };
  return {
    getFilterFromQS: getFilterFromQS,
    getQueryParamsObject: getQueryParamsObject,
    removeFilterFromQS: removeFilterFromQS
  };
})();

var filterClickHandler = (function (qs) {
  function _addParameterToString(name, value, completeQS) {
    if (value) {
      if (completeQS.length > 0) completeQS += "&" + name + "=" + value;
      else completeQS = name + "=" + value;
    }
    return completeQS;
  }

  function _setQSParametersInURL() {
    var completeQS = "";
    completeQS = _addParameterToString(
      "car",
      decodeURIComponent(_car),
      completeQS
    );
    completeQS = _addParameterToString(
      "city",
      decodeURIComponent(_city),
      completeQS
    );
    completeQS = _addParameterToString(
      "budget",
      decodeURIComponent(_budget),
      completeQS
    );
    completeQS = _addParameterToString(
      "year",
      decodeURIComponent(_year),
      completeQS
    );
    completeQS = _addParameterToString(
      "kms",
      decodeURIComponent(_kms),
      completeQS
    );
    completeQS = _addParameterToString(
      "trans",
      decodeURIComponent(_trans),
      completeQS
    );
    completeQS = _addParameterToString(
      "owners",
      decodeURIComponent(_owners),
      completeQS
    );
    completeQS = _addParameterToString(
      "bodytype",
      decodeURIComponent(_bodytype),
      completeQS
    );
    completeQS = _addParameterToString(
      "fuel",
      decodeURIComponent(_fuel),
      completeQS
    );
    completeQS = _addParameterToString(
      "filterbyadditional",
      decodeURIComponent(_filterbyadditional),
      completeQS
    );
    completeQS = _addParameterToString(
      "sc",
      decodeURIComponent(_sc),
      completeQS
    );
    completeQS = _addParameterToString(
      "so",
      decodeURIComponent(_so),
      completeQS
    );
    completeQS = _addParameterToString(
      "pn",
      decodeURIComponent(_pageNo.toString()),
      completeQS
    );

    window.location.hash = completeQS;
  }

  function _applyRadioFilter(parentId, name, values) {
    $.each(
      $("#" + parentId).find("input:radio[name=" + name + "]"),
      function (index, element) {
        if ($(element).val() == values) {
          $(element).prop("checked", true);
        }
      }
    );
  }

  function _setCheckboxFilter(parentId, name, values) {
    if (typeof values === "undefined" || values.trim() === "") {
      return;
    }
    var valueList = values.split("+");
    for (var i = 0; i < valueList.length; i++) {
      $.each(
        $("#" + parentId).find("input[name=" + name + "]"),
        function (index, element) {
          if ($(element).val() == valueList[i]) {
            $(element).prop("checked", true);
          }
        }
      );
    }
  }

  function _bindBudgetAppliedFilter(values) {
    var isBudgetPresentInFilter = false;
    $.each(
      $("#selectlist1").find("input:radio[name=budget]"),
      function (index, element) {
        if ($(element).val() == values) {
          // $(element).prop("checked", true);
          isBudgetPresentInFilter = true;
        }
      }
    );
    if (!isBudgetPresentInFilter) {
      var newInputElement =
        '<li style="display:none;"><label><span class="pull-left">' +
        values +
        ' Lakh</span><input type="radio"' +
        'class="pull-right" value="' +
        values +
        '" id="carrate_' +
        values +
        '" name="budget" data-value="' +
        values +
        ' Lakh"></label></li>';
      $("#selectlist1").find("ul").append(newInputElement);
    }
    _applyRadioFilter("selectlist1", "budget", values);
  }

  function _bindFuelFilter(values) {
    _setCheckboxFilter("selectlist2", "fuel", values);
  }

  function _bindKmsFilter(values) {
    _applyRadioFilter("selectlist3", "kms", values);
  }

  function _bindAgeFilter(values) {
    _applyRadioFilter("selectlist4", "year", values);
  }

  function _bindTransmissionFilter(values) {
    _setCheckboxFilter("selectlist5", "trans", values);
  }

  function _bindBodyTypeFilter(values) {
    _setCheckboxFilter("selectlist6", "bodytype", values);
  }

  function _bindOwnerFilter(values) {
    _setCheckboxFilter("selectlist8", "owners", values);
  }

  function _bindCityFilter(values) {
    $.each($("#sortcity").find("option"), function (index, element) {
      if ($(element).attr("filterid") == values) {
        $(element).prop("selected", true);
        var cityName = $(element).text().trim();
        var cityId = $(element).attr("filterid").trim();
        _updateCookie(cityName, cityId);
        $("#selectedCity-client").text(cityName);
      }
    });
  }

  function _updateCookie(cityName, cityId) {
    if (
      typeof cityName === "undefined" ||
      cityName.trim() === "" ||
      typeof cityId == "undefined" ||
      cityId === ""
    ) {
      return;
    }
    var currentTime = new Date();
    currentTime.setDate(currentTime.getDate() + 30);
    var currentDomain = window.location.hostname;
    if (currentDomain !== "localhost") {
      currentDomain.replace("www.", "");
      currentDomain = "." + currentDomain;
    }
    document.cookie =
      "cd-city-id = " +
      cityId +
      ";expires=" +
      currentTime +
      ";path=/;domain=" +
      currentDomain;
    document.cookie =
      "cd-city-ct = " +
      cityName +
      ";expires=" +
      currentTime +
      ";path=/;domain=" +
      currentDomain;
  }

  function _bindMakeRootFilter(values) {
    values = values || "";
    var makeList = _jsonData["Makes"];
    _bindMakeRootCounts(makeList);
  }

  function _bindMakeRootCounts(json) {
    $("#mklist").hide();
    $("#other-mklist").hide();
    $("li[carfilterId] input[type=checkbox]").prop("checked", false);
    $("li[data-count].make-list").removeClass("open");
    $("li[data-count].make-list").attr("data-count", 0);
    $("li[data-count='0'].make-list").hide();
    $("ul.rootUl").remove();
    $("#hmbrands").hide();
    $("#smbrands").show();

    var liHtml = "";
    var rootHtml = "";
    for (makeFilter in json) {
      var makeId = json[makeFilter]["MakeId"];
      var makeNode = $('li[carfilterId="' + makeId + '"].make-list');
      makeNode.attr("data-count", json[makeFilter]["MakeCount"]);
      rootHtml = "";
      for (childFilter in json[makeFilter]["RootList"]) {
        var id = json[makeFilter]["RootList"][childFilter]["RootId"];
        var rootCount = json[makeFilter]["RootList"][childFilter]["RootCount"];
        rootHtml +=
          "<li class='model-list' carfilterId='" +
          id +
          "'><label>" +
          json[makeFilter]["RootList"][childFilter]["RootName"] +
          " (<span class='count-box'>" +
          rootCount +
          "</span>)" +
          '<input class="pull-right mmdl" id="' +
          id +
          '" type="checkbox" name="models" makeId="' +
          makeId +
          '"  value="' +
          makeId +
          "." +
          id +
          '" data-value="' +
          json[makeFilter]["RootList"][childFilter]["RootName"] +
          '"></label></li>';
      }
      if (rootHtml != "") {
        makeNode.addClass("open");
        makeNode.find("ul.rootUl").remove();
        makeNode
          .find("div.spclass")
          .after("<ul class='rootUl'>" + rootHtml + "</ul>");
        makeNode.find("li.model-list").each(function () {
          var count = parseInt($(this).find("span.count-box").text());
          if (count == 0) $(this).hide();
        });
      }
      rootHtml = "";
      if (parseInt($(makeNode).attr("data-count")) > 0) {
        makeNode.show();
        if (
          makeNode.parent().attr("id") == "other-mklist" &&
          makeNode.parent().css("display") == "none" &&
          makeNode.find("ul.rootUl").length > 0
        ) {
          makeNode.parent().show();
        }
      }
    }
    $("#mklist").show();

    var count = $("#mklist>li").length - $("#mklist>li[data-count=0]").length;
    $("#countmakes").text("Make (" + count + ")");

    if ($("#other-mklist").css("display") !== "none") {
      count +=
        $("#other-mklist>li").length -
        $("#other-mklist>li[data-count=0]").length;
      $("#hmbrands").show();
      $("#smbrands").hide();
    }
    $("#countmakes").text("Make (" + count + ")");
    $("#mklist input").unbind("change");
    $("#other-mklist input").unbind("change");
    $("#mklist input").on("change", function () {
      getfiltersSelected($(this).attr("name"), filtersApplied, "desktop");
      trackMakeRootSelection($(this));
      var queryParam = getAppliedFiltersQueryParams();
      console.log("queryPara-2**", queryParam);
      _hitAPI(queryParam);
    });
    $("#other-mklist input").on("change", function () {
      getfiltersSelected($(this).attr("name"), filtersApplied, "desktop");
      trackMakeRootSelection($(this));
      var queryParam = getAppliedFiltersQueryParams();
      console.log("queryPara-3**", queryParam);
      _hitAPI(queryParam);
    });
    showSelectedMakes();
  }

  function showSelectedMakes() {
    var values = queryStringUtility
      .getFilterFromQS("car")
      .replace(/ /g, "+")
      .split("+");
    var makeList = $("ul#mklist");
    var otherMakeList = $("ul#other-mklist");
    var makeId = "";
    for (var i = 0; i < values.length; i++) {
      if (values[i].indexOf(".") > 0) {
        makeId = values[i].split(".")[0];
        makeList
          .find('li[carfilterId="' + makeId + '"]')
          .find('li[carfilterId="' + values[i].split(".")[1] + '"]')
          .find("input[name=models]")
          .prop("checked", true);
        otherMakeList
          .find('li[carfilterId="' + makeId + '"]')
          .find('li[carfilterId="' + values[i].split(".")[1] + '"]')
          .find("input[name=models]")
          .prop("checked", true);
      } else {
        makeId = values[i];
      }
      makeList
        .find('li[carfilterId="' + makeId + '"]')
        .find("div.spclass input[name=makes]")
        .prop("checked", true);
      otherMakeList
        .find('li[carfilterId="' + makeId + '"]')
        .find("div.spclass input[name=makes]")
        .prop("checked", true);
    }
  }

  function _bindAdditionalAppliedFilter(values) {
    // if filter by addition not present select all cars option
    // if present select the applied option
    var queryParams = queryStringUtility.getQueryParamsObject();
    resetAdditionalAppliedFilters();
    var filterbyadditional = "";
    for (var i = 0; i < queryParams.length; i++) {
      if (queryParams[i].field == "filterbyadditional") {
        filterbyadditional = queryParams[i].value;
        break;
      }
    }
    if (!filterbyadditional) {
      return;
    } else {
      $("#all_cars").prop("checked", false);
      var filterbyadditionalList = filterbyadditional.split("+");
      for (var i = 0; i < filterbyadditionalList.length; i++) {
        switch (filterbyadditionalList[i]) {
          case "1": {
            $("#cert_cars").prop("checked", true);
            break;
          }
          case "2": {
            $("#carpic_Pictures").prop("checked", true);
            break;
          }
          case "4": {
            $("#AbsureCars").prop("checked", true);
            break;
          }
        }
      }
    }
  }

  function _bindSortFilter(queryParams) {
    var scValue = "";
    var soValue = "";
    resetSortFilter();
    $("#sort").find("option").prop("selected", false);

    for (var i = 0; i < queryParams.length; i++) {
      if (queryParams[i].field == "sc") {
        scValue = queryParams[i].value;
        continue;
      }
      if (queryParams[i].field == "so") {
        soValue = queryParams[i].value;
        continue;
      }
    }

    if (soValue == "" || scValue == "") {
      scValue = "-1";
      soValue = "-1";
    }
    $.each($("#sort").find("option"), function () {
      if ($(this).attr("sc") == scValue && $(this).attr("so") == soValue) {
        $(this).prop("selected", true);
      }
    });
  }

  function _bindFiterOptionsFromQueryString() {
    var queryParams = queryStringUtility.getQueryParamsObject();
    for (var i = 0; i < queryParams.length; i++) {
      switch (queryParams[i].field) {
        case "budget": {
          _bindBudgetAppliedFilter(queryParams[i].value);
          break;
        }
        case "fuel": {
          _bindFuelFilter(queryParams[i].value);
          break;
        }
        case "kms": {
          _bindKmsFilter(queryParams[i].value);
          break;
        }
        case "year": {
          _bindAgeFilter(queryParams[i].value);
          break;
        }
        case "trans": {
          _bindTransmissionFilter(queryParams[i].value);
          break;
        }
        case "bodytype": {
          _bindBodyTypeFilter(queryParams[i].value);
          break;
        }
        case "owners": {
          _bindOwnerFilter(queryParams[i].value);
          break;
        }
        case "city": {
          _bindCityFilter(queryParams[i].value);
          break;
        }
        case "car": {
          _bindMakeRootFilter(queryParams[i].value);
          break;
        }
      }
    }
    _bindAdditionalAppliedFilter(queryParams);
    _bindSortFilter(queryParams);
  }

  function _absureBannerEvents() {
    $(document).on(
      "click",
      ".jcarousel-control-right,.jcarousel-control-left",
      function () {
        $(".jcarousel-control-left").toggleClass("hide");
        $(".jcarousel-control-right").toggleClass("hide");
      }
    );
    $(document).on(
      "click",
      ".absure_more_cities",
      function () {
        $(".absure-banner-city-list li").removeClass("hide");
        $(".absure_more_cities").addClass("hide");
      }
    )
  }

  function _onLoad() {
    //get the queryParams attached in hash
    if (window.location.hash.replace("#", "").length === 0) {
      history.replaceState("SEARCH_PAGE", "SEARCH_PAGE", window.location.href);
      _setQSParametersInURL();
      //bind the filters
      _bindFiterOptionsFromQueryString();
      _bindMakeRootCounts(_jsonData.Makes);
      setPaginationBlock(_pageNo);
      _addAppliedFiltersQuickSlugs();
      if (typeof bind_social_share_icon !== "undefined") {
        bind_social_share_icon();
      }
    } else {
      var searchUrl = window.location.hash.replace("#", "");
      var cityId = queryStringUtility.getFilterFromQS("city");
      if (cityId === "3000" || cityId === "3001") {
        searchUrl = queryStringUtility.removeFilterFromQS("city", searchUrl)
        if (_city > 0) {
          searchUrl = _addParameterToString("city", _city, searchUrl)
        }
        window.location.hash = searchUrl
      }
      _bindAbsureBanner(searchUrl);
      _hitAPI(searchUrl, _pageNo);
    }
    _absureBannerEvents();
  }

  /** reset filter logic */

  function _resetRadioFilter(parentId, name) {
    $("#" + parentId)
      .find("input:radio[name=" + name + "]")
      .prop("checked", false);
  }

  function _resetCheckboxFilter(parentId, name, value) {
    if (typeof value === "undefined" || value.trim() === "") {
      $("#" + parentId)
        .find("input[name=" + name + "]")
        .prop("checked", false);
    } else {
      $.each(
        $("#" + parentId).find("input[name=" + name + "]"),
        function (index, element) {
          if (element.val() === value) {
            element.prop("checked", false);
          }
        }
      );
    }
  }

  function resetSortFilter() {
    $("#sort").find("option").prop("selected", false);
  }

  function resetAppliedBudgetFilter() {
    _resetRadioFilter("selectlist1", "budget");
  }

  function resetAppliedFuelFilter(value) {
    value = value || "";
    _resetCheckboxFilter("selectlist2", "fuel", value);
  }

  function resetKmsFilter() {
    _resetRadioFilter("selectlist3", "kms");
  }

  function resetAppliedAgeFilter() {
    _resetRadioFilter("selectlist4", "year");
  }

  function resetTransmissionFilter(value) {
    value = value || "";
    _resetCheckboxFilter("selectlist5", "trans", value);
  }

  function resetBodyTypeFilter(value) {
    value = value || "";
    _resetCheckboxFilter("selectlist6", "bodytype", value);
  }

  function resetOwnersFilter(value) {
    value = value || "";
    _resetCheckboxFilter("selectlist8", "owners", value);
  }

  function resetAdditionalAppliedFilters() {
    $("#cert_cars").prop("checked", false);
    $("#all_cars").prop("checked", true);
    $("#carpic_all_cars").prop("checked", true);
    $("#carpic_Pictures").prop("checked", false);
  }

  function resetMakeRootFilter() {
    $("#mklist").find("li input[name='models']").prop("checked", false);
    $("#other-mklist").find("li input[name='models']").prop("checked", false);
    $("#mklist").find("li input[name='makes']").prop("checked", false);
    $("#other-mklist").find("li input[name='makes']").prop("checked", false);
  }

  function _setTotalStockCount() {
    var count = _jsonData.stockcount.TotalStockCount || 0;
    if (count > 0) {
      $("#disp_status").text("" + count + " Second Hand Cars");
    } else {
      $("#disp_status").text("No results found!");
    }
  }
  function getValueFromQS(name, qs) {
    var params = qs.split("&");
    var propVal, filterName, value;
    var isFound = false;
    var paramsLength = params.length;
    for (var i = 0; i < paramsLength; i++) {
      var propVal = params[i].split("=");
      filterName = propVal[0];
      if (filterName.toLowerCase() == name.toLowerCase()) {
        value = propVal[1];
        isFound = true;
        break;
      }
    }
    if (isFound && value !== undefined && value.length > 0) {
      if (value.indexOf("+") > 0) {
        return value.replace(/\+/g, " ");
      } else {
        return value;
      }
    } else {
      return "";
    }
  }
  function resetAllAppliedFilters() {
    resetAppliedBudgetFilter();
    resetAppliedFuelFilter();
    resetKmsFilter();
    resetAppliedAgeFilter();
    resetTransmissionFilter();
    resetBodyTypeFilter();
    resetOwnersFilter();
    resetAdditionalAppliedFilters();
    resetSortFilter();
    resetMakeRootFilter();
    _hitAPI(getAppliedFiltersQueryParams());
  }

  function updateDealerCookies(shouldNotUpdateDealerCookies = false) {
    if (shouldNotUpdateDealerCookies) {
      // not updating dealer list in case of scroll or next page call so that it doesn't interfere with stocks bucket
      isScrollOrNextPageCall = false;
      return;
    }
    updateDeferredDealerList();
  }

  /**api call */
  function _hitAPI(searchUrl, pageNo = 1) {
    var responseObject = {
      response: "",
      countObj: {},
      faqs: {},
      nearByCities: {},
      seoDescription: {},
    };
    $("html, body").animate({ scrollTop: 0 }, "fast");
    CollapseSearchPageDescription();
    var cityId = getValueFromQS("city", searchUrl);
    updateDealerCookies(isScrollOrNextPageCall);
    const queryObject = queryStringToJSON(searchUrl);
    queryObject.deferredDealers = getDeferredDealerIds();
    queryObject.pn = pageNo;
    if ( pageNo > 1 ) {
      var excludedStocks = document.getElementById("excluded-stocks");
      queryObject.excludeStocks = excludedStocks.innerHTML.trim().replaceAll("+", " ");
    }
    queryObject.segmentIds = $("#segment-ids").html();
    $.when(
      $.ajax({
        context: this,
        type: "Post",
        headers: { sourceId: "302" },
        url: "/buy-used-cars/api/stocks/filters/",
        contentType: "application/json;charset=utf-8",
        dataType: "html",
        data: JSON.stringify(queryObject),
        beforeSend: function () {
          _jsonData = "";
          $("#loading").show();
        },
        complete: function () {
          $("#loading").hide();
        },
        success: function (response) {
          responseObject.response = response;
        },
      }),
      $.ajax({
        context: this,
        type: "GET",
        headers: { sourceId: "302" },
        url: "/buy-used-cars/api/used/faqs/?" + searchUrl,
        contentType: "application/html;charset=utf-8",
        dataType: "html",
        beforeSend: function () {
          $("#loading").show();
        },
        complete: function () {
          $("#loading").hide();
        },
        success: function (response) {
          responseObject.faqs = response;
        },
      }),
      $.ajax({
        context: this,
        type: "GET",
        headers: { sourceId: "302" },
        url: "/buy-used-cars/api/filters/?" + searchUrl,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
          responseObject.countObj = response;
          if (response.stockcount.TotalStockCount <= 10) {
            $.ajax({
              context: this,
              type: "GET",
              headers: { sourceId: "302" },
              url: "/buy-used-cars/api/popular-nearby-cities/?cityId=" + cityId,
              contentType: "application/html;charset=utf-8",
              dataType: "html",
              beforeSend: function () {
                _jsonData = "";
                $("#loading").show();
              },
              complete: function () {
                $("#loading").hide();
              },
              success: function (response) {
                responseObject.nearByCities = response;
              },
            });
          }
        },
      }),
      $.ajax({
        context: this,
        type: "GET",
        headers: { ServerDomain: "CarWale" },
        url: "/api/v1/used-description/?" + searchUrl,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        beforeSend: function () {
          $("#loading").show();
        },
        complete: function () {
          $("#loading").hide();
        },
        success: function (response) {
          responseObject.seoDescription = response;
        },
      })
    ).then(function () {
      _bindSeoDescription(responseObject.seoDescription, "desktop");
      //move buyer form to actual location
      $("#PL-lead_template").html($("#pl-similar_cars"));
      $("#searchFilters").html(responseObject.response);
      _jsonData = responseObject.countObj;
      if (typeof pageNo !== "undefined" && pageNo !== "") {
        _pageNo = pageNo;
      } else {
        _pageNo = 1;
      }
      //bind the filters
      _bindFiterOptionsFromQueryString();
      _bindMakeRootCounts(_jsonData.Makes);
      setPaginationBlock(_pageNo);
      _setTotalStockCount();
      if ($.isEmptyObject(filtersApplied)) {
        getFiltersFromQueryParams(searchUrl, filtersApplied, "desktop");
      }
      var headerDesktop = makeTitleClient(filtersApplied);
      $("h1").text(headerDesktop);
      $("#certifiedTitleClient").html("");
      if ($("#certifiedTitle")) {
        $("#certifiedTitle").html("");
      }
      if (filtersApplied["certification"]) {
        $("#certifiedTitleClient").html(
          "<strong>(Out of " +
          _jsonData.stockcount.TotalStockCount +
          " Used Cars In " +
          (filtersApplied["fltr_city_name"]
            ? filtersApplied["fltr_city_name"]
            : "India") +
          ")</strong>"
        );
      }
      _bindfaqs(responseObject.faqs);
      _bindNearByCities(responseObject.nearByCities);
      if (typeof bind_social_share_icon !== "undefined") {
        bind_social_share_icon();
      }
      if (
        typeof buyerFormV2 !== "undefined" &&
        typeof buyerFormV2Desktop !== "undefined" &&
        buyerFormV2.isOneClickViewTextSet()
      ) {
        buyerFormV2.unsetOneCLickViewText();
        buyerFormV2Desktop.setOneClickViewDetails();
      }
      _addAppliedFiltersQuickSlugs();
    });
  }

  function bindAbsureOffers(absureOffers) {
    var absureBannerBinding = [];
    if (
      !absureOffers ||
      !isArray(absureOffers) ||
      absureOffers.length < 1
    ) {
      return;
    }
    for (var i = 0; i < absureOffers.length; i++) {
      var currOffer = absureOffers[i];
      var currOfferLi = '<li class="absure-feature-list__item">'
      currOfferLi += '<div class="absure-feature-list__item-logo-offers">'
      currOfferLi += '<div>'
      currOfferLi += '<img class="absure-feature-item-container" src=' + currOffer.offerLogo + ' title="AbSure Offer Logo"'
      currOfferLi += 'alt=' + currOffer.offerText + ' > </div>'
      currOfferLi += '<span class="absure-feature-text"> ' + currOffer.offerText + ' </span> </div>'
      currOfferLi += '<div class="absure-feature-description"> ' + currOffer.offerDescription + ' </div> </li>'
      absureBannerBinding.push(currOfferLi);
    }
    $(".absure-banner-client-section .absure-feature-list").append(
      absureBannerBinding.join("")
    );
  }

  function bindAbsureCityList(absureCitySummary) {
    if (
      !absureCitySummary ||
      !isArray(absureCitySummary) ||
      absureCitySummary.length < 1
    ) {
      return;
    }
    absureBannerCitiesBinding = [];
    for (var i = 0; i < absureCitySummary.length; i++) {
      var currCityLi = '<li class=' + (i >= 2 ? "hide" : "") + '>'
      currCityLi += '<a href="' + absureCitySummary[i].absureSearchLink + '" class="absure-city__link"'
      currCityLi += 'title="abSure cars in' + absureCitySummary[i].cityName + '" data-role="click-tracking"'
      currCityLi += 'data-event="CWInteractive" data-label="' + absureCitySummary[i].cityName + '|platformid=1"'
      currCityLi += 'data-cat="UsedCarSearch" data-action="AbSureCityClicked" data-cwtclbl="' + absureCitySummary[i].CityName + '"'
      currCityLi += 'data-cwtccat="UsedCarSearch" data-cwtcact="AbSureCityClicked">'
      currCityLi += '<div class="absure-city-list__item"> '
      currCityLi += absureCitySummary[i].cityName
      currCityLi += '</div> </a> </li>'
      absureBannerCitiesBinding.push(currCityLi);
    }
    if (absureCitySummary.length > 2) {
      var numberMoreCity = absureCitySummary.length - 2;
      var cityText = numberMoreCity === 1 ? "City" : "Cities";
      var numberMoreCityText = '+' + numberMoreCity + ' More ' + cityText;
      var moreCityLi = '<li class="absure_more_cities">' + numberMoreCityText + '</li>'
      absureBannerCitiesBinding.push(moreCityLi)
    }
    var citiesHtml = absureBannerCitiesBinding.join("");
    $(".absure-banner-cta").append(
      '<ul class="absure-banner-city-list">' + citiesHtml + "</ul>"
    );
  }

  function bindAbsureAllViewLink(absureBannerCtaLink, absureBannerCtaText) {
    if (!absureBannerCtaLink || !absureBannerCtaText) {
      return;
    }
    $(".absure-banner-cta").append(
      '<a href="' +
      absureBannerCtaLink +
      '" class="absure-view-all__link"' +
      'title="View all abSure cars"' +
      'data-role="click-tracking"' +
      'data-event="CWInteractive"' +
      'data-cat="UsedCarSearch"' +
      'data-action="ViewAllAbSureCarClicked"' +
      'data-testing-id="view-all-absure-link">' +
      absureBannerCtaText +
      "</a>"
    );
  }

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  }


  function _getUpdatedQueryString(qs, newQs) {
    if (typeof newQs !== "undefined" && newQs.trim() !== "") {
      if (typeof qs !== "undefined" && qs.trim() !== "") {
        return qs + "&" + newQs;
      }
      return newQs;
    }
    return "";
  }

  function _getMultipleAppliedCheckBoxFilterResponse(
    parentId,
    name,
    fieldName
  ) {
    var ret = "";
    $.each(
      $("#" + parentId).find("input[name=" + name + "]:checked"),
      function (index, value) {
        ret = $.trim(ret + $(value).attr(fieldName)) + "+";
      }
    );
    return ret.substring(0, ret.length - 1);
  }

  function getAppliedFiltersQueryParams() {
    if (typeof $ === "undefined") {
      return "";
    }
    var qs = "";
    qs = _getAdditionalAppliedFilters(qs);
    qs = _getAppliedSortFilter(qs);
    qs = _getAppliedBudgetFilter(qs);
    qs = _getAppliedFuelFilter(qs);
    qs = _getAppliedKmsDrivenFilter(qs);
    qs = _getAppliedAgeFilters(qs);
    qs = _getAppliedTransmissionFilters(qs);
    qs = _getAppliedBodyTypeFilters(qs);
    qs = _getAppliedOwnersFilters(qs);
    qs = _getAppliedCityFilters(qs);
    qs = _getAppliedMakeRootFilters(qs);
    window.location.hash = "#" + qs; //temporary to check if it is working properly or not
    return qs;
  }

  function _getAppliedMakeRootFilters(qs) {
    var modelDict = {};
    //get models selected
    $.each($("li input[name='models']:checked"), function () {
      modelDict[$(this).attr("makeId")] =
        (modelDict[$(this).attr("makeId")] || "") + "+" + $(this).val();
    });

    var carqs = "";
    var qsList = [];
    $.each($("li input[name='makes']:checked"), function () {
      var makeId = $(this).val();
      if (
        typeof modelDict[makeId] !== "undefined" &&
        modelDict[makeId] !== ""
      ) {
        var rootIds = modelDict[makeId].substring(1, modelDict[makeId].length);
        qsList.push(rootIds);
      } else {
        qsList.push(makeId);
      }
    });
    if (qsList.length == 0) {
      return qs;
    }
    carqs = qsList.join("+");
    console.log(carqs);
    return _getUpdatedQueryString(qs, "car=" + carqs);
  }

  function _getAppliedCityFilters(qs) {
    var id = $("#sortcity").find("option[name=city]:selected").attr("filterid");
    if (typeof id == "undefined" || id == "-1") {
      return qs;
    }
    return _getUpdatedQueryString(qs, "city=" + id);
  }

  function _getAdditionalAppliedFilters(qs) {
    var filterbyadditional = _getMultipleAppliedCheckBoxFilterResponse(
      "filterbyadditional",
      "filterbyadditional",
      "value"
    );

    var filterbyadditional_2 = $("input:radio[name=car_pic]:checked").val();
    if (filterbyadditional_2 !== "" && filterbyadditional !== "") {
      filterbyadditional += "+" + filterbyadditional_2;
    } else if (filterbyadditional_2 !== "" && filterbyadditional == "") {
      filterbyadditional += filterbyadditional_2;
    }
    if (
      typeof filterbyadditional === "undefined" ||
      filterbyadditional.trim() === ""
    ) {
      return qs;
    }
    return _getUpdatedQueryString(
      qs,
      "filterbyadditional=" + filterbyadditional
    );
  }

  function _getAppliedSortFilter(qs) {
    var so = $("#sort").find("option:selected").attr("so");
    var sc = $("#sort").find("option:selected").attr("sc");
    if (typeof so === "undefined") {
      so = "-1";
    }
    if (typeof sc === "undefined") {
      so = "-1";
    }
    var sortQs = "so=" + so + "&sc=" + sc;
    return _getUpdatedQueryString(qs, sortQs);
  }

  function _getAppliedBudgetFilter(qs) {
    var budget = $("#selectlist1")
      .find("input:radio[name=budget]:checked")
      .val();
    if (typeof budget === "undefined" || budget.trim() === "") {
      return qs;
    }
    return _getUpdatedQueryString(qs, "budget=" + budget);
  }

  function _getAppliedFuelFilter(qs) {
    var fuel = _getMultipleAppliedCheckBoxFilterResponse(
      "selectlist2",
      "fuel",
      "value"
    );
    if (typeof fuel === "undefined" || fuel.trim() === "") {
      return qs;
    }
    return _getUpdatedQueryString(qs, "fuel=" + fuel);
  }

  function _getAppliedKmsDrivenFilter(qs) {
    var kmsdriven = $("#selectlist3")
      .find("input:radio[name=kms]:checked")
      .val();
    if (typeof kmsdriven === "undefined" || kmsdriven.trim() === "") {
      return qs;
    }
    return _getUpdatedQueryString(qs, "kms=" + kmsdriven);
  }

  function _getAppliedAgeFilters(qs) {
    var years = $("#selectlist4").find("input:radio[name=year]:checked").val();
    if (typeof years === "undefined" || years.trim() === "") {
      return qs;
    }
    return _getUpdatedQueryString(qs, "year=" + years);
  }

  function _getAppliedTransmissionFilters(qs) {
    var trans = _getMultipleAppliedCheckBoxFilterResponse(
      "selectlist5",
      "trans",
      "value"
    );
    if (typeof trans === "undefined" || trans.trim() === "") {
      return qs;
    }
    return _getUpdatedQueryString(qs, "trans=" + trans);
  }

  function _getAppliedBodyTypeFilters(qs) {
    var bodytype = _getMultipleAppliedCheckBoxFilterResponse(
      "selectlist6",
      "bodytype",
      "value"
    );
    if (typeof bodytype === "undefined" || bodytype.trim() === "") {
      return qs;
    }
    return _getUpdatedQueryString(qs, "bodytype=" + bodytype);
  }

  function _getAppliedOwnersFilters(qs) {
    var trans = _getMultipleAppliedCheckBoxFilterResponse(
      "selectlist8",
      "owners",
      "value"
    );
    if (typeof trans === "undefined" || trans.trim() === "") {
      return qs;
    }
    return _getUpdatedQueryString(qs, "owners=" + trans);
  }

  function _resetFilterEvent() {
    $(document).on("click", "#reset_filter", function () {
      resetAllAppliedFilters();
    });
  }

  function _filterHoverEvents() {
    $(".filtrdropdown").hover(
      function (event) {
        $(this).find("div>span").removeClass("dirArrowDown");
        $(this).find("div>span").addClass("dirArrowUp");
        $(this).find("div>div").show();
      },
      function (event) {
        $(this).find("div>span").removeClass("dirArrowUp");
        $(this).find("div>span").addClass("dirArrowDown");
        $(this).find("div>div").hide();
      }
    );
  }

  function _filterClickEvents() {
    //budget click
    $("#selectlist1")
      .find("input:radio[name=budget]")
      .on("change", function () {
        getfiltersSelected($(this).attr("name"), filtersApplied, "desktop");
        trackingHandler.trackFilter("SelectedPrice", $(this).val());
        _hitAPI(getAppliedFiltersQueryParams());
      });
    //fuel click
    $("#selectlist2")
      .find("input[name=fuel]")
      .on("change", function () {
        getfiltersSelected($(this).attr("name"), filtersApplied, "desktop");
        if ($(this).prop("checked") === true) {
          trackingHandler.trackFilter(
            "SelectedFuel",
            $(this).attr("data-value")
          );
        }
        _hitAPI(getAppliedFiltersQueryParams());
      });
    //kms click
    $("#selectlist3")
      .find("input:radio[name=kms]")
      .on("change", function () {
        trackingHandler.trackFilter("SelectedKM", $(this).val());
        _hitAPI(getAppliedFiltersQueryParams());
      });
    //car age click
    $("#selectlist4")
      .find("input:radio[name=year]")
      .on("change", function () {
        trackingHandler.trackFilter("SelectedAge", $(this).val());
        _hitAPI(getAppliedFiltersQueryParams());
      });
    //transmission click
    $("#selectlist5")
      .find("input[name=trans]")
      .on("change", function () {
        getfiltersSelected($(this).attr("name"), filtersApplied, "desktop");
        if ($(this).prop("checked") === true) {
          trackingHandler.trackFilter(
            "SelectedTransmission",
            $(this).attr("data-value")
          );
        }
        _hitAPI(getAppliedFiltersQueryParams());
      });
    //body type click
    $("#selectlist6")
      .find("input[name=bodytype]")
      .on("change", function () {
        getfiltersSelected($(this).attr("name"), filtersApplied, "desktop");
        if ($(this).prop("checked") === true) {
          trackingHandler.trackFilter(
            "SelectedBodyType",
            $(this).attr("data-value")
          );
        }
        _hitAPI(getAppliedFiltersQueryParams());
      });
    //owners click
    $("#selectlist8")
      .find("input[name=owners]")
      .on("change", function () {
        if ($(this).prop("checked") === true) {
          trackingHandler.trackFilter(
            "SelectedOwner",
            $(this).attr("data-value")
          );
        }
        _hitAPI(getAppliedFiltersQueryParams());
      });
    //sort click
    $("#best_match").on("change", function () {
      _hitAPI(getAppliedFiltersQueryParams());
    });

    //additional filter click
    _additionalFilterClickEvents();

    //city change click
    $("#sortcity").on("change", function () {
      getfiltersSelected($(this).attr("name"), filtersApplied, "desktop");
      var qs = getAppliedFiltersQueryParams();
      _bindAbsureBanner(qs);
      _hitAPI(qs);
    });
  }

  function _additionalFilterClickEvents() {
    $("#filterbyadditional,#pic_filter_html")
      .find("input")
      .on("change", function () {
        if ($(this).attr("id") === "all_cars") {
          $("#cert_cars").prop("checked", false);
          $("#AbsureCars").prop("checked", false);
        } else {
          $("#all_cars").prop("checked", false);
        }
        var queryParams = getAppliedFiltersQueryParams();
        getfiltersSelected("certification", filtersApplied, "desktop");
        _bindAbsureBanner(queryParams);
        _hitAPI(queryParams);
      });
  }

  function _bindAbsureBanner(qs) {
    var cityId = queryStringUtility.getFilterFromQS("city") || "-1";
    $.ajax({
      context: this,
      type: "GET",
      url: "/api/absure4s/banner/?" + "city=" + cityId,
      dataType: "json",
      headers: { ServerDomain: "CarWale" },
      success: function (response) {
        $(".absure-banner-section").addClass("hide");
        $(".absure-banner-client-section .absure-feature-list").empty();
        $(".absure-banner-client-section .absure-banner-cta").empty();
        if (
          !response ||
          !response.absure4sOffers ||
          response.absure4sOffers.length < 1
        ) {
          return;
        } else {
          $(".absure-banner-client-section .absure-banner-logo-container").empty().append(
            '<img class="absure-banner-logo" src=' + response.absureLogo + ' alt="Absure Logo">'
          );
          $(".absure-banner-client-section .absure-subtext").text(
            response.absureBannerSubText
          );
          _absureApiSuccessCall(response, qs);
        }
      },
    });
  }

  function _absureApiSuccessCall(response, qs) {
    bindAbsureOffers(response.absure4sOffers);
    var additionalFilters = getValueFromQS("filterbyadditional", qs);
    // this check is to ensure that when only absure stocks are shown
    // the ctas are not shown in the banner
    if (additionalFilters !== "4") {
      if (response.absureCitySummary.length > 1) {
        bindAbsureCityList(response.absureCitySummary);
      } else if ((additionalFilters.includes("3") && additionalFilters.includes("4")) || (!additionalFilters.includes("4"))) {
        bindAbsureAllViewLink(
          response.absureBannerCtaLink,
          response.absureBannerCtaText
        );
      }
    }
    $(".absure-banner-client-section .jcarousel-control-left").addClass("hide");
    $(".absure-banner-client-section .jcarousel-control-right").removeClass("hide");
    $(".absure-banner-client-section").removeClass("hide");
    $(".absure-banner-client-section .jcarousel").jcarousel({
      vertical: false,
    });
  }
  function _onPopstate() {
    switch (history.state) {
      case "SEARCH_PAGE": {
        _hitAPI(window.location.hash.replace("#", ""));
        break;
      }
    }
  }

  function _show_hide_refine() {
    if ($("#other-mklist").css("display") !== "none") {
      $("#other-mklist").slideToggle("slow");
      $("#hmbrands").hide();
      $("#smbrands").show();
    }
    $("#mklist").slideToggle("slow");
    $("#countmakes").toggleClass("dirArrowDown dirArrowUp");
  }

  function handlePaginationClick(event) {
    event.preventDefault();
    var pgNo = $(this).attr("data-pn");
    var searchQuery = getAppliedFiltersQueryParams();
    if (searchQuery !== "") {
      searchQuery += "&pn=" + pgNo;
    } else {
      searchQuery = "pn=" + pgNo;
    }
    var lcr = (pgNo - 1) * 24; // 24 is because each page has 24 stocks non premium.
    searchQuery += "&lcr=" + lcr;
    isScrollOrNextPageCall = true;
    _hitAPI(searchQuery, pgNo);
    $("html, body").animate({ scrollTop: 0 }, "slow");
  }

  function setPaginationBlock(page) {
    // Start of Pagination block
    var currentPage = Number(page);
    var totalPage = Math.ceil(_jsonData.stockcount.TotalStockCount / 24);
    var hostPathParts = window.location.pathname.split("/");
    if (
      hostPathParts[hostPathParts.length - 1].match(/p-*/g) ||
      hostPathParts[hostPathParts.length - 1] === ""
    ) {
      hostPathParts.pop(-1);
    }

    var hostpath = hostPathParts.join("/");
    $(".pagination ul li").remove();
    // Consider max 6 pages in search pagination
    if (totalPage > 1 && currentPage <= totalPage) {
      $("#pagination_block").show();
      if (currentPage > 0) {
        $(".faq-section-wrapper").removeClass("hide");
        if (currentPage >= 2) {
          $(".seo-description").addClass("hide");
          $(".faq-section-wrapper").addClass("hide");
          if (currentPage == 2) {
            $(".pagination ul").append(
              "<li class=\"prev\"> <a href=\"" +
              hostpath +
              "/p-" +
              (currentPage - 1) + "/" +
              "\" data-pn=" +
              (currentPage - 1) +
              "><span>&#10229;</span>&nbsp;Previous</a></li>"
            );
          } else {
            $(".pagination ul").append(
              "<li class=\"prev\"> <a href=\"" +
              hostpath +
              "/p-" +
              (currentPage - 1) + "/" +
              "\" data-pn=" +
              (currentPage - 1) +
              " ><span>&#10229;</span>&nbsp;Previous</a></li>"
            );
          }
        }
        if (currentPage > 2) {
          $(".pagination ul").append(
            "<li class=\"\"> <a href=\"" +
            hostpath +
            "/p-" +
            (currentPage - 2) + "/" +
            "\" data-pn=" +
            (currentPage - 2) +
            " >" +
            (currentPage - 2) +
            "</a></li>"
          );
        }
        if (currentPage >= 2) {
          if (currentPage == 2) {
            $(".pagination ul").append(
              '<li class=""> <a href="' +
              hostpath +
              "/p-" +
              (currentPage - 1) + "/" +
              "\" data-pn=" +
              (currentPage - 1) +
              " >" +
              (currentPage - 1) +
              "</a></li>"
            );
          } else {
            $(".pagination ul").append(
              "<li class=\"\" data-pn=" +
              (currentPage - 1) +
              "> <a href=\"" +
              hostpath +
              "/p-" +
              (currentPage - 1) + "/" +
              "\" data-pn=" +
              (currentPage - 1) +
              " >" +
              (currentPage - 1) +
              "</a></li>"
            );
          }
        }

        $(".pagination ul").append(
          '<li class="active"><span> ' + currentPage + "</span></li>"
        );
      }
      if (currentPage < totalPage) {
        $(".pagination ul").append(
          '<li class=""> <a href="' +
          hostpath +
          "/p-" +
          (currentPage + 1) + "/" +
          "\" data-pn=" +
          (currentPage + 1) +
          " >" +
          (currentPage + 1) +
          "</a></li>"
        );
      }
      if (currentPage < totalPage - 1) {
        $(".pagination ul").append(
          '<li class=""> <a href="' +
          hostpath +
          "/p-" +
          (currentPage + 2) +"/"+
          "\" data-pn=" +
          (currentPage + 2) +
          ">" +
          (currentPage + 2) +
          "</a></li>"
        );
      }
      if (currentPage < totalPage) {
        $(".pagination ul").append(
          '<li class="next"> <a href="' +
          hostpath +
          "/p-" +
          (currentPage + 1) + "/" +
          '"data-pn=' +
          (currentPage + 1) +
          " >Next&nbsp;<span>&#10230;</span></a></li>"
        );
      }
    } else {
      $("#pagination_block").hide();
    }

    $(".pagination ul li a").unbind("click");
    $(".pagination ul li a").on("click", handlePaginationClick);
  }
  function _bindfaqs(json) {
    $(".faqSection").addClass("hide");
    $(".outer-faqwrapper").empty();
    if (!json) {
      return;
    } else {
      var response = $.parseJSON(json);
      var numberFaqs = response.length;
      var faqHtmlBinding = [];
      for (var i = 0; i < numberFaqs; i++) {
        faqHtmlBinding.push(
          "<div class=\"hide faqWrapper\">" +
          "<div class=\"leftfloat content-box-shadow carDescWrapper question\">" +
          "<p class=\"leftfloat\">" +
          response[i].question +
          '<svg class="rotateFaqArrow90 upDownArrow" width="12px" height="12px" viewBox="0 0 16 16" fill="#56586a" tabindex="-1" focusable="false" ' +
          'aria-hidden="true" role="img"><path d="M4.59 15.8a1 1 0 01-.69-.29 1 1 0 010-1.37L10 8 3.9 1.86a1 1 0 010-1.37 1 1 0 011.38 0l6.82 6.82a1 1 0 010 1.38l-6.82 6.82a1 1 0 01-.69.29z">' +
          "</path></svg>" +
          "</p>" +
          "</div>" +
          '<div class="answer hide">' +
          "<p>" +
          response[i].answer +
          "</p>" +
          "</div>" +
          "</div>"
        );
      if(numberFaqs > 4 && i ===3)
       {
        faqHtmlBinding.push(
          '<div class="viewMoreWrapper">' +
                '<span class="viewMore" data-testing-id="view-all-questions-button">'+'<span>' +'View More FAQ' +'</span>'
                +'</span>' +
            '</div>');
        }
      }
      $(".outer-faqwrapper").append(faqHtmlBinding.join(""));
      faqHelper($(".faqSection"));
      var viewmorecomponent = $(".faqSection").find(".viewMore");
      var showMoreFaqsHidden = viewmorecomponent.hasClass("hide");
      $(".faqSection").removeClass("hide");
      if (numberFaqs > 4) {
        if (showMoreFaqsHidden) {
          $(".faqSection").find(".viewMore").removeClass("hide");
        }
      } else {
        if (!showMoreFaqsHidden) {
          $(".faqSection").find(".viewMore").addClass("hide");
        }
      }
    }
  }
  function getSearchPagePath(cityMaskingName) {
    return "/buy-used-cars/" + cityMaskingName + "/c/";
  }
  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }
  function _bindNearByCities(json) {
    $(".nearByCitiesSection")[0].style.display = "none";
    $(".nearByCitiesSection-client").addClass("hide");
    $(".nearByCitiesWrapper-client .nearbyCitiesList").empty();
    if (!json || jQuery.isEmptyObject(json)) {
      return;
    } else {
      var response = JSON.parse(json);
      var numberOfCities = response.length;
      if (numberOfCities <= 0) {
        return;
      }
      var nearByCitiesHtmlBinding = [];
      var currentCityName = $("#selectedCity-client").text();
      $(".nearByCitiesHeaderWrapper").append("<h2 class='nearByCitiesHeader'>Used Cars Near " + currentCityName + "</h2>");
      for (var i = 0; i < numberOfCities; i++) {
        nearByCitiesHtmlBinding.push(
          '<li class="nearByCitiesText">' +
          '<a href="' +
          getSearchPagePath(response[i].MaskingName) +
          '" title="Used Cars in ' +
          response[i].Name +
          '" class="nearByCitiesLink"' +
          'data-event="CWInteractive" data-action="ClickedNearByCity"' +
          'data-cat="UsedCarSearch" data-role="click-tracking"' +
          'data-label="currentCity=' +
          currentCityName +
          "|nearbyCity= " +
          response[i].Name +
          '">' +
          "Used Cars in " +
          response[i].Name +
          "</a></li>"
        );
      }
      $(".nearByCitiesWrapper-client .nearbyCitiesList").append(
        nearByCitiesHtmlBinding.join("")
      );
      $(".nearByCitiesSection-client").removeClass("hide");
      AddVerticalLine();
    }
  }
  function _createSlug(text, value, filterName) {
    return (
      "<li class=\"active\" filter-name=\"" +
      filterName +
      "\" value=\"" +
      value +
      "\" >" +
      text +
      "<a><span></span></a></li>"
    );
  }

  function _addAppliedBudgetSlug(value, quickFilterSlugContainer) {
    var appliedValue = $("input[name=budget]:checked").attr("data-value");
    quickFilterSlugContainer.append(
      _createSlug(appliedValue, $("input[name=budget]:checked").val(), "budget")
    );
  }

  function _addAppliedFuelSlug(value, quickFilterSlugContainer) {
    $.each($("input[name=fuel]:checked"), function () {
      quickFilterSlugContainer.append(
        _createSlug($(this).attr("data-value"), $(this).val(), "fuel")
      );
    });
  }

  function _addAppliedKmsSlug(value, quickFilterSlugContainer) {
    $.each($("input[name=kms]:checked"), function () {
      quickFilterSlugContainer.append(
        _createSlug($(this).attr("data-value"), $(this).val(), "kms")
      );
    });
  }

  function _addAppliedYearSlug(value, quickFilterSlugContainer) {
    $.each($("input[name=year]:checked"), function () {
      quickFilterSlugContainer.append(
        _createSlug($(this).attr("data-value"), $(this).val(), "year")
      );
    });
  }

  function _addAppliedTransmissionSlug(value, quickFilterSlugContainer) {
    $.each($("input[name=trans]:checked"), function () {
      quickFilterSlugContainer.append(
        _createSlug($(this).attr("data-value"), $(this).val(), "trans")
      );
    });
  }

  function _addAppliedBodyTypeSlug(value, quickFilterSlugContainer) {
    $.each($("input[name=bodytype]:checked"), function () {
      quickFilterSlugContainer.append(
        _createSlug($(this).attr("data-value"), $(this).val(), "bodytype")
      );
    });
  }

  function _addAppliedOwnersSlug(value, quickFilterSlugContainer) {
    $.each($("input[name=owners]:checked"), function () {
      quickFilterSlugContainer.append(
        _createSlug($(this).attr("data-value"), $(this).val(), "owners")
      );
    });
  }

  function _addAdditionalFilterSlug(value, quickFilterSlugContainer) {
    if ($("input[name=car_pic]:checked").val() == "2") {
      quickFilterSlugContainer.append(
        _createSlug(
          "Pictures",
          $("input[name=car_pic]:checked").val(),
          "car_pic"
        )
      );
    }
  }

  function _addAppliedCarsSlug(value, quickFilterSlugContainer) {
    var makeList = [];
    $.each($("input[name=makes]:checked"), function () {
      makeList.push({
        makeId: $(this).val(),
        makeName: $(this).attr("data-value"),
      });
    });
    var modelList = [];
    $.each($("input[name=models]:checked"), function () {
      modelList.push({
        modelId: $(this).val(),
        makeId: $(this).attr("makeid"),
        modelName: $(this).attr("data-value"),
      });
    });

    for (var makeIndex = 0; makeIndex < makeList.length; makeIndex++) {
      var make = makeList[makeIndex];
      var isPresent = false;
      for (var modelIndex = 0; modelIndex < modelList.length; modelIndex++) {
        var model = modelList[modelIndex];
        if (model.makeId == make.makeId) {
          isPresent = true;
          quickFilterSlugContainer.append(
            _createSlug(model.modelName, model.modelId, "car")
          );
        }
      }
      if (!isPresent) {
        quickFilterSlugContainer.append(
          _createSlug(make.makeName, make.makeId, "car")
        );
      }
    }
  }

  function _addAppliedFiltersQuickSlugs() {
    var quickFilterSlugContainer = $(".filtrselectn.btmMrg ul");
    $(".filtrselectn.btmMrg ul li").remove();
    var queryParams = queryStringUtility.getQueryParamsObject();
    for (var i = 0; i < queryParams.length; i++) {
      switch (queryParams[i].field) {
        case "budget": {
          _addAppliedBudgetSlug(queryParams[i].value, quickFilterSlugContainer);
          break;
        }
        case "fuel": {
          _addAppliedFuelSlug(queryParams[i].value, quickFilterSlugContainer);
          break;
        }
        case "kms": {
          _addAppliedKmsSlug(queryParams[i].value, quickFilterSlugContainer);
          break;
        }
        case "year": {
          _addAppliedYearSlug(queryParams[i].value, quickFilterSlugContainer);
          break;
        }
        case "trans": {
          _addAppliedTransmissionSlug(
            queryParams[i].value,
            quickFilterSlugContainer
          );
          break;
        }
        case "bodytype": {
          _addAppliedBodyTypeSlug(
            queryParams[i].value,
            quickFilterSlugContainer
          );
          break;
        }
        case "owners": {
          _addAppliedOwnersSlug(queryParams[i].value, quickFilterSlugContainer);
          break;
        }
        case "car": {
          _addAppliedCarsSlug(queryParams[i].value, quickFilterSlugContainer);
          break;
        }
        case "filterbyadditional": {
          _addAdditionalFilterSlug(
            queryParams[i].value,
            quickFilterSlugContainer
          );
        }
      }
    }

    $(".filtrselectn.btmMrg ul li a").unbind("click");
    $(".filtrselectn.btmMrg ul li a").on("click", function () {
      var slugFilterName = $(this).parent().attr("filter-name");
      var slugFilterValue = $(this).parent().attr("value");
      if (slugFilterName !== "car") {
        $.each($("input[name=" + slugFilterName + "]"), function () {
          if ($(this).val() === slugFilterValue) {
            $(this).prop("checked", false);
            getfiltersSelected(slugFilterName, filtersApplied, "desktop");
          }
        });
      } else {
        $.each($("input[name=makes]:checked"), function () {
          if ($(this).val() === slugFilterValue) {
            $(this).prop("checked", false);
            getfiltersSelected("makes", filtersApplied, "desktop");
          }
        });
        $.each($("input[name=models]:checked"), function () {
          if ($(this).val() === slugFilterValue) {
            $(this).prop("checked", false);
            getfiltersSelected("models", filtersApplied, "desktop");
          }
        });
      }
      _hitAPI(getAppliedFiltersQueryParams());
    });
  }

  function _makeRootToggler() {
    $("#mklist li div.spclass,#other-mklist li div.spclass").on(
      "click",
      function (event) {
        var label = $(this).text().trim();
        var action = "";
        if ($(this).parent().hasClass("open")) {
          action = "DismissedMakeSelection";
        } else {
          action = "ExpandedMakeSelection";
        }
        trackingHandler.trackFilter(action, label);
        if ($(event.target).prop("name") === "makes") {
          //clicked on input
          return;
        }
        if ($(this).parent().find("ul").length == 0) {
          //since no roots
          //check the input and call the api
          $(this).find("input[name='makes']").prop("checked", true);
          _hitAPI(getAppliedFiltersQueryParams());
          return;
        }
        $(this).parent().toggleClass("open");
        $(this).parent().find("ul").slideToggle("slow");
      }
    );
  }

  function _toggleMakeFilter() {
    $("#smbrands").on("click", function () {
      $("#other-mklist").slideToggle("slow");
      var count =
        $("#mklist>li").length -
        $("#mklist>li[data-count=0]").length +
        $("#other-mklist>li").length -
        $("#other-mklist>li[data-count=0]").length;
      $("#countmakes").text("Make (" + count + ")");
      $("#smbrands").hide();
      $("#hmbrands").show();
    });
    $("#hmbrands").on("click", function () {
      $("#other-mklist").slideToggle("slow");
      var count = $("#mklist>li").length - $("#mklist>li[data-count=0]").length;
      $("#countmakes").text("Make (" + count + ")");
      $("#hmbrands").hide();
      $("#smbrands").show();
    });
  }

  function trackMakeRootSelection(element) {
    var label = element
      .parent()
      .text()
      .replace(/\(.*\)/g, "")
      .trim();
    var action = "";
    if (element.prop("name") === "makes") {
      if (element.prop("checked")) {
        action = "SelectedMake";
      } else {
        action = "UnSelectedMake";
      }
    }
    if (element.prop("name") === "models") {
      if (element.prop("checked")) {
        action = "SelectedModel";
      } else {
        action = "UnSelectedModel";
      }
    }
    trackingHandler.trackFilter(action, label);
  }

  function registerEvents() {
    _onLoad();
    _toggleMakeFilter();
    _makeRootToggler();
    _filterHoverEvents();
    _filterClickEvents();
    _resetFilterEvent();
    window.addEventListener("popstate", _onPopstate);
    $("#countmakes").on("click", _show_hide_refine);
  }

  return {
    getAppliedFilters: getAppliedFiltersQueryParams,
    registerEvents: registerEvents,
  };
})();

$(document).ready(function () {
  scrollHandler.registerEvents();
  filterClickHandler.registerEvents();
});