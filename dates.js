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

// Each last day of gekatontada has its own holiday
const GEKATONTADA_DATES = {
    1 : "creator_day",
    2 : "truth_day",
    3 : "warrior_day",
    4 : "lovers_day",
    5 : "came_day",
    6 : "gone_day",
    7 : "source_day",
    8 : "mankind_day",
    9 : "eternal_people_day",
    10 : "teaching_day",
}

/**
 * Checks if a given date is a memorable date or the first/last day of a hiliada
 * @param {Date} date - The date to check
 * @returns {Array<Object>} - Array of holiday info objects (empty if none)
 */
function isHoliday(date) {
    const lang = getCurrentLanguage();
    const results = [];

    // Check if it's a memorable date (could be multiple on the same day)
    for (const memorableDate of MEMORABLE_DATES) {
        if (date.getMonth() === memorableDate.date.getMonth()
            && date.getDate() === memorableDate.date.getDate()
            && date.getFullYear() >= memorableDate.date.getFullYear()) {
            results.push({
                memorableDate: memorableDate.date,
                description: getTranslation(memorableDate.descriptionKey, lang),
            });
        }
    }

    // Convert to TUT format and parse parts of the date
    const tutDate = dateToArabic(convertToTUT(date));
    const dateParts = tutDate.split('.');

    const gekatontada = parseInt(dateParts[1]);
    const decada = parseInt(dateParts[2]);
    const day = parseInt(dateParts[3]);

    // Hiliada first day
    if (gekatontada === 1 && decada === 1 && day === 1) {
        // First day of hiliada: gekatontada=1, decada=1, day=1
        results.push({
            memorableDate: date,
            description: getTranslation('hiliada_first', lang),
        });
    }
    // Hiliada last day
    if (gekatontada === 10 && decada === 10 && day === 10) {
        // Last day of hiliada: gekatontada=10, decada=10, day=10
        results.push({
            memorableDate: date,
            description: getTranslation('hiliada_last', lang),
        });
    }
    // Last gekatontada day
    if (decada === 10 && day === 10) {
        results.push({
            memorableDate: date,
            description: getTranslation(GEKATONTADA_DATES[gekatontada], lang),
        })
    }

    return results;
}
