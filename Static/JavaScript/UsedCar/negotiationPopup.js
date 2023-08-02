function chngeoffer() {
    var sellectprice = document.getElementById('sofferprice').value;
    if (sellectprice > 0) {
        $('#selected_offer').show();
        var listcarprice = document.getElementById('negotiate_carprice').value;
        document.getElementById('selectedoffer_price').innerHTML = numtoinr(sellectprice);
        document.getElementById('negotiateprice').value = sellectprice;
    }
}

function close_negotiate_popup() {
    clearPopupHistory();
    $('#negotiate_popup-script').hide();
    $("#idbybody").css({
        "overflow": "visible"
    });
}

function negotiate_openpopup(listingid, carName, price, rank, platformId, slotId, originid, deliverycityid, virtualPhoneNumber, makeYear) {
    var clickedLabel =
      originid === "94"
        ? "PriceDropNegotiateLinkClicked"
        : "NegotiateLinkClicked";
    deliverycityid = deliverycityid||0;
    var category = window.location.href.includes(".html") ? "UsedCarDetails" : "UsedCarSearch";
    analytics.trackAction("CWInteractive", category, clickedLabel, "profileId=" + listingid + "|originId="+originid+"|platformid=301");
    var __url = "/buy-used-cars/api/stocks/" + listingid + "/negotiate/aggregate/";
    try {

        $.ajax({
            url: __url,
            cache: false
        }).done(function(data) {
            try {
                $('#negotiate_popup-script').show();
                var nmax_price = Number(data['maxPriceOffered']);
                if (nmax_price > 0) {
                    nmax_price = numtoinr(nmax_price);
                    document.getElementById('mprice').innerHTML = nmax_price;
                    $('#maxprice').show();
                } else {
                    $('#maxprice').hide();
                    $('#mprice').text('-');
                }
                if (data['totalOffersSubmitted'] > 0) {
                    $('#ntotal_price').text(data['totalOffersSubmitted'] + ' People');
                } else {
                    $('#ntotal_price').text('-');
                }
                var optionListHtml = "";
                if (typeof makeOfferUtils!=="undefined"){
                    var optionList = makeOfferUtils.stockPriceNegotiationOptions(
                      price
                    );
                    optionListHtml += "<option hidden=''>Select your offer</option>";
                    for (i = 0; i < optionList.length; i++) {
                        optionListHtml +="<option value='" +
                        optionList[i] +
                        "' data-testing-id='negotiation-popup-options'>" +
                        numtoinr(optionList[i]) +
                        "</option>";
                    }
                }
                $('#carlistid').val(listingid);
                $('#negotiate_carprice').val(price);
                $('#negotiatesubmit').attr("data-listingid", listingid);
                $("#negotiatesubmit").attr("data-rank", rank);
                $("#negotiatesubmit").attr("data-platform", platformId);
                $("#negotiatesubmit").attr("data-slot", slotId);
                $("#negotiatesubmit").attr("data-originid", originid);
                $("#negotiatesubmit").attr("data-virtualphonenumber", virtualPhoneNumber);
                $("#negotiatesubmit").attr("data-carname", makeYear + " " + carName);
                $("#negotiatesubmit").attr(
                  "data-deliverycityid",
                  deliverycityid
                );
                $('#nmakeModelDetails').text(carName);
                $("#sofferprice").val('');
                $('#sofferprice').html(optionListHtml);
                $('#nag_carprice').text(numtoinr(price));
                $('#loadingmain').hide();
                $('#selected_offer').hide();

                $('#negotiateprice').val('');
                document.getElementById('error_price').style.color = '#56586a';
                setPopupHistory("#NP");
            } catch (e) {
                console.log(e);
            }

        }).fail(function(xhrObj) {
            console.log('2 max_price');
            $('#maxprice').hide();
            $('#mprice').text('-');
            $('#ntotal_price').text('-');
        });

    } catch (e) { alert("second " + e); }
}

function numtoinr(vl) {
    num = vl.toString();
    part1 = "";
    part2 = "";
    part3 = "";
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

window.addEventListener('popstate',function (){
    if(!window.location.href.includes("sell-used-car"))
    {
        close_negotiate_popup();
    }
})