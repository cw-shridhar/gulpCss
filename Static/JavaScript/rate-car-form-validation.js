var submitButton = document.querySelector(".review-submit-btn");
var formTextArea = document.querySelector(".review-details");
var formTitle = document.querySelector(".review-title");
var detailName = document.querySelector(".detail-name");
var mailId = document.querySelector(".mail-id");
var mailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var questions = document.querySelectorAll(".question");

var formFeilds = [formTitle, detailName, mailId];
formFeilds = formFeilds.concat(Array.prototype.slice.call(questions));
submitButton.addEventListener("click", function (event) {
  var successCount = 0;
  event.preventDefault();
  for (var i = 0; i < formFeilds.length; i++) {
    if (formFeilds[i].value.length === 0) {
      formFeilds[i].nextElementSibling.classList.add("error-message");
      formFeilds[i].classList.add("error-state-input");
    } else if (
      formFeilds[i] === mailId &&
      !formFeilds[i].value.match(mailRegex)
    ) {
      formFeilds[i].nextElementSibling.classList.add("error-message");
      formFeilds[i].classList.add("error-state-input");
    } else {
      formFeilds[i].nextElementSibling.classList.remove("error-message");
      formFeilds[i].classList.remove("error-state-input");
      successCount++;
    }
  }
  if (successCount === formFeilds.length && formTitle.value.length >= 5 && formTextArea.textLength >= 100) {
    submitRatingClick();
  }
});
