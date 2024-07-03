const convertMinutesToTime = require('./convertMinutesToTime');

const readingTime = (text) => {
    const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;
    const wordsPerMinute = 225; // An average words read per minute
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    return convertMinutesToTime(readingTimeMinutes);
}

module.exports = readingTime;