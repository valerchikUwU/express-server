const Role = require('../role');
const Account = require('../account');
const OrganizationCustomer = require('../organizationCustomer');
const Payee = require('../payee');
const Order = require('../order');
const Product = require('../product');
const ProductType = require('../productType');
const PriceDefinition = require('../priceDefinition');
const TitleOrders = require('../titleOrders');
const AccrualRule = require('../accrualRule');
const CommisionReciever = require('../commisionReceiver');
const CommisionRecieverOperations = require('../commisionRecieverOperations');
const Image = require('../image');
const Subscriptions = require('../subscriptions');
const History = require('../history')
const Review = require('../review')
const { DataTypes } = require('sequelize');






Role.hasMany(Account, {
   foreignKey: {
      name: 'roleId',
      type: DataTypes.INTEGER, // Использование UUID в качестве типа ключа
      allowNull: false, // Внешний ключ не может быть NULL
   },
   as: 'accounts'
});

Account.belongsTo(Role, {
   foreignKey: 'roleId',
   as: 'role' // Это позволит вам обращаться к роли через аккаунт, используя 'role'
});



OrganizationCustomer.hasMany(Order, {
   foreignKey: {
      name: 'organizationCustomerId',
      type: DataTypes.UUID, // Использование UUID в качестве типа ключа
      allowNull: false, // Внешний ключ не может быть NULL
   },
   as: 'orders'
});

Order.belongsTo(OrganizationCustomer, {
   foreignKey: 'organizationCustomerId',
   as: 'organization'
});

Payee.hasMany(Order, {
   foreignKey: {
      name: 'payeeId',
      type: DataTypes.UUID, // Использование UUID в качестве типа ключа
      allowNull: true, // Внешний ключ не может быть NULL
   },
   as: 'orders'
});


Order.belongsTo(Payee, {
   foreignKey: 'payeeId',
   as: 'payee'
});



ProductType.hasMany(Product, {
   foreignKey: {
      name: 'productTypeId',
      type: DataTypes.INTEGER, // Использование UUID в качестве типа ключа
      allowNull: false, // Внешний ключ не может быть NULL
   },
   as: 'products'
});

Product.belongsTo(ProductType, {
   foreignKey: 'productTypeId',
   as: 'productType'
});

Product.hasMany(PriceDefinition, { 
   foreignKey: {
      name: 'productId',
      type: DataTypes.UUID,
      allowNull: false
   },
   as: 'prices'
});

PriceDefinition.belongsTo(Product, { 
   foreignKey: 'productId',
   as: 'product' 
});

Product.hasMany(TitleOrders, {
   foreignKey: {
      name: 'productId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'titles'
});

TitleOrders.belongsTo(Product, {
   foreignKey: 'productId',
   as: 'product'
});


Order.hasOne(TitleOrders, {
   foreignKey: {
      name: 'orderId',
      type: DataTypes.UUID,
      allowNull: false,
   }
});

TitleOrders.belongsTo(Order, {
   foreignKey: 'orderId'
});

PriceDefinition.hasMany(TitleOrders, {
   foreignKey: {
      name: 'priceDefId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'titles'
});

TitleOrders.belongsTo(PriceDefinition, {
   foreignKey: 'priceDefId',
   as: 'price'
});

Account.hasMany(Order, {
   foreignKey: {
      name: 'accountId',
      type: DataTypes.UUID,
      allowNull: true,
   },
   as: 'orders'
});

Order.belongsTo(Account, {
   foreignKey: 'accountId',
   as: 'account'
})



ProductType.hasMany(AccrualRule, {
   foreignKey: {
      name: 'productTypeId',
      type: DataTypes.INTEGER, // Использование UUID в качестве типа ключа
      allowNull: true
   },
   as: 'rules'
});

AccrualRule.belongsTo(ProductType, {
   foreignKey: 'productTypeId',
   as: 'productType'
});


Product.hasMany(AccrualRule, {
   foreignKey: {
      name: 'productId',
      type: DataTypes.UUID, // Использование UUID в качестве типа ключа
      allowNull: true
   },
   as: 'rules'
});

AccrualRule.belongsTo(Product, {
   foreignKey: 'productId',
   as: 'product'
});

CommisionReciever.hasMany(AccrualRule, {
   foreignKey: {
      name: 'commisionRecieverId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'rules'
});

AccrualRule.belongsTo(CommisionReciever, {
   foreignKey: 'commisionRecieverId',
   as: 'commisionReciever'
});


CommisionReciever.hasMany(CommisionRecieverOperations, {
   foreignKey: {
      name: 'commisionRecieverId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'operations'
});

CommisionRecieverOperations.belongsTo(CommisionReciever, {
   foreignKey: 'commisionRecieverId',
   as: 'commisionReciever'
});


Account.hasOne(Subscriptions, {
   foreignKey: {
      name: 'accountId',
      type: DataTypes.UUID,
      allowNull: false,
   }
});

Subscriptions.belongsTo(Account, {
   foreignKey: 'accountId'
});


Image.hasOne(Product, {
   foreignKey: {
      name: 'imageId',
      type: DataTypes.UUID,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
   }
});

Product.belongsTo(Image, {
   foreignKey: 'imageId'
});


Account.hasMany(History, {
   foreignKey: {
      name: 'accountId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'histories'
});

History.belongsTo(Account, {
   foreignKey: 'accountId',
   as: 'account'
});


Order.hasMany(History, {
   foreignKey: {
      name: 'orderId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'histories'
});

History.belongsTo(Order, {
   foreignKey: 'orderId',
   as: 'order'
});


OrganizationCustomer.hasMany(History, {
   foreignKey: {
      name: 'organizationCustomerId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'histories'
});

History.belongsTo(OrganizationCustomer, {
   foreignKey: 'organizationCustomerId',
   as: 'organizationCustomer'
});


OrganizationCustomer.hasMany(Review, {
   foreignKey: {
      name: 'organizationCustomerId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'reviews'
});

Review.belongsTo(OrganizationCustomer, {
   foreignKey: 'organizationCustomerId',
   as: 'organizationCustomer'
});




CommisionReciever.hasMany(Review, {
   foreignKey: {
      name: 'commisionRecieverId',
      type: DataTypes.UUID,
      allowNull: true,
   },
   as: 'reviews'
});

Review.belongsTo(CommisionReciever, {
   foreignKey: 'commisionRecieverId',
   as: 'commisionReciever'
});

Product.hasMany(Review, {
   foreignKey: {
      name: 'productId',
      type: DataTypes.UUID,
      allowNull: true,
   },
   as: 'reviews'
});

Review.belongsTo(Product, {
   foreignKey: 'productId',
   as: 'product'
});


ProductType.hasMany(Review, {
   foreignKey: {
      name: 'productTypeId',
      type: DataTypes.INTEGER,
      allowNull: true,
   },
   as: 'reviews'
});

Review.belongsTo(ProductType, {
   foreignKey: 'productTypeId',
   as: 'productType'
});

Payee.hasMany(Review, {
   foreignKey: {
      name: 'payeeId',
      type: DataTypes.UUID,
      allowNull: true,
   },
   as: 'reviews'
});

Review.belongsTo(Payee, {
   foreignKey: 'payeeId',
   as: 'payee'
});


// -118125 ₽