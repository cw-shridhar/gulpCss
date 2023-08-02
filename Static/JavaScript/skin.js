// Garden Gnome Software - Skin
// Pano2VR 4.5.1/10655
// Filename: controller_slide.ggsk
// Generated Sat Jul 29 14:58:46 2017

function pano2vrSkin(player, base) {
	var userTimingTracked50 = false;
	var userTimingTracked100 = false;
	var me = this;
	var flag = false;
	var nodeMarker = new Array();
	var activeNodeMarker = new Array();
	this.player = player;
	this.player.skinObj = this;
	this.divSkin = player.divSkin;
	var basePath = "";
	// auto detect base path
	if (base == "?") {
	  var scripts = document.getElementsByTagName("script");
	  for (var i = 0; i < scripts.length; i++) {
		var src = scripts[i].src;
		if (src.indexOf("skin.js") >= 0) {
		  var p = src.lastIndexOf("/");
		  if (p >= 0) {
			basePath = src.substr(0, p + 1);
		  }
		}
	  }
	} else if (base) {
	  basePath = base;
	}
	this.elementMouseDown = new Array();
	this.elementMouseOver = new Array();
	var cssPrefix = "";
	var domTransition = "transition";
	var domTransform = "transform";
	var prefixes = "Webkit,Moz,O,ms,Ms".split(",");
	var i;
	for (i = 0; i < prefixes.length; i++) {
	  if (typeof document.body.style[prefixes[i] + "Transform"] !== "undefined") {
		cssPrefix = "-" + prefixes[i].toLowerCase() + "-";
		domTransition = prefixes[i] + "Transition";
		domTransform = prefixes[i] + "Transform";
	  }
	}
  
	this.player.setMargins(0, 0, 0, 0);
  
	this.updateSize = function (startElement) {
	  var stack = new Array();
	  stack.push(startElement);
	  while (stack.length > 0) {
		e = stack.pop();
		if (e.ggUpdatePosition) {
		  e.ggUpdatePosition();
		}
		if (e.hasChildNodes()) {
		  for (i = 0; i < e.childNodes.length; i++) {
			stack.push(e.childNodes[i]);
		  }
		}
	  }
	};
  
	parameterToTransform = function (p) {
	  var hs =
		"translate(" +
		p.rx +
		"px," +
		p.ry +
		"px) rotate(" +
		p.a +
		"deg) scale(" +
		p.sx +
		"," +
		p.sy +
		")";
	  return hs;
	};
  
	this.findElements = function (id, regex) {
	  var r = new Array();
	  var stack = new Array();
	  var pat = new RegExp(id, "");
	  stack.push(me.divSkin);
	  while (stack.length > 0) {
		e = stack.pop();
		if (regex) {
		  if (pat.test(e.ggId)) r.push(e);
		} else {
		  if (e.ggId == id) r.push(e);
		}
		if (e.hasChildNodes()) {
		  for (i = 0; i < e.childNodes.length; i++) {
			stack.push(e.childNodes[i]);
		  }
		}
	  }
	  return r;
	};
  
	this.addSkin = function () {
	  this._background = document.createElement("div");
	  this._background.ggId = "background";
	  this._background.ggParameter = { rx: 0, ry: 0, a: 0, sx: 1, sy: 1 };
	  this._background.ggVisible = true;
	  this._background.className = "ggskin ggskin_image";
	  this._background.ggType = "image";
	  this._background.ggUpdatePosition = function () {
		this.style[domTransition] = "none";
		if (this.parentNode) {
		  h = this.parentNode.offsetHeight;
		  this.style.top = -35 + h + "px";
		}
	  };
	  hs = "position:absolute;";
	  hs += "left: 0px;";
	  hs += "top:  -35px;";
	  hs += "width: 300px;";
	  hs += "height: 30px;";
	  hs += cssPrefix + "transform-origin: 50% 50%;";
	  hs += "visibility: inherit;";
	  this._background.setAttribute("style", hs);
	  this._slider = document.createElement("div");
	  this._slider.ggId = "slider";
	  this._slider.ggParameter = { rx: 0, ry: 0, a: 0, sx: 1, sy: 1 };
	  this._slider.ggVisible = true;
	  this._slider.className = "ggskin ggskin_image";
	  this._slider.ggType = "image";
	  hs = "position:absolute;";
	  hs += "left: 277px;";
	  hs += "top:  4px;";
	  hs += "width: 20px;";
	  hs += "height: 22px;";
	  hs += cssPrefix + "transform-origin: 50% 50%;";
	  hs += "visibility: inherit;";
	  this._slider.setAttribute("style", hs);
	  this._slider.onclick = function () {
		flag = me._background.ggPositonActive;
		if (me.player.transitionsDisabled) {
		  me._background.style[domTransition] = "none";
		} else {
		  me._background.style[domTransition] = "all 1000ms ease-out 0ms";
		}
		if (flag) {
		  me._background.ggParameter.rx = 0;
		  me._background.ggParameter.ry = 0;
		  me._background.style[domTransform] = parameterToTransform(
			me._background.ggParameter
		  );
		} else {
		  me._background.ggParameter.rx = -275;
		  me._background.ggParameter.ry = 0;
		  me._background.style[domTransform] = parameterToTransform(
			me._background.ggParameter
		  );
		}
		me._background.ggPositonActive = !flag;
	  };
	  this._background.appendChild(this._slider);
	  this.divSkin.appendChild(this._background);
	  this._loading_text = document.createElement("div");
	  this._loading_text__text = document.createElement("div");
	  this._loading_text.className = "ggskin ggskin_textdiv";
	  this._loading_text.ggTextDiv = this._loading_text__text;
	  this._loading_text.ggId = "Loading text";
	  this._loading_text.ggParameter = { rx: 0, ry: 0, a: 0, sx: 1, sy: 1 };
	  this._loading_text.ggVisible = true;
	  this._loading_text.className = "ggskin ggskin_text";
	  this._loading_text.ggType = "text";
	  hs = "position:absolute;";
	  hs += "left: 47%;";
	  hs += "top:  41%;";
	  hs += "width: 177px;";
	  hs += "height: 20px;";
	  hs += cssPrefix + "transform-origin: 50% 50%;";
	  hs += "visibility: inherit;";
	  this._loading_text.setAttribute("style", hs);
	  hs = "position:absolute;";
	  hs += "left: 0px;";
	  hs += "top:  0px;";
	  hs += "width: 60px;";
	  hs += "height: 60px;";
	  hs += "border: 1px solid #fff;";
	  hs += "color: #fff;";
	  hs += "text-align: center;";
	  hs += "padding: 20px 15px 15px 16px;";
	  hs += "background-color: rgba(86,90,92,0.7);";
	  hs += "border-radius: 50%;";
	  this._loading_text__text.className = "ggskin_loadingdiv";
	  this._loading_text__text.setAttribute("style", hs);
	  this._loading_text.ggUpdateText = function () {
		//do here
		var percentLoaded = (me.player.getPercentLoaded() * 100.0).toFixed(0);
		var hs = "<span>" + percentLoaded + "%</span>";
		if (!userTimingTracked50 && percentLoaded >= 50) {
		  userTimingTracked50 = true;
		  Common.utils.trackUserTimings(
			typeof isMsite === "undefined" || isMsite === null || isMsite == false
			  ? "d_360_time"
			  : "m_360_time",
			"interior_50",
			($.now() - ThreeSixtyView.startLoadTime).toString(),
			carName
		  );
		}
		if (hs != this.ggText) {
		  this.ggText = hs;
		  this.ggTextDiv.innerHTML = hs;
		}
	  };
	  this._loading_text.ggUpdateText();
	  this._loading_text.appendChild(this._loading_text__text);
	  this.divSkin.appendChild(this._loading_text);
	  this.divSkin.ggUpdateSize = function (w, h) {
		me.updateSize(me.divSkin);
	  };
	  this.divSkin.ggViewerInit = function () {};
	  this.divSkin.ggLoaded = function () {
		if (!userTimingTracked100) {
		  userTimingTracked100 = true;
		  Common.utils.trackUserTimings(
			typeof isMsite === "undefined" || isMsite === null || isMsite == false
			  ? "d_360_time"
			  : "m_360_time",
			"interior_100",
			($.now() - ThreeSixtyView.startLoadTime).toString(),
			carName
		  );
		}
		me._loading_text.style[domTransition] = "none";
		me._loading_text.style.visibility = "hidden";
		me._loading_text.ggVisible = false;
		if (typeof isMsite === "undefined" || isMsite === null) {
		  if (!ThreeSixtyView.isFullScreen) $(".three-sixty-full-screen").show();
		  $(".option-buttons").show();
		  checkHotspotVisibility();
		  ThreeSixtyView.common.showPlayerOptions();
		  ThreeSixtyView.plugin.handlingForBrowsers();
		} else {
		  if (ThreeSixtyView.isFullScreen) $("#fullscreen-options").show();
		  $("#options").show();
		  $(".menu-options").show();
		  Hotspot.checkHotspotVisibility();
		}
	  };
	  this.divSkin.ggReLoaded = function () {};
	  this.divSkin.ggLoadedLevels = function () {};
	  this.divSkin.ggReLoadedLevels = function () {};
	  this.divSkin.ggEnterFullscreen = function () {};
	  this.divSkin.ggExitFullscreen = function () {};
	  this.skinTimerEvent();
	};
	this.hotspotProxyClick = function (id) {
	  Hotspot.showHotspotDetail(ThreeSixtyView.states.interior, id);
	};
	this.hotspotProxyOver = function (id) {};
	this.hotspotProxyOut = function (id) {};
	this.changeActiveNode = function (id) {
	  var newMarker = new Array();
	  var i, j;
	  var tags = me.player.userdata.tags;
	  for (i = 0; i < nodeMarker.length; i++) {
		var match = false;
		if (nodeMarker[i].ggMarkerNodeId == id && id != "") match = true;
		for (j = 0; j < tags.length; j++) {
		  if (nodeMarker[i].ggMarkerNodeId == tags[j]) match = true;
		}
		if (match) {
		  newMarker.push(nodeMarker[i]);
		}
	  }
	  for (i = 0; i < activeNodeMarker.length; i++) {
		if (newMarker.indexOf(activeNodeMarker[i]) < 0) {
		  if (activeNodeMarker[i].ggMarkerNormal) {
			activeNodeMarker[i].ggMarkerNormal.style.visibility = "inherit";
		  }
		  if (activeNodeMarker[i].ggMarkerActive) {
			activeNodeMarker[i].ggMarkerActive.style.visibility = "hidden";
		  }
		  if (activeNodeMarker[i].ggDeactivate) {
			activeNodeMarker[i].ggDeactivate();
		  }
		}
	  }
	  for (i = 0; i < newMarker.length; i++) {
		if (activeNodeMarker.indexOf(newMarker[i]) < 0) {
		  if (newMarker[i].ggMarkerNormal) {
			newMarker[i].ggMarkerNormal.style.visibility = "hidden";
		  }
		  if (newMarker[i].ggMarkerActive) {
			newMarker[i].ggMarkerActive.style.visibility = "inherit";
		  }
		  if (newMarker[i].ggActivate) {
			newMarker[i].ggActivate();
		  }
		}
	  }
	  activeNodeMarker = newMarker;
	};
	this.skinTimerEvent = function () {
	  setTimeout(function () {
		me.skinTimerEvent();
	  }, 10);
	  this._loading_text.ggUpdateText();
	  var hs = "";
	  hs += "scale(" + (1 * me.player.getPercentLoaded() + 0) + ",1.0) ";
	};
	function SkinHotspotClass(skinObj, hotspot) {
	  var me = this;
	  var flag = false;
	  this.player = skinObj.player;
	  this.skin = skinObj;
	  this.hotspot = hotspot;
	  var nodeId = String(hotspot.url);
	  nodeId = nodeId.charAt(0) == "{" ? nodeId.substr(1, nodeId.length - 2) : "";
	  this.ggUserdata = this.skin.player.getNodeUserdata(nodeId);
	  this.elementMouseDown = [];
	  this.elementMouseOver = [];
  
	  this.findElements = function (id, regex) {
		return me.skin.findElements(id, regex);
	  };
  
	  {
		this.__div = document.createElement("div");
		this.__div.className = "ggskin ggskin_hotspot hide";
		this.__div.ggType = "hotspot";
		hs = "";
		hs += "height : 5px;";
		hs += "left : 200px;";
		hs += "position : absolute;";
		hs += "top : 200px;";
		hs += "visibility : inherit;";
		hs += "width : 5px;";
		this.__div.setAttribute("style", hs);
		this.__div.style[domTransform + "Origin"] = "50% 50%";
		me.__div.ggIsActive = function () {
		  return me.player.getCurrentNode() == this.ggElementNodeId();
		};
		me.__div.ggElementNodeId = function () {
		  return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
		};
		this.__div.onclick = function () {
		  me.skin.hotspotProxyClick(me.hotspot.id);
		};
		this._ht_image_image = document.createElement("div");
		this._ht_image_image__img = document.createElement("img");
		this._ht_image_image__img.setAttribute(
		  "src",
		  cdnHostUrl + "0x0/cw/static/360icons/hotspot-indicator-30x30.png"
		);
		this._ht_image_image__img.setAttribute(
		  "style",
		  "position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;"
		);
		this._ht_image_image__img["ondragstart"] = function () {
		  return false;
		};
		this._ht_image_image.appendChild(this._ht_image_image__img);
		this._ht_image_image.ggId = "ht_image_image";
		this._ht_image_image.ggParameter = { rx: 0, ry: 0, a: 0, sx: 1, sy: 1 };
		this._ht_image_image.ggVisible = true;
		this._ht_image_image.className = "ggskin ggskin_svg ";
		this._ht_image_image.ggType = "svg";
		hs = "";
		hs += "cursor : pointer;";
		hs += "height : 32px;";
		hs += "left : -16px;";
		hs += "position : absolute;";
		hs += "top : -16px;";
		hs += "visibility : inherit;";
		hs += "width : 32px;";
		this._ht_image_image.setAttribute("style", hs);
		this._ht_image_image.style[domTransform + "Origin"] = "50% 50%";
		me._ht_image_image.ggIsActive = function () {
		  if (this.parentNode && this.parentNode.ggIsActive) {
			return this.parentNode.ggIsActive();
		  }
		  return false;
		};
		me._ht_image_image.ggElementNodeId = function () {
		  if (this.parentNode && this.parentNode.ggElementNodeId) {
			return this.parentNode.ggElementNodeId();
		  }
		  return me.ggNodeId;
		};
		this.__div.appendChild(this._ht_image_image);
	  }
	}
	this.addSkinHotspot = function (hotspot) {
	  return new SkinHotspotClass(me, hotspot);
	};
	this.addSkin();
  }
  