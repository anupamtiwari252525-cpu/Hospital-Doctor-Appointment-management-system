const Notification = require('../models/Notification');

async function sendNotification({ userId, type, title, message, link = '' }) {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      isRead: false,
    });
    console.log(`[Notification Created] -> User: ${userId} | ${title}: ${message}`);
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    return null;
  }
}

module.exports = {
  sendNotification,
};
