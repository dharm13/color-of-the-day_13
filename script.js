document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('color-form');
    const dateInput = document.getElementById('date');
    const searchHistory = document.getElementById('search-history');
    const clearButton = document.getElementById('clear-history');

    form.addEventListener('submit', async(event) => {
        event.preventDefault();
        const userDate = dateInput.value;

        if (!userDate) {
            alert("Please select a date.");
            return;
        }

        try {
            const response = await fetch(`https://colors.zoodinkers.com/api?date=${userDate}`);
            const data = await response.json();
            saveSearchHistory(userDate, data.hex, data.name);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    clearButton.addEventListener('click', () => {
        localStorage.removeItem('searchHistory');
        searchHistory.innerHTML = '';
    });

    function saveSearchHistory(date, color, name) {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

        const existingEntry = history.find(entry => entry.date === date);
        if (existingEntry) {
            existingEntry.color = color;
            existingEntry.name = name;
        } else {
            history.push({ date, color, name });
        }

        localStorage.setItem('searchHistory', JSON.stringify(history));
        displaySearchHistory();
    }

    function displaySearchHistory() {
        searchHistory.innerHTML = '';
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

        const table = document.createElement('table');
        table.classList.add('table');

        const headerRow = document.createElement('tr');
        const colorHeader = document.createElement('th');
        colorHeader.textContent = 'Color';
        headerRow.appendChild(colorHeader);
        const dateHeader = document.createElement('th');
        dateHeader.textContent = 'Date';
        headerRow.appendChild(dateHeader);
        table.appendChild(headerRow);

        history.forEach(entry => {
            const row = document.createElement('tr');
            const colorCell = document.createElement('td');
            const colorBox = document.createElement('div');
            colorBox.classList.add('color-box');
            colorBox.style.backgroundColor = entry.color;
            colorCell.appendChild(colorBox);
            row.appendChild(colorCell);
            const dateCell = document.createElement('td');
            dateCell.textContent = entry.date;
            row.appendChild(dateCell);
            table.appendChild(row);
        });

        searchHistory.appendChild(table);
    }

    displaySearchHistory();
});