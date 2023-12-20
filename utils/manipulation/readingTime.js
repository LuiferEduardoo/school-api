const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const seconds = Math.round((remainingMinutes - Math.floor(remainingMinutes)) * 60);

    return `${hours.toString().padStart(2, '0')}:${remainingMinutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }



const readingTime = (text) => {
    const wordCount = text.split(/\s+/).length;
    const wordsPerMinute = 225; // An average words read per minute
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    return convertMinutesToTime(readingTimeMinutes);
}

module.exports = readingTime;