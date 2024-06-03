
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
 *                              type: decimal
 *                              description: Цена доступа
 *                              example: "15000"
 *                            priceBooklet:
 *                              type: decimal
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
 *                              type: decimal
 *                              description: Цена доступа
 *                              example: "15000"
 *                            priceBooklet:
 *                              type: decimal
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
 *                              type: decimal
 *                              description: Цена доступа
 *                              example: "15000"
 *                            priceBooklet:
 *                              type: decimal
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
 *
 * 
 * 
 * 
 * 
 * 
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
 *
 * 
 * 
 * 
 * 
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
 *
 * 
 * 
 * 
 * 
 * 
 * 
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
 *                                type: decimal
 *                                example: "1"
 *                              priceBooklet:
 *                                type: decimal
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
 *
 * 
 * 
 * 
 * 
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
