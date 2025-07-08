class DateTimeFormatting {
    // Format options
    static formatOptions = {
        timeStyle: "short",
    };
    // Undefined being passed reverts to the runtimes default locale
    static formatter = new Intl.DateTimeFormat(undefined, this.formatOptions);

    /**
     * Format time to follow the HH:MM a.m./p.m. format. This is done via the format method of the
     * Intl.DateTimeFormat class.
     * @param {string} timeString string representing time to be formatted
     * @returns 
     */
    static formatTime(timeString) {
        return this.formatter.format(new Date(timeString));
    }

    /**
     * Return a formatted string corresponding to the time when the function is called
     * @returns String with current time correctly formatted
     */
    static getCurrTimeFormatted() {
        const currDate = new Date(Date.now());
        return this.formatter.format(currDate);
    }
}

export { DateTimeFormatting };