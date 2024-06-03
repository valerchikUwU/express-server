
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
*
*
*
*
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
