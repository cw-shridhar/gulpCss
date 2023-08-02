function showTab(event, tabName) {
  var tabcontent = document.getElementsByClassName("ct_tabs");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[parseInt(i, 10)].style.display = "none";
  }
  var tablinks = document.getElementsByClassName("tablinks");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[parseInt(i, 10)].classList.remove("activetab");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("activetab");
}