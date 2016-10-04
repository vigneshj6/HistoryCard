//will be removed after Ui.Event becomes private
var changeRole = TEACH.Ui.Event.changeRole;

//will be added to TEACH.Help sub-module
function notEmpty(obj) {
    return !(Object.keys(obj).length === 0);
}

//will be added to TEACH.Help sub-module
function empty(obj) {
    return (Object.keys(obj).length === 0);
}

$(document).ready(function() {
    TEACH.Ui.init();
});
