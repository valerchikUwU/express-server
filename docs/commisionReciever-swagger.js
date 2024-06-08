
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
 *          content:
 *            application/json:
 *              schema:
 *                title: "Список получателей комиссии"
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                      id:
 *                        type: string
 *                        format: uuid
 *                        description: Уникальный идентификатор получателя комиссии
 *                        example: 8800e557-6247-4f12-a9d8-534d59c09318
 *                      name:
 *                        type: string
 *                        nullable: false
 *                        description: Название получателя комиссии
 *                        example: OOO Gavnoedka
 *                      rulesQuantity:
 *                          type: integer
 *                          nullable: false
 *                          description: Кол-во правил для получателя
 *                          example: 5
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
 *                allSpisanie:
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
 */
