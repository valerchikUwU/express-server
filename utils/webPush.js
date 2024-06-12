const Account = require("../models/account");

const webpush = require("web-push");
const Subscriptions = require("../models/subscriptions");
async function webPush(accountId, orderNumber, oldStatus, newStatus) {
  try {
    const subscription = await Subscriptions.findOne({
      where: { accountId: accountId},
    });
    if (!subscription.endPoint || !subscription) {
      console.log('Subscription not found');
      return; // Если подписка не найдена, прекращаем выполнение функции
    }

    const payload = JSON.stringify({
      title: `Статус заказа ${orderNumber} изменен`,
      content: `Статус c ${oldStatus} изменен на ${newStatus}`,
    })
    await webpush.sendNotification(subscription, payload);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

module.exports = { webPush };
