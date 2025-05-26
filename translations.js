// Translations for Amra Calendar
const translations = {
    en: {
        title: 'Calendar of the Teaching of the United Temple',
        darkMode: 'Toggle dark mode',
        hiliada: 'Hiliada',
        gekatontada: 'Gekatontada',
        decada: 'Decada',
        locale: 'en-US',
        today: 'Today',
        settings: 'Settings',
        numberFormat: 'Number format',
        toggleNumberFormat: 'Toggle number format',
        // Dates
        prophet: "Birthday of the founder of the Teaching",
        foundation: "Foundation Day of the Teaching",
        declaration: "Declaration Day. The day when the Declaration of the Teaching, the first programmatic document, was established.",
        pandect: "Pandect Day. The day when its first text was recorded.",
        cosmonautics: "Cosmonautics Day. The day when the first human spaceflight was accomplished.",
        hiliada_first: "First day of the hiliada",
        hiliada_last: "Last day of the hiliada",
    },
    ru: {
        title: 'Календарь Учения Единого Храма',
        darkMode: 'Переключить темный режим',
        hiliada: 'Хилиада',
        gekatontada: 'Гекатонтада',
        decada: 'Декада',
        locale: 'ru-RU',
        today: 'Сегодня',
        settings: 'Настройки',
        numberFormat: 'Формат чисел',
        toggleNumberFormat: 'Переключить формат чисел',
        // Dates
        prophet: "День рождения основателя Учения.",
        foundation: "День основания Учения.",
        declaration: "День Декларации. День, когда появилась Декларация Учения, первый программный документ.",
        pandect: "День пандэкта. День, когда был записан первый его текст.",
        cosmonautics: "День космонавтики. День, когда был совершён первый полёт человека в космос.",
        hiliada_first: "Первый день хилиады",
        hiliada_last: "Последний день хилиады",
    },
    de: {
        title: 'Kalender der Lehre des Vereinigten Tempels',
        darkMode: 'Dunkelmodus umschalten',
        hiliada: 'Hiliada',
        gekatontada: 'Gekatontada',
        decada: 'Dekade',
        locale: 'de-DE',
        today: 'Heute',
        settings: 'Einstellungen',
        numberFormat: 'Zahlenformat',
        toggleNumberFormat: 'Zahlenformat umschalten',
        // Dates
        prophet: "Geburtstag des gründers der Lehre",
        foundation: "Tag der Gründung der Lehre",
        declaration: "Tag der Deklaration. Der tag, an dem die Deklaration der Lehre, das erste programmatische dokument, entstand.",
        pandect: "Tag der Pandekt. Der tag, an dem der erste text davon niedergeschrieben wurde.",
        cosmonautics: "Tag der Kosmonauten. Der tag, an dem der erste bemannte raumflug stattfand.",
        hiliada_first: "Erster Tag der hiliada",
        hiliada_last: "Letzter Tag der hiliada",
    },
    be: {
        title: 'Каляндар Вучэння Адзінага Храма',
        darkMode: 'Пераключыць цёмны рэжым',
        hiliada: 'Хіліяда',
        gekatontada: 'Гекатантада',
        decada: 'Дэкада',
        locale: 'be-BY',
        today: 'Сёння',
        settings: 'Налады',
        numberFormat: 'Фармат лічбаў',
        toggleNumberFormat: 'Пераключыць фармат лічбаў',
        // Dates
        prophet: "Дзень нараджэння заснавальніка Вучэння.",
        foundation: "Дзень заснавання Вучэння.",
        declaration: "Дзень Дэкларацыі. Дзень, калі з'явілася Дэкларацыя Вучэння, першы праграмны дакумент.",
        pandect: "Дзень пандэкта. Дзень, калі быў запісаны першы яго тэкст.",
        cosmonautics: "Дзень касманаўтыкі. Дзень, калі быў выкананы першы палёт чалавека ў космас.",
        hiliada_first: "Першы дзень хіліяды",
        hiliada_last: "Апошні дзень хіліяды",
    }
};

const beLocale = {
    weekdays: ['нядзеля', 'панядзелак', 'аўторак', 'серада', 'чацвер', 'пятніца', 'субота'],
    months: [
        'студзеня', 'лютага', 'сакавіка', 'красавіка', 'траўня', 'чэрвеня',
        'ліпеня', 'жніўня', 'верасня', 'кастрычніка', 'лістапада', 'снежня'
    ]
};

// Function to get translation
function getTranslation(key, lang) {
    const currentLang = lang || getCurrentLanguage();
    return translations[currentLang][key] || translations['en'][key] || key;
}

// Function to get the current language from localStorage or default to English
function getCurrentLanguage() {
    // If localStorage is empty (first time loading), default to English
    if (!localStorage.getItem('language')) {
        return 'en';
    }

    // Otherwise use the stored language or fall back to English if not supported
    const lang = localStorage.getItem('language') ||
        'en';

    // Check if the language is supported, otherwise fall back to English
    return translations[lang] ? lang : 'en';
}

// Function to set language
function setLanguage(lang) {
    if (translations[lang]) {
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('lang', lang);
        updatePageTranslations();
        return true;
    }
    return false;
}

// Function to update all translations on the page
function updatePageTranslations() {
    const lang = getCurrentLanguage();

    // Update page title
    document.title = getTranslation('title', lang);

    // Update header title
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) {
        headerTitle.textContent = getTranslation('title', lang);
    }

    // Update the number format switch aria-label
    const numberFormatSwitch = document.querySelector('#number-format-checkbox');
    if (numberFormatSwitch) {
        const numberFormatLabel = document.querySelector('.number-format-switch');
        numberFormatLabel.title = getTranslation('toggleNumberFormat', lang);

        numberFormatSwitch.setAttribute('aria-label', getTranslation('toggleNumberFormat', lang));

        // Update aria-labels for the Roman and Arabic spans
        const romanSpan = document.querySelector('.roman');
        const arabicSpan = document.querySelector('.arabic');

        if (romanSpan) {
            romanSpan.setAttribute('aria-label', getTranslation('roman', lang));
        }

        if (arabicSpan) {
            arabicSpan.setAttribute('aria-label', getTranslation('arabic', lang));
        }
    }

    // Update dark mode toggle aria-label
    const darkModeToggle = document.querySelector('#checkbox');
    if (darkModeToggle) {
        darkModeToggle.setAttribute('aria-label', getTranslation('darkMode', lang));
    }

    // Regenerate calendar with a new language
    const calendarRoot = document.getElementById('calendar-root');
    if (calendarRoot) {
        calendarRoot.innerHTML = '';
        generateCalendar(calendarRoot);
    }
}

function translateToCommonFormat(date) {
    let commonFormat;
    let locale = getTranslation('locale');
    if (locale === 'be-BY') {
        const weekday = beLocale.weekdays[date.getDay()];
        const day = date.getDate();
        const month = beLocale.months[date.getMonth()];
        const year = date.getFullYear();

        commonFormat = `${weekday}, ${day} ${month} ${year}`;
    } else {
        commonFormat = date.toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    return commonFormat;
}
