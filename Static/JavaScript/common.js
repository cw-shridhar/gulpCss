// ClientErrorLogger(["aeplcdn", "carwale"], "/api/exceptions/");
var masterCityNameCookie = $.cookie("_CustCityMaster");
var masterCityIdCookie = $.cookie("_CustCityIdMaster");
var isUsedLandingCityFilled = false;
var loginDetailsKey = "showLoggedinProfileWrapper";
var USER_CW_SOCIAL_SINGNUP_ENDPOINT = "/api/v1/login/social/";
var begintime = new Date()
function PriceLacCr(minPrice, maxPrice) {
  var priceRange = "",
    tempMinPrice = "";
  if (minPrice.length >= 8) {
    tempMinPrice = (parseFloat(minPrice) / 10000000).toFixed(2);
    priceRange =
      tempMinPrice.toString() + (Number(maxPrice) > 0 ? "" : " Crore");
  } else if (minPrice.length >= 6 && minPrice.length < 8) {
    tempMinPrice = (parseFloat(minPrice) / 100000).toFixed(2);
    priceRange =
      tempMinPrice.toString() + (Number(maxPrice) > 0 ? "" : " Lakh");
  } else {
    priceRange = minPrice.toString();
  }
  if (Number(maxPrice) > 9999999) {
    tempMinPrice = (parseFloat(maxPrice) / 10000000).toFixed(2);
    priceRange += " - " + tempMinPrice.toString() + " Crore";
  } else if (Number(maxPrice) > 99999) {
    tempMinPrice = (parseFloat(maxPrice) / 100000).toFixed(2);
    priceRange += " - " + tempMinPrice.toString() + " Lakh";
  } else if (Number(maxPrice) > 0) {
    priceRange += " - " + maxPrice.toString();
  }
  if (Number(priceRange) == 0) return "N/A";
  return priceRange.replace(/.00/g, "");
}

function ValidateContactDetails(Name, Email, MobileNo) {
  var errMsgs = [];
  var reName = /^([-a-zA-Z ']*)$/;
  var reEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
  var reMobile = /^[6789]\d{9}$/;
  var name = $.trim(Name);
  var email = $.trim(Email);
  var mobileNo = $.trim(MobileNo);
  var nameMsg, emailMsg, mobileMsg;

  if (name == "" || name == "Enter your name" || name == "Enter Your Name") {
    nameMsg = "Please provide your name";
  } else if (reName.test(name) == false) {
    nameMsg = "Please provide only alphabets";
  } else if (name.length == 1) {
    nameMsg = "Please provide your complete name";
  } else {
    nameMsg = "";
  }
  if (email == "" || email == "Enter your e-mail id") {
    emailMsg = "Please provide your Email Id";
  } else if (!reEmail.test(email.toLowerCase())) {
    emailMsg = "Invalid Email Id";
  } else {
    emailMsg = "";
  }
  if (mobileNo == "" || mobileNo == "Enter your mobile number") {
    mobileMsg = "Please provide your mobile number";
  } else if (mobileNo.length != 10) {
    mobileMsg = "Enter your 10 digit mobile number";
  } else if (reMobile.test(mobileNo) == false) {
    mobileMsg = "Please provide a valid 10 digit Mobile number";
  } else {
    mobileMsg = "";
  }
  errMsgs[0] = nameMsg;
  errMsgs[1] = emailMsg;
  errMsgs[2] = mobileMsg;
  return errMsgs;
}

function UNTLazyLoad() {
  $("img.lazy").lazyload({
    event: "UNT",
    skip_invisible: true
  });
}

function isCookieExists(cookiename) {
  if (cookiename == null) return false;
  var coockieVal = $.cookie(cookiename);
  if (
    coockieVal == undefined ||
    coockieVal == null ||
    coockieVal == "-1" ||
    coockieVal == ""
  )
    return false;
  return true;
}
// Load the SDK asynchronously
(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

function findInArray(value, array, parameter) {
  var item;
  for (var i = 0; i < array.length; i++) {
    item = array[i];
    if (value == eval("(item." + parameter + ")")) return i;
  }
  return -1;
}
/*Knockout Generic ViewModel and ajax funtions for droplists make,model*/
var genericMakeModelKVM =
  '{Make: ko.observable(-1),Makes: ko.observableArray(),Model: ko.observable(),Models: ko.observableArray([{ "ModelId": -1, "ModelName": "--Model--", "MaskingName": "" }]),Version: ko.observable(),Versions: ko.observableArray([{ "Id": -1, "Version": "--Version--", "MaskingName": "" }])}';

// common autocomplete data call function
function dataListDisplay(responseObject, request, response) {
  response(
    $.map(responseObject, function (item) {
      return { label: item.label, value: item.value }; // this will change based on response object structure
    })
  );
}

var ImageSizes = {
  _0X0: "0x0",
  _110X61: "110x61",
  _160X89: "160x89",
  _640X348: "640x348",
  _210X118: "210x118",
  _310X174: "310x174"
};

suggestions = {
  position: 0,
  count: 0
};

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
(function ($) {
  $.fn.hint = function (blurClass) {
    if (!blurClass) {
      blurClass = "blur";
    }

    return this.each(function () {
      // get jQuery version of 'this'
      var $input = $(this),
        // capture the rest of the variable to allow for reuse
        title = $input.attr("placeholder"),
        $form = $(this.form),
        $win = $(window);

      function remove() {
        if ($input.val() === title && $input.hasClass(blurClass)) {
          $input.val("").removeClass(blurClass);
        }
      }

      // only apply logic if the element has the attribute
      if (title) {
        // on blur, set value to title attr if text is blank
        $input
          .blur(function () {
            if (this.value === "") {
              $input.val(title).addClass(blurClass);
            }
          })
          .focus(remove)
          .blur(); // now change all inputs to title

        // clear the pre-defined text when form is submitted
        $form.submit(remove);
        $win.unload(remove); // handles Firefox's autocomplete
      }
    });
  };
})(jQuery);
(function ($) {
  $.fn.cw_autocomplete = function (options) {
    return this.each(function () {
      if (!options) {
        console.log("cwsearch: please define options");
        return;
      } else if (!options.source || options.source == "") {
        console.log("cwsearch: please define source");
        return;
      }
      if (!options.scrollOnlyInMenu || options.scrollOnlyInMenu == "") {
        options.scrollOnlyInMenu = true;
      }
      if (!options.multiselect || options.multiselect == "") {
        options.multiselect = false;
      }
      var cache = new Object();
      var reqTerm;
      var orgTerm;
      if ($(this).attr("placeholder")) $(this).hint();
      var result;
      $(this).focusout(function () {
        if (options.focusout) options.focusout();
      });
      $(this).keyup(function (e) {
        if (options.keyup) options.keyup(e);
      });
      $(this)
        .autocomplete({
          scrollOnlyInMenu: options.scrollOnlyInMenu,
          autoFocus: true,
          delay: 100,
          source: function (request, response) {
            if (options.beforefetch && typeof options.beforefetch == "function")
              options.beforefetch();
            orgTerm = request.term;
            reqTerm = request.term
              .replace(/^\s\s*/, "")
              .replace(/\s\s*$/, "")
              .replace(/-/g, " ")
              .replace(/[^\+A-Za-z0-9 ]/g, "")
              .toLowerCase();

            var year = options.year;
            if (year && year != "") {
              year = year.val();
            } else {
              year = "";
            }
            cacheProp = reqTerm + "_" + year;

            if (options.source == ac_Source.areaLocation) {
              cacheProp += "_" + options.cityId;
            }
            if (reqTerm.length > 0) {
              if (!cache[cacheProp] || cache[cacheProp].length <= 0) {
                var path =
                  "sell-used-car/webapi/autocomplete/GetResults/?source=" +
                  options.source +
                  "&value=" +
                  encodeURIComponent(reqTerm);
                if (
                  options.source == ac_Source.globalCityLocation ||
                  options.source == ac_Source.areaLocation
                ) {
                  path =
                    "/sell-used-car/api/v2/autocomplete/" +
                    ac_SourceName[options.source] +
                    "/?term=" +
                    encodeURIComponent(reqTerm) +
                    "&record=" +
                    options.resultCount;
                }
                var par = "";
                par += __getValue("n", options.isNew);
                par += __getValue("u", options.isUsed);
                par += __getValue("p", options.isPriceExists);
                par += __getValue("y", year);
                par += __getValue("t", options.additionalTypes);
                par += __getValue("cityId", options.cityId);
                par += __getValue("size", options.resultCount);
                par += __getValue("SourceId", "1");
                par += __getValue(
                  "showFeaturedCar",
                  typeof options.showFeaturedCar === "undefined"
                    ? true
                    : options.showFeaturedCar
                );
                if (par != null && par != undefined && par != "") {
                  par = par.slice(0, -1);
                  path += "&" + par;
                }

                var inputBox = $(this.bindings[0]);
                var spinner = inputBox.next();
                $.ajax({
                  async: true,
                  type: "GET",
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  url: path,
                  beforeSend: function () {
                    if (spinner.hasClass("fa-spinner")) spinner.show();
                  },
                  success: function (jsonData) {
                    cache[cacheProp] = new Array();
                    if (spinner.hasClass("fa-spinner")) spinner.hide();
                    if (
                      options.source == ac_Source.globalCityLocation ||
                      options.source == ac_Source.areaLocation
                    ) {
                      if (jsonData && jsonData.length > 0) {
                        cache[cacheProp] = $.map(jsonData, function (item) {
                          return {
                            label: item.result,
                            id:
                              options.source == ac_Source.globalCityLocation
                                ? item.payload.cityId
                                : item.payload.areaId,
                            payload: item.payload
                          };
                        });
                        result = cache[cacheProp];
                      } else {
                        result = undefined;
                        cache[cacheProp] = undefined;
                      }
                    } else {
                      if (options.source == ac_Source.allCarCities) {
                        if (reqTerm.indexOf("mu") >= 0) {
                          var m, ma;
                          for (var o in jsonData) {
                            if (jsonData[o].l == "Mumbai") {
                              m = o;
                            }
                            if (jsonData[o].l == "Mumbai & Around") {
                              ma = o;
                            }
                            if (m != undefined && ma != undefined) {
                              break;
                            }
                          }
                          if (m != undefined && ma != undefined) {
                            jsonData.splice(ma, 1);
                          }
                        }
                        if (reqTerm.indexOf("de") >= 0) {
                          var d, da;
                          for (var o in jsonData) {
                            if (jsonData[o].l == "New Delhi") {
                              d = o;
                            }
                            if (jsonData[o].l == "Delhi NCR") {
                              da = o;
                            }
                            if (d != undefined && da != undefined) {
                              break;
                            }
                          }
                          if (d != undefined && da != undefined) {
                            jsonData.splice(da, 1);
                          }
                        }
                      }
                      if (jsonData && jsonData.length > 0) {
                        var isNewsFilter = options.newsFilter;
                        cache[cacheProp] = $.map(jsonData, function (item) {
                          if (isNewsFilter == true)
                            item.label = item.label
                              .replace("All ", "")
                              .replace("Cars", "");
                          return {
                            label: item.label,
                            id: item.value,
                            imgSrc: item.imgSrc
                          };
                        });
                        result = cache[cacheProp];
                      } else {
                        globalSearchAdTracking.featuredModelIdPrev = 0;
                        result = undefined;
                        cache[cacheProp] = undefined;
                      }
                    }

                    response(result);
                    if (
                      options.afterfetch &&
                      typeof options.afterfetch == "function"
                    )
                      options.afterfetch(result, reqTerm);
                  }
                });
              } else {
                result = cache[cacheProp];
                response(result);
                if (
                  options.afterfetch &&
                  typeof options.afterfetch == "function"
                )
                  options.afterfetch(result, reqTerm);
              }
            }
          },
          minLength: 1,
          multiselect: options.multiselect,
          multiselectlength: 2,
          multiselectSource: function () {
            return options.source;
          },
          afterselect: function (self, item) {
            if (
              options.afterselect &&
              typeof options.afterselect == "function"
            ) {
              options.afterselect(self, item);
            }
          },
          select: options.multiselect
            ? null
            : function (event, ui) {
              if (options.click) {
                var text = ui.item.id;
                if (
                  options.source == ac_Source.generic &&
                  text.indexOf("|sponsor") >= 0
                ) {
                  ui.item.id = text.substr(0, text.indexOf("|sponsor"));

                  trackGlobalSearchAd(
                    "New_Click",
                    globalSearchAdTracking.featuredModelName +
                    "_" +
                    globalSearchAdTracking.targetModelName +
                    "_" +
                    result.length +
                    "_" +
                    globalSearchAdTracking.adPosition
                  );
                  cwTracking.trackCustomData(
                    "SearchResult_Ad",
                    "New_Click",
                    globalSearchAdTracking.featuredModelName +
                    "_" +
                    globalSearchAdTracking.targetModelName +
                    "_" +
                    result.length +
                    "_" +
                    globalSearchAdTracking.adPosition,
                    false
                  );
                }
                options.click(event, ui, $(this).val());
              }
            },
          open: function (event, ui) {
            if (!isNaN(options.width)) {
              $(".ui-menu").width(options.width);
            }
            if (options.open) options.open(result);

            if (
              result.filter(function (suggestion) {
                return suggestion.id.toString().indexOf("sponsor") > 0;
              }).length > 0
            ) {
              globalSearchAdTracking.trackData(result);
            } else globalSearchAdTracking.featuredModelIdPrev = 0;
          },
          focus: function (event, ui) {
            if (options.isOnRoadPQ == 1) {
              var list = $(event.originalEvent.target);

              var payload = ui.item.id;
              var valArr = payload.split("|");
              if (valArr.indexOf("make") < 0) {
                var cc = list.find(".show");
                cc.removeClass("show").addClass("hide");
                var dd = list.find(".ui-state-focus");
                var ff = dd.find(".hide");
                ff.removeClass("hide").addClass("show");
              } else {
                var cc = list.find(".show");
                cc.removeClass("show").addClass("hide");
              }
            }
          },
          change: function (event, ui) {
            if (ui.item == null) {
              this.value = "";
            }
          }
        })
        .data("ui-autocomplete")._renderItem = function (ul, item) {
          var isNewsFilter =
            typeof options.newsFilter != "undefined" && options.newsFilter;
          var ulItems = null;
          if (isNewsFilter && item.label.toLowerCase().indexOf(" vs") > 0)
            ulItems = $([]);
          else {
            if (isNewsFilter)
              item.label = item.label.replace("All ", "").replace("Cars", "");
            ulItems = $("<li>")
              .data("ui-autocomplete-item", item)
              .append(
                "<a cityname=" +
                item.label.replace(/\s/g, "").toLowerCase() +
                ">" +
                __highlight(item.label, reqTerm) +
                "</a>"
              );
          }

          if (
            options.source == ac_Source.globalCityLocation ||
            options.source == ac_Source.areaLocation
          ) {
            ulItems.appendTo(ul);
            return ulItems;
          } else {
            var val = item.id.split("|");

            if (val.indexOf("sponsor") > 0 && !isNewsFilter) {
              ulItems = $("<li>")
                .data("ui-autocomplete-item", item)
                .append(
                  '<a class="position-rel" cityname=' +
                  item.label.replace(/\s/g, "").toLowerCase() +
                  ">"
                );
              if (item.imgSrc !== undefined && item.imgSrc != "")
                ulItems.append(
                  '<img class="inline-block padding-right20" src=' +
                  item.imgSrc +
                  ">"
                );

              ulItems.append(
                '<span class="align-ad">' +
                __highlight(item.label, reqTerm) +
                '</span></a><span class="ui-autocomplete__list-item-text">Ad</span>'
              );
            } else globalSearchAdTracking.targetModelName = item.label;

            if (options.isOnRoadPQ == 1) {
              var isUpcoming = false;
              var isLink = false;
              if (item.id.indexOf("desktoplink") == 0) isLink = true;
              else if (val.indexOf("upcoming") > 0) isUpcoming = true;

              var isComparision = false;
              if (item.value.toLowerCase().indexOf(" vs ") > 0)
                isComparision = true;

              var model = item.id.split("|")[1];
              var pqModelId = 0;
              if (model != undefined && model.indexOf(":") > 0)
                pqModelId = model.split(":")[1];

              var make = item.id.split("|")[0];
              if (isLink);
              else if (isUpcoming)
                ulItems.append(
                  '<span class="rightfloat font12">Coming soon</span>'
                );
              else if (!isComparision && !isNewsFilter) {
                //is model
                //comments preserved for future reference
                //var x = $(this)[0].element[0].attributes['id'].value === 'globalSearch' ? 'GlobalSearch' : 'HomePage';
              }
              ulItems.append('<div class="clear"></div>').appendTo(ul);

              return ulItems;
            } else {
              ulItems.appendTo(ul);
              return ulItems;
            }
          }
        };
      function __highlight(s, t) {
        var matcher = new RegExp(
          "(" + $.ui.autocomplete.escapeRegex(t) + ")",
          "ig"
        );
        return s.replace(matcher, "<strong>$1</strong>");
      }
      function __getValue(key, value) {
        if (value != null && value != undefined && value != "")
          return key + "=" + value + "&";
        else return "";
      }
      $(this).keyup(function (e) {
        if (
          $(this)
            .val()
            .replace(/\s/g, "").length == 0 &&
          options.onClear != undefined
        ) {
          options.onClear();
          $(e.target)
            .parent()
            .children()
            .hasClass("common-global-search")
            ? $(".common-global-search").show()
            : $(".homepage-banner-search").show();
          GetGlobalSearchCampaigns.logImpression(
            ".common-global-search",
            "history",
            false
          );
          GetGlobalSearchCampaigns.logImpression(
            ".common-global-search",
            "trending",
            false
          );
        }
      });
      $(this).keypress(function (e) {
        if (e.keyCode == 13) {
          e.preventDefault();
        }
      });
    });
  };
})(jQuery);
(function ($) {
  $.widget("ui.autocomplete", $.ui.autocomplete, {
    options: $.extend({}, this.options, {
      multiselect: false,
      multiselectSource: undefined,
      afterselect: undefined,
      multiselectlength: undefined
    }),
    _create: function () {
      this._super();
      var self = this,
        o = self.options;
      if (o.multiselect) {
        self.selectedItems = {};
        self.multiselect = $("<div></div>")
          .addClass("ui-autocomplete-multiselect ui-state-default ui-widget")
          .css("width", self.element.width())
          .insertBefore(self.element)
          .append(self.element)
          .bind("click.autocomplete", function () {
            self.element.focus();
          });

        var autocompleteWidth = $(".ui-autocomplete-multiselect").width();
        var itemWidth = 0;
        var fontSize = parseInt(self.element.css("fontSize"), 10);
        function autoSize(e) {
          // Hackish autosizing
          var $this = $(this);
          itemWidth =
            $(
              ".ui-autocomplete-multiselect .ui-autocomplete-multiselect-item"
            ).innerWidth() + 14;
          $this.width(autocompleteWidth - itemWidth);
        }

        var kc = $.ui.keyCode;
        self.element
          .bind({
            "keydown.autocomplete": function (e) {
              if (this.value === "" && e.keyCode == kc.BACKSPACE) {
                var prev = self.element.prev();
                delete self.selectedItems[prev.text()];
                prev.remove();
              }
              var TABKEY = 9;
              if (e.keyCode == TABKEY) {
                e.preventDefault();
                self.element.focus();
              }
            },
            // TODO: Implement outline of container
            "focus.autocomplete blur.autocomplete": function () {
              self.multiselect.toggleClass("ui-state-active");
            },
            "keypress.autocomplete change.autocomplete focus.autocomplete blur.autocomplete": autoSize
          })
          .trigger("change");

        // TODO: There's a better way?
        o.select =
          o.select ||
          function (e, ui) {
            var elemName = ui.item.label;
            var elemid = ui.item.id;
            elemName = ui.item.label.split(",")[0];
            var source =
              o.multiselectSource && typeof o.multiselectSource == "function"
                ? o.multiselectSource()
                : -1;

            $("<div></div>")
              .attr("searchid", elemid)
              .addClass("ui-autocomplete-multiselect-item")
              .text(elemName)
              .append(
                $("<span></span>").addClass(
                  "location-cross cwsprite cross-sm-dark-grey cur-pointer"
                )
              )
              .insertBefore(self.element);

            self.selectedItems[ui.item.label] = ui.item;
            self._value("");
            autoSize();
            self.element.focus();

            if (o.afterselect && typeof o.afterselect == "function") {
              o.afterselect(self, ui.item);
            }
            return false;
          };
      }
      return this;
    }
  });
})(jQuery);

function formatSpecial(url) {
  reg = /[^/\-0-9a-zA-Z\s]*/g; // everything except a-z, 0-9, / and -
  url = url.replace(reg, "");
  var formattedUrl = url
    .toLowerCase()
    .replace(/ /g, "")
    .replace(/-/g, "")
    .replace("/", "");
  return formattedUrl;
}

function permanentCookieTime() {
  var now = new Date();
  var time = now.getTime();
  time += 1000 * 60 * 60 * 4320;
  now.setTime(time);
  return now.toGMTString();
}

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
  $("#cityName").text(CustCityMaster);
}

function checkAsktheExperts() {
  var tickerElement = document.getElementsByClassName(
    "js-esModel-countdown-close"
  );
  var isTickerExists =
    tickerElement &&
    tickerElement.length > 0 &&
    document.cookie.indexOf("esModelCountdownTicker=true") == -1;
  if ($.cookie("_AsktheExperts") == "" || $.cookie("_AsktheExperts") == null) {
    if (
      (typeof doNotShowAskTheExpert == "undefined" ||
        doNotShowAskTheExpert == true) &&
      location.pathname.indexOf("/used/") != 0
    ) {
      $(".ask-expert").addClass("expert-visible");
      if (isTickerExists) {
        $(".ask-expert").addClass("ask-expert--bottom");
      }
    }
    $(".expert-close-btn").click(function () {
      document.cookie = "_AsktheExperts= 1 ;path =/";
      $(".ask-expert").css({ right: "-170px" });
    });
  }
}

function doSearch(query) {
  if (globalMakeModel == null || noResult)
    location.href =
      "/search/results/?cx=002963291331112848676:ccmsgcrw20s&cof=FORID:9&ie=UTF-8&q=" +
      query +
      "&sa=Search&siteurl=www.carwale.com-F#1200";
  else {
    SearchMakeModel(globalMakeModel, $("#globalSearch"));
  }
}

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
      "/" + make.name + "-cars/" + model.name + "/" + version.name + "/";
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
    window.location.href = "/" + make.name + "-cars/";
    return true;
  }

  if (google != undefined && google != "") doSearch(google);
  else return false;
}

function CitySave() {
  $(".gl-default-stage").show();
  $("#globalCity-input").hide();
}

function ShowDropDownDisabled(dropDownId) {
  $(dropDownId).empty();
  $(dropDownId).prepend("<option value=-1>Select City</option>");
  $(dropDownId).prop("disabled", true);
}

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
function CloseCityPopUp() {
  var globalLocation = $("#globalcity-popup");
  globalLocation.removeClass("show").addClass("hide");
  Common.utils.unlockPopup();
}

//Added by Meet Shah on 5/8/16
//Tracking handlers for new menu
function bindNewHeaderEvents() {
  $(".nc-nested-right-panel .nested-rt-column:first-child a:first-child").click(
    function () {
      trackNewTopMenu("Quick-research-model-Click", window.location.href);
    }
  );
  $(".nc-nested-right-panel .nested-rt-column:first-child a:last-child").click(
    function () {
      trackNewTopMenu("Quick-research-price-Click", window.location.href);
    }
  );
  $(".uc-rv-nested-right-panel .nested-rt-column:first-child a").click(
    function () {
      trackNewTopMenu("Used-budget-card1-Click", window.location.href);
    }
  );
  $(".uc-rv-nested-right-panel .nested-rt-column:nth-child(2) a").click(
    function () {
      trackNewTopMenu("Used-budget-card2-Click", window.location.href);
    }
  );
  $(".loans-insur-nested-panel .grid-6:nth-child(1) a").click(function () {
    trackNewTopMenu("Insurance-Click", window.location.href);
  });

  $(".loans-insur-nested-panel .grid-6:nth-child(2) a").click(function () {
    Common.utils.trackAction(
      "CTInteractive",
      "BBLinkClicks_desktop",
      "finance_Navigation_Menu"
    );
  });
  var data_lab = $(
    $(".nc-nested-right-panel .dynamic-label:first-child a:last-child")[0]
  ).attr("data-label");
  $(
    ".nc-nested-right-panel .dynamic-label:first-child a:last-child, .nc-nested-right-panel .dynamic-label:first-child a:first-child"
  ).click(function () {
    trackNewTopMenu(
      "Quick-research-model-Click",
      data_lab + window.location.href
    );
  });
}
function bindNewHeaderArticleEvents() {
  $("#latest-articles > .nested-rt-column:first-child a").click(function () {
    trackNewTopMenu("News-article1-Click", window.location.href);
  });
  $("#latest-articles > .nested-rt-column:nth-child(2) a").click(function () {
    trackNewTopMenu("News-article2-Click", window.location.href);
  });
  $("#latest-articles > .nested-rt-column:nth-child(3) a").click(function () {
    trackNewTopMenu("News-article3-Click", window.location.href);
  });
}
function bindHeaderEvents() {
  if (window.location.hostname == "hind" + "i.carw" + "ale.com")
    $("#LangName").text("Hindi");
  else $("#LangName").text("English");

  // lang changer code
  $("div.changer-default").click(function () {
    $(".lang-changer-option").show();
    $("div.changer-default")[0].firstTimeBind = true;
    $(document).click(langChangerEvent);
  });
  $(".lang-changer-option li a").click(function () {
    var langTxt = $(this).text();
    trackTopMenu("Lang-Selection-Click", langTxt);
    $("#LangName").text(langTxt);
    $(".lang-changer-option").hide();
    var trailingpath = window.location.href.substr(
      window.location.href.indexOf(window.location.host) +
      window.location.host.length,
      window.location.length
    );
    if (langTxt == "Hindi")
      window.location.href =
        "http://hin" + "di.car" + "wale.com" + trailingpath;
    else
      window.location.href = "https://ww" + "w.car" + "wale.com" + trailingpath;
  }); // ends

  bindLoginEvents();
}
function langChangerEvent(event) {
  if ($("div.changer-default")[0].firstTimeBind == false) {
    $(".lang-changer-option").hide();
    $(document).unbind("click", langChangerEvent);
    $("div.changer-default")[0].firstTimeBind = undefined;
  }
  $("div.changer-default")[0].firstTimeBind = false;
}

function bindLoginEvents() {
  $("#firstLogin").click(function () {
    trackTopMenu("Login-Div-Click", "logged out");
  });
}

function checkpath() {
  if (window.location.pathname.indexOf("/used/") == 0) return false;
  else if (window.location.pathname.indexOf("/Used/") == 0) return false;
  else if (window.location.pathname.indexOf("AllOffers.aspx") != -1)
    return false;
  else if (window.location.pathname.indexOf("alloffers.aspx") != -1)
    return false;
  else if (window.location.pathname.indexOf("prices.aspx") != -1) return false;
  else if (window.location.pathname.indexOf("quotation.aspx") != -1)
    return false;
  else if (window.location.pathname.indexOf("/dealer/") == 0) return false;
  else if (window.location.pathname.indexOf("/users/") == 0) return false;
  else if (window.location.pathname.indexOf("/Users/") == 0) return false;
  else if (window.location.pathname.indexOf("/aboutus/") != -1) return false;
  else if (window.location.pathname.indexOf("/mycarwale/") == 0) return false;
  else if (window.location.pathname.indexOf("/MyCarwale/") == 0) return false;
  else if (window.location.pathname.indexOf("/mygarage/") == 0) return false;
  else if (window.location.pathname.indexOf("/MyGarage/") == 0) return false;
  else if (window.location.pathname.indexOf("/community/") == 0) return false;
  else if (window.location.pathname.indexOf("/Community/") == 0) return false;
  else if (window.location.pathname.indexOf("/contactus/") != -1) return false;
  else if (window.location.pathname.indexOf("/visitor-agreement/") != -1)
    return false;
  else if (window.location.pathname.indexOf("/privacy-policy/") != -1)
    return false;
  else if (window.location.pathname.indexOf("/career/") != -1) return false;
  else if (window.location.pathname.indexOf("/contactus/") != -1) return false;
  else if (window.location.pathname.indexOf("/offer-terms-conditions/") != -1)
    return false;
  else if (window.location.pathname.match(/(.*)offers(.*)/) != null)
    return false;
  return true;
}
function showCityPopUp(source) {
  //set master city in global map marker
  if (source == "load") {
    if (
      isCookieExists("_CustCityMaster") &&
      $.cookie("_CustCityMaster") != "" &&
      $.cookie("_CustCityMaster") != null &&
      $.cookie("_CustCityMaster") != "Select City"
    ) {
      showGlobalCity($.cookie("_CustCityMaster"));
    }
  }

  if (source == "mapMarker") {
    $("#globalPopupBlackOut").show();
    //$('body').addClass('lock-browser-scroll');
    $(".globalcity-popup")
      .removeClass("hide")
      .addClass("show");
    processCityPopUp();
  } else {
    //below code will check either cookie is set or not if not then popup will display
    if (
      (!isCookieExists("_CustCityMaster") ||
        $.cookie("_CustCityMaster") == "" ||
        $.cookie("_CustCityMaster") == null) &&
      checkpath()
    ) {
      // for IE7 city popup hide
      if (
        $.browser.msie &&
        parseFloat($.browser.version) < 8 &&
        ($.cookie("_ie7_recommendation") == "" ||
          $.cookie("_ie7_recommendation") == null)
      ) {
        $("#globalPopupBlackOut").hide();
        $("body").removeClass("lock-browser-scroll");
        $(".globalcity-popup")
          .addClass("hide")
          .removeClass("show");
      } else {
        $("#globalPopupBlackOut").show();
        $(".globalcity-popup")
          .removeClass("hide")
          .addClass("show");
        processCityPopUp();
      }
    } else {
      $("#globalPopupBlackOut").hide();
      $("body").removeClass("lock-browser-scroll");
      $(".globalcity-popup")
        .addClass("hide")
        .removeClass("show");
    }
  }
}

function showGlobalCity(cityName) {
  $(".gl-default-stage").show();
  $("#globalCity-input").hide();
  $("#cityName").text(cityName);
}

function processCityPopUp() {
  $("#globalCityPopUp").attr(
    "placeholder",
    "Type to select city name, eg: Mumbai"
  );
  if (
    typeof geoCityId != "undefined" &&
    geoCityId != "" &&
    ($.cookie("_CustCityMaster") == "" ||
      $.cookie("_CustCityMaster") == null) &&
    geoCityId > 0
  ) {
    $("#globalCityPopUp").val(geoCityName);
    SetPreferenceCookie();
  }

  if (
    isCookieExists("_CustCityMaster") &&
    $.cookie("_CustCityMaster") != "" &&
    $.cookie("_CustCityMaster") != null &&
    $.cookie("_CustCityMaster") != "Select City"
  ) {
    $("#globalCityPopUp").val($.cookie("_CustCityMaster"));
    showGlobalCity($.cookie("_CustCityMaster"));
  }
  trackGlobalCityPopup("Popup-Open", $("#globalCityPopUp").val());
}

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
    $(document).trigger("mastercitychange", [name, id]);
  }
}

function SetPreferenceCookie() {
  var sixMonths = 30 * 6;
  if (typeof cityDrpId != "undefined") {
    SetCookieInDays(
      "_CustCityPopUp",
      $.cookie("_CustCityMaster") +
      "|" +
      $("#" + cityDrpId + " option:selected").text() +
      "|" +
      (typeof geoCityName != "undefined" ? geoCityName : ""),
      sixMonths
    );
    SetCookieInDays(
      "_CustCityIdPopUp",
      $.cookie("_CustCityIdMaster") +
      "|" +
      $("#" + cityDrpId).val() +
      "|" +
      (typeof geoCityId != "undefined" ? geoCityId : ""),
      sixMonths
    );
  } else {
    SetCookieInDays(
      "_CustCityPopUp",
      $.cookie("_CustCityMaster") +
      "|" +
      "" +
      "|" +
      (typeof geoCityName == "undefined" ? "" : geoCityName),
      sixMonths
    );
    SetCookieInDays(
      "_CustCityIdPopUp",
      $.cookie("_CustCityIdMaster") +
      "|" +
      "-1" +
      "|" +
      (typeof geoCityId == "undefined" ? "-1" : geoCityId),
      sixMonths
    );
  }
}

function SetCityByPriority() {
  if ($.cookie("_CustCityIdPopUp") != "-1") {
    var arrCity = $.cookie("_CustCityIdPopUp").split("|");
    var arrCityName = $.cookie("_CustCityPopUp").split("|");
    if (arrCity.length > 0) {
      if (
        arrCity[0].toString() != "" &&
        arrCity[0] != "null" &&
        arrCity[0] != "-1" &&
        arrCity[0] != "-2"
      ) {
        if (typeof cityDrpId != "undefined") {
          $("#" + cityDrpId).val(arrCity[0].toString());
        }
        showGlobalCity(arrCityName[0].toString()); //set cityname confirmed by user in TopCityBox
      } else if (
        arrCity[1].toString() != "" &&
        arrCity[1] != "null" &&
        arrCity[1] > 0
      ) {
        if (typeof cityDrpId != "undefined") {
          $("#" + cityDrpId).val(arrCity[1].toString());
        }
      } else if (
        arrCity[2].toString() != "" &&
        arrCity[2] != "null" &&
        arrCity[2] > 0
      ) {
        if (typeof cityDrpId != "undefined") {
          $("#" + cityDrpId).val(arrCity[2].toString()); //set cityname detected by GeoIP in dropdown list
        }
        $("#globalCityPopUp").val(arrCityName[2].toString());
      }
    }
    if (typeof cityDrpId != "undefined") {
      if (cityDrpId == "ucLocateDealer_cmbCity" || cityDrpId == "cmbCity") {
        if ($("#" + cityDrpId).val() > 0) {
          BindDealerMakeByCity(cityDrpId);
        }
      }
    }
  }
}

$(document).keydown(function (e) {
  // ESCAPE key pressed
  if (e.keyCode == 27) {
    loginHideOnESC();
    if ($("div.nc-gallery-container").is(":visible")) {
      $("div.nc-gallery-container").hide();
      $(".pd-blackwindow").removeClass("opacity85");
      Common.utils.unlockPopup();
    }
  }
});

function loginHideOnESC() {
  $(".loginPopUpWrapper").animate({
    right: "-400px"
  });
  $(".loggedinProfileWrapper").animate({
    right: "-280px"
  });
  Common.utils.unlockPopup();
}

//Tab line animation
var tabAnimation = {
  activeTab: "",
  currentTabWidth: "",
  allActiveTabWidth: 0,
  bottomLine: "",
  indexTabWidth: 0,
  intHandle: "",
  panel: "",
  $thisLI: "",
  hrTag: '<hr class="tabHr tran-ease-out-all">',
  tabHrInit: function () {
    try {
      $(".cw-tabs.cw-tabs-flex ul").each(function () {
        var $thisUL = $(this);
        if (
          $thisUL.find("li").length > 0 &&
          $thisUL.find("li").is(":visible") &&
          $thisUL.is(":visible")
        ) {
          if ($thisUL.closest(".cw-tabs.cw-tabs-flex").find("hr").length < 1)
            $thisUL.parent().append(tabAnimation.hrTag);
          tabAnimation.allActiveTabWidth = $thisUL
            .find("li.active")
            .innerWidth();
          tabAnimation.bottomLine = $thisUL
            .closest(".cw-tabs.cw-tabs-flex")
            .find("hr");
          tabAnimation.bottomLine.width(tabAnimation.allActiveTabWidth);
          if ($thisUL.find("li.active").index() == 0) {
            tabAnimation.bottomLine.css("left", 0);
          } else {
            var i;
            tabAnimation.indexTabWidth = 0;
            var lengthPreDiv = $thisUL.find("li.active").prevAll("li:visible")
              .length;
            for (i = 0; i < lengthPreDiv; i++) {
              tabAnimation.indexTabWidth =
                tabAnimation.indexTabWidth +
                parseInt(
                  $thisUL
                    .find("li.active")
                    .siblings("li:visible")
                    .eq(i)
                    .innerWidth()
                );
            }
            tabAnimation.bottomLine.css("left", tabAnimation.indexTabWidth);
          }
          clearInterval(tabAnimation.intHandle);
          tabAnimation.intHandle = 0;
        }
      });
    } catch (e) {
      console.log(e);
    }
  },

  registerEvents: function () {
    try {
      $(document).on("click", ".cw-tabs li:not(.exclude)", function () {
        tabAnimation.$thisLI = $(this);
        if (
          location.pathname != "/new/quotation.aspx" &&
          !tabAnimation.$thisLI.hasClass("disabled")
        ) {
          tabAnimation.panel = tabAnimation.$thisLI.closest(".cw-tabs-panel");
          if (tabAnimation.$thisLI.hasClass("active")) {
            if (tabAnimation.$thisLI.text() == "New cars")
              trackTabs("NewCars-Tab-Click", "Active");
            else if (tabAnimation.$thisLI.text() == "Used cars")
              trackTabs("UsedCars-Tab-Click", "Active");
          }
          if (!tabAnimation.$thisLI.hasClass("active")) {
            if (tabAnimation.$thisLI.text() == "New cars")
              trackTabs("NewCars-Tab-Click", "InActive");
            else if (tabAnimation.$thisLI.text() == "Used cars")
              trackTabs("UsedCars-Tab-Click", "InActive");
          }

          var activePanelId = tabAnimation.panel
            .find(".cw-tabs li.active")
            .attr("data-tabs");
          tabAnimation.panel.find(".cw-tabs li").removeClass("active");
          tabAnimation.$thisLI.addClass("active");
          var panelId = tabAnimation.$thisLI.attr("data-tabs");
          tabAnimation.panel.find(".cw-tabs-data").hide();
          $("#" + panelId).show();
          $("#" + panelId)
            .find("img")
            .trigger("UNT");
          if (
            panelId == "brand-type" ||
            panelId == "budget-slider" ||
            panelId == "body-type"
          )
            dataLayer.push({
              event: "CTInteractive",
              cat: "NewCarsPage",
              act: "BrandBudgetBodytypeHeader",
              lab: panelId + "_Active_" + activePanelId
            });
          tabAnimation.liClickTabAnimation();
        }
      }); // ends
    } catch (e) {
      console.log(e);
    }
  },

  liClickTabAnimation: function () {
    try {
      //Tab line animation
      tabAnimation.activeTab = tabAnimation.panel.find(
        ".cw-tabs.cw-tabs-flex li.active"
      );
      tabAnimation.currentTabWidth = tabAnimation.activeTab.innerWidth();
      tabAnimation.bottomLine = tabAnimation.$thisLI
        .closest(".cw-tabs.cw-tabs-flex")
        .find("hr");
      tabAnimation.indexTabWidth = 0;
      var lengthPreDiv = tabAnimation.$thisLI.prevAll("li:visible").length;
      var i;
      for (i = 0; i < lengthPreDiv; i++) {
        tabAnimation.indexTabWidth =
          tabAnimation.indexTabWidth +
          parseInt(
            tabAnimation.$thisLI
              .siblings("li:visible")
              .eq(i)
              .innerWidth()
          );
      }
      tabAnimation.bottomLine.width(tabAnimation.currentTabWidth);
      tabAnimation.bottomLine.css("left", tabAnimation.indexTabWidth);
    } catch (e) {
      console.log(e);
    }
  },

  tabCall: function () {
    try {
      if ($(document).find(".cw-tabs.cw-tabs-flex").length > 0)
        tabAnimation.intHandle = setInterval(tabAnimation.tabHrInit, 100);
      $(window).load(function () {
        if (tabAnimation.intHandle != 0) {
          clearInterval(tabAnimation.intHandle);
          tabAnimation.intHandle = 0;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
};

tabAnimation.tabHrInit();
tabAnimation.tabCall();
tabAnimation.registerEvents();

// Common CW select box tabs code
$(".cw-tabs select").change(function () {
  var panel = $(this).closest(".cw-tabs-panel");
  var panelId = $(this).val();
  panel.find(".cw-tabs-data").hide();
  $("#" + panelId).show();
}); // ends

/* Used Cars Budget - Find carscode starts */
var shiftKeyFlag = true;

$("#minMaxContainer").click(openUsedBudget); // End of minMaxContainer click

function openUsedBudget() {
  var minBudget = $("#minInput").val();
  var maxBudget = $("#maxInput").val();
  minBudget = minBudget == "" || minBudget == "0" ? 0 : parseFloat(minBudget);
  maxBudget =
    maxBudget == "0" ||
      maxBudget == "0." ||
      maxBudget == "00" ||
      maxBudget == "000" ||
      maxBudget == "0000" ||
      maxBudget == "00000"
      ? 1
      : parseFloat(maxBudget);
  if (maxBudget != "" && minBudget > maxBudget) {
    $("#maxInput").addClass("border-red");
    $("#maxInput")
      .next()
      .removeClass("hide");
  } else {
    $("#minMaxContainer").toggleClass("open", "");
    $("#budgetListContainer, #minPriceList").toggleClass("hide show");
    minValueFunc();
  }
}

$("#minInput").on("click", function () {
  $("#maxInput")
    .removeClass("border-red")
    .next()
    .addClass("hide");
  $("#minPriceList")
    .removeClass("hide")
    .addClass("show");
  $("#maxPriceList").css("display", "none");
}); // End of minInput click event

$("#minInput")
  .on("keydown", function (e) {
    if (!shiftKeyFlag) e.preventDefault();
    if (e.which == 16) {
      e.preventDefault();
      shiftKeyFlag = false;
    }
    if (e.which == 13 || e.which == 9) {
      $("#maxInput")
        .focus()
        .click();
      return false;
    }
    if (
      (e.which == 190 || e.which == 110) &&
      $("#minInput")
        .val()
        .indexOf(".") != -1
    ) {
      return false;
    }
    if (e.which == 40) $("#budgetListContainer li:hover");
    if (
      e.which != 8 &&
      e.which != 40 &&
      e.which != 46 &&
      e.which != 37 &&
      e.which != 39 &&
      e.which != 0 &&
      e.which != 190 &&
      e.which != 110 &&
      (e.which < 48 || e.which > 57) &&
      (e.which < 96 || e.which > 105)
    ) {
      return false;
    }
  })
  .on("keyup", function (e) {
    if (!shiftKeyFlag && e.which == 16) shiftKeyFlag = true;
    var p = $(this).val();
    var budgetBtnText = $("#budgetBtn").html();
    if (
      (budgetBtnText == "Choose your budget" || budgetBtnText == "L - ") &&
      p == "."
    ) {
      p = "0.";
      $("#minInput").val("0.");
    }
    var q = $("#maxInput").val();
    if (q != "") $("#budgetBtn").html(p + "L" + " - " + q + "L");
    else $("#budgetBtn").html(p + "L" + " - ");
  });

$("#maxInput").on("click", function () {
  $("#maxInput")
    .removeClass("border-red")
    .next()
    .addClass("hide");
  var x = 0,
    q = "";
  x = $("#minInput").val();
  if (x == "") x = "0";
  q = $("#maxInput").val();
  if (q != "") $("#budgetBtn").html(x + "L" + " - " + q + "L");
  else $("#budgetBtn").html(x + "L" + " - ");
  getValuesForMaxDropDown(x);
  $("#minPriceList")
    .removeClass("show")
    .addClass("hide");
  maxValueFunc(x);
}); // End of maxInput click event

$("#maxInput")
  .on("keydown", function (e) {
    var decimalFlag = 0;
    if (!shiftKeyFlag) e.preventDefault();
    if (e.which == 16) {
      e.preventDefault();
      shiftKeyFlag = false;
    }
    if (e.which == 13 || e.which == 9) {
      budget = validateBudget(0);
      if (budget.wrongURLFlag != 1) {
        $("#maxPriceList").css("display", "none");
        $("#budgetListContainer")
          .removeClass("show")
          .addClass("hide");
        $("#minMaxContainer").removeClass("open");
      }
      return false;
    }
    if (
      (e.which == 190 || e.which == 110) &&
      $("#maxInput")
        .val()
        .indexOf(".") != -1
    ) {
      return false;
    } else if (
      e.which != 8 &&
      e.which != 40 &&
      e.which != 46 &&
      e.which != 37 &&
      e.which != 39 &&
      e.which != 0 &&
      e.which != 190 &&
      e.which != 110 &&
      (e.which < 48 || e.which > 57) &&
      (e.which < 96 || e.which > 105)
    ) {
      return false;
    }
  })
  .on("keyup", function (e) {
    if (!shiftKeyFlag && e.which == 16) shiftKeyFlag = true;
    var x = 0;
    x = $("#minInput").val();
    var q = $(this).val();
    var budgetBtnText = $("#budgetBtn").html();
    if (budgetBtnText.indexOf("-") != -1 && q == ".") {
      q = "0.";
      $("#maxInput").val("0.");
    }
    $("#budgetBtn").html($("#minInput").val() + "L" + " - " + q + "L");
  });

$("#btnFindCar, #btnFindCarLanding").click(function () {
  var cityMaskingName = objUsedCar.cityMaskingName;
  var thisId = $(this).attr("id");
  var searchUrl = "/used/",
    budget = new Object();
  var cityFlag = 0,
    budgetFlag = 0;

  if (cityMaskingName) {
    searchUrl += "cars-in-" + cityMaskingName + "/";
    cityFlag = 1;
    if (isUsedLandingCityFilled) SetCookieInDays("_CustCityUserAction", 1);
  } else searchUrl += "cars-for-sale/";

  if ($("#budgetBtn").html() != "Choose your budget") {
    budget = validateBudget(0);
    if (budget.wrongURLFlag == 0) {
      searchUrl += "?budget=" + budget.minBudget + "-" + budget.maxBudget;
      budgetFlag = 1;
    }
  } else budget.wrongURLFlag = 0;

  if (budget.wrongURLFlag == 0) {
    SetUsedSearchTracking(thisId, cityFlag, budgetFlag);
    location.href = searchUrl;
  }
}); // End of btnFindCar click

function SetUsedSearchTracking(thisId, cityFlag, budgetFlag) {
  if (thisId == "btnFindCar") {
    //CWHome Page
    if (cityFlag == 1 && budgetFlag == 1)
      trackUsedSearch(
        "FirstPanel-Desktop-HP",
        "UsedCars-Successful-Budget-City-Find-Car",
        objUsedCar.Name + "-" + $("#budgetBtn").html()
      );
    else if (cityFlag == 1)
      trackUsedSearch(
        "FirstPanel-Desktop-HP",
        "UsedCars-Successful-Only-City-Find-Car",
        objUsedCar.Name
      );
    else if (cityFlag == 0)
      trackUsedSearch(
        "FirstPanel-Desktop-HP",
        "UsedCars-Unsuccessful-Only-City-Find-Car",
        $("#usedCarsList").val()
      );
    else if (budgetFlag == 1)
      trackUsedSearch(
        "FirstPanel-Desktop-HP",
        "UsedCars-Successful-Budget-Find-Car",
        $("#budgetBtn").html()
      );
    else trackUsedSearch("FirstPanel-Desktop-HP", "UsedCars-Only-FindCar", "");
  } else if (thisId == "btnFindCarLanding") {
    // Used Home Page
    if (cityFlag == 1 && budgetFlag == 1)
      trackUsedSearch(
        "UsedHome",
        "UsedCars-Successful-Budget-City-Find-Car",
        objUsedCar.Name + "-" + $("#budgetBtn").html()
      );
    else if (cityFlag == 1)
      trackUsedSearch(
        "UsedHome",
        "UsedCars-Successful-Only-City-Find-Car",
        objUsedCar.Name
      );
    else if (cityFlag == 0)
      trackUsedSearch(
        "UsedHome",
        "UsedCars-Unsuccessful-Only-City-Find-Car",
        $("#usedCarsList").val()
      );
    else if (budgetFlag == 1)
      trackUsedSearch(
        "UsedHome",
        "UsedCars-Successful-Budget-Find-Car",
        $("#budgetBtn").html()
      );
    else trackUsedSearch("UsedHome", "UsedCars-Only-FindCar", "");
  }
}

function validateBudget(wrongURLFlag) {
  var minBudget = "",
    maxBudget = "",
    budgetText = "";
  var regexInt = /^[0]+$/,
    regexFloat = /^[0]+\.[0]+$/;

  budgetText = $("#budgetBtn").html();
  minBudget = $("#minInput").val();
  maxBudget = $("#maxInput").val();

  if (minBudget == "" || minBudget == "0." || regexFloat.test(minBudget))
    minBudget = 0;
  minBudget = parseFloat(minBudget);

  if (
    maxBudget == "0." ||
    regexInt.test(maxBudget) ||
    regexFloat.test(maxBudget)
  )
    maxBudget = 1;
  if (maxBudget != "" || maxBudget != 0) maxBudget = parseFloat(maxBudget);

  if (maxBudget != "" && minBudget > maxBudget) {
    $("#maxInput").addClass("border-red");
    $("#maxInput")
      .next()
      .removeClass("hide");
    wrongURLFlag = 1;
  } else {
    $("#maxInput").removeClass("border-red");
    $("#maxInput")
      .next()
      .addClass("hide");
  }
  return {
    wrongURLFlag: wrongURLFlag,
    minBudget: minBudget,
    maxBudget: maxBudget
  };
}

function minValueFunc() {
  $("#minPriceList li").click(function () {
    var selectedMin = $(this).attr("data-min-price");
    if (selectedMin == "Any") {
      selectedMin = "0";
    }
    $("#minInput").val(selectedMin);
    var maxTextValue = $("#maxInput").val();
    if (maxTextValue == "") $("#budgetBtn").html(selectedMin + "L -");
    else $("#budgetBtn").html(selectedMin + "L - " + maxTextValue + "L");

    $("#minPriceList")
      .removeClass("show")
      .addClass("hide");
    $("#maxInput").focus();
    getValuesForMaxDropDown(selectedMin);
    maxValueFunc(selectedMin);
  });
} // End of minValueFunc

function maxValueFunc(a) {
  $("#maxPriceList").css("display", "block");
  $("#maxPriceList li").click(function () {
    var selectedMax = $(this).attr("data-max-price");
    if (selectedMax != "Any") {
      $("#maxInput").val(selectedMax);
      $("#budgetBtn").html(a + "L" + " - " + selectedMax + "L");
    } else {
      $("#maxInput").val("");
      $("#budgetBtn").html(a + "L" + " - ");
    }
    $("#maxPriceList").css("display", "none");
    $("#budgetListContainer")
      .removeClass("show")
      .addClass("hide");
    $("#minMaxContainer").removeClass("open");
  });
} // End of maxValueFunc

function getValuesForMaxDropDown(minValue) {
  var arrayPrices = [1, 3, 4, 6, 8, 12, 20];
  var tempArray = [],
    minV,
    maxPriceStart,
    maxPriceIndex,
    newValue = 0,
    flag = 0;

  if (minValue == "" || minValue == "Any") minValue = 0;
  minV = parseFloat(minValue);

  var priceIndexData = getMaxPriceIndex(arrayPrices, minV, flag, tempArray);
  maxPriceIndex = priceIndexData.maxPriceIndex;
  flag = priceIndexData.flag;
  tempArray = priceIndexData.tempArray;
  if (arrayPrices[arrayPrices.length - 1] == minV)
    newValue += arrayPrices[arrayPrices.length - 1];

  if (flag == 1) {
    $("#maxPriceList li").each(function () {
      bindMaxPriceDropDown($(this), tempArray[maxPriceIndex]);
      maxPriceIndex += 1;
    });
  } else {
    $("#maxPriceList li").each(function () {
      if (maxPriceIndex == arrayPrices.length) {
        newValue = newValue + 10;
        bindMaxPriceDropDown($(this), newValue);
      } else {
        bindMaxPriceDropDown($(this), arrayPrices[maxPriceIndex]);
        newValue = arrayPrices[maxPriceIndex];
        maxPriceIndex += 1;
      }
    });
  }
} // End of getValuesForMaxDropDown

function getMaxPriceIndex(arrayPrices, minV, flag, tempArray) {
  $.each(arrayPrices, function (index, value) {
    if (minV == 0) maxPriceIndex = -1;
    if (value == minV) {
      maxPriceIndex = index;
    } else if (minV < arrayPrices[0]) maxPriceIndex = -1;
    else if (
      index > 0 &&
      minV > arrayPrices[index - 1] &&
      minV < arrayPrices[index]
    ) {
      maxPriceIndex = index - 1;
    } else if (minV >= arrayPrices[index] && arrayPrices.length == index + 1) {
      flag = 1;
      for (var i = 0; i < arrayPrices.length + 1; i++) {
        tempArray.push(minV);
        minV = parseInt(minV + 10);
      }
      maxPriceIndex = 0;
    }
  });
  return {
    maxPriceIndex: maxPriceIndex + 1,
    flag: flag,
    tempArray: tempArray
  };
} // End of getMaxPriceIndex

function bindMaxPriceDropDown(thisElement, pricevalue) {
  if (thisElement.attr("data-max-price") != "Any") {
    thisElement.attr("data-max-price", pricevalue);
    thisElement.text(pricevalue + " Lakh");
  }
} // bindMaxPriceDropDown

$(document).mouseup(function (e) {
  var container = $("#budgetListContainer");
  var container1 = $("#spn_txtProfile");
  if (container.hasClass("show") && $("#budgetListContainer").is(":visible")) {
    //do this only when its in open state otherwise do nothing
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      var elementId = $("#" + e.target.id)
        .parent()
        .attr("id");
      var elementClass = $("#" + e.target.id)
        .parent()
        .attr("class");
      if (
        elementId != "minMaxContainer" &&
        elementId != "btnFindCar" &&
        elementClass != "used-budget-box"
      )
        //dont trigger click for btnFindCar and minMaxContainer
        $("#minMaxContainer").trigger("click");
    }
  }
  if (!container1.hasClass("hide")) {
    //do this only when profileId error message is shown else do nothing
    $("#spn_txtProfile").addClass("hide");
    $("#spn_txtProfile")
      .next()
      .addClass("hide");
  }
});
/* Used Cars Budget - Find carscode ends */

/* jCarousel custom methods */
var _target = 3;

$(function () {
  if (typeof videoSlider != "undefined") {
    _target = 1;
  }

  var jcarousel = $(".jcarousel").jcarousel({
    vertical: false
  });

  $(".jcarousel-control-prev")
    .on("jcarouselcontrol:active", function () {
      $(this).removeClass("inactive");
    })
    .on("jcarouselcontrol:inactive", function () {
      $(this).addClass("inactive");
    })
    .jcarouselControl({
      target: "-=" + _target
    });
  $(".jcarousel-control-next")
    .on("jcarouselcontrol:active", function () {
      $(this).removeClass("inactive");
    })
    .on("jcarouselcontrol:inactive", function () {
      $(this).addClass("inactive");
    })
    .jcarouselControl({
      target: "+=" + _target
    });

  var swipeCount = $(".dynamic-carousel").attr("data-swipeCount");

  $(".dynamic-carousel .jcarousel-control-prev")
    .on("jcarouselcontrol:active", function () {
      $(this).removeClass("inactive");
    })
    .on("jcarouselcontrol:inactive", function () {
      $(this).addClass("inactive");
    })
    .jcarouselControl({
      target: "-=" + swipeCount
    });

  $(".dynamic-carousel .jcarousel-control-next")
    .on("jcarouselcontrol:active", function () {
      $(this).removeClass("inactive");
    })
    .on("jcarouselcontrol:inactive", function () {
      $(this).addClass("inactive");
    })
    .jcarouselControl({
      target: "+=" + swipeCount
    });

  $(".jcarousel-pagination")
    .on("jcarouselpagination:active", "a", function () {
      $(this).addClass("active");
    })
    .on("jcarouselpagination:inactive", "a", function () {
      $(this).removeClass("active");
    })
    .on("click", function (e) {
      e.preventDefault();
    })
    .jcarouselPagination({
      item: function (page) {
        return '<a href="#' + page + '">' + page + "</a>";
      }
    });
  // Swipe handlers for mobile
  $(".jcarousel").swipe({
    fingers: "all",
    swipeLeft: swipe1,
    swipeRight: swipe1,
    allowPageScroll: "auto"
  });
  function swipe1(event, direction, distance, duration, fingerCount) {
    if (direction == "left") {
      $(this)
        .closest(".jcarousel-wrapper")
        .find("a.jcarousel-control-next")
        .click();
    } else if (direction == "right") {
      $(this)
        .closest(".jcarousel-wrapper")
        .find("a.jcarousel-control-prev")
        .click();
    }
  }
  $("#modelImageCarousal").on("jcarousel:animate", function (event, carousel) {
    var timer = new Date() - begintime;
    var imageId = carousel._target
      .children("a")
      .attr("href")
      .match(/(.*)-(\d+)/i)[2];
    var dataObj = carousel._element[0].dataset;
    var label = GetDelimitedText({
      modelid: dataObj.modelid,
      timespent: timer,
      imageid: imageId,
      makename: dataObj.makename,
      modelname: dataObj.modelname
    }, "|");
    cwTracking.trackCustomData("Images", "ImageView", label, false);
    begintime = new Date();
  });
});

var reEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

function forgotPwdTrigger(email, msgTooltip, forgotPassField) {
  var data = {};
  data["emailId"] = email;
  $.ajax({
    type: "POST",
    url: "/api/user/resetpassword/?emailId=" + email,
    data: data,
    success: function (response) {
      var result = eval("(" + response + ")");
      if (result.status == 200) {
        msgTooltip.innerHTML =
          "A password reset link has been sent to the email";
        alert("A password reset link has been sent to the email");
      } else {
        msgTooltip.innerHTML = "Please try again later";
        logInPopUPFunc.handleValidInvalidClass(false, forgotPassField);
      }
    }
  });
}

function doLoginCustomer(logInData) {
  var rememberMe =
    document.getElementById("chkRemMe").checked == true ? "true" : "false";
  requestLogin(
    $.trim(logInData.email).toLowerCase(),
    logInData.password,
    rememberMe
  );
}

function requestLogin(loginId, passwd, rememberMe) {
  $.ajax({
    type: "POST",
    url: "/api/v1/login/",
    data: JSON.stringify({ email: loginId, password: passwd, rememberMe: rememberMe }),
    headers: {
      "Content-Type": "application/json",
      platformid: "1",
      CWK: "KYpLANI09l53DuSN7UVQ304Xnks=",
      SourceId: "1",
      IsWeb: true
    },
    success: function (response) {
      var loginResponse = eval("(" + response + ")");
      if (loginResponse.customerId > 0) {
        if (window.localStorage) {
          localStorage.setItem(loginDetailsKey, true);
        }
        location.reload();
      }
    },
    error: function () {
      var logInPasswordInput = document.querySelector(
        ".js-login-block-input[name='password']"
      );
      var fieldContainer = logInPasswordInput.closest(".form-control-box");
      var msgTooltip = fieldContainer.querySelector(".cw-blackbg-tooltip");
      msgTooltip.innerHTML = "Invalid Email or Password";
      logInPopUPFunc.handleValidInvalidClass(false, logInPasswordInput);
    }
  });
}

//***********************************************************/
// Global Ajax Functions
//***********************************************************/
function bindModelsList(type, makeId, viewmodel, modelListNodeId, caption) {
  if (makeId > 0) {
    return $.ajax({
      type: "GET",
      url:
        "/webapi/carmodeldata/GetCarModelsByType/?type=" +
        type +
        "&makeId=" +
        makeId,
      headers: { ServerDomain: "CarWale" },
      beforeSend: function (xhr) {
        $(modelListNodeId).attr("disabled", true);
        $(modelListNodeId).empty();
        viewmodel.Models({
          ModelId: -1,
          ModelName: "--Loading--",
          MaskingName: ""
        });
      },
      success: function (response) {
        var responseJSON = response;
        viewmodel.Models(responseJSON);
        viewmodel.Models.unshift(
          eval(
            "({ 'ModelId': -1, 'ModelName': '" +
            caption +
            "', 'MaskingName': '' })"
          )
        );
        if (!(viewmodel.Models().length > 1)) {
          $(modelListNodeId).attr("disabled", true);
        } else {
          $(modelListNodeId).attr("disabled", false);
        }
        $(modelListNodeId)
          .val(-1)
          .change();
        $(modelListNodeId).prop("selectedIndex", 0); //IE 9
      }
    });
  } else {
    $(modelListNodeId)
      .val(-1)
      .attr("disabled", true);
    $(modelListNodeId).change();
  }
}

function bindVersionsByModelList(
  type,
  modelId,
  viewmodel,
  versionListNodeId,
  caption
) {
  if (modelId > 0) {
    return $.ajax({
      type: "GET",
      url:
        "/webapi/carversionsdata/GetCarVersions/?type=" +
        type +
        "&modelId=" +
        modelId,
      headers: { ServerDomain: "CarWale" },
      beforeSend: function (xhr) {
        $(versionListNodeId).attr("disabled", true);
        $(versionListNodeId).empty();
        viewmodel.Versions({
          ID: -1,
          Name: "--Loading--",
          MaskingName: ""
        });
      },
      success: function (response) {
        var responseJSON = eval("(" + response + ")");
        viewmodel.Versions(responseJSON);
        viewmodel.Versions.unshift(
          eval("({ 'ID': -1, 'Name': '" + caption + "','MaskingName':'' })")
        ); //wont work without eval(caption is out of context)
        if (!(viewmodel.Models().length > 1)) {
          $(versionListNodeId).attr("disabled", true);
        } else {
          $(versionListNodeId).attr("disabled", false);
        }
        $(versionListNodeId)
          .val(-1)
          .change();
        $(versionListNodeId).prop("selectedIndex", 0); //IE 9
      }
    });
  } else {
    $(versionListNodeId)
      .val(-1)
      .attr("disabled", true);
    $(versionListNodeId).change();
  }
}

//LOGIN code starts here
function uiAfterLogin() {
  $(".login-pop").fadeOut(1000);
  setTimeout(function () {
    $(".login-bx").toggleClass("login-active");
  }, 1000);
}

function clicklogout() {
  reload = function () {
    location.reload();
  };
  $.ajax({
    type: "GET",
    url: "/Users/Logout/",
  })
    .done(reload)
    .fail(reload);
}

var isSignInButtonClicked = false;
function onSignInButtonClick() {
  isSignInButtonClicked = true;
}
function onSignInSuccess(googleUser) {
  if (isSignInButtonClicked) {
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    validateToken(id_token);
  }
}
function onSignInFailure(error) {
  alert("Login Unsuccessful.");
}

var OAUTHURL = "https://accounts.google.com/o/oauth2/auth?";
var VALIDURL = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=";
var TYPE = "token";
var _url =
  OAUTHURL +
  "scope=" +
  SCOPE +
  "&client_id=" +
  CLIENTID +
  "&redirect_uri=" +
  REDIRECT +
  "&response_type=" +
  TYPE;
var acToken;
var tokenType;
var expiresIn;
var user;
var loggedIn = false;

//credits: http://www.netlobo.com/url_query_string_javascript.html
function gup(url, name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regexS = "[\\#&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  if (results == null) return "";
  else return results[1];
}

function validateToken(token) {
  $.ajax({
    type: "GET",
    url: USER_CW_SOCIAL_SINGNUP_ENDPOINT +
      "?accesstoken=" +
      token +
      "&socialplatform=g",
    headers: {
      "Content-Type": "application/json",
      platformid: "1",
      CWK: "KYpLANI09l53DuSN7UVQ304Xnks=",
      SourceId: "1",
      IsWeb: true
    },
    success: function (verificationresp) {
      var x = eval("(" + verificationresp + ")");
      if (x.customerId == null || x.customerId == "-1")
        alert("Failed to login.");
      else if ($.isNumeric(x.customerId) && x.customerId != "0") {
        if (window.localStorage) {
          localStorage.setItem(loginDetailsKey, true);
        }
        document.location.reload();
      } else alert("Sorry, we don't have permission to login.");
    }
  });
}

$(function () {
  $("img.lazy").lazyload({ skip_invisible: true });
});
//Login Code ends here

function SearchMakeModel(makemodel, textboxId) {
  var model = null;
  if (makemodel.indexOf("|") > 0 && !isComparisionSelect) {
    var splitVal = makemodel.split("|");
    var make = {};
    make.name = splitVal[0].split(":")[0];
    make.id = splitVal[0].split(":")[1];

    if (splitVal[1] != undefined && splitVal[1].indexOf(":") > 0) {
      model = {};
      model.name = splitVal[1].split(":")[0];
      model.id = splitVal[1].split(":")[1];
    }
  } else if (isComparisionSelect) {
    Common.redirectToComparePage(makemodel.split("|"));
    return false;
  } else {
    var make = {};
    make.name = makemodel.split(":")[0];
    make.id = makemodel.split(":")[1];
  }
  globalAutoSearch(make, model, null, textboxId.val(), suggestions);
}

var label = null;
var id = null;
var globalModelId = null;
var globalMakeId = null;
var globalMakeName = null;
var globalModelName = null;
var globalCity = null;
var objGlobalSearch = new Object();
var objGlobalCity = new Object();

var objPopupCity = new Object();
var isUserInteracted = false;
var focusedCity;
/* Used Cars Budget - Find carscode ends */
// Used City autocomplete code
var objUsedCar = new Object();
if (Number(masterCityIdCookie) > 0) {
  objUsedCar.Name = masterCityNameCookie;
  objUsedCar.Id = masterCityIdCookie;
  var cachedUsedCarObj = clientCache.get("objUsedCar");
  objUsedCar.cityMaskingName = cachedUsedCarObj
    ? cachedUsedCarObj.cityMaskingName
    : "";
}
$(document).on("mastercitychange", function (event, cityName, cityId, item) {
  objUsedCar.Name = cityName;
  objUsedCar.Id = cityId;
  objUsedCar.cityMaskingName = item.payload ? item.payload.cityMaskingName : "";
  clientCache.set("objUsedCar", objUsedCar);
});
var label = null;
var id = null;
var focusedMakeModel = null;
var noResult = true;
var globalMakeModel = null;
var suggestReqTerm = "";
var isComparisionSelect = false;

$(document).ready(function () {
  Common.utils.eventTracking();
  Common.utils.trackImpressions();
  Common.utils.trackClicks();
  checkAsktheExperts();
  Common.usedLanding.registerEvents();
  Common.advantage.popup.registerEvents();
  Common.Insurance.showOrHideInsurance(
    "li.navInsuranceLink",
    masterCityIdCookie
  );
  $("#globalSearch").val("");
  $("#globalSearch")
    .cw_autocomplete({
      resultCount: 10,
      isOnRoadPQ: 1,
      pQPageId: 58,
      isNew: 1,
      additionalTypes: ac_textTypeEnum.link,
      source: ac_Source.generic,
      onClear: function () {
        objGlobalSearch = new Object();
        globalSearchAdTracking.featuredModelIdPrev = 0;
      },
      click: function (event, ui, orgTxt) {
        event.stopPropagation();
        var ul = event.originalEvent.target;
        if (ul != undefined) {
          suggestions = {
            position:
              $(ul)
                .find("li.ui-state-focus")
                .index() + 1,
            count: objGlobalSearch.result.length
          };
        }

        var splitVal = ui.item.id.split("|");
        var label = ui.item.label.toLowerCase(); //get label of suggest result
        if (splitVal[0].indexOf("desktoplink:") == 0) {
          var desktoplinkLabel =
            suggestions.count +
            "_" +
            suggestions.position +
            "_" +
            suggestReqTerm +
            "_" +
            ui.item.label;
          trackBhriguSearchTracking(
            "",
            "",
            suggestions.count,
            suggestions.position,
            suggestReqTerm,
            ui.item.label
          );
          trackTopMenu("Global-AutoSuggest-Value-Click", desktoplinkLabel);
          window.location.href = splitVal[0]
            .split("desktoplink:")[1]
            .split("|")[0];
          return false;
        } else if (label.indexOf(" vs ") > 0) {
          var model1 = "|modelid1=" + splitVal[0].split(":")[1];
          var model2 = "|modelid2=" + splitVal[1].split(":")[1];
          trackBhriguSearchTracking(
            "",
            "",
            suggestions.count,
            suggestions.position,
            suggestReqTerm,
            ui.item.label,
            model1 + model2
          );
          Common.redirectToComparePage(splitVal);
          return false;
        }
        var make = new Object();
        make.name = splitVal[0].split(":")[0];
        make.id = splitVal[0].split(":")[1];

        var srcEle = $(event.srcElement);
        if (event.srcElement == undefined)
          srcEle = $(event.originalEvent.originalEvent.originalEvent.target);
        if (srcEle.hasClass("OnRoadPQ")) {
          var modelName = splitVal[1].split(":")[0];
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
            modelName;
          trackBhriguSearchTracking(
            "",
            "",
            suggestions.count,
            suggestions.position,
            suggestReqTerm,
            make.name + " " + modelName,
            modelLabel
          );
          trackTopMenu("Global-AutoSuggest-PQlink-Click", pqSearchLabel);
          return false;
        }
        objGlobalSearch.Name = formatSpecial(ui.item.label);
        objGlobalSearch.Id = ui.item.id;

        var model = null;
        if (splitVal[1] != undefined && splitVal[1].indexOf(":") > 0) {
          model = new Object();
          model.name = splitVal[1].split(":")[0];
          model.id = splitVal[1].split(":")[1];
        }

        globalAutoSearch(
          make,
          model,
          null,
          $("#globalSearch").val(),
          suggestions
        );
      },
      open: function (result) {
        if (result != undefined) {
          objGlobalSearch.result = result;
          noResult = result.length > 0 ? false : true;
        }
      },
      afterfetch: function (result, resterm) {
        $(".common-global-search").hide();
        objGlobalSearch.result = result;
        noResult = result != undefined && result.length > 0 ? false : true;
        suggestReqTerm = resterm;
      },
      keyup: function () {
        objGlobalSearch.Name = label;
        objGlobalSearch.Id = id;
        if (
          $("li.ui-state-focus a:visible").text() != "" &&
          objGlobalSearch.result != undefined
        ) {
          focusedMakeModel =
            objGlobalSearch.result[$("li.ui-state-focus").index()];
          var link = $("li.ui-state-focus a:visible");
          var li = link.parent();
          var ul = li.parent();
          suggestions = {
            position:
              $(ul)
                .find($(li))
                .index() + 1,
            count: objGlobalSearch.result.length
          };
        }
      },
      focusout: function () {
        globalSearchAdTracking.featuredModelIdPrev = 0;
        if (focusedMakeModel != null) {
          globalMakeModel = focusedMakeModel.id;
          isComparisionSelect =
            focusedMakeModel.label.indexOf(" vs ") > 0 ? true : false;
        } else if (
          objGlobalSearch.result != undefined &&
          objGlobalSearch.result != null &&
          objGlobalSearch.result.length > 0
        ) {
          globalMakeModel = objGlobalSearch.result[0].id;
        }
      }
    })
    .autocomplete("widget")
    .addClass("topSearchAutocomplete");

  $("#globalSearch").on({
    keydown: function (e, ui) {
      if (e.keyCode == 13 && noResult) {
        trackTopMenu(
          "Global-Search-With-value-Click",
          $("#globalSearch").val()
        );
        doSearch($("#globalSearch").val());
      } else if (e.keyCode == 9) {
        if (globalMakeModel != null || !noResult) {
          $("#globalSearch").off("focusout");
        } else {
          $("#globalSearch").val("");
          $("#globalSearch").trigger("focusout");
        }
      }
    }
  });
  $("#globalCityPopUp")
    .cw_autocomplete({
      resultCount: 8,
      source: ac_Source.allCarCities,
      onClear: function () {
        objPopupCity = new Object();
      },
      click: function (event, ui, orgTxt) {
        objPopupCity.Name = ui.item.label;
        objPopupCity.Id = ui.item.id;
        var sixMonths = 30 * 6;
        SetCookieInDays("_CustCityMaster", objPopupCity.Name, sixMonths);
        SetCookieInDays("_CustCityIdMaster", objPopupCity.Id, sixMonths);
        SetPreferenceCookie();
        CloseCityPopUp();
        showGlobalCity(objPopupCity.Name);
        trackGlobalCityPopup("AutoSuggest-Value-Select", objPopupCity.Name);
        trackGlobalCityPopup("Popup-Close", "click");
        if ($.globalCityChange != undefined)
          $.globalCityChange(objPopupCity.Id, objPopupCity.Name);
      },
      open: function (result) {
        objPopupCity.result = result;
      },
      afterfetch: function (result, searchtext) {
        if (result != undefined && result.length > 0) showHideMatchError(false);
        else showHideMatchError(true);
      },
      keyup: function (a, b) {
        isUserInteracted = true;
      },
      focusout: function () {
        if ($("li.ui-state-focus a:visible").text() != "") {
          focusedCity = objPopupCity.result[$("li.ui-state-focus").index()];
        }
      }
    })
    .autocomplete("widget")
    .addClass("globalCity-auto-desktop")
    .css({
      position: "fixed"
    });

  $("#usedCarsList").cw_autocomplete({
    resultCount: 10,
    source: ac_Source.globalCityLocation,
    onClear: function () {
      objUsedCar = new Object();
    },
    click: function (event, ui, orgTxt) {
      objUsedCar.Name = formatSpecial(ui.item.label);
      objUsedCar.Id = ui.item.id;
      objUsedCar.cityMaskingName = ui.item.payload
        ? ui.item.payload.cityMaskingName
        : objUsedCar.Name;
      label = formatSpecial(ui.item.label);
      id = ui.item.id;
      openUsedBudget();
      isUsedLandingCityFilled = true;
    },
    open: function (result) {
      objUsedCar.result = result;
    },
    keyup: function () {
      objUsedCar = new Object();
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
          objUsedCar.Id = formatSpecial(objUsedCar.result[0].id);
          $("#usedCarsList").val(objUsedCar.result[0].label);
          isUsedLandingCityFilled = true;
        } else isUsedLandingCityFilled = false;
      } else isUsedLandingCityFilled = true;
    }
  });
  $(".card").flip({
    axis: "y",
    trigger: "manual",
    reverse: true
  });

  $(".infoBtn").click(function () {
    $(this)
      .parents("li")
      .flip(true)
      .siblings()
      .flip(false);
  });

  $(".closeBtn").click(function () {
    $(this)
      .parents("li")
      .flip(false);
  });

  $(document).keydown(function (e) {
    if (typeof dealerPopupSliderClose == "function") {
      bindEscape(e);
    }
  });

  $(".blackOut-window").click(function (e) {
    if (typeof dealerPopupSliderClose == "function") {
      dealerPopupSliderClose();
    }
    if ($(".globalcity-popup-data.text-center").is(":visible")) {
      if (!isUserInteracted) {
        if (!isCookieExists("_CustCityMaster")) {
          SetCookieInDays("_CustCityMaster", "Select City", 30);
          SetCookieInDays("_CustCityIdMaster", "-1", 30);
        }
        SetPreferenceCookie();
      }
      trackGlobalCityPopup("Popup-Close", "outside");
      $("#globalcity-popup")
        .removeClass("show")
        .addClass("hide");
    }

    $("#loginPopUpWrapper").animate({
      right: "-400px"
    });

    $("#loggedinProfileWrapper").animate({
      right: "-280px"
    });

    Common.utils.unlockPopup();
  });

  $(".globalcity-close-btn").click(function (e) {
    !isCookieExists("_CustCityMaster") == true
      ? SetCookieInDays("_CustCityMaster", "Select City", 30)
      : "";
    !isCookieExists("_CustCityIdMaster") == true
      ? SetCookieInDays("_CustCityIdMaster", "-1", 30)
      : "";
    trackGlobalCityPopup("Popup-Close", "X");
    CloseCityPopUp();

    $(this)
      .closest("#dealer-request-popup")
      .hide();
  });
  //Confirm City Button click
  $("#btnConfirmCity").click(function () {
    var cityVal = $("#globalCityPopUp").val();
    if (
      cityVal == "" ||
      cityVal == $("#globalCityPopUp").attr("placeholder") ||
      $("#globalCityPopUp").hasClass("border-red") ||
      ($("li.ui-menu-item a:visible:eq(0)").text() != cityVal &&
        cityVal != "" &&
        typeof focusedCity != "undefined" &&
        focusedCity.label != cityVal)
    ) {
      showHideMatchError(true);
      trackGlobalCityPopup("Confirm-City-Button-Unsuccessful", cityVal);
      return false;
    }
    var sixMonth = 30 * 6;
    if (
      typeof focusedCity != "undefined" &&
      Number(focusedCity.id) > 0 &&
      cityVal == focusedCity.label
    ) {
      SetCookieInDays("_CustCityMaster", focusedCity.label, sixMonth);
      SetCookieInDays("_CustCityIdMaster", focusedCity.id, sixMonth);
      showGlobalCity(focusedCity.label);
      trackGlobalCityPopup("Confirm-City-Button-Successful", cityVal);
      if ($.globalCityChange != undefined)
        $.globalCityChange(focusedCity.id, focusedCity.label);
    } else if (!isUserInteracted) {
      if (typeof geoCityName != "undefined") {
        SetCookieInDays("_CustCityMaster", geoCityName, sixMonth);
        SetCookieInDays("_CustCityIdMaster", geoCityId, sixMonth);
        showGlobalCity(geoCityName);
        trackGlobalCityPopup("Confirm-City-Button-Successful", geoCityName);
        if ($.globalCityChange != undefined)
          $.globalCityChange(geoCityId, geoCityName);
      }
    }
    SetPreferenceCookie();
    CloseCityPopUp();
  });

  $("img.lazy").lazyload({ skip_invisible: true });

  bindHeaderEvents();
  bindNewHeaderEvents();

  if ($("#profilepic2").length > 0) {
    if (!($.cookie("_Fblogin") == "" || $.cookie("_Fblogin") == null)) {
      $("#profilepic1").addClass("hide");
      $("#profilepic2").removeClass("hide");
      document.getElementById("profilepic2").innerHTML =
        '<img src="https://graph.facebook.com/' +
        $.cookie("_Fblogin") +
        '/picture" />';
    } else if (
      !($.cookie("_GoogleCookie") == "" || $.cookie("_GoogleCookie") == null)
    ) {
      $("#profilepic1").addClass("hide");
      $("#profilepic2").removeClass("hide");
      document.getElementById("profilepic2").innerHTML =
        '<img src="' + $.cookie("_GoogleCookie").split("|")[1] + '" />';
    } else {
      $("#profilepic1").removeClass("hide");
      $("#profilepic2").addClass("hide");
    }
  }

  $("#userLoggedin").click(function () {
    trackTopMenu("Login-Div-Click", "logged in");
  });

  $("#globalSearch").on("click", function (e) {
    Common.utils.trackAction(
      "TopMenu",
      "AreaLocation",
      "searchlabelclick",
      window.location.href
    );
    if ($.trim($("#globalSearch").val()) == "") {
      $.when(GetGlobalSearchCampaigns.bindCampaignData(false)).then(function () {
        $(".common-global-search").show();
        $(".homepage-banner-search").hide();
        $("body").addClass("trending-section");
        GetGlobalSearchCampaigns.logImpression(
          ".common-global-search",
          "trending",
          false
        );
      });
    }
  });

  Location.globalSearch.initialize();
  Location.globalSearch.registerEvents();

  Common.utils.prefillUserDetails(); //prefill user details
  Common.utils.trackImpression();

  if (window.localStorage) {
    if (localStorage.getItem(loginDetailsKey) == "true") {
      $("#userLoggedin").trigger("click");
      localStorage.setItem(loginDetailsKey, false);
    }
  }

  $(".jcarousel-wrapper").on("jcarousel:animateend", function (event, carousel) {
    $(this)
      .find(".lazy")
      .lazyload();
  });
});

function registerCust(signUpData) {
  // if (validateCustRegDetails(objCust, objEmail, objPasswd, objConfPasswd, objMobile)) {
  var phone = "";
  var cityId =
    Number($.cookie("_CustCityIdMaster")) > 0
      ? Number($.cookie("_CustCityIdMaster"))
      : "";
  $.ajax({
    type: "POST",
    url: "/api/v2/signup/",
    data:
      '{"name":"' +
      signUpData.name +
      '", "pass":"' +
      signUpData.password +
      '", "confpass":"' +
      signUpData.confirmPassword +
      '", "email":"' +
      signUpData.email.toLowerCase() +
      '", "mobile":"' +
      signUpData.mobile +
      '", "cityId":"' +
      $.trim(cityId) +
      '"}',
    headers: {
      "Content-Type": "application/json",
      platformid: "1",
      CWK: "KYpLANI09l53DuSN7UVQ304Xnks=",
      SourceId: "1",
      IsWeb: true
    },
    success: function (response) {
      var signupResponse = eval("(" + response + ")");

      if (signupResponse.isRegistered && signupResponse.customerId > 0) {
        location.reload();
      }
    },
    error: function (response) {
      var signupResponse = eval("(" + response.responseText + ")");
      alert(signupResponse.message);
    }
  });
  // }
}

function bindMakesByCityList(cityId, viewmodel, makeListNodeId, caption) {
  if (cityId > 0) {
    $.ajax({
      type: "GET",
      url: "/webapi/newcardealers/GetMakesByCity/?cityid=" + cityId,
      beforeSend: function (xhr) {
        viewmodel.City(cityId);
        $(makeListNodeId).attr("disabled", true);
        $(makeListNodeId).empty();
        viewmodel.Makes({
          makeId: -1,
          makeName: "--Loading--"
        });
      },
      success: function (response) {
        var responseJSON = eval("(" + response + ")");
        viewmodel.Makes(responseJSON);
        viewmodel.Makes.unshift(
          eval("({ 'makeId': -1, 'makeName': '" + caption + "'})")
        );
        if (!(viewmodel.Makes().length > 1)) {
          $(makeListNodeId).attr("disabled", true);
        } else {
          $(makeListNodeId).attr("disabled", false);
        }
        $(makeListNodeId)
          .val(-1)
          .change();
        $(makeListNodeId).prop("selectedIndex", 0); //IE 9
      }
    });
  } else {
    $(makeListNodeId)
      .val(-1)
      .attr("disabled", true);
  }
}

function bindDropDownList(
  response,
  cmbToFill,
  viewStateId,
  dependentCmbs,
  selectString
) {
  if (response.Table != null) {
    if (!selectString || selectString == "") selectString = "--Select--";
    $(cmbToFill)
      .empty()
      .append('<option value="0">' + selectString + "</option>")
      .attr("disabled", false);

    var hdnValues = "";

    for (var i = 0; i < response.Table.length; i++) {
      $(cmbToFill).append(
        "<option value=" +
        response.Table[i].Value +
        ">" +
        response.Table[i].Text +
        "</option>"
      );

      if (hdnValues == "")
        hdnValues += response.Table[i].Text + "|" + response.Table[i].Value;
      else
        hdnValues +=
          "|" + response.Table[i].Text + "|" + response.Table[i].Value;
    }
    if (viewStateId) $("#" + viewStateId).val(hdnValues);
  }

  if (dependentCmbs && dependentCmbs.length > 0) {
    for (var i = 0; i < dependentCmbs.length; i++) {
      $("#" + dependentCmbs[i]).attr("disabled", true);
    }
  }
}

//*************** PQ widget******************
function bindCity(selectedModelId, CallBackFunction) {
  $("#drpCity").empty();
  $.ajax({
    type: "GET",
    url: "/webapi/GeoCity/GetPQCitiesByModelId/?modelid=" + selectedModelId,
    dataType: "Json",
    success: function (json) {
      var viewModel = {
        pqCities: ko.observableArray(json)
      };
      ko.cleanNode(document.getElementById("drpCity"));
      ko.applyBindings(viewModel, document.getElementById("drpCity"));
      if (!isHashHaveModel) {
        ModelCar.PQ.bindZones("", "#drpCity");
        $("#drpCity").prepend("<option value=-1>---Select City---</option>");
        $("#drpCity option[value=" + -1 + "]").attr("disabled", "disabled");
        $("#drpCity option[value=" + -2 + "]").attr("disabled", "disabled");
      } else {
        ModelCar.PQ.bindZones("", "#drpCity");
        $("#drpCity").prepend("<option value=-1>---Select City---</option>");
        $("#drpCity option[value=" + -1 + "]").attr("disabled", "disabled");
        $("#drpCity option[value=" + -2 + "]").attr("disabled", "disabled");
        $("#drpCity").val("-1");
        $("#drpCity").prop("disabled", false);
      }
      $("#drpCity").val("-1");
      CallBackFunction();
    }
  });
}

function checkForCity(cityId, drpCity, divToBind) {
  if (drpCity == "drpPqCity") {
    if (
      $("#" + divToBind).find("#" + drpCity + " option[value='" + cityId + "']")
        .length > 0
    )
      return true;
    else return false;
  } else {
    if ($("#" + drpCity + " option[value='" + cityId + "']").length > 0)
      return true;
    else return false;
  }
}

function GetPriceQuote(versionId, modelId, pageId, self) {
  if (self != undefined) {
    var parent = self.parentNode;
    if ($(parent).hasClass("cc-sponsored")) pageId = 13;
  }

  openPqPopUp(versionId, modelId, pageId, self);
}

/***************PQ Widget Ends***************************/

function openPqPopUp(versionId, modelId, pageId, elem) {
  var getOnRoadlocation = new LocationSearch(elem, {
    showCityPopup: true,
    ctaText: "Show On-Road Price",
    defaultPopupOpen: true,
    prefillPopup: true,
    isDirectCallback: true,
    callback: function (locationObj) {
      var pqInput = {
        modelId: modelId,
        versionId: versionId,
        location: locationObj,
        pageId: pageId
      };
      PriceBreakUp.Quotation.RedirectToPQ(pqInput);
    },
    validationFunction: function () {
      return PriceBreakUp.Quotation.getGlobalLocation();
    }
  });
}

function RedirectToModelPage(makeName, modelName, elem) {
  new LocationSearch(elem, {
    showCityPopup: true,
    isAreaOptional: true,
    defaultPopupOpen: true,
    prefillPopup: true,
    isDirectCallback: true,
    callback: function (locationObj) {
      window.location.href = "/" + makeName + "-cars/" + modelName + "/";
    },
    validationFunction: function () {
      return PriceBreakUp.Quotation.getGlobalLocation();
    }
  });
}

function trackTopMenu(action, label) {
  dataLayer.push({
    event: "TopMenu",
    cat: "TopMenu",
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

function trackNewTopMenu(action, label) {
  dataLayer.push({
    event: "TopMenu",
    cat: "TopMenuabtest",
    act: action,
    lab: label
  });
}

function trackNavigation(action, label) {
  dataLayer.push({
    event: "Navigation-drawer",
    cat: "Navigation-drawer",
    act: action,
    lab: label
  });
}

function trackGlobalSearchAd(action, label) {
  dataLayer.push({
    event: "CTInteractive",
    cat: "SearchResult_Ad",
    act: action,
    lab: label
  });
}

function trackUsedSearch(category, action, label) {
  dataLayer.push({
    event: "Desktop-Homepage",
    cat: category,
    act: action,
    lab: label
  });
}

function trackTabs(action, label) {
  dataLayer.push({
    event: "Desktop-Homepage",
    cat: "FirstPanel-Desktop-HP",
    act: action,
    lab: label
  });
}

//geocityName / empty / usercity
function trackGlobalCityPopup(action, label) {
  dataLayer.push({
    event: "Global-City-Popup",
    cat: "Global-City-Popup",
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

function setCityCookie(drpCity) {
  var selectedCityId = $("#" + drpCity + " Option:selected").val();
  var selectedCityName = $("#" + drpCity + " Option:selected").text();
  var selectedZoneId = $("#" + drpCity + " Option:selected").attr("zoneid");

  //to be refactored after removal of zones in dropdown todo
  if (selectedZoneId > 0) {
    document.cookie =
      "_CustCityId=" +
      selectedCityId +
      "; expires = " +
      permanentCookieTime() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/";
    document.cookie =
      "_PQZoneId=" +
      selectedZoneId +
      "; expires = " +
      permanentCookieTime() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/";
    document.cookie =
      "_CustCity=" +
      selectedCityName.split("(")[0].trim(" ") +
      "; expires = " +
      permanentCookieTime() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/";
  } else {
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
    document.cookie =
      "_PQZoneId=" +
      "" +
      "; expires = " +
      permanentCookieTime() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/";
  }
}

function setCityCookieKo() {
  var selectedCityId = $("#drpCity Option:selected").val();
  var selectedCityName = $("#drpCity Option:selected").text();
  var selectedZoneId = $("#drpCity Option:selected").attr("zoneid");

  //to be refactored after removal of zones in dropdown todo
  if (selectedZoneId > 0) {
    document.cookie =
      "_CustCityId=" +
      selectedCityId +
      "; expires = " +
      permanentCookieTime() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/";
    document.cookie =
      "_PQZoneId=" +
      selectedZoneId +
      "; expires = " +
      permanentCookieTime() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/";
    document.cookie =
      "_CustCity=" +
      selectedCityName.split("(")[0].trim(" ") +
      "; expires = " +
      permanentCookieTime() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/";
  } else {
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
    document.cookie =
      "_PQZoneId=" +
      "" +
      "; expires = " +
      permanentCookieTime() +
      "; domain=" +
      defaultCookieDomain +
      "; path =/";
  }
}

(function ($) {
  "use strict";
  $.fn.openSelect = function () {
    return this.each(function (idx, domEl) {
      if (document.createEvent) {
        var event = document.createEvent("MouseEvents");
        event.initMouseEvent(
          "mousedown",
          true,
          true,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        domEl.dispatchEvent(event);
      } else if (element.fireEvent) {
        domEl.fireEvent("onmousedown");
      }
    });
  };
})(jQuery);

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

var Common = {
  isScrollLocked: false,
  showCityPopup: false,
  googleApiKey: typeof googleApiKey === "undefined" ? "" : googleApiKey,
  doc: $(document),
  usedLanding: {
    registerEvents: function () {
      Common.doc.on("click", "#usedCarsinMajorCities", function () {
        SetCookieInDays("_CustCityUserAction", 1);
      });
    }
  },
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

  PQ: {
    setPQCityCookies: function (changedCity, changedCityName) {
      if (changedCity.toString().indexOf(".") != -1) {
        var cityId = changedCity.toString().split(".")[0];
        var zoneId = changedCity.toString().split(".")[1];
        $.cookie("_PQZoneId", zoneId, { path: "/" });
      } else {
        var cityId = changedCity.toString();
        if (window.location.pathname.indexOf("quotation.aspx") != -1)
          $.cookie("_PQZoneId", "", { path: "/" });
        else
          $.cookie("_PQZoneId", $.cookie("_CustZoneIdMaster"), { path: "/" });
      }
      $.cookie("_CustCityId", cityId, { path: "/" });
      $.cookie("_CustCity", changedCityName, { path: "/" });
    },
    setPQZoneCookie: function (changedZone) {
      $.cookie("_PQZoneId", changedZone, { path: "/" });
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
        throw new Error("This function only accepts an array as input.");
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
              break;
            }
          }
        }
      }
    },
    UpdateAndRefreshCarousel: function (status, selector, Gallery, element) {
      if (status == "success") {
        selector.attr('id') == 'tabColors' ? Gallery.setColorData() : Gallery.setImageData();
        Gallery.common.updateShowMore(element);
        Gallery.swiper.refreshCarousel();
      }
    },
    firePageView: function (inputUrl) {
      try {
        ga("create", "UA-337359-1", "auto", { useAmpClientId: true });
        ga("send", "pageview", inputUrl);
      } catch (e) {
        console.log(e);
      }
    },
    trackingBasedOnScreenSize: function (
      isFullScreen,
      swiper,
      index,
      label,
      isColorsActive
    ) {
      if (isFullScreen) {
        if (index >= swiper.previousIndexFullscreen) label = "image_next";
        else label = "image_prev";
        label += "_fullscreen";
        swiper.previousIndexFullscreen = index;
      } else {
        label = isColorsActive ? "color_" : "";
        if (index >= swiper.previousIndex) label += "image_next";
        else label += "image_prev";
        swiper.previousIndex = index;
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

    isQuotationPage: function () {
      if (location.pathname == "/new/quotation.aspx") {
        return true;
      }
      return false;
    },

    showLoading: function () {
      // function for showing image Loading
      $("div.blackOut-window").show();
      $("#loadingCarImg").show();
    },

    hideLoading: function () {
      // function for hiding image Loading
      $("div.blackOut-window").hide();
      $("#loadingCarImg").hide();
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

      if (actionLabel != undefined && actionLabel.length > 0)
        pushObject = {
          event: actionEvent,
          cat: actionCat,
          act: actionAct,
          lab: actionLabel,
          transport: "beacon"
        };
      else
        pushObject = {
          event: actionEvent,
          cat: actionCat,
          act: actionAct,
          transport: "beacon"
        };

      setTimeout(function () {
        dataLayer.push(pushObject);
      }, 0);
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

    prefillUserDetails: function () {
      $("input[prefill]").each(function (count, element) {
        if (
          $(element).attr("prefill") == "name" &&
          Common.utils.getUserName() != ""
        ) {
          $(element).val(Common.utils.getUserName());
        } else if (
          $(element).attr("prefill") == "email" &&
          Common.utils.getUserEmail() != ""
        ) {
          $(element).val(Common.utils.getUserEmail());
        } else if (
          $(element).attr("prefill") == "mobile" &&
          Common.utils.getUserMobile() != ""
        ) {
          $(element).val(Common.utils.getUserMobile());
        }
      });
    },

    trackImpression: function () {
      $("div[trackingImp]").each(function (count, element) {
        var impression = $(element);
        if (impression.attr("trackingImp") == "pbImpressionModelDesk")
          Common.utils.trackAction(
            "Financeleadsubmit",
            "pblink_modelpage_desktop",
            "Link_shown",
            impression.attr("label")
          );
        if (impression.attr("trackingImp") == "bbImpressionModelDesk")
          Common.utils.trackAction(
            "BBLink_finance",
            "BBLinkImpressions_desktop",
            "finance_model_page",
            impression.attr("label")
          );
        if (impression.attr("trackingImp") == "pbImpressionVariantDesk")
          Common.utils.trackAction(
            "Financeleadsubmit",
            "pblink_variantpage_desktop",
            "Link_shown",
            impression.attr("label")
          );
        if (impression.attr("trackingImp") == "bbImpressionVariantDesk")
          Common.utils.trackAction(
            "BBLink_finance",
            "BBLinkImpressions_desktop",
            "finance_variant_page",
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
    trackImpWithoutSuffix: function () {
      $("[data-role*='impression']").each(function (count, element) {
        Common.utils.callTracking($(this), "");
      });
    },
    callTracking: function (node, action) {
      if (action == undefined) action = "";
      try {
        var evCat = node.data("cat") ? node.data("cat") : "",
          evAct = node.data("action") ? node.data("action") + action : "",
          evLab = node.data("label") ? node.attr("data-label") : "",
          evEvent = node.data("event")
            ? node.data("event")
            : action === "_shown"
              ? "CTNonInteractive"
              : action === "_click"
                ? "CTInteractive"
                : "";
        Common.utils.trackAction(evEvent, evCat, evAct, evLab);
      } catch (e) {
        console.log(e);
      }
    },
    categoryTrackingName: function () {
      switch (Number(PageId)) {
        case 55:
          return "ModelCityPage_Lead_CTA_Desktop";
          break;
        case 31:
          return "ModelPage_Lead_CTA_Desktop";
          break;
        case 38:
          return "VersionPage_Lead_CTA_Desktop";
          break;
        case 25:
          return "Compare_Lead_CTA_Desktop";
          break;
        default:
          return "Anonymous_Lead_CTA_Desktop";
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
      var name = "";
      if ($.cookie("_CustomerName") != null) name = $.cookie("_CustomerName");
      else if ($.cookie("TempCurrentUser") != null) {
        name = $.cookie("TempCurrentUser").split(":")[0];
      }
      return name;
    },
    getUserMobile: function () {
      var mobile = "";
      if ($.cookie("_CustMobile") != null && $.cookie("_CustMobile") != "")
        mobile = $.cookie("_CustMobile");
      else if ($.cookie("TempCurrentUser") != null) {
        mobile = $.cookie("TempCurrentUser").split(":")[1];
      }
      return mobile;
    },
    getUserEmail: function () {
      var email = "";
      if ($.cookie("_CustEmail") != null) email = $.cookie("_CustEmail");
      else if ($.cookie("TempCurrentUser") != null) {
        email = $.cookie("TempCurrentUser").split(":")[2];
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
    //return cookie value if cookie exists otherwise return undefined
    getCookie: function (name) {
      var allCookies = "; " + document.cookie; //adding '; ' so can split cookie value into two parts
      var parts = allCookies.split("; " + name + "="); //spliting cookie into two parts 1) '....; {name}=' 2) '{value}; ......'
      var cookieValue;
      if (parts.length >= 2) {
        //if cookie exists then it will split into two or more parts
        cookieValue = parts
          .pop()
          .split(";")
          .shift(); //from second part extracting value
      }
      return cookieValue;
    },
    lockPopup: function () {
      var html_el = $("html"),
        body_el = $("body");
      $(".blackOut-window")
        .first()
        .show();
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
    },
    unlockPopup: function () {
      $("#blackOut-window, .blackOut-window").hide();
      var scrollTop = parseInt($("html").css("top"));
      $("html").removeClass("lock-browser-scroll");
      $("html,body").scrollTop(-scrollTop);
      Common.isScrollLocked = false;
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

    // Added by Meet Shah on 7/8/16
    // To decide new menu GA tracking event : hover vs click
    isTouchDevice: function () {
      return (
        "ontouchstart" in window ||
        navigator.MaxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
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
            .change();
          $(drp).removeAttr("disabled");
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

  advantage: {
    popup: {
      registerEvents: function () {
        $("[data-adv-popup='showAdvantageCityPopup']").on("click", function () {
          var modelId = 0;
          var versionId = 0;
          var makeId = 0;
          if ($(this).attr("data-model") != undefined)
            modelId = $(this).attr("data-model");
          if ($(this).attr("data-variant") != undefined)
            versionId = $(this).attr("data-variant");
          if ($(this).attr("data-make") != undefined)
            makeId = $(this).attr("data-make");
          Common.advantage.popup.getPopupCities(modelId, versionId, makeId);
          var url = $(this).attr("data-url");
          $("#advantage-city-select").attr("data-advantage-url", url);
          Common.advantage.popup.showCityPopup();
        });

        $("#advantage-city-select").change(function () {
          Common.utils.trackAction(
            "CTInteractive",
            "deals_desktop",
            "city_popup_city_selected"
          );
          var url = $("#advantage-city-select").attr("data-advantage-url");
          var citySelected = $("#advantage-city-select").val();
          if (citySelected != "-1") {
            location.href = Common.utils.updateQSParam(
              url,
              "cityId",
              citySelected
            );
          }
        });

        $("div.blackOut-window, .advantage-city-popup .city-close-button").on(
          "click",
          function () {
            Common.advantage.popup.hideCityPopup();
          }
        );

        $(document).on("keyup", function (e) {
          if (e.keyCode == 27) {
            Common.advantage.popup.hideCityPopup();
          }
        });

        $(".advantagelinks").click(function () {
          location.href = $(this)
            .find(".contentWrapper")
            .attr("data-url");
        });
      },

      getAdvantageCities: function (modelId, versionId, makeId) {
        var config = {};
        config.contentType = "application/json";
        config.headers = { sourceid: "1" };
        if (versionId > 0)
          return Common.utils.ajaxCall(
            "/api/advantage/cities/?versionId=" + versionId,
            config
          );
        else if (modelId > 0)
          return Common.utils.ajaxCall(
            "/api/advantage/cities/?modelId=" + modelId,
            config
          );
        else if (makeId > 0)
          return Common.utils.ajaxCall(
            "/api/advantage/cities/?makeId=" + makeId,
            config
          );
        else return Common.utils.ajaxCall("/api/advantage/cities/", config);
      },

      getPopupCities: function (modelId, versionId, makeId) {
        try {
          $.when(
            Common.advantage.popup.getAdvantageCities(
              modelId,
              versionId,
              makeId
            )
          ).done(function (data) {
            var obj = {};
            obj = typeof data == "object" ? data : obj;
            $("#advantage-city-select")
              .find("option:gt(0)")
              .remove();
            $.each(obj, function (i, opt) {
              $("#advantage-city-select").append(
                "<option value='" +
                opt.cityId +
                "'>" +
                opt.cityName +
                "</option>"
              );
            });
          });
        } catch (e) {
          console.log(e);
        }
      },

      showCityPopup: function () {
        Common.utils.lockPopup();
        Common.utils.trackAction(
          "CTNonInteractive",
          "deals_desktop",
          "city_popup_shown"
        );
        $(".advantage-city-popup").show();
      },

      hideCityPopup: function () {
        Common.utils.unlockPopup();
        $(".advantage-city-popup").hide();
      }
    },
    ABTesting: function (element, modulusNumber, text1, text2) {
      if (isCookieExists("_abtest")) {
        if (parseInt($.cookie("_abtest")) % modulusNumber === 0)
          element.text(text1);
        else element.text(text2);
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
      "Desktop-Homepage",
      "FirstPanel-Desktop-HP",
      "NewCars-Successful-Selection-Value-Click",
      userInput
    );
    window.location.href =
      "/compare-cars/" + Common.getCompareUrl(dataList) + "/?source=24";
    return false;
  },
  autoComplete: {
    getMakeModelName: function (autoCompleteResult) {
      var makeModelArray = autoCompleteResult.split("|");
      var makeMaskingName = makeModelArray[0].split(":")[0];
      var modelMaskingName = makeModelArray[1].split(":")[0];
      return [makeMaskingName, modelMaskingName];
    },

    redirectToModelPage: function (autoCompleteResult) {
      var makeModelArray = Common.autoComplete.getMakeModelName(
        autoCompleteResult
      );
      var makeMaskingName = makeModelArray[0];
      var modelMaskingName = makeModelArray[1];
      window.location.href =
        "/" + makeMaskingName + "-cars/" + modelMaskingName + "/";
    }
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

//This js will address all location related functionality for Desktop
//retrieves autocomplete predictions programmatically
// from the autocomplete service, which gives you more fine grained control
// over the presentation and filtering of results.
var Location = {
  is_ie_safari: false,
  is_ie: false,
  scrollTop: $(window).scrollTop(),
  scrollMinusTop: undefined,
  widgetHeight: 165,
  easeEffect: "swing",
  body: $("body"),
  locTitle: $("#loc-title"),
  txtPlacesQuery: $("#placesQuery"),
  locSubTitle: $("#loc-sub-content"),
  length: 0,
  locValue: "",
  areaCityName: "",
  areaWidth: 0,
  noMatchError: $(".noMatchError"),
  objPopupCity: {},
  item: {},
  sourceType: ac_Source.globalCityLocation,
  areaCityId: -1,
  mulitiselectObj: undefined,
  multiSelectElem:
    ".cityNameWrap .ui-autocomplete-multiselect .ui-autocomplete-multiselect-item",
  cityonly: window.location.href.indexOf("/used/") > 0,
  USERIP: typeof USERIP === "undefined" ? "" : USERIP,
  globalSearch: {
    initialize: function () {
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");
      var isSafari = ua.indexOf("Safari");
      var isChrome = ua.indexOf("Chrome");
      var sessionCount = ["1", "3", "5", "8", "13", "18", "23", "28"];
      var checkSession = $.inArray(Common.getUtma(), sessionCount);
      var citycookies = $.cookie("_CustCityIdMaster");
      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        // If Internet Explorer, return ms_ie
        Location.is_ie_safari = true;
        Location.is_ie = true;
      } else if (
        (isSafari != -1 && isChrome == -1) ||
        !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
      ) {
        Location.is_ie_safari = true;
      } else {
        Location.is_ie_safari = false;
      }
      if (/Edge\/\d./i.test(navigator.userAgent)) {
        // This is Microsoft Edge
        Location.is_ie = true;
      }
      var areaText = "";
      if (
        citycookies != null &&
        (!Common.is1stVistOfUtmaSession() || Number(citycookies) > -1)
      ) {
        var cityId = Number(citycookies);
        if (cityId > 0) {
          var areacookies = $.cookie("_CustAreaId");
          if (
            !Location.cityonly &&
            $.inArray(Number(cityId), askingAreaCityId) >= 0
          ) {
            if (Number(areacookies) > 0) {
              areaText += $.cookie("_CustAreaName") + ", ";
              Location.utils.checkZoneCookies();
            }
          }
          areaText += $.cookie("_CustCityMaster");
          $("#global-place")
            .text(areaText)
            .attr("title", areaText);

          if ($("#hdnGlobalCity").length > 0) {
            var hdnCityId = $("#hdnGlobalCity").val();
            if (Number(hdnCityId) != cityId) {
              location.reload();
            }
            $("#hdnGlobalCity").val(cityId);
          }
        }
      } else {
        if (citycookies == null) {
          Location.globalSearch.setLocationCookies(
            "-1",
            "Select City",
            "-1",
            "Select Area",
            "",
            "Select Zone"
          );
          Common.is1stVistOfUtmaSession();
        }
        if (Common.showCityPopup && checkpath() && checkSession != -1) {
          Common.utils.trackAction(
            "Global-City-Popup",
            "AreaLocation",
            "popupdisplayed",
            "AutoDisplay"
          );
          Location.globalSearch.setLocationCookies(
            "-1",
            "Select City",
            "-1",
            "Select Area",
            "",
            "Select Zone"
          );
          Location.globalSearch.openLocHint();
        }
      }
    },

    registerEvents: function () {
      $(document).on("click", ".globalLocBlackOut", function () {
        if (!$("body").hasClass("no-action-bg")) {
          // if body has 'no-action-bg', globalLocBlackOut is non-clickable.
          if ($("#locationProceed").hasClass("opacity0 z-index-minus1"))
            Common.utils.trackAction(
              "CTInteractive",
              "AreaLocation",
              "Ip2Location",
              objPopupCity.label + "-GreyClick"
            );
          else
            Common.utils.trackAction(
              "TopMenu",
              "AreaLocation",
              "popupclosedgrey",
              Location.utils.getcookieslocation()
            );
          Location.globalSearch.closeLocHint();
        }
      });

      $(document).on("keydown", function (e) {
        var ESCKEY = 27,
          ENTERKEY = 13;
        if (e.keyCode == ENTERKEY) {
          if ($("#loc-widget").hasClass("openLocWidget")) {
            e.preventDefault();
            Location.txtPlacesQuery.focus();
            Location.globalSearch.multiSelectValidation();
          }
        } else if (e.keyCode == ESCKEY) {
          if ($("#loc-widget").hasClass("openLocWidget")) {
            e.preventDefault();
            Common.utils.trackAction(
              "TopMenu",
              "AreaLocation",
              "popupclosedesc",
              Location.utils.getcookieslocation()
            );
            Location.globalSearch.closeLocHint();
          }
        }
      });

      $(document).on("click", "span.location-cross", function () {
        var item = $(this).parent();
        Common.utils.trackAction(
          "TopMenu",
          "Deselect",
          "citydeleted",
          Location.utils.getInputlocation()
        );
        delete Location.mulitiselectObj.selectedItems[item.text()];
        if (item.index() == 0) $(".ui-autocomplete-multiselect-item").remove();
        else item.remove();
        Location.mulitiselectObj.element.show();
        Location.globalSearch.cityTxtChange();
      });

      $("#placesQuery")
        .cw_autocomplete({
          resultCount: 5,
          source: Location.sourceType,
          cityId: Location.areaCityId,
          multiselect: true,
          beforefetch: function () {
            this.source = Location.sourceType;
            this.cityId = Location.areaCityId;
          },
          afterselect: function (self, item) {
            Location.mulitiselectObj = self;
            Location.txtPlacesQuery.css("opacity", 0);

            if (Location.sourceType == ac_Source.areaLocation) {
              Location.globalSearch.processAreas(item);
              self.element.hide();
              Location.txtPlacesQuery.css("opacity", 1);
            } else {
              Location.globalSearch.processCities(item);
              if (!item.payload.isAreaAvailable || Location.cityonly) {
                self.element.hide();
                Location.txtPlacesQuery.css("opacity", 1);
              }
            }
          },
          afterfetch: function (result, searchtext) {
            if (result == undefined || result.length <= 0) {
              $(".cityNameWrap").addClass("errorWidget");
              Location.noMatchError.show();
              $("#errorIpNoCity").hide();
              $("#errorId").show();
              Common.utils.trackAction(
                "CTInteractive",
                "AreaLocation",
                "NoResults",
                searchtext + "_" + window.location.href
              );
            } else if (Location.noMatchError.is(":visible")) {
              $(".cityNameWrap").removeClass("errorWidget");
              Location.noMatchError.hide();
            }
          }
        })
        .autocomplete("widget")
        .addClass("multiselectUl");

      $("#closeLocIcon").click(function () {
        if ($("#locationProceed").hasClass("opacity0 z-index-minus1"))
          Common.utils.trackAction(
            "CTInteractive",
            "AreaLocation",
            "Ip2Location",
            objPopupCity.label + "-Close"
          );
        else
          Common.utils.trackAction(
            "TopMenu",
            "AreaLocation",
            "popupclosedcross",
            Location.utils.getcookieslocation()
          );
        isNotificationShow.showNotificationForUsedCars();
        Location.globalSearch.closeLocHint();
      });

      $("#global-location").on(
        "click",
        Location.globalSearch.showGlobalCityPopup
      );

      $("#placesQuery")
        .on("keydown", function (e) {
          var ENTERKEY = 13,
            BACKSPACE = 8,
            ESCKEY = 27;
          e.stopPropagation();
          if (e.keyCode == ENTERKEY) {
            e.preventDefault();
            setTimeout(Location.globalSearch.multiSelectEnterValidation, 0);
          }
          if (e.keyCode == ESCKEY) {
            Location.globalSearch.multiSelectValidation();
            Location.globalSearch.closeLocHint();
          }
          if (e.keyCode == BACKSPACE) {
            var multiitemObj = $(Location.multiSelectElem);
            Location.length = multiitemObj.length;
            if (Location.areaCityName.trim() != "" && Location.length == 0) {
              Common.utils.trackAction(
                "TopMenu",
                "Deselect",
                "citydeleted-backspace",
                Location.areaCityName + "||"
              );
              setTimeout(Location.globalSearch.multiSelectChangeTxt, 0);
            }
          }
        })

        .on("keyup", function (e) {
          if (e.keyCode == 8 || e.keyCode == 46) {
            if (
              Location.noMatchError.is(":visible") &&
              Location.txtPlacesQuery.val() == ""
            ) {
              $(".cityNameWrap").removeClass("errorWidget");
              Location.noMatchError.hide();
            }
          }
        })

        .on("autocompleteselect", function (e, ui) {
          setTimeout(Location.globalSearch.multiSelectValidation, 0);
        })

        .on("focus", function (e) {
          $(this).removeClass("inputBlur");
        })
        .on("blur", function () {
          var selfInput = $(this);
          var inputPlaceholder = selfInput.attr("placeholder");
          if (selfInput.val() != inputPlaceholder) {
            selfInput.val("").addClass("inputBlur");
          }
          if (Location.noMatchError.is(":visible")) {
            $(".cityNameWrap").removeClass("errorWidget");
            Location.noMatchError.hide();
          }
        });

      // $("#btnGlobalCity").live("click", function () {
      //   Location.globalSearch.hideGlobalCityCoachmark();
      //   if (!isCookieExists("_CoachmarkStatus")) {
      //     showCoachmarks();
      //   }
      // });

      $(window).scroll(function () {
        if ($(this).scrollTop() >= 200) {
          if ($(".global-city-coachmark").is(":visible")) {
            Location.globalSearch.hideGlobalCityCoachmark();
            Location.globalSearch.setCoachMarkCookie();
          }
        }
      });
    },

    locateDealerMapPosition: function () {
      var dealermap = $(".dealer-map");
      if (dealermap.length > 0) {
        var classList = dealermap.attr("class");
        setTimeout(function () {
          dealermap.attr("class", classList);
        }, 530);
      }
    },

    openLocHint: function () {
      try {
        $("#loc-widget").addClass("openLocWidget");
        Location.scrollTop = $(window).scrollTop();
        $(".globalLocBlackOut")
          .show()
          .animate({ top: Location.widgetHeight }, 500, Location.easeEffect);
        $("#global-location").addClass("highlight");
        Location.scrollMinusTop = -(Location.scrollTop - Location.widgetHeight);
        $("body")
          .stop()
          .animate(
            { marginTop: Location.widgetHeight },
            500,
            Location.easeEffect
          );
        if (Location.scrollTop > 50)
          $("#header").addClass("header-top-fixed-bg");
        $("#header")
          .stop()
          .animate({ top: Location.widgetHeight }, 500, Location.easeEffect);
        $("#loc-widget")
          .addClass("loc-widget-fixed")
          .stop()
          .animate(
            { height: Location.widgetHeight },
            500,
            Location.easeEffect,
            function () {
              $("body")
                .addClass("fixed")
                .css("margin-top", Location.scrollMinusTop);
              Common.isScrollLocked = true;
            }
          );
        $(".ui-autocomplete-multiselect-item").remove();
        $("input#placesQuery").show();
        setTimeout(function () {
          if ($("#placesQuery").val() == "" && !Location.is_ie_safari)
            $("#placesQuery").focus();
          if (
            $(".filters.main-filter-list").length > 0 &&
            Location.scrollTop > 1000
          )
            $(".filters.main-filter-list").addClass("usedFilterFixed");
        }, 400);
        Location.globalSearch.locateDealerMapPosition();
      } catch (e) {
        console.log(e);
      }
    },

    prefillLocation: function (cityId) {
      var citycookies = Number($.cookie("_CustCityIdMaster"));
      var elementobj = $("input#placesQuery");

      if (elementobj.val() != "") {
        elementobj.val("");
      }

      if (citycookies > 0) {
        Location.globalSearch.apppedMultiselectinput(
          citycookies,
          $.cookie("_CustCityMaster"),
          elementobj,
          "searchid"
        );
        Location.globalSearch.multiSelectChangeTxt();
      }
    },

    apppedMultiselectinput: function (id, name, elem, divattr) {
      $("<div></div>")
        .attr(divattr, id)
        .addClass("ui-autocomplete-multiselect-item")
        .text(name)
        .append(
          $("<span></span>")
            .addClass("cwsprite cross-sm-dark-grey cur-pointer")
            .click(function () {
              var item = $(this).parent();
              Common.utils.trackAction(
                "CTInteractive",
                "Deselect",
                divattr == "areaid" ? "areadeleted" : "citydeleted",
                Location.utils.getInputlocation()
              );
              if (item.index() == 0)
                $(".ui-autocomplete-multiselect-item").remove();
              else item.remove();
              elem.show();
              Location.globalSearch.cityTxtChange();
            })
        )
        .insertBefore(elem);
    },

    closeLocHint: function () {
      try {
        var multiitemObj = $(Location.multiSelectElem);
        var selectCityId = multiitemObj.attr("searchid");

        if (
          !Location.cityonly &&
          multiitemObj.length == 1 &&
          $.inArray(Number(selectCityId), askingAreaCityId) >= 0
        ) {
          var selectCityName = multiitemObj.text();
          $(document).trigger("mastercitychange", [
            selectCityName,
            selectCityId,
            Location.item
          ]);
        }
        $("#loc-widget").removeClass("openLocWidget");
        $(".globalLocBlackOut").animate(
          { top: 0 },
          500,
          Location.easeEffect,
          function () {
            $(".globalLocBlackOut").fadeOut(200);
          }
        );
        $("#header")
          .stop()
          .animate({ top: 0 }, 500, Location.easeEffect, function () {
            if ($(document).find(".loc-widget-fixed").length > 0) {
              $("#header").removeClass("header-top-fixed-bg");
            }
          });
        $("body").removeClass("fixed");
        Common.isScrollLocked = false;
        if ($(document).find(".loc-widget-fixed").length > 0) {
          $("body").css("margin-top", Location.widgetHeight);
          $(window).scrollTop(Location.scrollTop);
          $("body")
            .stop()
            .animate({ marginTop: 0 }, 500, Location.easeEffect, function () {
              $("#loc-widget").removeClass("loc-widget-fixed");
              Location.globalSearch.ipDivHide();
              Location.txtPlacesQuery.val("");
              Location.globalSearch.cityTxtChange();
            });
        }
        $("#loc-widget")
          .stop()
          .animate({ height: 0 }, 500, Location.easeEffect);
        $(".cityNameWrap").removeClass("errorWidget");
        setTimeout(function () {
          $("#global-location").removeClass("highlight");
          if (
            $(".filters.main-filter-list").length > 0 &&
            Location.scrollTop > 1000
          )
            $(".filters.main-filter-list").removeClass("usedFilterFixed");
        }, 400);
        Location.globalSearch.locateDealerMapPosition();
      } catch (e) {
        console.log(e);
      }
    },

    ipDivHide: function () {
      $("#locationProceed").removeClass("opacity0 z-index-minus1");
    },

    ipDivShow: function () {
      $("#locationProceed").addClass("opacity0 z-index-minus1");
    },

    setLocationCookies: function (
      cityId,
      cityName,
      areaId,
      areaName,
      zoneId,
      zoneName
    ) {
      Common.utils.setEachCookie("_CustCityIdMaster", cityId);
      Common.utils.setEachCookie("_CustCityMaster", cityName);
      Common.utils.setEachCookie("_CustAreaId", areaId);
      Common.utils.setEachCookie("_CustAreaName", areaName);

      if (typeof zoneId !== "undefined") {
        Common.utils.setEachCookie("_CustZoneIdMaster", zoneId);
        Common.utils.setEachCookie("_CustZoneMaster", zoneName);
      }
    },

    processCities: function (item) {
      var cityname = item.payload.cityName;
      var cityid = item.payload.cityId;
      Location.item = item;
      Location.globalSearch.setLocationCookies(
        item.payload.cityId,
        cityname,
        -1,
        "Select Area",
        "",
        "Select Zone"
      );
      $("#global-place")
        .text(cityname)
        .attr("title", cityname);
      Common.utils.trackAction(
        "TopMenu",
        "AreaLocation",
        "citySelected",
        cityname + "||"
      );
      if (!Location.cityonly && item.payload.isAreaAvailable) {
        Location.globalSearch.multiSelectChangeTxt();
        Location.areaCityName = cityname;
      } else {
        isNotificationShow.showNotificationForUsedCars();
        $(document).trigger("mastercitychange", [cityname, cityid, item]);
        Location.globalSearch.closeLocHint();
      }
    },

    processAreas: function (item) {
      var cityname = item.payload.cityName;
      var cityid = item.payload.cityId;
      var areaId = item.payload.areaId;
      var areaName = item.payload.areaName;

      Location.globalSearch.setLocationCookies(
        cityid,
        cityname,
        areaId,
        areaName,
        item.payload.zoneId,
        item.payload.zoneName
      );
      $(document).trigger("mastercitychange", [cityname, cityid, item]);
      $("#global-place")
        .text(areaName + ", " + cityname)
        .attr("title", areaName + ", " + cityname);
      Common.utils.trackAction(
        "TopMenu",
        "AreaLocation",
        "AreaSelected",
        Location.utils.getcookieslocation()
      );
      Location.globalSearch.closeLocHint();
    },

    multiSelectValidation: function () {
      var selectCityId, selectCityName;
      var multiitemObj = $(Location.multiSelectElem);
      Location.length = multiitemObj.length;
      Location.txtPlacesQuery = $("#placesQuery");
      if (Location.length <= 1) {
        selectCityId = multiitemObj.attr("searchid");
        selectCityName = multiitemObj.text();
        if (Location.txtPlacesQuery.val() == objPopupCity.label) {
          selectCityId = objPopupCity.id;
          selectCityName = objPopupCity.label;
          if (objPopupCity.id != $.cookie("_CustCityIdMaster"))
            Location.globalSearch.setLocationCookies(
              objPopupCity.id,
              objPopupCity.label,
              -1,
              "Select Area",
              "",
              "Select Zone"
            );
          $("#global-place")
            .text(objPopupCity.label)
            .attr("title", objPopupCity.label);
          if (
            Location.cityonly ||
            $.inArray(Number(objPopupCity.id), askingAreaCityId) < 0
          ) {
            Common.utils.trackAction(
              "CTInteractive",
              "AreaLocation",
              "citySelected",
              objPopupCity.label + "||"
            );
            Location.globalSearch.closeLocHint();
            $(document).trigger("mastercitychange", [
              selectCityName,
              selectCityId,
              Location.item
            ]);
          } else {
            Location.areaCityName = selectCityName;
            Location.globalSearch.prefillLocation(objPopupCity.id);
            Location.globalSearch.ipDivHide();
            Location.txtPlacesQuery.focus();
          }
          return true;
        }
      }
    },

    multiSelectEnterValidation: function () {
      if (
        Location.length < 1 ||
        ($("#placesQuery").val() == "" && Location.noMatchError.is(":visible"))
      ) {
        $(".cityNameWrap").addClass("errorWidget");
      } else if (Location.length == 1) {
        $(".cityNameWrap").removeClass("errorWidget");
      }
    },

    cityTxtChange: function () {
      Location.sourceType = ac_Source.globalCityLocation;
      Location.areaCityId = -1;
      Location.locTitle.text("Please Tell Us Your City");
      Location.locSubTitle.text(
        "Knowing your city will help us provide relevant content to you."
      );
      Location.txtPlacesQuery.attr(
        "placeholder",
        "Type your city, e.g. Mumbai; New Delhi"
      );
    },

    multiSelectChangeTxt: function () {
      Location.txtPlacesQuery = $("#placesQuery");
      Location.length = $(
        ".cityNameWrap .ui-autocomplete-multiselect .ui-autocomplete-multiselect-item"
      ).length;
      if (Location.length == 1) {
        Location.txtPlacesQuery.attr("searchtype", "areaSearch");
        var selectCity = $(Location.multiSelectElem).attr("searchid");
        if (
          !Location.cityonly &&
          $.inArray(Number(selectCity), askingAreaCityId) >= 0
        ) {
          Location.sourceType = ac_Source.areaLocation;
          Location.areaCityId = selectCity;
          var selectCityName = $(Location.multiSelectElem).text();
          var egAreaName = "";
          if (selectCity == "1") egAreaName = "Andheri East; Colaba";
          else if (selectCity == "10")
            egAreaName = "Connaught Place; Barakhamba";
          else if (selectCity == "12") egAreaName = "Swargate; Hinjewadi";
          else if (selectCity == "2") egAreaName = "Koramangala;  Marathahalli";
          else if (selectCity == "128") egAreaName = "Panchvati; Sabarmati;";
          else if (selectCity == "176") egAreaName = "Velachery; Porur";
          else if (selectCity == "105") egAreaName = "Secunderabad; Panjagutta";
          else if (selectCity == "198") egAreaName = "Salt Lake; Park Street";
          Location.areaWidth = Location.txtPlacesQuery.width();
          Location.locTitle.text("Please Tell Us Your Area");
          Location.locSubTitle.text(
            "Provide your area to get offers from dealers nearby."
          );
          Location.txtPlacesQuery
            .width(0)
            .attr(
              "placeholder",
              "Where in " + selectCityName + "? e.g. " + egAreaName
            );
          setTimeout(function () {
            Location.txtPlacesQuery.animate(
              { width: Location.areaWidth, opacity: 1 },
              500,
              Location.easeEffect
            );
          }, 10);
        } else {
          Location.globalSearch.cityTxtChange();
        }
      } else if (Location.length < 1) {
        Location.areaCityName = "";
        Location.txtPlacesQuery.attr("searchtype", "citySearch");
        Location.globalSearch.cityTxtChange();
      }
    },
    showGlobalCityLabel: function () {
      var areaText = $.cookie("_CustCityMaster");
      $("#global-place")
        .text(areaText)
        .attr("title", areaText);
    },

    bindGlobalCityLabel: function () {
      var cityText = $.cookie("_CustCityMaster");
      var areaText = $.cookie("_CustAreaName");
      var globalText = "";
      if (Number($.cookie("_CustCityIdMaster")) > 0) {
        if (Number($.cookie("_CustAreaId") > 0)) {
          globalText = areaText + ", " + cityText;
        } else {
          globalText = cityText;
        }
        $("#global-place")
          .text(globalText)
          .attr("title", areaText);
      }
    },

    showGlobalCityCoachmark: function (label) {
      var globalLocationId = $("#global-location");
      var globalLocationOffSet = globalLocationId.offset();
      var glOffSetLeft = globalLocationOffSet.left - 212;
      var glOffSetTop = globalLocationOffSet.top + 40;
      var txtGlobalCoachMark = $("#txtGlobalCoachMark");
      var btnGlobalCity = $("#btnGlobalCity");
      var dontShowTips = $("#dontShowTips");

      if (!isCookieExists("_CoachmarkStatus")) {
        txtGlobalCoachMark.html(
          "We have set your default city as " +
          $.cookie("_CustCityMaster") +
          ", you can change your city anytime by clicking here."
        );
        btnGlobalCity.html("Next");
      } else {
        txtGlobalCoachMark.html(
          "We have set your default city as " +
          $.cookie("_CustCityMaster") +
          ", you can change your city anytime by clicking here."
        );
        btnGlobalCity.html("Got It");
        dontShowTips.remove();
      }
      $(".global-city-coachmark")
        .css({ position: "absulate", left: glOffSetLeft, top: glOffSetTop })
        .fadeIn(500);
    },

    hideGlobalCityCoachmark: function () {
      $(".global-city-coachmark").hide();
    },

    setCoachMarkCookie: function () {
      document.cookie =
        "_CoachmarkStatus=" +
        1 +
        "; expires = " +
        permanentCookieTime() +
        "; path =/";
    },
    showGlobalCityPopup: function () {
      if (!$("#loc-widget").hasClass("openLocWidget")) {
        Common.utils.trackAction(
          "Global-City-Popup",
          "AreaLocation",
          "popupdisplayed",
          "UserInitiated|" + Location.utils.getcookieslocation()
        );
        Location.globalSearch.openLocHint();
        Location.globalSearch.ipDivHide();
        if (!Location.is_ie_safari) Location.txtPlacesQuery.focus();
      }
    }
  },
  apiCall: {
    getAreazone: function (id, callBack) {
      $.ajax({
        type: "GET",
        url: "/webapi/location/area/?id=" + id,
        dataType: "Json",
        success: function (areaInfo) {
          callBack(areaInfo);
        },
        error: function () {
          callBack(null);
        }
      });
    }
  },
  utils: {
    //TODO:Bangalore Zone Refactoring
    city: {
      MUMBAI: 1,
      DELHI: 10,
      BANGLORE: 2
    },
    getInputlocation: function () {
      var multiitemObj = $(Location.multiSelectElem);
      var inputLength = multiitemObj.length;
      var label = "||";
      if (inputLength == 1) {
        var inputCity = multiitemObj.text();
        label = inputCity + "|" + "|";
      } else if (inputLength == 2) {
        label = Location.utils.getcookieslocation();
      }
      return label;
    },
    getcookieslocation: function () {
      var label = "||";
      if (Number($.cookie("_CustCityIdMaster")) > 0) {
        label = $.cookie("_CustCityMaster");
        if (Number($.cookie("_CustAreaId")) > 0) {
          label +=
            "|" +
            $.cookie("_CustAreaName") +
            "|" +
            $.cookie("_CustZoneIdMaster");
        } else {
          label += "||";
        }
      }
      return label;
    },
    checkZoneCookies: function () {
      var areaCookies = $.cookie("_CustAreaId");
      if (Number(areaCookies) > 0) {
        var zoneCookies = $.cookie("_CustZoneIdMaster");
        if (zoneCookies == null) {
          Location.apiCall.getAreazone(
            areaCookies,
            Location.utils.bindZoneCookies
          );
        }
      }
    },

    bindZoneCookies: function (areaInfo) {
      if (areaInfo != null) {
        Common.utils.setEachCookie("_CustZoneIdMaster", areaInfo.zoneId);
        Common.utils.setEachCookie("_CustZoneMaster", areaInfo.zoneName);
      } else {
        Common.utils.setEachCookie("_CustZoneIdMaster", "");
        Common.utils.setEachCookie("_CustZoneMaster", "Select Zone");
      }
    },

    globalCityByUserAction: function (cityId, cityName, zoneId, action) {
      var isPqCitySet = 0;
      var label = cityName + "," + Location.USERIP;
      if (Number($.cookie("_CustCityIdMaster")) <= 0 && Number(zoneId) <= 0) {
        //if not a pq zone
        setCookie(cityName, cityId);
        Common.utils.trackAction(
          "CTNonInteractive",
          "Desktop_UserAction_GlobalCitySet",
          action,
          label
        );
        Location.globalSearch.showGlobalCityLabel();
        isPqCitySet = 1;
      }

      if (Number($.cookie("_CustZoneIdMaster")) == 0 && Number(zoneId) > 0) {
        //if its a pq zone
        if (Number($.cookie("_CustCityIdMaster")) <= 0) {
          //TODO:Bangalore Zone Refactoring
          if (cityId == Location.utils.city.MUMBAI) {
            setCookie("Mumbai", cityId);
            Common.utils.trackAction(
              "CTNonInteractive",
              "Desktop_UserAction_GlobalCitySet",
              action,
              label
            );
          }
          if (cityId == Location.utils.city.DELHI) {
            setCookie("Delhi", cityId);
            Common.utils.trackAction(
              "CTNonInteractive",
              "Desktop_UserAction_GlobalCitySet",
              action,
              label
            );
          }
          if (cityId == Location.utils.city.BANGLORE) {
            setCookie("Banglore", cityId);
            Common.utils.trackAction(
              "CTNonInteractive",
              "Desktop_UserAction_GlobalCitySet",
              action,
              label
            );
          }
          if (cityId == Number($.cookie("_CustCityIdMaster"))) {
            Location.utils.setZoneMasterCookie(zoneId, cityName);
          }
          Location.globalSearch.showGlobalCityLabel();
          isPqCitySet = 1;
        } else {
          if (cityId == Number($.cookie("_CustCityIdMaster"))) {
            Location.utils.setZoneMasterCookie(zoneId, cityName);
            Common.utils.trackAction(
              "CTNonInteractive",
              "Desktop_UserAction_GlobalCitySet",
              "PQOnlyZoneSet",
              label
            );
            Location.globalSearch.showGlobalCityLabel();
            isPqCitySet = 1;
          }
        }
      }
      return isPqCitySet;
    },

    setZoneMasterCookie: function (zoneId, zoneName) {
      Common.utils.setEachCookie("_CustZoneIdMaster", zoneId);
      Common.utils.setEachCookie("_CustZoneMaster", zoneName);
    }
  }
};

$(window).load(function () {
  $(document).on("gotstatecity", function (event, prefillData) {
    Common.prefillData.processStateCity(prefillData);
  });

  if (
    Number($.cookie("_CustCityIdMaster")) > 0 &&
    typeof Common.showCityPopup != "undefined" &&
    Common.showCityPopup
  )
    Common.prefillData.initStateAndCities();
});

var btObj = {
  invokeToolTipData: {
    clickElement: undefined,
    contentElement: undefined,
    width: undefined,
    position: undefined
  },
  btSelector: "",
  btIdFinder: "",
  btFlag: false,
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
    self.btTipTrigger = null;

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
            ? 300
            : self.btTipWidth,
        positions:
          self.btTipPosition == null || self.btTipPosition == undefined
            ? "right"
            : self.btTipPosition,
        strokeStyle:
          self.btTipStrokeStyle == null || self.btTipStrokeStyle == undefined
            ? "#cacaca"
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
            : self.btTipShadow,
        shadowColor:
          self.btTipShadowColor == null || self.btTipShadowColor == undefined
            ? "#ccc"
            : self.btTipShadowColor,
        padding:
          self.btTipPadding == null || self.btTipPadding == undefined
            ? 10
            : self.btTipPadding,
        shadowOffsetX:
          self.btTipShadowOffsetX == null ||
            self.btTipShadowOffsetX == undefined
            ? 3
            : self.btTipShadowOffsetX,
        shadowOffsetY:
          self.btTipShadowOffsetY == null ||
            self.btTipShadowOffsetY == undefined
            ? 3
            : self.btTipShadowOffsetY,
        shadowBlur:
          self.btTipShadowBlur == null || self.btTipShadowBlur == undefined
            ? 8
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
      if (btObj.btFlag) {
        $(self.btTipDiv).btOn();
        btObj.btFlag = false;
      }
    };
  },
  btToolTipAd: function (pageId, label) {
    var modelPageId = 31;
    var versionPageId = 104;
    var picPageId = 55;
    var camp = new btObj.bindCommonBT();
    if (btObj.btIdFinder.attr("id") == "camp-model-info-tooltip") {
      camp.btTipContent = "$('.camp-model-info-content').html()";
      camp.btTipWidth = 230;
      if (pageId == modelPageId) {
        Common.utils.trackAction(
          "CTNonInteractive",
          "SponsoredLink_Shown",
          "ModelPage_ToolTip_d",
          label
        );
        Common.utils.trackAction(
          "CTNonInteractive",
          "Model_Page_Tooltip",
          "Dealer_Link_shown",
          zoneNameForModelVersion + "," + modelName
        );
      } else if (pageId == versionPageId) {
        Common.utils.trackAction(
          "CTNonInteractive",
          "SponsoredLink_Shown",
          "VersionPage_ToolTip_d",
          label
        );
        Common.utils.trackAction(
          "CTNonInteractive",
          "Version_Page_Tooltip",
          "Dealer_Link_shown",
          zoneNameForModelVersion + "," + modelName
        );
      } else {
        Common.utils.trackAction(
          "CTNonInteractive",
          "SponsoredLink_Shown",
          "PIC_ToolTip_d",
          label
        );
        Common.utils.trackAction(
          "CTNonInteractive",
          "Model_Page_Tooltip",
          "Dealer_Link_shown",
          zoneNameForModelVersion + "," + modelName
        );
      }
    } else if (btObj.btIdFinder.attr("id") == "nocamp-model-info-tooltip") {
      camp.btTipContent = "$('.nocamp-model-info-content').html()";
      camp.btTipTrigger = ["click"];
      if (pageId == modelPageId) {
        Common.utils.trackAction(
          "CTNonInteractive",
          "SponsoredLink_Shown",
          "ModelPage_ToolTip_d",
          label
        );
      } else if (pageId == versionPageId) {
        Common.utils.trackAction(
          "CTNonInteractive",
          "SponsoredLink_Shown",
          "VersionPage_ToolTip_d",
          label
        );
      } else {
        Common.utils.trackAction(
          "CTNonInteractive",
          "SponsoredLink_Shown",
          "PIC_ToolTip_d",
          label
        );
      }
    } else if (btObj.btIdFinder == "#addNewPQ") {
      camp.btTipContent = "$('.addcartabtext').html()";
      camp.btTipWidth = 230;
      camp.btTipPosition = ["right"];
    } else if (btObj.btIdFinder.hasClass("average-info-tooltip")) {
      camp.btTipContent = "$(this).siblings('.average-info-content').html()";
      camp.btTipWidth = 210;
      camp.btTipTrigger = ["hover"];
      if (btObj.btIdFinder.hasClass("dealer-locator")) {
        camp.btTipPosition = ["top"];
        camp.btTipWidth = 160;
        camp.btTipShadowOffsetX = -5;
      }
    } else if (btObj.btIdFinder.attr("id") == "gst-est-tooltip") {
      camp.btTipContent = "$('.gst-est-tooltip-content').html()";
      camp.btTipWidth = 230;
      camp.btTipPosition = ["left"];
    } else if (btObj.btIdFinder.attr("id") == "insurance-tooltip") {
      camp.btTipContent = "$('.insurance-tooltip-content').html()";
      camp.btTipWidth = 230;
      camp.btTipPosition = ["right"];
    } else if (btObj.btIdFinder.attr("id") == "gst-tooltip") {
      camp.btTipContent = "$('.gst-tooltip-content').html()";
      camp.btTipWidth = 230;
      camp.btTipPosition = ["left"];
    }

    camp.btCall();
  },
  registerEventsClass: function () {
    $(".class-ad-tooltip").on("mouseover", function () {
      var element = $(this);
      btObj.btIdFinder = element;
      var pageId = $(this).data("assigned-id");
      var label = $(this).data("label");
      btObj.btToolTipAd(pageId, label);
      btObj.btSelector.btOn();
      if (
        window.registerCampaignEvent &&
        element.attr("id") == "camp-model-info-tooltip"
      ) {
        var btContentElement = $("#emi-container").find(".bt-content");
        var btContentModel = $("#modelEmi").find(".bt-content");
        if (
          btContentElement.length > 0 &&
          btContentElement.has("[campaigncta]")
        ) {
          btContentElement
            .find("[campaigncta]")
            .removeAttr("data-campaign-event");
          window.registerCampaignEvent(btContentElement[0]);
        }
        if (btContentModel.length > 0 && btContentModel.has("[campaigncta]")) {
          btContentModel
            .find("[campaigncta]")
            .removeAttr("data-campaign-event");
          window.registerCampaignEvent(btContentModel[0]);
        }
      }
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
  btObj.registerEventsClass();
});

/* Button Animation Code Starts Here */
var btnAnimation = {
  windowHt: $(window).height(),
  scrollPosition: 0,
  targetScroll: "",

  animateButton: function () {
    $(".hvr-animate-btn")
      .addClass("animate-btn-once")
      .delay(1000)
      .queue(function (next) {
        $(this).removeClass("animate-btn-once");
        next();
      });
  },
  animateBtnCall: function () {
    try {
      btnAnimation.animateButton();
    } catch (e) { }
  },
  registerEvents: function () {
    $(window).on("load", function () {
      btnAnimation.animateBtnCall();
    });
    $(window).one("scroll", function () {
      btnAnimation.animateBtnCall();
    });
    $(window).on("keydown", function (e) {
      btnAnimation.scrollPosition = $(window).scrollTop();
      if (e.keyCode == 40) {
        btnAnimation.targetScroll = $(".show-target").offset().top;
        btnAnimation.animateBtnCall();
        if (
          btnAnimation.targetScroll <
          btnAnimation.scrollPosition + $(window).height()
        ) {
          delete btnAnimation.animateButton;
        }
      }
    });
  }
};

if ($(".hvr-animate-btn").is(":visible")) {
  btnAnimation.registerEvents();
}

/* Form Shake Animation Code Starts Here */
function ShakeFormView(targetFormElement) {
  targetFormElement
    .addClass("shake-form")
    .delay(1000)
    .queue(function (next) {
      $(this).removeClass("shake-form");
      next();
    });
}
/* Form Shake Animation Code Ends Here */

function ShowNestedPanel(targetElement) {
  targetElement.addClass("nav-li-active");
  targetElement
    .find(".top-nav-nested-panel")
    .show()
    .addClass("show-nested-panel");
  $("body").addClass("nested-panel-open");
  Common.utils.lockPopup();
  targetElement.find("img.lazy").lazyload();
}

function HideNestedPanel(targetElement) {
  targetElement.removeClass("nav-li-active");
  targetElement
    .find(".top-nav-nested-panel")
    .hide()
    .removeClass("show-nested-panel");
  $("body").removeClass("nested-panel-open");
  if (!(Location.is_ie && $("#gb-window").is(":visible")) || !Location.is_ie) {
    Common.utils.unlockPopup();
  }
}
$(document).ready(function () {
  //Added by Meet Shah on 10/8/16
  // To handle hash link behaviour on /used/cars-for-sale
  if (window.location.pathname == "/used/cars-for-sale/") {
    $(".uc-rv-nested-right-panel .nested-rt-column:first-child a").click(
      function (event) {
        window.location.hash = "kms=0-&year=0-&budget=0-4";
        window.location.reload();
        event.preventDefault
          ? event.preventDefault()
          : (event.returnValue = false); // To handle ie
      }
    );
    $(".uc-rv-nested-right-panel .nested-rt-column:nth-child(2) a").click(
      function (event) {
        window.location.hash = "kms=0-&year=0-&budget=4-8";
        window.location.reload();
        event.preventDefault
          ? event.preventDefault()
          : (event.returnValue = false); // To handle ie
      }
    );
  }
  //Added by Meet Shah on 7/8/16
  //To populate latest articles in new menu under "Reviews & News".
  //IIFE used to not pollute global scope.
  (function ($, ko) {
    var viewModel = new latestArticles();
    var articlesLoaded = false;
    var getPromise;
    var reviewMenuItem = document.querySelector(
      '.js-main-navbar-link[data-link="reviews-news"]'
    );
    function latestArticles() {
      var self = this;
      self.articles = ko.observableArray();
    }

    if (typeof HoverIntent === "function") {
      HoverIntent(
        reviewMenuItem,
        function () {
          var params = {
            contenttypes: "1,2,8,6,19,22",
            applicationid: 1,
            totalRecords: 3
          };
          getPromise = $.get("/api/Article/LatestArticlesGist/", params);
          getHandler();
        },
        function () {
          return false;
        }
      ).options({ interval: 200 });
    }

    function getHandler() {
      getPromise.done(function (data) {
        viewModel.articles(data);
        if (!articlesLoaded) {
          ko.applyBindings(
            viewModel,
            document.getElementById("latest-articles")
          );
          bindNewHeaderArticleEvents();
          articlesLoaded = true;
        }
      });
    }
  })($, ko);

  $("#cw-top-navbar li.navbar-primary-link:nth-child(4)").hoverIntent({
    over: function () {
      if ($("#specialsAds .sponsored-dummy-class").length <= 0)
        SponsoredNavigation.showSponsoredNavigation(2, 1);
      setTimeout(function () {
        var modelName = $("#specialsAds .sponsored-text-title");
        var totalModel = modelName.length;
        for (var i = 0; i < totalModel; i++) {
          Common.utils.trackAction(
            "CTNonInteractive",
            "SponsoredNavigation_d",
            modelName[i].textContent.trim() + "_shown",
            "Specials"
          );
        }
      }, 1000);
    },
    out: function () {
      return false;
    },

    interval: 200
  });
  $("#navSpecials").click(function (event) {
    if (
      $(event.target).hasClass("specialCarDropDown") ||
      $(event.target)
        .parent()
        .hasClass("specialCarDropDown")
    ) {
      if (!$("#navSpecials ul li").hasClass("sponsoredLi")) {
        SponsoredNavigation.showSponsoredNavigation(2, 1);
      }
      setTimeout(function () {
        var modelName = $("#navSpecials .sponsoredLi");
        if ($("#navSpecials a").hasClass("open")) {
          var totalModel = modelName.length;
          for (var i = 0; i < totalModel; i++) {
            Common.utils.trackAction(
              "CTNonInteractive",
              "SponsoredNavigation_d",
              modelName[i].textContent.split("Ad")[0].trim() + "_shown",
              "Specials"
            );
          }
        }
      }, 1000);
    }
  });

  // $(".global-search-new")
  //   .children("div")
  //   .addClass("common-global-search");
  // GetGlobalSearchCampaigns.registerEvents(
  //   GetGlobalSearchCampaigns.platform.Desktop
  // );
});

var globalSearchAdTracking = {
  targetModelName: "",
  featuredModelIdPrev: 0,
  featuredModelName: "",
  adPosition: 0,

  trackData: function (result) {
    var sponsorIndex = 0;
    var sponsoredObj = result
      .filter(function (suggestion, index) {
        if (suggestion && suggestion.id && suggestion.id.indexOf("sponsor") > 0) {
          sponsorIndex = index;
          return true;
        }
        return false;
      })[0].id.split("|");
    globalSearchAdTracking.adPosition = sponsorIndex + 1;
    var sponsoredModelId = parseInt(sponsoredObj[1].split(":")[1]);
    globalSearchAdTracking.targetModelName = result[sponsorIndex - 1].label;
    globalSearchAdTracking.featuredModelName = result[sponsorIndex].label;

    if (globalSearchAdTracking.featuredModelIdPrev != sponsoredModelId) {
      globalSearchAdTracking.featuredModelIdPrev = sponsoredModelId;
      Common.utils.trackAction(
        "CTNonInteractive",
        "SearchResult_Ad",
        "New_Shown",
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

// Get demilited string for Object
function GetDelimitedText(data, delimiter) {
  var delimitedString = "";
  if (typeof data === "object") {
    Object.keys(data).forEach(function (key) {
      var value = data[key];
      if (value) {
        delimitedString = delimitedString + (key + "=" + value) + delimiter;
      }
    });
  }
  if (delimitedString.endsWith(delimiter)) {
    delimitedString = delimitedString.substring(
      0,
      delimitedString.length - delimiter.length
    );
  }
  return delimitedString;
}

function toggleAdvertiseDisplay() {
  if(document.getElementById("advertiseblk").style.display=="block") {
      document.getElementById("advertiseblk").style.display="none";
      document.getElementById("advertisebg").style.display="none";
  } else {
      document.getElementById("advertiseblk").style.display="block";
      document.getElementById("advertisebg").style.display="block";
  }
}