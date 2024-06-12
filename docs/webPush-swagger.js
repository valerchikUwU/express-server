
/**
 * @swagger
 * /{accountId}/save-subscription:
 *  post:
 *      tags:
 *          - WebPush
 *      summary: Подписаться на уведомления
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      requestBody:
 *        required: false
 *      responses:
 *        200:
 *          description: Подписка успешно сохранена
 *        500:
 *          description: Ошибка при сохранении подписки
 *
 * 
 * 
 * 
 * 
 * 
 * /{accountId}/delete-subscription:
 *  post:
 *      tags:
 *          - WebPush
 *      summary: Отписаться от уведомлений
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      requestBody:
 *        required: false
 *      responses:
 *        200:
 *          description: Подписка успешно удалена
 *        500:
 *          description: Ошибка при удалении подписки
 *
 */
