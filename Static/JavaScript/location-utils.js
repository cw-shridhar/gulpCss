const locationUtils = (function(){

    showToolTip = (address) => {
        const tootTipContentWrapper = createHtmlElement("div", ["location-tooltip__content", "pt-2", "pb-2", "pl-4", "pr-4", "border-radius-3", "pointer-events-none", "position-absolute", "white-space-nowrap", "z-index-10"], "");
        tootTipContentWrapper.appendChild(createHtmlElement("p", ["font-11", "font-regular", "color-white", "mb-1"], "Current Location"));
        tootTipContentWrapper.appendChild(createHtmlElement("p", ["font-13", "font-regular", "color-white", "font-semibold", "mb-0"], address));
        tootTipContentWrapper.appendChild(createHtmlElement("div", ["location-tooltip__arrow-icon", "position-absolute", "overflow-hidden"], ""));

        const toolTipWrapper = createHtmlElement("div", ["position-relative", "display-inline-block"], "");
        toolTipWrapper.appendChild(tootTipContentWrapper);

        const toolTipContainer = document.querySelector(".js-tooltip-container");
        toolTipContainer.appendChild(toolTipWrapper);

        setTimeout(() => {
            toolTipContainer.removeChild(toolTipWrapper)
        }, 3000);

        sessionStorage.removeItem("pageRefereshOnLocationUpdate");
    }

    createHtmlElement = (element, classNames, content) => {
        const htmlElement = document.createElement(element);
        htmlElement.classList.add(...classNames);
        htmlElement.innerHTML = content;
        return htmlElement;
    }

    return { showToolTip };
})();
