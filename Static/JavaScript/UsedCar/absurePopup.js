function closeAbsurePopup() {
  clearPopupHistory();
  $("#popup__absurescript").hide();
}

function openAbsurePopup() {
  $("#popup__absurescript").show();
}

window.addEventListener("popstate", function() {
  close_negotiate_popup();
});

