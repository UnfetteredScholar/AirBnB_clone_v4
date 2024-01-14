const selected_amenities = {};

$(document).ready(init);



function init() {
    $(".amenities .popover input").change(check_action);
}

function check_action() {
    if ( $(this).is(":checked") ) {
        selected_amenities[$(this).attr("data-id")] = $(this).attr("data-name");
    }
    else if ( $(this).is(":not(:checked)") ){
        delete selected_amenities[$(this).attr("data-id")];
    }
    display_amenities(selected_amenities)
}

function display_amenities(selected_amenities) {
    const amenities = Object.values(selected_amenities).sort();
    $(".amenities h4").text(amenities.join(', '));
}