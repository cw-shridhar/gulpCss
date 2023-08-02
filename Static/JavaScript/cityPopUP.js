function do_city_filter(parentdiv, txt) {
    try {
        //txtFletter=txt.charAt(0);

        var data_pos = 1;
        $("." + parentdiv + " li[data-title]").attr('data-pos1', '');
        if (txt != '') {
            txt = txt.toLowerCase();
            txt = txt.replace(/ /g, '-');
            $("." + parentdiv + ' .citylistopt').hide();
            $("." + parentdiv + " li[data-title^='" + txt + "']").show();
            $("." + parentdiv + " li[data-title1^='" + txt + "']").show();
            $("." + parentdiv + " li[data-title2^='" + txt + "']").show();

            $("." + parentdiv + " li[data-title^='" + txt + "']").each(function (e) {
                $(this).attr('data-pos1', data_pos++);
            })

            /*$("."+parentdiv+" li[data-title1^='"+txt+"']").each(function(e){
             $(this).attr('data-pos1',data_pos++);
             })*/

            /*$("."+parentdiv+" li[data-title2^='"+txt+"']").each(function(e){
             $(this).attr('data-pos1',data_pos++);
             })*/
        } else {
            $("." + parentdiv + ' .citylistopt').show();

        }


        var r_topcities = 0;
        var r_othercities = 0;
        $('.' + parentdiv + ' li[data-root="root_topcities"]').each(function () {
            if ($(this).css('display') != 'none') {
                r_topcities++;
            }
        });

        if (r_topcities > 0) {
            $('.' + parentdiv + ' .root_topcities').show();
        } else {
            $('.' + parentdiv + ' .root_topcities').hide();
        }

        $('.' + parentdiv + ' li[data-root="root_othercities"]').each(function () {
            if ($(this).css('display') != 'none') {
                r_othercities++;
            }
        });

        if (r_othercities > 0) {
            $('.' + parentdiv + ' .root_othercities').show();
        } else {
            $('.' + parentdiv + ' .root_othercities').hide();
        }

        if (r_topcities == 0 && r_othercities == 0) {
            $('.nocityfound').show();
        } else {
            $('.nocityfound').hide();
        }

        //$('.citylistopt:first-child input').focus();
        if (parentdiv != 'filterpopup') {
            $('.cityList').animate({
                scrollTop: 0
            }, 'slow');
        } else {
            $('.filterpopup').animate({
                scrollTop: 0
            }, 'slow');
        }
    } catch (e) { }
}

function closepopup() {
    document.getElementById("tranbg").style.display = "none";
}

function citybox_event_call(option) {
    var cityName = option.value;
    var cityId = option.id;
    document.getElementById("tranbg").style.visibility = "hidden";
    var currentTime = new Date();
    currentTime.setDate(currentTime.getDate() + 30);
    var currentDomain = window.location.hostname;
    if (currentDomain !== "localhost") {
        currentDomain.replace("www.", "");
        currentDomain = "." + currentDomain;
    }
    document.cookie = "cd-city-id = " + cityId + ";expires=" + currentTime + ";path=/;domain=" + currentDomain;
    document.cookie = "cd-city-ct = " + cityName + ";expires=" + currentTime + ";path=/;domain=" + currentDomain;
    var pathName = window.location.pathname;
    if (window.location.pathname.includes(".html")) {
        pathName = "/buy-used-cars/";
    }
    window.location.href = window.location.protocol + "//" + window.location.host + pathName + '?gcc=1';
}

function formcookiesCityPopUp() {
    var cookies = {};
    if (document.cookie && document.cookie != '') {
        var split = document.cookie.split(';');
        for (var i = 0; i < split.length; i++) {
            var name_value = split[i].split("=");
            name_value[0] = name_value[0].replace(/^ /, '');
            cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
        }
    }
    return cookies;
}
function bindCities(data) {
    var clist = '';
    for (var index in data.PopularCities) {
        clist += '<li class="citylistopt" data-title="' + data.PopularCities[index].CityMaskingName + '" data-title1="new" \
        data-title2="'+ data.PopularCities[index].CityMaskingName + '" data-root="root_topcities"> \
        <label> <span class="radiobtn"> \
              <input name="city" value="'+ data.PopularCities[index].CityName + '" id="' + data.PopularCities[index].CityId + '" type="radio" \
                 onclick="citybox_event_call(this);" > \
           </span> <span> \
              '+ data.PopularCities[index].CityName + ' </span> </label> \
     </li>';
    }
    document.getElementById('popular_cities').innerHTML = clist;
    var clist = '';
    for (var index in data.OtherCities) {
        clist += '<li class="citylistopt" data-title="' + data.OtherCities[index].CityMaskingName + '" data-title1="' + data.OtherCities[index].CityMaskingName + '" \
        data-title2="'+ data.OtherCities[index].CityMaskingName + '" data-root="root_topcities"> \
        <label> <span class="radiobtn"> \
              <input name="city" value="'+ data.OtherCities[index].CityName + '" id="' + data.OtherCities[index].CityId + '" type="radio" \
                 onclick="citybox_event_call(this)" > \
           </span> <span> \
              '+ data.OtherCities[index].CityName + ' </span> </label> \
     </li>';
    }
    clist += "<li> </li>";
    clist += "<li> </li>";
    clist += "<li> </li>";
    clist += "<li> </li>";
    clist += "<li> </li>";
    document.getElementById('other_cities').innerHTML = clist;
}
function pl_openCitySelection() {
    $.ajax({
        url: '/buy-used-cars/api/getallcities/',
        type: 'get',
        contentType: "application/json",
        headers: { 'ServerDomain': 'CarWale' },
        success: function (data) {
            bindCities(data)
            document.getElementById("tranbg").style.display = "block";
        }
    });
}
$(document).ready(function () {
    // only for serach page
    if (!window.location.pathname.includes(".html")) {
        var cityIdInCookie = formcookiesCityPopUp()['cd-city-id'];
        if (cityIdInCookie) {
            document.getElementById("tranbg").style.display = "none";
        }
        else {
            //open city form and call city api
            pl_openCitySelection();
        }
    }
});