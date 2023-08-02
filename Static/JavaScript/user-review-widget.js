const moreBtn = document.querySelector(".usr-reviews > button.read-more");
if (moreBtn) {
  moreBtn.addEventListener("click", function () {
    document.querySelector(".usr-reviews > div.inner-content").style.height = "auto";
    this.style.display = "none";
  });
}
