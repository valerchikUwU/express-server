const express = require("express");
const router = express.Router();
const products_controller = require("../controllers/productsController");
const accounts_controller = require("../controllers/accountsController");
const orders_controller = require("../controllers/ordersController");
const payees_controller = require("../controllers/payeeController");
const priceDefinition_controller = require("../controllers/priceDefinitionController");
const titleOrders_controller = require("../controllers/titleOrdersController");
const deposit_controller = require("../controllers/depositController");
const statistics_controller = require("../controllers/statisticsController");
const rules_controller = require('../controllers/accrualRuleController');
const commisionReceiver_controller = require('../controllers/commisionRecieverController');
const checkAbilities = require('../../utils/checkAbility');










/*
============================================================
ЗАПРОСЫ ДЛЯ ТОВАРОВ
============================================================
*/

router.get("/:accountId/productsByType/:typeId", checkAbilities('read', 'Product'), products_controller.products_list);



router.get("/:accountId/products", checkAbilities('read', 'Product'), products_controller.all_products);




/*
============================================================
ЗАПРОСЫ ДЛЯ ЗАКАЗОВ
============================================================
*/







/**
 * Запрос POST для создания заказа от лица пользователя
 */
router.post("/:accountId/orders/newOrder", checkAbilities('create', 'Order_User'), orders_controller.user_order_create_post);




/**
 * Запрос PUT для обновления черновика заказа от лица пользователя (НА СТРАНИЦЕ "В РАБОТЕ")
 */
router.put("/:accountId/orders/:orderId/active", checkAbilities('update', 'Order_User'), orders_controller.user_draftOrder_updateStatus_put)

/**
 * Запрос PUT для обновления отправленного заказа на полученный от лица пользователя (НА СТРАНИЦЕ "В РАБОТЕ")
 */
router.put("/:accountId/orders/:orderId/recieved", checkAbilities('update', 'Order_User'), orders_controller.user_receivedOrder_updateStatus_put)


/**
 * Запрос GET для получения всех активных заказов пользователя
 */

router.get("/:accountId/orders", checkAbilities('read', 'Order_User'), orders_controller.user_active_orders_list)



/**
 * Запрос GET для получения всех завершенных заказов пользователя
 */
router.get("/:accountId/orders/finished", checkAbilities('read', 'Order_User'), orders_controller.user_finished_orders_list);


/**
 * Запрос GET для получения всех заказов от лица админа
 */
router.get("/:accountId/orders/all", checkAbilities('read', 'Order_Admin'), orders_controller.admin_orders_list);

/**
 * Запрос GET для получения всех архивных заказов от лица админа
 */
router.get("/:accountId/orders/archive", checkAbilities('read', 'Order_Admin'), orders_controller.admin_archivedOrders_list);



/**
 * Запрос GET для получения формы создания заказа от лица Админа
 * @param orderId - id заказа 
 */
router.get("/:accountId/orders/admin/newOrder", checkAbilities('read', 'Order_Admin'), orders_controller.admin_order_create_get);


/**
 * Запрос POST для создания заказа от лица Админа
 * @param orderId - id заказа 
 */
router.post("/:accountId/orders/admin/newOrder", checkAbilities('create', 'Order_Admin'), orders_controller.admin_order_create_post);


/**
 * Запрос GET для получения деталей (Всех TitleOrders и OrganizationCustomer) для выбранного заказа от лица админа
 * @param orderId - id заказа 
 */
router.get("/:accountId/orders/admin/:orderId", checkAbilities('read', 'Order_Admin'), orders_controller.admin_order_detail);

/**
 * Запрос GET для получения деталей (Всех TitleOrders) для выбранного заказа от лица пользователя
 * @param orderId - id заказа
 */
router.get("/:accountId/orders/:orderId", checkAbilities('read', 'Order_User'), orders_controller.user_order_detail);

/*
============================================================
ЗАПРОСЫ ДЛЯ НАИМЕНОВАНИЙ(TitleOrder)
============================================================
*/

/**
 * Запрос DELETE для удаления ОДНОГО! TitleOrder в заказе
 * @param orderId - id заказа
 * @param titleId - id наименования
 */
router.delete("/:accountId/orders/:orderId/delete/:titleId", checkAbilities('delete', 'TitleOrder_User'), titleOrders_controller.title_delete)

/**
 * Запрос PUT для обновления ВСЕХ! TitleOrder в заказе от лица админа
 * @param orderId - id заказа
 */
router.put("/:accountId/orders/admin/:orderId/update", checkAbilities('update', 'TitleOrder_Admin'), titleOrders_controller.admin_titleOrder_update_put);


/**
 * Запрос PUT для обновления ВСЕХ! TitleOrder в заказе от лица пользователя
 * @param orderId - id заказа
 */
router.put("/:accountId/orders/:orderId/update", checkAbilities('update', 'TitleOrder_User'), titleOrders_controller.user_titleOrder_update_put);










/*
============================================================
ЗАПРОСЫ ДЛЯ Получателей платежа(Payee)
============================================================
*/

/**
 * Запрос GET для получения всех получателей платежей (Payee)
 */
router.get("/:accountId/payees", checkAbilities('read', 'SuperAdmin'), payees_controller.payee_list);

/**
 * Запрос GET для получения формы для создания нового получателя платежа (Payee)
 */
router.get("/:accountId/payees/newPayee", checkAbilities('read', 'SuperAdmin'), payees_controller.payee_create_get);
/**
 * Запрос POST для создания нового получателя платежа (Payee)
 */
router.post("/:accountId/payees/newPayee", checkAbilities('create', 'SuperAdmin'), payees_controller.payee_create_post);



/*
============================================================
ЗАПРОСЫ ДЛЯ ПРАЙС ЛИСТОВ(PriceDefinition)
============================================================
*/

/**
 * Запрос GET для получения всех прайс листов(PriceDefinition)
 */
router.get("/:accountId/prices", checkAbilities('read', 'PriceDefinition'), priceDefinition_controller.prices_list);



/**
 * Запрос GET для получения формы создания прайс листа (PriceDefinition)
 */
router.get("/:accountId/prices/newPrice", checkAbilities('read', 'PriceDefinition'), priceDefinition_controller.price_create_get);

/**
 * Запрос POST для создания нового прайс листа (PriceDefinition)
 */
router.post("/:accountId/prices/newPrice", checkAbilities('create', 'PriceDefinition'), priceDefinition_controller.price_create_post);
/**
 * Запрос GET для получения формы обновления прайс листа (PriceDefinition)
 * @param priceDefId - id прайс листа
 */
router.get("/:accountId/prices/:priceDefId/update", checkAbilities('read', 'PriceDefinition'), priceDefinition_controller.price_update_get);
/**
 * Запрос PUT для обновления прайс листа (PriceDefinition)
 * @param priceDefId - id прайс листа
 */
router.put("/:accountId/prices/:priceDefId/update", checkAbilities('update', 'PriceDefinition'), priceDefinition_controller.price_update_put);




/*
============================================================
ЗАПРОСЫ ДЛЯ АККАУНТОВ
============================================================
*/


/**
 * Запрос GET для получения формы обновления аккаунта
 * @param accountFocusId - id выбранного пользователя
 */
router.get("/:accountId/accounts/:accountFocusId/update", checkAbilities('read', 'Account'), accounts_controller.account_update_get);

/**
 * Запрос PUT для выбранного аккаунта
 * @param accountFocusId - id выбранного пользователя
 */
router.put("/:accountId/accounts/:accountFocusId/update", checkAbilities('update', 'Account'), accounts_controller.account_update_put);




/**
 * Запрос GET для всех пользователей от лица суперАдмина
 */
router.get("/:accountId/superAdmin/accounts", checkAbilities('read', 'SuperAdmin'), accounts_controller.superAdmin_accounts_list);


/**
 * Запрос GET для всех пользователей от лица админа
 */
router.get("/:accountId/accounts", checkAbilities('read', 'Account'), accounts_controller.accounts_list);


/**
 * Запрос GET для получения формы создания нового аккаунта
 */
router.get("/:accountId/newAccount", checkAbilities('read', 'Account'), accounts_controller.account_organization_create_get);


/**
 * Запрос POST для создания нового аккаунта
 */
router.post("/:accountId/newAccount", checkAbilities('create', 'Account'), accounts_controller.account_organization_create_post);


/**
 * Запрос GET для получения формы создания нового аккаунта
 */
router.get("/:accountId/superAdmin/newAccount", checkAbilities('read', 'SuperAdmin'), accounts_controller.superAdmin_account_organization_create_get);


/**
 * Запрос POST для создания нового аккаунта
 */
router.post("/:accountId/superAdmin/newAccount", checkAbilities('create', 'SuperAdmin'), accounts_controller.superAdmin_account_organization_create_post);





/*
============================================================
ЗАПРОСЫ ДЛЯ ДЕПОЗИТОВ
============================================================
*/



/**
 * Запрос POST для добавления депозита
 * @param organizationCustomerId - id организации
 */
router.post("/:accountId/deposits/:organizationCustomerId/newDeposit", checkAbilities('create', 'SuperAdmin'), deposit_controller.deposit_create_post);


/**
 * Запрос GET для получения деталей депозитов для конкретной организации
 * @param organizationCustomerId - id организации
 */
router.get("/:accountId/deposits/:organizationCustomerId", checkAbilities('read', 'SuperAdmin'), deposit_controller.deposits_details);


/**
 * Запрос GET для получения всех остатков на депозитах
 */
router.get("/:accountId/deposits", checkAbilities('read', 'Deposit'), deposit_controller.deposits_list);





/*
============================================================
ЗАПРОСЫ ДЛЯ СТАТИСТИКИ
============================================================
*/


/**
 * Запрос GET для получения статистики
 */
router.get("/:accountId/statistics", checkAbilities('read', 'Statistics'), statistics_controller.sells_list);


/*
============================================================
ЗАПРОСЫ ДЛЯ ПОЛУЧАТЕЛЕЙ КОМИССИИ
============================================================
*/


router.post("/:accountId/:commisionRecieverId/newRule", checkAbilities('create', 'Rule'), rules_controller.accrualRule_create_post);

/*
============================================================
ЗАПРОСЫ ДЛЯ ПРАВИЛ НАЧИСЛЕНИЯ КОМИССИИ
============================================================
*/


router.post("/:accountId/newCommisionReciever", checkAbilities('create', 'CommisionReciever'), commisionReceiver_controller.commisionReciever_create_post);


module.exports = router;