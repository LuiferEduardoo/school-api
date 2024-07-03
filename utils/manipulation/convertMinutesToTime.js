const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math(minutes % 60);
    const seconds = Math.round((minutes % 1) * 60);

    return `${hours.toString().padStart(2, '0')}:${remainingMinutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

module.exports = convertMinutesToTime;