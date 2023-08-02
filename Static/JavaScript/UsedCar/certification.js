function certshowhideDiv(Id) {
    try {
        for (i = 1; i < 20; i++) {
            if (i != Id) {
                try { document.getElementById("inspection-collapsible-item" + i).style.display = "none"; } catch (e) {}
                try { document.getElementById('certTitleTab' + i).className = "inspection-description"; } catch (e) { }
                $("#upDownArrow" + i).removeClass('up-down-arrow270').addClass("up-down-arrow90");
            }
        }

        if (document.getElementById("inspection-collapsible-item" + Id).style.display == "block") {
            document.getElementById("inspection-collapsible-item" + Id).style.display = "none";
            $("#upDownArrow" + Id).removeClass('up-down-arrow270').addClass("up-down-arrow90");
            //$('#certExpandiv'+Id).slideUp(300);
            try {
                document.getElementById('certTitleTab' + Id).className = "inspection-description";
            } catch (e) {
                console.log(e);
            }
        } else {
            document.getElementById("inspection-collapsible-item" + Id).style.display = "block";
            $("#upDownArrow" + Id).removeClass('up-down-arrow90').addClass("up-down-arrow270");
            try {
                document.getElementById('certTitleTab' + Id).className = "inspection-description active";
            } catch (e) {
                console.log(e);
            }

        }

    } catch (e) {
        console.log(e);
        a = document.createElement("div");
        a.innerHTML = e;
        document.body.appendChild(a);
    }
    $(window).scrollTop($('#certTitleTab' + Id).offset().top);
    //setTimeout(function(){ window.location.hash='#certTitleTab'+Id;},20);
    //setTimeout(function(){ __hash_change=true;},30);
    vt = document.getElementById('certTitleTab' + Id).innerHTML;
    var StrippedString = vt.replace(/(<([^>]+)>)/ig, "");
    StrippedString = StrippedString.trim()
    StrippedString = StrippedString.replace('&amp;', '&');
    vaction = "Certification" + "|" + StrippedString;
    vurl = document.URL
    _gtm_push("VDP|Certification", vaction, vurl, "eventUsed Car Detail Page|" + StrippedString);

    return false;
}

var offset_val = [];