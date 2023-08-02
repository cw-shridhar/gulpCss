function chngeoffer() {
  var sellectprice = document.getElementById("sofferprice").value;
  if (sellectprice > 0) {
    $("#selected_offer").show();
    document.getElementById("selectedoffer_price").innerHTML = numtoinr(
      sellectprice
    );
    document.getElementById("negotiateprice").value = sellectprice;
    document.getElementById("error_price").style.color = "#56586a";
    $("#negotiatesubmit").data("negotiateAmount", sellectprice);
  }
}

function close_negotiate_popup() {
  $("#negotiate-popup-script").hide();
}

function getExistingOffer(
  listingid,
  carName,
  price,
  priceNumeric,
  rank,
  slotId,
  originId,
  deliveryCity
) {
  deliveryCity = deliveryCity || 0;
  var category = window.location.href.includes(".html")
    ? "UsedCarDetails"
    : "UsedCarSearch";
  analytics.trackAction(
    "CWInteractive",
    category,
    "NegotiateLinkClicked",
    "profileId=" + listingid + "|originId=61|platformid=302"
  );
  var __url =
    "/buy-used-cars/api/stocks/" + listingid + "/negotiate/aggregate/";
  try {
    $.ajax({
      url: __url,
      cache: false,
    })
      .done(function (data) {
        try {
          document.getElementById("nmakeModelDetails").innerText = carName;
          document.getElementById("nag_carprice").innerText = price;
          document.querySelector("#negotiate-popup-script").style.display =
            "block";
          var nmax_price = Number(data["maxPriceOffered"]);
          if (nmax_price > 0) {
            nmax_price = numtoinr(nmax_price);
            document.getElementById("mprice").innerHTML = nmax_price;
            $("#maxprice").show();
          } else {
            $("#maxprice").hide();
            $("#mprice").text("-");
          }
          if (data["totalOffersSubmitted"] > 0) {
            $("#ntotal_price").text(data["totalOffersSubmitted"] + " People");
          } else {
            $("#ntotal_price").text("-");
          }
          var vl = "";
          if (typeof makeOfferUtils !== "undefined") {
            var optionList = makeOfferUtils.stockPriceNegotiationOptions(
              priceNumeric
            );
            vl += "<option hidden=''>Select your offer</option>";
            for (var i = 0; i < optionList.length; i++) {
              vl +=
                "<option value='" +
                optionList[i] +
                "' data-testing-id='negotiation-popup-options'>" +
                numtoinr(optionList[i]) +
                "</option>";
            }
          }
          $("#carlistid").val(listingid);
          $("#negotiatesubmit").data("listingid", listingid);
          $("#negotiatesubmit").data("rank", rank);
          $("#negotiatesubmit").data("slotid", slotId);
          $("#negotiatesubmit").data("originid", originId);
          $("#negotiatesubmit").data("deliverycityid", deliveryCity);
          $("#sofferprice").val("");
          $("#sofferprice").html(vl);
          $("#loadingmain").hide();
          $("#selected_offer").hide();

          $("#negotiateprice").val("");
          document.getElementById("error_price").style.color = "#56586a";
        } catch (e) {
          console.log(e);
        }
      })
      .fail(function (xhrObj) {
        console.log("2 max_price");
        $("#maxprice").hide();
        $("#mprice").text("-");
        $("#ntotal_price").text("-");
      });
  } catch (e) {
    alert("second " + e);
  }
}

function numtoinr(vl) {
  var num = vl.toString();
  var part1 = "";
  var part2 = "";
  var part3 = "";
  if (num.length > 3) {
    part1 = num.substr(num.length - 3, 3);
    num = num.substr(0, num.length - 3);
  } else {
    part1 = num;
    num = "";
  }
  if (num.length > 2) {
    part2 = num.substr(num.length - 2, 2);
    num = num.substr(0, num.length - 2);
  }
  if (num.length > 2) {
    part3 = num.substr(num.length - 2, 2);
    num = num.substr(0, num.length - 2);
  }
  vstr = "";
  if (num != "") {
    vstr = vstr + num + ",";
  }

  if (part3 != "") {
    vstr = vstr + part3 + ",";
  }
  if (part2 != "") {
    vstr = vstr + part2 + ",";
  }
  vstr = vstr + part1;
  return vstr;
}
