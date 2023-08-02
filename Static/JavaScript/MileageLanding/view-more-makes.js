const viewMore=document.querySelector(".js-view-more");
const makeList=document.querySelector(".js-make-item");
viewMore.addEventListener("click", ()=>{
    makeList.classList.toggle("display-none");
    viewMore.textContent = viewMore.textContent == "View More" ? "View Less" : "View More";
});
