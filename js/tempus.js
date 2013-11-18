/**
 * @author Aleksey Kuznetsov aka crusat
 */
(function (window, undefined) {

    var isLeapYear = function (year) {
        if (year % 4 == 0) {
            if (year % 100 == 0) {
                return year % 400 == 0;
            } else return true;
        }
        return false;
    };

    var formattingWithNulls = function (val, symb_count) {
        var v = val.toString();
        while (v.length < symb_count) {
            v = '0' + v;
        }
        return v;
    };

    var parseBadFormat = function(date, defaults) {
        if (defaults !== undefined) {
            date.year(defaults.year() || defaults.year);
            date.month(defaults.month() || defaults.month);
            date.day(defaults.day() || defaults.day);
            date.hours(defaults.hours() || defaults.hours);
            date.minutes(defaults.minutes() || defaults.minutes);
            date.seconds(defaults.seconds() || defaults.seconds);
            date.milliseconds(defaults.milliseconds() || defaults.milliseconds);
            return date;
        } else {
            return undefined;
        }
    };

    var detectTimeFormat = function(str, startFrom) {
        var tmpChars, format = '';
        tmpChars = str.slice(startFrom, startFrom+1);
        if (tmpChars !=='' && !isNaN(Number(tmpChars))) {
            format += '%H';
        }
        tmpChars = str.charAt(startFrom+2);
        if (tmpChars !=='' && tmpChars === ':') {
            format += tmpChars;
        }
        tmpChars = str.slice(startFrom+3, startFrom+4);
        if (tmpChars !=='' && !isNaN(Number(tmpChars))) {
            format += '%M';
        }
        tmpChars = str.charAt(startFrom+5);
        if (tmpChars !=='' && tmpChars === ':') {
            format += tmpChars;
        }
        tmpChars = str.slice(startFrom+6, startFrom+7);
        if (tmpChars !=='' && !isNaN(Number(tmpChars))) {
            format += '%S';
        }
        return format;
    };

    var detectDateFormat = function(str, startFrom) {
        var tmpChars, format;
        var part1 = [
            str.slice(startFrom, startFrom+1),
            str.charAt(startFrom+2),
            str.slice(startFrom+3, startFrom+4),
            str.charAt(startFrom+5),
            str.slice(startFrom+6, startFrom+9)
        ];

        if (!isNaN(Number(part1[0])) && !isNaN(Number(part1[2])) && !isNaN(Number(part1[4]))) {
            if (part1[1] === '.' && part1[3] === '.') {
                format = '%d.%m.%Y';
            } else if (part1[1] === '-' && part1[3] === '-') {
                format = '%m-%d-%Y';
            } else if (part1[1] === '/' && part1[3] === '/') {
                format = '%m/%d/%Y';
            }

            return format;
        }

        var part2 = [
            str.slice(startFrom, startFrom+3),
            str.charAt(startFrom+4),
            str.slice(startFrom+5, startFrom+6),
            str.charAt(startFrom+7),
            str.slice(startFrom+8, startFrom+9)
        ];

        if (!isNaN(Number(part2[0])) && !isNaN(Number(part2[2])) && !isNaN(Number(part2[4]))) {
            if (part2[1] === '-' && part2[3] === '-') {
                format = '%Y-%m-%d';
            }
            return format;
        }
        return '';
    };

    /**
     * Set a current date.
     * @returns {Tempus}
     * @example
     * // returns Tempus object with current date.
     * TP.now();
     * @example
     * // returns simple object with current date
     * TP.now().date();
     */
    TempusDate.fn.now = function () {
        this._date = new Date();
        return this;
    };
    TempusDate.fn.timestamp = function (value) {
        if (arguments.length !== 0) {
            this.date(new Date(Number(value) * (useMilliseconds ? 1 : 1000)));
            return this;
        } else {
            if (useMilliseconds) {
                return this._date.getTime();
            } else {
                return Math.floor(this._date.getTime() / 1000)
            }
        }
    };
    TempusDate.fn.UTC = function (value) {
        if (arguments.length !== 0) {
            this.date(new Date(Number(value) * (useMilliseconds ? 1 : 1000)));
            return this;
        } else {
            if (useMilliseconds) {
                return this._date.getTime() - this._date.getTimezoneOffset()*60000;
            } else {
                return Math.floor(this._date.getTime() / 1000) - this._date.getTimezoneOffset()*60;
            }
        }
    };
    /**
     * Get day of week.
     * @param type {string|none} If none, number returned. If 'short', short string returned, 'long' for long.
     * @returns {number|undefined} Numeric value of day of week.
     * @example
     * // returns current day of week
     * TP.now().dayOfWeek();
     */
    TempusDate.fn.dayOfWeek = function (type) {
        switch (type) {
            case 'long':
                return translations[lang]["daysLongNames"][this._date.getDay()];
            case 'short':
                return translations[lang]["daysShortNames"][this._date.getDay()];
            default:
                return this._date.getDay();
        }
    };

    TempusDate.fn.timezone = function (type) {
        switch (type) {
            case 'hours':
                return Math.floor(this._date.getTimezoneOffset() / 60);
            case 'minutes':
                return this._date.getTimezoneOffset();
            default:
                return this._date.getTimezoneOffset()*60;
        }
    };

    TempusDate.fn.week = function () {
        var onejan = new Date(this.year(), 0, 1);
        var nowDate = this.get('Date');
        return Math.ceil((((nowDate - onejan) / 86400000) + onejan.getDay()+1)/7);
    };

    /**
     * Is year leap?
     * @returns {boolean|undefined} If true year is leap else not leap.
     * @example
     * // returns false
     * TP.year(2013).leapYear();
     * @example
     * // returns true
     * TP.year(2012).leapYear();
     * @example
     * // returns true
     * TP.year(2000).leapYear();
     * @example
     * // returns false
     * TP.year(1900).leapYear();
     * @example
     * // returns false
     * TP.set({year: 1941, day: 22, month: 6}).leapYear();
     * @example
     * // returns true
     * TP.set({year: 2008, day: 1, month: 1}).leapYear();
     * @example
     * // check current year
     * TP.now().leapYear();
     */
    TempusDate.fn.leapYear = function () {
        var y;
        if ((y = this.year()) !== undefined) {
            return isLeapYear(y);
        } else {
            return undefined;
        }
    };
    /**
     * Releases TP variable from global scope.
     * @param all {boolean} If true, Tempus variable also will be released.
     * @returns {Tempus} Tempus object.
     * @example
     * // returns Tempus constructor
     * var T = tempus().noConflict(true);
     * var t = T().format('%d.%m.%Y');
     */
    TempusDate.fn.noConflict = function (all) {
        window.TP = _TP;
        if (all === true) {
            window.Tempus = _Tempus
        }
        return Tempus;
    };
    /**
     * Get a current version of TempusJS.
     * @returns {string} Current version of TempusJS.
     * @example
     * // returns current version
     * TP.getVersion();
     */
    TempusDate.fn.getVersion = function () {
        return version;
    };
    TempusDate.fn.monthNames = function (type) {
        switch (type) {
            case 'long':
                return translations[lang]["monthLongNames"];
            default:
                return translations[lang]["monthShortNames"];
        }
    };
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
    TempusDate.fn.get = function (type) {
        switch (type) {
            case 'Date':
                return this._date;
            default:
                return {
                    year: this.year(),
                    month: this.month(),
                    week: this.week(),
                    day: this.day(),
                    hours: this.hours(),
                    minutes: this.minutes(),
                    seconds: this.seconds(),
                    milliseconds: this.milliseconds(),
                    UTC: this.UTC(),
                    dayOfWeek: this.dayOfWeek(),
                    dayOfWeekShort: this.dayOfWeek('short'),
                    dayOfWeekLong: this.dayOfWeek('long'),
                    timestamp: this.timestamp()
                }
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

    TempusDate.fn.options = function () {
        return {
            useMilliseconds: useMilliseconds,
            monthFromZero: monthFromZero,
            lang: lang
        }
    };

    /**
     * Returns Date object.
     * @returns {Date} Date object with data from this Tempus object.
     * @example
     * // returns Date obj
     * TP.now().calc({month: -1}).asVanillaDate();
     */
//    TempusDate.fn.asVanillaDate = function () {
//        return new Date(
//            this.year() !== undefined ? this.year() : 1970,
//            this.month() !== undefined ? this.month() - (monthFromZero ? 0 : 1) : 0,
//            this.day() !== undefined ? this.day() : 1,
//            this.hours() !== undefined ? this.hours() : 0,
//            this.minutes() !== undefined ? this.minutes() : 0,
//            this.seconds() !== undefined ? this.seconds() : 0,
//            this.milliseconds() !== undefined ? this.milliseconds() : 0
//        );
//    };

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


    // *************************************************
    // *                                               *
    // *               COMPATIBILITY                   *
    // *                                               *
    // *************************************************

    // fix Array.indexOf for old browsers
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        }
    }





})(window);
