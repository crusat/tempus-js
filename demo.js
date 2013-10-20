function ready() {
    var tr, td;
    // current time
    document.getElementById('currentTime').innerHTML = tempus.now();
    // leap years
    var domYears = document.getElementById('years');
    var current_year = 2013;
    for (var year = 1900; year <= current_year; year++) {
        if (year % 20 === 0) {
            tr = document.createElement('tr');
        }
        td = document.createElement('td');
        td.appendChild(document.createTextNode(year + (tempus.isLeapYear(year) ? ' Leap': '')));
        tr.appendChild(td);
        if ((year % 10 === 0)||(year === current_year)) {
            domYears.appendChild(tr);
        }
    }
    // days in month
    var MONTH_COUNT = 12;
    var domDaysInMonth = document.getElementById('daysInMonth');
    tr = document.createElement('tr');
    for (var month = 1; month <= MONTH_COUNT; month++) {
        td = document.createElement('td');
        td.appendChild(document.createTextNode(tempus.getDaysCountInMonth(month)));
        tr.appendChild(td);
    }
    domDaysInMonth.appendChild(tr);
}

window.addEventListener("load", ready, false);