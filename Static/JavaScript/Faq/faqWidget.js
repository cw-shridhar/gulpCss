function decryptByDESModeCBC(ciphertext) {
    let key = 'cartrade-faqpage-que-ans';
    let iv = '312a44de';

    ciphertext = decodeURIComponent(ciphertext);
    let keyBytes = CryptoJS.enc.Utf8.parse(key);
    let ivBytes = CryptoJS.enc.Utf8.parse(iv);

    let decrypted = CryptoJS.TripleDES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyBytes, {
        iv:ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

let decryptedFaqs = decryptByDESModeCBC(encryptedFaqs);
let faqs = JSON.parse(decryptedFaqs);
const model = JSON.parse(document.querySelector("#model-details").innerHTML);
const {
    ModelName: modelName,
    ModelMaskingName: modelMaskingName,
    MakeName: makeName,
    MakeMaskingName: makeMaskingName
} = model;
const questionElements = document.querySelectorAll(".faq-question");
const faqContainer = document.querySelector(".faq-widget-container");
const canonicalElement = document.querySelector("link[rel='canonical']");
const h1TitleElement = document.querySelector(".heading-h1");

const getElementFromHtml = html => {
    const answerElement = document.createElement("div");
    answerElement.innerHTML = html;
    return answerElement.firstChild;
}

const handleQuestionClick = event => {
    const questionElement = event.currentTarget;
    if (!questionElement.nextElementSibling?.classList.contains("faq-answer")) {
        const answerElement = getElementFromHtml(faqs[questionElement.dataset.index].answer);
        if (answerElement) {
            answerElement.classList.add("display-none");
            faqContainer.insertBefore(answerElement, questionElement.nextSibling);
        }
    }
    let nextElementSibling = questionElement.nextElementSibling;
    nextElementSibling.classList.toggle("display-none");
    questionElement.querySelector("img").classList.toggle("rotate-upside-down");
    const { question, questionUrl } = faqs[questionElement.dataset.index];
    const clickedQuestionUrl = `/${makeMaskingName}-cars/${modelMaskingName}/faqs/${questionUrl}/`;
    window.history.replaceState(null, null, clickedQuestionUrl);
    document.title = `${question} | ${modelName} FAQ`;
    canonicalElement.href = clickedQuestionUrl;
    h1TitleElement.textContent = question;
}

questionElements.forEach((questionElement, index) => {
    questionElement.addEventListener("click", handleQuestionClick);
    questionElement.dataset.index = index;
});
