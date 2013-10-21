function ready() {
    var tr, td, year, month, day;
    // current time
    document.getElementById('currentTime').innerHTML = tempus.time();
    // leap years
    var domYears = document.getElementById('years');
    var current_year = 2013;
    for (year = 1900; year <= current_year; year++) {
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

    // --- days in month ---
    var MONTH_COUNT = 12;
    var domDaysInMonth = document.getElementById('daysInMonth');
    // th
    var monthNames = tempus.getMonthNames(true);
    tr = document.createElement('tr');
    for (month = 0; month < monthNames.length; month++) {
        td = document.createElement('td');
        td.appendChild(document.createTextNode(monthNames[month]));
        tr.appendChild(td);
    }
    domDaysInMonth.appendChild(tr);
    // counts
    tr = document.createElement('tr');
    for (month = 1; month <= MONTH_COUNT; month++) {
        td = document.createElement('td');
        td.appendChild(document.createTextNode(tempus.getDaysCountInMonth(month)));
        tr.appendChild(td);
    }
    domDaysInMonth.appendChild(tr);

    // --- days array ---
    var domDaysArray = document.getElementById('daysArray');
    // th
    var daysNames = tempus.getDaysNames(true);
    tr = document.createElement('tr');
    for (day = 0; day < daysNames.length; day++) {
        td = document.createElement('td');
        td.appendChild(document.createTextNode(daysNames[day]));
        tr.appendChild(td);
    }
    domDaysArray.appendChild(tr);
    // counts
    var date_begin = {
        year: tempus.now().year,
        month: tempus.now().month,
        day: 1
    };
    var date_end = {
        year: tempus.now().year,
        month: tempus.now().month,
        day: tempus.getDaysCountInMonth(tempus.now().month, tempus.now().year)
    };
    var arr = tempus.getDaysArrayByWeek(date_begin, date_end);
    for (var i = 0; i < arr.length; i++) {
        tr = document.createElement('tr');
        for (var j = 0; j < arr[i].length; j++) {
            td = document.createElement('td');
            td.appendChild(document.createTextNode(arr[i][j] !== null ? arr[i][j].day : ''));
            tr.appendChild(td);
        }
        domDaysArray.appendChild(tr);
    }
}

window.addEventListener("load", ready, false);