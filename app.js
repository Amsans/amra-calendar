const TODAY = new Date();

function createDayElement(dayNumber, date) {
    const day = document.createElement('div');
    day.className = 'day';

    // Normalize dates for comparison without modifying the original dates
    const dateNormalised = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayNormalised = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());

    if (dateNormalised.getTime() === todayNormalised.getTime()) {
        day.classList.add('today');

        // Add the 'today' indicator (for screen readers)
        const todayIndicator = document.createElement('span');
        todayIndicator.className = 'sr-only';
        todayIndicator.textContent = getTranslation('today');
        day.appendChild(todayIndicator);
    }

    // Tooltip
    day.title = date.toDateString();

    const label = document.createElement('div');
    label.className = 'day-label';

    // Use the current language locale for date formatting
    const currentLocale = getTranslation('locale');
    label.textContent = `${date.getDate()} ${date.toLocaleString(currentLocale, {
        month: 'short',
        year: 'numeric'
    })}`;
    day.appendChild(label);

    return day;
}

function createGroup(label, className, children, containsToday = false) {
    const container = document.createElement('div');
    container.className = className;

    const toggle = document.createElement('span');
    toggle.className = 'toggle-button';

    const content = document.createElement('div');

    // For decada, apply special grid layout
    if (className === 'decada') {
        content.className = 'decada-content';
    }

    // Set default state: collapsed (unless it contains today)
    if (containsToday) {
        content.style.display = className === 'decada' ? 'grid' : 'block';
        toggle.textContent = `▼ ${label}`;
        // Mark this container as containing today for parent reference
        container.dataset.containsToday = 'true';
    } else {
        content.style.display = 'none';
        toggle.textContent = `▶ ${label}`;
    }

    toggle.onclick = () => {
        if (content.style.display === 'none') {
            // When showing content, use the appropriate display type based on class
            content.style.display = className === 'decada' ? 'grid' : 'block';
            toggle.textContent = '▼ ' + label;
        } else {
            content.style.display = 'none';
            toggle.textContent = '▶ ' + label;
        }
    };

    children.forEach(child => content.appendChild(child));

    container.appendChild(toggle);
    container.appendChild(content);
    return container;
}

function generateCalendar(rootEl) {
    let dayCount = 1;
    let currentDate = new Date();
    // Start from the date 1.5 hiliada ago
    currentDate.setDate(currentDate.getDate() - 1500)

    const hiliada = [];
    const todayDate = new Date();
    // Set hours, minutes, seconds, and milliseconds to 0 for date comparison
    const todayDateNormalized = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

    // Track which containers contain today
    let todayHiliadaIndex = -1;
    let todayGekatontadaIndex = -1;
    let todayDecadaIndex = -1;

    for (let h = 0; h < 3; h++) {
        const gekatontadas = [];

        for (let g = 0; g < 10; g++) {
            const decadas = [];

            for (let d = 0; d < 10; d++) {
                const days = [];
                let decadaContainsToday = false;

                for (let i = 0; i < 10; i++) {
                    const dateCopy = new Date(currentDate); // avoid mutation

                    // Check if this day is today
                    const dateNormalized = new Date(dateCopy.getFullYear(), dateCopy.getMonth(), dateCopy.getDate());
                    if (dateNormalized.getTime() === todayDateNormalized.getTime()) {
                        decadaContainsToday = true;
                        todayHiliadaIndex = h;
                        todayGekatontadaIndex = g;
                        todayDecadaIndex = d;
                    }

                    days.push(createDayElement(dayCount++, dateCopy));
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                const decadaLabel = `${getTranslation('decada')} ${d + 1}`;
                decadas.push(createGroup(decadaLabel, 'decada', days, decadaContainsToday));
            }

            const gekatontadaLabel = `${getTranslation('gekatontada')} ${g + 1}`;
            const gekatontadaContainsToday = (h === todayHiliadaIndex && g === todayGekatontadaIndex);
            gekatontadas.push(createGroup(gekatontadaLabel, 'gekatontada', decadas, gekatontadaContainsToday));
        }

        const hiliadaLabel = `${getTranslation('hiliada')} ${h + 1}`;
        const hiliadaContainsToday = (h === todayHiliadaIndex);
        hiliada.push(createGroup(hiliadaLabel, 'hiliada', gekatontadas, hiliadaContainsToday));
    }

    hiliada.forEach(h => rootEl.appendChild(h));
}

// Language selector functionality
function initLanguageSelector() {
    const languageSelect = document.querySelector('#language-select');
    const currentLang = getCurrentLanguage();

    // Set initial language
    languageSelect.value = currentLang;
    document.documentElement.setAttribute('lang', currentLang);

    // Update page translations
    updatePageTranslations();

    // Listen for language changes
    languageSelect.addEventListener('change', function() {
        setLanguage(this.value);
    });
}

// Theme switcher functionality
function initThemeSwitch() {
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Set initial theme from localStorage or system preference
    if (currentTheme === 'dark' || (currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark-theme');
        toggleSwitch.checked = true;
    }

    // Listen for toggle switch change
    toggleSwitch.addEventListener('change', function () {
        if (this.checked) {
            document.documentElement.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // Listen for system theme changes if set to auto
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('theme') === 'auto') {
            if (e.matches) {
                document.documentElement.classList.add('dark-theme');
            } else {
                document.documentElement.classList.remove('dark-theme');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize language selector before generating calendar
    initLanguageSelector();

    const root = document.getElementById('calendar-root');
    generateCalendar(root);
    initThemeSwitch();
});
