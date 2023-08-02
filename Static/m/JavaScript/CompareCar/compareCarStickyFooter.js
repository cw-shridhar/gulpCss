function setfooter() {
    var bodyy = 0;
    var smartbanner_h = 85;
    setTimeout(function() {
        if ($("div").hasClass("smartbanner__container")) {
            bodyy = $("body").height() + smartbanner_h;
            console.log("form with smartbanner " + bodyy);
        } else {
            bodyy = $("body").height();
        }
        stick_footer(bodyy);
    }, 500);
}
function stick_footer(bodyy_height) {
    var body = bodyy_height;
    var windw = $(window).height();
    if (body < windw) {
        $("#footer").addClass("sticky");
    } else {
        if ($("#footer").hasClass("sticky")) {
            $("#footer").removeClass("sticky");
        }
    }
}
var lazy_loadu = setInterval("lazy_loadu_fun()", 1000);
function lazy_loadu_fun() {
    try {
        if (typeof jQuery != "undefined" && (document.readyState == "interactive" || document.readyState == "complete")) {
            $(document).on("focus", "input, textarea", function() {
                if ($("#footer").hasClass("sticky")) {
                    var fixed = document.querySelector(".sticky")
                      , distanceFromTop = fixed.getBoundingClientRect().top;
                    console.log("distanceFromTop : " + distanceFromTop);
                    fixed.style.top = distanceFromTop + "px";
                    fixed.style.bottom = "auto";
                }
            });
            setTimeout(function() {
                body_height = $("body").height();
                $('.smartbanner__close').click(function() {
                    console.log("you closed sticky , i am calling stick_footer fun again");
                    stick_footer(body_height);
                });
            }, 500);
            setTimeout(function() {
                setfooter();
            }, 100);
            clearInterval(lazy_loadu);
        }
    } catch (e) {}
}
