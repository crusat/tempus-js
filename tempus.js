var TempusJS = function() {
    this.now = function() {
        return Math.floor((new Date()).getTime()/1000);
    };
    this.isLeapYear = function(year) {
        if (year % 4 == 0) {
            if (year % 100 == 0) {
                return year % 400 == 0;
            } else return true;
        }
        return false;
    }
};

var tempus = new TempusJS();
