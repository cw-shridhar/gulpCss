function pl_changecitypop(option) {
    try {
        var cityName = option[option.selectedIndex].value;
        var cityId = option[option.selectedIndex].id;
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
    catch (error) { }

}
function bindCities(data) {
    var clist = '';
    for (var index in data.PopularCities) {
        clist += '<option value="' + data.PopularCities[index].CityName + '" id="' + data.PopularCities[index].CityId + '">' + data.PopularCities[index].CityName + '</option>';
    }
    document.getElementById('pl_topcities_list').innerHTML = clist;
    var clist = '';
    for (var index in data.OtherCities) {
        clist += '<option value="' + data.OtherCities[index].CityName + '" id="' + data.OtherCities[index].CityId + '">' + data.OtherCities[index].CityName + '</option>';
    }
    document.getElementById('pl_othercities_list').innerHTML = clist;
}
function pl_openCitySelection() {
    $.ajax({
        url: '/buy-used-cars/api/getallcities/',
        type: 'get',
        contentType: "application/json",
        headers: { 'ServerDomain': 'CarWale' },
        success: function (data) {
            bindCities(data)
            $('body').css('overflow', 'hidden');
            $('body,#lddet_more').css('margin-right', '17px');
            $('#silifilm').show();
            document.querySelector("#selectcityfilm").style.display = "block";
        }
    });
}
function closeSelectCity() {
    document.getElementById('selectcityfilm').style.display = "none";
    $('#silifilm').hide();

    $('body').css('overflow', 'auto');
    $('body').css('margin-right', '0px');
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

window.onload = function () {
    // only for serach page
    if (!window.location.pathname.includes(".html")) {
        var cityIdInCookie = formcookiesCityPopUp()['cd-city-id'];
        if (!cityIdInCookie) {
            //open city form and call city api
            pl_openCitySelection();
        }
    }
}

