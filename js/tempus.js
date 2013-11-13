//(function (window, undefined) {
//
//    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//    var version = '0.2.0';

//
//    var formattingWithNulls = function (val, symb_count) {
//        var v = val.toString();
//        while (v.length < symb_count) {
//            v = '0' + v;
//        }
//        return v;
//    };
//
//
//    var Tempus = function (options) {
//        var that = this;
//
//
//        this.init = function () {
//            console.log('ready');
//        };
//
//
//
//
//        this.format = function (format) {
//            var result = format;
//            // formatting
//            for (var key in registeredFormats) {
//                if (registeredFormats.hasOwnProperty(key)) {
//                    result = result.replace(key, registeredFormats[key].format(this));
//                }
//            }
//            return result;
//        };
//
//
//
//        return {
//            setSome: function (xxx) {
//                some = xxx;
//            },
//            getSome: function () {
//                return some;
//            }
//        }
//    };
//
//    window.tempus = Tempus;
//})(window);


//(function (window, undefined) {
//
//    // Core
//    var Tempus = (function () {
//        // private
//        var version = '0.2.0';
//        var settings = {};
//        // undefined needed for time delta.
//
//        console.log(this);
//        // public
//        this.getVersion = function () {
//            return version;
//        };
//        this.date = function (options) {
//            settings.year = options.year;
//            settings.month = options.month;
//            settings.day = options.day;
//            settings.hours = options.hours;
//            settings.minutes = options.minutes;
//            settings.seconds = options.seconds;
//            console.log(this);
//            return this;
//        };
//        this.now = function () {
//            var d = new Date();
//            settings.year = d.getFullYear();
//            settings.month = d.getMonth() + 1;
//            settings.day = d.getDate();
//            settings.hours = d.getHours();
//            settings.minutes = d.getMinutes();
//            settings.seconds = d.getSeconds();
//            console.log(this);
//            return this;
//        };
//        this.getSettings = function() {
//            return settings;
//        };
//        this.isLeapYear = function () {
//            if (settings.year % 4 == 0) {
//                if (settings.year % 100 == 0) {
//                    return settings.year % 400 == 0;
//                } else return true;
//            }
//            return false;
//        };
//
//        return this;
//
//    }());
//
//    // Widgets
//    Tempus = (function (Tempus) {
//        // private variable to store id of a container
//        var container = '';
//
//        Tempus.getById = function (id) {
//
//            container = document.getElementById(id);
//            return this;
//        };
//        return Tempus; // return the extended object
//
//    }(Tempus));
//
//    // exports
//    window.tempus = (function() {
//        return Tempus;
//    })();
//
//})(window);
//
//
//tempus.getVersion();

(function() {
    var _TP = window.TP,
        _Tempus = window.Tempus,
        Tempus;

    Tempus = (function() {
        var version = '0.2.0',
            year = undefined,
            month = undefined,
            day = undefined,
            hours = undefined,
            minutes = undefined,
            seconds = undefined,
            dayOfWeek = undefined,
            leapYear = undefined;

        var getDayOfWeek = function (year, month, day) {
            var t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
            year -= month < 3;
            return Math.floor((year + year / 4 - year / 100 + year / 400 + t[month - 1] + day) % 7);
        };

        var isLeapYear = function (year) {
            if (year % 4 == 0) {
                if (year % 100 == 0) {
                    return year % 400 == 0;
                } else return true;
            }
            return false;
        };

        var dateChange = function(type, newValue) {
            if (year !== undefined && month !== undefined && day !== undefined) {
                dayOfWeek = getDayOfWeek(year, month, day);
            }
            if (year !== undefined && type === 'year') {
                leapYear = isLeapYear(newValue);
            }
        };

        return {
            /**
             * Get or set year.
             * @param value {number|undefined} New year. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            year: function(value) {
                if (value !== undefined) {
                    year = Number(value);
                    dateChange('year', value);
                } else {
                    return year;
                }
                return this;
            },
            /**
             * Get or set month.
             * @param value {number|undefined} New month. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            month: function(value) {
                if (value !== undefined) {
                    month = Number(value);
                    dateChange('month', value);
                } else {
                    return month;
                }
                return this;
            },
            /**
             * Get or set day.
             * @param value {number|undefined} New day. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            day: function(value) {
                if (value !== undefined) {
                    day = Number(value);
                    dateChange('day', value);
                } else {
                    return day;
                }
                return this;
            },
            /**
             * Get or set hours.
             * @param value {number|undefined} New hours. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            hours: function(value) {
                if (value !== undefined) {
                    hours = Number(value);
                    dateChange('hours', value);
                } else {
                    return hours;
                }
                return this;
            },
            /**
             * Get or set minutes.
             * @param value {number|undefined} New minutes. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            minutes: function(value) {
                if (value !== undefined) {
                    minutes = Number(value);
                    dateChange('minutes', value);
                } else {
                    return minutes;
                }
                return this;
            },
            /**
             * Get or set seconds.
             * @param value {number|undefined} New seconds. If undefined, returns numeric value.
             * @returns {Tempus|number|undefined} If setter - Tempus, if getter - number.
             */
            seconds: function(value) {
                if (value !== undefined) {
                    seconds = Number(value);
                    dateChange('seconds', value);
                } else {
                    return seconds;
                }
                return this;
            },
            /**
             * Get day of week.
             * @returns {number|undefined} Numeric value of day of week.
             */
            dayOfWeek: function() {
                return dayOfWeek;
            },
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
             * TP.date({year: 1941, day: 22, month: 6}).leapYear();
             * @example
             * // returns true
             * TP.date({year: 2008, day: 1, month: 1}).leapYear();
             * @example
             * // check current year
             * TP.now().leapYear();
             */
            leapYear: function() {
                return leapYear;
            },
            /**
             * Releases TP variable from global scope.
             * @param all {boolean} If true, Tempus variable also will be released.
             * @returns {Tempus} Tempus object.
             * @example
             * // returns Tempus object
             * var myTempusObj = Tempus.noConflict(true);
            */
            noConflict: function(all) {
                window.TP = _TP;
                if (all === true) {
                    window.Tempus = _Tempus
                }
                return Tempus;
            },
            /**
             * Get a current version of TempusJS.
             * @returns {string} Current version of TempusJS.
             * @example
             * // returns current version
             * TP.getVersion();
             */
            getVersion: function() {
                return version;
            },
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
            now: function () {
                var d = new Date();
                this.year(d.getFullYear());
                this.month(d.getMonth() + 1);
                this.day(d.getDate());
                this.hours(d.getHours());
                this.minutes(d.getMinutes());
                this.seconds(d.getSeconds());
                return this;
            },
            /**
             * Set new date.
             * @param newDate {object|undefined} New date as object {year: number, month: number, day: number,
             *     hours: number, minutes: number, seconds: number} or part of it.
             * @returns {Tempus|object} Tempus object or simply object with date info.
             * @example
             * // returns Tempus object with date {year: 2013, month: 11, day: 13}.
             * TP.date({year: 2013, month: 11, day: 13});
             * @example
             * // returns {year: 2013, month: 10, day: 1}
             * TP.date({year: 2013, month: 10, day: 1}).date();
             */
            date: function(newDate) {
                if (newDate === undefined) {
                    return {
                        year: year,
                        month: month,
                        day: day,
                        hours: hours,
                        minutes: minutes,
                        seconds: seconds,
                        dayOfWeek: dayOfWeek
                    }
                }
                if (typeof newDate === 'object') {
                    this.year(newDate.year);
                    this.month(newDate.month);
                    this.day(newDate.day);
                    this.hours(newDate.hours);
                    this.minutes(newDate.minutes);
                    this.seconds(newDate.seconds);
                }
                return this;
            }


        };
    })();
    window.Tempus = window.TP = Tempus;
})();


// Default formats
//    var locale = 'en_US';
//    var locales = {
//        "en_US": {
//            "monthShortNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//            "monthLongNames": ["January", "February", "March", "April", "May", "June", "July", "August",
//                "September", "October", "November", "December"],
//            "daysShortNames": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
//            "daysLongNames": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//        },
//        "ru_RU": {
//            "monthShortNames": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
//            "monthLongNames": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август",
//                "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
//            "daysShortNames": ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
//            "daysLongNames": ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
//        }
//    };
//    var ;
//    var registeredFormats = {
//        '%d': {
//            format: function (date) {
//                return formattingWithNulls(date.day, 2);
//            },
//            parse: function (value) {
//                var v = Number(value);
//                return {day: (isNaN(v) ? undefined : v) };
//            },
//            parseLit: '\\d{2}'
//        },
//        '%m': {
//            format: function (date) {
//                return formattingWithNulls(date.month, 2);
//            },
//            parse: function (value) {
//                var v = Number(value);
//                return {month: (isNaN(v) ? undefined : v) };
//            },
//            parseLit: '\\d{2}'
//        },
//        '%Y': {
//            format: function (date) {
//                return formattingWithNulls(date.year, 4);
//            },
//            parse: function (value) {
//                var v = Number(value);
//                return {year: (isNaN(v) ? undefined : v) };
//            },
//            parseLit: '\\d{4}'
//        },
//        '%w': {
//            format: function (date) {
//                return getDayOfWeek(date);
//            },
//            parse: function (value) {
//                // impossible
//                return {};
//            },
//            parseLit: '\\d{1}'
//        },
//        '%a': {
//            format: function (date) {
//                return locales[locale]["daysShortNames"][getDayOfWeek(date)];
//            },
//            parse: function (value) {
//                // impossible
//                return {};
//            },
//            parseLit: '\\w+'
//        },
//        '%A': {
//            format: function (date) {
//                return locales[locale]["daysLongNames"][getDayOfWeek(date)];
//            },
//            parse: function (value) {
//                // impossible
//                return {};
//            },
//            parseLit: '\\w+'
//        },
////        '%b': {
////            format: function(date) {
////                return locales[locale]["monthShortNames"][date.month-1];
////            },
////            parse: function(value) {
////                var month = that.getMonthNames().indexOf(value)+1;
////                return {month: month !== -1 ? month : undefined}
////            },
////            parseLit: '\\w+'
////        },
////        '%B': {
////            format: function(date) {
////                return locales[locale]["monthLongNames"][date.month-1];
////            },
////            parse: function(value) {
////                var month = that.getMonthNames(true).indexOf(value)+1;
////                return {month: month !== -1 ? month : undefined}
////            },
////            parseLit: '\\w+'
////        },
//        '%H': {
//            format: function (date) {
//                return formattingWithNulls(date.hours, 2);
//            },
//            parse: function (value) {
//                var v = Number(value);
//                return {hours: (isNaN(v) ? undefined : v) };
//            },
//            parseLit: '\\d{2}'
//        },
//        '%M': {
//            format: function (date) {
//                return formattingWithNulls(date.minutes, 2);
//            },
//            parse: function (value) {
//                var v = Number(value);
//                return {minutes: (isNaN(v) ? undefined : v) };
//            },
//            parseLit: '\\d{2}'
//        },
//        '%S': {
//            format: function (date) {
//                return formattingWithNulls(date.seconds, 2);
//            },
//            parse: function (value) {
//                var v = Number(value);
//                return {seconds: (isNaN(v) ? undefined : v) };
//            },
//            parseLit: '\\d{2}'
//        },
////        '%s': {
////            format: function(date) {
////                return that.time(date);
////            },
////            parse: function(value) {
////                var v = Number(value);
////                var date = new TempusDate(Number(v), timezoneOffset);
////                var obj = that.date(v);
////                return isNaN(v) ? {} : that.incDate(obj, date.getTimezoneOffset(), 'minutes');
////            },
////            parseLit: '\\d{1,10}'
////        },
//        '%F': {
//            format: function (date) {
//                return formattingWithNulls(date.year, 4) + '-' + formattingWithNulls(date.month, 2) + '-' + formattingWithNulls(date.day, 2);
//            },
//            parse: function (value) {
//                var year = Number(value.slice(0, 4));
//                var month = Number(value.slice(6, 7));
//                var day = Number(value.slice(9, 10));
//                return {
//                    year: year,
//                    month: month,
//                    day: day
//                }
//            },
//            parseLit: '\\d{4}-\\d{2}-\\d{2}'
//        },
//        '%D': {
//            format: function (date) {
//                return formattingWithNulls(date.month, 2) + '/' + formattingWithNulls(date.day, 2) + '/' + formattingWithNulls(date.year, 4)
//            },
//            parse: function (value) {
//                var month = Number(value.slice(0, 2));
//                var day = Number(value.slice(3, 5));
//                var year = Number(value.slice(6, 10));
//                return {
//                    year: year,
//                    month: month,
//                    day: day
//                }
//            },
//            parseLit: '\\d{2}\/\\d{2}\/\\d{4}'
//        }
//    };

// Widgets module
(function (TP) {
    TP.getById = function () {
        var container = '';
        TP.getById = function (id) {
            container = document.getElementById(id);
            return this;
        };
    };
})(Tempus);