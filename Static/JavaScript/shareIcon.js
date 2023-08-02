__share_open = false;
__last_hash_change = "";
__share_data = {};
__last_list_id = 0;
__last_share_element = "";
function sh_share_open(id, list_id) {
  try {
    if (list_id == null) {
      list_id = __last_list_id;
    }
    if (id == "") {
      id = __last_share_element;
    }

    if (!__share_open) {
      __share_data = $("#contact_seller_button_" + list_id).data();
      $(id + "_share-container")
        .append($("#sh_share_id"))
        .addClass("openshr");
      prepare_share_icon("#OT");
      $("#overlay-glass-share").show();
      $("#sh_share_id").addClass("open");
      __share_open = true;
      if (location.search.indexOf("show=bigimages") == -1) {
        __hash_change = false;
        window.location.hash = "Share";
        setTimeout(function () {
          __hash_change = true;
        }, 400);
      }
      if (
        $("#sh_share_id").offset().top + 102 >
        $(window).scrollTop() + $(window).height()
      ) {
        $(window).scrollTop($(window).scrollTop() + 110);
      }
      $("body").addClass("ver-hidden");
    } else {
      __share_open = false;
      $(id + "_share-container").removeClass("openshr");
      $("#overlay-glass-share").hide();
      $("#sh_share_id").removeClass("open");
      $("body").removeClass("ver-hidden");
    }

    __last_share_element = id;
  } catch (e) {
    console.log("ERROR: Share icon issue " + e);
  }
}

function prepare_share_icon(from_event) {
  //try{
  mob_agt = navigator.userAgent;
  if (
    mob_agt.match(/iPhone/i) ||
    mob_agt.match(/iPad/i) ||
    mob_agt.match(/iPod/i)
  ) {
    var sms_param = "&";
  } else {
    var sms_param = "?";
  }

  if (__share_data != null) {
    var sharedUrl = "https://www.cartrade.com" + __share_data["tiny"];
    sharing_meta_title =
      "Hey, Check out this " +
      __share_data["mfgyear"] +
      " " +
      __share_data["make"] +
      " " +
      __share_data["model"] +
      " on CarTrade.com on " +
      sharedUrl +
      " ";
    sharing_meta_title_tw =
      "Hey, Check out this " +
      __share_data["mfgyear"] +
      " " +
      __share_data["make"] +
      " " +
      __share_data["model"] +
      " on CarTrade.com on";
    content =
      "https://m.facebook.com/sharer.php?t=" +
      sharing_meta_title +
      "&u=" +
      sharedUrl;
    $("#bsh_fb").attr("href", content);
    content =
      "https://twitter.com/share?text=" +
      sharing_meta_title_tw +
      "&url=" +
      sharedUrl;
    $("#bsh_tw").attr("href", content);
    content = "whatsapp://send?text=" + sharing_meta_title;
    $("#bsh_wp").attr("href", content);
    content =
      "mailto:?subject=CarTrade.com - Check out this Car!&body=Hey,%0D%0A%0D%0AI found a superb car on CarTrade.com. Check it out here: " +
      sharedUrl +
      "%0D%0A%0D%0ABest wishes,";
    $("#bsh_mile").attr("href", content);
    content = "sms:" + sms_param + "body=" + sharing_meta_title;
    $("#bsh_sms").attr("href", content);
  }
}
