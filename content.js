document.getElementById("createNotificationBtn").onclick = async () => {
    const nameVal = document.getElementById("notificationName").value;
    const dateVal = document.getElementById("notificationDate").value;

    if (!nameVal || !dateVal) {
        alert("Please provide both a name and a date/time for your notification.");
        return;
    }

    const selectedTime = new Date(dateVal).getTime();
    const currentTime = Date.now();
    const delay = selectedTime - currentTime;

    if (delay <= 0) {
        alert("Please select a future date/time.");
        return;
    }

    const notification = {
        name: nameVal,
        time: selectedTime,
        fired: false,
    };

    chrome.runtime.sendMessage({ action: "addNotification", data: notification });

    console.log(`Notification '${nameVal}' scheduled for ${dateVal}`);
};
