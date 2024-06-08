 
 
/**
 * @swagger
 * /{accountId}/commisionRecievers/{commisionRecieverId}/balanceDetails/newOperation:                   
 *    post:
 *      tags:
 *          - CommisionRecieverOperations
 *      summary: Запрос POST для создания нового получателя комиссии
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: commisionRecieverId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID получателя комиссии
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  billNumber:
 *                      type: string
 *                      description: Номер счета
 *                      example: "123.43"
 *                  Spisanie:
 *                    type: decimal
 *                    nullable: false
 *                    example: 5000
 *      responses:
 *        200:
 *          description: Поступление для получателя комиссии успешно создано!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */