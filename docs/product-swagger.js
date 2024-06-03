
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
 *
 * 
 * 
 * 
 * 
 * 
 * /{accountId}/productsByType/{typeId}:
 *       get:
 *           tags:
 *               - Product
 *           summary: Получить список всех товаров по типу (typeId)
 *           parameters:
 *             - in: path
 *               name: accountId
 *               required: true
 *               schema:
 *                 type: string
 *                 format: uuid
 *               description: ID пользователя
 *             - in: path
 *               name: typeId
 *               required: true
 *               schema:
 *                 type: integer
 *               description: ID категории товаров
 *           responses:
 *             200:
 *               description: |
 *                  Категории:
 *                   - Начальные
 *                   - Основные
 *                   - Для сотрудников
 *                   - Депозит
 *               content:
 *                 application/json:
 *                   schema:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Product'
 *             403:
 *               description: У вас нет прав доступа или вы были заблокированы!
 */
