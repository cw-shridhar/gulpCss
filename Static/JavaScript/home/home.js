$(document).ready(function () {
    myFunction();
    var makeId = document.getElementById("make_main").dataset.value;
    var modelId = document.getElementById("model_main").dataset.value;
    GetMMVData.getMakesForM();
    document.getElementById("ucity").value = GetCookieByName("cookie_city");
});

var GetMMVData = {
    getMakeUrl: function () {
        return "/api/v2/makes/?shouldSortByPopularity=true";
    },
    getModelUrl: function (makeId) {
        return "/api/v1/models/?type=new&application=3&makeId=" + makeId;
    },
    getMakesForM: function () {
        var url = GetMMVData.getMakeUrl();
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "GET",
                url: url,
                headers: { 'ServerDomain': 'CarWale' },
                success: function (response) {
                    var popular_label = "<li class='listGroupTitle'>Popular Brands</li>";
                    var other_label = "<li class='listGroupTitle'>Other Brands</li>";
                    $(popular_label).appendTo("#make-list");
                    $.each(response, function (key, item) {
                        if (key == 10) {
                            $(other_label).appendTo("#make-list");
                        }
                        var li_data =
                            "<li data-value=" +
                            response[key].makeId +
                            " data-mask=" +
                            response[key].maskingName +
                            " data-testing-id=" +
                            response[key].maskingName +
                            " onclick='mmvDropdown.selectMakeForM(this)'>" +
                            response[key].makeName +
                            "</li>";
                        $(li_data).appendTo("#make-list");
                    });
                },
                error: function (error) {
                    reject(error);
                },
            });
        });
    },
    getModelsForM: function (makeId) {
        var url = GetMMVData.getModelUrl(makeId);
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "GET",
                url: url,
                headers: { 'ServerDomain': 'CarWale' },
                success: function (response) {
                    $.each(response, function (key, item) {
                        var li_data =
                            "<li data-value=" +
                            response[key].modelId +
                            " data-mask=" +
                            response[key].maskingName +
                            " data-testing-id=" +
                            response[key].maskingName +
                            " data-makemaskingname=" + response[key].makeMaskingName +
                            " onclick='mmvDropdown.selectModelForM(this)'>" +
                            response[key].modelName +
                            "</li>";
                        $(li_data).appendTo("#model-list");
                    });
                },
                error: function (error) {
                    reject(error);
                },
            });
        });
    },
};
var mmvDropdown = {
    removeAllChildren: function (parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    },
    selectMakeForM: function (obj) {
        var makeField = document.getElementById("make_main");
        makeField.innerHTML = obj.textContent;
        makeField.dataset.value = obj.dataset.value;
        makeField.dataset.mask = obj.dataset.mask;
        var modelField = document.getElementById("model_main");
        modelField.innerHTML = "Select Model";
        modelField.dataset.value = "";
        modelField.dataset.mask = "";
        var makeModelSelect = document.getElementById("make-mode-select");
        makeModelSelect.innerHTML = "Select Model";
        var makeVal = document.getElementById("make_val");
        makeVal.innerHTML = obj.textContent;
        var makeId = obj.dataset.value;
        mmvDropdown.removeAllChildren(document.getElementById("model-list"));
        GetMMVData.getModelsForM(makeId);
        document.getElementById("make_popup").style.display = "none";
        document.getElementById("model_popup").style.display = "block";
    },
    selectModelForM: function (obj) {
        var modelField = document.getElementById("model_main");
        modelField.innerHTML = obj.textContent;
        modelField.dataset.value = obj.dataset.value;
        modelField.dataset.mask = obj.dataset.mask;
        var makeField = document.getElementById("make_main");
        makeField.dataset.mask = obj.dataset.makemaskingname;
        document.getElementById("main_drp").style.display = "none";
        document.getElementById("blackOutWindow").style.display = "none";
    },
};

function show_makes() {
    document.getElementById("make_val").innerHTML = "Select Car";
    document.getElementById("main_drp").style.display = "block";
    document.getElementById("make_popup").style.display = "block";
    document.getElementById("blackOutWindow").style.display = "block";
}
function show_models() {
    var makeId = document.getElementById("make_main").dataset.value;
    if (!makeId) {
        return;
    }
    document.getElementById("make_val").innerHTML = document.getElementById("make_main").textContent;
    document.getElementById("main_drp").style.display = "block";
    document.getElementById("model_popup").style.display = "block";
    document.getElementById("blackOutWindow").style.display = "block";
}

function back_btn() {
    if (document.getElementById("make_popup").style.display == "block") {
        document.getElementById("make_popup").style.display = "none";
        document.getElementById("main_drp").style.display = "none";
        document.getElementById("blackOutWindow").style.display = "none";
    }
    if (document.getElementById("model_popup").style.display == "block") {
        document.getElementById("model_popup").style.display = "none";
        document.getElementById("make_popup").style.display = "block";
        var makeVal = document.getElementById("make_val");
        makeVal.innerHTML = "Select Car";
    }
}

function goToModelPage() {
    event.preventDefault();
    var valid = false;
    var makeMaskingName = $("#make_main").attr("data-mask");
    var modelMaskingName = $("#model_main").attr("data-mask");
    if (
        (makeMaskingName === undefined ||
            makeMaskingName === null ||
            makeMaskingName === "")
        &&
        (modelMaskingName === undefined ||
            modelMaskingName === null ||
            modelMaskingName === "")
    ) {
        alert("Please Select Make and Model");
    }
    else if (
        modelMaskingName === undefined ||
        modelMaskingName === null ||
        modelMaskingName === ""
    ) {
        alert("Please Select Model");
    }
    else {
        valid = true;
    }

    if (valid) {
        var modelUrl = "/" + makeMaskingName + "-cars/" + modelMaskingName + "/";
        window.location.href = modelUrl;
    }
}

function ncp_finlink2() {
    var budget = document.budgetform["budget"].value;
    if (budget == "") {
        url = "/new-cars/by-price/0lakh-500lakh";
    } else if (budget == "40") {
        url = "/new-cars/by-price/40lakh-500lakh";
    } else {
        var split = budget.split("-");
        url = "/new-cars/by-price/" + split[0] + "lakh-" + split[1] + "lakh";
    }
    top.location.href = url;
}

function _setcity(city) {
    document.getElementById("city").value = city;
}

function moveToUsedCarsByCityPageGo() {
    var city = document.getElementById("ucity").value;
    if (city) {
        SetCookieInDays("cookie_city", city, 14);
        city = city.replace(/\ /g, "-");
        if (city != "" && city != "Select City") {
            city1 = city;
        } else {
            city1 = "all";
        }
        try {
            _gtm_push(
                "Homepage|Top Tab",
                "Used Cars",
                "All Used Cars|city," + city1,
                "event top tab"
            );
        } catch (e) { }
        top.location.href = "/" + "buy-used-cars" + "/" + city + "/" + "c/";
    } else {
        city = "Select City";
        if (city != "" && city != "Select City") {
            city1 = city;
        } else {
            city1 = "all";
        }
        try {
            _gtm_push(
                "Homepage|Top Tab",
                "Used Cars",
                "All Used Cars|city," + city1,
                "event top tab"
            );
        } catch (e) { }
        top.location.href = "/" + "buy-used-cars/";
    }
}

function moveToCertified() {
    var cityv = document.getElementById("ucity").value;
    document.getElementById("city").value = cityv;
    if (cityv != "Select City" && cityv != "") {
        try {
            SetCookieInDays("cookie_city", cityv, 14);
        } catch (e) { }
        cityv = cityv.replace(/\ /g, "-");
        try {
            _gtm_push(
                "Homepage|Top Tab",
                "Used Cars",
                "Certified Cars|city," + cityv,
                "event top tab"
            );
        } catch (e) { }
        document.findusedcar_form.submit();
    } else {
        try {
            _gtm_push(
                "Homepage|Top Tab",
                "Used Cars",
                "Certified Cars|city, all",
                "event top tab"
            );
        } catch (e) { }
        top.location.href = "/" + "buy-used-cars" + "/" + "certified/";
    }
}


function _bynewcar4(e, t) {
    for (var r = document.querySelectorAll(".ver_reviewBtn4"), o = 0; o < r.length; o++) r[o].className = "ver_reviewBtn4";
    document.getElementById(t).className = "ver_reviewBtn4 active";
    try {
        SetCookieInDays("new_make", e, 365);
        SetCookieInDays("new_model", t, 365);
    } catch (e) { }
    for (var r = document.querySelectorAll(".ver_reviewCntd"), o = 0; o < r.length; o++) r[o].style.display = "none";
    document.getElementById(e).style.display = "block"
}

function _bynewcarused(e, t) {
    for (var r = document.querySelectorAll(".ver_reviewBtn1_used"), o = 0; o < r.length; o++)
        r[o].className = "ver_reviewBtn1_used";
    document.getElementById(t).className = "ver_reviewBtn1_used active";
    for (var r = document.querySelectorAll(".ver_reviewCnt_used"), o = 0; o < r.length; o++)
        r[o].style.display = "none";
    document.getElementById(e).style.display = "block";
}

function myFunction() {
    var p1 = GetCookieByName("new_make");
    var p2 = GetCookieByName("new_model");
    if (p1 == "") {
        p1 = "rvwtop";
    }
    if (p2 == "") {
        p2 = "bnewk";
    }
    _bynewcar4(p1, p2);
}

function _bynewcartt(contentId, btnId) {
    for (
        var r = document.querySelectorAll(".ttver_sdr_btn"), o = 0;
        o < r.length;
        o++
    )
        r[o].className = "ttver_sdr_btn";
    document.getElementById(btnId).className = "ttver_sdr_btn active";
    for (
        var r = document.querySelectorAll(".ttver_sl_cnt"), o = 0;
        o < r.length;
        o++
    )
        r[o].className = "ttver_sl_cnt";
    document.getElementById(contentId).className = "ttver_sl_cnt ttver_opacity";
}


function _bynewcar1(contentId, tabId) {
    for (
        var r = document.querySelectorAll(".ver_reviewBtn11"), o = 0;
        o < r.length;
        o++
    )
        r[o].className = "ver_reviewBtn11";
    document.getElementById(tabId).className = "ver_reviewBtn11 active";
    for (
        var r = document.querySelectorAll(".ver_reviewCnt1"), o = 0;
        o < r.length;
        o++
    )
        r[o].style.display = "none";
    document.getElementById(contentId).style.display = "block";
}

function _bynewcarl(contentId, viewMoreLinkId) {
    for (
        var r = document.querySelectorAll(".ver_reviewBtn1s"), o = 0;
        o < r.length;
        o++
    )
        r[o].className = "ver_reviewBtn1s";
    document.getElementById(viewMoreLinkId).className = "ver_reviewBtn1s active";
    for (
        var r = document.querySelectorAll(".ver_reviewCnts"), o = 0;
        o < r.length;
        o++
    )
        r[o].style.display = "none";
    document.getElementById(contentId).style.display = "block";
}

var totalar_is = ["ttslide_1", "ttslide_2"],
    totalar_div = ["tts_cnt_1", "tts_cnt_2"];
setInterval(function () {
    for (
        var contentId = document.querySelectorAll(".ttver_sdr_btn"), btnId = 0;
        btnId < contentId.length;
        btnId++
    ) {
        var r = contentId[btnId].className;
        if ("ttver_sdr_btn active" == r) {
            var o = contentId[btnId].id,
                n = totalar_is.indexOf(o);
            (n += 1),
                (n = 2 == n ? 0 : n),
                _bynewcartt(totalar_div[n], totalar_is[n]);
            break;
        }
    }
}, 5e3);

function photopopup(vid) {
    document.getElementById("silifilm").style.display = "block";
    document.getElementById("photopopupcont").style.display = "block";
    document.getElementById("video_frame").src =
        "https://www.youtube.com/embed/" + vid + "?autoplay=1";
}

function closephotopopup() {
    document.getElementById("silifilm").style.display = "none";
    document.getElementById("photopopupcont").style.display = "none";
    document.getElementById("video_frame").src = "";
}

function handleToTop() {
    // 300 px from bottom
    if (($(document).height() - (document.documentElement.scrollTop + $(window).height())) < 300) {
        document.getElementById("toTop").classList.add("border-none", "background-none", "scrollerstop");
    } else if (document.documentElement.scrollTop > 200) {
        // else where
        $("#toTop").fadeIn("slow");
        document.getElementById("toTop").classList.add("border-none", "background-none", "scroller");
    } else {
        // at top
        $("#toTop").fadeOut("slow");
    }
}

window.onscroll = function () {
    handleToTop();
};

$("#toTop").click(function () {
    $("html, body").animate({
        scrollTop: 0
    }, "slow");
});
