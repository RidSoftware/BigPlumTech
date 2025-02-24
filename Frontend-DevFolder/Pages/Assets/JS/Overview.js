/* Overview.js */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Energy Usage Chart (Line Chart)
    const ctxUsage = document.getElementById('energyUsageChart').getContext('2d');
    new Chart(ctxUsage, {
      type: 'line',
      data: {
        labels: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        datasets: [{
          label: 'Energy Usage (kWh)',
          data: [20, 25, 22, 30, 28, 26, 24],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  
    // Initialize Energy Generation Chart (Bar Chart)
    const ctxGen = document.getElementById('energyGenerationChart').getContext('2d');
    new Chart(ctxGen, {
      type: 'bar',
      data: {
        labels: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        datasets: [{
          label: 'Energy Generation (kWh)',
          data: [5, 7, 6, 8, 7, 9, 6],
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  });
  