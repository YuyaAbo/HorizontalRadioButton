(function () {
    let selectedParameterName = ''

    $(document).ready(function () {
        tableau.extensions.initializeAsync({'configure': configure}).then(function () {
            tableau.extensions.settings.addEventListener(tableau.TableauEventType.SettingsChanged, updateSetting)
            updateRadioButton()
        })
    })

    function updateSetting (setting) {
        selectedParameterName = setting.newSettings.selectedParameterNameKey
        updateRadioButton()
    }

    function updateRadioButton () {
        tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function (parameters) {
            parameters.forEach(function (p) {
                if (p.name === selectedParameterName) {
                    const parameterValuesElement = $('<div id="parameter">')
                    p.allowableValues.allowableValues.forEach(function (value) {
                        const eachValueElement = $('<div style="display: inline-block">')

                        $('<input />', {
                            type: 'radio',
                            id: value.formattedValue,
                            name: p.name,
                            value: value.formattedValue,
                            checked: value.formattedValue === p.currentValue.formattedValue,
                            click: () => p.changeValueAsync(value.formattedValue),
                        }).appendTo(eachValueElement)

                        $('<label>', {
                            'for': value.formattedValue,
                            text: value.formattedValue,
                        }).appendTo(eachValueElement)

                        parameterValuesElement.append(eachValueElement)
                    })
                    $('#parameter').replaceWith(parameterValuesElement)
                }
            })
        })
    }

    function configure () {
        const popupUrl = './horizontalRadioButtonConfig.html';
        tableau.extensions.ui.displayDialogAsync(popupUrl, selectedParameterName, { height: 500, width: 500 }).then((closePayload) => {

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