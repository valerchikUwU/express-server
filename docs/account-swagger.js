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
 *
 *  put:
 *       tags:
 *           - Account
 *       summary: Запрос PUT для выбранного аккаунта
 *       parameters:
 *         - in: path
 *           name: accountId
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: ID пользователя
 *         - in: path
 *           name: accountFocusId
 *           required: true
 *           schema:
 *               type: string
 *               format: uuid
 *           description: ID выбранного пользователя
 *       requestBody:
 *               required: true
 *               content:
 *                   application/json:
 *                       schema: 
 *                           type: object
 *                           properties:
 *                               firstName:
 *                                   type: string
 *                                   description: Имя пользователя
 *                                   example: Толян
 *                               lastName:
 *                                   type: string
 *                                   description: Фамилия пользователя
 *                                   example: Арбитражович
 *                               telephoneNumber:
 *                                   type: string
 *                                   description: Номер телефона пользователя
 *                                   example: '+79787513333 (также 89787513333)'
 *                               organizationList:
 *                                   type: JSON
 *                                   nullable: true
 *                                   description: Список организация, привязанных к пользователю
 *                                   example: ["Джанкой", "Севастополь"]
 *                                       
 *       responses:
 *         200:
 *           description: Аккаунт успешно обновлен!
 *         403:
 *           description: У вас нет прав доступа или вы были заблокированы!
 *         500:
 *           description: Форма ввода некорректна, повторите попытку!
 * 
 * 
 *  
 *
 * 
 * 
 * 
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
 *                              example: '+79787513999 (также 89787513999)'
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
 *
 * 
 * 
 * 
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
 *                              example: '+79787513999 (также 89787513999)'
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
 *
 * 
 * 
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
 *
 * 
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
 *
 * 
 * 
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
 *
 * 
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