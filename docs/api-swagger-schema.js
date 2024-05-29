/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: 8800e557-6247-4f12-a9d8-534d59c09318
 *        name:
 *          type: string
 *          nullable: false
 *          example: product
 *        abbreviation:
 *          type: string
 *          nullable: false
 *          example: KPSS
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: "2024-05-21T12:56:42.000Z"
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          example: "2024-05-21T12:56:42.000Z"
 *        productTypeId:
 *          type: integer
 *          nullable: false
 *          example: 1
 *    Order:
 *      type: object
 *      properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *                  description: Уникальный идентификатор заказа
 *                  example: 8800e557-6247-4f12-a9d8-534d59c09318
 *              dispatchDate:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *                  description: Дата и время отправки заказа
 *                  example: "2024-05-21T12:56:42.000Z"
 *              status:
 *                  type: string
 *                  enum: ['Черновик', 'Черновик депозита', 'Активный', 'Выставлен счёт', 'Оплачен', 'Отправлен', 'Получен', 'Отменен']
 *                  default: 'Черновик'
 *                  nullable: false
 *                  description: Статус заказа
 *                  example: Черновик
 *              billNumber:
 *                  type: string
 *                  nullable: true
 *                  description: Номер счета
 *                  example: 23ФЗ/34
 *              createdBySupAdm:
 *                  type: boolean
 *                  default: false
 *                  nullable: false
 *                  description: Флаг, указывающий, был ли заказ создан суперАдминистратором
 *                  example: true
 *              orderNumber:
 *                  type: integer
 *                  nullable: false
 *                  description: Уникальный номер заказа
 *                  example: 24
 *              isFromDeposit:
 *                  type: boolean
 *                  default: false
 *                  nullable: false
 *                  description: Флаг, указывающий, был ли заказ оплачен через депозит
 *                  example: true
 * 
 *    Account:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *                  description: Уникальный идентификатор аккаунта
 *                  example: 8800e557-6247-4f12-a9d8-534d59c09318
 *              firstName:
 *                  type: string
 *                  nullable: false
 *                  description: Имя пользователя
 *                  example: Максим
 *              lastName:
 *                  type: string
 *                  nullable: false
 *                  description: Фамилия пользователя
 *                  example: Ковальский
 *              telephoneNumber:
 *                  type: string
 *                  nullable: false
 *                  description: Номер телефона пользователя
 *                  example: '+79787513901'
 *              telegramId:
 *                  type: string
 *                  nullable: true
 *                  description: Телеграмм ID пользователя
 *                  example: 123232424
 *              organizationList:
 *                  type: JSON
 *                  nullable: false
 *                  description: Список организация, привязанных к пользователю
 *                  example: ["Джанкой", "Севастополь"]
 *              isBlocked:
 *                  type: boolean
 *                  default: false
 *                  nullable: false
 *                  description: Флаг, показывающий заблокирован ли пользователь
 *                  example: false
 *              lastSeen:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *                  description: Последний вход пользователя
 *                  example: 16:30 25-05
 *              accountNumber:
 *                  type: integer
 *                  nullable: false
 *                  description: Уникальный порядковый номер пользователя
 *                  example: 33
 *     
 *    AccrualRule:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор правила накопления
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            commision:
 *              type: string
 *              format: decimal
 *              nullable: false
 *              description: Комиссия, применимая к правилу накопления
 *              example: 5000
 *            accessType:
 *              type: string
 *              nullable: true
 *              enum: ['Бумажный', 'Электронный']
 *              description: Тип доступа, на который действует правило (может отсутствовать => действует на все типы доступов)
 *              example: Бумажный
 *            generation:
 *              type: string
 *              nullable: true
 *              enum: ['Первое поколение', 'Второе поколение']
 *              description: Поколение, на которое действует правило (может отсутствовать => действует на все поколения)
 *              example: Первое поколение
 * 
 * 
 *    CommisionReceiver:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор получателя комиссии
 *            name:
 *              type: string
 *              nullable: false
 *              description: Имя получателя комиссии
 * 
 * 
 *    OrganizationCustomer:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор организации-клиента
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            organizationName:
 *              type: string
 *              nullable: false
 *              description: Название организации-клиента
 *              example: Уфа
 * 
 * 
 *    Payee:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор плательщика
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            name:
 *              type: string
 *              nullable: false
 *              description: Имя плательщика
 *              example: ИП Климов
 * 
 * 
 *    PriceDefinition:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор определения цены
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            activationDate:
 *              type: string
 *              format: date-time
 *              nullable: false
 *              description: Дата активации определения цены
 *              example: 2024-05-01 17:25:00
 *            priceAccess:
 *              type: string
 *              format: decimal
 *              nullable: false
 *              description: Цена доступа
 *              example: 25500
 *            priceBooklet:
 *              type: string
 *              format: decimal
 *              nullable: false
 *              description: Цена брошюры
 *              example: 1900
 * 
 * 
 * 
 * 
 *    ProductType:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              description: Уникальный идентификатор типа продукта
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            name:
 *              type: string
 *              nullable: false
 *              description: Название типа продукта
 *              example: Начальные
 * 
 * 
 * 
 *    Role:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              description: Уникальный идентификатор роли
 *              example: 1
 *            roleName:
 *              type: string
 *              nullable: false
 *              description: Название роли
 *              example: СуперАдмин
 *            roleDescription:
 *              type: string
 *              description: Описание роли
 *              example: Лишнее поле, хуй пойми нахуй оно
 * 
 * 
 * 
 *    TitleOrders:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор заказа названия
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            accessType:
 *              type: string
 *              nullable: true
 *              enum: ['Бумажный', 'Электронный']
 *              description: Тип доступа к заказу названия
 *              example: Бумажный
 *            generation:
 *              type: string
 *              nullable: false
 *              enum: ['Первое поколение', 'Второе поколение']
 *              description: Генерация заказа названия
 *              example: Первое поколение
 *            addBooklet:
 *              type: boolean
 *              nullable: false
 *              description: Флаг добавления брошюры к заказу (если true, то accessType устанавливается в null)
 *              example: false
 *            quantity:
 *              type: integer
 *              nullable: false
 *              description: Количество заказанных названий
 *              example: 25
 * 
 */







/**
 * @swagger
 * /{accountId}/productsByType/{typeId}:
 *  get:
 *      tags:
 *          - Product
 *      summary: Получить список всех товаров по типу (typeId)
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: typeId
 *          required: true
 *          schema:
 *            type: integer
 *          description: ID категории товаров
 *      responses:
 *        200:
 *          description: |
 *             Категории:
 *              - Начальные
 *              - Основные
 *              - Для сотрудников
 *              - Депозит
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Product'
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */


/**
 * @swagger
 * /{accountId}/products:
 *  get:
 *      tags:
 *          - Product
 *      summary: Получить список всех товаров
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
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Product'
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */



/**
 * @swagger
 * /{accountId}/orders/newOrder:
 *  post:
 *      tags:
 *          - Order
 *      summary: Запрос POST для создания заказа от лица пользователя
 *      description: Происходит создание заказа со статусом "Черновик" и добавлением в него наименование, в которым все данные о товаре. Если "Черновик" уже есть, то происходит добавление наименование в него. Если пользователь создает депозит, то аналогичная стратегия только вместо "Черновик" => "Черновик депозита" и вместо добавления нового депозита в черновик, пользователь получает сообщение о том, что можно изменить сумму депозита в черновике
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              productId:
 *                                  type: string
 *                                  format: uuid
 *                                  nullable: false
 *                                  description: ID товара
 *                                  example: 8eb897f2-22b1-4d32-aef8-e9a379b5c0e8
 *                              generation:
 *                                  type: string
 *                                  nullable: false
 *                                  description: Поколение
 *                                  example: Второе поколение
 *                              accessType:
 *                                  type: string
 *                                  nullable: true
 *                                  description: Тип доступа
 *                                  example: Электронный
 *                              addBooklet:
 *                                  type: boolean
 *                                  nullable: false
 *                                  description: Флаг добавления брошюры к заказу (если true, то accessType устанавливается в null)
 *                                  example: false
 *                              quantity:
 *                                  type: integer
 *                                  nullable: false
 *                                  description: Кол-во товара
 *                                  example: 20
 *                            
 *      responses:
 *        200:
 *          description: Товар успешно добавлен в заказ!
 *        400:
 *          description: Измените черновик депозита!
 *        500:
 *          description: |
 *              Ошибки:
 *                  - Ошибка в создании заказа!
 *                  - Ошибка в создании наименования!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */





/**
 * @swagger
 * /{accountId}/orders/{orderId}/active:
 *  put:
 *      tags:
 *          - Order
 *      summary: Запрос PUT для обновления черновика заказа от лица пользователя (НА СТРАНИЦЕ "В РАБОТЕ")
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
 *            type: string
 *            format: uuid
 *          description: ID заказа
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              organizationName:
 *                                  type: string
 *                                  description: Название организации-клиента
 *                                  nullable: false
 *                                  example: Уфа
 *      responses:
 *        200:
 *          description: Заказ успешно переведён в статус "Активный"!
 *        400:
 *          description: |
 *              Ошибки:
 *                  - Добавьте товары в заказ!
 *                  - Редактировать можно только черновик!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */



/**
 * @swagger
 * /{accountId}/orders/{orderId}/received:
 *  put:
 *      tags:
 *          - Order
 *      summary: Запрос PUT для обновления отправленного заказа на полученный от лица пользователя (НА СТРАНИЦЕ "В РАБОТЕ")
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
 *            type: string
 *            format: uuid
 *          description: ID заказа
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              organizationName:
 *                                  type: string
 *                                  nullable: false
 *                                  description: Название организации-клиента
 *                                  example: Уфа
 *      responses:
 *        200:
 *          description: Заказ успешно переведён в статус "Получен"!
 *        400:
 *          description: Этот заказ еще не отправлен!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */



/**
 * @swagger
 * /{accountId}/orders:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения всех активных заказов пользователя
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
 *          description: Все активные заказы
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Все активные заказы"
 *                    orders_list:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                          dispatchDate:
 *                            type: string
 *                            nullable: true
 *                            format: date-time
 *                          status:
 *                            type: string
 *                            nullable: false
 *                            example: "Выставлен счёт"
 *                          billNumber:
 *                            type: string
 *                            nullable: true
 *                            example: "222"
 *                          createdBySupAdm:
 *                            type: boolean
 *                            nullable: false
 *                            example: false
 *                          orderNumber:
 *                            type: integer
 *                            nullable: false
 *                            example: 156
 *                          isFromDeposit:
*                             type: boolean
 *                            nullable: false
*                             default: false
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-21T12:56:42.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-23T09:57:47.000Z"
 *                          organizationCustomerId:
 *                            type: string
 *                            nullable: false
 *                            format: uuid
 *                            example: "ff080ca8-c967-47e9-89bd-c3213551ca7f"
 *                          payeeId:
 *                            type: string
 *                            format: uuid
 *                            nullable: true
 *                            example: "asdfasdasdca8-c967-47e9-89bd-c3213551ca7f"
 *                          accountId:
 *                            type: string
 *                            nullable: false
 *                            format: uuid
 *                            example: "1f1bbfc0-1621-4ba2-85ac-6ec23c1ef299"
 *                          SUM:
 *                            type: string
 *                            nullable: true
 *                            example: "4500"
 *                          organizationName:
 *                            type: string
 *                            nullable: false
 *                            example: "Санкт-Петербург"
 *                          TitleOrder:
 *                            type: object
 *                            properties:
 *                              quantity:
 *                                type: decimal
 *                                nullable: false
 *                                example: 3
 *                              addBooklet:
 *                                type: boolean
 *                                nullable: false
 *                                description: Флаг добавления брошюры к заказу (если true, то accessType устанавливается в null)
 *                                example: true
 *                              price:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                    type: string
 *                                    format: uuid
 *                                    example: "377c60f7-4bf0-469b-92a9-0c7d6a123314"
 *                                  priceAccess:
 *                                    type: string
 *                                    nullable: false
 *                                    example: "15000" (в случае депозита устанавл. в "1")
 *                                  priceBooklet:
 *                                    type: string
 *                                    nullable: false
 *                                    example: "1500" (в случае депозита устанавл. в "0")
 *                          formattedDispatchDate:
 *                            type: string
 *                            format: date-time
 *                            nullable: true
 *                            example: 02-02-2002
 *        500:
 *          description: Произошла ошибка при получении активных заказов
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */


/**
 * @swagger
 * /{accountId}/orders/finished:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения всех завершенных заказов пользователя
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
 *          description: Все полученные заказы
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Все полученные заказы"
 *                    orders_list:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                          dispatchDate:
 *                            type: string
 *                            nullable: true
 *                            format: date-time
 *                          status:
 *                            type: string
 *                            nullable: false
 *                            example: "Получен"
 *                          billNumber:
 *                            type: string
 *                            nullable: true
 *                            example: null
 *                          createdBySupAdm:
 *                            type: boolean
 *                            nullable: false
 *                            example: false
 *                          orderNumber:
 *                            type: integer
 *                            nullable: false
 *                            example: 1
 *                          isFromDeposit:
 *                            type: boolean
 *                            nullable: false
 *                            default: false
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-04-26T11:16:07.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-01T07:53:50.000Z"
 *                          organizationCustomerId:
 *                            type: string
 *                            nullable: false
 *                            format: uuid
 *                            example: "1"
 *                          payeeId:
 *                            type: string
 *                            nullable: true
 *                            format: uuid
 *                            example: null
 *                          accountId:
 *                            type: string
 *                            nullable: false
 *                            format: uuid
 *                            example: "1"
 *                          SUM:
 *                            type: string
 *                            nullable: false
 *                            example: "22222222"
 *                          organizationName:
 *                            type: string
 *                            nullable: false
 *                            example: "Симферополь"
 *                          TitleOrder:
 *                            type: object
 *                            properties:
 *                              quantity:
 *                                type: integer
 *                                nullable: false
 *                                example: 22222222
 *                              price:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                    type: string
 *                                    format: uuid
 *                                    example: "07ff1130-a1f9-4b12-98a8-c1897c630d19"
 *                                  priceAccess:
 *                                    type: string
 *                                    nullable: false
 *                                    example: "1235" (в случае депозита устанавл. в "1")
 *                                  priceBooklet:
 *                                    type: string
 *                                    nullable: false
 *                                    example: "333" (в случае депозита устанавл. в "0")
 *                          formattedDispatchDate:
 *                            type: string
 *                            nullable: true
 *                            format: date-time
 *                            nullable: true
 *                            example: 02-02-2002
 *        500:
 *          description: Произошла ошибка при получении активных заказов
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */




/**
 * @swagger
 * /{accountId}/orders/all:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения всех заказов от лица админа
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
 *          description: Все активные заказы пользователей
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Все активные заказы пользователей"
 *                    orders_list:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                          dispatchDate:
 *                            type: string
 *                            nullable: true
 *                            format: date-time
 *                            nullable: true
 *                            example: null
 *                          status:
 *                            type: string
 *                            nullable: false
 *                            example: "Выставлен счёт"
 *                          billNumber:
 *                            type: string
 *                            nullable: true
 *                            example: "222"
 *                          createdBySupAdm:
 *                            type: boolean
 *                            nullable: false
 *                            example: false
 *                          orderNumber:
 *                            type: integer
 *                            nullable: false
 *                            example: 156
 *                          isFromDeposit:
 *                            type: boolean
 *                            nullable: false
 *                            default: false
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-21T12:56:42.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-23T09:57:47.000Z"
 *                          organizationCustomerId:
 *                            type: string
 *                            nullable: false
 *                            format: uuid
 *                            example: "ff080ca8-c967-47e9-89bd-c3213551ca7f"
 *                          payeeId:
 *                            type: string
 *                            nullable: true
 *                            format: uuid
 *                            example: null
 *                          accountId:
 *                            type: string
 *                            nullable: false
 *                            format: uuid
 *                            example: "1f1bbfc0-1621-4ba2-85ac-6ec23c1ef299"
 *                          fullName:
 *                            type: string
 *                            nullable: false
 *                            example: "Valera Lysenko"
 *                          SUM:
 *                            type: string
 *                            nullable: false
 *                            example: "4500"
 *                          organizationName:
 *                            type: string
 *                            nullable: false
 *                            example: "Санкт-Петербург"
 *                          totalQuantity:
 *                            type: string
 *                            nullable: false
 *                            example: "3"
 *                          organizationList:
 *                            type: JSON
 *                            nullable: false
 *                            example: ["Джанкой", "Севастополь"]
 *                          formattedDispatchDate:
 *                            type: string
 *                            nullable: true
 *                            format: date-time
 *                            nullable: true
 *                            example: 02-02-2002
 *        500:
 *          description: Произошла ошибка при получении активных заказов
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */


/**
 * @swagger
 * /{accountId}/orders/archive:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения всех архивных заказов от лица админа
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
 *          description: Архивные заказы (Получен, Отменен)
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Архивные заказы (Получен, Отменен)"
 *                    orders_list:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                          dispatchDate:
 *                            type: string
 *                            nullable: true
 *                            format: date-time
 *                            nullable: true
 *                            example: null
 *                          status:
 *                            type: string
 *                            nullable: false
 *                            example: "Получен"
 *                          billNumber:
 *                            type: string
 *                            nullable: true
 *                            example: null
 *                          createdBySupAdm:
 *                            type: boolean
 *                            nullable: false
 *                            example: false
 *                          orderNumber:
 *                            type: integer
 *                            nullable: false
 *                            example: 1
 *                          isFromDeposit:
 *                            type: boolean
 *                            nullable: false
 *                            default: false
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-04-26T11:16:07.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-01T07:53:50.000Z"
 *                          organizationCustomerId:
 *                            type: string
 *                            nullable: false
 *                            format: uuid
 *                            example: "09as1130-a1f9-4b12-98a8-c1897c630d19"
 *                          payeeId:
 *                            type: string
 *                            nullable: true
 *                            format: uuid
 *                            example: null
 *                          accountId:
 *                            type: string
 *                            nullable: false
 *                            format: uuid
 *                            example: "20dd1130-a1f9-4b12-98a8-c1897c630d19"
 *                          fullName:
 *                            type: string
 *                            nullable: false
 *                            example: "Максим Ковальски"
 *                          SUM:
 *                            type: string
 *                            nullable: false
 *                            example: "22222222"
 *                          organizationName:
 *                            type: string
 *                            nullable: false
 *                            example: "Симферополь"
 *                          account:
 *                            type: object
 *                            properties:
 *                              firstName:
 *                                type: string
 *                                nullable: false
 *                                example: "Максим"
 *                              lastName:
 *                                type: string
 *                                nullable: false
 *                                example: "Ковальски"
 *                          TitleOrder:
 *                            type: object
 *                            properties:
 *                              quantity:
 *                                type: integer
 *                                nullable: false
 *                                example: 22
 *                              price:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                    type: string
 *                                    format: uuid
 *                                    example: "07ff1130-a1f9-4b12-98a8-c1897c630d19"
 *                                  priceAccess:
 *                                    type: string
 *                                    nullable: false
 *                                    example: "1333" (в случае депозита устанавл. в "1")
 *                                  priceBooklet:
 *                                    type: string
 *                                    nullable: false
 *                                    example: "330" (в случае депозита устанавл. в "0")
 *                          organization:
 *                            type: object
 *                            properties:
 *                              id:
 *                                type: string
 *                                format: uuid
 *                                example: "09as1130-a1f9-4b12-98a8-c1897c630d19"
 *                              organizationName:
 *                                type: string
 *                                example: "Симферополь"
 *                              createdAt:
 *                                type: string
 *                                format: date-time
 *                                nullable: true
 *                                example: null
 *                              updatedAt:
 *                                type: string
 *                                format: date-time
 *                                nullable: true
 *                                example: null
 *                          formattedDispatchDate:
 *                            type: string
 *                            format: date-time
 *                            nullable: true
 *                            example: 02-02-2002
 *        500:
 *          description: Произошла ошибка при получении архивных заказов
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */



/**
 * @swagger
 * /{accountId}/orders/admin/{orderId}:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения деталей (Всех TitleOrders и OrganizationCustomer) для выбранного заказа от лица админа
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
 *      responses:
 *        200:
 *          description: Детали заказа
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Детали заказа"
 *                    order:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          format: uuid
 *                          example: "4afc1f16-752d-41c2-951b-59db3e170bed"
 *                        dispatchDate:
 *                          type: string
 *                          format: date-time
 *                          example: "2024-05-13T10:57:47.000Z"
 *                        status:
 *                          type: string
 *                          example: "Активный"
 *                        billNumber:
 *                          type: string
 *                          example: "123456789"
 *                        createdBySupAdm:
 *                          type: boolean
 *                          example: true
 *                        orderNumber:
 *                          type: integer
 *                          example: 36
 *                        isFromDeposit:
 *                          type: boolean
 *                          example: false
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2024-05-13T10:57:47.000Z"
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2024-05-13T12:05:06.000Z"
 *                        organizationCustomerId:
 *                          type: string
 *                          example: "1"
 *                        payeeId:
 *                          type: string
 *                          example: "2"
 *                        accountId:
 *                          type: string
 *                          example: "1"
 *                        SUM:
 *                          type: string
 *                          example: "515200"
 *                        payeeName:
 *                          type: string
 *                          example: "Иван Иванов"
 *                        organizationName:
 *                          type: string
 *                          example: "Симферополь"
 *                        TitleOrder:
 *                          type: object
 *                          properties:
 *                            quantity:
 *                              type: integer
 *                              example: 1
 *                            price:
 *                              type: object
 *                              properties:
 *                                priceAccess:
 *                                  type: string
 *                                  example: "8000" (в случае депозита устанавл. в "1")
 *                                priceBooklet:
 *                                  type: string
 *                                  example: "500" (в случае депозита устанавл. в "0")
 *                        organization:
 *                          type: object
 *                          properties:
 *                            organizationName:
 *                              type: string
 *                              example: "Симферополь"
 *                        payee:
 *                          type: object
 *                          properties:
 *                            name:
 *                              type: string
 *                              example: "ООО Примерная Компания"
 *                    titles:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                            example: "328425da-89a5-41cb-a753-3cd626dcca9b"
 *                          accessType:
 *                            type: string
 *                            example: "Бумажный"
 *                          generation:
 *                            type: string
 *                            example: "Первое поколение"
 *                          addBooklet:
 *                            type: boolean
 *                            description: Флаг добавления брошюры к заказу (если true, то accessType устанавливается в null)
 *                            example: false
 *                          quantity:
 *                            type: integer
 *                            example: 4
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-13T10:57:47.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-13T10:57:47.000Z"
 *                          productId:
 *                            type: string
 *                            format: uuid
 *                            example: "01584925-5783-428b-a592-e886cb8dca50"
 *                          orderId:
 *                            type: string
 *                            format: uuid
 *                            example: "4afc1f16-752d-41c2-951b-59db3e170bed"
 *                          priceDefId:
 *                            type: string
 *                            format: uuid
 *                            example: "377c60f7-4bf0-469b-92a9-0c7d6a123314"
 *                          SumForOneTitle:
 *                            type: string
 *                            example: "60000"
 *                          PriceForOneProduct:
 *                            type: string
 *                            example: "15000"
 *                          product:
 *                            type: object
 *                            properties:
 *                              abbreviation:
 *                                type: string
 *                                example: "НОП"
 *                          price:
 *                            type: object
 *                            properties:
 *                              priceAccess:
 *                                type: string
 *                                example: "15000"
 *                              priceBooklet:
 *                                type: string
 *                                example: "1500"
 *        404:
 *          description: Заказ не найден
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */




/**
 * @swagger
 * /{accountId}/orders/{orderId}:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения деталей (Всех TitleOrders) для выбранного заказа от лица пользователя
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
 *      responses:
 *        200:
 *          description: Детали заказа
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Детали заказа"
 *                    order:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          format: uuid
 *                          example: "4afc1f16-752d-41c2-951b-59db3e170bed"
 *                        dispatchDate:
 *                          type: string
 *                          format: date-time
 *                          nullable: true
 *                          example: null
 *                        status:
 *                          type: string
 *                          example: "Активный"
 *                        billNumber:
 *                          type: string
 *                          nullable: true
 *                          example: null
 *                        createdBySupAdm:
 *                          type: boolean
 *                          example: false
 *                        orderNumber:
 *                          type: integer
 *                          example: 36
 *                        isFromDeposit:
 *                          type: boolean
 *                          example: false
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2024-05-13T10:57:47.000Z"
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2024-05-13T12:05:06.000Z"
 *                        organizationCustomerId:
 *                          type: string
 *                          example: "1"
 *                        payeeId:
 *                          type: string
 *                          nullable: true
 *                          example: null
 *                        accountId:
 *                          type: string
 *                          example: "1"
 *                        SUM:
 *                          type: string
 *                          example: "515200"
 *                        TitleOrder:
 *                          type: object
 *                          properties:
 *                            quantity:
 *                              type: integer
 *                              example: 1
 *                            price:
 *                              type: object
 *                              properties:
 *                                priceAccess:
 *                                  type: string
 *                                  example: "500"
 *                                priceBooklet:
 *                                  type: string
 *                                  example: "100"
 *                    titles:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                            example: "14f3b337-99e8-4c31-af6b-ca60baa96181"
 *                          accessType:
 *                            type: string
 *                            example: "Бумажный"
 *                          generation:
 *                            type: string
 *                            example: "Первое поколение"
 *                          addBooklet:
 *                            type: boolean
 *                            description: Флаг добавления брошюры к заказу (если true, то accessType устанавливается в null)
 *                            example: false
 *                          quantity:
 *                            type: integer
 *                            example: 1
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-13T12:04:17.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-13T12:04:17.000Z"
 *                          productId:
 *                            type: string
 *                            format: uuid
 *                            example: "f2c5e486-fa98-412b-aa26-c9f00fa4c94c"
 *                          orderId:
 *                            type: string
 *                            format: uuid
 *                            example: "4afc1f16-752d-41c2-951b-59db3e170bed"
 *                          priceDefId:
 *                            type: string
 *                            format: uuid
 *                            example: "2b00b36c-26e4-43ce-873d-467530a40c27"
 *                          SumForOneTitle:
 *                            type: string
 *                            example: "500"
 *                          PriceForOneProduct:
 *                            type: string
 *                            example: "500"
 *                          product:
 *                            type: object
 *                            properties:
 *                              abbreviation:
 *                                type: string
 *                                example: "ТП"
 *                          price:
 *                            type: object
 *                            properties:
 *                              priceAccess:
 *                                type: string
 *                                example: "500"
 *                              priceBooklet:
 *                                type: string
 *                                example: "100"
 *        404:
 *          description: Заказ не найден
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */





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
 */



/**
 * @swagger
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
 */




/**
 * @swagger
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
 *                                                  description: Флаг добавления брошюры к заказу (если true, то accessTy           pe устанавливается в null) 
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






/**
 * @swagger
 * /{accountId}/payees:
 *  get:
 *      tags:
 *          - Payee
 *      summary: Запрос GET для получения всех получателей платежей (Payee)
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
 *          description: Список получателей платежа
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */




/**
 * @swagger
 * /{accountId}/payees/newPayee:
 *  get:
 *      tags:
 *          - Payee
 *      summary: Запрос GET для получения формы для создания нового получателя платежа (Payee)
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
 *          description: Список получателей платежа
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */


/**
 * ТУТ ШО ТО С PAYEE
 */





/**
 * @swagger
 * /{accountId}/prices:
 *  get:
 *      tags:
 *          - PriceDefinition
 *      summary: Запрос GET для получения всех прайс листов(PriceDefinition)
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
 *          description: Список прайс листов
 *          content:
 *            application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      title:
 *                        type: string
 *                        example: "Список прайс листов"
 *                      pricesInit:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              format: uuid
 *                              description: ID прайс листа
 *                              example: "377c60f7-4bf0-469b-92a9-0c7d6a123314"
 *                            activationDate:
 *                              type: string
 *                              format: date-time
 *                              description: Дата активации
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            priceAccess:
 *                              type: string
 *                              description: Цена доступа
 *                              example: "15000"
 *                            priceBooklet:
 *                              type: string
 *                              description: Цена буклета
 *                              example: "1500"
 *                            createdAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            updatedAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            productId:
 *                              type: string
 *                              format: uuid
 *                              description: ID товара
 *                              example: "01584925-5783-428b-a592-e886cb8dca50"
 *                            productName:
 *                              type: string
 *                              description: Название товара
 *                              example: Начальный курс
 *                            productAbbreviation:
 *                              type: string
 *                              description: Аббревиатура товара
 *                              example: НК
 *                            productTypeId:
 *                              type: integer
 *                              description: Тип товара
 *                              example: 1
 *                            formattedActivationDate:
 *                              type: date
 *                              description: Форматированная дата активации
 *                              example: 22-02-2022
 *                      pricesMain:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              format: uuid
 *                              description: ID прайс листа
 *                              example: "377c60f7-4bf0-469b-92a9-0c7d6a123314"
 *                            activationDate:
 *                              type: string
 *                              format: date-time
 *                              description: Дата активации
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            priceAccess:
 *                              type: string
 *                              description: Цена доступа
 *                              example: "15000"
 *                            priceBooklet:
 *                              type: string
 *                              description: Цена буклета
 *                              example: "1500"
 *                            createdAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            updatedAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            productId:
 *                              type: string
 *                              format: uuid
 *                              description: ID товара
 *                              example: "01584925-5783-428b-a592-e886cb8dca50"
 *                            productName:
 *                              type: string
 *                              description: Название товара
 *                              example: Начальный курс
 *                            productAbbreviation:
 *                              type: string
 *                              description: Аббревиатура товара
 *                              example: НК
 *                            productTypeId:
 *                              type: integer
 *                              description: Тип товара
 *                              example: 2
 *                            formattedActivationDate:
 *                              type: date
 *                              description: Форматированная дата активации
 *                              example: 22-02-2022
 *                      pricesForEmployers:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              format: uuid
 *                              description: ID прайс листа
 *                              example: "377c60f7-4bf0-469b-92a9-0c7d6a123314"
 *                            activationDate:
 *                              type: string
 *                              format: date-time
 *                              description: Дата активации
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            priceAccess:
 *                              type: string
 *                              description: Цена доступа
 *                              example: "15000"
 *                            priceBooklet:
 *                              type: string
 *                              description: Цена буклета
 *                              example: "1500"
 *                            createdAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            updatedAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            productId:
 *                              type: string
 *                              format: uuid
 *                              description: ID товара
 *                              example: "01584925-5783-428b-a592-e886cb8dca50"
 *                            productName:
 *                              type: string
 *                              description: Название товара
 *                              example: Начальный курс
 *                            productAbbreviation:
 *                              type: string
 *                              description: Аббревиатура товара
 *                              example: НК
 *                            productTypeId:
 *                              type: integer
 *                              description: Тип товара
 *                              example: 3
 *                            formattedActivationDate:
 *                              type: date
 *                              description: Форматированная дата активации
 *                              example: 22-02-2022
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */


/**
 * @swagger
 * /{accountId}/prices/newPrice:
 *  get:
 *      tags:
 *          - PriceDefinition
 *      summary: Запрос GET для получения формы создания прайс листа (PriceDefinition)
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
 *          description: Форма создания прайс листа
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Product'
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */

/**
 * @swagger
 * /{accountId}/prices/newPrice:
 *  post:
 *      tags:
 *          - PriceDefinition
 *      summary: Запрос POST для создания нового прайс листа (PriceDefinition)
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                    type: string
 *                    description: Название товара
 *                    example: Начальный курс
 *                abbreviation:
 *                    type: string
 *                    description: Аббревиатура товара
 *                    example: НК
 *                priceAccess:
 *                    type: decimal
 *                    description: Цена за доступ к товару
 *                    example: 6700
 *                priceBooklet:
 *                    type: decimal
 *                    description: Цена за буклет
 *                    example: 500
 *                productTypeId:
 *                    type: integer
 *                    description: ID категории товара
 *                    example: 1
 *                activationDate:
 *                    type: date
 *                    description: Дата активации прайс - листа (не раньше текущего дня)
 *                    example: "2024-04-23T07:57:40.000Z"
 *      responses:
 *        200:
 *          description: Прайс лист успешно создан!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *        500:
 *          description: Некорректная форма создания прайс листа!
 */





/**
 * @swagger
 * /{accountId}/prices/{priceDefId}/update:
 *  get:
 *      tags:
 *          - PriceDefinition
 *      summary: Запрос GET для получения формы обновления прайс листа (PriceDefinition)
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: priceDefId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID прайс листа
 *      responses:
 *        200:
 *          description: Форма обновления прайс - листа
 *          content:
 *            application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          title:
 *                            type: string
 *                            example: "Форма обновления прайс - листа"
 *                          price:
 *                            type: object
 *                            properties:
 *                              id:
 *                                type: string
 *                                format: uuid
 *                                example: "07ff1130-a1f9-4b12-98a8-c1897c630d19"
 *                              activationDate:
 *                                type: string
 *                                format: date-time
 *                                example: "2024-04-23T07:57:40.000Z"
 *                              priceAccess:
 *                                type: string
 *                                example: "1"
 *                              priceBooklet:
 *                                type: string
 *                                example: "0"
 *                              createdAt:
 *                                type: string
 *                                format: date-time
 *                                example: "2024-04-23T07:57:40.000Z"
 *                              updatedAt:
 *                                type: string
 *                                format: date-time
 *                                example: "2024-04-23T07:57:40.000Z"
 *                              productId:
 *                                type: string
 *                                format: uuid
 *                                example: "ed976451-efd4-4559-a31f-4e2f9dd70248"
 *                              Product:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                    type: string
 *                                    format: uuid
 *                                    example: "ed976451-efd4-4559-a31f-4e2f9dd70248"
 *                                  name:
 *                                    type: string
 *                                    example: "депозит"
 *                                  abbreviation:
 *                                    type: string
 *                                    example: "Д"
 *                                  createdAt:
 *                                    type: string
 *                                    format: date-time
 *                                    example: "2024-04-22T13:24:50.000Z"
 *                                  updatedAt:
 *                                    type: string
 *                                    format: date-time
 *                                    example: "2024-04-22T13:24:50.000Z"
 *                                  productTypeId:
 *                                    type: integer
 *                                    example: 4
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *        404:
 *          description: Такой прайс лист не найден!
 *        500:
 *          description: Некорректная форма обновления прайс листа
 */


/**
 * @swagger
 * /{accountId}/prices/{priceDefId}/update:
 *  put:
 *      tags:
 *          - PriceDefinition
 *      summary: Запрос PUT для обновления прайс листа (PriceDefinition)
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: priceDefId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID прайс листа
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              priceAccess:
 *                                  type: decimal
 *                                  description: Цена доступа
 *                                  example: 2500
 *                              priceBooklet:
 *                                  type: decimal
 *                                  description: Цена буклета
 *                                  example: 300
 *      responses:
 *        200:
 *          description: Прайс лист успешно обновлен!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *        500:
 *          description: Некорректная форма обновления прайс листа
 */



/**
 * @swagger
 * /{accountId}/accounts/{accountFocusId}/update:
 *  get:
 *      tags:
 *          - Account
 *      summary: Запрос GET для получения формы обновления аккаунта
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: accountFocusId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID выбранного аккаунта
 *      responses:
 *        200:
 *          description: Форма обновления аккаунта для админа
 *          content:
 *            application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                            title:
 *                              type: string
 *                              description: Форма обновления аккаунта для админа
 *                              example: "Форма обновления аккаунта для админа"
 *                            organizations:
 *                              type: array
 *                              description: Список организаций, связанных с аккаунтом
 *                              items:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                    type: string
 *                                    description: ID организации
 *                                    example: "07ff1130-a1f9-4b12-98a8-c1897c630d19"
 *                                  organizationName:
 *                                    type: string
 *                                    description: Название организации
 *                                    example: "Симферополь"
 *                                  createdAt:
 *                                    type: string
 *                                    nullable: true
 *                                    description: Дата создания записи
 *                                    example: "2024-04-22T13:24:50.000Z"
 *                                  updatedAt:
 *                                    type: string
 *                                    nullable: true
 *                                    description: Дата последнего обновления записи
 *                                    example: "2024-04-22T13:24:50.000Z"
 *                            account:
 *                              type: object
 *                              description: Информация об аккаунте 
 *                              properties:
 *                                id:
 *                                  type: string
 *                                  format: uuid
 *                                  description: ID аккаунта
 *                                  example: "07ff1130-a1f9-4b12-98a8-c1897c630d19"
 *                                firstName:
 *                                  type: string
 *                                  description: Имя пользователя
 *                                  example: Максим
 *                                lastName:
 *                                  type: string
 *                                  description: Фамилия пользователя
 *                                  example: Ковальски
 *                                telephoneNumber:
 *                                  type: string
 *                                  description: Телефонный номер пользователя
 *                                  example: '+79787513901'
 *                                telegramId:
 *                                  type: string
 *                                  description: ID Telegram пользователя
 *                                  example: 453120600
 *                                organizationList:
 *                                  type: JSON
 *                                  description: Список организаций, к которым принадлежит пользователь
 *                                  example: ["Джанкой", "Севастополь"]
 *                                isBlocked:
 *                                  type: boolean
 *                                  description: Статус блокировки аккаунта 
 *                                  example: false
 *                                lastSeen:
 *                                  type: string
 *                                  format: date-time
 *                                  description: Последнее время входа в систему 
 *                                  example: "2024-05-23T13:33:44.000Z"
 *                                accountNumber:
 *                                  type: integer
 *                                  description: Номер аккаунта пользователя
 *                                  example: 1
 *                                createdAt:
 *                                  type: string
 *                                  nullable: true
 *                                  description: Дата создания аккаунта пользователя
 *                                  example: "2024-05-25T16:56:00.000Z"
 *                                updatedAt:
 *                                  type: string
 *                                  format: date-time
 *                                  description: Дата последнего обновления аккаунта пользователя
 *                                  example: "2024-05-25T16:56:00.000Z"
 *                                roleId:
 *                                  type: integer
 *                                  description: ID роли пользователя
 *                                  example: 3
 *                                formattedLastSeen:
 *                                  type: string
 *                                  description: Форматированное время последнего входа в систему пользователя
 *                                  example: "16:33 23-05"
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *        404:
 *          description: Аккаунт не найден!
 */



/**
 * @swagger
 * /{accountId}/accounts/{accountFocusId}/update:
 *  put:
 *      tags:
 *          - Account
 *      summary: Запрос PUT для выбранного аккаунта
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: accountFocusId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID выбранного пользователя
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              firstName:
 *                                  type: string
 *                                  description: Имя пользователя
 *                                  example: Толян
 *                              lastName:
 *                                  type: string
 *                                  description: Фамилия пользователя
 *                                  example: Арбитражович
 *                              telephoneNumber:
 *                                  type: string
 *                                  description: Номер телефона пользователя
 *                                  example: '+79787513333' (также 89787513333)
 *                              organizationList:
 *                                  type: JSON
 *                                  nullable: true
 *                                  description: Список организация, привязанных к пользователю
 *                                  example: ["Джанкой", "Севастополь"]
 *                                      
 *      responses:
 *        200:
 *          description: Аккаунт успешно обновлен!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *        500:
 *          description: Форма ввода некорректна, повторите попытку!
 */




/**
 * @swagger
 * /{accountId}/superAdmin/accounts:
 *  get:
 *      tags:
 *          - Account
 *      summary: Запрос GET для всех пользователей от лица суперАдмина
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
 *          description: Список аккаунтов
 *          content:
 *            application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      title:
 *                        type: string
 *                        description: Заголовок списка аккаунтов
 *                        example: "Список аккаунтов"
 *                      accounts:
 *                        type: array
 *                        description: Список аккаунтов
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              description: Уникальный идентификатор аккаунта
 *                              example: "0056ac9c-e398-410d-8185-1196ead4a8b8"
 *                            firstName:
 *                              type: string
 *                              description: Имя аккаунта
 *                              example: "Илья"
 *                            lastName:
 *                              type: string
 *                              description: Фамилия аккаунта
 *                              example: "Белошейкин"
 *                            telephoneNumber:
 *                              type: string
 *                              description: Номер телефона аккаунта
 *                              example: '+79787513999' (также 89787513999)
 *                            telegramId:
 *                              type: string
 *                              nullable: true
 *                              description: ID Telegram аккаунта
 *                              example: 325235235
 *                            organizationList:
 *                                type: JSON
 *                                nullable: true
 *                                description: Список организация, привязанных к пользователю
 *                                example: ["Джанкой", "Севастополь"]
 *                            isBlocked:
 *                              type: boolean
 *                              description: Статус блокировки аккаунта
 *                              example: false
 *                            lastSeen:
 *                              type: string
 *                              nullable: true
 *                              description: Последнее время входа в систему аккаунта
 *                              example: "2024-05-28T09:17:42.000Z"
 *                            accountNumber:
 *                              type: integer
 *                              description: Номер аккаунта
 *                              example: 22
 *                            createdAt:
 *                              type: string
 *                              format: date-time
 *                              description: Дата создания аккаунта
 *                              example: "2024-05-27T09:17:42.000Z"
 *                            updatedAt:
 *                              type: string
 *                              format: date-time
 *                              description: Дата последнего обновления аккаунта
 *                              example: "2024-05-27T09:17:42.000Z"
 *                            roleId:
 *                              type: integer
 *                              description: ID роли аккаунта
 *                              example: 3 (также здесь отображаются те, у кого 2, т.е. админы)
 *                            formattedLastSeen:
 *                              type: string
 *                              nullable: true
 *                              description: Форматированное время последнего входа в систему аккаунта
 *                              example: 09:17 28-05
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */




/**
 * @swagger
 * /{accountId}/accounts:
 *  get:
 *      tags:
 *          - Account
 *      summary: Запрос GET для всех пользователей от лица Админа
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
 *          description: Список аккаунтов
 *          content:
 *            application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      title:
 *                        type: string
 *                        description: Заголовок списка аккаунтов
 *                        example: "Список аккаунтов"
 *                      accounts:
 *                        type: array
 *                        description: Список аккаунтов
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              description: Уникальный идентификатор аккаунта
 *                              example: "0056ac9c-e398-410d-8185-1196ead4a8b8"
 *                            firstName:
 *                              type: string
 *                              description: Имя аккаунта
 *                              example: "Илья"
 *                            lastName:
 *                              type: string
 *                              description: Фамилия аккаунта
 *                              example: "Белошейкин"
 *                            telephoneNumber:
 *                              type: string
 *                              description: Номер телефона аккаунта
 *                              example: '+79787513999' (также 89787513999)
 *                            telegramId:
 *                              type: string
 *                              nullable: true
 *                              description: ID Telegram аккаунта
 *                              example: 325235235
 *                            organizationList:
 *                                type: JSON
 *                                nullable: true
 *                                description: Список организация, привязанных к пользователю
 *                                example: ["Джанкой", "Севастополь"]
 *                            isBlocked:
 *                              type: boolean
 *                              description: Статус блокировки аккаунта
 *                              example: false
 *                            lastSeen:
 *                              type: string
 *                              nullable: true
 *                              description: Последнее время входа в систему аккаунта
 *                              example: "2024-05-28T09:17:42.000Z"
 *                            accountNumber:
 *                              type: integer
 *                              description: Номер аккаунта
 *                              example: 22
 *                            createdAt:
 *                              type: string
 *                              format: date-time
 *                              description: Дата создания аккаунта
 *                              example: "2024-05-27T09:17:42.000Z"
 *                            updatedAt:
 *                              type: string
 *                              format: date-time
 *                              description: Дата последнего обновления аккаунта
 *                              example: "2024-05-27T09:17:42.000Z"
 *                            roleId:
 *                              type: integer
 *                              description: ID роли аккаунта
 *                              example: 3 
 *                            formattedLastSeen:
 *                              type: string
 *                              nullable: true
 *                              description: Форматированное время последнего входа в систему аккаунта
 *                              example: 09:17 28-05
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */




/**
 * @swagger
 * /{accountId}/newAccount:
 *  get:
 *      tags:
 *          - Account
 *      summary: Запрос GET для получения формы создания нового аккаунта от лица админа
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
 *          description: Форма создания аккаунта для админа
 *          content:
 *            application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      title:
 *                        type: string
 *                        description: Форма создания аккаунта для админа
 *                        example: Форма создания аккаунта для админа
 *                      organizations:
 *                        type: array
 *                        description: Список организаций
 *                        items:
 *                          type: object
 *                          $ref: '#/components/schemas/OrganizationCustomer'
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */



/**
 * @swagger
 * /{accountId}/newAccount:
 *  post:
 *      tags:
 *          - Account
 *      summary: Запрос POST для создания нового аккаунта от лица админа
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  firstName:
 *                      type: string
 *                      description: Имя пользователя
 *                      example: Максим
 *                  lastName:
 *                      type: string
 *                      description: Фамилия пользователя
 *                      example: Ковальский
 *                  telephoneNumber:
 *                      type: string
 *                      description: Номер телефона пользователя
 *                      example: '+79787513333'
 *                  organizationList:
 *                      type: JSON
 *                      nullable: true
 *                      description: Список организация, привязанных к пользователю
 *                      example: ["Джанкой", "Севастополь"]
 *      responses:
 *        200:
 *          description: Аккаунт успешно создан!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *        500:
 *          description: Некорректная форма создания аккаунта!
 */



/**
 * @swagger
 * /{accountId}/superAdmin/newAccount:
 *  get:
 *      tags:
 *          - Account
 *      summary: Запрос GET для получения формы создания нового аккаунта от лица суперАдмина
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
 *          description: Форма создания аккаунта для суперАдмина
 *          content:
 *            application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                          title:
 *                            type: string
 *                            description: Форма создания аккаунта для админа
 *                            example: Форма создания аккаунта для админа
 *                          organizations:
 *                            type: array
 *                            description: Список организаций
 *                            items:
 *                              type: object
 *                              $ref: '#/components/schemas/OrganizationCustomer'
 *                          allRoles:
 *                            type: array
 *                            description: Список ролей
 *                            items:
 *                              type: object
 *                              $ref: '#/components/schemas/Role'
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */



/**
 * @swagger
 * /{accountId}/superAdmin/newAccount:
 *  post:
 *      tags:
 *          - Account
 *      summary: Запрос POST для создания нового аккаунта от лица суперАдмина
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  firstName:
 *                      type: string
 *                      description: Имя пользователя
 *                      example: Максим
 *                  lastName:
 *                      type: string
 *                      description: Фамилия пользователя
 *                      example: Ковальский
 *                  telephoneNumber:
 *                      type: string
 *                      description: Номер телефона пользователя
 *                      example: '+79787513333'
 *                  organizationList:
 *                      type: JSON
 *                      nullable: true
 *                      description: Список организация, привязанных к пользователю
 *                      example: ["Джанкой", "Севастополь"]
 *                  roleId:
 *                      type: integer
 *                      description: ID роли
 *                      example: 2
 *      responses:
 *        200:
 *          description: Аккаунт успешно создан!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *        500:
 *          description: Некорректная форма создания аккаунта!
 */






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
 */





/**
 * @swagger
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
 */
