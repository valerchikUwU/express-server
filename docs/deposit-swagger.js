

/**
 * @swagger
 * /{accountId}/deposits:
 *  get:
 *      tags:
 *          - Deposit
 *      summary: Запрос GET для получения всех остатков на депозитах
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
 *          description: Список остатков депозитов организаций
 *          content:
 *            application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      title:
 *                        type: string
 *                        description: Список депозитов организаций
 *                        example: Список депозитов организаций
 *                      organizations:
 *                        type: array
 *                        description: Список организаций и их остатки на депозитах
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              description: Уникальный идентификатор организации
 *                              example: "0056ac9c-e398-410d-8185-1196ead4a8b8"
 *                            organizationName:
 *                              type: string
 *                              description: Название организации
 *                              example: Уфа
 *                            createdAt:
 *                              type: string
 *                              format: date-time
 *                              example: 2024-05-01 17:25:00
 *                            updatedAt:
 *                              type: string
 *                              format: date-time
 *                              example: 2024-05-01 17:25:00
 *                            SUM:
 *                              type: string
 *                              description: Сумма всех заказов
 *                              example: 390000
 *                            allDeposits:
 *                              type: string
 *                              description: Сумма всех депозитов
 *                              example: 50000
 *                              
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *
 * 
 * 
 * 
 * 
 * 
 * /{accountId}/deposits/{organizationCustomerId}:
 *  get:
 *      tags:
 *          - Deposit
 *      summary: Запрос GET для получения всех остатков на депозитах
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: organizationCustomerId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID организации
 *      responses:
 *        200:
 *          description: История депозитов организации
 *          content:
 *            application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      title:
 *                        type: string
 *                        description: История депозитов организации
 *                        example: История депозитов организации
 *                      organization:
 *                        type: object
 *                        description: Выбранная организация
 *                        $ref: '#/components/schemas/OrganizationCustomer'
 *                      orders:
 *                        type: array
 *                        description: Список заказов (депозитов)
 *                        items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: string
 *                                      format: uuid
 *                                      description: Уникальный идентификатор заказа
 *                                      example: "2670eba2-3b9a-4e72-8bfd-aa2d0c576423"
 *                                  dispatchDate:
 *                                      type: string
 *                                      nullable: true
 *                                      description: Дата отправления заказа
 *                                      example: null
 *                                  status:
 *                                      type: string
 *                                      description: Статус заказа
 *                                      example: "Активный"
 *                                  billNumber:
 *                                      type: string
 *                                      nullable: true
 *                                      description: Номер счета
 *                                      example: 2345/f22
 *                                  createdBySupAdm:
 *                                      type: boolean
 *                                      description: Флаг, указывающий, создан ли заказ супериАдмином
 *                                      example: false
 *                                  orderNumber:
 *                                      type: integer
 *                                      description: Номер заказа
 *                                      example: 158
 *                                  isFromDeposit:
 *                                      type: boolean
 *                                      description: Флаг, указывающий, снимаются ли средства с депозита по данному заказу
 *                                      example: false
 *                                  createdAt:
 *                                      type: string
 *                                      format: date-time
 *                                      description: Дата создания заказа
 *                                      example: "2024-05-22T13:37:48.000Z"
 *                                  updatedAt:
 *                                      type: string
 *                                      format: date-time
 *                                      description: Дата последнего обновления информации о заказе
 *                                      example: "2024-05-22T13:37:56.000Z"
 *                                  organizationCustomerId:
 *                                      type: string
 *                                      format: uuid
 *                                      description: ID клиента организации
 *                                      example: "b6612bd1-b356-4d56-8411-978bee4f3872"
 *                                  payeeId:
 *                                      type: string
 *                                      format: uuid
 *                                      nullable: true
 *                                      description: ID получателя платежа
 *                                      example: null
 *                                  accountId:
 *                                      type: string
 *                                      format: uuid
 *                                      description: ID аккаунта, связанного с заказом
 *                                      example: "1f1bbfc0-1621-4ba2-85ac-6ec23c1ef299"
 *                                  Spisanie:
 *                                      type: string
 *                                      nullable: true
 *                                      description: Информация о списании
 *                                      example: 3000
 *                                  Deposit:
 *                                      type: integer
 *                                      description: Сумма депозитов
 *                                      example: 55555
 *                                  
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
 * 
 * /{accountId}/deposits/{organizationCustomerId}/newDeposit:
 *  post:
 *      tags:
 *          - Deposit
 *      summary: Запрос POST для создания пополнения или вычета с баланса депозита у определенной организации
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: organizationCustomerId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID организации
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              deposit:
 *                                  type: decimal
 *                                  nullable: true
 *                                  description: Депозит на баланс (что то одно должно быть пустым, т.е. null)
 *                                  example: 4000
 *                              withdraw:
 *                                  type: decimal
 *                                  nullable: true
 *                                  description: Списание с баланса (что то одно должно быть пустым, т.е. null)
 *                                  example: 5000
 *      responses:
 *        200:
 *          description: Депозит успешно создан!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *        500:
 *          description: Ой, что - то пошло не так!
 *  
 */
