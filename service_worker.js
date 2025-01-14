chrome.runtime.onInstalled.addListener(() => {
  updateNotificationsCounter();

  chrome.storage.local.get({ notifications: [] }, ({notifications}) => {  
    let nonFiredNotifications = notifications.filter((n) => !n.fired);
    nonFiredNotifications
      .filter((n) => !n.fired)
      .forEach((notification) => scheduleNotification(notification));
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {  
  if (message.action === "addNotification") {
      const notification = message.data;

      chrome.storage.local.get({ notifications: [] }, (result) => {
          const notifications = result.notifications;
          notifications.push(notification);

          chrome.storage.local.set({ notifications }, () => {
            scheduleNotification(notification);
            updateNotificationsCounter();
          });
      });
  }
});

// Function to schedule a notification
function scheduleNotification(notification) {
  const delay = notification.time - Date.now();
  if (delay > 0) {
      setTimeout(() => {
          chrome.notifications.create({
              type: "basic",
              iconUrl: "images/notification.png",
              title: "Reminder",
              message: notification.name,
          });

          // Mark the notification as fired
          chrome.storage.local.get({ notifications: [] }, (result) => {
              const notifications = result.notifications.map((n) =>
                  n.time === notification.time ? { ...n, fired: true } : n
              );
              chrome.storage.local.set({ notifications }, () => updateNotificationsCounter());
          });
      }, delay);
  }
}

function updateNotificationsCounter() {
  chrome.storage.local.get({ notifications: [] }, ({notifications}) => {
    let nonFiredNotifications = notifications.filter((n) => !n.fired);

    chrome.action.setBadgeText({
      text: '' + nonFiredNotifications.length,
    });
  });
}