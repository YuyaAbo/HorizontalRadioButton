(function () {
    const configure = () => {
        tableau.extensions.ui.displayDialogAsync("./config.html", "");
    };

    tableau.extensions.initializeAsync({ configure: configure }).then(() => {
        tableau.extensions.settings.addEventListener(
            tableau.TableauEventType.SettingsChanged,
            onSettingsChange
        );
        initRadioButton();
    });

    const onSettingsChange = () => {
        initRadioButton();
    };

    const onParameterChange = (parameterChangeEvent) => {
        parameterChangeEvent.getParameterAsync().then((parameter) => {
            $(`input:radio[value="${parameter.currentValue.formattedValue}"]`).prop(
                "checked",
                true
            );
        });
    };

    const initRadioButton = () => {
        const selectedParameterName = tableau.extensions.settings.get(
            "selectedParameterNameKey"
        );
        tableau.extensions.dashboardContent.dashboard
            .getParametersAsync()
            .then((parameters) => {
                const selectedParameter = parameters.find(
                    (p) => p.name === selectedParameterName
                );
                selectedParameter.addEventListener(
                    tableau.TableauEventType.ParameterChanged,
                    onParameterChange
                );

                const parameterValuesElement = $('<div id="parameter">');
                selectedParameter.allowableValues.allowableValues.forEach(
                    (dataValue) => {
                        const eachValueElement = $('<div style="display: inline-block">');

                        $("<input />", {
                            type: "radio",
                            id: dataValue.formattedValue,
                            name: selectedParameter.name,
                            value: dataValue.formattedValue,
                            checked:
                                dataValue.formattedValue ===
                                selectedParameter.currentValue.formattedValue,
                            click: () =>
                                selectedParameter.changeValueAsync(dataValue.formattedValue),
                        }).appendTo(eachValueElement);

                        $("<label>", {
                            for: dataValue.formattedValue,
                            text: dataValue.formattedValue,
                        }).appendTo(eachValueElement);

                        parameterValuesElement.append(eachValueElement);
                    }
                );
                $("#parameter").replaceWith(parameterValuesElement);
            });
    };
})();
