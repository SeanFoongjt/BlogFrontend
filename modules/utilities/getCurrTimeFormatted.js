/**
 * Return a formatted string corresponding to the time that the function is called
 * @returns String with current time correctly formatted
 */
function getCurrTimeFormatted() {
    const currDate = new Date(Date.now());
    // Get and parse time
    
    var timeHour = currDate.getHours();
    var timeMinutes = currDate.getMinutes();
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

export { getCurrTimeFormatted }