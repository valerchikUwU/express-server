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
 *                              dispatchDate:
 *                                  type: string
 *                                  description: дата отправки
 *                                  format: date-time
 *                                  example: "2024-05-23T09:57:47.000Z"
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
 *
 * 
 * 
 * 
 * 
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
 *
 * 
 * 
 * 
 * 
 * 
 * 
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
 *
 * 
 * 
 * 
 * 
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
 *                    productsInDraft:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          productIds:
 *                              type: string
 *                              example: "01584925-5783-428b-a592-e886cb8dca50,08b24a17-a152-46ad-aba4-c729cbae0cfc"
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
 *                            type: boolean
 *                            nullable: false
 *                            default: false
 *                            example: false
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
 *                          titlesCount:
 *                            type: integer
 *                            description: Кол-во наименований в черновике
 *                            nullable: false
 *                            example: 3
 *                          formattedDispatchDate:
 *                            type: string
 *                            format: date-time
 *                            nullable: true
 *                            example: 02-02-2002
 *        500:
 *          description: Произошла ошибка при получении активных заказов
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *
 * 
 * 
 * 
 * 
 * 
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
 *                                    type: decimal
 *                                    nullable: false
 *                                    example: '1235 (в случае депозита устанавл. в 1)'
 *                                  priceBooklet:
 *                                    type: decimal
 *                                    nullable: false
 *                                    example: '333 (в случае депозита устанавл. в 0)'
 *                          formattedDispatchDate:
 *                            type: string
 *                            nullable: true
 *                            format: date-time
 *                            example: 02-02-2002
 *        500:
 *          description: Произошла ошибка при получении активных заказов
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *
 * 
 * 
 * 
 * 
 * 
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
 *                            example: 02-02-2002
 *        500:
 *          description: Произошла ошибка при получении активных заказов
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *
 * 
 * 
 * 
 * 
 * 
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
 *                                    type: decimal
 *                                    nullable: false
 *                                    example: '1333 (в случае депозита устанавл. в 1)'
 *                                  priceBooklet:
 *                                    type: decimal
 *                                    nullable: false
 *                                    example: '330 (в случае депозита устанавл. в 0)'
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
 *
 * 
 * 
 * 
 * 
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
 *                  schema:
 *                    type: object
 *                    properties:
 *                      title:
 *                        type: string
 *                        description: Заголовок ответа
 *                        example: "Детали заказа"
 *                      order:
 *                        type: object
 *                        description: Информация о заказе
 *                        properties:
 *                          id:
 *                            type: string
 *                            description: Уникальный идентификатор заказа
 *                            example: "43ac75f5-2910-4581-9ce5-fa0ef3577575"
 *                          dispatchDate:
 *                            type: string
 *                            nullable: true
 *                            description: Дата отправки заказа
 *                            example: null
 *                          status:
 *                            type: string
 *                            description: Статус заказа
 *                            example: "Активный"
 *                          billNumber:
 *                            type: string
 *                            nullable: true
 *                            description: Номер счета
 *                            example: null
 *                          createdBySupAdm:
 *                            type: boolean
 *                            description: Был ли заказ создан суперпользователем
 *                            example: false
 *                          orderNumber:
 *                            type: integer
 *                            description: Номер заказа
 *                            example: 39
 *                          isFromDeposit:
 *                            type: boolean
 *                            description: Является ли заказ от депозита
 *                            example: false
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            description: Дата создания заказа
 *                            example: "2024-05-13T13:13:39.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            description: Дата последнего обновления заказа
 *                            example: "2024-05-13T13:13:49.000Z"
 *                          organizationCustomerId:
 *                            type: string
 *                            description: ID клиента организации
 *                            example: "1"
 *                          payeeId:
 *                            type: string
 *                            nullable: true
 *                            description: ID получателя платежей
 *                            example: null
 *                          accountId:
 *                            type: string
 *                            description: ID аккаунта
 *                            example: "1"
 *                          SUM:
 *                            type: string
 *                            description: Общая сумма заказа
 *                            example: "30000"
 *                          payeeName:
 *                            type: string
 *                            nullable: true
 *                            description: Имя получателя платежей
 *                            example: null
 *                          organizationName:
 *                            type: string
 *                            description: Название организации
 *                            example: "Симферополь"
 *                          organizationList:
 *                            type: array
 *                            description: Список организаций
 *                            items:
 *                              type: string
 *                              example: "Симферополь"
 *                          TitleOrder:
 *                            type: object
 *                            description: Информация о заголовке заказа
 *                            properties:
 *                              quantity:
 *                                type: integer
 *                                description: Количество единиц
 *                                example: 2
 *                              price:
 *                                type: object
 *                                properties:
 *                                  priceAccess:
 *                                    type: decimal
 *                                    description: Цена за доступ
 *                                    example: "15000"
 *                                  priceBooklet:
 *                                    type: decimal
 *                                    description: Цена за буклет
 *                                    example: "1500"
 *                          organization:
 *                            type: object
 *                            description: Информация об организации
 *                            properties:
 *                              organizationName:
 *                                type: string
 *                                description: Название организации
 *                                example: "Симферополь"
 *                          payee:
 *                            type: string
 *                            nullable: true
 *                            description: Получатель платежей
 *                            example: null
 *                          account:
 *                            type: object
 *                            description: Информация об аккаунте
 *                            properties:
 *                              organizationList:
 *                                type: array
 *                                description: Список организаций
 *                                items:
 *                                  type: string
 *                                  example: "Симферополь"
 *                      titles:
 *                        type: array
 *                        description: Список заголовков заказа
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              description: Уникальный идентификатор заголовка
 *                              example: "5e793d16-f6ec-4aab-b9d1-59656f354b1e"
 *                            accessType:
 *                              type: string
 *                              description: Тип доступа к заголовку
 *                              example: "Бумажный"
 *                            generation:
 *                              type: string
 *                              description: Генерация продукта
 *                              example: "Первое поколение"
 *                            addBooklet:
 *                              type: boolean
 *                              description: Необходимость добавления буклета
 *                              example: false
 *                            quantity:
 *                              type: integer
 *                              description: Количество единиц продукта
 *                              example: 2
 *                            createdAt:
 *                              type: string
 *                              format: date-time
 *                              description: Дата создания заголовка
 *                              example: "2024-05-13T13:13:39.000Z"
 *                            updatedAt:
 *                              type: string
 *                              format: date-time
 *                              description: Дата последнего обновления заголовка
 *                              example: "2024-05-13T13:13:39.000Z"
 *                            productId:
 *                              type: string
 *                              description: ID продукта
 *                              example: "01584925-5783-428b-a592-e886cb8dca50"
 *                            orderId:
 *                              type: string
 *                              description: ID заказа
 *                              example: "43ac75f5-2910-4581-9ce5-fa0ef3577575"
 *                            priceDefId:
 *                              type: string
 *                              description: ID определения о цененыка "377c60f7-4bf0-469b1-4d32-aef8-e9a0ef3577575"
 *                            SumForOneTitle:
 *                              type: string
 *                              description: Сумма для одной продукта "30000"
 *                              example: "30000"
 *                            product:
 *                              type: object
 *                              properties:
 *                                abbreviation:
 *                                  type: string
 *                                  description: Аббревиатура
 *                                  example: "НОП"
 *                            price:
 *                              type: object
 *                              properties:
 *                                priceAccess:
 *                                  type: decimal
 *                                  description: Цена доступа
 *                                  example: 10000
 *                                priceBooklet:
 *                                  type: decimal
 *                                  description: Цена буклета
 *                                  example: 1500
 *                            products:
 *                              type: array
 *                              items:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                    type: string
 *                                    format: uuid
 *                                    example: 8800e557-6247-4f12-a9d8-534d59c09318
 *                                  name:
 *                                    type: string
 *                                    nullable: false
 *                                    example: product
 *                                  abbreviation:
 *                                    type: string
 *                                    nullable: false
 *                                    example: KPSS
 *                                  createdAt:
 *                                    type: string
 *                                    format: date-time
 *                                    example: "2024-05-21T12:56:42.000Z"
 *                                  updatedAt:
 *                                    type: string
 *                                    format: date-time
 *                                    example: "2024-05-21T12:56:42.000Z"
 *                                  productTypeId:
 *                                    type: integer
 *                                    nullable: false
 *                                    example: 1
 *                                  priceAccess:
 *                                    type: decimal
 *                                    example: "3333"
 *                                  priceBooklet:
 *                                    type: decimal
 *                                    example: "10440"
 *                                  activationDate: 
 *                                    type: string
 *                                    example: "2024-04-25T12:44:40.000Z"
 *                            payees:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                      id:
 *                                        type: string
 *                                        format: uuid
 *                                        example: 4240e557-6247-4f12-a9d8-534d59c09318
 *                                      name:
 *                                        type: string
 *                                        nullable: false
 *                                        example: OOO PIPKA     
 *                                      createdAt:
 *                                        type: string
 *                                        format: date-time
 *                                        example: "2024-05-21T12:56:42.000Z"
 *                                      updatedAt:
 *                                        type: string
 *                                        format: date-time
 *                                        example: "2024-05-21T12:56:42.000Z"            
 *                            allOrganizations:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                      id:
 *                                        type: string
 *                                        format: uuid
 *                                        example: 2424357-6247-4f12-a9d8-534d59c09318
 *                                      organizationName:
 *                                        type: string
 *                                        nullable: false
 *                                        example: Севастополь     
 *                                      createdAt:
 *                                        type: string
 *                                        format: date-time
 *                                        example: "2024-05-21T12:56:42.000Z"
 *                                      updatedAt:
 *                                        type: string
 *                                        format: date-time
 *                                        example: "2024-05-21T12:56:42.000Z"            
 *        404:
 *          description: Заказ не найден
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * /{accountId}/orders/admin/newOrder:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения формы создания заказа от лица Админа
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
 *          description: Форма создания заказа
 *          content:
 *            application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: Форма создания заказа
 *                         example: "Форма создания заказа"
 *                       allProducts:
 *                         type: array
 *                         description: Список всех продуктов
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: Уникальный идентификатор продукта
 *                               example: "01584925-5783-428b-a592-e886cb8dca50"
 *                             name:
 *                               type: string
 *                               description: Название продукта
 *                               example: "новейший продукт"
 *                             abbreviation:
 *                               type: string
 *                               description: Аббревиатура продукта
 *                               example: "НОП"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               description: Дата создания продукта
 *                               example: "2024-04-22T13:19:44.000Z"
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                               description: Дата последнего обновления продукта
 *                               example: "2024-04-23T10:47:41.000Z"
 *                             productTypeId:
 *                               type: integer
 *                               description: ID типа продукта
 *                               example: 1
 *                             priceAccess:
 *                                 type: decimal
 *                                 description: Цена доступа
 *                                 example: 10000
 *                             priceBooklet:
 *                                 type: decimal
 *                                 description: Цена буклета
 *                                 example: 1500
 *                             activationDate:
 *                                 type: date
 *                                 description: Актуальная дата прайс листа
 *                                 example: 2024-05-29T11:03:09.000Z
 *                              
 *                          
 *                       allOrganizations:
 *                         type: array
 *                         description: Список всех организаций
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: Уникальный идентификатор организации
 *                               example: "1"
 *                             organizationName:
 *                               type: string
 *                               description: Название организации
 *                               example: "Симферополь"
 *                             createdAt:
 *                               type: string
 *                               nullable: true
 *                               description: Дата создания организации
 *                               example: null
 *                             updatedAt:
 *                               type: string
 *                               nullable: true
 *                               description: Дата последнего обновления информации об *\организации
 *                               example: null
 *                       allPayees:
 *                         type: array
 *                         description: Список всех получателей платежей
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: Уникальный идентификатор получателя платежей
 *                               example: "1c12df6d-11ed-46e2-93d9-e91d07c0a6d0"
 *                             name:
 *                               type: string
 *                               description: Название получателя платежей
 *                               example: "OOO Popka"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               description: Дата создания получателя платежей
 *                               example: "2024-04-22T13:26:49.000Z"
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                               description: Дата последнего обновления информации о получателе платежей
 *                               example: "2024-04-22T13:26:49.000Z"
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *
 * 
 * 
 * 
 * 
 *  post:
 *      tags:
 *          - Order
 *      summary: Запрос POST для создания заказа от лица Админа
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          organizationCustomerId:
 *                              type: string
 *                              description: ID клиента организации
 *                              example: "01584925-5783-428b-a592-e886cb8dca50"
 *                          status:
 *                              type: string
 *                              description: Статус заказа
 *                              example: "Активный"
 *                          billNumber:
 *                              type: string
 *                              description: Номер счета
 *                              example: "123.43"
 *                          payeeId:
 *                              type: string
 *                              description: ID получателя платежей
 *                              example: "2224925-5783-428b-a592-e886cb8dca50"
 *                          isFromDeposit:
 *                              type: boolean
 *                              description: Флаг, указывающий, является ли заказ от депозита
 *                              example: false
 *                          titlesToUpdate:
 *                              type: array
 *                              description: Список заголовков для создания
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      productId:
 *                                          type: string
 *                                          description: ID продукта
 *                                          example: "8eb897f2-22b1-4d32-aef8-e9a379b5c0e8"
 *                                      generation:
 *                                          type: string
 *                                          description: Генерация продукта
 *                                          example: "Второе поколение"
 *                                      accessType:
 *                                          type: string
 *                                          description: Тип доступа к продукту
 *                                          example: "Электронный"
 *                                      quantity:
 *                                          type: integer
 *                                          description: Количество единиц продукта
 *                                          example: 5
 *                                      addBooklet:
 *                                          type: boolean
 *                                          description: Флаг, указывающий, нужно ли добавить буклет
 *                                          example: false
 *      responses:
 *        200:
 *          description: Заказ успешно создан!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *        500:
 *          description: Некорректная форма заказа!
 *
 * 
 * 
 * 
 * 
 * 
 * 
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
 *                                  type: decimal
 *                                  example: "500"
 *                                priceBooklet:
 *                                  type: decimal
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
 *                              name:
 *                                type: string
 *                                example: "Третий продукт"
 *                          price:
 *                            type: object
 *                            properties:
 *                              priceAccess:
 *                                type: decimal
 *                                example: "500"
 *                              priceBooklet:
 *                                type: decimal
 *                                example: "100"
 *                          products:
 *                            type: array
 *                            items: 
 *                              type: object
 *                              properties:
 *                                  id:
 *                                    type: string
 *                                    format: uuid
 *                                    example: 8800e557-6247-4f12-a9d8-534d59c09318
 *                                  name:
 *                                    type: string
 *                                    nullable: false
 *                                    example: product
 *                                  abbreviation:
 *                                    type: string
 *                                    nullable: false
 *                                    example: KPSS
 *                                  createdAt:
 *                                    type: string
 *                                    format: date-time
 *                                    example: "2024-05-21T12:56:42.000Z"
 *                                  updatedAt:
 *                                    type: string
 *                                    format: date-time
 *                                    example: "2024-05-21T12:56:42.000Z"
 *                                  productTypeId:
 *                                    type: integer
 *                                    nullable: false
 *                                    example: 1
 *                                  priceAccess:
 *                                    type: decimal
 *                                    example: "3333"
 *                                  priceBooklet:
 *                                    type: decimal
 *                                    example: "10440"
 *                                  activationDate: 
 *                                    type: string
 *                                    example: "2024-04-25T12:44:40.000Z"
 *                              
 *        404:
 *          description: Заказ не найден
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */
