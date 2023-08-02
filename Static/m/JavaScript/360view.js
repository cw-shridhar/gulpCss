var Common = {
	utils: {
		eventTracking: function () {
			$(document).on("click", "[data-role='click-tracking']", function () {
				Common.utils.callTracking($(this));
			});
		},

		callTracking: function (node, action) {
			if (action == undefined) action = "";
			try {
				var evCat = node.data("cat") ? node.data("cat") : "",
					evAct = node.data("action") ? node.data("action") + action : "",
					evLab = node.data("label") ? node.data("label") : "",
					evEvent = node.data("event") ? node.data("event") : "";
				Common.utils.trackAction(evEvent, evCat, evAct, evLab);
			} catch (e) {
				console.log(e);
			}
		},

		trackAction: function (actionEvent, actionCat, actionAct, actionLabel) {
			var pushObject;
			if (actionLabel != undefined && actionLabel.length > 0)
				pushObject = {
					event: actionEvent,
					cat: actionCat,
					act: actionAct,
					lab: actionLabel,
				};
			else pushObject = { event: actionEvent, cat: actionCat, act: actionAct };
			dataLayer.push(pushObject);
		},

		trackUserTimings: function (category, timing, value, label) {
			ga("create", "UA-337359-1", "auto");
			ga("send", {
				hitType: "timing",
				timingCategory: category,
				timingVar: timing,
				timingLabel: label ? label : "",
				timingValue: value,
			});
		},

		fireGAEvent: function (eventCategory) {
			ThreeSixtyView.plugin.removePluginCss();
			Common.utils.trackAction(
				"CTNonInteractive",
				"msite_360_load_time",
				eventCategory,
				Math.round(($.now() - beforeLoadTime) / 1000).toString()
			);
			ctTracking.trackEvent({
				'category': "msite_360_load_time",
				'action': eventCategory,
				'label': Math.round(($.now() - beforeLoadTime) / 1000).toString()
			});
			if (eventCategory == "view_load")
				ThreeSixtyView.gaEventForOpenDoorFired = true;
		},

		firePageView: function (url) {
			try {
				ga("create", "UA-337359-1", "auto", { useAmpClientId: true });
				ga("send", "pageview", url);
			} catch (e) {
				console.log(e);
			}
		},
	},
};

var viewWiseSelectedColor = {
	1: selectedColorForClosedView,
};

var isViewLoaded = {
};

function handleColorClick(colorCode) {
	if (viewWiseSelectedColor[ThreeSixtyView.activeState] == colorCode) {
		return;
	}
	$(`#tick-image-${ThreeSixtyView.activeState}-${viewWiseSelectedColor[ThreeSixtyView.activeState]}`).addClass("hide");
	viewWiseSelectedColor[ThreeSixtyView.activeState] = colorCode;
	$(`#tick-image-${ThreeSixtyView.activeState}-${viewWiseSelectedColor[ThreeSixtyView.activeState]}`).removeClass("hide");
	$(".js-closed-view-colors").addClass("hide");

	beforeLoadTime = $.now();
	var isClosed = ThreeSixtyView.activeState === ThreeSixtyView.states.exterior;
	if (!isViewLoaded[`${ThreeSixtyView.activeState}-${colorCode}`]) {
		ThreeSixtyView.common.toggleLoadingView(true, isClosed);
	}
	if (ThreeSixtyView.isFullScreen) {
		$(".js-controls-wrapper").hide();
	}
	else {
		$("#fullScreen").hide();
		$("#options").hide();
		$("#menu-options").hide();
	}
	if (!ThreeSixtyView.isExteriorViewLoaded) {
		ThreeSixtyView.plugin.initialiseOpen();
	}
	else {
		ThreeSixtyView.startLoadTime = $.now();
		ThreeSixtyView.rotator.getAPI().reload(
			ThreeSixtyView.xmlPath + ThreeSixtyView.closedXMLName +
			"&getHotspots=true",
			ThreeSixtyView.closedDoorRoothPath + viewWiseSelectedColor[ThreeSixtyView.activeState] + "/",
			function (api) {
				if (ThreeSixtyView.isFullScreen) {
					$(".js-controls-wrapper").show();
				}
				else {
					$("#fullScreen").hide();
					$("#options").show();
					$("#menu-options").show();
				}
				$("#wr360PlayerId").show();
				if (!isViewLoaded[`${ThreeSixtyView.activeState}-${colorCode}`]) {
					ThreeSixtyView.common.toggleLoadingView(false, false);
					isViewLoaded[`${ThreeSixtyView.activeState}-${colorCode}`] = true;
				}
				$(".gallery__button-contanier").show();
				ThreeSixtyView.plugin.handlingForBrowsers();
				ThreeSixtyView.plugin.removePluginCss();
				ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
				Hotspot.checkHotspotVisibility();
				$(".js-closed-view-colors").removeClass("hide");
			}, 0);
	}
	ThreeSixtyView.plugin.toggle360View();
}

var ThreeSixtyView = {
	closedDoorRoothPath:
		cdnHostUrl +
		"860x484/" +
		"cw/360/" +
		modelDetails.urlMakeName +
		"/" +
		modelDetails.modelId +
		"/closed-door/",
	openDoorRoothPath:
		cdnHostUrl +
		"860x484/cw/360/" +
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
		"/interior/m/",
	xmlPath: "/api/xml/360/v2/" + modelDetails.modelId + "/",
	closedXMLName:
		"closed/3/?isMsite=true&qualityFactor=75&imageCount=36&v=" +
		xmlVersion.closed,
	openXMLName:
		"open/3/?isMsite=true&qualityFactor=75&imageCount=36&v=" + xmlVersion.open,
	interiorXMLName: "interior/3/?qualityFactor=75&v=" + xmlVersion.interior,
	isExteriorViewLoaded: false,
	isOpenViewLoaded: false,
	isInteriorLoaded: false,
	gaEventForOpenDoorFired: false,
	isPageLoad: true,
	isFullScreenAvailable: true,
	rotator: WR360.ImageRotator.Create("wr360PlayerId"),
	pano: null,
	skin: null,
	states: {
		exterior: 1,
		open: 2,
		interior: 3,
	},
	activeState: 0,
	orientation:
		screen.orientation || screen.mozOrientation || screen.msOrientation,
	isFullScreen: false,
	startLoadTime: null,
	drpSelectModel: $("#drpSelectModel"),
	pageLoad: {
		registerEvents: function () {
			Common.utils.eventTracking();
			if (/UCBrowser|iPad|iPhone|iPod/.test(navigator.userAgent))
				ThreeSixtyView.isFullScreenAvailable = false;
			if (ThreeSixtyView.activeState == ThreeSixtyView.states.exterior)
				ThreeSixtyView.plugin.initialiseExterior();
			else if (ThreeSixtyView.activeState == ThreeSixtyView.states.open)
				ThreeSixtyView.plugin.initialiseOpen();
			else ThreeSixtyView.plugin.initialiseInterior();
			// In case of ios and uc we hide the full screen icon
			ThreeSixtyView.bindEvents.activeTab();
			ThreeSixtyView.bindEvents.resize();
			ThreeSixtyView.bindEvents.popupClose();
			ThreeSixtyView.bindEvents.exterior360Click();
			ThreeSixtyView.bindEvents.open360Click();
			ThreeSixtyView.bindEvents.interior360Click();
			ThreeSixtyView.bindEvents.showMenuOptions();
			ThreeSixtyView.bindEvents.hideMenuOptions();
			ThreeSixtyView.bindEvents.changeModelClick();
			ThreeSixtyView.bindEvents.onPopState();
			ThreeSixtyView.bindEvents.makeChange();
			ThreeSixtyView.bindEvents.modelChange();
			ThreeSixtyView.bindEvents.changeModelPopupClose();
			$("#hotspot-close, .info-content-container").removeClass("hide");
		},
	},

	plugin: {
		setRotatorSettings: function (xmlName, rootPath) {
			ThreeSixtyView.rotator.licenseFileURL = "/license.lic";
			ThreeSixtyView.rotator.settings.configFileURL =
				ThreeSixtyView.xmlPath + xmlName + "&getHotspots=true";
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
					"m_360_time",
					ThreeSixtyView.activeState == ThreeSixtyView.states.exterior
						? "exterior"
						: "open",
					($.now() - ThreeSixtyView.startLoadTime).toString(),
					carName
				);
				Common.utils.fireGAEvent("page_load");
				ThreeSixtyView.common.toggleLoadingView(false, false);

				if (ThreeSixtyView.isFullScreen) $(".js-controls-wrapper").show();
				$("#options").show();
				ThreeSixtyView.rotator.getAPI().toolbar.rotateOnce();
				ThreeSixtyView.bindEvents.rotation();
				$(".menu-options").show();
				$(".gallery__button-contanier").show();
				$("#changeModelLink").show();
				Hotspot.checkHotspotVisibility();
			};

			ThreeSixtyView.startLoadTime = $.now();
			ThreeSixtyView.rotator.runImageRotator();
		},

		initialiseExterior: function () {
			ThreeSixtyView.plugin.setRotatorSettings(
				ThreeSixtyView.closedXMLName,
				ThreeSixtyView.closedDoorRoothPath + viewWiseSelectedColor[ThreeSixtyView.activeState] + "/"

			);
			ThreeSixtyView.isExteriorViewLoaded = true;
		},

		initialiseOpen: function () {
			ThreeSixtyView.plugin.setRotatorSettings(
				ThreeSixtyView.openXMLName,
				ThreeSixtyView.openDoorRoothPath
			);
			ThreeSixtyView.isOpenViewLoaded = true;
		},

		initialiseInterior: function () {
			ThreeSixtyView.pano = new pano2vrPlayer("pano2vr360Player");
			ThreeSixtyView.pano.uh = false;
			ThreeSixtyView.skin = new pano2vrSkin(ThreeSixtyView.pano);
			ThreeSixtyView.startLoadTime = $.now();
			ThreeSixtyView.pano.readConfigUrl(
				ThreeSixtyView.xmlPath +
				ThreeSixtyView.interiorXMLName +
				"&isMsite=true&getHotspots=true",
				ThreeSixtyView.interiorRootPath
			);
			ThreeSixtyView.plugin.toggle360View();
			$(".loading").hide();
			$("#pano2vr360Player").show();
			$(".menu-options").show();
			$("#changeModelLink").show();
			ThreeSixtyView.pano.kl = function () { };

			ThreeSixtyView.isInteriorLoaded = true;
			ThreeSixtyView.plugin.handlingForBrowsers();
		},

		progressCallback: function (isFullScreen, percentLoaded, isZoomLoading) {
			$(".loading").hide();
			if (ThreeSixtyView.isPageLoad) {
				$(".js-closed-view-colors").addClass("hide");
				ThreeSixtyView.plugin.removePluginCss();
				ThreeSixtyView.isPageLoad = false;
				$("#loadingProgress").show();
			}
			$("#loadingProgress").text(percentLoaded + "%");
		},

		removePluginCss: function () {
			$(".view-img-container").css("height", "");
			$("#wr360PlayerId").css("height", "");
			$("#wr360image_wr360PlayerId").css({
				height: "",
				"margin-top": "",
				"margin-left": "",
				width: "100%",
			});
			$("#wr360container_wr360PlayerId").css({
				width: "100% !important",
				height: "",
			});
		},

		portraitMode: function () {
			var body = $("body");
			body
				.filter(function () {
					return this.className.match(/\blandScape/);
				})
				.removeClass();
			if ($(window).innerWidth() > 767) {
				body
					.filter(function () {
						return this.className.match(/\blandScape/);
					})
					.removeClass();
				body.addClass("portrait768Style");
			}
			$("#pano2vr360Player").css({
				width: window.innerWidth + "px",
				height: (window.innerWidth * 9) / 16 + "px",
			});
		},

		landscapeMode: function () {
			var body = $("body");
			body.addClass("landScapeView");
			if ($(window).innerWidth() > 479) {
				body
					.filter(function () {
						return this.className.match(/\bportrait/);
					})
					.removeClass();
				body.addClass("landScape480Style");
			}
			if ($(window).innerWidth() > 1023) {
				body
					.filter(function () {
						return this.className.match(/\bportrait/);
					})
					.removeClass();
				body.addClass("landScape1024Style");
			}
			$("#pano2vr360Player").css({
				width: window.innerWidth + "px",
				height: window.innerHeight + "px",
			});
		},

		handlingForBrowsers: function () {
			if (/UCBrowser|iPad|iPhone|iPod/.test(navigator.userAgent)) {
				$("#fullScreen").hide();
				ThreeSixtyView.isFullScreenAvailable = false;
			} else {
				$(".hotspot-outer-container").removeClass("hide");
				if (!ThreeSixtyView.isFullScreen) $("#fullScreen").show();
			}
			if (/iPad|iPod/.test(navigator.userAgent))
				$(".ggskin_text, .ggskin_loadingdiv").hide();
		},

		toggle360View: function () {
			if (window.innerWidth < window.innerHeight)
				ThreeSixtyView.plugin.portraitMode();
			else ThreeSixtyView.plugin.landscapeMode();
		},
		exteriorReload: function () {
			if (ThreeSixtyView.activeState == ThreeSixtyView.states.exterior)
				ThreeSixtyView.rotator.getAPI().reload(
					ThreeSixtyView.xmlPath +
					ThreeSixtyView.closedXMLName +
					"&getHotspots=true",
					ThreeSixtyView.closedDoorRoothPath + viewWiseSelectedColor[ThreeSixtyView.activeState] + "/",
					function (api) {
						ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
						Hotspot.checkHotspotVisibility();
					},
					ThreeSixtyView.rotator.getAPI().images.getCurrentImageIndex()
				);
			else if (ThreeSixtyView.activeState == ThreeSixtyView.states.open)
				ThreeSixtyView.rotator.getAPI().reload(
					ThreeSixtyView.xmlPath +
					ThreeSixtyView.openXMLName +
					"&getHotspots=true",
					ThreeSixtyView.openDoorRoothPath,
					function (api) {
						ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
						Hotspot.checkHotspotVisibility();
					},
					ThreeSixtyView.rotator.getAPI().images.getCurrentImageIndex()
				);
		},
		toggleFullScreen: function () {
			var doc = window.document;
			var docEl = doc.documentElement;
			var requestFullScreen =
				docEl.requestFullscreen ||
				docEl.mozRequestFullScreen ||
				docEl.webkitRequestFullScreen ||
				docEl.msRequestFullscreen;
			if (!document.webkitIsFullScreen && requestFullScreen) {
				$("body").addClass("fullscreenmode");

				ThreeSixtyView.isFullScreen = true;
				requestFullScreen.call($("#player")[0]);

				if ("orientation" in screen) {
					screen.orientation.unlock();
					if (
						screen.orientation.type == "landscape-secondary" &&
						screen.orientation.angle == 270
					)
						screen.orientation.lock("landscape-secondary");
					else screen.orientation.lock("landscape-primary");
				}

				ThreeSixtyView.plugin.exteriorReload();
			} else {
				$("body").removeClass("fullscreenmode");
				if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
				else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
				else if (document.msExitFullscreen) document.msExitFullscreen();
				ThreeSixtyView.isFullScreen = false;
			}
			Hotspot.checkHotspotVisibility();
		},

		toggleCss: function () {
			if (ThreeSixtyView.isFullScreen) {
				$("#fullScreen").hide();
				$(".js-controls-wrapper").show();
				$(".fullscreen-close").show();
			} else {
				$(".js-controls-wrapper").hide();
				$("#fullScreen").show();
				$(".fullscreen-close").hide();
			}
		},
	},

	common: {
		isReferrerCarWale: function () {
			return (
				document.referrer != "" &&
				document.referrer.indexOf("carwale.com") != -1
			);
		},

		isReferrerCarTrade: function () {
			return (
				document.referrer != "" &&
				document.referrer.indexOf("cartrade.com") != -1
			);
		},

		toggleLoadingView: function (showLoading, isClosedLoading) {
			if (showLoading) {
				if (ThreeSixtyView.isFullScreen) {
					$("#fullscreen").hide();
				}

				$("#wr360PlayerId").hide();
				$("#tempLoadingImage").show();
				if (isClosedLoading) {
					$("#loadingClosedDoor").show();
					$("#loadingOpenDoor").hide();
				} else {
					$("#loadingClosedDoor").hide();
					$("#loadingOpenDoor").show();
					$("#loadingProgress").show();
					$("#loadingProgress").text("0%");
				}
			} else {
				$("#tempLoadingImage, #loadingClosedDoor, #loadingOpenDoor").hide();
				if (!ThreeSixtyView.isFullScreen) {
					$("#fullscreen").show();
				}
				$("#wr360PlayerId").show();
				ThreeSixtyView.plugin.handlingForBrowsers(); // In case of ios and uc we hide the full screen icon
			}
			if (ThreeSixtyView.activeState == ThreeSixtyView.states.exterior) {
				$(".js-closed-view-colors").removeClass("hide");
			}
		},

		formatSpecial: function (str) {
			var reg = /[^/\-0-9a-zA-Z\s]*/g;
			str = str.replace(reg, "");
			return str
				.toLowerCase()
				.replace(/ /g, "")
				.replace(/-/g, "")
				.replace("/", "");
		},

		get360PageUrl: function (makeName, maskingName) {
			return (
				"/" +
				ThreeSixtyView.common.formatSpecial(makeName) +
				"-cars/" +
				maskingName +
				"/360-view/"
			);
		},

		populateModels: function () {
			var makeId = parseInt($("#drpSelectMake option:selected").val());
			var drpSelectModel = $("#drpSelectModel");

			drpSelectModel.find("option").not(":first").remove();
			if (makeId != 0) {
				$.ajax({
					type: "GET",
					url: "/api/v1/models/?type=360&makeId=" + makeId,
				})
					.done(function (response) {
						drpSelectModel.removeAttr("disabled");
						$.each(response, function (index, model) {
							drpSelectModel.append(
								$("<option></option>")
									.val(model.modelId)
									.html(model.modelName)
									.attr("maskingname", model.maskingName)
							);
						});
					})
					.fail(function (response) {
						console.log(response);
					});
			} else drpSelectModel.attr("disabled", "disabled");
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

	tracking: {},

	bindEvents: {
		exterior360Click: function () {
			$(".exteriorView, #full-screen-exterior-view").on("click", function () {
				if (ThreeSixtyView.activeState == ThreeSixtyView.states.interior) {
					$("#pano2vr360Player").removeClass("showInteriorView");
					$("#pano2vr360Player").addClass("hideInteriorView");
				}
				ThreeSixtyView.activeState = ThreeSixtyView.states.exterior;
				window.history.replaceState(null, null, exteriorPageUrl);
				Common.utils.firePageView(exteriorPageUrl);
				if (ThreeSixtyView.isFullScreen) {
					$(".js-controls-wrapper").hide();
				}
				else {
					$("#fullScreen").hide();
					$("#options").hide();
					$("#menu-options").hide();
				}
				$("#wr360PlayerId").show();
				if (!ThreeSixtyView.isExteriorViewLoaded) {
					ThreeSixtyView.common.toggleLoadingView(true, true);
				}
				if (
					!ThreeSixtyView.isExteriorViewLoaded &&
					!ThreeSixtyView.isOpenViewLoaded
				)
					ThreeSixtyView.plugin.initialiseExterior();
				else {
					ThreeSixtyView.startLoadTime = $.now();
					ThreeSixtyView.rotator.getAPI().reload(
						ThreeSixtyView.xmlPath +
						ThreeSixtyView.closedXMLName +
						"&getHotspots=true",
						ThreeSixtyView.closedDoorRoothPath + viewWiseSelectedColor[ThreeSixtyView.activeState] + "/",
						function (api) {
							Common.utils.trackUserTimings(
								"m_360_time",
								"exterior",
								($.now() - ThreeSixtyView.startLoadTime).toString(),
								carName
							);
							ThreeSixtyView.plugin.removePluginCss();
							if (ThreeSixtyView.isFullScreen) {
								$(".js-controls-wrapper").show();
							}
							else {
								$("#fullScreen").show();
								$("#options").show();
								$("#menu-options").show();
							}
							ThreeSixtyView.plugin.handlingForBrowsers();
							$("#tempLoadingImage").hide();
							ThreeSixtyView.common.toggleLoadingView(false, false);
							ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
							Hotspot.checkHotspotVisibility();
							ThreeSixtyView.isExteriorViewLoaded = true;
							$(".js-closed-view-colors").removeClass("hide");

						},
						0
					);
				}
				ThreeSixtyView.plugin.toggle360View();
			});
		},

		open360Click: function () {
			$(".openView, #full-screen-open-view").on("click", function () {
				beforeLoadTime = $.now();
				$(".js-closed-view-colors").addClass("hide");

				if (ThreeSixtyView.activeState == ThreeSixtyView.states.interior) {
					$("#pano2vr360Player").removeClass("showInteriorView");
					$("#pano2vr360Player").addClass("hideInteriorView");
				}
				ThreeSixtyView.activeState = ThreeSixtyView.states.open;
				window.history.replaceState(null, null, openPageUrl);
				Common.utils.firePageView(openPageUrl);
				if (!ThreeSixtyView.isOpenViewLoaded) {
					ThreeSixtyView.common.toggleLoadingView(true, false);
				}
				if (ThreeSixtyView.isFullScreen) {
					$(".js-controls-wrapper").hide();
				}
				else {
					$("#fullScreen").hide();
					$("#options").hide();
					$("#menu-options").hide();
				}
				if (
					!ThreeSixtyView.isOpenViewLoaded &&
					!ThreeSixtyView.isExteriorViewLoaded
				) {
					ThreeSixtyView.plugin.initialiseOpen();
				} else {
					ThreeSixtyView.startLoadTime = $.now();
					ThreeSixtyView.rotator.getAPI().reload(
						ThreeSixtyView.xmlPath +
						ThreeSixtyView.openXMLName +
						"&getHotspots=true",
						ThreeSixtyView.openDoorRoothPath,
						function (api) {
							Common.utils.trackUserTimings(
								"m_360_time",
								"open",
								($.now() - ThreeSixtyView.startLoadTime).toString(),
								carName
							);
							if (!ThreeSixtyView.gaEventForOpenDoorFired)
								Common.utils.fireGAEvent("view_load");
							if (ThreeSixtyView.isFullScreen) {
								$(".js-controls-wrapper").show();
							}
							else {
								$("#fullScreen").hide();
								$("#options").show();
								$("#menu-options").show();
							}
							$("#wr360PlayerId").show();
							if (!ThreeSixtyView.isOpenViewLoaded) {
								ThreeSixtyView.common.toggleLoadingView(false, false);
								ThreeSixtyView.isOpenViewLoaded = true;
							}
							$(".gallery__button-contanier").show();
							ThreeSixtyView.plugin.handlingForBrowsers();
							ThreeSixtyView.plugin.removePluginCss();
							ThreeSixtyView.rotator.getAPI().toolbar.hotspotToggle();
							Hotspot.checkHotspotVisibility();
						},
						0
					);
				}
				ThreeSixtyView.plugin.toggle360View();
			});
		},

		interior360Click: function () {
			$(".interiorView, #full-screen-interior-view").on("click", function () {
				$(".js-closed-view-colors").addClass("hide");
				ThreeSixtyView.activeState = ThreeSixtyView.states.interior;
				Hotspot.checkHotspotVisibility();
				window.history.replaceState(null, null, interiorPageUrl);
				Common.utils.firePageView(interiorPageUrl);
				$("#pano2vr360Player").addClass("showInteriorView");
				$("#pano2vr360Player").removeClass("hideInteriorView");
				$("#wr360PlayerId").hide();

				if (!ThreeSixtyView.isInteriorLoaded) {
					if (ThreeSixtyView.isFullScreen) {
						$(".js-controls-wrapper").hide();
					}
					else {
						$("#options").hide();
						$("#fullScreen").hide();
					}
					ThreeSixtyView.plugin.initialiseInterior();
					ThreeSixtyView.isInteriorLoaded = true;
				}
				ThreeSixtyView.pano.me();
			});
		},

		popupClose: function () {
			$("#360-popup-close").on("click", function () {
				if (ThreeSixtyView.common.isReferrerCarTrade()) {
					window.history.back();
				} else {
					window.location.href = modelPageUrl;
				}
			});
		},

		rotation: function () {
			$("#wr360image_wr360PlayerId").on("load", function (event) {
				var currentImage =
					ThreeSixtyView.rotator.getAPI().images.getCurrentImageIndex() + 1;
				if (currentImage > 0 && currentImage % 9 === 0) {
					Common.utils.trackAction(
						"CTInteractive",
						"msite_360_rotation",
						"image_" + currentImage,
						"image_" + currentImage
					);

					ctTracking.trackEvent({
						'category': "msite_360_rotation",
						'action': "image_" + currentImage,
						'label': "image_" + currentImage
					});
				}
			});
		},

		activeTab: function () {
			$(".gallery__nav--button").click(function () {
				var element = $(this);

				if (element.hasClass("exteriorView")) {
					var extView = $(".exteriorView");
					extView.siblings().removeClass("gallery__nav--button-active");
					extView.addClass("gallery__nav--button-active");
				} else if (element.hasClass("openView")) {
					var openView = $(".openView");
					openView.siblings().removeClass("gallery__nav--button-active");
					openView.addClass("gallery__nav--button-active");
				} else if (element.hasClass("interiorView")) {
					var intView = $(".interiorView");
					intView.siblings().removeClass("gallery__nav--button-active");
					intView.addClass("gallery__nav--button-active");
				}
			});
		},

		resize: function () {
			$(window).on("resize", function () {
				ThreeSixtyView.plugin.removePluginCss();
				if (window.innerWidth < window.innerHeight)
					ThreeSixtyView.plugin.portraitMode();
				else ThreeSixtyView.plugin.landscapeMode();
			});

			$(document).on(
				"fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange",
				function (e) {
					if (
						document.fullscreen ||
						document.mozFullScreen ||
						document.webkitIsFullScreen ||
						document.msFullscreenElement
					)
						ThreeSixtyView.isFullScreen = true;
					else {
						if (
							ThreeSixtyView.isFullScreen &&
							$(".hotspot-outer-container").hasClass("hotspot-visible")
						) {
							HotspotSwiper.closeHotspotPopup();
							window.history.back();
						}

						ThreeSixtyView.isFullScreen = false;
					}
					Hotspot.checkHotspotVisibility();
					ThreeSixtyView.plugin.toggleCss();
				}
			);
		},

		showMenuOptions: function () {
			$("#menu-options").on("click", function () {
				$("#menu-options").hide();
				$("#options-popup").show();
				$(".blackout-window").show();
			});
		},

		hideMenuOptions: function () {
			$(".blackout-window").on("click", function () {
				$(".blackout-window").hide();
				$("#options-popup").hide();
				$("#menu-options").show();
			});
		},

		orientationChange: function () {
			$(window).on("orientationchange", function () {
				ThreeSixtyView.plugin.handlingForBrowsers();
			});
		},

		changeModelClick: function () {
			$(".change-model-btn").click(function () {
				$(".change-model-blackout-window").show();
				$(".change-model-popup").show();
				window.history.pushState("addChange360carPopup", "", "");
			});
		},

		onPopState: function () {
			$(window).on("popstate", function (e) {
				var changeModelPopupSelector = $(".change-model-popup");
				if (changeModelPopupSelector.is(":visible")) {
					$(".change-model-blackout-window").hide();
					changeModelPopupSelector.hide();
				}

				if ($(".hotspot-outer-container").hasClass("hotspot-visible")) {
					HotspotSwiper.closeHotspotPopup();
				}
			});
		},

		makeChange: function () {
			$("#drpSelectMake").on("change", function () {
				ThreeSixtyView.common.populateModels();
				if (parseInt($("#drpSelectMake option:selected").val(), 10) > 0) {
					Common.utils.trackAction(
						"CTInteractive",
						"msite_360_change_car",
						"make_selected",
						$("#drpSelectMake option:selected").text()
					);

					ctTracking.trackEvent({
						'category': "msite_360_change_car",
						'action': "make_selected",
						'label': $("#drpSelectMake option: selected").text()
					});
				}
			});
			ThreeSixtyView.common.populateModels();
		},

		changeModelPopupClose: function () {
			$(".change-model-closebtn, .change-model-blackout-window").click(
				function () {
					$(".change-model-blackout-window").hide();
					$(".change-model-popup").hide();
					window.history.back();
				}
			);
		},

		modelChange: function () {
			$("#drpSelectModel").on("change", function () {
				if (
					parseInt(this.options[this.selectedIndex].getAttribute("value")) > 0
				) {
					var makeName = $("#drpSelectMake option:selected").text();
					var modelName = this.options[this.selectedIndex].text;
					var maskingName = this.options[this.selectedIndex].getAttribute(
						"maskingname"
					);
					Common.utils.trackAction(
						"CTInteractive",
						"msite_360_change_car",
						"model_selected",
						makeName + " " + modelName
					);
					ctTracking.trackEvent({
						'category': "msite_360_change_car",
						'action': "model_selected",
						'label': makeName + " " + modelName
					});
					window.location.href = ThreeSixtyView.common.get360PageUrl(
						makeName,
						maskingName
					);
				}
			});
		},
	},
};

var Hotspot = {
	category: {
		text: 1,
		imageCarousel: 2,
		videoCarousel: 3,
	},

	registerEvents: function () {
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
			case ThreeSixtyView.states.exterior:
				hotspotData = threeSixtyDto.ExteriorHotspots[hotspotId];
				hotspotTrackAction = "exterior_";
				break;
			case ThreeSixtyView.states.open:
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
			"msite_360_hotspots",
			hotspotTrackAction + hotspotId,
			carName
		);

		ctTracking.trackEvent({
			'category': "msite_360_hotspots",
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
		HotspotSwiper.unbindEvent(
			$("#swiper-next"),
			"click",
			HotspotSwiper.nextVideoEvent
		);
		HotspotSwiper.unbindEvent(
			$("#swiper-prev"),
			"click",
			HotspotSwiper.prevVideoEvent
		);
		switch (hotspotData[0].CategoryId) {
			case Hotspot.category.imageCarousel:
				hotspotHtml = Hotspot.createImageCarouselHtml(hotspotData, initSwiper);
				break;
			case Hotspot.category.videoCarousel:
				HotspotSwiper.currentVideoIndex = 0;
				hotspotHtml = Hotspot.createVideoCarouselHtml(hotspotData);
				HotspotSwiper.bindEvents.bindNextClick(hotspotData);
				HotspotSwiper.bindEvents.bindPrevClick(hotspotData);
				break;
		}

		HotspotSwiper.checkSwiperButtonVisibility(0, hotspotData.length);

		var swiperContainer = $("#hotspot-swiper-container .swiper-wrapper");
		swiperContainer.find("li").remove();
		swiperContainer.append(hotspotHtml);

		if (hotspotData[0].CategoryId === Hotspot.category.videoCarousel) {
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

		HotspotSwiper.initialize(
			initSwiper && hotspotData[0].CategoryId != Hotspot.category.videoCarousel,
			hotspotData[0].CategoryId,
			hotspotData.length
		);
	},

	createImageCarouselHtml: function (hotspotData, initSwiper) {
		var imageTemplate = $("#image-hotspot-template");
		imageTemplate.removeAttr("id");

		var imageCarouselHtml = "";
		var templateImageSelector = imageTemplate.find("img:first");
		var templateTitleSelector = imageTemplate.find(".carDescWrapper h3:first");
		var templateDescSelector = imageTemplate.find(
			".carDescWrapper .hotspot-info-content"
		);

		$.each(hotspotData, function (index, data) {
			if (initSwiper) {
				templateImageSelector.attr(
					"data-src",
					ThreeSixtyView.common.createImageUrl(cdnHostUrl, "642x361", data.Link)
				);
				templateImageSelector.attr(
					"src",
					ThreeSixtyView.common.createImageUrl(
						cdnHostUrl,
						"0x0",
						"/statics/grey.gif"
					)
				);
				templateImageSelector.next().addClass("swiper-lazy-preloader");
			} else {
				templateImageSelector.attr(
					"src",
					ThreeSixtyView.common.createImageUrl(cdnHostUrl, "642x361", data.Link)
				);
				templateImageSelector.next().removeClass("swiper-lazy-preloader");
			}
			templateTitleSelector.html(data.Title);
			templateDescSelector.text(data.Description);

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
		videoTemplate.find(".carDescWrapper h3:first").html(hotspotData[0].Title);
		Hotspot.getVideoData(videoTemplate.find(".carDescWrapper"), videoId);

		videoCarouselHtml += videoTemplate[0].outerHTML;
		videoTemplate.attr("id", "video-hotspot-template");

		return videoCarouselHtml;
	},

	getVideoData: function (selector, videoId) {
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
	},

	checkHotspotVisibility: function () {
		var showHotspots = false;

		switch (ThreeSixtyView.activeState) {
			case ThreeSixtyView.states.exterior:
				showHotspots = exteriorHotspotsPresent;
				break;
			case ThreeSixtyView.states.open:
				showHotspots = openHotspotsPresent;
				break;
			default:
				showHotspots = interiorHotspotsPresent;
				break;
		}

		if (showHotspots) {
			$(".ggskin_hotspot").hide();
			$(".hotspot_indicator").addClass("hideImportant");
			if (ThreeSixtyView.isFullScreen) {
				$(".switch-container").show();
				if ($("#cmn-toggle-1").is(":checked")) {
					$(".ggskin_hotspot").show();
					$(".hotspot_indicator").removeClass("hideImportant");
				}
			} else $(".switch-container").hide();
		} else $(".switch-container").hide();
	},

	bindEvents: {
		toggleHotspots: function () {
			$("#cmn-toggle-1").on("change", function () {
				Hotspot.checkHotspotVisibility();

				Common.utils.trackAction(
					"CTInteractive",
					"msite_360_hotspots",
					"hotspot_toggle",
					$("#cmn-toggle-1").is(":checked") ? "on" : "off"
				);

				ctTracking.trackEvent({
					'category': "msite_360_hotspots",
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

var HotspotSwiper = {
	hotspotSwiper: null,
	currentVideoIndex: 0,

	registerEvents: function () {
		HotspotSwiper.bindEvents.hotspotClose();
	},

	initialize: function (initSwiper, category, hotspotDataLength) {
		if (initSwiper) {
			$('.swiper-container:not(".noSwiper")').each(function (index, element) {
				var currentSwiper = $(this);
				HotspotSwiper.hotspotSwiper = currentSwiper
					.addClass("sw-" + index)
					.swiper({
						nextButton: currentSwiper.find(".swiper-button-next"),
						prevButton: currentSwiper.find(".swiper-button-prev"),
						pagination: currentSwiper.find(".swiper-pagination"),
						slidesPerView: 1,
						paginationClickable: true,
						spaceBetween: 10,
						watchSlidesVisibility: true,
						onSlideChangeStart: function (event) {
							HotspotSwiper.checkSwiperButtonVisibility(
								event.activeIndex,
								hotspotDataLength
							);
						},
						onSlideNextStart: function () {
							Common.utils.trackAction(
								"CTInteractive",
								"msite_360_hotspot_image_carousel",
								"next",
								carName
							);
							ctTracking.trackEvent({
								'category': "msite_360_hotspot_image_carousel",
								'action': "next",
								'label': carName
							});
						},
						onSlidePrevStart: function () {
							Common.utils.trackAction(
								"CTInteractive",
								"msite_360_hotspot_image_carousel",
								"prev",
								carName
							);
							ctTracking.trackEvent({
								'category': "msite_360_hotspot_image_carousel",
								'action': "prev",
								'label': carName
							});
						},
						onInit: HotspotSwiper.initSwiper,
						preloadImages: false,
						lazyLoading: true,
					});
			});
		}

		if (category !== Hotspot.category.videoCarousel) {
			HotspotSwiper.bindReadMoreLink();
			HotspotSwiper.bindEvents.readTextLink();
		}

		if (initSwiper) $(".hotspot-swiper").data("swiper").update(true);
		else {
			$(".hotspot-outer-container .swiper-wrapper").css({
				transform: "translate3d(0,0,0)",
			});
		}

		$(".hotspot-outer-container").css("right", "0");
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

	paginationLoad: function (swiper) {
		if (swiper.slides.length == 1) {
			swiper.slides.addClass("fullWidth");
		} else if (swiper.slides.length > 1) {
			swiper.slides.removeClass("fullWidth");
		}
	},

	initSwiper: function (swiper) {
		setTimeout(function () {
			HotspotSwiper.paginationLoad(swiper);
		}, 300);
		$(window).resize(function () {
			swiper.update(true);
		});
	},

	closeHotspotPopup: function () {
		var hotspotContainer = $(".hotspot-outer-container");
		hotspotContainer.css("right", "-" + ($(document).width() + 60) + "px");
		hotspotContainer.removeClass("hotspot-visible");

		$(".gallery__button-contanier").show();
		$("#wr360image_wr360PlayerId, #pano2vr360Player").removeClass("blur-image");
		$(".full-screen-blackout-window").hide();

		if (hotspotContainer.find("#hotspot-swiper-container ul li").length > 1)
			HotspotSwiper.hotspotSwiper.destroy();
		else if (hotspotContainer.find("#videoIframe").length > 0)
			player.stopVideo();
	},

	changeVideoEvent: function (event) {
		HotspotSwiper.currentVideoIndex += event.data.videoIndexDiff;
		var hotspotData = event.data.hotspotData;

		HotspotSwiper.checkSwiperButtonVisibility(
			HotspotSwiper.currentVideoIndex,
			hotspotData.length
		);

		var videoId = hotspotData[HotspotSwiper.currentVideoIndex].Link.slice(1);
		var videoContainer = $("#hotspot-swiper-container").find(".carDescWrapper");

		videoContainer
			.find("h3:first")
			.html(hotspotData[HotspotSwiper.currentVideoIndex].Title);
		Hotspot.getVideoData(videoContainer, videoId);
		player.loadVideoById(videoId);

		Common.utils.trackAction(
			"CTInteractive",
			"msite_360_hotspot_video_carousel",
			event.data.videoIndexDiff > 0 ? "next" : "prev",
			carName
		);
		ctTracking.trackEvent({
			'category': "msite_360_hotspot_video_carousel",
			'action': event.data.videoIndexDiff > 0 ? "next" : "prev",
			'label': carName
		});
	},

	checkSwiperButtonVisibility: function (activeIndex, hotspotDataLength) {
		var swiperNext = $("#swiper-next");
		var swiperPrev = $("#swiper-prev");

		if (activeIndex + 1 === hotspotDataLength) swiperNext.hide();
		else swiperNext.show();

		if (activeIndex === 0) swiperPrev.hide();
		else swiperPrev.show();
	},

	unbindEvent: function (selector, event, boundMethod) {
		selector.unbind(event, boundMethod);
	},

	bindEvents: {
		readTextLink: function () {
			$(document).on("click", ".read-more-link", function () {
				$(this).parent().hide().prev().show();
				$(this).closest(".carDescWrapper").addClass("slideContent");

				Common.utils.trackAction(
					"CTInteractive",
					"msite_360_hotspots",
					"read_more",
					carName
				);
				ctTracking.trackEvent({
					'category': "msite_360_hotspots",
					'action': "read_more",
					'label': carName
				});
			});

			$(document).on("click", ".read-less-link", function () {
				$(this).parent().hide().next().show();
				$(this).closest(".carDescWrapper").removeClass("slideContent");

				Common.utils.trackAction(
					"CTInteractive",
					"msite_360_hotspots",
					"read_less",
					carName
				);
				ctTracking.trackEvent({
					'category': "msite_360_hotspots",
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
					"msite_360_hotspots",
					"close",
					carName
				);
				ctTracking.trackEvent({
					'category': "msite_360_hotspots",
					'action': "close",
					'label': carName
				});
				window.history.back();
			});
		},

		bindNextClick: function (hotspotData) {
			$("#swiper-next").on(
				"click",
				{ hotspotData: hotspotData, videoIndexDiff: 1 },
				HotspotSwiper.changeVideoEvent
			);
		},

		bindPrevClick: function (hotspotData) {
			$("#swiper-prev").on(
				"click",
				{ hotspotData: hotspotData, videoIndexDiff: -1 },
				HotspotSwiper.changeVideoEvent
			);
		},
	},
};

function fireOnLoadTracking() {
	var activeTab = document.querySelector(".gallery__nav--button-active");
	var lbl = activeTab.getAttribute("data-cwtclbl");
	cwTracking.trackCustomData("Images", "360ImageView", lbl, false);
}

$(window).load(function () {
	ThreeSixtyView.activeState =
		category == "closed"
			? ThreeSixtyView.states.exterior
			: category == "open"
				? ThreeSixtyView.states.open
				: ThreeSixtyView.states.interior;
	isViewLoaded[`${ThreeSixtyView.activeState}-${viewWiseSelectedColor[ThreeSixtyView.activeState]}`] = true;
	$(`#tick-image-1-${viewWiseSelectedColor[1]}`).removeClass("hide");
	if (
		ThreeSixtyView.orientation &&
		ThreeSixtyView.orientation.type === "landscape-primary"
	) {
		$("body").addClass("landScapeView landScape480Style");
	}
	fireOnLoadTracking();
	ThreeSixtyView.pageLoad.registerEvents();
	Hotspot.registerEvents();
	HotspotSwiper.registerEvents();
});
