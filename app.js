const TODAY = new Date();

function createDayElement(dayNumber, date) {
    const day = document.createElement('div');
    day.className = 'day';
    if (date.setHours(0,0,0,0) === TODAY.setHours(0,0,0,0)) {
        day.classList.add('today');
    }

    // Tooltip
    day.title = date.toDateString();

    const label = document.createElement('div');
    label.className = 'day-label';
    label.textContent = `${date.getDate()} ${date.toLocaleString('ru-RU', {
        month: 'short',
        year: 'numeric'
    })}`;
    day.appendChild(label);

    return day;
}

function createGroup(label, className, children) {
    const container = document.createElement('div');
    container.className = className;

    const toggle = document.createElement('span');
    toggle.className = 'toggle-button';
    toggle.textContent = `▼ ${label}`;
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

    const content = document.createElement('div');

    // For decada, apply special grid layout
    if (className === 'decada') {
        content.className = 'decada-content';
    }

    children.forEach(child => content.appendChild(child));

    container.appendChild(toggle);
    container.appendChild(content);
    return container;
}

function generateCalendar(rootEl) {
    let dayCount = 1;
    let currentDate = new Date('2025-05-01');

    const hiliada = [];

    for (let h = 0; h < 3; h++) {
        const gekatontadas = [];

        for (let g = 0; g < 10; g++) {
            const decadas = [];

            for (let d = 0; d < 10; d++) {
                const days = [];

                for (let i = 0; i < 10; i++) {
                    const dateCopy = new Date(currentDate); // avoid mutation
                    days.push(createDayElement(dayCount++, dateCopy));
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                decadas.push(createGroup(`Decada ${d + 1}`, 'decada', days));
            }

            gekatontadas.push(createGroup(`Gekatontada ${g + 1}`, 'gekatontada', decadas));
        }

        hiliada.push(createGroup(`Hiliada ${h + 1}`, 'hiliada', gekatontadas));
    }

    hiliada.forEach(h => rootEl.appendChild(h));
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
    const root = document.getElementById('calendar-root');
    generateCalendar(root);
    initThemeSwitch();
});
