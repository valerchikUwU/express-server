
/**
 * @swagger
 * /{accountId}/commisionRecievers:
 *  get:
 *      tags:
 *          - CommisionReciever
 *      summary: Получить список всех получателей комиссии
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
 *          description: Все получатели комиссии
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                    description: Заголовок запроса
 *                    example: "Список получателей комиссии"
 *                  allCommisionRecievers:
 *                    type: array
 *                    description: Список всех получателей комиссии
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          description: Уникальный идентификатор получателя
 *                          example: "14b5c41e-0f61-4526-a5e9-4cb718260b2d"
 *                        name:
 *                          type: string
 *                          description: Название получателя
 *                          example: "Максик"
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
 *                        rulesQuantity:
 *                          type: integer
 *                          nullable: true
 *                          description: количество правил для получателя
 *                          example: 4
 *                  commisionReceiverOperations:
 *                    type: array
 *                    description: Все списания по получателям комиссии
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
 *                        allSpisanie:
 *                          type: string
 *                          description: Сумма всех списаний по данному получателю
 *                          example: "12345683"
 *                  commisionSum:
 *                    type: array
 *                    description: Все поступления по получателям комиссии
 *                    items:
 *                      type: object
 *                      properties:
 *                        commisionRecieverId:
 *                          type: string
 *                          format: date-time
 *                          description: ID получателя комиссии
 *                          example: "14b5c41e-0f61-4526-a5e9-4cb718260b2d"
 *                        Postyplenie:
 *                          type: string
 *                          description: Сумма всех поступлений по данному получателю
 *                          example: "176.00"
 *                            
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *
 * 
 * 
 * 
 * 
 * 
 * /{accountId}/commisionRecievers/{commisionRecieverId}/rulesDetails:
 *  get:
 *    tags:
 *      - CommisionReciever    
 *    summary: Получить все правила начисления для конкретного получателя
 *    parameters:
 *      - in: path
 *        name: accountId
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *        description: ID пользователя
 *      - in: path
 *        name: commisionRecieverId
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *        description: ID получателя
 *    responses:
 *      200:
 *        description: Правила начисления получателя комиссии
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Заголовок информации о получателе
 *                  example: "Правила начисления получателя комиссии OOO Gavnoedka"
 *                commisionReciever:
 *                  type: object
 *                  description: Информация о получателе комиссии
 *                  properties:
 *                    id:
 *                      type: string
 *                      description: Уникальный идентификатор получателя
 *                      example: "94fc2947-a382-4d1b-9b0d-96bcd95bb444"
 *                    name:
 *                      type: string
 *                      description: Название получателя
 *                      example: "OOO Gavnoedka"
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                      description: Дата создания записи
 *                      example: "2024-06-03T13:01:13.000Z"
 *                    updatedAt:
 *                      type: string
 *                      format: date-time
 *                      description: Дата последнего обновления записи
 *                      example: "2024-06-03T13:01:13.000Z"
 *                allRules:
 *                  type: array
 *                  description: Список всех правил начисления
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: Уникальный идентификатор правила
 *                        example: "1ae3281e-5940-47c8-aa18-0c15e036f55d"
 *                      commision:
 *                        type: string
 *                        description: Комиссия
 *                        example: "900"
 *                      accessType:
 *                        type: string
 *                        nullable: true
 *                        description: Тип доступа
 *                        example: null
 *                      generation:
 *                        type: string
 *                        nullable: true
 *                        description: Генерация
 *                        example: null
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        description: Дата создания правила
 *                        example: "2024-06-04T15:48:19.000Z"
 *                      updatedAt:
 *                        type: string
 *                        format: date-time
 *                        description: Дата последнего обновления правила
 *                        example: "2024-06-04T15:48:19.000Z"
 *                      productTypeId:
 *                        type: string
 *                        nullable: true
 *                        description: ID типа продукта
 *                        example: null
 *                      productId:
 *                        type: string
 *                        description: ID продукта
 *                        example: "3c248e88-b431-4519-bf16-085058206aab"
 *                      commisionRecieverId:
 *                        type: string
 *                        description: ID получателя комиссии
 *                        example: "94fc2947-a382-4d1b-9b0d-96bcd95bb444"
 *                      prodName:
 *                        type: string
 *                        description: Название продукта
 *                        example: "Товар для валеры"
 *                      prodAbbreviation:
 *                        type: string
 *                        description: Аббревиатура продукта
 *                        example: "ТДВ"
 *                allProducts:
 *                  type: array
 *                  description: Все товары
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: Уникальный идентификатор правила
 *                        example: "1ae3281e-5940-47c8-aa18-0c15e036f55d"
 *                      name:
 *                        type: string
 *                        description: Название продукта
 *                        example: "Товар для валеры"
 *                      abbreviation:
 *                        type: string
 *                        description: Аббревиатура продукта
 *                        example: "ТДВ"
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        description: Дата создания правила
 *                        example: "2024-06-04T15:48:19.000Z"
 *                      updatedAt:
 *                        type: string
 *                        format: date-time
 *                        description: Дата последнего обновления правила
 *                        example: "2024-06-04T15:48:19.000Z"
 *                      productTypeId:
 *                        type: string
 *                        nullable: true
 *                        description: ID типа продукта
 *                        example: 1
 *                      activationDate:
 *                        type: string
 *                        format: date-time
 *                        description: Дата активации
 *                        example: "2024-06-04T15:48:19.000Z"
 * 
 * 
 * 
 * 
 * /{accountId}/newCommisionReciever:                   
 *    post:
 *      tags:
 *          - CommisionReciever
 *      summary: Запрос POST для создания нового получателя комиссии
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
 *                commisionRecieverName:
 *                    type: string
 *                    description: Название получателя
 *                    example: ООО Пипка
 *      responses:
 *        200:
 *          description: Получатель успешно создан!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 *        500:
 *          description: Некорректная форма создания получателя!
 *
 * 
 * /{accountId}/commisionRecievers/{commisionRecieverId}/balanceDetails:
 *  get:
 *    tags:
 *      - CommisionReciever    
 *    summary: Получить баланс для конкретного получателя
 *    parameters:
 *      - in: path
 *        name: accountId
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *        description: ID пользователя
 *      - in: path
 *        name: commisionRecieverId
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *        description: ID получателя
 *    responses:
 *      200:
 *        description: Баланс получателя комиссии
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Заголовок информации о получателе
 *                  example: "Детали баланса получателя комиссии OOO Gavnoedka"
 *                commisionReciever:
 *                  type: object
 *                  description: Информация о получателе комиссии
 *                  properties:
 *                    id:
 *                      type: string
 *                      description: Уникальный идентификатор получателя
 *                      example: "94fc2947-a382-4d1b-9b0d-96bcd95bb444"
 *                    name:
 *                      type: string
 *                      description: Название получателя
 *                      example: "OOO Gavnoedka"
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                      description: Дата создания записи
 *                      example: "2024-06-03T13:01:13.000Z"
 *                    updatedAt:
 *                      type: string
 *                      format: date-time
 *                      description: Дата последнего обновления записи
 *                      example: "2024-06-03T13:01:13.000Z"
 *                operations:
 *                  type: array
 *                  description: Список всех списаний
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: Уникальный идентификатор операции
 *                        example: "1ae3281e-5940-47c8-aa18-0c15e036f55d"
 *                      dateOfOperation:
 *                        type: string
 *                        format: date-time
 *                        description: Дата операции
 *                        example: "2024-06-04T15:48:19.000Z"
 *                      Postyplenie:
 *                        type: decimal
 *                        description: Пока что всегда null
 *                        example: null
 *                      Spisanie:
 *                        type: decimal
 *                        description: Сумма списания
 *                        example: 30000
 *                      billNumber:
 *                        type: string
 *                        description: Номер операции
 *                        nullable: false
 *                        example: 130.af3
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        description: Дата создания операции
 *                        example: "2024-06-03T13:01:13.000Z"
 *                      updatedAt:
 *                        type: string
 *                        format: date-time
 *                        description: Дата последнего обновления 
 *                        example: "2024-06-04T15:48:19.000Z"
 *                      commisionRecieverId:
 *                        type: string
 *                        description: ID получателя комиссии
 *                        example: "94fc2947-a382-4d1b-9b0d-96bcd95bb444"
 *                allPostyplenie:
 *                  type: array
 *                  description: Все пополнения
 *                  items:
 *                    type: object
 *                    properties:
 *                      orderId:
 *                        type: string
 *                        description: Уникальный идентификатор заказа по которому идет начисление комиссии
 *                        example: "1ae3281e-5940-47c8-aa18-0c15e036f55d"
 *                      dateOfOperation:
 *                        type: string
 *                        format: date-time
 *                        description: Дата отправки заказа
 *                        example: "2024-06-04T15:48:19.000Z"
 *                      billNumber:
 *                        type: string
 *                        description: Номер заказа
 *                        nullable: false
 *                        example: 230030.af3
 *                      Postyplenie:
 *                        type: decimal
 *                        description: Сумма поступления
 *                        example: 30000
 * 
 * 
 * 
 * 
 */
