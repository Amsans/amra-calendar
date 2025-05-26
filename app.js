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

    // Create the settings button
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'toggle-container';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const settingsButton = createSettingsButton();

    toggleContainer.appendChild(settingsButton);
    buttonsContainer.appendChild(toggleContainer);

    // Create the Today button
    const todayButtonContainer = document.createElement('div');
    todayButtonContainer.className = 'today-button-container';

    const todayButton = createTodayButton();

    todayButtonContainer.appendChild(todayButton);
    buttonsContainer.appendChild(todayButtonContainer);

    const selectorsContainer = document.createElement('div');
    selectorsContainer.className = 'selectors-container';

    // Create the selectors
    const hiliadaSelector = createSelector('hiliada-selector', getTranslation('hiliada'));
    const gekatontadaSelector = createSelector('gekatontada-selector', getTranslation('gekatontada'));

    selectorsContainer.appendChild(hiliadaSelector);
    selectorsContainer.appendChild(gekatontadaSelector);

    navigationControls.appendChild(buttonsContainer);
    navigationControls.appendChild(selectorsContainer);

    calendarContainer.appendChild(navigationControls);

    // Create decadas grid
    const decadasGrid = document.createElement('div');
    decadasGrid.className = 'decadas-grid';
    calendarContainer.appendChild(decadasGrid);

    // Add the calendar container to the root element
    rootEl.appendChild(calendarContainer);

    initialiseCalendar();
}

function createSettingsButton() {
    const settingsButton = document.createElement('button');
    settingsButton.className = 'toggle-button header-toggle';
    settingsButton.title = getTranslation('settings');
    settingsButton.textContent = '⚙️'; // Gear emoji as an icon
    settingsButton.setAttribute('aria-label', 'Toggle settings');
    settingsButton.addEventListener('click', toggleHeaderControls);
    return settingsButton;
}

function createTodayButton() {
    const todayButton = document.createElement('button');
    todayButton.className = 'today-button';
    todayButton.title = getTranslation('today');
    todayButton.setAttribute('aria-label', 'Today');
    todayButton.addEventListener('click', scrollToCurrentDay);
    todayButton.textContent = getTranslation('today');
    return todayButton;
}

function createSelector(id, labelText) {
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'selector-container';

    const label = document.createElement('label');
    label.textContent = labelText;
    label.htmlFor = id;

    // Create left control button
    const leftButton = document.createElement('button');
    leftButton.className = 'selector-control-button';
    leftButton.textContent = '←';
    leftButton.setAttribute('aria-label', 'Previous');
    leftButton.dataset.direction = 'prev';
    leftButton.dataset.for = id;
    leftButton.addEventListener('click', handleSelectorControlClick);

    // Create select element
    const select = document.createElement('select');
    select.id = id;
    select.setAttribute('aria-label', labelText);

    // Create right control button
    const rightButton = document.createElement('button');
    rightButton.className = 'selector-control-button';
    rightButton.textContent = '→';
    rightButton.setAttribute('aria-label', 'Next');
    rightButton.dataset.direction = 'next';
    rightButton.dataset.for = id;
    rightButton.addEventListener('click', handleSelectorControlClick);

    selectorContainer.appendChild(label);
    selectorContainer.appendChild(leftButton);
    selectorContainer.appendChild(select);
    selectorContainer.appendChild(rightButton);

    return selectorContainer;
}

// Initialise the calendar with the TUT foundation date
function initialiseCalendar() {
    // Start from TUT foundation date (March 1, 1996)
    const startDate = TUT_FOUNDATION_DATE;

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

    // Populate hiliada selector (show a reasonable range, e.g. 20 hiliadas)
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

        // Create the decada label (only showing the decada number)
        const decadaLabel = document.createElement('div');
        decadaLabel.className = 'decada-label';
        decadaLabel.title = getTranslation('decada');

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

            // Create a day element
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

            if (isHoliday(dayDate)) {
                dayElement.classList.add('holiday');
            }

            // Add date display
            const dateDisplay = document.createElement('div');
            dateDisplay.className = 'day-date';
            // Format date as DD/MM
            dateDisplay.textContent = dayDate.toLocaleDateString(getTranslation('locale'), {
                day: '2-digit', month: '2-digit', year: '2-digit'
            });
            dayElement.appendChild(dateDisplay);

            // Add TUT date format display
            const tutDateDisplay = document.createElement('div');
            tutDateDisplay.className = 'day-tut-date';
            let tutDate = getCurrentNumberFormat() === 'roman' ? convertToTUT(dayDate) : dateToArabic(convertToTUT(dayDate));
            tutDateDisplay.textContent = tutDate;
            dayElement.title = `${translateToCommonFormat(dayDate)} \n ${tutDate}`;
            dayElement.appendChild(tutDateDisplay);

            // Add click event to select this day
            dayElement.addEventListener('click', () => {
                // Remove the selected class from all days
                document.querySelectorAll('.day-block').forEach(item => {
                    item.classList.remove('selected');
                });

                // Add the selected class to this day
                dayElement.classList.add('selected');

                // Display selected date information
                displaySelectedDate(dayDate);
            });

            daysGrid.appendChild(dayElement);
        }

        decada.appendChild(daysGrid);

        // Add click event to select this decada
        decadaHeader.addEventListener('click', () => {
            // Remove the selected class from all decadas
            document.querySelectorAll('.decada-item').forEach(item => {
                item.classList.remove('selected');
            });

            // Add the selected class to this decada
            decada.classList.add('selected');

            // Display selected date information
            displaySelectedDate(decadaDate);
        });

        decadasGrid.appendChild(decada);
    }
}

// Display selected date information
function displaySelectedDate(date) {
    // Check if the selected date info container exists, if not, create it
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

    const holidayData = isHoliday(date);
    let hiliadaHtml = '';

    if (holidayData) {
        hiliadaHtml = `
            <div class="holiday-description">${holidayData.description}</div>
        `;
    }

    // Split the common format into weekday and the rest
    let weekday;
    let restOfDate;

    // Check if the format contains a comma (which separates weekday from the rest)
    if (commonFormat.includes(',')) {
        const parts = commonFormat.split(',', 2);
        weekday = parts[0];
        restOfDate = parts[1].trim();
    } else {
        // For formats without a comma, try to extract the weekday (first word)
        const parts = commonFormat.split(' ');
        if (parts.length > 1) {
            weekday = parts[0];
            restOfDate = parts.slice(1).join(' ');
        } else {
            // Fallback if we can't split it
            weekday = '';
            restOfDate = commonFormat;
        }
    }
    if (weekday.length > 0) {
        weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    }


    // Update the content
    selectedDateInfo.innerHTML = `
        <div class="selected-date-container">
            <div class="selected-date-common">
                <div class="weekday">${weekday}</div>
                <div class="rest-of-date">${restOfDate}</div>
            </div>
            <div class="selected-date-tut">${tutFormat}</div>
        </div>
        <div class="holiday-info">
            ${hiliadaHtml}
        </div>
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

// Handle selector control button click
function handleSelectorControlClick(event) {
    const button = event.currentTarget;
    const direction = button.dataset.direction;
    const selectorId = button.dataset.for;
    const selector = document.getElementById(selectorId);

    // Get current value and limits
    const currentValue = parseInt(selector.value);
    const options = selector.options;
    const minValue = parseInt(options[0].value);
    const maxValue = parseInt(options[options.length - 1].value);

    // Calculate new value based on direction
    let newValue;
    if (direction === 'prev') {
        newValue = currentValue > minValue ? currentValue - 1 : maxValue;
    } else {
        newValue = currentValue < maxValue ? currentValue + 1 : minValue;
    }
    selector.value = newValue;

    // Trigger change event to update the calendar
    const changeEvent = new Event('change');
    selector.dispatchEvent(changeEvent);
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

function scrollToCurrentDay() {
    // Calculate current hiliada, gekatontada, and decada
    const startDate = new Date(TUT_FOUNDATION_DATE);
    const today = new Date();
    const daysSinceStart = Math.floor((today - startDate) / ONE_DAY);

    // Calculate hiliada, gekatontada, decada based on days since start
    const currentHiliada = Math.floor(daysSinceStart / 1000) + 1;
    const currentGekatontada = Math.floor((daysSinceStart % 1000) / 100) + 1;

    // Update the selectors to the current values
    const hiliadaSelector = document.getElementById('hiliada-selector');
    const gekatontadaSelector = document.getElementById('gekatontada-selector');

    hiliadaSelector.value = currentHiliada;
    gekatontadaSelector.value = currentGekatontada;

    // Trigger change event to update the calendar
    const changeEvent = new Event('change');
    hiliadaSelector.dispatchEvent(changeEvent);

    // After a short delay to ensure the calendar is updated
    setTimeout(() => {
        // Find the current gekatontada element
        const currentGekatontadaElement = document.querySelector('.gekatontada');
        if (currentGekatontadaElement) {
            // Scroll to the current gekatontada
            currentGekatontadaElement.scrollIntoView({behavior: 'instant', block: 'start'});

            // After a short delay to ensure gekatontada is scrolled
            setTimeout(() => {
                // Find the current decada element
                const currentDecadaElement = document.querySelector('.decada-item.selected');
                if (currentDecadaElement) {
                    // Scroll to the current decada
                    currentDecadaElement.scrollIntoView({behavior: 'instant', block: 'center'});

                    // After a short delay to ensure decada is scrolled
                    setTimeout(() => {
                        // Find today's day block
                        const todayBlock = document.querySelector('.day-block.today');
                        if (todayBlock) {
                            // Scroll to today's day block
                            todayBlock.scrollIntoView({behavior: 'instant', block: 'center'});
                        }
                    }, 300);
                }
            }, 300);
        }
    }, 100);
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

// Number format switch functionality
function initNumberFormatSelector() {
    const numberFormatSwitch = document.querySelector('#number-format-checkbox');
    const currentFormat = localStorage.getItem('numberFormat') || 'roman';

    // Set the initial number format
    numberFormatSwitch.checked = currentFormat === 'arabic';

    // Update the number format translations
    updateNumberFormatLabels();

    // Listen for number format changes
    numberFormatSwitch.addEventListener('change', function () {
        if (this.checked) {
            setNumberFormat('arabic');
        } else {
            setNumberFormat('roman');
        }
    });
}

// Function to get the current number format from localStorage or default to roman
function getCurrentNumberFormat() {
    return localStorage.getItem('numberFormat') || 'roman';
}

// Function to set the number format
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
    const numberFormatSwitch = document.querySelector('#number-format-checkbox');

    // Update the switch label with translated labels
    if (numberFormatSwitch) {
        // Set the aria-label to the translated 'numberFormat'
        numberFormatSwitch.setAttribute('aria-label', getTranslation('toggleNumberFormat'));

        // Update aria-labels for the roman and arabic spans
        const romanSpan = document.querySelector('.roman');
        const arabicSpan = document.querySelector('.arabic');

        if (romanSpan) {
            romanSpan.setAttribute('aria-label', getTranslation('roman'));
        }

        if (arabicSpan) {
            arabicSpan.setAttribute('aria-label', getTranslation('arabic'));
        }
    }

    // Regenerate calendar to update the formats of all the numbers
    const calendarRoot = document.getElementById('calendar-root');
    if (calendarRoot) {
        calendarRoot.innerHTML = '';
        generateCalendar(calendarRoot);
    }
}

// Function to toggle header controls visibility
function toggleHeaderControls() {
    const headerControls = document.querySelector('.header-controls');
    const toggleButton = document.querySelector('.header-toggle');

    headerControls.classList.toggle('visible');

    // Only add the active class temporarily for visual feedback
    if (!headerControls.classList.contains('visible')) {
        toggleButton.classList.remove('active');
    } else {
        toggleButton.classList.add('active');
        // Remove the active class after a short delay
        setTimeout(() => {
            toggleButton.classList.remove('active');
        }, 300);
    }
}

// Add a window resize event listener to handle scrolling when switching between desktop and mobile view
window.addEventListener('resize', () => {
    // Debounce the resize event to avoid excessive function calls
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        scrollToCurrentDecada();
    }, 250);
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialise language selector before generating the calendar
    initLanguageSelector();

    // Initialize number format selector
    initNumberFormatSelector();

    // Calendar is already generated by updatePageTranslations() during language initialization
    initThemeSwitch();
});
