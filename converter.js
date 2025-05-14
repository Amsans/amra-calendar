const ONE_DAY = 24 * 60 * 60 * 1000;
const TUT_FOUNDATION_DATE = new Date(1996, 2, 1);
const CALENDAR_BASIS = 1110;
const TUT_FORMAT_REGEXP =
    "(M{0,4}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3}))" +
    "\\.((?:X{0,1})(?:IX|IV|V?I{0,3}))" +
    "\\.((?:X{0,1})(?:IX|IV|V?I{0,3}))" +
    "\\.((?:X{0,1})(?:IX|IV|V?I{0,3}))";
const TUT_FORMAT_ARABIC_REGEXP = "([0-9]+)\\.(10|[1-9])\\.(10|[1-9])\\.([0-9]+)";

/**
 * @param dateToConvert - Date object to be converted to TUT format
 * @returns {string|*}
 */
function convertToTUT(dateToConvert) {
    let numberOfDays = Math.round(Math.abs((dateToConvert - TUT_FOUNDATION_DATE) / ONE_DAY)) + 1;
    let baseValue = numberOfDays + CALENDAR_BASIS;
    return convertToTUTFormat(baseValue);
}

/**
 * @param days - string number of days
 * @returns {string|*}
 */
function convertToTUTFormat(days) {
    const regexp = new RegExp("(\\d+)(\\d)(\\d)(\\d)");
    let match = regexp.exec(days);
    if (match) {

        let hiliadaDigit = Number.parseInt(match[1]);
        let gekatontadaDigit = Number.parseInt(match[2]);
        let decadaDigit = Number.parseInt(match[3]);
        let dayOfDecadaDigit = Number.parseInt(match[4]);

        // Going backwards from the last digit to the first
        const dayOfDecada = toRoman(dayOfDecadaDigit);
        if (dayOfDecadaDigit === 0) {
            decadaDigit -= 1;
        }
        const decada = toRoman(decadaDigit);
        if (decadaDigit <= 0) {
            gekatontadaDigit -= 1;
        }
        const gekatontada = toRoman(gekatontadaDigit);
        if (gekatontadaDigit <= 0) {
            hiliadaDigit -= 1;
        }
        const hiliada = toRoman(hiliadaDigit);

        return `${hiliada}.${gekatontada}.${decada}.${dayOfDecada}`;
    }
    return "";
}

/**
 * Convert from TUT format to common format
 * @param tutFormatString
 * @returns {string}
 */
function convertToCommon(tutFormatString) {
    const regex = new RegExp(TUT_FORMAT_REGEXP);
    let match = regex.exec(tutFormatString);
    let digits = "";
    if (match != null) {

        let hiliadaDigit = match[1];
        let gekatontadaDigit = match[2];
        let decadaDigit = match[3];
        let dayOfDecadaDigit = match[4];
        if (hiliadaDigit === "" || gekatontadaDigit === "" || decadaDigit === "" || dayOfDecadaDigit === ""
            || !tutFormatString.endsWith(dayOfDecadaDigit)) {
            return "Неверный формат";
        }
        let hiliada = toArabic(hiliadaDigit);
        let gekatontada = toArabic(gekatontadaDigit);
        let decada = toArabic(decadaDigit);
        let dayOfDecada = toArabic(dayOfDecadaDigit);
        if (dayOfDecada > 10) {
            return "Неверный формат";
        }
        if (dayOfDecada === 10) {
            dayOfDecada = 0;
            decada += 1;
        }
        if (decada >= 10) {
            decada %= 10;
            gekatontada += 1;
        }
        if (gekatontada >= 10) {
            gekatontada %= 10;
            hiliada += 1;
        }

        digits = `${hiliada}${gekatontada}${decada}${dayOfDecada}`;

        let parsedDigits = digits;
        let days = parsedDigits - CALENDAR_BASIS;
        let dateInCommonFormat = TUT_FOUNDATION_DATE.addDays(days - 1);

        return dateInCommonFormat.toLocaleDateString('en-US');
    }
    return 'Неверный формат';
}

function toRoman(num) {
    const roman = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    }
    let str = ''
    if (num === 0) {
        num = 10;
    }
    if (num === -1) {
        num = 9;
    }

    for (const i of Object.keys(roman)) {
        const q = Math.floor(num / roman[i])
        num -= q * roman[i];
        str += i.repeat(q);
    }
    return str;
}

function dateToRoman(tutDateString) {
    const tutRegex = new RegExp(TUT_FORMAT_REGEXP);
    let match = tutRegex.exec(tutDateString);
    if (match != null) {
        return tutDateString;
    } else {
        const tutArabicRegex = new RegExp(TUT_FORMAT_ARABIC_REGEXP);
        let match = tutArabicRegex.exec(tutDateString);
        if (match != null) {
            let hiliadaDigit = match[1];
            let gekatontadaDigit = match[2];
            let decadaDigit = match[3];
            let dayOfDecadaDigit = match[4];
            if (gekatontadaDigit > 10 || decadaDigit > 10 || dayOfDecadaDigit > 10) {
                return "Неверный формат";
            }
            let hiliada = toRoman(hiliadaDigit);
            let gekatontada = toRoman(gekatontadaDigit);
            let decada = toRoman(decadaDigit);
            let dayOfDecada = toRoman(dayOfDecadaDigit);
            return `${hiliada}.${gekatontada}.${decada}.${dayOfDecada}`;
        }
    }
    return tutDateString;
}

function toArabic(number) {
    if (!number) return 0;
    if (number.startsWith("M")) return 1000 + toArabic(number.substring(1));
    if (number.startsWith("CM")) return 900 + toArabic(number.substring(2));
    if (number.startsWith("D")) return 500 + toArabic(number.substring(1));
    if (number.startsWith("CD")) return 400 + toArabic(number.substring(2));
    if (number.startsWith("C")) return 100 + toArabic(number.substring(1));
    if (number.startsWith("XC")) return 90 + toArabic(number.substring(2));
    if (number.startsWith("L")) return 50 + toArabic(number.substring(1));
    if (number.startsWith("XL")) return 40 + toArabic(number.substring(2));
    if (number.startsWith("X")) return 10 + toArabic(number.substring(1));
    if (number.startsWith("IX")) return 9 + toArabic(number.substring(2));
    if (number.startsWith("V")) return 5 + toArabic(number.substring(1));
    if (number.startsWith("IV")) return 4 + toArabic(number.substring(2));
    if (number.startsWith("I")) return 1 + toArabic(number.substring(1));
    throw new Error("something bad happened");
}

function dateToArabic(tutFormatString) {
    const regex = new RegExp(TUT_FORMAT_REGEXP);
    let match = regex.exec(tutFormatString);
    if (match != null) {
        let hiliadaDigit = match[1];
        let gekatontadaDigit = match[2];
        let decadaDigit = match[3];
        let dayOfDecadaDigit = match[4];
        let hiliada = toArabic(hiliadaDigit);
        let gekatontada = toArabic(gekatontadaDigit);
        let decada = toArabic(decadaDigit);
        let dayOfDecada = toArabic(dayOfDecadaDigit);
        return `${hiliada}.${gekatontada}.${decada}.${dayOfDecada}`;
    }
    return tutFormatString;
}

