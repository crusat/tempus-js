/**
 * @author Aleksey Kuznetsov aka crusat
 */
(function (window, undefined) {
















    TempusDate.fn.dayNames = function (type) {
        switch (type) {
            case 'long':
                return translations[lang]["dayLongNames"];
            default:
                return translations[lang]["dayShortNames"];
        }
    };
    TempusDate.fn.between = function (dateTo, type) {
        var from = this.timestamp();
        var to = dateTo.timestamp();
        switch (type) {
            case 'year':
                return Math.floor((to - from) / 31556952); // 365.2425 - average days in year. Here in seconds
            case 'month':
                return Math.floor((to - from) / 2629746);
            case 'day':
                return Math.floor((to - from) / 86400);
            case 'hours':
                return Math.floor((to - from) / 3600);
            case 'minutes':
                return Math.floor((to - from) / 60);
            case 'seconds':
                return to - from;
            default:
                return undefined;
        }
    };



    TempusDate.fn.format = function (format) {
        var i = 0,
            result = '',
            directive;
        while (i < format.length) {
            if (format.charAt(i) === '%') {
                if (format.charAt(i+1) === '%') {
                    i++;
                    result += '%';
                } else {
                    directive = format.charAt(i) + format.charAt(i + 1);
                    result += registeredFormats[directive].format(this);
                    i++;
                }
            } else {
                result += format.charAt(i);
            }
            i++;
        }
        return result;
    };




    TempusDate.fn.detectFormat = function (str) {
        var format, tmpChars, len;
        format = detectDateFormat(str, 0);
        if (format !== '') {
            len = 10;
        }
        tmpChars = str.charAt(len);
        if (tmpChars === 'T' || tmpChars === ' ') {
            format += tmpChars;
            len++;
        }
        format += detectTimeFormat(str, len);
        return format;
    };

    TempusDate.fn.calc = function (delta) {
        if (delta.year !== undefined) {
            this._date.setFullYear(this._date.getFullYear() + delta.year);
        }
        if (delta.month !== undefined) {
            this._date.setMonth(this._date.getMonth() + delta.month);
        }
        if (delta.day !== undefined) {
            this._date.setDate(this._date.getDate() + delta.day);
        }
        if (delta.hours !== undefined) {
            this._date.setHours(this._date.getHours() + delta.hours);
        }
        if (delta.minutes !== undefined) {
            this._date.setMinutes(this._date.getMinutes() + delta.minutes);
        }
        if (delta.seconds !== undefined) {
            this._date.setSeconds(this._date.getSeconds() + delta.seconds);
        }
        if (delta.milliseconds !== undefined) {
            this._date.setMilliseconds(this._date.getMilliseconds() + delta.milliseconds);
        }
        return this;
    };


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
    /**
     * Globally set or get language.
     * @param value {string} Language's code.
     * @returns {string|Tempus} Language's code or Tempus object.
     * @example
     * // returns "Ноябрь, 14"
     * TP.lang('ru').set({year: 2013, month: 11, day: 14}).format('%B, %d');
     * @example
     * TP.lang('ru');
     * // returns "Ноябрь"
     * TP.month(11).format('%B');
     */
    TempusDate.fn.lang = function (value) {
        if (value !== undefined) {
            lang = value;
        } else {
            return lang;
        }
        return this;
    };
    /**
     * All work with timestamps and timeouts will be in milliseconds.
     * @param value {boolean} False to disabling it.
     * @returns {Tempus}
     * @example
     * // returns {"year":2013,"month":11,"day":14,"hours":12,"minutes":38,"seconds":54,"dayOfWeek":4,
     * //    "dayOfWeekShort":"Thu","dayOfWeekLong":"Thursday","timestamp":1384418334445,"UTC":1384432734445,
     * //    "milliseconds":445}
     * TP.iWantUseMilliseconds().now().get();
     */
    TempusDate.fn.iWantUseMilliseconds = function (value) {
        useMilliseconds = value !== false;
        return this;
    };
    /**
     * Month started from zero. By default is False.
     * @param value {boolean} False to disabling it.
     * @returns {Tempus}
     * @example
     * TP.iLoveMonthFromZero();
     * // returns "14 December 2013"
     * TP.set({year: 2013, month: 11, day: 14}).format('%d %B %Y');
     * TP.iLoveMonthFromZero(false);
     * // returns "14 November 2013"
     * TP.set({year: 2013, month: 11, day: 14}).format('%d %B %Y');
     */
    TempusDate.fn.iLoveMonthFromZero = function (value) {
        monthFromZero = value !== false;
        return this;
    };

    TempusDate.fn.registerFormat = function(value, formatFunc, parseFunc, minLength, maxLength, type) {
        registeredFormats[value] = {
            format: formatFunc,
            parse: parseFunc,
            minLength: minLength,
            maxLength: maxLength,
            type: type
        }
    };

    TempusDate.fn.unregisterFormat = function(value) {
        delete registeredFormats[value];
    };

    TempusDate.fn.validate = function() {
        return (this._incorrect.year === false && this._incorrect.month === false && this._incorrect.day === false &&
            this._incorrect.hours === false && this._incorrect.minutes === false && this._incorrect.seconds === false &&
            this._incorrect.milliseconds === false);
    };

    TempusDate.fn.getErrors = function() {
        return this._incorrect;
    };

    TempusDate.fn.getAvailableLangs = function() {
        return Object.keys(translations);
    };








})(window);
