window.addEventListener("DOMContentLoaded", function (e) {
    AddVerticalLine();
});
function AddVerticalLine(){
    var $lis = $(".nearbyCitiesList li");
    var length = $lis.length;
    // Add class to first half:
    $lis.slice(0, Math.floor(length / 2)).addClass("rightBorder");
}