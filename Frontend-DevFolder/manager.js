document.addEventListener('DOMContentLoaded', () => {
    // Update the time immediately, then every second
    updateTime();
    setInterval(updateTime, 1000);
  
    // If you want dynamic data for the usage/cost, you could update it here
    // e.g., fetch from an API or do calculations, then:
    // document.getElementById('currentKW').textContent = '2.3';
    // document.getElementById('dailyUsage').textContent = '50 kWh';
    // document.getElementById('estimatedCost').textContent = '£5.50';
  });
  
  function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
  
    // 12-hour format
    const isAm = hours < 12;
    const displayHour = hours % 12 || 12;
    const displayMin = minutes < 10 ? '0' + minutes : minutes;
    const amPm = isAm ? 'AM' : 'PM';
  
    const timeString = `${displayHour}:${displayMin} ${amPm}`;
    document.getElementById('currentTime').textContent = timeString;
  }
  