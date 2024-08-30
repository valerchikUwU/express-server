const express = require("express");
const Account = require("../../models/account");
const Subscriptions = require("../../models/subscriptions");
const checkAbilities = require('../../utils/checkAbility');
const router = express.Router();
const { logger } = require("../../configuration/loggerConf");
const chalk = require("chalk");

router.post("/:accountId/save-subscription", async (req, res) => {
    const accountId = req.params.accountId;
    try {
        const subscription = new Subscriptions({
            endpoint: req.body.endpoint,
            expirationTime: req.body.expirationTime,
            keys: req.body.keys,
            accountId: accountId
        })
        await subscription.save();
        res.status(200).json({message: "Подписка успешно сохранена"})
    }
    catch(err){
        
    err.ip = req.ip;
    logger.error(err);
        console.log(err)
        res.status(500).json({message: "Ошибка при сохранении подписки"})
    }
});


router.post("/:accountId/delete-subscription",  async (req, res) => {
    const accountId = req.params.accountId;

    try {
        await Subscriptions.destroy({where: {accountId: accountId}})
        res.status(200).json({message: "Подписка успешно удалена"})
    }
    catch(err){
        
    err.ip = req.ip;
    logger.error(err);
        console.log(err)
        res.status(500).json({message: "Ошибка при удалении подписки"})
    }
});


router.get("/:accountId/check-subscription",  async (req, res) => {
    const accountId = req.params.accountId;

    try {
        const subscription = await Subscriptions.findOne({where: {accountId: accountId}})
        res.status(200).json({
            message: "Подписка успешно найдена",
            subscription: subscription
        })
    }
    catch(err){
        
    err.ip = req.ip;
    logger.error(err);
        console.log(err)
        res.status(500).json({message: "Ошибка при поиске подписки"})
    }
});

module.exports = router;



