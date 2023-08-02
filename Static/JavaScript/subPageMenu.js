function handleSlideMenu (){
    var slideMenuElement = document.getElementById("slidemenubg");
    if(!slideMenuElement)
    {
        return ;
    }
    slideMenuElement.style.display === "none" ? slideMenuElement.style.display = "block" : slideMenuElement.style.display = "none";
}
