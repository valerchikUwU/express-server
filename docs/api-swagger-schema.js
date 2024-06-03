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
 *              type: decimal
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
 *              description: Тип доступа к товару
 *              example: Бумажный
 *            generation:
 *              type: string
 *              nullable: false
 *              enum: ['Первое поколение', 'Второе поколение']
 *              description: Поколение товара
 *              example: Первое поколение
 *            addBooklet:
 *              type: boolean
 *              nullable: false
 *              description: Флаг добавления брошюры к заказу (если true, то accessType устанавливается в null)
 *              example: false
 *            quantity:
 *              type: integer
 *              nullable: false
 *              description: Количество заказанных товаров
 *              example: 25
 * 
 */























