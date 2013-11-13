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
    TP.clock = function(callback) {
        callback(TP.now());
        return setInterval(function() {
            callback(TP.now());
        }, 1000);
    };
    TP.getContainer = function() {
        return container;
    };
    TP.digitalClock = function() {
        TP.clock(function(date) {
            console.log('x');
            container.innerHTML = date.format('%H:%M:%S');
        });
    }
})(Tempus);