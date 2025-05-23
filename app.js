/*
    All the generating logic of the TUT calendar goes here
*/
function generateCalendar(rootEl) {
    // Clear the root element
    rootEl.innerHTML = '';

    // Create the calendar container
    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'calendar-container';

    // Create navigation controls
    const navigationControls = document.createElement('div');
    navigationControls.className = 'calendar-navigation';

    // Add hiliada selector
    const hiliadaSelector = createSelector('hiliada-selector', getTranslation('hiliada'));

    // Add gekatontada selector
    const gekatontadaSelector = createSelector('gekatontada-selector', getTranslation('gekatontada'));

    // Add the selectors to navigation controls
    navigationControls.appendChild(hiliadaSelector);
    navigationControls.appendChild(gekatontadaSelector);

    // Add navigation controls to the calendar container
    calendarContainer.appendChild(navigationControls);

    // Create decadas grid
    const decadasGrid = document.createElement('div');
    decadasGrid.className = 'decadas-grid';
    calendarContainer.appendChild(decadasGrid);

    // Add the calendar container to the root element
    rootEl.appendChild(calendarContainer);

    // Initialize the calendar with the TUT foundation date
    initializeCalendar();
}

// Helper function to create a selector
function createSelector(id, labelText) {
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'selector-container';

    const label = document.createElement('label');
    label.textContent = labelText;
    label.htmlFor = id;

    const select = document.createElement('select');
    select.id = id;
    select.setAttribute('aria-label', labelText);

    selectorContainer.appendChild(label);
    selectorContainer.appendChild(select);

    return selectorContainer;
}

// Initialize the calendar with the TUT foundation date
function initializeCalendar() {
    // Start from TUT foundation date (March 1, 1996)
    const startDate = new Date(TUT_FOUNDATION_DATE);

    // Calculate current hiliada, gekatontada, and decada
    const today = new Date();
    const daysSinceStart = Math.floor((today - startDate) / ONE_DAY);

    // Calculate hiliada, gekatontada, decada based on days since start
    // Each decada has 10 days
    // Each gekatontada has 10 decadas (100 days)
    // Each hiliada has 10 gekatontadas (1000 days)
    const currentHiliada = Math.floor(daysSinceStart / 1000) + 1;
    const currentGekatontada = Math.floor((daysSinceStart % 1000) / 100) + 1;
    const currentDecada = Math.floor((daysSinceStart % 100) / 10) + 1;

    // Populate hiliada selector (show a reasonable range, e.g., 20 hiliadas)
    populateSelector('hiliada-selector', 1, 20, currentHiliada);

    // Populate gekatontada selector (1-10)
    populateSelector('gekatontada-selector', 1, 10, currentGekatontada);

    // Display decadas for the current gekatontada
    displayDecadas(currentHiliada, currentGekatontada, currentDecada);

    // Scroll to current decada/day in mobile or zoomed view
    scrollToCurrentDecada();

    // Add event listeners to selectors
    document.getElementById('hiliada-selector').addEventListener('change', handleSelectorChange);
    document.getElementById('gekatontada-selector').addEventListener('change', handleSelectorChange);

    // Display today's date information
    displaySelectedDate(today);

    // Add a title to the calendar
    addCalendarTitle();
}

// Populate a selector with options
function populateSelector(selectorId, start, end, selected) {
    const selector = document.getElementById(selectorId);
    selector.innerHTML = '';

    for (let i = start; i <= end; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = getCurrentNumberFormat() === 'roman' ? toRoman(i) : i;

        if (i === selected) {
            option.selected = true;
        }
        selector.appendChild(option);
    }
}

// Display decadas for the selected hiliada and gekatontada
function displayDecadas(hiliada, gekatontada, selectedDecada) {
    const decadasGrid = document.querySelector('.decadas-grid');
    decadasGrid.innerHTML = '';

    // Create 10 decadas (1-10)
    for (let d = 1; d <= 10; d++) {
        const decada = document.createElement('div');
        decada.className = 'decada-item';
        if (d === selectedDecada) {
            decada.classList.add('selected');
        }

        // Create decada header
        const decadaHeader = document.createElement('div');
        decadaHeader.className = 'decada-header';

        // Calculate the date for this decada
        const decadaDate = calculateDecadaDate(hiliada, gekatontada, d);

        // Create decada label (only showing the decada number)
        const decadaLabel = document.createElement('div');
        decadaLabel.className = 'decada-label';

        // Use the appropriate number format based on user preference
        decadaLabel.textContent = getCurrentNumberFormat() === 'roman' ? toRoman(d) : d;

        // Add header elements
        decadaHeader.appendChild(decadaLabel);
        decada.appendChild(decadaHeader);

        // Create days grid for this decada
        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';

        // Create 10 days for this decada
        for (let day = 1; day <= 10; day++) {
            // Calculate the date for this specific day
            const dayDate = calculateDayDate(hiliada, gekatontada, d, day);

            // Create day element
            const dayElement = document.createElement('div');
            dayElement.className = 'day-block';

            // Add month-specific class for styling
            const month = dayDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
            dayElement.classList.add(`month-${month}`);

            // Check if this day is today
            const today = new Date();
            const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const dayNormalized = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());

            if (dayNormalized.getTime() === todayNormalized.getTime()) {
                dayElement.classList.add('today');
                dayElement.classList.add('selected');
            }

            // Add date display
            const dateDisplay = document.createElement('div');
            dateDisplay.className = 'day-date';
            // Format date as DD/MM
            dateDisplay.textContent = dayDate.toLocaleDateString(getTranslation('locale'), {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            });
            dayElement.appendChild(dateDisplay);

            // Add TUT date display
            const tutDateDisplay = document.createElement('div');
            tutDateDisplay.className = 'day-tut-date';
            let tutDate = getCurrentNumberFormat() === 'roman' ? convertToTUT(dayDate) : dateToArabic(convertToTUT(dayDate));
            tutDateDisplay.textContent = tutDate;
            dayElement.title = `${translateToCommonFormat(dayDate)} \n ${tutDate}`;
            dayElement.appendChild(tutDateDisplay);

            // Add click event to select this day
            dayElement.addEventListener('click', () => {
                // Remove selected class from all days
                document.querySelectorAll('.day-block').forEach(item => {
                    item.classList.remove('selected');
                });

                // Add selected class to this day
                dayElement.classList.add('selected');

                // Display selected date information
                displaySelectedDate(dayDate);
            });

            daysGrid.appendChild(dayElement);
        }

        decada.appendChild(daysGrid);

        // Add click event to select this decada
        decadaHeader.addEventListener('click', () => {
            // Remove selected class from all decadas
            document.querySelectorAll('.decada-item').forEach(item => {
                item.classList.remove('selected');
            });

            // Add selected class to this decada
            decada.classList.add('selected');

            // Display selected date information
            displaySelectedDate(decadaDate);
        });

        decadasGrid.appendChild(decada);
    }
}

// Display selected date information
function displaySelectedDate(date) {
    // Check if the selected date info container exists, if not create it
    let selectedDateInfo = document.querySelector('.selected-date-info');

    if (!selectedDateInfo) {
        selectedDateInfo = document.createElement('div');
        selectedDateInfo.className = 'selected-date-info';
        document.querySelector('.calendar-container').appendChild(selectedDateInfo);
    }

    // Format the date in different formats
    let commonFormat = translateToCommonFormat(date);

    // Use the appropriate number format based on user preference
    let tutFormat = getCurrentNumberFormat() === 'roman' ? convertToTUT(date) : dateToArabic(convertToTUT(date));

    // Update the content
    selectedDateInfo.innerHTML = `
        <div class="selected-date-common">${commonFormat}</div>
        <div class="selected-date-tut">${tutFormat}</div>
    `;
}

// Calculate the date for a specific decada
function calculateDecadaDate(hiliada, gekatontada, decada) {
    // Calculate days since TUT foundation date
    const daysSinceStart = (hiliada - 1) * 1000 + (gekatontada - 1) * 100 + (decada - 1) * 10;

    // Create a new date by adding days to the foundation date
    const decadaDate = new Date(TUT_FOUNDATION_DATE);
    decadaDate.setDate(decadaDate.getDate() + daysSinceStart);

    return decadaDate;
}

// Calculate the date for a specific day within a decada
function calculateDayDate(hiliada, gekatontada, decada, day) {
    // Calculate days since TUT foundation date
    const daysSinceStart = (hiliada - 1) * 1000 + (gekatontada - 1) * 100 + (decada - 1) * 10 + (day - 1);

    // Create a new date by adding days to the foundation date
    const dayDate = new Date(TUT_FOUNDATION_DATE);
    dayDate.setDate(dayDate.getDate() + daysSinceStart);

    return dayDate;
}

// Handle selector change events
function handleSelectorChange() {
    const hiliada = parseInt(document.getElementById('hiliada-selector').value);
    const gekatontada = parseInt(document.getElementById('gekatontada-selector').value);

    // Default to decada 1 when changing hiliada or gekatontada
    displayDecadas(hiliada, gekatontada, 1);

    // Update the selected date information for the first decada
    const decadaDate = calculateDecadaDate(hiliada, gekatontada, 1);
    displaySelectedDate(decadaDate);

    scrollToCurrentDecada();
}

function scrollToCurrentDecada() {
    setTimeout(() => {
        const selectedDecada = document.querySelector('.decada-item.selected');
        if (selectedDecada) {
            selectedDecada.scrollIntoView({alignToTop: true, behavior: 'smooth', block: 'center'});

            // Find today's day block if it exists
            const todayBlock = document.querySelector('.day-block.today');
            if (todayBlock) {
                // Scroll to today's day block after a short delay to ensure decada is scrolled first
                setTimeout(() => {
                    todayBlock.scrollIntoView({behavior: 'smooth', block: 'center'});
                }, 300);
            }
        }
    }, 100); // Short delay to ensure DOM is rendered
}

// Add a title to the calendar
function addCalendarTitle() {
    const calendarContainer = document.querySelector('.calendar-container');

    // Create title element
    const titleElement = document.createElement('div');
    titleElement.className = 'calendar-title';

    // Create title text element
    const titleTextElement = document.createElement('div');
    titleTextElement.className = 'calendar-title-text';
    titleTextElement.textContent = getTranslation('title');
    titleElement.appendChild(titleTextElement);

    // // Move header controls to calendar title
    // const headerControls = document.querySelector('.header-controls');
    // if (headerControls) {
    //     titleElement.appendChild(headerControls);
    // }

    // Insert at the beginning of the container
    calendarContainer.insertBefore(titleElement, calendarContainer.firstChild);
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
    languageSelect.addEventListener('change', function () {
        setLanguage(this.value);
    });
}

// Theme switcher functionality
function initThemeSwitch() {
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Set the initial theme from localStorage or system preference
    if (currentTheme === 'dark' || (currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark-theme');
        toggleSwitch.checked = true;
    }

    // Listen for a toggle switch change
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

// Number format selector functionality
function initNumberFormatSelector() {
    const numberFormatSelect = document.querySelector('#number-format-select');
    // Set initial number format
    numberFormatSelect.value = localStorage.getItem('numberFormat') || 'roman';

    // Update the number format translations
    updateNumberFormatLabels();

    // Listen for number format changes
    numberFormatSelect.addEventListener('change', function () {
        setNumberFormat(this.value);
    });
}

// Function to get current number format from localStorage or default to roman
function getCurrentNumberFormat() {
    return localStorage.getItem('numberFormat') || 'roman';
}

// Function to set number format
function setNumberFormat(format) {
    if (format === 'roman' || format === 'arabic') {
        localStorage.setItem('numberFormat', format);
        updateNumberFormatLabels();
        return true;
    }
    return false;
}

// Function to update all number format labels on the page
function updateNumberFormatLabels() {
    const numberFormatSelect = document.querySelector('#number-format-select');

    // Update the select label and options with translated labels
    if (numberFormatSelect) {
        // Set the aria-label to the translated 'numberFormat'
        numberFormatSelect.setAttribute('aria-label', getTranslation('numberFormat'));

        // Update option labels
        const options = numberFormatSelect.querySelectorAll('option');
        options.forEach(option => {
            if (option.value === 'roman') {
                option.textContent = getTranslation('roman');
            } else if (option.value === 'arabic') {
                option.textContent = getTranslation('arabic');
            }
        });
    }

    // Regenerate calendar to update the number formats
    const calendarRoot = document.getElementById('calendar-root');
    if (calendarRoot) {
        calendarRoot.innerHTML = '';
        generateCalendar(calendarRoot);
    }
}

// Add window resize event listener to handle scrolling when switching between desktop and mobile view
window.addEventListener('resize', () => {
    // Debounce the resize event to avoid excessive function calls
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        scrollToCurrentDecada();
    }, 250);
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize language selector before generating the calendar
    initLanguageSelector();

    // Initialize number format selector
    initNumberFormatSelector();

    // Calendar is already generated by updatePageTranslations() during language initialization
    initThemeSwitch();
});
