(function (tempus) {
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
        date.year(Math.floor((Math.random()*(tempus.constants().MAX_YEAR - tempus.constants().MIN_YEAR)) + tempus.constants().MIN_YEAR)).
             month(Math.floor((Math.random()*(tempus.constants().MAX_MONTH - tempus.constants().MIN_MONTH)) + tempus.constants().MIN_MONTH)).
             day(Math.floor((Math.random()*(date().dayCount() - tempus.constants().MIN_DAY)) + tempus.constants().MIN_DAY)).
             hours(Math.floor((Math.random()*(tempus.constants().MAX_HOURS - tempus.constants().MIN_HOURS)) + tempus.constants().MIN_HOURS)).
             minutes(Math.floor((Math.random()*(tempus.constants().MAX_MINUTES - tempus.constants().MIN_MINUTES)) +
                tempus.constants().MIN_MINUTES)).
             seconds(Math.floor((Math.random()*(tempus.constants().MAX_SECONDS - tempus.constants().MIN_SECONDS)) +
                tempus.constants().MIN_SECONDS));
        return date;
    };
})(tempus);