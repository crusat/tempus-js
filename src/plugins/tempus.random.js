(function (tempus) {
    var TempusDate = tempus.classes('TempusDate');
    /**
     * Generate random date. Just for example plugin.
     *
     *     @example
     *     // returns TempusDate with random date.
     *     tempus.randomDate();
     *
     * @returns {TempusDate}
     */
    tempus.randomDate = function() {
        var date = new TempusDate();
        date.year(Math.floor((Math.random()*(tempus.MAX_YEAR - tempus.MIN_YEAR)) + tempus.MIN_YEAR)).
             month(Math.floor((Math.random()*(tempus.MAX_MONTH - tempus.MIN_MONTH)) + tempus.MIN_MONTH)).
             day(Math.floor((Math.random()*(date.dayCount() - tempus.MIN_DAY)) + tempus.MIN_DAY)).
             hours(Math.floor((Math.random()*(tempus.MAX_HOURS - tempus.MIN_HOURS)) + tempus.MIN_HOURS)).
             minutes(Math.floor((Math.random()*(tempus.MAX_MINUTES - tempus.MIN_MINUTES)) + tempus.MIN_MINUTES)).
             seconds(Math.floor((Math.random()*(tempus.MAX_SECONDS - tempus.MIN_SECONDS)) + tempus.MIN_SECONDS));
        return date;
    };
})(tempus);