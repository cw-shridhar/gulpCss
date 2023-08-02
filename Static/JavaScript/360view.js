var isFullScreen = false;
var ThreeSixtyViewActiveState = 0;
var HotspotCategory = {
  text: 1,
  imageCarousel: 2,
  videoCarousel: 3,
};
var ThreeSixtyViewStates = {
  exterior: 1,
  open: 2,
  interior: 3,
};

var viewWiseSelectedColor = {
  1: selectedColorForClosedView,
};

var hotspotSwitchContainer = document.querySelector(
  ".hotspot-switch-container"
);

var isViewLoaded = {
};

var handleColorClick = (colorCode) => {
  if (viewWiseSelectedColor[ThreeSixtyViewActiveState] == colorCode) {
    return;
  }
  $(`#tick-image-${ThreeSixtyViewActiveState}-${viewWiseSelectedColor[ThreeSixtyViewActiveState]}`).addClass("hide");
  viewWiseSelectedColor[ThreeSixtyViewActiveState] = colorCode;
  $(`#tick-image-${ThreeSixtyViewActiveState}-${viewWiseSelectedColor[ThreeSixtyViewActiveState]}`).removeClass("hide");

  $(document).unbind("keydown");
  $(".option-buttons").hide();
  $(".player-nav").hide();
  $(".option-buttons li").css("color", "rgb(255, 255, 255)");
  $("#wr360PlayerId").show();

  var isClosed = ThreeSixtyViewActiveState === ThreeSixtyViewStates.exterior;
  if (!isViewLoaded[`${ThreeSixtyViewActiveState}-${colorCode}`]) {
    ThreeSixtyView.plugin.removePluginCss();
    ThreeSixtyView.common.toggleLoadingView(true, isClosed);
  }
  if (ThreeSixtyView.isClosedViewLoaded) {
    ThreeSixtyView.startLoadTime = $.now();
    ThreeSixtyView.rotator.getAPI().reload(
      ThreeSixtyView.xmlPath + ThreeSixtyView.closedXMLName + "&isMsite=false&getHotspots=true",
      ThreeSixtyView.closedDoorRoothPath + viewWiseSelectedColor[ThreeSixtyViewActiveState] + "/",
      function () {
        if (!isViewLoaded[`${ThreeSixtyViewActiveState}-${colorCode}`]) {
          ThreeSixtyView.common.toggleLoadingView(false, false);
        }
        ThreeSixtyView.isOpenViewLoaded = true;
        isViewLoaded[`${ThreeSixtyViewActiveState}-${colorCode}`] = true;
        $(".option-buttons").show();
        checkHotspotVisibility();
        ThreeSixtyView.plugin.removePluginCss();
        ThreeSixtyView.common.showPlayerOptions();
        ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
      },
      0
    );
  }
};

var setHotspotFullScreenSize = function () {
  $(".ggskin_hotspot").css("height", "5px");
  $(".ggskin_svg").css("height", "32px");
  if (isFullScreen) {
    $(".hotspot-outer-container").css("right", "0");
  } else {
    $(".hotspot-outer-container").css("right", "0");
  }
};

var checkHotspotVisibility = function () {
  var showHotspots = false;

  switch (ThreeSixtyViewActiveState) {
    case ThreeSixtyViewStates.exterior:
      showHotspots = exteriorHotspotsPresent;
      break;
    case ThreeSixtyViewStates.open:
      showHotspots = openHotspotsPresent;
      break;
    default:
      showHotspots = interiorHotspotsPresent;
      break;
  }

  if (showHotspots) {
    $(".ggskin_hotspot").hide();
    $(".hotspot_indicator").addClass("hideImportant");
    $(".switch-container").show();
    if ($("#cmn-toggle-1").is(":checked")) {
      $(".ggskin_hotspot").show();
      $(".hotspot_indicator").removeClass("hideImportant");
    }
  } else $(".switch-container").hide();
};

var getVideoData = function (selector, videoId) {
  $.ajax({
    type: "GET",
    url:
      "https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" +
      videoId +
      "&key=AIzaSyDQH7Jl_wa5N7Dvh4j1wQGlDC8Sa56H-aM",
    async: false,
    dataType: "json",
  }).done(function (response) {
    if (response.items.length > 0) {
      selector
        .find(".video-info-views span")
        .text(response.items[0].statistics.viewCount + " Views");
      selector
        .find(".video-info-likes span")
        .text(response.items[0].statistics.likeCount + " Likes");
    }
  });
};

var HotspotSwiper = {
  hotspotSwiper: null,
  currentVideoIndex: 0,

  registerEvents: function () {
    HotspotSwiper.bindEvents.hotspotClose();
  },

  initialize: function (category) {
    var jcarousel = $(".jcarousel").jcarousel({
      vertical: false,
    });
    $("#hotspot-carousel-container .jcarousel-control-prev").jcarouselControl({
      target: "-=1",
    });
    $("#hotspot-carousel-container .jcarousel-control-next").jcarouselControl({
      target: "+=1",
    });
    $(".jcarousel").on("jcarousel:fullyvisiblein", "li", function (
      event,
      carousel
    ) {
      var index = +this.dataset.index;
      var totalCount = +this.dataset.totalcount;
      var prevBtn = carousel._element[0].querySelector("#carousel-prev");
      var nextBtn = carousel._element[0].querySelector("#carousel-next");
      if (index === 0) {
        prevBtn.classList.add("inactive");
        nextBtn.classList.add("active");
        prevBtn.classList.remove("active");
        nextBtn.classList.remove("inactive");
      } else if (index === totalCount - 1) {
        prevBtn.classList.add("active");
        nextBtn.classList.add("inactive");
        prevBtn.classList.remove("inactive");
        nextBtn.classList.remove("active");
      } else {
        prevBtn.classList.add("active");
        nextBtn.classList.add("active");
        prevBtn.classList.remove("inactive");
        nextBtn.classList.remove("inactive");
      }
    });
    if (category !== HotspotCategory.videoCarousel) {
      HotspotSwiper.bindReadMoreLink();
      HotspotSwiper.bindEvents.readTextLink();
    }
    $(".carousel-wrapper").css("left", "0");
    $(".hotspot-outer-container").removeClass("hide");
  },

  bindReadMoreLink: function () {
    $("div.hotspot-outer-container .car-text").each(function () {
      var $contentTag = $(this).find(".hotspot-info-content");
      if ($contentTag.text().length > 180) {
        var shortText = $contentTag.text();
        shortText = shortText.substring(0, 180);
        $contentTag.addClass("fullArticle").hide();
        shortText +=
          '<span class="read-more-link"><span>...</span>Read More</span>';
        $contentTag.append(
          '<span class="read-less-link"><span>...</span>Read Less</span>'
        );
        $(this).append('<div class="preview">' + shortText + "</div>");
      }
    });
  },

  closeHotspotPopup: function () {
    var hotspotContainer = $(".hotspot-outer-container");
    hotspotContainer.addClass("hide");
    hotspotContainer.removeClass("hotspot-visible");

    $(".gallery__button-contanier").show();
    $("#wr360image_wr360PlayerId, #pano2vr360Player").removeClass("blur-image");
    $(".full-screen-blackout-window").hide();

    if (hotspotContainer.find("#videoIframe").length > 0) player.stopVideo();
  },

  changeVideoEvent: function (event) {
    HotspotSwiper.currentVideoIndex += event.data.videoIndexDiff;
    var hotspotData = event.data.hotspotData;

    var videoId = hotspotData[HotspotSwiper.currentVideoIndex].Link.slice(1);
    var videoContainer = $("#hotspot-carousel-container").find(
      ".hotspotCarDescWrapper"
    );

    videoContainer
      .find("h3:first")
      .html(hotspotData[HotspotSwiper.currentVideoIndex].Title);
    getVideoData(videoContainer, videoId);
    player.loadVideoById(videoId);

    Common.utils.trackAction(
      "CTInteractive",
      "desktop_360_hotspot_video_carousel",
      event.data.videoIndexDiff > 0 ? "next" : "prev",
      carName
    );
    ctTracking.trackEvent({
      'category': "desktop_360_hotspot_video_carousel",
      'action': event.data.videoIndexDiff > 0 ? "next" : "prev",
      'label': carName
    });
  },

  checkCarouselButtonVisibility: function (currentIndex, totalLength) {
    var swiperNext = $("#carousel-next");
    var swiperPrev = $("#carousel-prev");
    swiperNext.show();
    swiperPrev.show();
    if (totalLength <= 1) {
      swiperNext.hide();
      swiperPrev.hide();
    }
  },

  unbindEvent: function (selector, event, boundMethod) {
    selector.unbind(event, boundMethod);
  },

  bindEvents: {
    readTextLink: function () {
      $(document).on("click", ".read-more-link", function () {
        $(this).parent().hide().prev().show();
        $(this).closest(".hotspotCarDescWrapper").addClass("slideContent");
        Common.utils.trackAction(
          "CTInteractive",
          "desktop_360_hotspots",
          "read_more",
          carName
        );
        ctTracking.trackEvent({
          'category': "desktop_360_hotspots",
          'action': "read_more",
          'label': carName
        });
      });

      $(document).on("click", ".read-less-link", function () {
        $(this).parent().hide().next().show();
        $(this).closest(".hotspotCarDescWrapper").removeClass("slideContent");
        Common.utils.trackAction(
          "CTInteractive",
          "desktop_360_hotspots",
          "read_less",
          carName
        );
        ctTracking.trackEvent({
          'category': "desktop_360_hotspots",
          'action': "read_less",
          'label': carName
        });
      });
    },

    hotspotClose: function () {
      $(document).on("click", "#hotspot-close", function () {
        HotspotSwiper.closeHotspotPopup();
        Common.utils.trackAction(
          "CTInteractive",
          "desktop_360_hotspots",
          "close",
          carName
        );
        ctTracking.trackEvent({
          'category': "desktop_360_hotspots",
          'action': "close",
          'label': carName
        });
        window.history.back();
      });
    },

    bindNextClick: function (hotspotData) {
      $("#carousel-next").on(
        "click",
        { hotspotData: hotspotData, videoIndexDiff: 1 },
        HotspotSwiper.changeVideoEvent
      );
    },

    bindPrevClick: function (hotspotData) {
      $("#carousel-prev").on(
        "click",
        { hotspotData: hotspotData, videoIndexDiff: -1 },
        HotspotSwiper.changeVideoEvent
      );
    },
  },
};

var ThreeSixtyView = {
  closedDoorRoothPath:
    cdnHostUrl +
    "1280x720/" +
    "cw/360/" +
    modelDetails.urlMakeName +
    "/" +
    modelDetails.modelId +
    "/closed-door/",
  openDoorRoothPath:
    cdnHostUrl +
    "1280x720/cw/360/" +
    modelDetails.urlMakeName +
    "/" +
    modelDetails.modelId +
    "/open-door/",
  interiorRootPath:
    cdnHostUrl +
    "1875x1875/cw/360/" +
    modelDetails.urlMakeName +
    "/" +
    modelDetails.modelId +
    "/interior/d/",
  xmlPath: "/api/xml/360/v2/" + modelDetails.modelId + "/",
  closedXMLName: "closed/3/?v=" + xmlVersion.closed,
  openXMLName: "open/3/?v=" + xmlVersion.open,
  interiorXMLName: "interior/3/?v=" + xmlVersion.interior,
  isRotationComplete: false,
  isClosedViewLoaded: false,
  isOpenViewLoaded: false,
  isInteriorLoaded: false,
  isPageLoad: true,
  isViewLoading: false,
  rotator: WR360.ImageRotator.Create("wr360PlayerId"),
  pano: null,
  skin: null,
  states: {
    exterior: 1,
    open: 2,
    interior: 3,
  },
  activeState: 0,
  isFullScreen: false,
  startLoadTime: null,

  pageLoad: {
    registerEvents: function () {
      if (ThreeSixtyViewActiveState === ThreeSixtyViewStates.exterior)
        ThreeSixtyView.plugin.initialiseExterior();
      else if (ThreeSixtyViewActiveState === ThreeSixtyViewStates.open)
        ThreeSixtyView.plugin.initialiseOpen();
      else ThreeSixtyView.plugin.initialiseInterior();

      ThreeSixtyView.bindEvents.windowResize();
      ThreeSixtyView.bindEvents.exterior360Click();
      ThreeSixtyView.bindEvents.open360Click();
      ThreeSixtyView.bindEvents.interior360Click();
      ThreeSixtyView.plugin.removePluginCss();
      ThreeSixtyView.isViewLoading = false;
    },
  },

  plugin: {
    setRotatorSettings: function (xmlName, rootPath) {
      ThreeSixtyView.rotator.licenseFileURL = "/license.lic";
      ThreeSixtyView.rotator.settings.configFileURL =
        ThreeSixtyView.xmlPath + xmlName + "&isMsite=false&getHotspots=true";
      ThreeSixtyView.rotator.settings.googleEventTracking = false;
      ThreeSixtyView.rotator.settings.responsiveBaseWidth = window.innerWidth;
      ThreeSixtyView.rotator.settings.responsiveMinHeight = window.innerHeight;
      ThreeSixtyView.rotator.settings.rootPath = rootPath;
      ThreeSixtyView.rotator.settings.graphicsPath = cdnHostUrl;

      ThreeSixtyView.rotator.settings.progressCallback = function (
        isFullScreen,
        percentLoaded,
        isZoomLoading
      ) {
        ThreeSixtyView.plugin.progressCallback(
          isFullScreen,
          percentLoaded,
          isZoomLoading
        );
      };
      ThreeSixtyView.rotator.settings.apiReadyCallback = function (api) {
        Common.utils.trackUserTimings(
          "d_360_time",
          ThreeSixtyViewActiveState === ThreeSixtyViewStates.exterior
            ? "exterior"
            : "open",
          ($.now() - ThreeSixtyView.startLoadTime).toString(),
          carName
        );
        ThreeSixtyView.common.toggleLoadingView(false, false);
        ThreeSixtyView.rotator.getAPI().toolbar.rotateOnce(4, function () {
          ThreeSixtyView.isRotationComplete = true;
          ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
        });
        ThreeSixtyView.common.showPlayerOptions();
        ThreeSixtyView.bindEvents.rotation();
        if (ThreeSixtyViewActiveState === ThreeSixtyViewStates.exterior)
          ThreeSixtyView.isClosedViewLoaded = true;
        else ThreeSixtyView.isOpenViewLoaded = true;
      };

      ThreeSixtyView.startLoadTime = $.now();
      ThreeSixtyView.rotator.runImageRotator();
    },

    initialiseExterior: function () {
      ThreeSixtyView.plugin.setRotatorSettings(
        ThreeSixtyView.closedXMLName,
        ThreeSixtyView.closedDoorRoothPath + viewWiseSelectedColor[ThreeSixtyViewActiveState] + "/"
      );
    },

    initialiseOpen: function () {
      ThreeSixtyView.plugin.setRotatorSettings(
        ThreeSixtyView.openXMLName,
        ThreeSixtyView.openDoorRoothPath
      );
    },

    initialiseInterior: function () {
      ThreeSixtyView.pano = new pano2vrPlayer("pano2vr360Player");
      ThreeSixtyView.pano.En = function () { };
      ThreeSixtyView.pano.uh = false;
      ThreeSixtyView.skin = new pano2vrSkin(ThreeSixtyView.pano);
      ThreeSixtyView.startLoadTime = $.now();
      ThreeSixtyView.pano.readConfigUrl(
        ThreeSixtyView.xmlPath +
        ThreeSixtyView.interiorXMLName +
        "&isMsite=false&getHotspots=true",
        ThreeSixtyView.interiorRootPath
      );
      ThreeSixtyView.bindEvents.lockWindowScroll();
      $("#pano2vr-container").show();
      $(".loading").hide();
      ThreeSixtyView.plugin.handlingForBrowsers();
      ThreeSixtyView.pano.$n = function () { };
      $(".option-buttons").show();
      checkHotspotVisibility();
      ThreeSixtyView.common.showPlayerOptions();
    },

    progressCallback: function (isFullScreen, percentLoaded, isZoomLoading) {
      ThreeSixtyView.plugin.removePluginCss();
      if (ThreeSixtyView.isPageLoad) {
        $(".loading").hide();

        if (ThreeSixtyViewActiveState === ThreeSixtyViewStates.exterior)
          $("#loadingClosedDoor").show();
        else if (ThreeSixtyViewActiveState === ThreeSixtyViewStates.open)
          $("#loadingOpenDoor").show();

        $("#tempLoadingImage").show();
        $("#wr360image_wr360PlayerId").addClass("remove-top-margin");
        ThreeSixtyView.isPageLoad = false;
      }
      $("#loadingProgress").text(percentLoaded + "%");
    },

    removePluginCss: function () {
      $(".view-img-container").css("height", "");
      $("#wr360PlayerId").css("height", "");
      $("#wr360image_wr360PlayerId").css({
        height: "",
        "margin-left": "",
        width: "100%",
      });
      $("#wr360container_wr360PlayerId").css({
        width: "100% !important",
        height: "",
      });
      $("#pano2vr360Player").css({
        height: "",
        "margin-left": "",
        width: "100% !important",
      });
      if (isFullScreen) {
        $("#player").attr(
          "style",
          "height:" + window.innerHeight + "px !important"
        );
        $("#pano2vr360Player").css({
          height: window.innerHeight,
          width: "100%",
        });
      } else $("#player").attr("style", "height: auto !important");
    },

    handlingForBrowsers: function () {
      if (/UCBrowser|iPad|iPhone|iPod/.test(navigator.userAgent))
        $(".three-sixty-full-screen").hide();
    },

    toggleFullScreen: function () {
      var doc = window.document;
      var docEl = doc.documentElement;

      var requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;
      if (
        !ThreeSixtyView.common.fullscreen() &&
        !isFullScreen &&
        requestFullScreen
      ) {
        isFullScreen = true;
        $(".three-sixty-full-screen").hide();
        $(".three-sixty-full-screen-close").show();
        requestFullScreen.call($("#player")[0]);
        $("#player").attr("style", "height: auto !important");
        $("#pano2vr360Player div").css({ height: window.innerHeight });
        $("#pano2vr360Player div div").css("height", window.innerHeight);
        $("#pano2vr360Player div canvas").css("height", window.innerHeight);
      } else {
        isFullScreen = false;
        if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        $(".three-sixty-full-screen").show();
      }
      ThreeSixtyView.plugin.exteriorReload();
      checkHotspotVisibility();
      setHotspotFullScreenSize();
    },

    exteriorReload: function () {
      if (ThreeSixtyViewActiveState = ThreeSixtyViewStates.exterior)
        ThreeSixtyView.rotator.getAPI().reload(
          ThreeSixtyView.xmlPath +
          ThreeSixtyView.closedXMLName +
          "&isMsite=false&getHotspots=true",
          ThreeSixtyView.closedDoorRoothPath + viewWiseSelectedColor[ThreeSixtyViewActiveState] + "/",
          function (api) {
            ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
            checkHotspotVisibility();
          },
          ThreeSixtyView.rotator.getAPI().images.getCurrentImageIndex()
        );
      else if (ThreeSixtyViewActiveState == ThreeSixtyViewStates.open)
        ThreeSixtyView.rotator.getAPI().reload(
          ThreeSixtyView.xmlPath +
          ThreeSixtyView.openXMLName +
          "&isMsite=false&getHotspots=true",
          ThreeSixtyView.openDoorRoothPath,
          function (api) {
            ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
            checkHotspotVisibility();
          },
          ThreeSixtyView.rotator.getAPI().images.getCurrentImageIndex()
        );
    },

    panLeft: function () {
      if (ThreeSixtyViewActiveState === ThreeSixtyViewStates.interior)
        ThreeSixtyView.pano.changePan(1, 1);
      else {
        ThreeSixtyView.rotator.getAPI().toolbar.startLeftArrowRotate();
        ThreeSixtyView.rotator.getAPI().toolbar.stopArrowRotate();
      }
    },

    panRight: function () {
      if (ThreeSixtyViewActiveState === ThreeSixtyViewStates.interior)
        ThreeSixtyView.pano.changePan(-1, 1);
      else {
        ThreeSixtyView.rotator.getAPI().toolbar.startRightArrowRotate();
        ThreeSixtyView.rotator.getAPI().toolbar.stopArrowRotate();
      }
    },

    panVertical: function (level) {
      ThreeSixtyView.pano.changeTilt(level, 1);
    },

    zoom: function (direction) {
      ThreeSixtyView.pano.changeFov(direction, 1);
    },

    autoPlay: function () {
      if (ThreeSixtyViewActiveState === ThreeSixtyViewStates.interior)
        ThreeSixtyView.pano.toggleAutorotate();
      else ThreeSixtyView.rotator.getAPI().toolbar.playbackToggle();
    },
  },

  common: {
    toggleLoadingView: function (showLoading, isClosedLoading) {
      if (showLoading) {
        if (!isFullScreen) {
          $("#wr360PlayerId").hide();
        }

        $(".three-sixty-full-screen, .option-buttons").hide();
        $("#tempLoadingImage").show();
        if (isClosedLoading) {
          $("#loadingClosedDoor").show();
          $("#loadingOpenDoor").hide();
        } else {
          $("#loadingClosedDoor").hide();
          $("#loadingOpenDoor").show();
          $("#loadingProgress").text("0%");
        }
      } else {
        $("#wr360PlayerId").show();
        $("#tempLoadingImage, #loadingClosedDoor").hide();
        $("#loadingOpenDoor").hide();
        if (!isFullScreen) $(".three-sixty-full-screen").show();
        $(".option-buttons").show();
        checkHotspotVisibility();
        // In case of ios and uc we hide the full screen icon
      }
      ThreeSixtyView.plugin.handlingForBrowsers();
    },

    showPlayerOptions: function () {
      if (ThreeSixtyViewActiveState === ThreeSixtyViewStates.interior) {
        $("#exterior-player").hide();
        $("#interior-player").show();
      } else {
        $("#exterior-player").show();
        $("#interior-player").hide();
      }
    },

    keyDownScrollPrevent: function (event) {
      if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1)
        event.preventDefault();
    },

    toggleDataAttr: function (selector) {
      if (isFullScreen) {
        $(selector).each(function () {
          var element = $(this);
          element.attr("data-label", element.data("label") + "_full_screen");
          element.attr("data-action", element.data("action") + "_full_screen");
        });
      } else {
        $(selector).each(function () {
          var element = $(this);
          element.attr(
            "data-label",
            element.data("label").split("_full_screen")[0]
          );
          element.attr(
            "data-action",
            element.data("action").split("_full_screen")[0]
          );
        });
      }
    },

    fullscreen: function () {
      return (
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenElement
      );
    },

    createImageUrl: function (hostUrl, size, originalImagePath, quality) {
      if (hostUrl && size && originalImagePath)
        return (
          hostUrl +
          size +
          originalImagePath +
          (originalImagePath.indexOf("?") > -1 ? "&q=" : "?q=") +
          (quality || 85)
        );

      return cdnHostUrl + "0x0/cw/cars/no-cars.jpg";
    },
  },

  bindEvents: {
    rotation: function () {
      $("#wr360image_wr360PlayerId").on("load", function (event) {
        var currentImage =
          ThreeSixtyView.rotator.getAPI().images.getCurrentImageIndex() + 1;
        if (
          ThreeSixtyView.isRotationComplete &&
          currentImage > 0 &&
          currentImage % 18 === 0
        ) {
          Common.utils.trackAction(
            "CTInteractive",
            "desktop_360_rotation",
            "image_" + currentImage,
            "image_" + currentImage
          );
          ctTracking.trackEvent({
            'category': "desktop_360_rotation",
            'action': "image_" + currentImage,
            'label': "image_" + currentImage
          });
        }
      });

      $("#wr360PlayerId").on("click", function () {
        ThreeSixtyView.isRotationComplete = true;
      });
    },

    windowResize: function () {
      $(window).on("resize", function () {
        if (ThreeSixtyView.common.fullscreen()) {
          isFullScreen = true;
          $(".player-nav").css({
            left: "0",
            bottom: "5%",
          });
          $(".option-buttons").css({ top: "115%" });
          $("body").addClass("full-screen-three-sixty");
        } else {
          isFullScreen = false;
          if (ThreeSixtyView.isViewLoading) $("#wr360PlayerId").hide();
          $("body").removeClass("full-screen-three-sixty");
          $("#wr360image_wr360PlayerId").css({
            height: "",
            "margin-left": "",
            width: "100%",
          });
          $("#wr360container_wr360PlayerId").css({
            height: "",
            "margin-left": "",
            width: "100%",
          });
          $(".option-buttons").css({ top: "auto" });
        }
        ThreeSixtyView.plugin.handlingForBrowsers();
        ThreeSixtyView.plugin.removePluginCss();
        setHotspotFullScreenSize();
      });
      $(document).on(
        "fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange",
        function (e) {
          if (ThreeSixtyView.common.fullscreen()) {
            isFullScreen = true;
            $(".three-sixty-full-screen").hide();
            $(".three-sixty-full-screen-close").show();
          } else {
            isFullScreen = false;
            $(".three-sixty-full-screen").show();
            $(".three-sixty-full-screen-close").hide();
          }
          ThreeSixtyView.common.toggleDataAttr(".option-buttons li");
          ThreeSixtyView.plugin.removePluginCss();
          setHotspotFullScreenSize();
        }
      );
    },

    exterior360Click: function () {
      $(".three-sixty-exterior").on("click", function () {
        $(".js-closed-view-colors").removeClass("hide");
        ThreeSixtyViewActiveState = ThreeSixtyViewStates.exterior;
        $(document).unbind("keydown");
        window.history.replaceState(null, null, exteriorPageUrl);
        Common.utils.firePageView(exteriorPageUrl);
        $(".three-sixty-open").removeClass("three-sixty-active");
        $(".three-sixty-interior").removeClass("three-sixty-active");
        $(".three-sixty-exterior").addClass("three-sixty-active");
        $(".option-buttons").hide();
        $(".player-nav").hide();
        $(".option-buttons li").css("color", "rgb(255, 255, 255)");
        $("#wr360PlayerId").show();
        $("#pano2vr-container").removeClass("showInteriorView");
        $("#pano2vr-container").addClass("hideInteriorView");
        ThreeSixtyView.plugin.removePluginCss();
        if (!ThreeSixtyView.isClosedViewLoaded) {
          ThreeSixtyView.common.toggleLoadingView(true, true);
        }

        ThreeSixtyView.startLoadTime = $.now();
        if (
          ThreeSixtyView.isClosedViewLoaded ||
          ThreeSixtyView.isOpenViewLoaded
        ) {
          ThreeSixtyView.rotator.getAPI().reload(
            ThreeSixtyView.xmlPath +
            ThreeSixtyView.closedXMLName +
            "&isMsite=false&getHotspots=true",
            ThreeSixtyView.closedDoorRoothPath + viewWiseSelectedColor[ThreeSixtyViewActiveState] + "/",
            function (api) {
              Common.utils.trackUserTimings(
                "d_360_time",
                "exterior",
                ($.now() - ThreeSixtyView.startLoadTime).toString(),
                carName
              );
              if (!ThreeSixtyView.isClosedViewLoaded)
                ThreeSixtyView.common.toggleLoadingView(false, false);
              ThreeSixtyView.isClosedViewLoaded = true;
              ThreeSixtyView.plugin.removePluginCss();
              ThreeSixtyView.common.showPlayerOptions();
              ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
              $(".option-buttons").show();
              checkHotspotVisibility();
            },
            0
          );
        } else ThreeSixtyView.plugin.initialiseExterior();
      });
    },

    open360Click: function () {
      $(".three-sixty-open").on("click", function () {
        $(".js-closed-view-colors").addClass("hide");
        ThreeSixtyViewActiveState = ThreeSixtyViewStates.open;
        $(document).unbind("keydown");
        window.history.replaceState(null, null, openPageUrl);
        Common.utils.firePageView(openPageUrl);
        $(".three-sixty-exterior").removeClass("three-sixty-active");
        $(".three-sixty-interior").removeClass("three-sixty-active");
        $(".three-sixty-open").addClass("three-sixty-active");
        $(".option-buttons").hide();
        $(".player-nav").hide();
        $(".option-buttons li").css("color", "rgb(255, 255, 255)");
        $("#wr360PlayerId").show();
        $("#pano2vr-container").removeClass("showInteriorView");
        $("#pano2vr-container").addClass("hideInteriorView");
        if (!ThreeSixtyView.isOpenViewLoaded) {
          ThreeSixtyView.plugin.removePluginCss();
          ThreeSixtyView.common.toggleLoadingView(true, false);
        }
        if (
          ThreeSixtyView.isClosedViewLoaded ||
          ThreeSixtyView.isOpenViewLoaded
        ) {
          ThreeSixtyView.startLoadTime = $.now();
          ThreeSixtyView.rotator.getAPI().reload(
            ThreeSixtyView.xmlPath +
            ThreeSixtyView.openXMLName +
            "&isMsite=false&getHotspots=true",
            ThreeSixtyView.openDoorRoothPath,
            function (api) {
              Common.utils.trackUserTimings(
                "d_360_time",
                "open",
                ($.now() - ThreeSixtyView.startLoadTime).toString(),
                carName
              );
              if (!ThreeSixtyView.isOpenViewLoaded) {
                ThreeSixtyView.common.toggleLoadingView(false, false);
              }
              ThreeSixtyView.isOpenViewLoaded = true;
              $(".option-buttons").show();
              checkHotspotVisibility();
              ThreeSixtyView.plugin.removePluginCss();
              ThreeSixtyView.common.showPlayerOptions();
              ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
            },
            0
          );
        } else ThreeSixtyView.plugin.initialiseOpen();
      });
    },

    interior360Click: function () {
      $(".three-sixty-interior").on("click", function () {
        $(".js-closed-view-colors").addClass("hide");
        ThreeSixtyViewActiveState = ThreeSixtyViewStates.interior;
        window.history.replaceState(null, null, interiorPageUrl);
        Common.utils.firePageView(interiorPageUrl);
        ThreeSixtyView.bindEvents.lockWindowScroll();
        $(".three-sixty-full-screen, .option-buttons, #exterior-player").hide();
        $(".three-sixty-open").removeClass("three-sixty-active");
        $(".three-sixty-exterior").removeClass("three-sixty-active");
        $(".three-sixty-interior").addClass("three-sixty-active");
        $(".option-buttons li").css("color", "rgb(255, 255, 255)");
        $("#wr360PlayerId").hide();
        $("#pano2vr-container").addClass("showInteriorView");
        $("#pano2vr-container").removeClass("hideInteriorView");
        if (!ThreeSixtyView.isInteriorLoaded) {
          ThreeSixtyView.plugin.initialiseInterior();
          ThreeSixtyView.isInteriorLoaded = true;
        } else {
          if (!isFullScreen) {
            $(".three-sixty-full-screen").show();
          }
          $(".option-buttons").show();
          checkHotspotVisibility();
          ThreeSixtyView.plugin.handlingForBrowsers();
          ThreeSixtyView.common.showPlayerOptions();
        }
        ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
        checkHotspotVisibility();
      });
    },

    lockWindowScroll: function () {
      $(document).unbind("keydown");
      $(document).keydown(function (event) {
        ThreeSixtyView.common.keyDownScrollPrevent(event);
      });
    },
  },
};
var Hotspot = {
  registerEvents: function () {
    checkHotspotVisibility();
    Hotspot.bindEvents.toggleHotspots();
    Hotspot.bindEvents.blackoutWindowClick();
  },

  showHotspotDetail: function (viewType, hotspotId) {
    window.history.pushState("showHotspotPopup", "", "");

    $(".hotspot-outer-container").addClass("hotspot-visible");
    $(".gallery__button-contanier").hide();
    $("#wr360image_wr360PlayerId, ").addClass("blur-image");
    $("#pano2vr360Player").addClass("blur-image");
    $(".full-screen-blackout-window").show();

    var hotspotData;
    var hotspotTrackAction;
    switch (viewType) {
      case ThreeSixtyViewStates.exterior:
        hotspotData = threeSixtyDto.ExteriorHotspots[hotspotId];
        hotspotTrackAction = "exterior_";
        break;
      case ThreeSixtyViewStates.open:
        hotspotData = threeSixtyDto.OpenHotspots[hotspotId];
        hotspotTrackAction = "open_";
        break;
      default:
        hotspotData = threeSixtyDto.InteriorHotspots[hotspotId];
        hotspotTrackAction = "interior_";
        break;
    }
    Common.utils.trackAction(
      "CTInteractive",
      "desktop_360_hotspots",
      hotspotTrackAction + hotspotId,
      carName
    );
    ctTracking.trackEvent({
      'category': "desktop_360_hotspots",
      'action': hotspotTrackAction + hotspotId,
      'label': carName
    });

    if (hotspotData && hotspotData.length > 0) {
      Hotspot.bindHotspotDetails(hotspotData);
    }
  },

  bindHotspotDetails: function (hotspotData) {
    var hotspotHtml;
    var initSwiper = hotspotData.length > 1;
    switch (hotspotData[0].CategoryId) {
      case HotspotCategory.imageCarousel:
        hotspotHtml = Hotspot.createImageCarouselHtml(hotspotData, initSwiper);
        break;
      case HotspotCategory.videoCarousel:
        HotspotSwiper.currentVideoIndex = 0;
        hotspotHtml = Hotspot.createVideoCarouselHtml(hotspotData);
        HotspotSwiper.bindEvents.bindNextClick(hotspotData);
        HotspotSwiper.bindEvents.bindPrevClick(hotspotData);
        break;
    }

    HotspotSwiper.checkCarouselButtonVisibility(0, hotspotData.length);
    $("#hotspot-carousel-container").addClass("jcarousel");
    var prevBtn = $("#carousel-prev");
    var nextBtn = $("#carousel-next");
    prevBtn.removeClass("active");
    nextBtn.removeClass("inactive");
    prevBtn.addClass("jcarousel-control-prev inactive");
    nextBtn.addClass("jcarousel-control-next active");
    var swiperContainer = $("#hotspot-carousel-container .carousel-wrapper");
    swiperContainer.find("li").remove();
    swiperContainer.append(hotspotHtml);

    if (hotspotData[0].CategoryId === HotspotCategory.videoCarousel) {
      var iframeSelector = swiperContainer.find("iframe:first");
      iframeSelector.attr(
        "onload",
        'onYouTubeIframeReady("' + hotspotData[0].Link.slice(1) + '")'
      );
      iframeSelector.attr("id", "videoIframe");
      iframeSelector.attr(
        "src",
        "https://www.youtube.com/embed/" +
        hotspotData[0].Link.slice(1) +
        "?rel=0&fs=1&enablejsapi=1&modestbranding=0"
      );
    }

    HotspotSwiper.initialize(hotspotData[0].CategoryId);
  },

  createImageCarouselHtml: function (hotspotData, initSwiper) {
    var imageTemplate = $("#image-hotspot-template");
    imageTemplate.removeAttr("id");

    var imageCarouselHtml = "";
    var templateImageSelector = imageTemplate.find("img:first");
    var templateTitleSelector = imageTemplate.find(
      ".hotspotCarDescWrapper h3:first"
    );
    var templateDescSelector = imageTemplate.find(
      ".hotspotCarDescWrapper .hotspot-info-content"
    );

    $.each(hotspotData, function (index, data) {
      templateImageSelector.attr(
        "src",
        ThreeSixtyView.common.createImageUrl(cdnHostUrl, "642x361", data.Link)
      );
      templateTitleSelector.html(data.Title);
      templateDescSelector.text(data.Description);
      imageTemplate.attr("data-totalcount", hotspotData.length);
      imageTemplate.attr("data-index", index);
      imageCarouselHtml += imageTemplate[0].outerHTML;
    });
    imageTemplate.attr("id", "image-hotspot-template");

    return imageCarouselHtml;
  },

  createVideoCarouselHtml: function (hotspotData) {
    var videoTemplate = $("#video-hotspot-template");
    videoTemplate.removeAttr("id");

    var videoCarouselHtml = "";
    var iframeSelector = videoTemplate.find("iframe:first");

    var videoId = hotspotData[0].Link.slice(1);
    iframeSelector.attr("data-id", videoId);
    videoTemplate
      .find(".hotspotCarDescWrapper h3:first")
      .html(hotspotData[0].Title);
    getVideoData(videoTemplate.find(".hotspotCarDescWrapper"), videoId);

    videoTemplate.attr("data-totalcount", hotspotData.length);
    videoTemplate.attr("data-index", index);
    videoCarouselHtml += videoTemplate[0].outerHTML;
    videoTemplate.attr("id", "video-hotspot-template");

    return videoCarouselHtml;
  },

  bindEvents: {
    toggleHotspots: function () {
      $("#cmn-toggle-1").on("change", function () {
        checkHotspotVisibility();

        Common.utils.trackAction(
          "CTInteractive",
          "desktop_360_hotspots",
          "hotspot_toggle",
          $("#cmn-toggle-1").is(":checked") ? "on" : "off"
        );
        ctTracking.trackEvent({
          'category': "desktop_360_hotspots",
          'action': "hotspot_toggle",
          'label': $("#cmn-toggle-1").is(":checked") ? "on" : "off"
        });
      });
    },

    blackoutWindowClick: function () {
      $(".full-screen-blackout-window").on("click", function () {
        HotspotSwiper.closeHotspotPopup();
        window.history.back();
      });
    },
  },

  onHotspotClick: function (hotspotId, viewType) {
    Hotspot.showHotspotDetail(viewType, hotspotId);
  },
};

function fireOnLoadTracking() {
  var activeTab = document.querySelector(".three-sixty-active");
  var lbl = activeTab.getAttribute("data-cwtclbl");
  cwTracking.trackCustomData("Images", "360ImageView", lbl, false);
}

$(window).load(function () {
  ThreeSixtyViewActiveState =
    category === "closed"
      ? ThreeSixtyViewStates.exterior
      : category === "open"
        ? ThreeSixtyViewStates.open
        : ThreeSixtyViewStates.interior;
  isViewLoaded[`${ThreeSixtyViewActiveState}-${viewWiseSelectedColor[ThreeSixtyViewActiveState]}`] = true;
  $(`#tick-image-1-${viewWiseSelectedColor[1]}`).removeClass("hide");
  fireOnLoadTracking();
  ThreeSixtyView.pageLoad.registerEvents();
  Hotspot.registerEvents();
  HotspotSwiper.registerEvents();
});

