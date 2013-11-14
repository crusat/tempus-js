(function (TP) {
    /**
     * Just wrapper on setTimeout, this timeout in seconds (not a milliseconds).
     * @param callback {function} Callback.
     * @param timeout {number} Int or float number, timeout.
     * @returns {number} Default setTimeout identify.
     * @example
     * // Show message over 2 seconds.
     * var t = TP.setTimeout(function() {
     *     alert("Hello over 2 seconds!");
     * }, 2);
     * @example
     * // Show message over 0.5 seconds.
     * var t = TP.setTimeout(function() {
     *     alert("Hello over 0.5 seconds!");
     * }, 0.5);
     */
    TP.setTimeout = function(callback, timeout) {
        return setTimeout(callback, Number(timeout)*(this.options().useMilliseconds ? 1 : 1000));
    };

    /**
     * Just wrapper on setInterval, this timeout in seconds (not a milliseconds).
     * @param callback {function} Callback.
     * @param timeout {number} Int or float number, timeout.
     * @returns {number} Default setInterval identify.
     * @example
     * //  "Hello again!" 3x times every 2 seconds;
     * var x = 3;
     * var t = TP.setInterval(function() {
     *     x--;
     *     if (x === 0) {
     *         clearInterval(t);
     *     };
     *     alert("Hello again!");
     * }, 2);
     */
    TP.setInterval = function(callback, timeout) {
        return setInterval(callback, Number(timeout)*(this.options().useMilliseconds ? 1 : 1000));
    };

    /**
     * Clock. Every second callback is calling with parameter "date".
     * "date" - is current date object. Also run callback immediately after starting.
     * @param callback {function} Callback.
     * @returns {number} Default setInterval identify.
     * @example
     * // Clock example
     * &lt;div id="tempus-clock-example"&gt;&lt;/div&gt;
     * &lt;script&gt;
     * var clock = TP.clock(function(date) {
     *     document.getElementById('tempus-clock-example').innerHTML = TP.date(date).format("%H:%M:%S");
     * });
     * &lt;/script&gt;
     */
    TP.clock = function(callback) {
        callback(TP.now());
        return TP.setInterval(function() {
            callback(TP.now());
        }, (this.options().useMilliseconds ? 1000 : 1));
    };

    /**
     * Alarms at [date]. After alarming self-destructs.
     *
     * Live Demo: http://plnkr.co/edit/lORJQp?p=preview
     * @param date {object} Tempus date object (see {@link date}).
     * @param callback {function} Callback.
     * @returns {number} Default setInterval identify.
     * @example
     * // Over 20 seconds show message "Alarmed at ..."
     * var alarmAt = TP.incDate(TP.now(), 20, 'seconds');
     * document.getElementById('tempus-alarm-example').innerHTML = TP.format('%H:%M:%S %d.%m.%Y');
     * var a = TP.alarm(function(date) {
     *     alert('Alarmed at '+tempus.format(date, '%H:%M:%S %d.%m.%Y'));
     * });
     */
//    TP.alarm = function(callback) {
//        var a = TP.setInterval(function() {
//            if (TP.between(TP.now(), this, 'seconds') === 0) {
//                callback(this);
//                clearInterval(a);
//            }
//        }, (this.options().useMilliseconds ? 1000 : 1));
//        return a;
//    };
})(Tempus);