// JavaScript Document
//console.log("including social icons js");

function share_listings_buy_used_cars() {
  var x = document.getElementsByClassName("share_vdp");
  var list_ids = new Array();
  if (x.length) {
    var vdp_list_id = x[0].getAttribute("id");
    list_ids[0] = vdp_list_id;
    //console.log("vdp_list_id : "+vdp_list_id);
  } else {
    var x = document.getElementsByClassName("carlistblk");
    var list_ids = new Array();
    var j = 0;
    for (var i = 0; i < x.length; i++) {
      var asd = x[i].getAttribute("uniqueId");
      if (asd) {
        var zxc = asd.match(/(fl-){0,1}(d|D|s|S)(\d*)/);
        if (zxc) {
          list_ids[j] = zxc[0];
          j++;
        }
      }
    }
  }
  return list_ids;
}

function share_icons_display_buy_used_cars(sh_listings_id, page_nm) {
  var sh_listings_id;
  //console.log("sh id: "+sh_listings_id);

  $("#share_ul_id_" + sh_listings_id).removeClass("socialIcon");
  $(".socialIcon").hide();
  $("#share_ul_id_" + sh_listings_id).toggle();
  $("#share_ul_id_" + sh_listings_id).addClass("socialIcon");

  var asd = $("#share_ul_id_" + sh_listings_id).is(":visible");
}

function bind_social_share_icon(share_stage) {
  try {
    //Stage of share icon
    var share_stage;
    //console.log("Share stage : "+share_stage);

    // Storing listing ids of a page in an array
    var page_listings = share_listings_buy_used_cars();
    if (page_listings.length == 1) {
      var page_nm = "pg_vdp";
    } else {
      var page_nm = "pg_listings";
    }
    //console.log("page name : "+page_nm);

    // console view of meta data
    //console.log("page listings : "+page_listings);

    //appending share icon for all linstings in a page
    for (var i = 0; i < page_listings.length; i++) {
      var now_listing = page_listings[i];
      var sh_mfgyear = document
        .getElementById("show_social_icons_" + now_listing)
        .getAttribute("data-share-mfgyear");
      var sh_make = document
        .getElementById("show_social_icons_" + now_listing)
        .getAttribute("data-share-make");
      var sh_model = document
        .getElementById("show_social_icons_" + now_listing)
        .getAttribute("data-share-model");

      var sharing_meta_title_tw =
        "Hey, Check out this " +
        sh_mfgyear +
        " " +
        sh_make +
        " " +
        sh_model +
        " on CarTrade.com on";
      var sharing_meta_title_em = "CarTrade.com - Check out this Car!";

      var share_meta_url = document
        .getElementById("show_social_icons_" + now_listing)
        .getAttribute("data-share-tiny");

      var share_meta_description_em =
        "Hi,\n\nI found this superb car on www.cartrade.com - Check it out! " +
        share_meta_url +
        "\n\n\n\nThanks,\n\nwww.cartrade.com";
      var share_meta_description_em = share_meta_description_em.replace(
        /\n/g,
        "%0D%0A"
      );

      // console view of updated meta data
      //console.log("updated title tw"+ sharing_meta_title_tw);
      //console.log("updated url"+ share_meta_url);

      // Start of creating social media icons

      // styles related to all tags

      // div styles
      var share_div_style =
        "position:relative" +
        ";" +
        "right: 5px" +
        ";" +
        "z-index: 1" +
        ";" +
        "margin-top:5px" +
        ";" +
        "float:right" +
        ";" +
        "top:0px" +
        ";" +
        "right:0px" +
        ";";

      // image styles
      if (page_nm == "pg_vdp") {
        var share_img_style =
          "cursor: pointer" +
          ";" +
          "float: right" +
          ";" +
          "width:15px" +
          ";" +
          "height:auto" +
          ";" +
          "margin:5px 0" +
          ";";
      } else {
        var share_img_style =
          "cursor: pointer" +
          ";" +
          "float: right" +
          ";" +
          "width:18px" +
          ";" +
          "height:auto" +
          ";" +
          "margin:5px 0" +
          ";";
      }

      // ul styles
      if (page_nm == "pg_vdp") {
        var share_ul_style =
          "background: #fff" +
          ";" +
          "padding: 10px 10px 10px 10px" +
          ";" +
          "position:absolute" +
          ";" +
          "top:24px" +
          ";" +
          "left: -123px" +
          ";" +
          "clear: both" +
          ";" +
          "border:1px solid #ccc" +
          ";" +
          "border-radius:2px" +
          ";" +
          "display:none" +
          ";" +
          "overflow:hidden" +
          ";" +
          "float:right" +
          ";";
      } else {
        var share_ul_style =
          "background: #fff" +
          ";" +
          "padding: 10px 10px 10px 10px" +
          ";" +
          "position:absolute" +
          ";" +
          "top:24px" +
          ";" +
          "left: -120px" +
          ";" +
          "clear: both" +
          ";" +
          "border:1px solid #ccc" +
          ";" +
          "border-radius:2px" +
          ";" +
          "display:none" +
          ";" +
          "overflow:hidden" +
          ";" +
          "float:right" +
          ";";
      }

      // li styles
      var share_li_style =
        "float:left" +
        ";" +
        "list-style-type: none" +
        ";" +
        "width: 116px !important" +
        ";" +
        "margin-bottom: 12px" +
        ";" +
        "text-align:left" +
        ";";
      var share_li_style_lst =
        "float:left" +
        ";" +
        "list-style-type: none" +
        ";" +
        "width: 116px !important" +
        ";" +
        "text-align:left" +
        ";";
      //var share_li_style_hover = "float:left"+ ";"+ "list-style-type: none"+ ";"+ "width: 116px !important"+ ";"+ "margin-bottom: 12px"+ ";"+ "text-align:left"+ ";"+ "background:#eee"+ ";" ;

      // anchor styles
      var share_atag_style =
        "color: #0166ff" +
        ";" +
        "padding: 5px 5px 5px 5px !important" +
        ";" +
        "line-height: 24px" +
        ";" +
        "text-shadow: initial" +
        ";" +
        "font-weight: normal" +
        ";" +
        "padding: 0px" +
        ";" +
        "text-align: left" +
        ";" +
        "font-size: 15px !important" +
        ";" +
        "text-decoration: none" +
        ";" +
        "font-family: Verdana !important" +
        ";";

      // span styles
      var share_span_style_1 =
        "background-size: auto" +
        ";" +
        "height: 20px" +
        ";" +
        "line-height: normal" +
        ";" +
        "width: 20px" +
        ";" +
        "border-radius: 0px" +
        ";" +
        "display: inline-block" +
        ";" +
        "overflow: hidden" +
        ";" +
        "vertical-align: sub" +
        ";" +
        "background-image:url('" + window.CloudfrontCDNHostURL + "/images4/fb-email-twitter.png')" +
        ";" +
        "margin-right: 8px" +
        ";" +
        "background-position: center top" +
        ";";
      var share_span_style_2 =
        "background-size: auto" +
        ";" +
        "height: 20px" +
        ";" +
        "line-height: normal" +
        ";" +
        "width: 20px" +
        ";" +
        "border-radius: 0px" +
        ";" +
        "display: inline-block" +
        ";" +
        "overflow: hidden" +
        ";" +
        "vertical-align: sub" +
        ";" +
        "background-image:url('" + window.CloudfrontCDNHostURL + "/images4/fb-email-twitter.png')" +
        ";" +
        "margin-right: 8px" +
        ";" +
        "background-position: center center" +
        ";";
      var share_span_style_3 =
        "background-size: auto" +
        ";" +
        "height: 20px" +
        ";" +
        "line-height: normal" +
        ";" +
        "width: 20px" +
        ";" +
        "border-radius: 0px" +
        ";" +
        "display: inline-block" +
        ";" +
        "overflow: hidden" +
        ";" +
        "vertical-align: sub" +
        ";" +
        "background-image:url('" + window.CloudfrontCDNHostURL + "/images4/fb-email-twitter.png')" +
        ";" +
        "margin-right: 8px" +
        ";" +
        "background-position: center bottom" +
        ";";

      // div tag
      var share_div_new = document.createElement("div");
      //console.log("now_listing : "+now_listing);

      share_div_new.setAttribute("class", "share_linnk_icn");
      share_div_new.setAttribute("id", now_listing);
      share_div_new.setAttribute("style", share_div_style);
      share_div_new.addEventListener(
        "click",
        function () {
          share_icons_display_buy_used_cars(this.id, page_nm);
        },
        false
      );

      // img tag
      var share_img_new = document.createElement("img");

      if (page_nm == "pg_vdp") {
        var share_pic_color = "black";
      } else {
        var share_pic_color = "white";
      }
      //console.log(share_pic_color);

      if (share_pic_color == "black") {
        share_img_new.setAttribute(
          "src",
          `${window.CloudfrontCDNHostURL}/images4/share.png`
        );
      } else {
        share_img_new.setAttribute(
          "src",
          `${window.CloudfrontCDNHostURL}/images4/share-icon2-new.png`
        );
      }
      share_img_new.setAttribute("style", share_img_style);

      // ul tag
      var share_ul_new = document.createElement("ul");
      share_ul_new.setAttribute("style", share_ul_style);
      share_ul_new.setAttribute("id", "share_ul_id_" + now_listing);
      share_ul_new.setAttribute("class", "socialIcon widgetBox1");

      // Facebook Starts Here --------------------

      // li tag
      var share_li_new_1 = document.createElement("li");
      share_li_new_1.setAttribute("style", share_li_style);
      //share_li_new_1.addEventListener('mouseover', function() { share_li_new_1.setAttribute('style',share_li_style_hover);  });
      //share_li_new_1.addEventListener('mouseout', function() { share_li_new_1.setAttribute('style',share_li_style);  });

      // anchor tag
      var share_atag_new_1 = document.createElement("a");
      share_atag_new_1.setAttribute("style", share_atag_style);
      share_atag_new_1.setAttribute(
        "href",
        "https://www.facebook.com/sharer.php?u=" + share_meta_url
      );
      share_atag_new_1.setAttribute("target", "_blank");

      // span tag
      var span_new_1 = document.createElement("span");
      span_new_1.setAttribute("style", share_span_style_1);
      span_new_1.setAttribute("id", "share_span_id_1_" + now_listing);

      // Facebook End Here -------------------

      // Email Starts Here -------------------

      // li tag
      var share_li_new_2 = document.createElement("li");
      share_li_new_2.setAttribute("style", share_li_style);
      //share_li_new_2.addEventListener('mouseover', function() { share_li_new_2.setAttribute('style',share_li_style_hover);  });
      //share_li_new_2.addEventListener('mouseout', function() { share_li_new_2.setAttribute('style',share_li_style);  });

      // anchor tag
      var share_atag_new_2 = document.createElement("a");
      share_atag_new_2.setAttribute("style", share_atag_style);
      share_atag_new_2.setAttribute(
        "href",
        "mailto:?subject=" +
        sharing_meta_title_em +
        "&body=" +
        share_meta_description_em
      );
      share_atag_new_2.setAttribute("target", "_blank");

      // span tag
      var span_new_2 = document.createElement("span");
      span_new_2.setAttribute("style", share_span_style_2);
      span_new_2.setAttribute("id", "share_span_id_2_" + now_listing);

      // Email End Here -------------------

      // Twitter Starts Here -------------------

      // li tag
      var share_li_new_3 = document.createElement("li");
      share_li_new_3.setAttribute("style", share_li_style_lst);
      //share_li_new_3.addEventListener('mouseover', function() { share_li_new_3.setAttribute('style',share_li_style_hover);  });
      //share_li_new_3.addEventListener('mouseout', function() { share_li_new_3.setAttribute('style',share_li_style);  });

      // anchor tag
      var share_atag_new_3 = document.createElement("a");
      share_atag_new_3.setAttribute("style", share_atag_style);
      share_atag_new_3.setAttribute(
        "href",
        "https://twitter.com/share?text=" +
        sharing_meta_title_tw +
        "&url=" +
        share_meta_url
      );
      share_atag_new_3.setAttribute("target", "_blank");

      // span tag
      var span_new_3 = document.createElement("span");
      span_new_3.setAttribute("style", share_span_style_3);
      span_new_3.setAttribute("id", "share_span_id_3_" + now_listing);

      // Twitter End Here -------------------

      // appending tags

      share_atag_new_1.appendChild(span_new_1);
      share_li_new_1.appendChild(share_atag_new_1);
      share_ul_new.appendChild(share_li_new_1);

      share_atag_new_2.appendChild(span_new_2);
      share_li_new_2.appendChild(share_atag_new_2);
      share_ul_new.appendChild(share_li_new_2);

      share_atag_new_3.appendChild(span_new_3);
      share_li_new_3.appendChild(share_atag_new_3);
      share_ul_new.appendChild(share_li_new_3);

      share_div_new.appendChild(share_img_new);
      share_div_new.appendChild(share_ul_new);

      // final append to div id - included in all particular files
      //console.log("show_social_icons_"+now_listing);
      if (
        !document
          .getElementById("show_social_icons_" + now_listing)
          .innerHTML.trim()
      ) {
        document
          .getElementById("show_social_icons_" + now_listing)
          .appendChild(share_div_new);
      }

      // checking text after span does not repeat - even after ajax loading
      var fb = $("#" + now_listing + " ul li:nth-child(1) a")
        .first()
        .contents()
        .filter(function () {
          return this.nodeType == 3;
        })
        .text();

      var em = $("#" + now_listing + " ul li:nth-child(2) a")
        .first()
        .contents()
        .filter(function () {
          return this.nodeType == 3;
        })
        .text();

      var tw = $("#" + now_listing + " ul li:nth-child(3) a")
        .first()
        .contents()
        .filter(function () {
          return this.nodeType == 3;
        })
        .text();

      // appending text after the share media icons
      if (!fb) {
        var share_atag_text_1 = document.createTextNode("Facebook");
        var share_atag_child_1 = document.getElementById(
          "share_span_id_1_" + now_listing
        );
        share_atag_child_1.parentNode.appendChild(share_atag_text_1);
      }

      if (!em) {
        var share_atag_text_2 = document.createTextNode("Email");
        var share_atag_child_2 = document.getElementById(
          "share_span_id_2_" + now_listing
        );
        share_atag_child_2.parentNode.appendChild(share_atag_text_2);
      }

      if (!tw) {
        var share_atag_text_3 = document.createTextNode("Twitter");
        var share_atag_child_3 = document.getElementById(
          "share_span_id_3_" + now_listing
        );
        share_atag_child_3.parentNode.appendChild(share_atag_text_3);
      }
    }
  } catch (e) {
    console.log("errorr", e);
  }
}

$(document).ready(function () {
  bind_social_share_icon("js file");
});
