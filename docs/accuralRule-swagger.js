
/**
 * @swagger
 * /{accountId}/commisionRecievers/{commisionRecieverId}/rulesDetails/update:
 *  put:
 *      tags:
 *          - AccrualRule
 *      summary: Запрос PUT для обновления ВСЕХ! Правил начисления
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
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                      rulesToUpdate:
 *                                        type: array
 *                                        items:
 *                                          type: object
 *                                          properties:
 *                                            productTypeId:
 *                                              type: integer
 *                                              description: ID категории
 *                                              example: 3
 *                                            productId:
 *                                              type: string
 *                                              description: ID товара
 *                                              format: uuid
 *                                              example: '2222df6d-11ed-46e2-93d9-e91d07c0a6d0'
 *                                            accessType:
 *                                              type: string
 *                                              description: Тип доступа
 *                                              example: 'Бумажный'
 *                                            generation:
 *                                              type: string
 *                                              description: Поколение товара
 *                                              example: 'Второе поколения'
 *                                            commision:
 *                                                type: decimal
 *                                                description: Коммиссия
 *                                                example: 550
 *      responses:
 *        200:
 *          description: Правила успешно обновлены
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *
 * 
 * /{accountId}/{commisionRecieverId}/newRule:
 *  post:
 *      tags:
 *          - AccrualRule
 *      summary: Запрос POST для создания ВСЕХ! Правил начисления
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
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                      rulesToCreate:
 *                                        type: array
 *                                        items:
 *                                          type: object
 *                                          properties:
 *                                            productTypeId:
 *                                              type: integer
 *                                              description: ID категории
 *                                              example: 3
 *                                            productId:
 *                                              type: string
 *                                              description: ID товара
 *                                              format: uuid
 *                                              example: '2222df6d-11ed-46e2-93d9-e91d07c0a6d0'
 *                                            accessType:
 *                                              type: string
 *                                              description: Тип доступа
 *                                              example: 'Бумажный'
 *                                            generation:
 *                                              type: string
 *                                              description: Поколение товара
 *                                              example: 'Второе поколения'
 *                                            commision:
 *                                                type: decimal
 *                                                description: Коммиссия
 *                                                example: 550
 *      responses:
 *        200:
 *          description: Правила успешно обновлены
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *
 * 
 * 
 * 
 * 
 * /{accountId}/{{commisionRecieverId}/{ruleId}/delete:
 *       delete:
 *           tags:
 *               - AccrualRule
 *           summary: Удалить правило начисления
 *           parameters:
 *             - in: path
 *               name: accountId
 *               required: true
 *               schema:
 *                 type: string
 *                 format: uuid
 *               description: ID пользователя
 *             - in: path
 *               name: commisionRecieverId
 *               required: true
 *               schema:
 *                 type: integer
 *               description: ID получателя комиссии
 *             - in: path
 *               name: ruleId
 *               required: true
 *               schema:
 *                 type: integer
 *               description: ID правила начисления
 *           responses:
 *             200:
 *               description: Правило успешно удалено!
 *             404:
 *               description: Правило не найдено!
 *             403:
 *               description: У вас нет прав доступа или вы были заблокированы!
 */
