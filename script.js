// API base URL
const API_BASE = 'http://localhost:3000/api';

// Global data variables
let energyData = {
    labels: [],
    datasets: [{
        label: 'Energy Consumption (kWh)',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
};

let devices = [];
let notifications = [];
let suggestions = [];

// Initialize the chart
const ctx = document.getElementById('energyChart').getContext('2d');
const energyChart = new Chart(ctx, {
    type: 'line',
    data: energyData,
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Function to update the energy chart with new data
function updateEnergyChart() {
    const now = new Date();
    const timeLabel = now.getHours() + ':' + now.getMinutes();
    energyData.labels.push(timeLabel);
    const totalUsage = devices.reduce((sum, device) => sum + device.usage, 0);
    energyData.datasets[0].data.push(totalUsage);

    // Keep only last 10 data points
    if (energyData.labels.length > 10) {
        energyData.labels.shift();
        energyData.datasets[0].data.shift();
    }

    energyChart.update();
}

// Function to update device status table
function updateDeviceTable() {
    const tbody = document.querySelector('#deviceTable tbody');
    tbody.innerHTML = '';

    devices.forEach((device, index) => {
        const row = document.createElement('tr');
        if (device.usage > 1.5) {
            row.classList.add('over-usage');
        }

        const toggleBtn = document.createElement('button');
        toggleBtn.className = `toggle-btn ${device.status === 'Off' ? 'off' : ''}`;
        toggleBtn.textContent = device.status === 'On' ? 'Turn Off' : 'Turn On';
        toggleBtn.onclick = () => toggleDevice(index);

        row.innerHTML = `
            <td>${device.name}</td>
            <td>${device.room}</td>
            <td>${device.status}</td>
            <td>${device.usage.toFixed(1)}</td>
            <td></td>
        `;
        row.lastElementChild.appendChild(toggleBtn);

        tbody.appendChild(row);
    });
}

// Function to toggle device status
async function toggleDevice(index) {
    const device = devices[index];
    const newStatus = device.status === 'On' ? 'Off' : 'On';

    try {
        const response = await fetch(`${API_BASE}/devices/${device.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            const updatedDevice = await response.json();
            // Update local data
            Object.assign(device, updatedDevice);
            updateDeviceTable();
            updateEnergyChart();
        } else {
            console.error('Failed to update device status');
        }
    } catch (error) {
        console.error('Error updating device:', error);
    }
}

// Function to update notifications
function updateNotifications() {
    const ul = document.getElementById('notificationList');
    ul.innerHTML = '';

    notifications.forEach(notification => {
        const li = document.createElement('li');
        li.textContent = notification;
        ul.appendChild(li);
    });
}

// Function to update suggestions
function updateSuggestions() {
    const div = document.getElementById('suggestionBox');
    div.innerHTML = '';

    suggestions.forEach(suggestion => {
        const p = document.createElement('p');
        p.textContent = suggestion;
        div.appendChild(p);
    });
}

// Fetch data from API
async function fetchData() {
    try {
        const [devicesRes, notificationsRes, suggestionsRes, energyRes] = await Promise.all([
            fetch(`${API_BASE}/devices`),
            fetch(`${API_BASE}/notifications`),
            fetch(`${API_BASE}/suggestions`),
            fetch(`${API_BASE}/energy`)
        ]);

        devices = await devicesRes.json();
        notifications = await notificationsRes.json();
        suggestions = await suggestionsRes.json();
        energyData = await energyRes.json();

        updateDeviceTable();
        updateNotifications();
        updateSuggestions();
        energyChart.data = energyData;
        energyChart.update();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize the dashboard
fetchData();

// Update every 5 seconds
setInterval(fetchData, 5000);
