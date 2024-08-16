/**
 * @swagger
 * /{accountId}/reviews/org/{organizationCustomerId}:
 *  get:
 *      tags:
 *          - Review
 *      summary: Все отчеты по конкретной организации
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
 *          description: Все отчеты по конкретной организации
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                    description: Заголовок запроса
 *                    example: "Все отчеты по конкретной организации"
 *                  organizationCustomer:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          description: ID организации
 *                          example: "00a701c6-b23f-427b-baed-96c4a2e9b532"
 *                        organizationName:
 *                          type: string
 *                          description: Название организации
 *                          example: "Ташкент"
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          description: Дата перевода статуса
 *                          example: "2024-06-04T15:48:19.000Z"
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          description: хуйня
 *                          example: "2024-06-04T15:48:19.000Z"
 *                  allOrders:
 *                    type: array
 *                    description: Список всех заказов по организации
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          description: ID истории изменения статуса
 *                          example: "97a701c6-b23f-427b-baed-96c4a2e9b532"
 *                        billNumber:
 *                          type: string
 *                          description: Счёт заказа
 *                          example: "144"
 *                        orderStatus:
 *                          type: string
 *                          nullable: false
 *                          description: Новый статус заказа
 *                          example: "Оплачен"
 *                        timestamp:
 *                          type: string
 *                          format: date-time
 *                          description: Дата получения заказом статуса
 *                          example: "2024-06-04T15:48:19.000Z"
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          description: Дата перевода статуса
 *                          example: "2024-06-04T15:48:19.000Z"
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          description: хуйня
 *                          example: "2024-06-04T15:48:19.000Z"
 *                        accountId:
 *                          type: string
 *                          nullable: false
 *                          description: ID аккаунта
 *                          example: "24a701c6-b23f-427b-baed-96c4a2e9b532"
 *                        orderId:
 *                          type: string
 *                          nullable: false
 *                          description: ID заказа
 *                          example: "64dba69f-085b-4a66-a1a9-9cc29c536633"
 *                        organizationCustomerId:
 *                          type: string
 *                          nullable: false
 *                          description: ID организации
 *                          example: "88dba69f-085b-4a66-a1a9-9cc29c536633"
 *                        SUM:
 *                          type: string
 *                          nullable: false
 *                          description: Сумма заказа
 *                          example: "300000"
 *                        totalQuantity:
 *                          type: string
 *                          nullable: false
 *                          description: Кол-во товаров в заказе
 *                          example: "18"
 *                        order:
 *                          type: object
 *                          properties:
 *                              id:
 *                                type: string
 *                                description: ID заказа
 *                                example: "1ae3281e-5940-47c8-aa18-0c15e036f55d"
 *                              dispatchDate:
 *                                type: string
 *                                format: date-time
 *                                description: Дата изменения статуса заказа
 *                                example: "2024-08-14T10:38:10.000Z"
 *                              status:
 *                                type: string
 *                                nullable: false
 *                                description: Cтатус заказа
 *                                example: "Оплачен"
 *                              billNumber:
 *                                type: string
 *                                description: Счёт заказа
 *                                example: "144"
 *                              createdBySupAdm:
 *                                type: boolean
 *                                description: Создан ли суперАдмином
 *                                example: false
 *                              orderNumber:
 *                                type: string
 *                                description: Порядковый номер заказа
 *                                example: 5
 *                              isFromDeposit:
 *                                type: boolean
 *                                description: Списание с депозита
 *                                example: false
 *                              createdAt:
 *                                type: string
 *                                format: date-time
 *                                description: Дата перевода статуса
 *                                example: "2024-06-04T15:48:19.000Z"
 *                              updatedAt:
 *                                type: string
 *                                format: date-time
 *                                description: хуйня
 *                                example: "2024-06-04T15:48:19.000Z"
 *                              organizationCustomerId:
 *                                type: string
 *                                nullable: false
 *                                description: ID организации
 *                                example: "88dba69f-085b-4a66-a1a9-9cc29c536633"
 *                              payeeId:
 *                                type: string
 *                                nullable: false
 *                                description: ID получателя платежа
 *                                example: "11dba69f-085b-4a66-a1a9-9cc29c536633"
 *                              accountId:
 *                                type: string
 *                                nullable: false
 *                                description: ID аккаунта
 *                                example: "24a701c6-b23f-427b-baed-96c4a2e9b532"
 *                              TitleOrder:
 *                                  type: object
 *                                  properties:
 *                                      addBooklet:
 *                                        type: boolean
 *                                        description: Булин на Доп. буклет
 *                                        example: false
 *                                      quantity:
 *                                        type: integer
 *                                        description: Количество товара в наименовании
 *                                        example: 7
 *                                      price:
 *                                          type: object
 *                                          properties:
 *                                              priceAccess:
 *                                                type: string
 *                                                description: Цена за товар
 *                                                example: "5000"
 *                                              priceBooklet:
 *                                                type: string
 *                                                description: Цена за доп.буклет
 *                                                example: "200"
 *                                      product:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                type: string
 *                                                description: ID товара
 *                                                example: "7bb3281e-5940-47c8-aa18-0c15e036f55d"
 *                                              name:
 *                                                type: string
 *                                                description: Название товара
 *                                                example: "Курс по ашу"
 *                                              abbreviation:
 *                                                type: string
 *                                                description: Аббревиатура
 *                                                example: "КПА"
 *                                              productTypeId:
 *                                                type: integer
 *                                                description: Номер категории товара
 *                                                example: 2
 *                              
 *                  allProducts:
 *                    type: array
 *                    description: Все товары и их наименования
 *                    items:
 *                      type: object
 *                      properties:
 *                          id:
 *                            type: string
 *                            description: ID товара
 *                            example: "7bb3281e-5940-47c8-aa18-0c15e036f55d"
 *                          name:
 *                            type: string
 *                            description: Название товара
 *                            example: "Курс по ашу"
 *                          abbreviation:
 *                            type: string
 *                            description: Аббревиатура
 *                            example: "КПА"
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            description: Дата создания товара
 *                            example: "2024-06-04T15:48:19.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            description: хуйня
 *                            example: "2024-06-04T15:48:19.000Z"
 *                          productTypeId:
 *                            type: integer
 *                            description: Номер категории товара
 *                            example: 2
 *                          imageId:
 *                            type: string
 *                            description: ID картинки
 *                            example: "66b3281e-5940-47c8-aa18-0c15e036f35d"
 *                          titles:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: string
 *                                          description: ID наименования
 *                                          format: uuid
 *                                          example: 1c12df6d-11ed-46e2-93d9-e91d07c0a6d0
 *                                      accessType:
 *                                          type: string
 *                                          description: Тип доступа
 *                                          example: Бумажный
 *                                      generation:
 *                                          type: string
 *                                          description: Поколение товара 
 *                                          example: Второе поколения
 *                                      addBooklet:
 *                                          type: boolean
 *                                          description: Флаг добавления брошюры к заказу (если true, то accessType устанавливается в null) 
 *                                          example: false
 *                                      quantity:
 *                                          type: integer
 *                                          description: Количество товара 
 *                                          example: 20
 *                                      createdAt:
 *                                        type: string
 *                                        format: date-time
 *                                        description: Дата создания наименования
 *                                        example: "2024-06-04T15:48:19.000Z"
 *                                      updatedAt:
 *                                        type: string
 *                                        format: date-time
 *                                        description: хуйня
 *                                        example: "2024-06-04T15:48:19.000Z"
 *                                      productId:
 *                                          type: string
 *                                          description: ID товара
 *                                          format: uuid
 *                                          example: 2222df6d-11ed-46e2-93d9-e91d07c0a6d0
 *                                      orderId:
 *                                          type: string
 *                                          description: ID заказа
 *                                          format: uuid
 *                                          example: 2222df6d-11ed-46e2-93d9-e91d07c0a6d0
 *                                      priceDefId:
 *                                          type: string
 *                                          description: ID прайс листа
 *                                          format: uuid
 *                                          example: 2222df6d-11ed-46e2-93d9-e91d07c0a6d0
 *                            
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 * 
 * 
 * 
 * /{accountId}/reviews/com/{commisionRecieverId}:
 *  get:
 *      tags:
 *          - Review
 *      summary: Баланс получателя комиссии 
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
 *          description: ID получателя
 *      responses:
 *        200:
 *          description: Баланс получателя комиссии 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                    description: Заголовок запроса
 *                    example: "Все отчеты по конкретной организации"
 *                  commisionReceiver:
 *                    type: object
 *                    properties:
 *                        id:
 *                          type: string
 *                          description: ID получателя комиссии
 *                          example: "7bb3281e-5940-47c8-aa18-0c15e036f55d"
 *                        name:
 *                          type: string
 *                          description: Название получателя комиссии
 *                          example: "Ташкент"
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          description: Дата создания товара
 *                          example: "2024-06-04T15:48:19.000Z"
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          description: хуйня
 *                          example: "2024-06-04T15:48:19.000Z"
 *                  operations:
 *                    type: array
 *                    description: Список всех операций
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          description: Уникальный идентификатор списания
 *                          example: "1ae3281e-5940-47c8-aa18-0c15e036f55d"
 *                        dateOfOperation:
 *                          type: string
 *                          format: date-time
 *                          description: Дата списания
 *                          example: "2024-08-14T10:38:10.000Z"
 *                        Postyplenie:
 *                          type: string
 *                          description: Всегда null (не реализована для поступления)
 *                          example: null
 *                        Spisanie:
 *                          type: string
 *                          description: Сумма списания по операции
 *                          example: "12345678"
 *                        billNumber:
 *                          type: string
 *                          nullable: true
 *                          description: Номер счета операции
 *                          example: "34567"
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          description: Дата создания правила
 *                          example: "2024-06-04T15:48:19.000Z"
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          description: Дата последнего обновления правила
 *                          example: "2024-06-04T15:48:19.000Z"
 *                        commisionRecieverId:
 *                          type: string
 *                          format: date-time
 *                          description: ID получателя комиссии
 *                          example: "14b5c41e-0f61-4526-a5e9-4cb718260b2d"
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 * 
 * 
 * 
 * 
 * 
 *
 * /{accountId}/reviews:
 *  get:
 *      tags:
 *          - Review
 *      summary: Все отчеты 
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
 *          description: Все отчеты
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                    description: Заголовок запроса
 *                    example: "Все отчеты"
 *                  allPostyplenie:
 *                    type: array
 *                    description: Список всех поступлений и списаний 
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          description: ID истории изменения статуса
 *                          example: "97a701c6-b23f-427b-baed-96c4a2e9b532"
 *                        billNumber:
 *                          type: string
 *                          description: Счёт заказа
 *                          example: "144"
 *                        orderStatus:
 *                          type: string
 *                          nullable: false
 *                          description: Новый статус заказа
 *                          example: "Оплачен"
 *                        timestamp:
 *                          type: string
 *                          format: date-time
 *                          description: Дата получения заказом статуса
 *                          example: "2024-06-04T15:48:19.000Z"
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          description: Дата перевода статуса
 *                          example: "2024-06-04T15:48:19.000Z"
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          description: хуйня
 *                          example: "2024-06-04T15:48:19.000Z"
 *                        accountId:
 *                          type: string
 *                          nullable: false
 *                          description: ID аккаунта
 *                          example: "24a701c6-b23f-427b-baed-96c4a2e9b532"
 *                        orderId:
 *                          type: string
 *                          nullable: false
 *                          description: ID заказа
 *                          example: "64dba69f-085b-4a66-a1a9-9cc29c536633"
 *                        organizationCustomerId:
 *                          type: string
 *                          nullable: false
 *                          description: ID организации
 *                          example: "88dba69f-085b-4a66-a1a9-9cc29c536633"
 *                        SUM:
 *                          type: string
 *                          nullable: false
 *                          description: Сумма заказа
 *                          example: "300000"
 *                        totalQuantity:
 *                          type: string
 *                          nullable: false
 *                          description: Кол-во товаров в заказе
 *                          example: "18"
 *                        totalMainQuantity:
 *                          type: string
 *                          nullable: false
 *                          description: Кол-во основных товаров в заказе
 *                          example: "8"
 *                  allOrganizations:
 *                    type: array
 *                    description: Все организации
 *                    items:
 *                      type: object
 *                      properties:
 *                          id:
 *                            type: string
 *                            description: ID организации
 *                            example: "7bb3281e-5940-47c8-aa18-0c15e036f55d"
 *                          organizationName:
 *                            type: string
 *                            description: Название 
 *                            example: "Ташкент"
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            description: Дата создания товара
 *                            example: "2024-06-04T15:48:19.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            description: хуйня
 *                            example: "2024-06-04T15:48:19.000Z"
 *                  allCommisionRecievers:
 *                    type: array
 *                    description: Все получатели комиссии
 *                    items:
 *                      type: object
 *                      properties:
 *                          id:
 *                            type: string
 *                            description: ID получателя комиссии
 *                            example: "7bb3281e-5940-47c8-aa18-0c15e036f55d"
 *                          name:
 *                            type: string
 *                            description: Название получателя комиссии
 *                            example: "Ташкент"
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            description: Дата создания товара
 *                            example: "2024-06-04T15:48:19.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            description: хуйня
 *                            example: "2024-06-04T15:48:19.000Z"
 *                            
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 * 
 * 
 * 
 */