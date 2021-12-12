(function () {
    const SELECTED_PARAMETER_NAME_KEY = 'selectedParameterNameKey'
    let selectedParameterName = ''

    $(document).ready(function () {
        tableau.extensions.initializeDialogAsync().then(function (openPayload) {
            $('#closeButton').click(closeDialog)

            selectedParameterName = tableau.extensions.settings.get(SELECTED_PARAMETER_NAME_KEY)

            tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function (parameters) {
                parameters.forEach(function (parameter) {
                    if (parameter.allowableValues.type === tableau.ParameterValueType.List) {
                        const listElement = $('<h3>')

                        $('<input />', {
                            type: 'radio',
                            id: parameter.name,
                            name: 'HorizontalRadioButtonConfig',
                            value: parameter.name,
                            checked: parameter.name === selectedParameterName,
                            click: function () { updateTargetParameter(parameter.name); },
                        }).appendTo(listElement)

                        $('<label>', {
                            'for': parameter.name,
                            text: parameter.name,
                        }).appendTo(listElement)

                        $('#parameters').append(listElement)
                    }
                })
            })
        })
    })

    function updateTargetParameter (parameterName) {
        selectedParameterName = parameterName
    }

    function closeDialog () {
        tableau.extensions.settings.set(SELECTED_PARAMETER_NAME_KEY, selectedParameterName)
        tableau.extensions.settings.saveAsync().then(() => {
            tableau.extensions.ui.closeDialog(selectedParameterName)
        })
    }
})()
