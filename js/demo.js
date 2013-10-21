$(document).ready(function() {
    function setCurrentDateTime() {
        $('#format_date_input_source_datetime').val(
            $.datetime(
                $('#format_date_input_source_format').val()
            )
        );
    }
    function setCalculatedDateTime() {
        $('#format_date_input_result').val(
            $.datetime.reformat(
                $('#format_date_input_source_datetime').val(),
                $('#format_date_input_dest_format').val(),
                $('#format_date_input_source_format').val()
            )
        );
    }
    // get current date/time by format
    $('#format_date_btn_get_current').click(function() {
        setCurrentDateTime();
    });
    // start reformat
    $('#format_date_btn_start').click(function() {
        setCalculatedDateTime();
    });
    // auto
    setInterval(function() {
        if ($('#format_date_checkbox_auto:checked').length !== 0) {
            setCurrentDateTime();
        }
        if ($('#format_date_checkbox_auto_calculate:checked').length !== 0) {
            setCalculatedDateTime();
        }
    }, 1000);

});