(function () {
    $(document).ready(function () {
        tableau.extensions.initializeDialogAsync().then(() => {
            $("#closeButton").click(closeDialog);

            const selectedParameterName = tableau.extensions.settings.get(
                "selectedParameterNameKey"
            );

            tableau.extensions.dashboardContent.dashboard
                .getParametersAsync()
                .then(function (parameters) {
                    parameters.forEach(function (parameter) {
                        if (
                            parameter.allowableValues.type === tableau.ParameterValueType.List
                        ) {
                            const listElement = $("<h3>");

                            $("<input />", {
                                type: "radio",
                                id: parameter.name,
                                name: "HorizontalRadioButtonConfig",
                                value: parameter.name,
                                checked: parameter.name === selectedParameterName,
                            }).appendTo(listElement);

                            $("<label>", {
                                for: parameter.name,
                                text: parameter.name,
                            }).appendTo(listElement);

                            $("#parameters").append(listElement);
                        }
                    });
                });
        });
    });

    const closeDialog = () => {
        const selectedParameterName = $(`input:radio:checked`).val();
        tableau.extensions.settings.set(
            "selectedParameterNameKey",
            selectedParameterName
        );
        tableau.extensions.settings.saveAsync().then(() => {
            tableau.extensions.ui.closeDialog(selectedParameterName);
        });
    };
})();
