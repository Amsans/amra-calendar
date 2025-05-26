/**
 * This file contains a set of memorable dates for the TUT calendar.
 * These dates will be highlighted in the calendar when they occur.
 * The dates should only be edited from this file.
 */

// Set of memorable dates with descriptions
// Format: { date: new Date(year, month-1, day), description: "Description text" }
// Note: Month is 0-indexed (0 = January, 1 = February, etc.)
const MEMORABLE_DATES = [
    {date: new Date(1961, 3, 12), descriptionKey: "cosmonautics"},
    {date: new Date(1982, 10, 25), descriptionKey: "prophet"},
    {date: new Date(1996, 2, 1), descriptionKey: "foundation"},
    {date: new Date(1995, 8, 14), descriptionKey: "pandect"},
    {date: new Date(2020, 5, 10), descriptionKey: "declaration"},
];

/**
 * Checks if a given date is a memorable date or the first/last day of a hiliada
 * @param {Date} date - The date to check
 * @returns {Object|null} - Object with holiday info, or null if not a holiday
 */
function isHoliday(date) {
    const lang = getCurrentLanguage();
    // Check if it's a memorable date
    for (const memorableDate of MEMORABLE_DATES) {
        if (date.getMonth() === memorableDate.date.getMonth()
            && date.getDate() === memorableDate.date.getDate()
            && date.getFullYear() >= memorableDate.date.getFullYear()) {
            return {
                memorableDate: memorableDate.date,
                description: getTranslation(memorableDate.descriptionKey, lang),
            };
        }
    }

    // Convert to TUT format and parse parts of the date
    const tutDate = dateToArabic(convertToTUT(date));
    const dateParts = tutDate.split('.');

    const gekatontada = parseInt(dateParts[1]);
    const decada = parseInt(dateParts[2]);
    const day = parseInt(dateParts[3]);

    if (gekatontada === 1 && decada === 1 && day === 1) {
        // First day of hiliada: gekatontada=1, decada=1, day=1
        return {
            memorableDate: date,
            description: getTranslation('hiliada_first', lang),
        };
    } else if (gekatontada === 10 && decada === 10 && day === 10) {
        // Last day of hiliada: gekatontada=10, decada=10, day=10
        return {
            memorableDate: date,
            description: getTranslation('hiliada_last', lang),
        };
    }

    return null;
}
