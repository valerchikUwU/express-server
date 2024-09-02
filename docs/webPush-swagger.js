
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
 * /{accountId}/check-subscription:
 *  get:
 *      tags:
 *          - WebPush
 *      summary: Проверка на наличие подписьки
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      requestBody:
 *        properties:
 *          subscription:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                      description: ID подписьки
 *                      format: uuid
 *                      example: 1c12df6d-11ed-46e2-93d9-e91d07c0a6d0
 *                  endpoint:
 *                      type: string
 *                      description: endpoint подписьки
 *                      format: string
 *                      example: https://fcm.googleapis.com/fcm/send/fR9a6nZggUI:APA91bG-ND7KSe5YALm-h8cSW2T3VDD4QvIci8ja0BHSKMRVhy57KZ-hXIYiesturywCE41Nm9DgUt14t3dNA4L7Vd68c-s54cgFLdb1sh9SlSR54wrnwoBkwcf9xwko1niblE9bdTWS
 *                  expirationTime:
 *                      type: string
 *                      description: время жизни
 *                      example: null
 *                  keys:
 *                      type: object
 *                      description: ключи подписьки 
 *                      properties:
 *                          auth:
 *                              type: string
 *                              example: bryvh4RWLIVUb6b3Rb2Iaw
 *                          p256dh:
 *                              type: string
 *                              example: BIuzKvOCNUEehhUjnZAIUK9nd5Te-jvMv5s--8jB9DSauqYRlXU1yLgXiqOtYiPMW-mhEoRsJo-E40qJL0KZQtc
 *                  accountId:
 *                      type: string
 *                      description: время жизни
 *                      format: uuid
 *                      example: 2322df6d-11ed-46e2-93d9-e91d07c0a6d0
 *                  
 *      responses:
 *        200:
 *          description: Подписка успешно удалена
 *        500:
 *          description: Ошибка при удалении подписки
 * 
 *
 */
