/**
 * @author Aleksey Kuznetsov aka crusat
 */
(function (window, undefined) {































    /**
     * Returns UTC Date object.
     * @returns {Date} Date object with data from this Tempus object.
     * @example
     * // returns Date obj
     * TP.now().calc({month: -1}).asVanillaDateUTC();
     */
    TempusDate.fn.asVanillaDateUTC = function () {
        return new Date(Date.UTC(
            this.year() !== undefined ? this.year() : 1970,
            this.month() !== undefined ? this.month() - (monthFromZero ? 0 : 1) : 0,
            this.day() !== undefined ? this.day() : 1,
            this.hours() !== undefined ? this.hours() : 0,
            this.minutes() !== undefined ? this.minutes() : 0,
            this.seconds() !== undefined ? this.seconds() : 0,
            this.milliseconds() !== undefined ? this.milliseconds() : 0
        ));
    };






















})(window);
