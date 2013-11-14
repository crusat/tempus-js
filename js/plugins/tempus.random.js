(function (TP) {
    /**
     * Generate random date.
     * @returns {Tempus}
     * @example
     * // returns {"year":2145,"month":10,"day":27,"hours":9,"minutes":26,"seconds":47,"dayOfWeek":3,
     *     "dayOfWeekShort":"Wed","dayOfWeekLong":"Wednesday","timestamp":5548368407,"UTC":5548382807}
     * TP.random().date();
     */
    TP.random = function() {
        this.year(Math.floor((Math.random()*(this.constants().MAX_YEAR - this.constants().MIN_YEAR)) + this.constants().MIN_YEAR));
        this.month(Math.floor((Math.random()*(this.constants().MAX_MONTH - this.constants().MIN_MONTH)) + this.constants().MIN_MONTH));
        this.day(Math.floor((Math.random()*(this.dayCount() - this.constants().MIN_DAY)) + this.constants().MIN_DAY));
        this.hours(Math.floor((Math.random()*(this.constants().MAX_HOURS - this.constants().MIN_HOURS)) + this.constants().MIN_HOURS));
        this.minutes(Math.floor((Math.random()*(this.constants().MAX_MINUTES - this.constants().MIN_MINUTES)) +
            this.constants().MIN_MINUTES));
        this.seconds(Math.floor((Math.random()*(this.constants().MAX_SECONDS - this.constants().MIN_SECONDS)) +
            this.constants().MIN_SECONDS));
        return this;
    };
})(Tempus);