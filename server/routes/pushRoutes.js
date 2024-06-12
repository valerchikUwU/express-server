const express = require("express");
const Account = require("../../models/account");
const Subscriptions = require("../../models/subscriptions");
const checkAbilities = require('../../utils/checkAbility');
const router = express.Router();

router.post("/:accountId/save-subscription", checkAbilities('create', 'WebPush') , async (req, res) => {
    const accountId = req.params.accountId;
    try {
        const subscription = new Subscriptions({
            endPoint: req.body.endpoint,
            expirationTime: req.body.expirationTime,
            keys: req.body.keys,
            accountId: accountId
        })
        await subscription.save();
        res.status(200).json({message: "Подписка успешно сохранена"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: "Ошибка при сохранении подписки"})
    }
});


router.post("/:accountId/delete-subscription", checkAbilities('delete', 'WebPush'), async (req, res) => {
    const accountId = req.params.accountId;

    try {
        await Subscriptions.destroy({where: {accountId: accountId}})
        res.status(200).json({message: "Подписка успешно удалена"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: "Ошибка при удалении подписки"})
    }
});

module.exports = router;
