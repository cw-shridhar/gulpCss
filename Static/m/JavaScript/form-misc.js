var formField = (function () {
    function scrollToTop(field) {
        var noScrollInput = $(field).hasClass('noScrollToTop');

        if (!noScrollInput) {
            var fieldPosition = field.offset().top - 50;

            $('html, body').animate({
                scrollTop: fieldPosition
            }, 200);
        }
    };

    function resetInput(inputField) {
        inputField.closest('.input-box').removeClass('done');
        inputField.val('');
    };

    function resetSelect(selectField) {
        selectField.closest('.select-box').removeClass('done');
        selectField.html('<option value="0"></option>').val("0").change();
        selectField.trigger('chosen:updated');
    };

    function emptySelect(selectField) {
        selectField.closest('.select-box').removeClass('done');
        selectField.val("0").change().trigger('chosen:updated');
    };

    return { scrollToTop: scrollToTop, resetInput: resetInput, resetSelect: resetSelect, emptySelect: emptySelect };
})();

var field = {
    setError: function (element, message) {
        var fieldBox = element.closest('.field-box');
        fieldBox.addClass('invalid');

        if (fieldBox.hasClass('input-box')) {
            if (element.val().length > 0) {
                fieldBox.addClass('done');
            }
            else {
                fieldBox.removeClass('done');
            }
        }
        fieldBox.find('.error-text').text(message);
    },

    hideError: function (element) {
        var fieldBox = element.closest('.field-box');

        fieldBox.removeClass('invalid').addClass('done');
        fieldBox.find('.error-text').text('');
    },
    setMessage: function (element, message) {
        var fieldBox = element.closest('.field-box');
        if (fieldBox.hasClass('input-box')) {
            if (element.val().length > 0) {
                fieldBox.addClass('done');
            }
            else {
                fieldBox.removeClass('done');
            }
        }
        fieldBox.find('.text-message').text(message);
    }
}