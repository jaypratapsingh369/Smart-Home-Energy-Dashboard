// Analytics page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Weekly consumption chart
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    const weeklyChart = new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Energy Consumption (kWh)',
                data: [12.5, 14.2, 11.8, 15.3, 13.7, 16.1, 14.9],
                backgroundColor: 'rgba(102, 126, 234, 0.6)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Peak usage hours chart
    const peakCtx = document.getElementById('peakHoursChart').getContext('2d');
    const peakChart = new Chart(peakCtx, {
        type: 'line',
        data: {
            labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
            datasets: [{
                label: 'Average Usage (kWh)',
                data: [2.1, 3.2, 2.8, 4.1, 3.5, 5.2, 7.8, 6.3, 4.2],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
