
var acc = document.getElementsByClassName("faq-accordion");
var i;
if(acc.length > 0 ){
    acc[0].nextElementSibling.style.maxHeight = acc[0].nextElementSibling.scrollHeight + "px";
}
for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("current");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }

    });
}

function viewallfaq() {
    $("#viewallfaq").hide();
    $(".showtab").show();
}