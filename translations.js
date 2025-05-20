// Translations for Amra Calendar
const translations = {
    en: {
        // UI elements
        title: 'Calendar of the Teaching of the United Temple',
        darkMode: 'Toggle dark mode',
        // Calendar structure
        hiliada: 'Hiliada',
        gekatontada: 'Gekatontada',
        decada: 'Decada',
        // Date format
        locale: 'en-US',
        today: 'Today'
    },
    ru: {
        // UI elements
        title: 'Календарь Учения Единого Храма',
        darkMode: 'Переключить темный режим',
        // Calendar structure
        hiliada: 'Хилиада',
        gekatontada: 'Гекатонтада',
        decada: 'Декада',
        // Date format
        locale: 'ru-RU',
        today: 'Сегодня'
    },
    es: {
        // UI elements
        title: 'Calendario Hiliada',
        darkMode: 'Alternar modo oscuro',
        // Calendar structure
        hiliada: 'Hiliada',
        gekatontada: 'Gekatontada',
        decada: 'Década',
        // Date format
        locale: 'es-ES',
        today: 'Hoy'
    },
    fr: {
        // UI elements
        title: 'Calendrier Hiliada',
        darkMode: 'Basculer en mode sombre',
        // Calendar structure
        hiliada: 'Hiliada',
        gekatontada: 'Gekatontada',
        decada: 'Décade',
        // Date format
        locale: 'fr-FR',
        today: 'Aujourd\'hui'
    }
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

// Get available languages
function getAvailableLanguages() {
    return Object.keys(translations);
}