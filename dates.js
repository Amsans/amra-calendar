/**
 * This file contains a set of memorable dates for the TUT calendar.
 * These dates will be highlighted in the calendar when they occur or when a day is n*1000 days after them.
 * The dates should only be edited from this file.
 */

// Set of memorable dates with descriptions
// Format: { date: new Date(year, month-1, day), description: "Description text" }
// Note: Month is 0-indexed (0 = January, 1 = February, etc.)
const MEMORABLE_DATES = [
    { date: new Date(1961, 3, 12), descriptionKey: "cosmonautics" },
    { date: new Date(1982, 10, 25), descriptionKey: "prophet" },
    { date: new Date(1996, 2, 1), descriptionKey: "foundation" },
    { date: new Date(1995, 8, 14), descriptionKey: "pandect" },
    { date: new Date(2020, 5, 10), descriptionKey: "declaration" },
];

/**
 * Checks if a given date is a memorable date
 * @param {Date} date - The date to check
 * @returns {Object|null} - Object with memorable date info, or null if not a holiday
 */
function isHoliday(date) {
    const lang = getCurrentLanguage();
    for (const memorableDate of MEMORABLE_DATES) {
        if (date.getMonth() === memorableDate.date.getMonth() && date.getDate() === memorableDate.date.getDate()) {
            return {
                memorableDate: memorableDate.date,
                description: getTranslation(memorableDate.descriptionKey, lang),
            };
        }
    }
    return null;
}
