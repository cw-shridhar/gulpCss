function showIconsContainer() {
    $(".socialIconsList").slideToggle(200);
}
function toggleIconsContainer() {
    if (document.getElementById("socialIconsListid").style.display == "block") {
        document.getElementById("socialIconsListid").style.display = "none";
    } else {
        document.getElementById("socialIconsListid").style.display = "block";
    }
}
