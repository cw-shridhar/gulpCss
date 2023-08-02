/*global leadFormPopup.click_camp_call */
let variantIdElement = document.getElementById("variantId_leadFormRedirection");
let variantId;
if (variantIdElement) {
    variantId = variantIdElement.getAttribute("data-variantId");
}
const input = document.getElementById(variantId);
leadFormPopup.click_camp_call(variantId, input.getAttribute("data-propertyId"));
