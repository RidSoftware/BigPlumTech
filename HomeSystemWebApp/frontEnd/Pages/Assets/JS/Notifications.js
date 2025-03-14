// Notifications.js - Updated
document.addEventListener("DOMContentLoaded", function() {
  // Get user type from localStorage (set during login)
  const userType = localStorage.getItem("userType") || "user"; // default to user
  const storageKey = `notifications_${userType}`;
  
  // Notification templates
  const notificationTemplates = {
      user: [
          { event: 'device-on', message: (device) => `${device} turned on` },
          { event: 'device-off', message: (device) => `${device} turned off` },
          { event: 'energy-alert', message: () => `Energy usage above normal` }
      ],
      homemanager: [
          { event: 'system-alert', message: (msg) => `System Alert: ${msg}` },
          { event: 'maintenance', message: (date) => `Scheduled maintenance on ${date}` },
          { event: 'security', message: (zone) => `Motion detected in ${zone}` }
      ]
  };

  // Load or initialize notifications
  let notifications = JSON.parse(localStorage.getItem(storageKey)) || [];
  if (notifications.length === 0) {
      notifications = generateInitialNotifications(userType);
      localStorage.setItem(storageKey, JSON.stringify(notifications));
  }

  const notificationList = document.getElementById("notification-list");

  // Render notifications
  function renderNotifications() {
      notificationList.innerHTML = "";
      notifications.forEach((notif) => {
          const li = document.createElement("li");
          li.innerHTML = `
              <i class="fa fa-bell notification-icon"></i>
              <div class="notification-text">
                  <p>${notif.message}</p>
                  <small>${notif.timestamp}</small>
              </div>
          `;
          notificationList.appendChild(li);
      });
  }

  // Generate initial notifications based on user type
  function generateInitialNotifications(userType) {
      const templates = notificationTemplates[userType];
      return [
          createNotification(templates[0], userType === 'user' ? 'Living Room Light' : ''),
          createNotification(templates[1], userType === 'user' ? 'Kitchen Light' : 'Security System'),
          createNotification(templates[2], userType === 'user' ? '' : new Date().toLocaleDateString())
      ];
  }

  // Create notification object
  function createNotification(template, ...args) {
      return {
          message: template.message(...args),
          timestamp: new Date().toLocaleString(),
          eventType: template.event
      };
  }

  // Simulate real-time events (demo purposes)
  setInterval(() => {
      const templates = notificationTemplates[userType];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      const newNotif = createNotification(randomTemplate, 
          userType === 'user' ? randomDevice() : randomHomeManagerSubject()
      );
      
      notifications.unshift(newNotif); // Add to beginning
      localStorage.setItem(storageKey, JSON.stringify(notifications));
      renderNotifications();
  }, 15000); // Add new notification every 15 seconds

  // Demo helpers
  function randomDevice() {
      const devices = ['Bedroom Light', 'Garage Door', 'Thermostat', 'Security Camera'];
      return devices[Math.floor(Math.random() * devices.length)];
  }

  function randomHomeManagerSubject() {
      const subjects = ['Backyard', 'Front Door', 'HVAC System', 'Network'];
      return subjects[Math.floor(Math.random() * subjects.length)];
  }

  // Clear notifications
  document.getElementById("clearNotifications").addEventListener("click", () => {
      notifications = [];
      localStorage.removeItem(storageKey);
      renderNotifications();
  });

  // Initial render
  renderNotifications();
});