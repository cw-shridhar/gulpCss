// ClientErrorLogger(["aeplcdn", "carwale"], "/api/exceptions/");
var objPopupCity = new Object();
var focusedCity;
var masterCityNameCookie = $.cookie("_CustCityMaster");
var suggestReqTerm = "";
var masterCityIdCookie = $.cookie("_CustCityIdMaster");
var RECOINQUIRYSOURCE = null;
var RECOLEADCLICKSOURCE = null;
suggestions = {
  position: 0,
  count: 0
};
// Moved to common-tabs-module.js part 1 -- Start
// Common CW tabs code
$(document).on("click", ".cw-tabs li", function () {
  if (!$(this).hasClass("disabled")) {
    var panel = $(this).closest(".cw-tabs-panel");
    panel.find(".cw-tabs li").removeClass("active");
    $(this).addClass("active");
    var panelId = $(this).attr("data-tabs");
    panel.find(".cw-tabs-data").hide();
    $("#" + panelId).show();
  }
}); // ends
// Moved to common-tabs-module.js part 1 -- End
$(".cw-tabs li[data-tabs='usedCars']").click(function () {
  if (objUsedCar.Name != undefined && $.trim(objUsedCar.Name) != "") {
    $("#usedCarsList").val(objUsedCar.Name);
  }
});
// Moved to common-tabs-module.js part 2 -- Start
// Common CW select box tabs code
$(".cw-tabs select").change(function () {
  var panel = $(this).closest(".cw-tabs-panel");
  var panelId = $(this).val();
  panel.find(".cw-tabs-data").hide();
  //Pause YouTube video on select change
  if (
    Swiper.YouTubeApi.playerState == "playing" ||
    Swiper.YouTubeApi.playerState == "buffering"
  ) {
    try {
      Swiper.YouTubeApi.videoPause();
    } catch (e) {
      console.log(e);
    }
  }
  $("#" + panelId).show();

  var swiperContainer = $("#" + panelId).find(".swiper-container");
  if (swiperContainer.length > 0) {
    var sIndex = swiperContainer.attr("class");
    var regEx = /sw-([0-9]+)/i;
    try {
      var index = regEx.exec(sIndex)[1];
      $(".sw-" + index)
        .data("swiper")
        .update(true);
    } catch (e) {
      console.log(e);
    }
  }
}); // ends
// Moved to common-tabs-module.js part 2 -- End
$(".ncf-linkage").click(function () {
  Common.utils.trackAction(
    "CWInteractive",
    "NCFLinkage",
    "NCFSlug_click",
    getNcfOriginPageName()
  );
  window.location = "/find-car/";
});

function findInArray(value, array, parameter) {
  var item;
  for (var i = 0; i < array.length; i++) {
    item = array[i];
    if (value == eval("(item." + parameter + ")")) return i;
  }
  return -1;
}

var label = null;
var id = null;
var focusedMakeModel = null;
var newModelId = null;
var newModelName = null;
var newMakeName = null;
var isComparisionSelect = false;

// nav bar code starts
$(".navbarBtn").click(function () {
  trackTopMenu("Hamburger-Icon-Click", window.location.href);
  navbarShow();
});
function navbarShow() {
  $("body").addClass("lock-browser-scroll lock-body-scroll");
  $("#nav")
    .addClass("open")
    .animate({ left: "0px" });
  $(".blackOut-window").show();
}

$(".navUL > li > a").click(function (e) {
  if (!$(this).hasClass("open")) {
    var mainItem = e.target.innerText + " " + window.location.href;
    trackNavigation("Main-Menu-item-Click", mainItem);
    var a = $(".navUL li a");
    a.removeClass("open")
      .next("ul")
      .slideUp(350);
    $(this)
      .addClass("open")
      .next("ul")
      .slideDown(350);

    if (
      $(this)
        .siblings()
        .size() == 0
    ) {
      navbarHide();
    }

    $(".nestedUL > li > a").click(function () {
      var subMenuItem = this.innerText + " " + window.location.href;
      trackNavigation("Sub-Menu-item-Click", subMenuItem);
      $(".nestedUL li a").removeClass("open");
      $(this).addClass("open");
      navbarHide();
    });
  } else if ($(this).hasClass("open")) {
    $(this)
      .removeClass("open")
      .next("ul")
      .slideUp(350);
  }
}); // nav bar code ends here

function navbarHide() {
  $("body").removeClass("lock-browser-scroll lock-body-scroll");
  $("#nav")
    .removeClass("open")
    .animate({ left: "-300px" });
  $(".blackOut-window").hide();
}

function voiceSearchSlug() {
  var day = new Date().getDate();
  var month = new Date().getMonth();
  //from 5 oct to 7 oct (index of jan =0)
  if (
    !isCookieExists("_showVoiceSearch") &&
    month === 9 &&
    day >= 5 &&
    day <= 7
  ) {
    $("#eac-container-globalSearchPopup").css("margin-top", "40px");
    Common.utils.trackAction(
      "CWNonInteractive",
      "global_search_voice_search",
      "feedback_form_impression",
      window.document.URL
    );
  } else {
    $(".js-voice-search").addClass("hide");
  }
}

// global-search code
$(".global-search").click(function () {
  voiceSearchSlug();
  trackTopMenu("Global-Search-Icon-Click", window.location.href);
  $("#global-search-popup-cars").removeClass("hide");
  $("#globalSearchPopup").focus();
  $.when(GetGlobalSearchCampaigns.bindCampaignData(true)).then(function () {
    $(".global-search-section").show();
    GetGlobalSearchCampaigns.logImpression(
      "#global-search-popup-cars",
      "trending",
      true
    );
  });
  lockPopup();
});

$(".blackOut-window,.blackOut-window-pq").click(function (e) {
  var globalSearchPopup = $("#global-search-popup-cars");
  $("#global-search-popup-pq").addClass("hide");
  if (globalSearchPopup.is(":visible")) {
    trackTopMenu("Global-Search-Outside-Click", $("#globalSearchPopup").val());
    $("#globalSearchPopup").val("");
    globalSearchPopup.addClass("hide");
    unlockPopup();
  }

  var nav = $("#nav");
  if (nav.is(":visible")) {
    navbarHide();
  }
});

$("#gs-close").click(function () {
  trackTopMenu("Global-Search-Back-Icon-Click", $("#globalSearchPopup").val());
  $("#globalSearchPopup").val("");
  $(".global-search-popup").addClass("hide");
  unlockPopup();
});

$(document).on("click", "#yes-link, #no-link", function (e) {
  SetCookieInDays("_showVoiceSearch", 0, 5);
  Common.utils.trackAction(
    "CWInteractive",
    "global_search_voice_search",
    "feedback_form_" +
    ($(this).attr("id") === "yes-link" ? "Yes_click" : "No_click"),
    window.document.URL
  );
  $(".js-voice-search").css("padding", "10px 10px");
  $(".js-voice-search").text("Thank you for your feedback.");
  setTimeout(function () {
    $("#eac-container-globalSearchPopup").css("margin-top", "0");
    $(".js-voice-search").addClass("hide");
  }, 3000);
});

$("#gl-close").click(function () {
  $(".global-location-popup").addClass("hide");
  unlockPopup();
});

$(".infoBtn").click(function (e) {
  e.stopPropagation();
  $(this)
    .closest("li")
    .flip(true)
    .siblings()
    .flip(false);
});

$(".closeBtn").click(function (e) {
  e.stopPropagation();
  $(this)
    .closest("li")
    .flip(false);
});

$("#navSpecials").click(function (event) {
  if (
    $(event.target).hasClass("specialCarDropDown") ||
    $(event.target)
      .parent()
      .hasClass("specialCarDropDown")
  ) {
    if (!$("#navSpecials ul li").hasClass("sponsoredLi")) {
      SponsoredNavigation.showSponsoredNavigation(2, 43);
    }
    setTimeout(function () {
      var modelName = $("#navSpecials .sponsoredLi");
      if ($("#navSpecials a").hasClass("open")) {
        var totalModel = modelName.length;
        for (var i = 0; i < totalModel; i++) {
          Common.utils.trackAction(
            "CWNonInteractive",
            "SponsoredNavigation_m",
            modelName[i].textContent.trim() + "_shown",
            "Specials"
          );
        }
      }
    }, 1000);
  }
});

$("#navNewCars").click(function (event) {
  if (
    $(event.target).hasClass("newCarDropDown") ||
    $(event.target)
      .parent()
      .hasClass("newCarDropDown")
  ) {
    if (!$("#navNewCars ul li").hasClass("sponsoredLi")) {
      SponsoredNavigation.showSponsoredNavigation(1, 43);
    }
    setTimeout(function () {
      var modelName = $("#navNewCars .sponsoredLi");
      if ($("#navNewCars a").hasClass("open")) {
        var totalModel = modelName.length;
        for (var i = 0; i < totalModel; i++) {
          Common.utils.trackAction(
            "CWNonInteractive",
            "SponsoredNavigation_m",
            modelName[i].textContent.trim() + "_shown",
            "NewCars"
          );
        }
      }
    }, 1000);
  }
});

function lockPopup() {
  $("body").addClass("lock-browser-scroll");
  $(".blackOut-window").show();
}
function unlockPopup() {
  $("body").removeClass("lock-browser-scroll");
  $(".blackOut-window").hide();
}
// Moved to videoswiper.js -- Start
/* Swiper script starts here */
var Swiper = {
  //Initialize Function
  Initialize: function () {
    $('.swiper-container:not(".noSwiper")').each(function (index, element) {
      var currentSwiper = $(this);
      currentSwiper.addClass("sw-" + index).swiper({
        nextButton: currentSwiper.find(".swiper-button-next"),
        prevButton: currentSwiper.find(".swiper-button-prev"),
        pagination: currentSwiper.find(".swiper-pagination"),
        slidesPerView: "auto",
        paginationClickable: true,
        spaceBetween: 10,
        watchSlidesVisibility: true,
        onSlideChangeStart: Swiper.slideChangeStart,
        onTransitionEnd: Swiper.transitionEnd,
        onInit: Swiper.initSwiper
      });
    });
    $(".swiper-slide img[data-original]").each(function () {
      $(this)
        .closest(".imageWrapper")
        .addClass("swiper-imgLoader");
    });
  },

  //slideChangeStart Function
  slideChangeStart: function () {
    if (
      Swiper.YouTubeApi.playerState == "playing" ||
      Swiper.YouTubeApi.playerState == "buffering"
    ) {
      try {
        Swiper.YouTubeApi.videoPause();
      } catch (e) {
        console.log(e);
      }
    }
  },

  //paginationLoad Function
  paginationLoad: function (swiper) {
    if (swiper.slides.length == 1) {
      swiper.slides.addClass("fullWidth");
    } else if (swiper.slides.length > 1) {
      swiper.slides.removeClass("fullWidth");
    }
  },

  //initSwiper Function
  initSwiper: function (swiper) {
    setTimeout(function () {
      Swiper.paginationLoad(swiper);
    }, 300);
    $(window).resize(function () {
      swiper.update(true);
    });
  },

  //YouTubeApi Function
  YouTubeApi: {
    player: new Array(),
    id: "",
    count: 0,
    countArray: [],
    playerState: "",
    targetClick: "",
    targetOverlay: "",
    videoPos: "",
    addApiScript: function () {
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      Swiper.YouTubeApi.ApiCommon();
    },

    ApiCommon: function () {
      window.onYouTubeIframeAPIReady = function () {
        var i = 1;
        $(".swiper-wrapper iframe").each(function () {
          Swiper.YouTubeApi.id = $(this).attr("id");
          Swiper.YouTubeApi.videoPos = $(this).position();
          Swiper.YouTubeApi.player[i] = new YT.Player(Swiper.YouTubeApi.id, {
            events: {
              onStateChange: Swiper.YouTubeApi.onPlayerStateChange,
              onReady: Swiper.YouTubeApi.onPlayerReady,
              onError: Swiper.YouTubeApi.onPlayerError
            }
          });
          i++;
        });
      };
      $(".yt-iframe-preview").append('<span class="overlay" />');

      //play video on click
      $(document).on("click", ".swiper-slide", function (event) {
        Swiper.YouTubeApi.targetClick = $(event.target).attr("class");
        if (Swiper.YouTubeApi.targetClick == "overlay") {
          Swiper.YouTubeApi.targetOverlay = $(this).find("span.overlay");
          Swiper.YouTubeApi.videoPlay();
        }
      });

      //pause youtube video on scroll when video is not in viewport
      var videoElement = $("#Videos");
      var inViewPortTopBtm = "",
        inViewPortLeftRight = "",
        videoFrame = "";
      var handler = function () {
        try {
          if (
            videoElement.is(":visible") &&
            videoElement.find("iframe.current").length > 0
          ) {
            videoFrame = videoElement.find("iframe.current");
            inViewPortTopBtm = Common.utils.isElementInViewportTopBottom(
              videoFrame
            );
            inViewPortLeftRight = Common.utils.isElementInViewportLeftRight(
              videoFrame
            );
            if (
              !inViewPortTopBtm &&
              (Swiper.YouTubeApi.playerState == "playing" ||
                Swiper.YouTubeApi.playerState == "buffering")
            )
              Swiper.YouTubeApi.videoPause();
            else if (
              inViewPortTopBtm &&
              inViewPortLeftRight &&
              Swiper.YouTubeApi.playerState == "paused"
            )
              Swiper.YouTubeApi.videoPlay();
          }
        } catch (e) { }
      };

      $(window).on("resize scroll", handler);
    },

    //you tube player state change event
    onPlayerStateChange: function (event) {
      switch (event.data) {
        case YT.PlayerState.UNSTARTED:
          Swiper.YouTubeApi.playerState = "unstarted";
          break;
        case YT.PlayerState.ENDED:
          Swiper.YouTubeApi.playerState = "ended";
          $(".yt-iframe-preview .overlay").show();
          break;
        case YT.PlayerState.PLAYING:
          Swiper.YouTubeApi.playerState = "playing";
          break;
        case YT.PlayerState.PAUSED:
          Swiper.YouTubeApi.playerState = "paused";
          break;
        case YT.PlayerState.BUFFERING:
          Swiper.YouTubeApi.playerState = "buffering";
          break;
        case YT.PlayerState.CUED:
          Swiper.YouTubeApi.playerState = "cued";
          break;
      }
    },

    onPlayerReady: function (event) { },

    onPlayerError: function (event) {
      console.log("onPlayerError:error!");
    },

    videoPlay: function () {
      if (
        Swiper.YouTubeApi.playerState == "playing" ||
        Swiper.YouTubeApi.playerState == "buffering"
      ) {
        Swiper.YouTubeApi.videoPause();
      }
      $(".swiper-wrapper iframe").removeClass("current");
      Swiper.YouTubeApi.targetOverlay.prev().addClass("current");
      Swiper.YouTubeApi.count = Swiper.YouTubeApi.targetOverlay
        .siblings("iframe.current")
        .attr("id")
        .replace("video_", "");
      Swiper.YouTubeApi.player[Swiper.YouTubeApi.count].playVideo();
      $("#video_" + Swiper.YouTubeApi.count + ".current")
        .siblings("span.overlay")
        .hide();
      Swiper.YouTubeApi.countArray.push(Swiper.YouTubeApi.count);
    },

    videoPause: function () {
      for (var j = 0; j < Swiper.YouTubeApi.countArray.length; j++) {
        Swiper.YouTubeApi.player[Swiper.YouTubeApi.countArray[j]].pauseVideo();
      }
      $('.swiper-slide .overlay:not(":visible")').show();
      Swiper.YouTubeApi.countArray = [];
    }
  }
};
/* Swiper script ends here */
// Moved to videoswiper.js -- End

//moved to globalSearch.js part1
var ac_textTypeEnum = new Object({
  make: "1",
  model: "2,4",
  version: "3,5,6",
  state: "",
  city: "7",
  link: "8",
  discontinuedModel: "9"
});
var ac_Source = new Object({
  generic: "1",
  usedModels: "2",
  usedCarCities: "3",
  valuationModels: "4",
  allCarCities: "6",
  areaLocation: "7",
  globalCityLocation: "8",
  accessories: "9"
});
var ac_SourceName = { "8": "city", "7": "areas" };

function getOnRoadPQ(e, modelId, pageId) {
  redirectOrOpenPopup(e, pageId);
}

function formatSpecial(url) {
  reg = /[^/\-0-9a-zA-Z\s]*/g;
  url = url.replace(reg, "");
  var formattedUrl = url
    .toLowerCase()
    .replace(/ /g, "")
    .replace(/-/g, "")
    .replace("/", "");
  return formattedUrl;
}

(function ($) {
  $.fn.cw_easyAutocomplete = function (options) {
    return this.each(function () {
      if (options == null || options == undefined) {
        console.log("cwsearch: please define options");
        return;
      } else if (
        options.source == null ||
        options.source == undefined ||
        options.source == ""
      ) {
        console.log("cwsearch: please define source");
        return;
      }

      var spinner = $(options.inputField)
        .closest(".form-control-box")
        .find(".fa-spinner");

      var cache = {},
        cacheProp,
        requestTerm;

      $(this).easyAutocomplete({
        adjustWidth: false,
        url: function (value) {
          if (options.beforefetch && typeof options.beforefetch == "function") {
            options.beforefetch();
          }

          requestTerm = value
            .replace(/^\s\s*/, "")
            .replace(/\s\s*$/, "")
            .replace(/-/g, " ")
            .replace(/[^\+A-Za-z0-9 ]/g, "")
            .toLowerCase();

          var year = options.year;
          if (year != null && year != undefined && year != "") {
            year = year.val();
          } else {
            year = "";
          }

          cacheProp = requestTerm + "_" + year;

          if (options.source == ac_Source.areaLocation) {
            cacheProp += "_" + options.cityId;
          }

          if (requestTerm.length > 0) {
            if (!(cacheProp in cache) || cache[cacheProp] == undefined) {
              var path;

              if (
                options.source == ac_Source.globalCityLocation ||
                options.source == ac_Source.areaLocation
              ) {
                path =
                  "/sell-used-car/api/v2/autocomplete/" +
                  ac_SourceName[options.source] +
                  "/?term=" +
                  encodeURIComponent(requestTerm) +
                  "&record=" +
                  options.resultCount;
              } else {
                path =
                  "/webapi/autocomplete/GetResults/?source=" +
                  options.source +
                  "&value=" +
                  encodeURIComponent(requestTerm);
              }

              var par = "";
              par += __getValue("n", options.isNew);
              par += __getValue("u", options.isUsed);
              par += __getValue("p", options.isPriceExists);
              par += __getValue("t", options.additionalTypes);
              par += __getValue("y", year);
              par += __getValue("cityId", options.cityId);
              par += __getValue("size", options.resultCount);
              par += __getValue("SourceId", "43");
              par += __getValue(
                "showFeaturedCar",
                typeof options.showFeaturedCar === "undefined"
                  ? true
                  : options.showFeaturedCar
              );
              par += __getValue("isNcf", options.isNcf);
              if (par != null && par != undefined && par != "") {
                par = par.slice(0, -1);
                path += "&" + par;
              }

              return path;
            } else {
              return {
                data: cache[cacheProp]
              };
            }
          }
        },

        getValue:
          options.source == ac_Source.globalCityLocation ||
            options.source == ac_Source.areaLocation
            ? "result"
            : "label",

        ac_Source: ac_Source,

        sourceType: options.source,

        ajaxSettings: {
          async: true,
          type: "GET",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          beforeSend: function () {
            spinner.show();
          },
          success: function (jsonData) {
            spinner.hide();

            cache[cacheProp] = [];

            if (
              options.source == ac_Source.globalCityLocation ||
              options.source == ac_Source.areaLocation
            ) {
              if (jsonData && jsonData.length > 0) {
                cache[cacheProp] = $.map(jsonData, function (item) {
                  return {
                    result: item.result,
                    payload: item.payload
                  };
                });
              } else {
                cache[cacheProp] = undefined;
              }
            } else {
              if (jsonData != null && jsonData.length > 0) {
                var isNewsFilter = options.newsFilter;

                cache[cacheProp] = $.map(jsonData, function (item) {
                  if (isNewsFilter) {
                    item.label = item.label
                      .replace("All", "")
                      .replace("Cars", "");
                  }
                  if (
                    isNewsFilter &&
                    item.label.toLowerCase().indexOf(" vs") > 0
                  ) {
                    return;
                  }
                  return {
                    label: item.label,
                    value: item.value,
                    imgSrc: item.imgSrc
                  };
                });
              } else {
                globalSearchAdTracking.featuredModelIdPrev = 0;
                cache[cacheProp] = undefined;
              }
            }
          }
        },

        template: {
          type: "custom",
          method: function (value, item) {
            var isLocationSearch =
              options.source == ac_Source.globalCityLocation ||
              options.source == ac_Source.areaLocation;
            var isNewsFilter =
              typeof options.newsFilter != "undefined" && options.newsFilter,
              listElement,
              elementLabel;
            var isNcfLink = null;
            if (item.value) {
              isNcfLink = item.value.split(":")[0];
            }
            var isLink =
              !isLocationSearch && item.value.indexOf("desktoplink") == 0;
            if (isLink && item.value.split("mobilelink:")[1] == "") return;

            if (isNewsFilter == true) {
              item.label = item.label.replace("All", "").replace("Cars", "");
            }

            if (isNewsFilter && item.label.toLowerCase().indexOf(" vs") > 0) {
              return;
            }

            if (isLocationSearch) {
              listElement =
                '<a class="list-item" cityname="' +
                item.result.replace(/\s/g, "").toLowerCase() +
                '">' +
                value +
                "</a>";

              return listElement;
            }

            if (isNcfLink === "ncfLink") {
              elementLabel =
                '<a style="color:#0288d1;" class="position-rel" cityname="' +
                item.label.replace(/\s/g, "").toLowerCase() +
                '">' +
                value +
                "</a>";
            } else {
              elementLabel =
                '<a class="position-rel" cityname="' +
                item.label.replace(/\s/g, "").toLowerCase() +
                '">' +
                value +
                "</a>";
            }

            var val = item.value.split("|");
            if (val.indexOf("sponsor") > 0 && !isNewsFilter) {
              var label =
                item.label +
                "_" +
                globalSearchAdTracking.targetModelName +
                "_" +
                suggestions.count +
                "_" +
                (suggestions.position + 1);

              var elementImg = "";
              if (item.imgSrc !== undefined && item.imgSrc != "") {
                elementImg =
                  '<img class="padding-right20" src="' + item.imgSrc + '">';
              }

              listElement =
                '<div class="list-item">' +
                elementImg +
                elementLabel +
                '<span class="font10 position-abt text-light-grey pos-top0 pos-right10">Ad</span>';
            } else {
              listElement = '<div class="list-item">' + elementLabel;
              globalSearchAdTracking.targetModelName = item.label;
            }
            if (options.isOnRoadPQ == 1 && !isLink) {
              var isUpcoming = false;
              if (val.indexOf("upcoming") > 0) {
                isUpcoming = true;
              }

              var isComparision = false;
              if (item.label.toLowerCase().indexOf(" vs ") > 0) {
                isComparision = true;
              }

              var make = item.value.split("|")[0];
              var model = item.value.split("|")[1];
              var pqModelId = 0;
              if (model != undefined && model.indexOf(":") > 0) {
                pqModelId = model.split(":")[1];
              }

              if (isUpcoming) {
                listElement +=
                  '<span class="rightfloat font12">Coming soon</span>';
              } else if (
                !isComparision &&
                !isNewsFilter &&
                (typeof isEligibleForORP == "undefined" || !isEligibleForORP)
              ) {
                if (pqModelId > 0) {
                  listElement +=
                    '<a class="OnRoadPQ rightfloat text-link font12" modelid="' +
                    pqModelId +
                    '" onClick= "cwTracking.trackCustomData(' +
                    ($(options.inputField).attr("id") === "globalSearch"
                      ? "'GlobalSearch'"
                      : "'HomePage'") +
                    ",'OnRoadLinkClick','make:" +
                    make.split(":")[0] +
                    "|model:" +
                    model.split(":")[0] +
                    "|city:" +
                    $.cookie("_CustCityMaster") +
                    "');getOnRoadPQ(this," +
                    pqModelId +
                    "," +
                    options.pQPageId +
                    ');">Check On-Road Price</a>';
                }
              }
              listElement += '<div class="clear"></div></div>';

              return listElement;
            } else {
              return listElement;
            }
          }
        },

        list: {
          maxNumberOfElements: options.isNcf
            ? options.resultCount + 1
            : options.resultCount,
          onChooseEvent: function (event) {
            options.click(event);
          },
          onLoadEvent: function () {
            var suggestionResult = $(options.inputField).getItems();

            if (
              options.afterFetch != null &&
              typeof options.afterFetch == "function"
            ) {
              options.afterFetch(suggestionResult, requestTerm);
            }
          }
        }
      });

      $(this).keyup(function () {
        if (options.keyup != undefined) {
          options.keyup();
        }

        if (
          $(options.inputField)
            .val()
            .replace(/\s/g, "").length == 0 &&
          options.onClear != undefined
        ) {
          options.onClear();

          $(options.inputField)
            .closest(".easy-autocomplete")
            .find("ul")
            .hide();

          GetGlobalSearchCampaigns.logImpression(
            "#global-search-popup-cars",
            "history",
            true
          );
          GetGlobalSearchCampaigns.logImpression(
            "#global-search-popup-cars",
            "trending",
            true
          );
          $(".global-search-section").show();
        }
      });

      $(this).focusout(function () {
        if (options.focusout != undefined) {
          options.focusout();
        }
      });

      function __getValue(key, value) {
        if (value != null && value != undefined && value != "") {
          return key + "=" + value + "&";
        } else {
          return "";
        }
      }
    });
  };
})(jQuery);

// Used City autocomplete code
var objUsedCar = new Object();
if (Number(masterCityIdCookie) > 0) {
  objUsedCar.Name = masterCityNameCookie;
  objUsedCar.Id = masterCityIdCookie;
}
$(document).on("mastercitychange", function (event, cityName, cityId) {
  objUsedCar.Name = cityName;
  objUsedCar.Id = cityId;
  if ($.globalCityChange != undefined) {
    $.globalCityChange(cityId, cityName);
  } else if (typeof search === "undefined" || !search.listing) {
    Common.masterCityPopup.masterCityChange();
  }
});
var label = null;
var id = null;

$("#usedCarsList").cw_easyAutocomplete({
  inputField: $("#usedCarsList"),
  resultCount: 5,
  source: ac_Source.usedCarCities,
  onClear: function () {
    objUsedCar = {};
  },

  click: function (event) {
    //ga('send', 'event', 'FindUsedCars-City', 'orgval:' + orgTxt + ' | selval:' + ui.item.label, '');

    var selectionValue = $("#usedCarsList").getSelectedItemData().value,
      selectionLabel = $("#usedCarsList").getSelectedItemData().label;

    objUsedCar.Name = formatSpecial(selectionLabel);
    objUsedCar.Id = selectionValue;
    label = formatSpecial(selectionLabel);
    id = selectionValue;
  },

  afterFetch: function (result, searchText) {
    objUsedCar.result = result;
  },

  keyup: function () {
    objUsedCar = {};
    objUsedCar.Name = label;
    objUsedCar.Id = id;
  },

  focusout: function () {
    if (
      (objUsedCar.Name == undefined ||
        objUsedCar.Name == null ||
        objUsedCar.Name == "") &&
      objUsedCar.result != undefined &&
      objUsedCar.result != null &&
      objUsedCar.result.length > 0
    ) {
      if (
        objUsedCar.result[0].label.toLowerCase().indexOf(
          $("#usedCarsList")
            .val()
            .toLowerCase()
        ) == 0
      ) {
        objUsedCar.Name = formatSpecial(objUsedCar.result[0].label);
        objUsedCar.Id = formatSpecial(objUsedCar.result[0].value);
        $("#usedCarsList").val(objUsedCar.result[0].label);
      }
    }
  }
});
// Moved to set-cookie.js part 1 -- Start
function SetCookieInDays(cookieName, cookieValue, nDays) {
  var today = new Date();
  var expire = new Date();
  expire.setTime(today.getTime() + 3600000 * 24 * nDays);
  document.cookie =
    cookieName +
    "=" +
    cookieValue +
    ";expires=" +
    expire.toGMTString() +
    "; domain=" +
    defaultCookieDomain +
    "; path =/";
  if (cookieName == "_CustCityIdMaster" && Number(cookieValue) > 0) {
    var name = $.cookie("_CustCityMaster");
    var id = $.cookie("_CustCityIdMaster");
  }
}
// Moved to set-cookie.js part 1 -- End
function checkpath() {
  return false;
}
// Moved to set-cookie.js part 2 -- Start
function isCookieExists(cookiename) {
  var coockieVal = $.cookie(cookiename);
  if (
    coockieVal == undefined ||
    coockieVal == null ||
    coockieVal == "-1" ||
    coockieVal == "-2"
  )
    return false;
  return true;
}
// Moved to set-cookie.js part 2 -- End
function showHideMatchError(error) {
  if (error) {
    $(".global-city-error-icon").removeClass("hide");
    $(".global-city-error-msg").removeClass("hide");
    $("#globalCityPopUp").addClass("border-red");
  } else {
    $(".global-city-error-icon").addClass("hide");
    $(".global-city-error-msg").addClass("hide");
    $("#globalCityPopUp").removeClass("border-red");
  }
}
// Moved to set-cookie.js part 3 -- Start
function setCookie(CustCityMaster, CustCityIdMaster) {
  var now = new Date();
  var Time = now.getTime();
  Time += 1000 * 60 * 60 * 24 * 30;
  now.setTime(Time);
  document.cookie =
    "_CustCityMaster=" +
    CustCityMaster +
    "; expires = " +
    now.toGMTString() +
    "; domain=" +
    defaultCookieDomain +
    "; path =/";
  document.cookie =
    "_CustCityIdMaster=" +
    CustCityIdMaster +
    "; expires = " +
    now.toGMTString() +
    "; domain=" +
    defaultCookieDomain +
    "; path =/";
}
// Moved to set-cookie.js part 3 -- End

//moved to globalSearch.js
function globalAutoSearch(make, model, version, google, suggestions) {
  var userInput = "";
  if (version != null && version != undefined) {
    userInput = make.name + " " + model.name + " " + version.name;
    trackBhriguSearchTracking(
      "",
      "",
      "",
      "",
      "",
      userInput,
      "|modelid=" + model.id
    );
    trackTopMenu("Global-AutoSuggest-Value-Click", userInput);
    window.location.href =
      "/m/" + make.name + "-cars/" + model.name + "/" + version.name + "/";
    return true;
  }
  if (model != null && model != undefined) {
    userInput =
      suggestions.count +
      "_" +
      suggestions.position +
      "_" +
      suggestReqTerm +
      "_" +
      make.name +
      " " +
      model.name;
    trackBhriguSearchTracking(
      "",
      "",
      suggestions.count,
      suggestions.position,
      suggestReqTerm,
      make.name + " " + model.name,
      "|modelid=" + model.id
    );
    trackTopMenu("Global-AutoSuggest-Value-Click", userInput);
    window.location.href = "/" + make.name + "-cars/" + model.name + "/";
    return true;
  }
  if (make != null && make != undefined) {
    userInput =
      suggestions.count +
      "_" +
      suggestions.position +
      "_" +
      suggestReqTerm +
      "_" +
      make.name;
    trackBhriguSearchTracking(
      "",
      "",
      suggestions.count,
      suggestions.position,
      suggestReqTerm,
      make.name
    );
    trackTopMenu("Global-AutoSuggest-Value-Click", userInput);
    window.location.href = "/m/" + make.name + "-cars/";
    return true;
  }
  return false;
}

var objGlobalSearch = new Object();
var globalModelId = null;
var globalMakeId = null;
var globalMakeName = null;
var globalModelName = null;
var noResult = true;

var globalSearchInputField = $("#globalSearchPopup"),
  globalSearchClearButton = $("#gs-text-clear");

globalSearchInputField.track = debounce(function () {
  trackTopMenu("Global-Search-With-value-Click", suggestReqTerm);
}, 1000);
$(globalSearchInputField).cw_easyAutocomplete({
  inputField: globalSearchInputField,
  resultCount: 5,
  isNcf: 1,
  isNew: 1,
  isOnRoadPQ: 1,
  doOrpChecks: true,
  pQPageId: 80,
  additionalTypes: ac_textTypeEnum.link,
  source: ac_Source.generic,

  click: function (event) {
    suggestions = {
      position: globalSearchInputField.getSelectedItemIndex() + 1,
      count: objGlobalSearch.result.length
    };

    var selectionValue = globalSearchInputField.getSelectedItemData().value,
      splitVal = selectionValue.split("|"),
      label = globalSearchInputField.getSelectedItemData().label;

    if (selectionValue.indexOf("mobilelink:") > 0) {
      var mobilelinkLabel =
        suggestions.count +
        "_" +
        suggestions.position +
        "_" +
        suggestReqTerm +
        "_" +
        label;
      trackBhriguSearchTracking(
        "",
        "",
        suggestions.count,
        suggestions.position,
        suggestReqTerm,
        label
      );
      trackTopMenu("Global-AutoSuggest-Value-Click", mobilelinkLabel);
      window.location.href = selectionValue.split("mobilelink:")[1];
      return false;
    }
    if (label.indexOf(" vs ") > 0) {
      var model1 = "|modelid1=" + splitVal[0].split(":")[1];
      var model2 = "|modelid2=" + splitVal[1].split(":")[1];
      trackBhriguSearchTracking(
        "",
        "",
        suggestions.count,
        suggestions.position,
        suggestReqTerm,
        label,
        model1 + model2
      );
      Common.redirectToComparePage(splitVal);
      var compareCars = {};
      return false;
    }

    var make = {};
    make.name = splitVal[0].split(":")[0];
    make.id = splitVal[0].split(":")[1];

    var sourceElement = $(event.srcElement);
    if (event.srcElement == undefined) {
      sourceElement = $(event.originalEvent.target);
    }

    if (sourceElement.hasClass("OnRoadPQ")) {
      var modelLabel = "|modelid=" + splitVal[1].split(":")[1];
      var pqSearchLabel =
        suggestions.count +
        "_" +
        suggestions.position +
        "_" +
        suggestReqTerm +
        "_" +
        make.name +
        "_" +
        splitVal[1].split(":")[0];
      trackBhriguSearchTracking(
        "",
        "",
        suggestions.count,
        suggestions.position,
        suggestReqTerm,
        make.name + " " + splitVal[1].split(":")[0],
        modelLabel
      );
      trackTopMenu("Global-AutoSuggest-PQlink-Click", pqSearchLabel);
      return false;
    }

    if (selectionValue.indexOf("sponsor") > 0) {
      var modelLabel = "|modelid=" + splitVal[1].split(":")[1];
      var sponsorLabel =
        globalSearchAdTracking.featuredModelName +
        "_" +
        globalSearchAdTracking.targetModelName +
        "_" +
        suggestions.count +
        "_" +
        suggestions.position;
      trackBhriguSearchTracking(
        "",
        "Sponsored",
        suggestions.count,
        suggestions.position,
        suggestReqTerm,
        globalSearchAdTracking.featuredModelName +
        "_" +
        globalSearchAdTracking.targetModelName,
        modelLabel
      );
      trackGlobalSearchAd("New_m_Click", sponsorLabel, "SearchResult_Ad_m");
      cwTracking.trackCustomData(
        "SearchResult_Ad_m",
        "New_m_Click",
        sponsorLabel,
        false
      );
    }

    if (splitVal[0].split(":")[0] === "ncfLink") {
      trackBhriguSearchTracking(
        "",
        "",
        suggestions.count,
        suggestions.position,
        suggestReqTerm,
        splitVal[0].split(":")[1]
      );
      Common.utils.trackAction(
        "CWInteractive",
        "NCFLinkageCategory",
        "NCFGlobalsearchlinkclick",
        suggestReqTerm + "_" + suggestions.position + "/" + suggestions.count
      );
      window.location.href = splitVal[0].split(":")[1];
      return false;
    }

    objGlobalSearch.Name = formatSpecial(label);
    objGlobalSearch.Id = selectionValue;

    var model = null;
    if (splitVal[1] != undefined && splitVal[1].indexOf(":") > 0) {
      model = {};
      model.name = splitVal[1].split(":")[0];
      model.id = splitVal[1].split(":")[1];
    }

    globalAutoSearch(
      make,
      model,
      null,
      globalSearchInputField.val(),
      suggestions
    );
  },

  afterFetch: function (result, searchText) {
    objGlobalSearch.result = result;
    noResult =
      objGlobalSearch.result != undefined && objGlobalSearch.result.length > 0
        ? false
        : true;
    suggestReqTerm = searchText;

    if (
      result.filter(function (suggestion) {
        return suggestion.value.toString().indexOf("sponsor") > 0;
      }).length > 0
    ) {
      globalSearchAdTracking.trackData(result, "SearchResult_Ad_m");
    } else {
      globalSearchAdTracking.featuredModelIdPrev = 0;
    }

    if (
      result.find(function (item) {
        return item.value.split(":")[0] === "ncfLink";
      })
    ) {
      Common.utils.trackAction(
        "CWNonInteractive",
        "NCFLinkageCategory",
        "NCFGlobalsearchlinkdisplayed",
        searchText
      );
    }

    if (noResult == true) globalSearchInputField.track();
  },

  onClear: function () {
    objGlobalSearch = {};
    globalSearchAdTracking.featuredModelIdPrev = 0;

    $(".global-search-section").show();
  },

  keyup: function () {
    if (globalSearchInputField.val().length != 0) {
      globalSearchClearButton.show();
      $(".global-search-section").hide();
    } else {
      globalSearchClearButton.hide();
      globalSearchInputField
        .closest(".form-control-box")
        .find(".fa-spinner")
        .hide();
    }
  }
});

$("#gs-text-clear, #gs-text-clear-pq").click(function () {
  trackTopMenu(
    "Global-Search-Close-Icon-Click",
    $("#globalSearchPopup").val("")
  );
  globalSearchInputField.val("").focus();
  $("#globalSearchPQ")
    .val("")
    .change()
    .focus();
  $(".global-search-section").show();
  globalSearchClearButton.hide();
  $("#gs-text-clear-pq").hide();
});

function trackTopMenu(action, label) {
  dataLayer.push({
    event: "TopMenu",
    cat: "TopMenu-Mobile",
    act: action,
    lab: label
  });
}

function trackBhriguSearchTracking(
  category,
  action,
  count,
  position,
  term,
  result,
  modelLabel
) {
  cwTracking.trackCustomData(
    category + "GlobalSearch",
    action + "Click",
    getBhriguSearchLabel(count, position, term, result, modelLabel),
    true
  );
}

function getBhriguSearchLabel(count, position, term, result, modelLabel) {
  return (
    (count != "" ? "count=" + count : "") +
    (position != "" ? "|pos=" + position : "") +
    (term != "" ? "|term=" + term : "") +
    (result != "" ? "|result=" + result : "") +
    (modelLabel ? modelLabel : "")
  );
}

function trackNavigation(action, label) {
  dataLayer.push({
    event: "Navigation-drawer",
    cat: "Navigation-drawer-Mobile",
    act: action,
    lab: label
  });
}

function trackTabs(action, label) {
  dataLayer.push({
    event: "M-Site-Homepage",
    cat: "FirstPanel-Mobile-HP",
    act: action,
    lab: label
  });
}

function trackGlobalSearchAd(action, label, category) {
  dataLayer.push({
    event: "CWInteractive",
    cat: category,
    act: action,
    lab: label
  });
}

function getQueryStringParam(name, url) {
  if (url == undefined) url = window.document.URL;
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regexS = "[\\?&]" + name + "=([^&?]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  if (results == null) return "";
  else return results[1];
}
/* Deleted here and moved to _AndroidAppDownload.cshtml
function CloseAndroidLink() {
    $("#divAndroid").slideUp(500);
    $("#hrAndroid").hide();
    var expiryTime = 1000 * 60 * 60 * 24 * 30;  //30 days
    var expires = new Date((new Date()).valueOf() + expiryTime);
    document.cookie = "AndroidDownload=1;expires=" + expires.toUTCString() + ";path=/";
}
*/
//back button function
$(function () {
  var backFlag, sellerFlag, sellPopFlag;
  var hash = location.hash.substring(1);
  if ((hash != "" && hash == "back") || (hash != "" && hash == "sellPopup")) {
    history.replaceState(null, null, location.pathname + location.search);
  }
  $(window).bind("hashchange", function (e) {
    pagiFlag = false;
    hash = location.hash.substring(1);
    var filterPopname = $(
      'div.filterBackArrow[popupname="filterpopup"]:visible'
    );
    var popname = $('div.filterBackArrow[popupname!="filterpopup"]:visible');
    if (hash == "back") {
      backFlag = false;

      if (
        location.hash.substring(1) == "back" &&
        !$("#filter-div,#sort-by-div").is(":visible")
      ) {
        history.back();
      }
    } else if (
      backFlag == false &&
      hash != "back" &&
      $("#filter-div,#sort-by-div").is(":visible")
    ) {
      popname.trigger("click");
      filterPopname.trigger("click");
      backFlag = true;
    }
    // seller info detail
    /*if (hash == 'sellerInfo') {
            sellerFlag = false;
        }
        else if (sellerFlag == false) {
            $("#userDetailsContainer").show();
            $("#divVerification").hide();
            $("#sellerDetailsContainer").hide();
            $("#imgGetDetailsProcess").hide();
            $("#imgCodeVerify").hide();
            sellerFlag = true;
        }*/

    // seller popup detail
    if (hash == "sellPopup") {
      sellPopFlag = false;
    } else if (sellPopFlag == false) {
      $("#getSellerContainer").slideUp();
      $("#m-blackOut-window").hide();
      sellPopFlag = true;
    }
  });
});

function formatNumeric(inputPrice) {
  var inputPrice = inputPrice.toString();
  var formattedPrice = "";
  var breakPoint = 3;
  for (var i = inputPrice.length - 1; i >= 0; i--) {
    formattedPrice = inputPrice.charAt(i) + formattedPrice;
    if (inputPrice.length - i == breakPoint && inputPrice.length > breakPoint) {
      formattedPrice = "," + formattedPrice;
      breakPoint = breakPoint + 2;
    }
  }
  return formattedPrice;
}
function triggerOffersTrackingCode(cat, act, labInput) {
  if (labInput.length > 1)
    dataLayer.push({
      event: "CWGuaranteeOffer",
      cat: cat,
      act: act,
      lab: labInput
    });
  else dataLayer.push({ event: "CWGuaranteeOffer", cat: cat, act: act });
}

function openCityPopUp(selectedCity, callBackFunction) {
  callBackFunction(selectedCity);
  bindPQCities();
  lockPopup();
}
function bindPQCities(modelId) {
  if (modelId != undefined) selectedModelId = modelId;
  var currentPopup = $(".selectCitydiv");
  showLoading(currentPopup, currentPopup.prev());
  $.ajax({
    type: "GET",
    url: "/webapi/GeoCity/GetGeoPqStatesByModelId/?modelid=" + selectedModelId,
    dataType: "Json",
    success: function (json) {
      var viewModel = {
        pqStates: ko.observableArray(json.states)
      };
      ko.cleanNode(document.getElementById("StatesList-pq"));
      ko.applyBindings(viewModel, document.getElementById("StatesList-pq"));

      var cityViewModel = {
        pqCities: ko.observableArray(json.cities)
      };
      ko.cleanNode(document.getElementById("main-citiesList-pq"));
      ko.applyBindings(
        cityViewModel,
        document.getElementById("main-citiesList-pq")
      );

      hideLoadingpopup(currentPopup);
    }
  });
}

function showLoading(currentPopup, prevPopup) {
  prevPopup.hide();
  currentPopup.find("div.popup_content").hide();
  currentPopup.find("div.m-loading-popup").show();
  currentPopup
    .addClass("popup_layer")
    .show()
    .scrollTop(0);
}

function redirectOrOpenPopup(btn, pqpageid) {
  var modelId = $(btn).attr("modelid");
  var versionId = $(btn).attr("versionid") || "0";
  var isCityPage =
    pqpageid == Common.PQ.PageId.DealerLocatorModelCarousel ||
    pqpageid == Common.PQ.PageId.PriceInCityPage;
  var cityId = isCityPage
    ? $(btn).attr("cityid")
    : $.cookie("_CustCityIdMaster");
  var areaId =
    isCityPage && Number(cityId) != Number($.cookie("_CustCityIdMaster"))
      ? ""
      : $.cookie("_CustAreaId");
  var cityName = isCityPage
    ? $(btn).attr("cityname")
    : $.cookie("_CustCityMaster");

  if ($.inArray(Number(cityId), askingAreaCityId) < 0 || Number(areaId) > 0) {
    Common.PQ.redirectToNewPqPage(
      modelId,
      versionId,
      cityId,
      areaId,
      false,
      pqpageid,
      null,
      null,
      false
    );
  } else {
    if (typeof LOCATION_EVENTS !== "undefined") {
      postCallback = function (params) {
        if (
          params.newStore.location.cityId !== params.oldStore.location.cityId ||
          params.newStore.location.areaId !== params.oldStore.location.areaId
        ) {
          var areaId = params.newStore.location.areaId;
          if (typeof areaId === "undefined") {
            areaId = 0;
          }
          Common.PQ.redirectToNewPqPage(
            modelId,
            versionId,
            params.newStore.location.cityId,
            areaId,
            false,
            pqpageid,
            null,
            null,
            false
          );
        }
      };
      LOCATION_EVENTS.openPopup(globalLocation.citieswithArea, true);
      globalLocation.onLocationStorePropertyChange("isActive", postCallback);
    }
  }
}

function logError(errMsg, errorDetails, fnName, urlName) {
  var resultData = {
    Message: errMsg,
    ErrorDetails: errorDetails,
    MethodName: fnName,
    PathName: urlName
  };
}
// Moved to set-cookie.js part 5 -- Start
function permanentCookieTime() {
  var now = new Date();
  var time = now.getTime();
  time += 1000 * 60 * 60 * 4320;
  now.setTime(time);
  return now.toGMTString();
}
// Moved to set-cookie.js part 5 -- End
function openZonePopUp(selectedCityForZones) {
  var prevPopup = $(".selectCitydiv");
  var currentPopup = $(".otherCitiesDiv-pq");
  showLoading(currentPopup, prevPopup);
  $.ajax({
    type: "GET",
    url:
      "/api/pq/cities/?modelid=" +
      selectedModelId +
      "&cityid=" +
      $(selectedCityForZones).val(),
    dataType: "Json",
    success: function (json) {
      var viewModel = {
        pqZones: ko.observableArray(json.groupCities)
      };
      ko.cleanNode(document.getElementById("zonesList-pq"));
      ko.applyBindings(viewModel, document.getElementById("zonesList-pq"));
      hideLoadingpopup(currentPopup);
    }
  });
}
// Moved to formvalidation.js -- Start
var form = {
  validation: {
    contact: function (Name, Email, MobileNo) {
      var errMsgs = [];
      errMsgs[0] = form.validation.checkName($.trim(Name));
      errMsgs[1] = form.validation.checkEmail($.trim(Email));
      errMsgs[2] = form.validation.checkMobile($.trim(MobileNo));
      return errMsgs;
    },
    checkName: function (name) {
      var reName = /^([-a-zA-Z ']*)$/;
      var nameMsg = "";
      if (
        name == "" ||
        name == "Enter your name" ||
        name == "Enter Your Name"
      ) {
        nameMsg = "Please provide your name";
      } else if (reName.test(name) == false) {
        nameMsg = "Please provide only alphabets";
      } else if (name.length == 1) {
        nameMsg = "Please provide your complete name";
      } else if (name.length > 30) {
        nameMsg = "Your name should not have more than 30 characters";
      }
      return nameMsg;
    },
    checkEmail: function (email) {
      var reEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
      var emailMsg = "";
      if (email == "" || email == "Enter your e-mail id") {
        emailMsg = "Please provide your Email Id";
      } else if (!reEmail.test(email.toLowerCase())) {
        emailMsg = "Invalid Email Id";
      }
      return emailMsg;
    },
    checkMobile: function (mobileNo) {
      var reMobile = /^[6789]\d{9}$/;
      var mobileMsg = "";
      if (mobileNo == "" || mobileNo == "Enter your mobile number") {
        mobileMsg = "Please provide your mobile number";
      } else if (mobileNo.length != 10) {
        mobileMsg = "Enter your 10 digit mobile number";
      } else if (reMobile.test(mobileNo) == false) {
        mobileMsg = "Please provide a valid 10 digit Mobile number";
      }
      return mobileMsg;
    }
  }
};
// Moved to formvalidation.js -- End
//binds the cities based on the state selected
function stateChanged(selectedState) {
  var prevPopup = $(".selectCitydiv");
  var currentPopup = $(".citiesByState-list-pq");
  showLoading(currentPopup, prevPopup);
  $("#searchByCity").val("");
  $.ajax({
    type: "GET",
    url:
      "/api/pq/cities/?modelid=" +
      selectedModelId +
      "&stateid=" +
      $(selectedState).val(),
    dataType: "Json",
    success: function (json) {
      var viewModel = {
        pqCitiesByStates: ko.observable(Common.PQ.getCityZonesForBinding(json))
      };
      ko.cleanNode(document.getElementById("citiesByStatesList-pq"));
      ko.applyBindings(
        viewModel,
        document.getElementById("citiesByStatesList-pq")
      );
      hideLoadingpopup(currentPopup);
      $("#searchByCity").cw_fastFilter("#citiesByStatesList-pq");
      if ($("div.noFound").length > 0) $("div.noFound").remove();
    }
  });
}

function cityChanged(cityLi) {
  showPrefilLoading();
  window.location.href = "/m/research/quotation.aspx";
  selectedCityId = $(cityLi).val();
  selectedCityName = $(cityLi)
    .text()
    .trim();
  setCookies(selectedCityId, selectedCityName, "", "");
  window.location.href = "/m/research/quotation.aspx";
  closeCityPopup(selectedCityId, selectedCityName, "", "");
}
function zoneChanged(zoneLi) {
  showPrefilLoading();
  window.location.href = "/m/research/quotation.aspx";
  selectedCityId = $(zoneLi)
    .attr("cityid")
    .trim();
  selectedCityName = $(zoneLi).attr("cityname");
  selectedZoneId = $(zoneLi).attr("zoneid");
  selectedZoneName = $(zoneLi).attr("zonename");
  setCookies(
    selectedCityId,
    selectedCityName,
    selectedZoneId,
    selectedZoneName
  );
  closeCityPopup(
    selectedCityId,
    selectedCityName,
    selectedZoneId,
    selectedZoneName
  );
}
function hideLoadingpopup(currentPopup) {
  //currentPopup.show();
  currentPopup.find("div.popup_content").show();
  currentPopup.find("div.m-loading-popup").hide();
}

function closeWindow() {
  $(".selectCitydiv").hide();
  unlockPopup();
}

function popularCity_Click(node) {
  // TODO: Bangalore zone refactoring
  //open zone popup for Mumbai and Delhi
  if ($.inArray($(node).val(), [1, 2, 10, 12, 128, 176, 105, 198]) >= 0)
    openZonePopUp(node);
  else cityChanged(node);
}

function closeCityPopup(
  selectedCityId,
  selectedCityName,
  selectedZoneId,
  selectedZoneName
) {
  $(".citiesByState-list-pq").hide();
  $(".otherCitiesDiv-pq").hide();
  $(".selectCitydiv").hide();
  unlockPopup();
}

function clearSearchText(txtBox) {
  var $this = $(txtBox);
  var $srachTxtBox = $this
    .closest(".cross-box-wrap")
    .find('input[type="text"]');
  $srachTxtBox
    .val("")
    .keydown()
    .focus();
  $("div.noFound").remove();
  $this.hide();
}
// Moved to set-cookie.js part 4 -- Start
function setCookies(
  selectedCityId,
  selectedCityName,
  selectedZoneId,
  selectedZoneName
) {
  document.cookie =
    "_CustCityId=" +
    selectedCityId +
    "; expires = " +
    permanentCookieTime() +
    "; domain=" +
    defaultCookieDomain +
    "; path =/";
  document.cookie =
    "_CustCity=" +
    selectedCityName +
    "; expires = " +
    permanentCookieTime() +
    "; domain=" +
    defaultCookieDomain +
    "; path =/";
  if (selectedZoneId != "")
    document.cookie =
      "_PQZoneId=" +
      selectedZoneId +
      "; expires = " +
      permanentCookieTime() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/";
  else
    document.cookie =
      "_PQZoneId=" +
      "" +
      "; expires = " +
      permanentCookieTime() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/";

  if (selectedZoneName != "")
    document.cookie =
      "_CustCity=" +
      selectedZoneName +
      "; expires = " +
      permanentCookieTime() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/";
}
// Moved to set-cookie.js part 4 -- End
//show previous popup when back btn is clicked
function showPrevPopup() {
  $(".citiesByState-list-pq").hide();
  $(".otherCitiesDiv-pq").hide();
  $(".selectCitydiv").show();
}

function showPrefilLoading() {
  $("#m-blackOut-window").show();
  $("div.m-loading-popup").show();
}

// Hide Loading Screen
function hidePrefilLoading() {
  $("#m-blackOut-window").hide();
  $("div.m-loading-popup").hide();
}

function checkModelExistsForPQCookie(modelId, cookieValue) {
  var index = -1;
  $.ajax({
    type: "GET",
    url: "/webapi/GeoCity/GetPQCitiesByModelId/?modelid=" + modelId,
    dataType: "Json",
    async: false,
    beforeSend: showPrefilLoading,
    success: function (json) {
      index = findInArray(cookieValue, json, "CityId");
      hidePrefilLoading();
    }
  });
  return Number(index) >= 0;
}

var Common = {
  USERIP: typeof USERIP === "undefined" ? "" : USERIP,
  doc: $(document),
  showCityPopup: true,
  googleApiKey: "",
  cwShortenedDomain: "cwle.in",
  getUtma: function () {
    try {
      var sessionCheck = !$.cookie("__utma")
        ? "1"
        : $.cookie("__utma").split(".")[5];
      return sessionCheck;
    } catch (ex) {
      console.log(ex);
    }
  },
  is1stVistOfUtmaSession: function () {
    if (checkpath() == false || Common.showCityPopup == false) return false;
    try {
      var rawCookie = $.cookie("_utmaCnt");
      if (rawCookie == null || Number(rawCookie) != Number(Common.getUtma())) {
        document.cookie =
          "_utmaCnt=" +
          Common.getUtma() +
          "; expires = " +
          permanentCookieTime() +
          "; path =/";
        return true;
      }
      if (Number(rawCookie) == Number(Common.getUtma())) {
        return false;
      }
      console.log("is1stVistOfUtmaSession() failure");
      return true;
    } catch (ex) {
      console.log(ex);
    }
  },
  getCompareUrl: function (dataList) {
    try {
      var compareUrl = "",
        i;
      dataList.sort(function (a, b) {
        return Number(a.id) > Number(b.id);
      });
      for (i = dataList.length - 1; i >= 0; i--) {
        compareUrl += dataList[i].text;
        if (i !== 0) {
          compareUrl += "-vs-";
        }
      }
      return compareUrl;
    } catch (e) {
      throw new Error(e);
    }
  },
  utils: {
    isInDescOrder: function (inputArray) {
      if (inputArray instanceof Array) {
        for (var i = 0; i < inputArray.length - 1; i++) {
          if (inputArray[i] < inputArray[i + 1]) {
            return false;
          }
        }
        return true;
      } else {
        throw new Error("This function accepts an array as input.");
      }
    },
    setUrlTitleOnScroll: function (
      currScroll,
      scrollPositionDict,
      urlTitleObject
    ) {
      if (scrollPositionDict.length > 0) {
        var dictLength = scrollPositionDict.length;
        if (
          currScroll < scrollPositionDict[0].key &&
          document.title != urlTitleObject[0].Title
        ) {
          document.title = urlTitleObject[scrollPositionDict[0].value].Title;
          window.history.replaceState(
            currScroll,
            urlTitleObject[scrollPositionDict[0].value].Title,
            urlTitleObject[scrollPositionDict[0].value].Url
          );
          return true;
        } else if (
          currScroll > scrollPositionDict[dictLength - 1].key &&
          document.title !=
          urlTitleObject[scrollPositionDict[dictLength - 1].value].Title
        ) {
          document.title =
            urlTitleObject[scrollPositionDict[dictLength - 1].value].Title;
          window.history.replaceState(
            currScroll,
            urlTitleObject[scrollPositionDict[dictLength - 1].value].Title,
            urlTitleObject[scrollPositionDict[dictLength - 1].value].Url
          );
          return true;
        } else {
          for (
            var checkScrollDict = 0;
            checkScrollDict < dictLength - 1;
            ++checkScrollDict
          ) {
            if (
              scrollPositionDict[checkScrollDict].key <= currScroll &&
              currScroll <= scrollPositionDict[checkScrollDict + 1].key &&
              document.title !=
              urlTitleObject[scrollPositionDict[checkScrollDict].value].Title
            ) {
              document.title =
                urlTitleObject[scrollPositionDict[checkScrollDict].value].Title;
              window.history.replaceState(
                currScroll,
                urlTitleObject[scrollPositionDict[checkScrollDict].value].Title,
                urlTitleObject[scrollPositionDict[checkScrollDict].value].Url
              );
              return true;
              break;
            }
          }
        }
      }
      return false;
    },
    firePageView: function (inputUrl) {
      try {
        ga("create", "UA-337359-1", "auto", { useAmpClientId: true });
        ga("send", "pageview", inputUrl);
      } catch (e) {
        setTimeout(function () {
          Common.utils.firePageView(inputUrl);
        }, 300);
      }
    },
    storageAvailable: function (type) {
      try {
        var storage = window[type],
          x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
      } catch (e) {
        return false;
      }
    },
    formatNumeric: function (inputPrice) {
      var inputPrice = inputPrice.toString();
      var formattedPrice = "";
      var breakPoint = 3;
      for (var i = inputPrice.length - 1; i >= 0; i--) {
        formattedPrice = inputPrice.charAt(i) + formattedPrice;
        if (
          inputPrice.length - i == breakPoint &&
          inputPrice.length > breakPoint
        ) {
          formattedPrice = "," + formattedPrice;
          breakPoint = breakPoint + 2;
        }
      }
      return formattedPrice;
    },

    showLoading: function () {
      // function for showing image Loading
      $("#m-blackOut-window").show();
      $("#cwmLoadingIcon").show();
    },

    hideLoading: function () {
      // function for hiding image Loading
      $("#m-blackOut-window").hide();
      $("#cwmLoadingIcon").hide();
    },

    formatSpecial: function (url) {
      reg = /[^/\-0-9a-zA-Z\s]*/g;
      url = url.replace(reg, "");
      var formattedUrl = url
        .toLowerCase()
        .replace(/ /g, "")
        .replace(/-/g, "")
        .replace("/", "");
      return formattedUrl;
    },

    trackAction: function (actionEvent, actionCat, actionAct, actionLabel) {
      var pushObject;
      if (actionLabel)
        pushObject = {
          event: actionEvent,
          cat: actionCat,
          act: actionAct,
          lab: actionLabel
        };
      else pushObject = { event: actionEvent, cat: actionCat, act: actionAct };
      setTimeout(function () {
        dataLayer.push(pushObject);
      }, 0);
    },

    prefillUserDetails: function () {
      $("input[prefill]").each(function (count, element) {
        element = $(element);
        switch (element.attr("prefill")) {
          case "name":
            element.val(Common.utils.getUserName());
            break;
          case "email":
            element.val(Common.utils.getUserEmail());
            break;
          case "mobile":
            element.val(Common.utils.getUserMobile());
            break;
        }
      });
    },

    trackImpression: function () {
      $("div[trackingImp]").each(function (count, element) {
        var impression = $(element);
        var trackingImp = impression.attr("trackingImp");
        if (trackingImp == "pbImpression")
          Common.utils.trackAction(
            "Financeleadsubmit",
            "pblink_variantpage_msite",
            "Link_shown",
            impression.attr("label")
          );
        else if (trackingImp == "bbImpression")
          Comment.utils.trackAction(
            "BBLink_finance",
            "BBLinkImpressions_mobile",
            "finance_variant_page",
            impression.attr("label")
          );
        else if (trackingImp == "pbImpressionModel")
          Common.utils.trackAction(
            "Financeleadsubmit",
            "pblink_modelpage_msite",
            "Link_shown",
            impression.attr("label")
          );
        else if (trackingImp == "bbImpressionModel")
          Common.utils.trackAction(
            "BBLink_finance",
            "BBLinkImpressions_mobile",
            "finance_model_page",
            impression.attr("label")
          );
        else if (trackingImp == "pbImpressionVariant")
          Common.utils.trackAction(
            "Financeleadsubmit",
            "pblink_variantpage_msite",
            "Link_shown",
            impression.attr("label")
          );
        else if (trackingImp == "bbImpressionVariant")
          Common.utils.trackAction(
            "BBLink_finance",
            "BBLinkImpressions_mobile",
            "finance_variant_page",
            impression.attr("label")
          );
        else if (trackingImp == "icImpressionvaluation")
          Common.utils.trackAction(
            "Financeleadsubmit",
            "Insurance_mobile",
            "Insurance_link_shown_on_Used_car_valuation",
            impression.attr("label")
          );
      });
    },
    eventTracking: function () {
      $(document).on("click", "[data-role='click-tracking']", function () {
        Common.utils.callTracking($(this));
      });
    },
    trackClicks: function () {
      $(document).on("click", "[data-role*='click']", function () {
        var _self = $(this);
        if (_self.data("role") == "click-tracking") return;
        var action = "_click";
        Common.utils.callTracking(_self, action);
      });
    },
    trackImpressions: function () {
      $("[data-role*='impression']").each(function (count, element) {
        var action = "_shown";
        Common.utils.callTracking($(this), action);
      });
    },
    trackImpressionsBySection: function (div) {
      $(div + " [data-role*='impression']").each(function (count, element) {
        var action = "_shown";
        Common.utils.callTracking($(this), action);
      });
    },
    callTracking: function (node, action) {
      if (action == undefined) action = "";
      try {
        var evCat = node.data("cat") ? node.data("cat") : "",
          evAct = node.data("action") ? node.data("action") + action : "",
          evLab = node.data("label") ? node.data("label") : "",
          evEvent = node.data("event")
            ? node.data("event")
            : action === "_shown"
              ? "CWNonInteractive"
              : action === "_click"
                ? "CWInteractive"
                : "";
        if (cwTracking.isApp()) {
          cwTracking.trackActionForApp(evEvent, evCat, evAct, evLab);
        } else Common.utils.trackAction(evEvent, evCat, evAct, evLab);
      } catch (e) {
        console.log(e);
      }
    },
    filterModelName: function (modelName) {
      if (modelName == null || modelName == "") {
        return "";
      }
      var index = modelName.indexOf("[");
      if (index >= 0) {
        return modelName.substring(0, index);
      } else {
        return modelName;
      }
    },

    getUserName: function () {
      var name = $.cookie("_CustomerName");
      if (name == null) {
        name = $.cookie("TempCurrentUser");
        name = name != null ? name.split(":")[0] : "";
      }
      return name;
    },
    getUserMobile: function () {
      var mobile = $.cookie("_CustMobile");
      if (mobile == null || mobile == "") {
        mobile = $.cookie("TempCurrentUser");
        mobile = mobile != null ? mobile.split(":")[1] : undefined;
      }
      return mobile;
    },
    getUserEmail: function () {
      var email = $.cookie("_CustEmail");
      if (email == null) {
        email = $.cookie("TempCurrentUser");
        email = email != null ? email.split(":")[2] : undefined;
      }
      return email;
    },
    setEachCookie: function (cname, cvalue) {
      var expires = "expires=" + permanentCookieTime();
      document.cookie =
        cname +
        "=" +
        cvalue +
        "; " +
        expires +
        "; domain=" +
        defaultCookieDomain +
        "; path =/";
    },
    ajaxCall: function (api, param) {
      if (typeof api == "object" && typeof api != "string") return $.ajax(api);

      var ajaxobject = {};
      if (typeof param == "object") {
        if (typeof api == "string") ajaxobject.url = api;
        if (typeof param.type != "undefined") ajaxobject.type = param.type;
        else {
          ajaxobject.type = "GET";
        }
        if (typeof param.success == "function")
          ajaxobject.success = param.success;
        if (typeof param.failure == "function")
          ajaxobject.failure = param.failure;
        if (typeof param.data != "undefined") ajaxobject.data = param.data;
        if (typeof param.dataType != "undefined")
          ajaxobject.dataType = param.dataType;
        if (typeof param.contentType != "undefined")
          ajaxobject.contentType = param.contentType;
        if (typeof param.headers != "undefined")
          ajaxobject.headers = param.headers;
      } else {
        ajaxobject.url = api;
        ajaxobject.type = "GET";
      }
      return $.ajax(ajaxobject);
    },
    getSplitCityName: function (locationName) {
      //function to split cityName from city,state format
      if (
        locationName != null &&
        locationName != undefined &&
        $.trim(locationName) != ""
      ) {
        locationName = locationName.split(",")[0];
      }
      return locationName;
    },
    unlockPopup: function (setScrollTimeout) {
      $("#blackOut-window, .blackOut-window").hide();
      var html = document.getElementsByTagName("html")[0];
      var scrollTop = parseInt(html.style.top);
      $("html").removeClass("lock-browser-scroll");
      if (typeof setScrollTimeout !== "undefined" && setScrollTimeout) {
        setTimeout(function () {
          $("html,body").scrollTop(-scrollTop);
        });
      } else {
        $("html,body").scrollTop(-scrollTop);
      }
    },
    lockPopup: function () {
      var html_el = $("html"),
        body_el = $("body");
      $(".blackOut-window").show();
      if (Common.doc.height() > $(window).height()) {
        var scrollTop = html_el.scrollTop()
          ? html_el.scrollTop()
          : body_el.scrollTop(); // Works for Chrome, Firefox, IE...
        if (scrollTop < 0) {
          scrollTop = 0;
        }
        html_el.addClass("lock-browser-scroll").css("top", -scrollTop);
      }
    },
    loadGoogleApi: function (callback, input) {
      var googleMapsApiJsPath = "";
      if (Common.googleApiKey.length > 0) {
        googleMapsApiJsPath =
          "https://maps.googleapis.com/maps/api/js?key=" +
          Common.googleApiKey +
          "&libraries=places&sensor=false";
      } else {
        googleMapsApiJsPath =
          "https://maps.googleapis.com/maps/api/js?libraries=places&sensor=false";
      }
      $.getScript(googleMapsApiJsPath).done(function () {
        if (callback != null && typeof callback == "function") callback(input);
      });
    },
    getValueFromQS: function (name) {
      var hash = window.location.href.split("?");
      if (hash.length > 1) {
        var params = hash[1].split("&");
        var result = {};
        var propval, filterName, value;
        var isFound = false;
        var paramsLength = params.length;
        for (var i = 0; i < paramsLength; i++) {
          var propval = params[i].split("=");
          filterName = propval[0];
          if (filterName.toLowerCase() == name.toLowerCase()) {
            value = propval[1];
            isFound = true;
            break;
          }
        }
        if (isFound && value !== undefined && value.length > 0) {
          if (value.indexOf("+") > 0) return value.replace(/\+/g, " ");
          else return value;
        } else return "";
      } else return "";
    },

    updateQSParam: function (uri, key, value) {
      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
      var separator = uri.indexOf("?") !== -1 ? "&" : "?";
      if (uri.match(re)) {
        return uri.replace(re, "$1" + key + "=" + value + "$2");
      } else {
        return uri + separator + key + "=" + value;
      }
    },

    removeYearFromModelName: function (name) {
      if (name.indexOf("[") > 0) return name.split("[")[0];
      else return name;
    },
    isElementInViewportTopBottom: function (el) {
      if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
      }
      var rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= $(window).height();
    },
    isElementInViewportLeftRight: function (el) {
      if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
      }
      var rect = el.getBoundingClientRect();
      return rect.left >= 0 && rect.right <= $(window).width();
    },
    setSessionCookie: function (name, value) {
      $.cookie(name, value, { path: "/" });
    },

    isQuotationPage: function () {
      if (location.pathname == "/m/research/quotation.aspx") {
        return true;
      }
      return false;
    },

    getCookieByName: function (name) {
      var allCookies = "; " + document.cookie; //adding '; ' so can split cookie value into two parts
      var parts = allCookies.split("; " + name + "="); //spliting cookie into two parts 1) '....; {name}=' 2) '{value}; ......'
      var cookieValue = "";
      if (parts.length >= 2) {
        //if cookie exists then it will split into two or more parts
        cookieValue = parts
          .pop()
          .split(";")
          .shift(); //from second part extracting value
      }
      return cookieValue;
    },

    trackUserTimings: function (category, timing, value, label) {
      ga("create", "UA-337359-1", "auto");
      ga("send", {
        hitType: "timing",
        timingCategory: category,
        timingVar: timing,
        timingLabel: label ? label : "",
        timingValue: value
      });
    },
    //this is also present in Carwale\Static\js\utils\utility.js
    //so update it if you update this
    getShortnedUrl: function (longUrl, apiKey, urlShortenerDomain) {
      urlShortenerDomain = urlShortenerDomain || Common.cwShortenedDomain;
      var data = {
        dynamicLinkInfo: {
          domainUriPrefix: urlShortenerDomain,
          link: longUrl
        }
      };
      var apiUrl =
        "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=" +
        apiKey;
      return $.ajax({
        type: "POST",
        data: JSON.stringify(data),
        url: apiUrl,
        contentType: "application/json; charset=utf-8"
      });
    }
  },

  ModelVersion: {
    Recommendation: {
      initSlugGlobalVar: function (recoLeadClickSource, recoInquirySource) {
        RECOINQUIRYSOURCE = recoInquirySource;
        RECOLEADCLICKSOURCE = recoLeadClickSource;
      },
      emptyRecoGlobalVar: function () {
        RECOINQUIRYSOURCE = null;
        RECOLEADCLICKSOURCE = null;
      }
    }
  },

  PQ: {
    getCityZonesForBinding: function (json) {
      var cityZones = [];
      if (json == null || json.length == 0) {
        return cityZones;
      }
      $.each(json.cities, function (index, city) {
        cityZones.push({
          cityId: city.id,
          cityName: city.name,
          zoneId: 0,
          zoneName: "",
          orderName: city.name
        });
      });
      $.each(json.groupCities, function (index, groupCity) {
        $.each(groupCity.zones, function (index, zone) {
          cityZones.push({
            cityId: groupCity.id,
            cityName: groupCity.name,
            zoneId: zone.id,
            zoneName: zone.name,
            orderName: zone.name
          });
        });
        $.each(groupCity.group, function (index, group) {
          cityZones.push({
            cityId: group.id,
            cityName: group.name,
            zoneId: 0,
            zoneName: "",
            orderName: group.name
          });
        });
      });

      return cityZones.sort(function (element1, element2) {
        var orderName1 = element1.orderName.toLowerCase();
        var orderName2 = element2.orderName.toLowerCase();
        if (orderName1 < orderName2) return -1;
        if (orderName1 > orderName2) return 1;
        return 0;
      });
    },
    setPQCityCookies: function (cityId, cityName, zoneId) {
      document.cookie =
        "_CustCityId=" +
        cityId +
        "; expires = " +
        permanentCookieTime() +
        "; domain=" +
        defaultCookieDomain +
        "; path =/";
      document.cookie =
        "_CustCity=" +
        cityName +
        "; expires = " +
        permanentCookieTime() +
        "; domain=" +
        defaultCookieDomain +
        "; path =/";
      document.cookie =
        "_PQZoneId=" +
        zoneId +
        "; expires = " +
        permanentCookieTime() +
        "; domain=" +
        defaultCookieDomain +
        "; path =/";
    },
    PageId: { DealerLocatorModelCarousel: 114, PriceInCityPage: 135 },

    redirectToNewPqPage: function (
      modelId,
      versionId,
      cityId,
      areaId,
      isCrossSellPriceQuote,
      pageId,
      node,
      cardId,
      hideCampaign
    ) {
      if (
        window.isWebview ||
        $.inArray(Number(cityId), askingAreaCityId) < 0 ||
        Number(areaId) > 0
      ) {
        location.href =
          "/quotation/?m=" +
          modelId +
          "&v=" +
          versionId +
          "&c=" +
          cityId +
          "&a=" +
          areaId +
          "&p=" +
          pageId;
      } else {
        location.reload();
      }
    }
  },

  Insurance: {
    promiseObjects: {},
    getStateByCityIdPromise: function (cityId) {
      if (!Common.Insurance.promiseObjects[cityId]) {
        Common.Insurance.promiseObjects[cityId] = $.ajax({
          url: "/webapi/GeoCity/GetStateByCityId/?cityId=" + cityId
        });
      }
      return Common.Insurance.promiseObjects[cityId];
    },
    showInsurance: function (cityId, hideInsuranceLinkId) {
      Common.Insurance.getStateByCityIdPromise(cityId).done(function (data) {
        if (data != null) {
          if ($.inArray(Number(data.StateId), insuranceKeys.cholaStates) < 0)
            $(document)
              .find(hideInsuranceLinkId)
              .hide();
          else
            $(document)
              .find(hideInsuranceLinkId)
              .show();
        }
      });
    },
    showOrHideInsurance: function (hideInsuranceLinkId, cityId) {
      if (insuranceKeys.cholaStates[0] == -1)
        $(document)
          .find(hideInsuranceLinkId)
          .show();
      else if (insuranceKeys.cholaStates[0] == 0)
        $(document)
          .find(hideInsuranceLinkId)
          .hide();
    }
  },

  prefillData: {
    gotdata: false,
    preselectCityId: 0,
    statesDrp: [],
    citiesDrp: [],
    state: null,
    cities: null,
    getStateAndCities: function (cityId) {
      var config = {};
      config.contentType = "application/json";
      return Common.utils.ajaxCall(
        "/webapi/GeoCity/StateAndAllCities/?cityId=" + cityId,
        config
      );
    },
    initStateAndCities: function () {
      if (
        Common.prefillData.gotdata == false ||
        Common.prefillData.preselectCityId !=
        Number($.cookie("_CustCityIdMaster"))
      ) {
        Common.prefillData.preselectCityId = Number(
          $.cookie("_CustCityIdMaster")
        );
        $.each(Common.prefillData.statesDrp, function (i, drp) {
          drp.prefillProcessed = false;
        });
        $.each(Common.prefillData.citiesDrp, function (i, drp) {
          drp.prefillProcessed = false;
        });
        try {
          $.when(
            Common.prefillData.getStateAndCities(
              Common.prefillData.preselectCityId
            )
          ).done(function (data) {
            var obj = {};
            obj.state = {};
            obj.cities = [];
            obj = typeof data == "object" ? data : obj;
            Common.prefillData.state = obj.state;
            Common.prefillData.cities = obj.cities;
            Common.prefillData.gotdata = true;
            $(function () {
              $(document).trigger("gotstatecity", [Common.prefillData]);
            });
          });
        } catch (e) {
          console.log(e);
        }
      } else
        $(function () {
          $(document).trigger("gotstatecity", [Common.prefillData]);
        });
    },
    prefillCityDrp: function (drp, data) {
      if (!drp.prefillProcessed) {
        var preselectval = Common.prefillData.preselectCityId;
        var options = $(drp).find("option");

        if (Number(preselectval) > 0) {
          var optionexists =
            $(drp).find("[value='" + preselectval + "']").length > 0;
          if (!optionexists) {
            $(drp).html("");
            $.each(data, function (i, opt) {
              $(drp).append(
                "<option value='" +
                opt.cityId +
                "'>" +
                opt.cityName +
                "</option>"
              );
            });
          } else if (
            options.length <= 1 &&
            typeof ko.dataFor(drp) == "undefined"
          ) {
            $.each(data, function (i, opt) {
              $(drp).append(
                "<option value='" +
                opt.cityId +
                "'>" +
                opt.cityName +
                "</option>"
              );
            });
          }
          $(drp)
            .val(preselectval)
            .change()
            .removeAttr("disabled");
        }
      }
    },
    prefillStateDrp: function (drp, data) {
      if (!drp.prefillProcessed) {
        drp.prefillProcessed = true;
        var options = $(drp).find("option");
        if ($(drp).find("[value='" + data.stateId + "']").length > 0) {
          $(drp).val(data.stateId);
          return;
        }
      }
    },
    processStateCity: function (prefillData) {
      Common.prefillData.statesDrp = $('[prefill="state"]');
      Common.prefillData.citiesDrp = $('[prefill="city"]');
      for (var c = 0; c < Common.prefillData.statesDrp.length; c++) {
        Common.prefillData.prefillStateDrp(
          Common.prefillData.statesDrp[c],
          prefillData.state
        );
      }
      for (var c = 0; c < Common.prefillData.citiesDrp.length; c++) {
        Common.prefillData.prefillCityDrp(
          Common.prefillData.citiesDrp[c],
          prefillData.cities
        );
      }
    }
  },
  masterCityPopup: {
    masterCityChange: function (cityname, cityid) {
      var url = window.location.href;
      window.location.href = url;
    }
  },
  redirectToComparePage: function (compareCars) {
    var comparecar1 = compareCars[0].split(":");
    var comparecar2 = compareCars[1].split(":");
    var dataList = [
      { id: comparecar1[1], text: comparecar1[0].toLowerCase() },
      { id: comparecar2[1], text: comparecar2[0].toLowerCase() }
    ];
    var userInput =
      suggestions.count +
      "_" +
      suggestions.position +
      "_" +
      suggestReqTerm +
      "_" +
      comparecar1[0].toLowerCase() +
      "_" +
      comparecar2[0].toLowerCase();
    Common.utils.trackAction(
      "M-Site-Homepage",
      "FirstPanel-Mobile-HP",
      "NewCars-Successful-Selection-Value-Click",
      userInput
    );
    window.location.href =
      "/compare-cars/" + Common.getCompareUrl(dataList) + "/?source=25";
    return false;
  }
};

function isLatLongValid(latitude, longitude) {
  if (
    latitude != null &&
    latitude != "" &&
    latitude != 0 &&
    longitude != null &&
    longitude != "" &&
    longitude != 0 &&
    checkAcceptableLimit(latitude, longitude)
  ) {
    return true;
  } else {
    return false;
  }
}

function checkAcceptableLimit(lat, long) {
  if (lat >= 6.74678 && lat <= 37.4 && long >= 68.03215 && long <= 97.40238)
    return true;
  else return false;
}

$(window).load(function () {
  $(document).on("gotstatecity", function (event, prefillData) {
    Common.prefillData.processStateCity(prefillData);
  });
  var statecount = Number($('[prefill="state"]').length);
  var citycount = Number($('[prefill="city"]').length);
  if (
    (statecount > 0 || citycount > 0) &&
    Number($.cookie("_CustCityIdMaster")) > 0 &&
    typeof Common.showCityPopup != "undefined" &&
    Common.showCityPopup
  )
    Common.prefillData.initStateAndCities();
});
// Moved to beautify-tooltip.js -- Start
/* Beauty Tooltip Code Starts Here */
var btObj = {
  invokeToolTipData: {
    clickElement: undefined,
    contentElement: undefined,
    width: undefined,
    position: undefined
  },
  btSelector: "",
  btIdFinder: "",
  bindCommonBT: function () {
    var self = this;
    self.btTipDiv = btObj.btIdFinder;
    self.btTipContent = null;
    self.btTipFill = null;
    self.btTipWidth = null;
    self.btTipPosition = null;
    self.btTipStrokeStyle = null;
    self.btTipStrokeWidth = null;
    self.btTipspikeLength = null;
    self.btTipShadow = null;
    self.btTipShadowColor = null;
    self.btTipPadding = null;
    self.btTipShadowOffsetX = null;
    self.btTipShadowOffsetY = null;
    self.btTipShadowBlur = null;
    self.btTipShadowOverlap = null;

    // function to bind Beauty tooltip
    btObj.btSelector = self.btTipDiv;
    self.btCall = function () {
      $(self.btTipDiv).bt({
        contentSelector: self.btTipContent,
        fill:
          self.btTipFill == null || self.btTipFill == undefined
            ? "#fff"
            : self.btTipFill,
        width:
          self.btTipWidth == null || self.btTipWidth == undefined
            ? 220
            : self.btTipWidth,
        positions:
          self.btTipPosition == null || self.btTipPosition == undefined
            ? ["top", "bottom"]
            : self.btTipPosition,
        strokeStyle:
          self.btTipStrokeStyle == null || self.btTipStrokeStyle == undefined
            ? "#6b6b6b"
            : self.btTipStrokeStyle,
        strokeWidth:
          self.btTipStrokeWidth == null || self.btTipStrokeWidth == undefined
            ? 1
            : self.btTipStrokeWidth,
        spikeLength:
          self.btTipspikeLength == null || self.btTipspikeLength == undefined
            ? 8
            : self.btTipspikeLength,
        shadow:
          self.btTipShadow == null || self.btTipShadow == undefined
            ? true
            : self.btShadow,
        shadowColor:
          self.btTipShadowColor == null || self.btTipShadowColor == undefined
            ? "#929292"
            : self.btTipShadowColor,
        padding:
          self.btTipPadding == null || self.btTipPadding == undefined
            ? 10
            : self.btPadding,
        shadowOffsetX:
          self.btTipShadowOffsetX == null ||
            self.btTipShadowOffsetX == undefined
            ? 2
            : self.btTipShadowOffsetX,
        shadowOffsetY:
          self.btTipShadowOffsetY == null ||
            self.btTipShadowOffsetY == undefined
            ? 2
            : self.btTipShadowOffsetY,
        shadowBlur:
          self.btTipShadowBlur == null || self.btTipShadowBlur == undefined
            ? 4
            : self.btTipShadowBlur,
        shadowOverlap:
          self.btTipShadowOverlap == null ||
            self.btTipShadowOverlap == undefined
            ? false
            : self.btTipShadowOverlap,
        trigger:
          self.btTipTrigger == null || self.btTipTrigger == undefined
            ? ["none"]
            : self.btTipTrigger
      });
    };
  },
  btToolTipAd: function (pageId, label) {
    var modelPageId = 68;
    var versionPageId = 69;
    var picPageId = 76;
    var camp = new btObj.bindCommonBT();

    if (btObj.btIdFinder == "#camp-model-info-tooltip") {
      camp.btTipContent = "$('.camp-model-info-content').html()";
      camp.btTipWidth = 230;
      try {
        if (pageId == picPageId) {
          Common.utils.trackAction(
            "CWNonInteractive",
            "SponsoredLink_Shown",
            "PIC_ToolTip_m",
            label
          );
          Common.utils.trackAction(
            "CWNonInteractive",
            "Model_Page_Tooltip_Experiment_4Cities_MSite",
            "Dealer_Link_shown",
            zoneNameForModelVersion + "," + ModelName
          );
        } else if (pageId == versionPageId) {
          Common.utils.trackAction(
            "CWNonInteractive",
            "SponsoredLink_Shown",
            "VersionPage_ToolTip_m",
            label
          );
          Common.utils.trackAction(
            "CWNonInteractive",
            "Version_Page_Tooltip_Experiment_4Cities_MSite",
            "Dealer_Link_shown",
            zoneNameForModelVersion + "," + ModelName
          );
        } else {
          Common.utils.trackAction(
            "CWNonInteractive",
            "SponsoredLink_Shown",
            "ModelPage_ToolTip_m",
            label
          );
          Common.utils.trackAction(
            "CWNonInteractive",
            "Model_Page_Tooltip_Experiment_4Cities_MSite",
            "Dealer_Link_shown",
            zoneNameForModelVersion + "," + ModelName
          );
        }
      } catch (e) { }
    } else if (btObj.btIdFinder == "#nocamp-model-info-tooltip") {
      camp.btTipContent = "$('.nocamp-model-info-content').html()";
      try {
        if (pageId == picPageId) {
          Common.utils.trackAction(
            "CWNonInteractive",
            "SponsoredLink_Shown",
            "PIC_ToolTip_m",
            label
          );
        } else if (pageId == versionPageId)
          Common.utils.trackAction(
            "CWNonInteractive",
            "SponsoredLink_Shown",
            "VersionPage_ToolTip_m",
            label
          );
        else
          Common.utils.trackAction(
            "CWNonInteractive",
            "SponsoredLink_Shown",
            "ModelPage_ToolTip_m",
            label
          );
      } catch (e) { }
    } else if ($(btObj.btIdFinder).hasClass("emiTooltip__js")) {
      camp.btTipContent =
        "$(this).closest('.customizeEmiContainer__js').siblings().find('.emiTooltipContent__js').html()";
      camp.btTipWidth = 210;
    } else if ($(btObj.btIdFinder).hasClass("emiCompareCarTooltip__js")) {
      camp.btTipContent =
        "$(this).siblings().find('.emiTooltipContent__js').html()";
      camp.btTipWidth = 210;
    } else if (btObj.btIdFinder.attr("id") == "gst-est-tooltip") {
      camp.btTipContent = "$('.gst-est-tooltip-content').html()";
      camp.btTipWidth = 230;
      camp.btTipPosition = ["top"];
    } else if (btObj.btIdFinder.attr("id") == "gst-tooltip") {
      camp.btTipContent = "$('.gst-tooltip-content').html()";
      camp.btTipWidth = 230;
      camp.btTipPosition = ["top"];
    } else if ($(btObj.btIdFinder).hasClass("average-info-tooltip")) {
      camp.btTipContent = "$(this).siblings('.average-info-content').html()";
      camp.btTipWidth = 210;
    }

    camp.btCall();
  },

  registerEvents: function () {
    $(document).on("click", ".bt-wrapper a", function (e) {
      e.preventDefault();
      $(btObj.btSelector).btOff();
    });
    $(window).on("resize", function () {
      var temp = $(btObj.btSelector);
      if (temp.btOff) temp.btOff();
    });
    $(".ad-tooltip").on("click", function () {
      btObj.btIdFinder = $(this).attr("id");
      btObj.btIdFinder = "#" + btObj.btIdFinder;
      var pageId = $(this).data("assigned-id");
      var label = $(this).data("label");
      btObj.btToolTipAd(pageId, label);
      $(btObj.btSelector).btOn();
      if (btObj.btIdFinder == "#camp-model-info-tooltip") {
        var btContentElement = $(".bt-wrapper").find(".bt-content");
        if (btContentElement.has("[campaigncta]")) {
          btContentElement
            .find("[campaigncta]")
            .removeAttr("data-campaign-event");
          window.registerCampaignEvent(btContentElement[0]);
        }
      }
    });
  },
  registerEventsClass: function () {
    $(".class-ad-tooltip").on("click", function () {
      btObj.btIdFinder = $(this);
      var pageId = $(this).data("assigned-id");
      var label = $(this).data("label");
      btObj.btToolTipAd(pageId, label);
      $(".class-ad-tooltip").btOff();
      btObj.btSelector.btOn();
    });
  },

  invokeToolTip: function () {
    var self = this;
    btObj.btIdFinder = $(self.invokeToolTipData.clickElement);
    var camp = new btObj.bindCommonBT();
    camp.btTipContent = "$(btObj.invokeToolTipData.contentElement).html()";
    if (self.invokeToolTipData.width != undefined)
      camp.btTipWidth = self.invokeToolTipData.width;
    if (self.invokeToolTipData.position != undefined)
      camp.btTipPosition = self.invokeToolTipData.position;
    camp.btCall();
    btObj.btSelector.btOn();
  }
};
$(window).load(function () {
  btObj.registerEvents();
  btObj.registerEventsClass();
});
/* Beauty Tooltip Code Ends Here */
// Moved to beautify-tooltip.js -- End

function SetControlWidth() {
  $(
    "input[type='text'], input[type='number'], input[type='password'], select"
  ).each(function () {
    $(this).width(
      parseInt(
        $(this)
          .parent()
          .width()
      ) - 5
    );
  });
}

/* cw_fastFilter for popup search box code starts here */
jQuery.fn.cw_fastFilter = function (list, options) {
  // Options: input, list, timeout, callback
  options = options || {};
  list = jQuery(list);
  var input = this;
  var lastFilter = "",
    noFoundLen = 0;
  var noFoundDiv =
    '<div class="noFound content-inner-block-10 text-red">No search found!</div>';
  var crossBox = ".cross-box-wrap .cross-box";
  var selCrossBox = list.closest(".fixedSearchPopup").find(crossBox);
  var timeout = options.timeout || 100;
  var callback =
    options.callback ||
    function (total) {
      noFoundLen = list.siblings("div.noFound").length;
      if (input.val() != "") selCrossBox.show();
      else selCrossBox.hide();
      //no search found text
      if (total == 0 && noFoundLen < 1) list.after(noFoundDiv).show();
      else if (total > 0 && noFoundLen > 0) $("div.noFound").remove();
    };

  var keyTimeout;
  var lis = list.children();
  var len = lis.length;
  var oldDisplay = len > 0 ? lis[0].style.display : "block";
  callback(len); // do a one-time callback on initialization to make sure everything's in sync

  input
    .change(function () {
      // var startTime = new Date().getTime();
      var filter = input.val().toLowerCase();
      var li, innerText;
      var numShown = 0;
      for (var i = 0; i < len; i++) {
        li = lis[i];
        innerText = !options.selector
          ? li.textContent || li.innerText || ""
          : $(li)
            .find(options.selector)
            .text();

        if (innerText.toLowerCase().indexOf(filter) >= 0) {
          if (li.style.display == "none") {
            li.style.display = oldDisplay;
          }
          numShown++;
        } else {
          if (li.style.display != "none") {
            li.style.display = "none";
          }
        }
      }
      callback(numShown);
      return false;
    })
    .keydown(function () {
      clearTimeout(keyTimeout);
      keyTimeout = setTimeout(function () {
        if (input.val() === lastFilter) return;
        lastFilter = input.val();
        input.change();
      }, timeout);
    });
  return this; // maintain jQuery chainability
};
/* cw_fastFilter for popup search box code ends here */
var LoadPqCityPopup = {
  Initialize: function () {
    var pqcity_popup = $($("#pqcity_popup").text()).attr("src");
    if (pqcity_popup) {
      $.get(pqcity_popup).done(function (response) {
        $("body").append(response);
      });
    }
  }
};
$(document).ready(function () {
  setTimeout(function () {
    if (Swiper.Initialize) Swiper.Initialize();
  }, 0); // Moved to videoswiper.js
  Common.utils.prefillUserDetails(); //prefill user details
  Common.utils.trackImpression(); // TODO
  Common.utils.eventTracking();
  Common.utils.trackImpressions();
  Common.utils.trackClicks();
  Common.Insurance.showOrHideInsurance(
    "li#navInsuranceLink",
    masterCityIdCookie
  ); // TODO
  GetGlobalSearchCampaigns.registerEvents(
    GetGlobalSearchCampaigns.platform.Mobile
  ); // globalSearch-c1.js
  LoadPqCityPopup.Initialize();
});

var globalSearchAdTracking = {
  targetModelName: "",
  featuredModelIdPrev: 0,
  featuredModelName: "",
  adPosition: 0,

  trackData: function (result, category) {
    var sponsorIndex = 0;
    var sponsoredObj = result
      .filter(function (suggestion, index) {
        if (suggestion && suggestion.value && suggestion.value.indexOf("sponsor") > 0) {
          sponsorIndex = index;
          return true;
        }
        return false;
      })[0].value.split("|");
    var sponsoredModelId = parseInt(sponsoredObj[1].split(":")[1]);
    globalSearchAdTracking.targetModelName = result[sponsorIndex - 1].label;
    globalSearchAdTracking.featuredModelName =
      result[sponsorIndex].label;
    globalSearchAdTracking.adPosition = sponsorIndex + 1;

    if (globalSearchAdTracking.featuredModelIdPrev != sponsoredModelId) {
      globalSearchAdTracking.featuredModelIdPrev = sponsoredModelId;
      Common.utils.trackAction(
        "CWNonInteractive",
        category,
        "New_m_Shown",
        globalSearchAdTracking.featuredModelName +
        "_" +
        globalSearchAdTracking.targetModelName +
        "_" +
        result.length +
        "_" +
        globalSearchAdTracking.adPosition
      );
    }
  }
};

function createImageUrl(hostUrl, size, originalImagePath, quality) {
  return (
    hostUrl +
    size +
    originalImagePath +
    (originalImagePath.indexOf("?") > -1 ? "&q=" : "?q=") +
    (quality || 85)
  );
}
// Moved to passiveevent.js -- Start
//debounce implementation:window.addEventListener('scroll', debounce(function () {do your stuff here}, 500));
function debounce(fn, wait) {
  var timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn.apply(this, arguments);
    }, wait || 1);
  };
}
function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last, deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date(),
      args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
// Moved to passiveevent.js -- End
function getNcfOriginPageName() {
  var element = $("#nfcWidget");
  if (typeof element !== "undefined") {
    return element.data("pagename");
  }
  return "";
}
// Moved to network.js -- Start
if (
  "connection" in navigator &&
  Common.utils.storageAvailable("sessionStorage") &&
  !window.sessionStorage.getItem("network_tracked")
) {
  var con = navigator.connection;
  var label =
    "effectiveType=" +
    con.effectiveType +
    ",rtt=" +
    con.rtt +
    "ms,downlink=" +
    con.downlink +
    "Mb/s";
  Common.utils.trackAction(
    "CWNonInteractive",
    "NetworkSpeed",
    "TrackSpeed",
    label
  );
  window.sessionStorage.setItem("network_tracked", 1);
}
// Moved to network.js -- End
