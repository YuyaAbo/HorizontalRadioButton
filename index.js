(function () {
    let selectedParameterName = ''

    $(document).ready(() => {
        tableau.extensions.initializeAsync({'configure': configure}).then(() => {
            tableau.extensions.settings.addEventListener(tableau.TableauEventType.SettingsChanged, onSettingsChange)
            selectedParameterName = tableau.extensions.settings.get('selectedParameterNameKey')
            initRadioButton()
        })
    })

    const onSettingsChange =  (settingsEvent) => {
        selectedParameterName = settingsEvent.newSettings.selectedParameterNameKey
        initRadioButton()
    }

    const onParameterChange = (parameterChangeEvent) => {
        parameterChangeEvent.getParameterAsync().then((parameter) => {
            $(`input:radio[value=${parameter.currentValue.formattedValue}]`)
                .prop('checked', true)
        })
    }

    const initRadioButton = () => {
        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then((parameters) => {
            const selectedParameter = parameters.find((p) => p.name === selectedParameterName)
            selectedParameter.addEventListener(tableau.TableauEventType.ParameterChanged, onParameterChange)

            const parameterValuesElement = $('<div id="parameter">')
            selectedParameter.allowableValues.allowableValues.forEach((dataValue) => {
                const eachValueElement = $('<div style="display: inline-block">')

                $('<input />', {
                    type: 'radio',
                    id: dataValue.formattedValue,
                    name: selectedParameter.name,
                    value: dataValue.formattedValue,
                    checked: dataValue.formattedValue === selectedParameter.currentValue.formattedValue,
                    click: () => selectedParameter.changeValueAsync(dataValue.formattedValue),
                }).appendTo(eachValueElement)

                $('<label>', {
                    'for': dataValue.formattedValue,
                    text: dataValue.formattedValue,
                }).appendTo(eachValueElement)

                parameterValuesElement.append(eachValueElement)
            })
            $('#parameter').replaceWith(parameterValuesElement)
        })
    }

    function configure () {
        tableau.extensions.ui.displayDialogAsync('./config.html', selectedParameterName).then((closePayload) => {

        }).catch((error) => {
            switch (error.errorCode) {
                case tableau.ErrorCodes.DialogClosedByUser:
                    console.log('Dialog was closed by user');
                    break;
                default:
                    console.error(error.message);
            }
        });
    }
})();
