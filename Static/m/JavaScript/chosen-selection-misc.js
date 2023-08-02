//Function to initialize chosen
function ChosenInit(containerName) {
    var selectBox = containerName.find('.select-box');
    selectBox.each(function () {
        var element = $(this);
        element.find('.chosen-select').chosen({
            width: '100%'
        });
        if (element.hasClass('select-box-no-input')) {
            chosenSelect.removeInputField(element);
        }
    });

};

var chosenSelect = (function () {
    function noResultSelection(selectField, inputField) {
        addCustomOption(selectField, inputField);
    };

    function addCustomOption(selectField, inputField) {
        var inputValue = inputField.val(),
            template = '<option value="-1">' + inputValue + '</option>';

        selectField.append(template);
        selectField.val("-1").change();
        inputField.closest('.chosen-container').removeClass('chosen-with-drop');
        selectField.trigger('chosen:updated');
    };

    function removeInputField(selectBox) {
        var placeholderText = selectBox.find('.chosen-select').attr('data-title'),
        searchBox = selectBox.find('.chosen-search');

        searchBox.empty().append('<p class="no-input-label">' + placeholderText + '</p>');
    };

    return { noResultSelection: noResultSelection, removeInputField: removeInputField };
})();

