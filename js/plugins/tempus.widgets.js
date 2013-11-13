(function (TP) {
    var container = '';
    TP.DOMById = function (id) {
        container = document.getElementById(id);
        return this;
    };
    TP.DOM = function(element) {
        container = element;
        return this;
    };
    TP.getContainer = function() {
        return container;
    };
    TP.digitalClock = function(options) {
        TP.clock(function(date) {
            container.innerHTML = date.format('%H:%M:%S');
        });
    }
})(Tempus);