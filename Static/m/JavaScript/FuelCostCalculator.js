let mileageContainer = document.querySelector(".calculator-container select");
let mileageValue = mileageContainer && mileageContainer.value;
let distance = 15;
let perLiterPrice = 100;
const priceElement = document.querySelector(
  ".calculator-container span.totalPrice"
);

document.querySelectorAll(".calculator-container input").forEach(e => {
  e.onkeydown = function (e) {
    return (
      (e.keyCode > 95 && e.keyCode < 106) || //key codes for 0 - 9 on numpad
      (e.keyCode > 47 && e.keyCode < 58) || //key codes for 0 - 9 on number row
      e.keyCode === 8 ||
      e.keyCode === 190 ||
      e.keyCode === 39 ||
      e.keyCode === 37
      //key code for backspace , '.' and left right arrow keys
    );
  };
});

function changeVersion() {
  mileageValue = parseFloat(this.value);
  updatePrice();
}

function changeDistance() {
  distance = parseFloat(this.value, 10);
  updatePrice();
}

function changePricePerLiter() {
  perLiterPrice = parseFloat(this.value, 10);
  updatePrice();
}

function updatePrice() {
  let price = Math.floor((30 * distance * perLiterPrice) / mileageValue);
  price = !price ? 0 : price;
  priceElement.innerHTML = Common.utils.formatNumeric(price);
}
