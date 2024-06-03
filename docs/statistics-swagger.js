 /**
 * @swagger
 * /{accountId}/statistics:
 *  get:
 *      tags:
 *          - Statistics
 *      summary: Запрос GET для получения статистики продаж (Если статус заказа "Оплачен")
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      responses:
 *        200:
 *          description: Статистика продаж
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: Статистика продаж
 *                    order:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                              id:
 *                                type: string
 *                                format: uuid
 *                                example: "4afc1f16-752d-41c2-951b-59db3e170bed"
 *                              dispatchDate:
 *                                type: string
 *                                format: date-time
 *                                example: "2024-06-22T10:57:47.000Z"
 *                              status:
 *                                type: string
 *                                example: "Оплачен"
 *                              billNumber:
 *                                type: string
 *                                nullable: true
 *                                example: 123.2
 *                              createdBySupAdm:
 *                                type: boolean
 *                                example: false
 *                              orderNumber:
 *                                type: integer
 *                                example: 36
 *                              isFromDeposit:
 *                                type: boolean
 *                                example: false
 *                              createdAt:
 *                                type: string
 *                                format: date-time
 *                                example: "2024-05-13T10:57:47.000Z"
 *                              updatedAt:
 *                                type: string
 *                                format: date-time
 *                                example: "2024-05-13T12:05:06.000Z"
 *                              organizationCustomerId:
 *                                type: string
 *                                example: "4asf36-752d-41c2-951b-59db3e170bed"
 *                              payeeId:
 *                                type: string
 *                                example: "23511f16-752d-41c2-951b-59db3e170bed"
 *                              accountId:
 *                                type: string
 *                                example: "555c1f16-752d-41c2-951b-59db3e170bed"
 *                              SUM:
 *                                type: string
 *                                example: "515200"
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */