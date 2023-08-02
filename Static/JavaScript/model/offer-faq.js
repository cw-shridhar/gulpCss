if (!GetCookieByName("cookie_ct_city")) {
    document.querySelector(".faq-model-offer-link")?.addEventListener("click", e => {
        e.preventDefault();
        locationPopup.showLocationPopUp(true, false, () => {
            if (GetCookieByName("cookie_ct_city")) {
                location.href = `${location.pathname}offers/`;
            }
        })
    })
}