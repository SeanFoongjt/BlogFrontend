function formatTime(timeString) {
    const timeDate = new Date(timeString);
    
    var timeHour = timeDate.getHours();
    var timeMinutes = timeDate.getMinutes();
    var timeString = ""

    if (timeMinutes < 10) {
        timeMinutes = "0" + timeMinutes;
    }

    if (timeHour < 13) {
        timeString = timeHour.toString() + "." + timeMinutes + " a.m.";
    } else if (timeHour == 0) {
        timeString = "12." + timeMinutes + " a.m."
    } else {
        timeString = (timeHour - 12).toString() + "." + timeMinutes + " p.m.";
    }
    
    return timeString;
}

export { formatTime }