/**
 * This file contains a set of memorable dates for the TUT calendar.
 * These dates will be highlighted in the calendar when they occur or when a day is n*1000 days after them.
 * The dates should only be edited from this file.
 */

// Set of memorable dates (in Date objects)
// Format: new Date(year, month-1, day)
// Note: Month is 0-indexed (0 = January, 1 = February, etc.)
const MEMORABLE_DATES = [
    new Date(1996, 2, 1), // TUT Foundation Day - March 1, 1996
    new Date(2020, 5, 6), // Declaration of TUT's Day - June 6, 2020
];

/**
 * Checks if a given date is a "hiliada day" - a day that is n*1000 days after a memorable date
 * @param {Date} date - The date to check
 * @returns {boolean} - True if the date is a hiliada day, false otherwise
 */
function isHiliadaDay(date) {
    // Normalise the date to remove the time component
    const normalisedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    for (const memorableDate of MEMORABLE_DATES) {
        // Calculate days between the dates
        const daysDifference = Math.round(Math.abs((normalisedDate - memorableDate) / ONE_DAY));

        // Check if the difference is a multiple of 1000
        if (daysDifference > 0 && daysDifference % 1000 === 0) {
            return true;
        }
    }

    return false;
}
