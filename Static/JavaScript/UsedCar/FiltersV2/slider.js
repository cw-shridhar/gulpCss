let slider = (function () {
    $(document).ready(function () {
        setSliderSelectors();
        addSliderRelatedEventListener();
    });
    let offset = 16;
    let leftPosition, rightPosition, leftOffset, rightOffset;
    let sliderRange, sliderBar, sliderLeftBtn, sliderRightBtn,
        min, max, sliderTooltip, minValueInput, maxValueInput, maxWidth,
        sliderId, slider;
    const ERROR_MESSAGES = {
        price: "Invalid Amount",
        age: "Invalid Age Input",
        default: "Invalid Data"
    };
    let INPUT_TYPES = {
        "MIN": "min",
        "MAX": "max"
    };

    let SLIDER_SELECTORS = {
        RANGE: ".js-slider-range",
        BAR: ".js-slider-bar",
        LEFT_BTN: ".js-slider-selection-btn__left",
        RIGHT_BTN: ".js-slider-selection-btn__right",
        TOOLTIP: ".js-selection-circle-value-text",
        MIN_INPUT: ".js-min-value-input",
        MAX_INPUT: ".js-max-value-input",
        MIN_TEXT: ".js-min-value-text",
        MAX_TEXT: ".js-max-value-text",
        SLIDER: ".js-slider"
    };

    let SLIDER_STYLE_CLASSES = {
        OVERLAY: "slider-top-button",
        UNDERLAY: "slider-bottom-button"
    };

    function validateSliderElements() {
        return !!sliderLeftBtn && !!sliderRightBtn && !!sliderRange && !!sliderBar;
    }

    function setSelectorsBySliderId({ sliderId }) {
        slider = $(`${SLIDER_SELECTORS.SLIDER}[data-id='${sliderId}']`);
        if (!slider) {
            return;
        }
        setSliderElementsBySlider(slider);
    }

    function setSliderSelectors() {
        sliderRange = $(SLIDER_SELECTORS.RANGE);
        sliderBar = $(SLIDER_SELECTORS.BAR);
        sliderLeftBtn = $(SLIDER_SELECTORS.LEFT_BTN);
        sliderRightBtn = $(SLIDER_SELECTORS.RIGHT_BTN);
        sliderTooltip = $(SLIDER_SELECTORS.TOOLTIP);
        minValueInput = $(SLIDER_SELECTORS.MIN_INPUT);
        maxValueInput = $(SLIDER_SELECTORS.MAX_INPUT);
    }

    function setSliderProperties() {
        if (!validateSliderElements()) {
            return;
        }
        maxWidth = sliderBar.innerWidth();
        leftPosition = sliderLeftBtn.position().left;
        rightPosition = sliderRightBtn.position().left;
        leftOffset = sliderLeftBtn.offset().left;
        rightOffset = sliderRightBtn.offset().left;
    }

    function getMinMaxFromRange({ range }) {
        let defaultValue = { slider: { min, max }, input: { min, max: null } };
        if (!range) {
            return defaultValue;
        }
        let rangeArray = range.split("-");
        if (rangeArray.length >= 1) {
            let minValue = parseInt(rangeArray[0], 10);
            minValue = isNaN(minValue) ? min : minValue;
            let sliderMax, inputMax;
            if (rangeArray.length >= 2) {
                inputMax = parseInt(rangeArray[1], 10);
                sliderMax = isNaN(inputMax) ? max : inputMax;
                inputMax = isNaN(inputMax) ? null : inputMax;
            }
            return { slider: { min: minValue, max: sliderMax }, input: { min: minValue, max: inputMax } }
        }
        return defaultValue;
    }

    function setMinMax() {
        if (!sliderLeftBtn || !sliderRightBtn) {
            return;
        }
        min = parseInt(sliderLeftBtn.attr("data-min"), 10);
        max = parseInt(sliderRightBtn.attr("data-max"), 10);
        min = isNaN(min) ? 0 : min;
        max = isNaN(max) ? 0 : max;
    }

    function getRangeOfSlider({ sliderId }) {
        if (!sliderId) {
            return "";
        }
        slider = $(`${SLIDER_SELECTORS.SLIDER}[data-id='${sliderId}']`);
        sliderRange = slider.find(SLIDER_SELECTORS.RANGE);
        let sliderRangeValue = sliderRange.attr("data-range");
        return sliderRangeValue === "0-" ? "" : sliderRangeValue;
    }


    function setSlider({ sliderId, shouldReset, sliderRangeValue }) {
        let filterContent = $("#filt_price");
        let rightOffset;
        if (filterContent) {
            rightOffset = filterContent.innerWidth() - 2 * offset;
        }
        else {
            rightOffset = 200;
        }
        sliderBar.css({ width: `${rightOffset}px` });
        sliderRightBtn.css({ left: `${rightOffset}px` });
        setSelectorsBySliderId({ sliderId });
        setMinMax();
        let rangeValue;
        if (shouldReset) {
            rangeValue = sliderRangeValue;
            sliderRange.attr("data-range", rangeValue)
        }
        else {
            rangeValue = sliderRange.attr("data-range");
        }
        let minMaxObj = getMinMaxFromRange({ range: rangeValue });
        if (!minMaxObj) {
            return;
        }
        let { slider, input } = minMaxObj;
        initializeSlider({ sliderRange: slider });
        if (input) {
            minValueInput.val(input.min);
            maxValueInput.val(input.max);
        }
    }

    function initializeSlider({ sliderRange }) {
        if (!sliderRange) {
            return;
        }
        setMinMax();
        setSliderProperties();
        let newLeft = sliderRange.min * (maxWidth - offset) / (max - min) + offset;
        newLeft = newLeft > rightPosition ? rightPosition : newLeft;
        let newRight = sliderRange.max * (maxWidth - offset) / (max - min) + offset;
        newRight = newRight < leftPosition ? leftPosition : newRight;
        processLeft({ newLeft });
        processRight({ newRight });
    }

    function processLeft({ newLeft, shouldSetRange }) {
        if (isNaN(newLeft)) {
            newLeft = offset;
        }
        newLeft = newLeft > rightPosition ? rightPosition : newLeft;
        newLeft = newLeft > maxWidth ? maxWidth : newLeft;
        newLeft = newLeft < offset ? offset : newLeft;
        leftOffset = leftOffset + newLeft - leftPosition;
        leftPosition = newLeft;
        sliderLeftBtn.css({ left: newLeft });
        let width = rightPosition - newLeft;
        sliderRange.css({ left: newLeft, width });
        if (shouldSetRange) {
            let range = [leftPosition - offset, rightPosition - offset]
            processRangeValues({ range, shouldSetMin: true });
        }
    }

    function processRangeValues({ range, shouldSetMin }) {
        if (!validateSliderElements() || !Array.isArray(range) || range.length < 2) {
            return;
        }
        let sliderRangeValue = sliderRange.attr("data-range");
        if (shouldSetMin) {
            let minValue = Math.round(range[0] / (maxWidth - offset) * (max - min));
            sliderLeftBtn.find(SLIDER_SELECTORS.MIN_TEXT).text(minValue);
            sliderLeftBtn.attr("data-val", minValue);
            minValueInput.val(minValue)
            let minMaxObj = getMinMaxFromRange({ range: sliderRangeValue });
            if (!minMaxObj) {
                return;
            }
            let { _, input } = minMaxObj;
            if (input) {
                let maxRangeValue = !input.max ? "" : input.max;
                sliderRangeValue = `${minValue}-${maxRangeValue}`;
                sliderRange.attr("data-range", sliderRangeValue);
            }
            if (minValue === max) {
                sliderLeftBtn.addClass(SLIDER_STYLE_CLASSES.OVERLAY);
                sliderLeftBtn.removeClass(SLIDER_STYLE_CLASSES.UNDERLAY);
                sliderRightBtn.addClass(SLIDER_STYLE_CLASSES.UNDERLAY);
                sliderRightBtn.removeClass(SLIDER_STYLE_CLASSES.OVERLAY);
            }
        }
        else {
            let maxValue = Math.round(range[1] / (maxWidth - offset) * (max - min));
            sliderRightBtn.find(SLIDER_SELECTORS.MAX_TEXT).text(maxValue);
            sliderRightBtn.attr("data-val", maxValue);
            let maxInput = maxValue === max ? null : maxValue;
            maxValueInput.val(maxInput);
            let minMaxObj = getMinMaxFromRange({ range: sliderRangeValue });
            if (!minMaxObj) {
                return;
            }
            let { _, input } = minMaxObj;
            let minValue = input && !isNaN(input.min) ? input.min : min;
            sliderRangeValue = `${minValue}-${!maxInput ? "" : maxInput}`;
            sliderRange.attr("data-range", sliderRangeValue);
            if (maxInput === min) {
                sliderLeftBtn.addClass(SLIDER_STYLE_CLASSES.UNDERLAY);
                sliderLeftBtn.removeClass(SLIDER_STYLE_CLASSES.OVERLAY);
                sliderRightBtn.addClass(SLIDER_STYLE_CLASSES.OVERLAY);
                sliderRightBtn.removeClass(SLIDER_STYLE_CLASSES.UNDERLAY);
            }
        }
        filterSelection(sliderRangeValue, sliderId);
    }

    function processRight({ newRight, shouldSetRange }) {
        if (isNaN(newRight)) {
            newRight = offset + maxWidth;
        }
        newRight = newRight < leftPosition ? leftPosition : newRight;
        newRight = newRight < offset ? offset : newRight;
        newRight = newRight > maxWidth ? maxWidth : newRight;
        rightOffset = rightOffset + newRight - rightPosition;
        rightPosition = newRight;
        sliderRightBtn.css({ left: newRight });
        let width = newRight - leftPosition;
        sliderRange.css({ width });
        if (shouldSetRange) {
            let range = [leftPosition - offset, rightPosition - offset]
            processRangeValues({ range, shouldSetMin: false });
        }
    }

    function addSliderRelatedEventListener() {
        sliderRange.on("click", handleSliderClick);
        sliderBar.on("click", handleSliderClick);
        sliderLeftBtn.on("touchstart", function (event) {
            handleSliderTouch({ event, shouldMoveLeft: true });
        });
        sliderRightBtn.on("touchstart", function (event) {
            handleSliderTouch({ event, shouldMoveLeft: false });
        });
        minValueInput.on("focusin", hideErrorMessage);
        maxValueInput.on("focusin", hideErrorMessage);
        minValueInput.on("focusout", handleMinInputChange);
        maxValueInput.on("focusout", handleMaxInputChange);
    }

    function setAllSliderElementsFromChild(element) {
        if (!element) {
            return;
        }
        slider = $(element.closest(SLIDER_SELECTORS.SLIDER));
        setSliderElementsBySlider(slider);
    }

    function setSliderElementsBySlider(slider) {
        if (!slider) {
            return;
        }
        sliderLeftBtn = slider.find(SLIDER_SELECTORS.LEFT_BTN);
        sliderRightBtn = slider.find(SLIDER_SELECTORS.RIGHT_BTN);
        sliderBar = slider.find(SLIDER_SELECTORS.BAR);
        sliderRange = slider.find(SLIDER_SELECTORS.RANGE);
        minValueInput = slider.find(SLIDER_SELECTORS.MIN_INPUT);
        maxValueInput = slider.find(SLIDER_SELECTORS.MAX_INPUT);
        sliderTooltip = slider.find(SLIDER_SELECTORS.TOOLTIP);
        sliderId = slider.attr("data-id");
    }

    function handleSliderClick(event) {
        if (!event || !event.target) {
            return;
        }
        sliderRange = $(event.target);
        setAllSliderElementsFromChild(sliderRange);
        setSliderProperties();
        setMinMax();
        hideErrorMessageHandler({ dataId: slider.attr("data-id") });
        let clickPositionX = event.pageX;
        if (!validateSliderElements()) {
            return;
        }
        processSliderEvents({ clickPositionX });
    }

    function handleSliderTouch({ event, shouldMoveLeft }) {
        if (!event || !event.target) {
            return;
        }
        setAllSliderElementsFromChild($(event.target));
        setSliderProperties();
        hideErrorMessageHandler({ dataId: slider.attr("data-id") });
        if (!validateSliderElements()) {
            return;
        }
        sliderTooltip.show();
        if (shouldMoveLeft) {
            sliderLeftBtn.on("touchmove", function (event) {
                handleSliderDrag({ event, shouldMoveLeft })
            });
            sliderLeftBtn.on("touchend", function () {
                sliderTooltip.hide();
            });
        }
        else {
            sliderRightBtn.on("touchmove", function (event) {
                handleSliderDrag({ event, shouldMoveLeft })
            });
            sliderRightBtn.on("touchend", function () {
                sliderTooltip.hide();
            });
        }
    }

    function handleSliderDrag({ event, shouldMoveLeft }) {
        let touch = event.originalEvent.targetTouches[0];
        let clickPositionX = touch.pageX;
        if (!validateSliderElements()) {
            return;
        }
        if (shouldMoveLeft) {
            moveLeft({ clickPositionX });
        }
        else {
            moveRight({ clickPositionX });
        }
    }

    function handleMinInputChange(event) {
        if (!event || !event.target) {
            return;
        }
        let minRange = parseInt(event.target.value, 10);
        minRange = isNaN(minRange) ? 0 : minRange;
        minValueInput = $(event.target);
        setAllSliderElementsFromChild(minValueInput);
        setSliderProperties();
        setMinMax();
        if (!validateSliderElements()) {
            return;
        }
        let minMaxObj = getMinMaxFromRange({ range: sliderRange.attr("data-range") });
        if (!minMaxObj) {
            return;
        }
        let { slider, input } = minMaxObj;
        let maxSelectedValue = parseInt(maxValueInput.val(), 10);
        if (isNaN(maxSelectedValue)) {
            maxSelectedValue = !input || !input.max ? '' : input.max;
        }
        if (minRange < 0 || (maxSelectedValue !== '' && minRange > maxSelectedValue)) {
            let errorMsg = ERROR_MESSAGES[sliderId];
            errorMsg = errorMsg ? errorMsg : ERROR_MESSAGES.default;
            displayErrorMessage(INPUT_TYPES.MIN, errorMsg);
            return;
        } else {
            hideErrorMessage();
        }
        let newRange = `${minRange}-${maxSelectedValue}`;
        minMaxObj = getMinMaxFromRange({ range: newRange });
        if (!minMaxObj) {
            return;
        }
        ({ slider, input } = minMaxObj);
        sliderRange.attr("data-range", newRange);
        initializeSlider({ sliderRange: slider });
    }

    function handleMaxInputChange() {
        if (!event || !event.target) {
            return;
        }
        let maxRange = parseInt(event.target.value, 10);
        maxValueInput = $(event.target);
        setAllSliderElementsFromChild(maxValueInput);
        setSliderProperties();
        setMinMax();
        if (!validateSliderElements()) {
            return;
        }
        let minMaxObj = getMinMaxFromRange({ range: sliderRange.attr("data-range") });
        if (!minMaxObj) {
            return;
        }
        let { slider, input } = minMaxObj;
        let minSelectedValue = minValueInput.val();
        if (isNaN(minSelectedValue)) {
            minSelectedValue = !input || !input.min ? 0 : input.min;
        }
        if (maxRange > Number.MAX_SAFE_INTEGER || maxRange < minSelectedValue) {
            let errorMsg = ERROR_MESSAGES[sliderId];
            errorMsg = errorMsg ? errorMsg : ERROR_MESSAGES.default;
            displayErrorMessage(INPUT_TYPES.MAX, errorMsg);
            return;
        } else {
            hideErrorMessage();
        }
        let newRange = `${minSelectedValue}-${isNaN(maxRange) ? "" : maxRange}`;
        minMaxObj = getMinMaxFromRange({ range: newRange });
        if (!minMaxObj) {
            return;
        }
        ({ slider, input } = minMaxObj);
        sliderRange.attr("data-range", newRange);
        initializeSlider({ sliderRange: slider });
    }

    function processSliderEvents({ clickPositionX }) {
        if (!validateSliderElements()) {
            return;
        }
        let minDisplacement = clickPositionX - sliderLeftBtn.offset().left;
        let maxDisplacement = clickPositionX - sliderRightBtn.offset().left;
        let minDistance = Math.abs(minDisplacement);
        let maxDistance = Math.abs(maxDisplacement);
        if (minDistance <= maxDistance) {
            moveLeft({ clickPositionX });
        }
        else {
            moveRight({ clickPositionX });
        }
    }

    function moveLeft({ clickPositionX }) {
        if (!validateSliderElements()) {
            return;
        }
        let minDisplacement = clickPositionX - leftOffset;
        let newLeft = minDisplacement + leftPosition;
        processLeft({ newLeft, shouldSetRange: true });
    }

    function moveRight({ clickPositionX }) {
        if (!validateSliderElements()) {
            return;
        }
        let maxDisplacement = clickPositionX - rightOffset;
        let newRight = rightPosition + maxDisplacement;
        processRight({ newRight, shouldSetRange: true });
    }

    function hideErrorMessage(event) {
        if (!event || !event.target) {
            return;
        }
        let dataId = event.target.getAttribute("data-id");
        hideErrorMessageHandler({ dataId });
    }

    function hideErrorMessageHandler({ dataId }) {
        if (!dataId) {
            return;
        }
        let errorMessageElement = $("p.input-error-message[data-id=" + dataId + "]");
        if (!errorMessageElement) {
            return;
        }
        $(".value-input[data-id=" + dataId + "]").removeClass("value-input-error");
        errorMessageElement.text("");
        errorMessageElement.hide();
    }

    function displayErrorMessage(inputType, message) {
        if (!inputType || !message) {
            return;
        }
        let element = inputType === INPUT_TYPES.MIN ? minValueInput : maxValueInput;
        if (!element) {
            return;
        }
        let errorMessageElement = $("p.input-error-message[data-id=" + element.attr("data-id") + "]");
        if (!errorMessageElement) {
            return;
        }
        element.addClass("value-input-error");
        errorMessageElement.text(message);
        errorMessageElement.show();
    }
    function getAllSliderIds()
    {
        let sliderIds = [];
        slider = $(SLIDER_SELECTORS.SLIDER);
        if(!slider)
        {
            return sliderIds;
        }
        slider.each((index, s) => {
                sliderIds.push($(s).attr("data-id"));
        })
        return sliderIds;
    }
    return {
        setSlider: setSlider,
        getRangeOfSlider: getRangeOfSlider,
        getAllSliderIds: getAllSliderIds,
    }
})();
