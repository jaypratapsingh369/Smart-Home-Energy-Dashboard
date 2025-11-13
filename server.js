const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory data storage (in a real app, this would be a database)
let devices = [
    { id: 1, name: 'Light', room: 'Room 1', status: 'On', usage: 0.5 },
    { id: 2, name: 'AC', room: 'Room 1', status: 'On', usage: 2.0 },
    { id: 3, name: 'Fan', room: 'Room 1', status: 'Off', usage: 0.0 },
    { id: 4, name: 'Light', room: 'Room 2', status: 'On', usage: 0.3 },
    { id: 5, name: 'AC', room: 'Room 2', status: 'Off', usage: 0.0 },
    { id: 6, name: 'Fan', room: 'Room 2', status: 'On', usage: 0.8 }
];

let notifications = [
    'High usage detected in Room 1 AC'
];

let suggestions = [
    'Turn off AC in Room 1 to save 1.2 kWh'
];

let energyData = {
    labels: [],
    datasets: [{
        label: 'Energy Consumption (kWh)',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
};

// API Routes

// Get all devices
app.get('/api/devices', (req, res) => {
    res.json(devices);
});

// Update device status
app.put('/api/devices/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const device = devices.find(d => d.id == id);

    if (device) {
        device.status = status;
        device.usage = status === 'On' ? Math.random() * 2 + 0.5 : 0;
        res.json(device);
    } else {
        res.status(404).json({ error: 'Device not found' });
    }
});

// Get notifications
app.get('/api/notifications', (req, res) => {
    res.json(notifications);
});

// Get suggestions
app.get('/api/suggestions', (req, res) => {
    res.json(suggestions);
});

// Get energy data
app.get('/api/energy', (req, res) => {
    // Simulate real-time data
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

    res.json(energyData);
});

// Simulate real-time updates
setInterval(() => {
    // Randomly update device usages
    devices.forEach(device => {
        if (device.status === 'On') {
            device.usage = Math.max(0, device.usage + (Math.random() - 0.5) * 0.5);
        }
    });

    // Check for over-usage
    devices.forEach(device => {
        if (device.usage > 1.5 && !notifications.includes(`High usage detected in ${device.room} ${device.name}`)) {
            notifications.push(`High usage detected in ${device.room} ${device.name}`);
        }
    });

    // Generate suggestions
    suggestions.length = 0;
    devices.forEach(device => {
        if (device.usage > 1.5) {
            suggestions.push(`Turn off ${device.name} in ${device.room} to save ${device.usage.toFixed(1)} kWh`);
        }
    });
}, 5000);

// Serve the main HTML file for any unmatched routes (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
