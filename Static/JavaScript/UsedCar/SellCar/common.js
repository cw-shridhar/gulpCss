var parentContainer = (function () {
  var eventName = {
    documentReady: "commonDocReady",
  };

  var loadingScreen;

  var stateEventDict = {
    formPreventBack: "preventBack",
    formInitialState: "closeFormModal",
  };

  if (typeof events !== "undefined") {
    events.subscribe(eventName.documentReady, setSelectors);
    events.subscribe(eventName.documentReady, registerDomEvents);
    events.subscribe("preventBack", preventBack);
    events.subscribe("closeFormModal", closeFormModalPopup);
  }

  function setSelectors() {
    loadingScreen = $("#loadingScreen");
  }

  function registerDomEvents() {
    $(document).on("change", ".select-box select", function () {
      if ($(this).val() !== "0") {
        validate.field.hideError($(this));
      }
    });

    /* input field */
    $(document).on("blur", ".input-box input", function () {
      if (!$(this).val().length) {
        $(this).closest(".input-box").removeClass("done");
      } else {
        validate.field.hideError($(this));
      }
    });

    toggleHeader();
    $(window).scroll(toggleHeader);

    // accordion
    $(".accordion-wrapper").on("click", ".accordion__head", function () {
      var currentElement = $(this),
        currentElementBody = currentElement.next(".accordion__body");

      if (
        !currentElement.hasClass("active") &&
        parseInt(currentElement.attr("data-access"))
      ) {
        var activeElement = currentElement
          .closest(".accordion-wrapper")
          .find(".accordion__head.active");

        activeElement.removeClass("active").addClass("done");
        activeElement.next(".accordion__body").hide();

        currentElement.addClass("active");
        currentElementBody.show();

        currentElement
          .closest(".accordion__item")
          .nextAll(".accordion__item")
          .find(".accordion__head.done")
          .removeClass("done");

        focusDocument(currentElement);
      }
    });

    $(".collapsible-content").on("click", ".collapsible-target", function () {
      var targetElement = $(this),
        collapsibleContent = targetElement.closest(".collapsible-content");

      if (!collapsibleContent.hasClass("more-active")) {
        collapsibleContent.addClass("more-active");
        targetElement.text("Read less");
      } else {
        collapsibleContent.removeClass("more-active");
        targetElement.text("Read more");
      }
    });

    $(window).on("popstate", function () {
      if (history.state && typeof events !== "undefined") {
        events.publish(
          stateEventDict[history.state.currentState],
          history.state.currentState
        );
      }
    });
  }

  function setLoadingScreen() {
    loadingScreen.show();
  }

  function removeLoadingScreen() {
    loadingScreen.hide();
  }

  function toggleHeader() {
    if ($(window).scrollTop() > $("#formContainer").offset().top - 50) {
      $("#header").hide();
    } else {
      $("#header").show();
    }
  }

  function getSourceId() {
    var match = RegExp("[?&]src=([^&]*)").exec(window.location.search);
    if (match) {
      var source = match[1];
      if (source.toLowerCase() === "android") {
        return 74;
      } else if (source.toLowerCase() === "ios") {
        return 83;
      }
    }
    return parseInt($("#formContainer").data("sourceid"));
  }

  function preventBack() {
    setNavigateAwayModal();
  }

  function closeFormModalPopup() {
    modalPopup.closeActiveModalPopup();
  }

  function setNavigateAwayModal() {
    var currentActiveTab = $("#formContainer")
      .find(".accordion__head.active")
      .closest(".accordion__item")
      .attr("data-tab");
    var obj;
    switch (currentActiveTab) {
      case "formContact":
        history.back();
        break;
      case "formCarDetail":
        obj = {
          heading:
            "You will lose the filled information, are you sure you want to navigate away?",
          description: "",
          isYesButtonActive: true,
          yesButtonText: "Continue",
          yesButtonLink: "javascript:void(0)",
          isNoButtonActive: true,
          noButtonText: "Leave",
          noButtonLink:
            "javascript:events.publish('navigateAwayFromCardetails');",
        };
        break;

      case "formCarImage":
        obj = {
          heading:
            "Listing with photos sell 4x faster. Do you want to add photos?",
          description: "",
          isYesButtonActive: true,
          yesButtonText: "Yes, Add photos",
          yesButtonLink: "javascript:void(0)",
          isNoButtonActive: true,
          noButtonText: "No, Leave",
          noButtonLink:
            "javascript:events.publish('navigateAwayFromCarImages');",
        };
        break;

      case "formCarCondition":
        obj = {
          heading:
            "You are almost on final step. Are you sure you want to leave car listing process?",
          description: "",
          isYesButtonActive: true,
          yesButtonText: "Continue",
          yesButtonLink: "javascript:void(0)",
          isNoButtonActive: true,
          noButtonText: "Leave",
          noButtonLink:
            "javascript:events.publish('navigateAwayFromCarCondition');",
        };
        break;
    }

    if (obj) {
      modalPopup.showModal(templates.modalPopupTemplate(obj));
    }
  }

  function focusDocument(container) {
    $("html, body").animate(
      {
        scrollTop: container.offset().top,
      },
      500,
      function () {
        $("#header").hide();
      }
    );
  }

  function onPageUnload(e) {
    e.returnValue = "Are You sure!!! Changes will not be saved";
  }

  return {
    setLoadingScreen: setLoadingScreen,
    removeLoadingScreen: removeLoadingScreen,
    getSourceId: getSourceId,
    focusDocument: focusDocument,
    onPageUnload: onPageUnload,
  };
})();

var chosenSelect = (function () {
  function noResultSelection(selectField, inputField) {
    addCustomOption(selectField, inputField);
  }

  function addCustomOption(selectField, inputField) {
    var inputValue = inputField.val(),
      template = '<option value="-1">' + inputValue + "</option>";

    selectField.append(template);
    selectField.val("-1").change();
    inputField.closest(".chosen-container").removeClass("chosen-with-drop");
    selectField.trigger("chosen:updated");
  }

  function removeInputField(selectBox) {
    var placeholderText = selectBox.find(".chosen-select").attr("data-title"),
      searchBox = selectBox.find(".chosen-search");

    searchBox
      .empty()
      .append('<p class="no-input-label">' + placeholderText + "</p>");
  }

  return {
    noResultSelection: noResultSelection,
    removeInputField: removeInputField,
  };
})();

var formField = (function () {
  function resetSelect(selectField) {
    selectField.closest(".select-box").removeClass("done");
    selectField.html('<option value="0"></option>').val("0").change();
    selectField.trigger("chosen:updated");
  }

  function emptySelect(selectField) {
    selectField.closest(".select-box").removeClass("done");
    selectField.val("0").change().trigger("chosen:updated");
  }

  function emptyRadioList(radioList) {
    radioList.empty();
  }

  return {
    resetSelect: resetSelect,
    emptySelect: emptySelect,
    emptyRadioList: emptyRadioList,
  };
})();

var validate = (function () {
  var field = {
    setError: function (element, message) {
      var fieldBox = element.closest(".field-box");

      fieldBox.addClass("invalid");

      if (fieldBox.hasClass("input-box")) {
        if (element.val().length > 0) {
          fieldBox.addClass("done");
        } else {
          fieldBox.removeClass("done");
        }
      } else if (fieldBox.hasClass("select-box")) {
        if (parseInt(element.val()) > 0) {
          fieldBox.addClass("done");
        } else {
          fieldBox.removeClass("done");
        }
      }

      fieldBox.find(".error-text").text(message);
    },

    hideError: function (element) {
      var fieldBox = element.closest(".field-box");

      fieldBox.removeClass("invalid").addClass("done");
      fieldBox.find(".error-text").text("");
    },
  };

  function valiadateDecimal(decimalValue) {
    return /^[-]?[0-9]*?[\.]?[0-9]*?$/.test(decimalValue);
  }
  function validateTextOnly(textValue) {
    return /^[a-zA-Z]+$/.test(textValue);
  }

  return {
    field: field,
    valiadateDecimal: valiadateDecimal,
    validateTextOnly: validateTextOnly,
  };
})();

var modalPopup = (function (modalBox) {
  var eventName = {
    documentReady: "commonDocReady",
  };

  if (typeof events !== "undefined") {
    events.subscribe(eventName.documentReady, registerDomEvents);
  }

  function registerDomEvents() {
    $(document).on("click", ".modal-box .modal__close", function () {
      closeActiveModalPopup();
      handleFormState();
    });
  }

  function showModalJson(json, modalBox) {
    modalBox = modalBox || $("#modalPopUp");
    var parsedJson = JSON.parse(json);
    $("#modalBg").show();
    modalBox.html(templates.modalPopupTemplate(parsedJson)).show();
    lockScroll();
    setModalState();
  }

  function showModal(htmlString, modalBox) {
    modalBox = modalBox || $("#modalPopUp");
    $("#modalBg").show();
    modalBox.html(htmlString).show();
    lockScroll();
    setModalState();
  }

  function hideModal(modalBox) {
    modalBox = modalBox || $("#modalPopUp");
    $("#modalBg").hide();
    modalBox.html("").hide();
    unlockScroll();
  }

  function isVisible(modalBox) {
    modalBox = modalBox || $("#modalPopUp");
    return modalBox.is(":visible");
  }

  function lockScroll() {
    var html_el = $("html"),
      body_el = $("body");

    if (Common.doc.height() > $(window).height()) {
      var scrollTop = html_el.scrollTop()
        ? html_el.scrollTop()
        : body_el.scrollTop(); // Works for Chrome, Firefox, IE...

      if (scrollTop < 0) {
        scrollTop = 0;
      }
      html_el.addClass("lock-browser-scroll").css("top", -scrollTop);
      if (scrollTop > 40) {
        setTimeout(function () {
          $("#header").addClass("header-fixed-with-bg");
        }, 10);
      }
    }
    Common.isScrollLocked = true;
  }

  function unlockScroll() {
    var scrollTop = parseInt($("html").css("top"));

    $("html").removeClass("lock-browser-scroll");
    $("html, body").scrollTop(-scrollTop);
    Common.isScrollLocked = false;
  }

  function closeActiveModalPopup() {
    if (isVisible()) {
      hideModal();
      return true;
    }
    return false;
  }

  function handleFormState() {
    if (history.state.currentState === "formPreventBack") {
      historyObj.addToHistory("formInitialState");
    } else {
      history.back();
    }
  }

  function setModalState() {
    if (history.state.currentState === "formInitialState") {
      historyObj.addToHistory("modalPopup");
    }
  }

  return {
    showModal: showModal,
    hideModal: hideModal,
    closeActiveModalPopup: closeActiveModalPopup,
    showModalJson: showModalJson,
    lockScroll: lockScroll,
    unlockScroll: unlockScroll,
  };
})();

var modalTooltip = (function () {
  function getTemplate(message, tooltipName) {
    if (typeof tooltipName === undefined) {
      tooltipName = "";
    }

    var template =
      '<span class="cw-tooltip tooltip--bottom-left ' +
      tooltipName +
      '"><span class="cw-tooltip-text">' +
      message +
      "</span></span>";

    return template;
  }

  function setTooltip(container, tooltip) {
    if (!container.find(".cw-tooltip").length) {
      container.append(tooltip);
    }
  }

  return {
    getTemplate: getTemplate,
    setTooltip: setTooltip,
  };
})();

var ajaxRequest = (function () {
  var setting;

  if (typeof events !== "undefined") {
    events.subscribe("carDetailsPosted", verifyMobile);
    events.subscribe("mobileVerified", takeLive);
    events.subscribe("insuranceSubmitted", getCarImagesHtml);
    events.subscribe("updateContactDetails", verifyMobile);
  }

  function getJsonPromise(url) {
    settings = {
      async: true,
      url: url,
      method: "GET",
      dataType: "json",
    };
    return $.ajax(settings);
  }

  function getJsonPromiseV1(url) {
    settings = {
      async: true,
      url: url,
      method: "GET",
      dataType: "json",
      headers: { ServerDomain: "CarWale" },
    };
    return $.ajax(settings);
  }

  function verifyMobile(eventObj) {
    var data = {};
    if (eventObj && eventObj.data)
      data = appState.setSelectedData(data, eventObj.data);
    var settings = {
      url: "/api/v1/used/sell/verify/",
      type: "POST",
      data: data.sellCarCustomer.mobile,
      contentType: "application/json",
      dataType: "json",
      headers: {
        sourceid: parentContainer.getSourceId(),
        'ServerDomain': 'CarWale',
        applicationid: 3
      },
    };
    $.ajax(settings)
      .done(function (response) {
        eventObj.callback(response, data);
      })
      .fail(function (xhr) {
        parentContainer.removeLoadingScreen();
        modalPopup.showModalJson(xhr.responseText);
      });
  }

  function takeLive(eventObj) {
    createCookie(
      $("#getName").val(),
      $("#getMobile").val(),
      $("#getEmail").val()
    );
    var data = {};
    if (eventObj && eventObj.data)
      data = appState.setSelectedData(data, eventObj.data);
    parentContainer.setLoadingScreen();
    var originId = parseInt(getQueryStringParam("originid"));
    if (isNaN(originId)) {
      originId = 0;
    }
    const live = {
      OriginId: originId,
      TempId: $.cookie("TempInquiry"),
    };
    var settings = {
      url: "/api/v2/used/sell/live/",
      type: "POST",
      data: JSON.stringify(live),
      contentType: "application/json",
      dataType: "json",
      headers: {
        sourceid: parentContainer.getSourceId(),
        ServerDomain: "CarWale",
      },
    };
    $.ajax(settings)
      .done(function (response) {
        parentContainer.removeLoadingScreen();
        sellCarCookie.deleteTempInquiryCookie();
        sellCarCookie.setSellInquiryCookie(response.inquiryId);
        if (typeof events !== "undefined") {
          events.publish("takenLive");
        }
      })
      .fail(function (xhr) {
        parentContainer.removeLoadingScreen();
        modalPopup.showModalJson(xhr.responseText);
      });
  }

  function createCookie(name, mobile, email) {
    var date, expires;
    date = new Date();
    date.setTime(date.getTime() + 15 * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toGMTString();
    document.cookie = "cookie_name=" + name + expires + "; path=/";
    document.cookie = "cookie_mobile=" + mobile + expires + "; path=/";
    document.cookie = "cookie_email=" + email + expires + "; path=/";
  }

  function getCarImagesHtml(eventObj) {
    var data = {};
    if (eventObj && eventObj.data)
      data = appState.setSelectedData(data, eventObj.data);
    var settings = {
      url: "/sell-used-car/used/sell/carimages/",
      type: "GET",
    };
    $.ajax(settings)
      .done(function (response) {
        var partialCarImages = $(".partialCarImages");
        partialCarImages.find(".accordion__body").html(response);
        analytics.trackAction(
          "CWInteractive",
          "Sell Car - Desktop",
          "ListingLive",
          cityForm.getCityData().cityName
        );
        if (typeof events !== "undefined") {
          var eventObj = {
            data: data,
          };
          events.publish("carImageLoaded", eventObj);
        }
      })
      .fail(function (xhr) {
        parentContainer.removeLoadingScreen();
        modalPopup.showModal(xhr.responseText);
      });
  }

  return {
    getJsonPromise: getJsonPromise,
    takeLive: takeLive,
    getJsonPromiseV1: getJsonPromiseV1,
  };
})();

var templates = (function () {
  function fillColorTemplate(obj) {
    return obj.map(function (curr) {
      return (
        '<li class="option-list__item"> ' +
        '<input type="radio" id="' +
        curr.colorId +
        '"data-attribute-color="' +
        curr.colorName +
        '" name="carColour" value="' +
        curr.colorVal +
        '"> ' +
        '<label for="' +
        curr.colorId +
        '"> ' +
        '<span class="list-item__icon" style="background-color: #' +
        curr.colorHash +
        '"></span> ' +
        '<span class="list-item__label">' +
        curr.colorDisplayName +
        "</span> " +
        "</label> " +
        "</li>"
      );
    });
  }

  function fillDropDownTemplate(obj) {
    return obj.map(function (curr) {
      return '<option value="' + curr.val + '">' + curr.text + "</option>";
    });
  }

  function fillRadioListTemplate(field, obj) {
    var fieldName = field.attr("data-name");
    if (typeof fieldName === "undefined") {
      fieldName = "";
    }
    return obj.map(function (curr) {
      return (
        '<li class="option-list__item"><input type="radio" name="' +
        fieldName +
        (curr.rootName ? '" data-attribute-model="' + curr.rootName : "") +
        '" id="' +
        fieldName +
        curr.val +
        '" value="' +
        curr.val +
        '"><label for="' +
        fieldName +
        curr.val +
        '">' +
        curr.text +
        "</label></li>"
      );
    });
  }

  function modalPopupTemplate(obj) {
    var template = "";
    template += '<div class="error-popup-template">';
    template += '<span class="modal__close cross-default-15x16"></span>';
    template += '<p class="modal__header">' + obj.heading + "</p>";
    if (obj.description.length > 0) {
      template += '<p class="modal__description">' + obj.description + "</p>";
    }
    if (obj.isNoButtonActive) {
      template +=
        '<a href="' +
        obj.noButtonLink +
        '" class="btn btn-white btn-124-36 modal_navigate_away">' +
        obj.noButtonText +
        "</a>";
    }
    if (obj.isYesButtonActive) {
      template +=
        '<a href="' +
        obj.yesButtonLink +
        '" class="btn btn-orange btn-124-36 modal__close">' +
        obj.yesButtonText +
        "</a>";
    }
    template += "</div>";
    return template;
  }

  return {
    fillColorTemplate: fillColorTemplate,
    fillDropDownTemplate: fillDropDownTemplate,
    fillRadioListTemplate: fillRadioListTemplate,
    modalPopupTemplate: modalPopupTemplate,
  };
})();

var summary = (function () {
  function getFieldDetails(fieldBox) {
    var field, fieldValue;

    if (fieldBox.hasClass("input-box")) {
      field = fieldBox.find("input");
      fieldValue = field.val();
    } else if (fieldBox.hasClass("select-box")) {
      field = fieldBox.find("select");
      fieldValue = field.find("option:selected").text();
    } else if (fieldBox.hasClass("radio-box")) {
      field = fieldBox;

      var radioLabel = field
        .find("input[type=radio]:checked")
        .siblings("label");

      if (radioLabel.find(".list-item__label").length) {
        fieldValue = radioLabel.find(".list-item__label").text();
      } else {
        fieldValue = radioLabel.text();
      }
    }

    return {
      field: field,
      fieldValue: fieldValue,
    };
  }

  function getSelectionText(labelElement) {
    var fieldText = "";

    if (typeof labelElement.attr("data-title") !== "undefined") {
      fieldText += labelElement.attr("data-title") + ": ";
    }

    if (typeof labelElement.attr("data-prefix") !== "undefined") {
      fieldText += labelElement.attr("data-prefix");
    }

    fieldText += labelElement.text();

    if (typeof labelElement.attr("data-suffix") !== "undefined") {
      fieldText += " " + labelElement.attr("data-suffix");
    }

    return fieldText;
  }

  function resetGroupAccessFlag(container) {
    $(container)
      .find(".group-box.step--accessed")
      .removeClass("step--accessed");
  }

  function resetToolbar(container) {
    container.find(".accordion__head").removeClass("summary--active");
    container.find(".summary-content").text("");
  }

  function setToolbar(summaryText, container) {
    if (!container.find(".summary-content").length) {
      container
        .find(".accordion-head__content")
        .append('<p class="summary-content">' + summaryText + "</p>");
    } else {
      container.find(".summary-content").text(summaryText);
    }

    container.addClass("summary--active");
  }

  return {
    getFieldDetails: getFieldDetails,
    getSelectionText: getSelectionText,
    resetGroupAccessFlag: resetGroupAccessFlag,
    resetToolbar: resetToolbar,
    setToolbar: setToolbar,
  };
})();

var appState = (function () {
  function setSelectedData(target, src, deepCopy) {
    if (deepCopy) return $.extend(true, {}, target, src);
    return $.extend({}, target, src);
  }

  function deleteObjectProperties(obj, props) {
    for (var i = 0; i < props.length; i++) {
      if (obj.hasOwnProperty(props[i])) {
        delete obj[props[i]];
      }
    }
    return obj;
  }

  return {
    setSelectedData: setSelectedData,
    deleteObjectProperties: deleteObjectProperties,
  };
})();

var formatValue = (function () {
  function withComma() {
    var fieldValue = this.value,
      caretPos = this.selectionStart,
      lenBefore = fieldValue.length;

    fieldValue = fieldValue.replace(/[^\d]/g, "").replace(/^0+/, "");
    this.setAttribute("data-value", fieldValue);
    this.value = Common.utils.formatNumeric(fieldValue);

    var selEnd = caretPos + this.value.length - lenBefore;
    if (this.value[selEnd - 1] == ",") {
      selEnd--;
    }
    this.selectionEnd = selEnd > 0 ? selEnd : 0;
  }

  function handleCommaDelete(event) {
    var fieldValue = this.value;
    if (event.keyCode == 8) {
      //backspace
      if (fieldValue[this.selectionEnd - 1] == ",") {
        this.selectionEnd--;
      }
    } else if (event.keyCode == 46) {
      //delete
      if (fieldValue[this.selectionEnd] == ",") {
        this.selectionStart++;
      }
    }
  }

  function formatValueOnInput(inputField) {
    inputField.on("input propertychange", withComma);
    inputField.on("keydown", handleCommaDelete);
    inputField.on("input propertychange", function () {
      readableTextFromNumber(inputField);
    });
  }

  function readableTextFromNumber(input) {
    var placeHolder = input.siblings("div .getNumbersInWord");
    placeHolder.text("");
    placeHolder.text(
      cardetailsUtil.capitalizeFirstLetter(
        cardetailsUtil.numberToWords(input.attr("data-value"))
      )
    );
  }

  return {
    formatValueOnInput: formatValueOnInput,
    withComma: withComma,
    handleCommaDelete: handleCommaDelete,
    readableTextFromNumber: readableTextFromNumber,
  };
})();

var sellCarCookie = (function () {
  var cookieName = { sellInquiry: "SellInquiry", tempInquiry: "TempInquiry" };

  function setSellInquiryCookie(cookieValue) {
    setCookie(cookieName.sellInquiry, cookieValue, 90);
  }

  function deleteSellInquiryCookie() {
    setCookie(cookieName.sellInquiry, null, -1);
  }

  function setTempInquiryCookie(cookieValue) {
    setCookie(cookieName.tempInquiry, cookieValue, 90);
  }

  function deleteTempInquiryCookie() {
    setCookie(cookieName.tempInquiry, null, -1);
  }

  function getSellInquiryCookie() {
    return $.cookie(cookieName.sellInquiry);
  }
  function setCookie(name, val, expireInDays) {
    $.cookie(name, val, {
      path: "/",
      domain: defaultCookieDomain,
      expires: expireInDays,
    });
  }

  return {
    setSellInquiryCookie: setSellInquiryCookie,
    deleteSellInquiryCookie: deleteSellInquiryCookie,
    setTempInquiryCookie: setTempInquiryCookie,
    deleteTempInquiryCookie: deleteTempInquiryCookie,
    getSellInquiryCookie: getSellInquiryCookie,
  };
})();

var historyObj = (function () {
  function addToHistory(currentState, title, url) {
    history.pushState(
      {
        currentState: currentState,
      },
      title,
      url
    );
  }

  function replaceHistory(currentState, title, url) {
    history.replaceState(
      {
        currentState: currentState,
      },
      title,
      url
    );
  }

  return {
    addToHistory: addToHistory,
    replaceHistory: replaceHistory,
  };
})();

$(document).ready(function () {
  if (typeof events !== "undefined") {
    events.publish("commonDocReady");
    if (history.state === null) {
      historyObj.replaceHistory("formPreventBack");
      historyObj.addToHistory("formInitialState");
    } else if (history.state.currentState === "formPreventBack") {
      historyObj.addToHistory("formInitialState");
    }
  }
  analytics.trackAction(
    "CWInteractive",
    "sell used car-form viewed",
    "sell used car-form",
    "no referrer"
  );
  analytics.trackAction("CWInteractive", "Sell Car - Desktop", "PageLoad");
});

// Pop Up Generic Code Starts Here
var popUp = {
  showPopUp: function () {
    element = $("." + $("#modalBg").attr("data-current"));
    $("#modalBg").show();
    $(".modal-box").show();
    element.appendTo($(".modal-box")).show();
    modalPopup.lockScroll();
  },
  hidePopUp: function () {
    element = $("." + $("#modalBg").attr("data-current"));
    $("#modalBg").hide();
    $(".modal-box").hide().empty();
    element.appendTo(".popup-box-container");
    element.css("display", "none");
    modalPopup.unlockScroll();
  },
  registerEvents: function () {
    $(document).on("click", "#modalBg, .close-icon", function () {
      popUp.hidePopUp();
    });
  },
};

popUp.registerEvents();
// Pop Up Generic Code Ends Here
