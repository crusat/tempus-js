//(function (window, undefined) {
//
//    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//    var version = '0.2.0';
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
//    var getDayOfWeek = function (date) {
//        var year = date.year;
//        var month = date.month;
//        var day = date.day;
//        var t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
//        year -= month < 3;
//        return Math.floor((year + year / 4 - year / 100 + year / 400 + t[month - 1] + day) % 7);
//    };
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
        var version = '0.2.0';

        return {
            year: undefined,
            month: undefined,
            day: undefined,
            hours: undefined,
            minutes: undefined,
            seconds: undefined,
            /**
             * Releases TP variable from global scope.
             * @param all {boolean} If true, Tempus variable also will been released.
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
             * Tempus.getVersion();
             */
            getVersion: function() {
                return version;
            },
            /**
             * Set a current date.
             * @returns {Tempus}
             */
            now: function () {
                var d = new Date();
                this.year = d.getFullYear();
                this.month = d.getMonth() + 1;
                this.day = d.getDate();
                this.hours = d.getHours();
                this.minutes = d.getMinutes();
                this.seconds = d.getSeconds();
                return this;
            },
            /**
             * Set new date.
             * @param newDate {object} New date as object {year: number, month: number, day: number,
             *     hours: number, minutes: number, seconds: number} or part of it.
             * @returns {Tempus} Tempus object.
             */
            date: function(newDate) {
                if (typeof newDate === 'object') {
                    this.year = newDate.year;
                    this.month = newDate.month;
                    this.day = newDate.day;
                    this.hours = newDate.hours;
                    this.minutes = newDate.minutes;
                    this.seconds = newDate.seconds;
                }
                return this;
            }
        };
    })();
    window.Tempus = window.TP = Tempus;
})();


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