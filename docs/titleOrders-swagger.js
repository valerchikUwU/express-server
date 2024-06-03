/**
 * @swagger
 * /{accountId}/orders/{orderId}/delete/{titleId}:
 *  delete:
 *      tags:
 *          - TitleOrders
 *      summary: Запрос DELETE для удаления ОДНОГО! TitleOrder в заказе
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: orderId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID заказа
 *        - in: path
 *          name: titleId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID наименования
 *      responses:
 *        200:
 *          description: Наименование успешно удалено!
 *        404:
 *          description: Наименование не найдено!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * /{accountId}/orders/admin/{orderId}/update:
 *  put:
 *      tags:
 *          - TitleOrders
 *      summary: Запрос PUT для обновления ВСЕХ! TitleOrder в заказе от лица админа
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: orderId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID заказа
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                      status:
 *                                        type: string
 *                                        enum: ['Черновик', 'Черновик депозита', 'Активный', 'Выставлен счёт', 'Оплачен', 'Отправлен', 'Получен', 'Отменен']
 *                                        example: 'Активный' 
 *                                      organizationName:
 *                                        type: string
 *                                        description: Название организации-клиента
 *                                        example: 'Уфа'
 *                                      billNumber:
 *                                        type: string
 *                                        description: Номер счета
 *                                        example: '23ФЗ|22'
 *                                      payeeId:
 *                                        type: string
 *                                        format: uuid
 *                                        description: ID получателя платежа
 *                                        example: '1c12df6d-11ed-46e2-93d9-e91d07c0a6d0'
 *                                      isFromDeposit:
 *                                        type: boolean
 *                                        description: Флаг, указывающий на списание с депозита
 *                                        example: true
 *                                      titlesToUpdate:
 *                                        type: array
 *                                        items:
 *                                          type: object
 *                                          properties:
 *                                            id:
 *                                              type: string
 *                                              description: ID наименования
 *                                              format: uuid
 *                                              example: '1c12df6d-11ed-46e2-93d9-e91d07c0a6d0'
 *                                            productId:
 *                                              type: string
 *                                              description: ID товара
 *                                              format: uuid
 *                                              example: '2222df6d-11ed-46e2-93d9-e91d07c0a6d0'
 *                                            accessType:
 *                                              type: string
 *                                              description: Тип доступа
 *                                              example: 'Бумажный'
 *                                            addBooklet:
 *                                              type: boolean
 *                                              description: Флаг добавления брошюры к заказу (если true, то accessType устанавливается в null)
 *                                              example: false
 *                                            generation:
 *                                              type: string
 *                                              description: Поколение товара
 *                                              example: 'Второе поколения'
 *                                            quantity:
 *                                                type: integer
 *                                                description: Количество товара 
 *                                                example: 20
 *      responses:
 *        200:
 *          description: Наименования успешно обновлены
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * /{accountId}/orders/{orderId}/update:
 *  put:
 *      tags:
 *          - TitleOrders
 *      summary: Запрос PUT для обновления ВСЕХ! TitleOrder в заказе от лица пользователя
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: orderId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID заказа
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  titlesToUpdate:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                  type: string
 *                                                  description: ID наименования
 *                                                  format: uuid
 *                                                  example: 1c12df6d-11ed-46e2-93d9-e91d07c0a6d0
 *                                              productId:
 *                                                  type: string
 *                                                  description: ID товара
 *                                                  format: uuid
 *                                                  example: 2222df6d-11ed-46e2-93d9-e91d07c0a6d0
 *                                              accessType:
 *                                                  type: string
 *                                                  description: Тип доступа
 *                                                  example: Бумажный
 *                                              addBooklet:
 *                                                  type: boolean
 *                                                  description: Флаг добавления брошюры к заказу (если true, то accessType устанавливается в null) 
 *                                                  example: false
 *                                              generation:
 *                                                  type: string
 *                                                  description: Поколение товара 
 *                                                  example: Второе поколения
 *                                              quantity:
 *                                                  type: integer
 *                                                  description: Количество товара 
 *                                                  example: 20
 *      responses:
 *        200:
 *          description: Наименования успешно обновлены
 *        400:
 *          description: Выберите тип доступа!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */
