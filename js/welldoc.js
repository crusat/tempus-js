(function() {
    /**
     * A **TempusDate** class. Store information about some date and can be use
     * for working with it date.
     * @param {string} options Some date.
     * @param {undefined|string} format String for getting date from string or undefined else.
     * @param {TempusDate} defaults This object was returning, if options is **undefined**.
     * @returns {TempusDate}
     * @constructor
     */
    var TempusDate = function (options, format, defaults) {
        // always valid date
        this._date = new Date();
        // if some errors, write here values.
        this._incorrect = {
            year: false,
            month: false,
            day: false,
            hours: false,
            minutes: false,
            seconds: false,
            milliseconds: false
        };

        if (options !== undefined) {
            this.set(options, format, defaults);
        }
        return this;
    };

    /**
     * Short **prototype** alias.
     * @type {TempusDate}
     */
    TempusDate.fn = TempusDate.prototype;

    /**
     * Returns constants object. Some constants depends from options (MIN_MONTH, MAX_MONTH).
     * For MAX_DAY_IN_MONTH better use [dayCount].
     *
     * See the example:
     *
     *     @example
     *     // returns {
     *     //   "MIN_YEAR":1000,
     *     //   "MAX_YEAR":3000,
     *     //   "MIN_MONTH":1,
     *     //   "MAX_MONTH":12,
     *     //   "MIN_DAY":1,
     *     //   "MAX_DAY_IN_MONTHS":[31,28,31,30,31,30,31,31,30,31,30,31],
     *     //   "MIN_DAY_OF_WEEK":0,
     *     //   "MAX_DAY_OF_WEEK":6,
     *     //   "MIN_HOURS":0,
     *     //   "MAX_HOURS":23,
     *     //   "MIN_MINUTES":0,
     *     //   "MAX_MINUTES":59,
     *     //   "MIN_SECONDS":0,
     *     //   "MAX_SECONDS":59,
     *     //   "MIN_MILLISECONDS":0,
     *     //   "MAX_MILLISECONDS":999
     *     // }
     *     tempus().constants();
     * @returns {Object} Object with all constants in Tempus.
     */
    TempusDate.fn.constants = function () {
        return {
            MIN_YEAR: 1000,
            MAX_YEAR: 3000,
            MIN_MONTH: monthFromZero ? 0 : 1,
            MAX_MONTH: monthFromZero ? 11 : 12,
            MIN_DAY: 1,
            MAX_DAY_IN_MONTHS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            MIN_DAY_OF_WEEK: 0,
            MAX_DAY_OF_WEEK: 6,
            MIN_HOURS: 0,
            MAX_HOURS: 23,
            MIN_MINUTES: 0,
            MAX_MINUTES: 59,
            MIN_SECONDS: 0,
            MAX_SECONDS: 59,
            MIN_MILLISECONDS: 0,
            MAX_MILLISECONDS: 999
        }
    };

    /**
     * Returns day count in months.
     * @returns {number} Day count in months.
     */
    TempusDate.fn.dayCount = function () {
        var m = this.month();
        var dc = this.constants().MAX_DAY_IN_MONTHS[m - (monthFromZero ? 0 : 1)];
        if (this.leapYear() && m === 2) {
            dc += 1;
        }
        return dc;
    };
})();