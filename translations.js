// Translations for Amra Calendar
const translations = {
    en: {
        title: 'Calendar of the Teaching of the United Temple',
        darkMode: 'Toggle dark mode',
        hiliada: 'Hiliada',
        gekatontada: 'Gekatontada',
        decada: 'Decada',
        locale: 'en-US',
        today: 'Today'
    },
    ru: {
        title: 'Календарь Учения Единого Храма',
        darkMode: 'Переключить темный режим',
        hiliada: 'Хилиада',
        gekatontada: 'Гекатонтада',
        decada: 'Декада',
        locale: 'ru-RU',
        today: 'Сегодня'
    },
    de: {
        title: 'Kalender der Lehre des Vereinigten Tempels',
        darkMode: 'Dunkelmodus umschalten',
        hiliada: 'Hiliada',
        gekatontada: 'Gekatontada',
        decada: 'Dekade',
        locale: 'de-DE',
        today: 'Heute'
    },
    be: {
        title: 'Каляндар Вучэння Адзінага Храма',
        darkMode: 'Пераключыць цёмны рэжым',
        hiliada: 'Хіліяда',
        gekatontada: 'Гекатантада',
        decada: 'Дэкада',
        locale: 'be-BY',
        today: 'Сёння'
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

// Function to get current language from localStorage or default to browser language
function getCurrentLanguage() {
    const lang = localStorage.getItem('language') ||
        navigator.language.split('-')[0] ||
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

    // Update dark mode toggle aria-label
    const darkModeToggle = document.querySelector('#checkbox');
    if (darkModeToggle) {
        darkModeToggle.setAttribute('aria-label', getTranslation('darkMode', lang));
    }

    // Regenerate calendar with new language
    const calendarRoot = document.getElementById('calendar-root');
    if (calendarRoot) {
        calendarRoot.innerHTML = '';
        generateCalendar(calendarRoot);
    }
}

function translateToCommonFormat(date) {
    let commonFormat;
    if (getTranslation('locale') === 'be-BY') {
        const weekday = beLocale.weekdays[date.getDay()];
        const day = date.getDate();
        const month = beLocale.months[date.getMonth()];
        const year = date.getFullYear();

        commonFormat = `${weekday}, ${day} ${month} ${year}`;
    } else {
        commonFormat = date.toLocaleDateString(getTranslation('locale'), {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    return commonFormat;
}
