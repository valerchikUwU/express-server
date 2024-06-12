const webpush = require("web-push");
const Subscriptions = require("../models/subscriptions");
async function webPush(accountId, orderNumber, oldStatus, newStatus) {
  try {
    const subscriptions = await Subscriptions.findAll({
      where: { accountId: accountId },
      attributes: ['endpoint', 'expirationTime', 'keys'],
      raw: true
    });

    console.log(subscriptions)

    const payload = JSON.stringify({
      title: `Статус заказа ${orderNumber} изменен`,
      content: `Статус c ${oldStatus} изменен на ${newStatus}`,
    })
    subscriptions.forEach(subscription => {
      webpush.sendNotification(subscription, payload);
    });
    console.log('Otpravilos')
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

module.exports = { webPush };
