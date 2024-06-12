const Account = require("../models/account");

async function sendNotifications(accountId, orderNumber, oldStatus, newStatus) {
  try {
    const subscription = await Account.findOne({
      where: { id: accountId, isSignedUpPush: true },
    });
    if (!subscription) {
      console.log('Subscription not found');
      return; // Если подписка не найдена, прекращаем выполнение функции
    }

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: `Статус заказа ${orderNumber} изменен`,
        content: `Статус c ${oldStatus} изменен на ${newStatus}`,
      })
    );
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

module.exports = { sendNotifications };
