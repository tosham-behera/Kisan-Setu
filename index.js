document.addEventListener('DOMContentLoaded', () => {
    const weatherStatus = document.getElementById('weather-status');
    const lastUpdated = document.getElementById('last-updated');
    const backToTop = document.getElementById('back-to-top');

    if (weatherStatus) {
        const now = new Date();
        const timeText = now.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit'
        });

        weatherStatus.textContent = `Weather and mandi data refreshed at ${timeText}.`;
    }

    if (lastUpdated) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString([], {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const formattedTime = now.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit'
        });

        lastUpdated.textContent = `Last updated: ${formattedDate} at ${formattedTime}`;
    }

    if (backToTop) {
        backToTop.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});