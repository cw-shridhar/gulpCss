/**
 * Accordion title must have a class called "js-accordion-title"
 * Its next sibling element will act as container for the accordion content and will expand/collapse
 * Refer => CarTrade\Views\Partials\m\_ExpertReview.cshtml
 */
const accordionTitles = document.querySelectorAll(".js-accordion-title");
if (accordionTitles) {
	accordionTitles.forEach(title => {
		title.addEventListener("click", (e) => {
			title.classList.toggle("active");
			const accordionContent = title.nextElementSibling;
			if (accordionContent.style.maxHeight) {
				accordionContent.style.maxHeight = null;
			} else {
				accordionContent.style.maxHeight = `${accordionContent.scrollHeight + 1}px`;
			}
		}, false);
	});
}
