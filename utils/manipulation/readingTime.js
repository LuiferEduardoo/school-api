const convertMinutesToTime = require('./convertMinutesToTime');

const readingTime = (text) => {
    const wordCount = text.split(/\s+/).length;
    const wordsPerMinute = 225; // An average words read per minute
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    return convertMinutesToTime(readingTimeMinutes);
}

module.exports = readingTime;