function _bynewcar(e, t) {
    for (var r = document.querySelectorAll(".ver_reviewBtn1"), o = 0; o < r.length; o++)
        r[o].className = "ver_reviewBtn1";
    document.getElementById(t).className = "ver_reviewBtn1 active";
    for (var r = document.querySelectorAll(".ver_reviewCnt"), o = 0; o < r.length; o++)
        r[o].style.display = "none";
    document.getElementById(e).style.display = "block";
}
