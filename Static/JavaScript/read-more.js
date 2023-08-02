let readMoreBtn = document.getElementsByClassName("read-more")[0];
let h1description = document.getElementsByClassName("description")[0];

function toggleDescription() {
    if (h1description.classList.contains("description-expand")) {
        // Collapse the description
        readMoreBtn.textContent = "Read More";
        h1description.classList.remove("description-expand");
    } else {
        // Expand the description
        readMoreBtn.textContent = "View Less";
        h1description.classList.add("description-expand");
    }
}

function toggleRead(readMoreElement) {
    let readBtn = document.getElementById("read-more");
    let seoTextContent = document.getElementById("seotext-content");

    if(readMoreElement) {
      readBtn = readMoreElement;
      seoTextContent = readMoreElement.previousElementSibling;
    }

    if (seoTextContent.classList.contains("seotext_read_less")) {
      // expand
      seoTextContent.classList.remove("seotext_read_less");
      readBtn.classList.add("active");
      readBtn.textContent = "View Less";
    } else {
      // collapse
      seoTextContent.classList.add("seotext_read_less");
      readBtn.classList.remove("active");
      readBtn.textContent = "+More";
    }
}
