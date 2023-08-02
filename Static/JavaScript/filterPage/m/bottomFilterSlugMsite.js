$(document).ready(function () {
  $(".des_read_more").click(function () {
    if ($(".des_read_more").text() == "Read More") {
      $("#read_more_des").removeClass("min_cls");
      $("#read_more_des").addClass("max_cls");
      $(".des_read_more").text("Read Less");
      $(".des_read_more").removeClass("min_read");
      $(".des_read_more").addClass("max_read");
    } else {
      $("#read_more_des").removeClass("max_cls");
      $("#read_more_des").addClass("min_cls");
      $(".des_read_more").text("Read More");
      $(".des_read_more").removeClass("max_read");
      $(".des_read_more").addClass("min_read");
    }
  });
  $(".des_read_more_crosslink").click(function () {
    $("#read_more_des_cross").removeClass("min_cls");
    $("#read_more_des_cross").addClass("max_cls");
    $(".read_less_cross").css("display", "block");
    $(".des_read_more_crosslink").css("display", "none");
  });
  $(".read_less_cross").click(function () {
    $("#read_more_des_cross").removeClass("max_cls");
    $("#read_more_des_cross").addClass("min_cls");
    $(".des_read_more_crosslink").css("display", "inline-block");
    $(".read_less_cross").css("display", "none");
  });
});

function _bynewcar(e, t) {
  for (
    var r = document.querySelectorAll(".ver_reviewBtn1"), o = 0;
    o < r.length;
    o++
  )
    r[o].className = "ver_reviewBtn1";
  document.getElementById(t).className = "ver_reviewBtn1 active";
  for (
    var r = document.querySelectorAll(".ver_reviewCnt"), o = 0;
    o < r.length;
    o++
  )
    r[o].style.display = "none";
  document.getElementById(e).style.display = "block";
}
