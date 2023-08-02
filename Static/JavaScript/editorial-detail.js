jQuery(function ($) {
  $("img.lazy").lazyload();
});

function openSocial() {
  console.log("social media");
  var popup = document.getElementById("icon-list");
  if (popup.style.display == "block") {
    popup.style.display = "none";
  } else {
    popup.style.display = "block";
  }
}
