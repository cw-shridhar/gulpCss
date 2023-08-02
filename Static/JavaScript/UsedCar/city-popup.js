/*global formcookies, initializeFilters */
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

        if (r_topcities === 0 && r_othercities === 0) {
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
$(document).ready(function () {
    function setUsedCarLocationCookies({ cityId, cityName })
    {
        var currentTime = new Date();
        currentTime.setDate(currentTime.getDate() + 30);
        var currentDomain = window.location.hostname;
        if (currentDomain !== "localhost") {
            currentDomain.replace("www.", "");
            currentDomain = "." + currentDomain;
        }
        document.cookie = "cd-city-id = " + cityId + ";expires=" + currentTime + ";path=/;domain=" + currentDomain;
        document.cookie = "cd-city-ct = " + cityName + ";expires=" + currentTime + ";path=/;domain=" + currentDomain;
    }

    function handleGlobalLocationChange(event)
    {
        if(!event || isNaN(event.cityId))
        {
            return;
        }
        setUsedCarLocationCookies(event);
        const url = new URL(location.href);
        url.searchParams.set("city", event.cityId);
        history.replaceState(null, '', url);
        initializeFilters(USED_FILTER_ENUM.CITY)
    }

    events.subscribe("globalCityChanged", handleGlobalLocationChange);
    var cookies = formcookies();
    if(!!locationPopup && (!cookies || !cookies['cd-city-id']))
    {
        locationPopup.showLocationPopUp();
    }
});

