const { AbilityBuilder, Ability } = require('@casl/ability');
//Переменные среды
require('dotenv').config({path: '../.env'});




function defineAbilitiesFor(account) {
 const { can, cannot, rules } = new AbilityBuilder(Ability);



 if (process.env.NODE_ENV === 'development') {
  can('manage', 'all');
  return new Ability(rules);
}


// Если аккаунт заблокирован, запрещаем все действия
if (account.isBlocked) {
   cannot('manage', 'all');
   return new Ability(rules);
}

 switch (account.roleId) {
    case 1: // СуперАдмин
      can('manage', 'all'); // СуперАдмин может управлять всем
      break;
    case 2: // Админ
      can('read',   ['Order_Admin', 'Account', 'PriceDefinition', 'Deposit', 'Product']); // Админ может читать все
      can('create', ['Order_Admin', 'Account', 'PriceDefinition', 'WebPush']); // Админ может создавать заказы
      can('update', ['Order_Admin', 'Account', 'PriceDefinition', 'TitleOrder_Admin']); // Админ может обновлять заказы
      can('delete', ['WebPush']); // Пользователь может удалять свои наименования
      break;
    case 3: // Пользователь
      can('read',   ['Order_User', 'Product', 'TitleOrder_User'], { accountId: account.id }); // Пользователь может читать свои заказы
      can('create', ['Order_User', 'TitleOrder_User', 'WebPush']); // Пользователь может создавать заказы
      can('update', ['Order_User', 'TitleOrder_User'], { accountId: account.id }); // Пользователь может обновлять свои заказы
      can('delete', ['TitleOrder_User', 'WebPush'], { accountId: account.id }); // Пользователь может удалять свои наименования
      break;
    default:
      // Политика по умолчанию, если роль не определена
      cannot('manage', 'none');
 }

 return new Ability(rules);
}

module.exports = { defineAbilitiesFor };