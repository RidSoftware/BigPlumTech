/* Notifications.js */
document.addEventListener("DOMContentLoaded", function() {
    // Retrieve stored notifications from localStorage (if any)
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    
    // If there are no notifications, add some sample notifications for demonstration
    if (notifications.length === 0) {
      notifications = [
        { message: "Living Room Light turned on.", timestamp: new Date().toLocaleString() },
        { message: "Kitchen Appliance went offline.", timestamp: new Date().toLocaleString() },
        { message: "Energy consumption spike detected.", timestamp: new Date().toLocaleString() }
      ];
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
    
    const notificationList = document.getElementById("notification-list");
    
    // Render notifications in the list
    function renderNotifications() {
      notificationList.innerHTML = "";
      notifications.forEach((notif, index) => {
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
    
    renderNotifications();
    
    // Clear all notifications when the clear button is clicked
    document.getElementById("clearNotifications").addEventListener("click", function() {
      localStorage.removeItem("notifications");
      notifications = [];
      renderNotifications();
    });
  });
  