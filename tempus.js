var TempusJS = function() {
    this.now = function() {
        return Math.floor((new Date()).getTime()/1000);
    };
};

var tempus = new TempusJS();
