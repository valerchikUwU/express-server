const express = require("express");
const Account = require("../../models/account");
const router = express.Router();

router.post("/:accountId/save-subscription", async (req, res) => {
    const accountId = req.params.accountId;

    try {
        await Account.update({isSignedUpPush: true}, {where: {id: accountId}})
        res.status(200).send("Подписка успешно сохранена")
    }
    catch(err){
        console.log(err)
        res.status(500).send("Ошибка при сохранении подписки")
    }
});


router.post("/:accountId/delete-subscription", async (req, res) => {
    const accountId = req.params.accountId;

    try {
        await Account.update({isSignedUpPush: false}, {where: {id: accountId}})
        res.status(200).send("Подписка успешно удалена")
    }
    catch(err){
        console.log(err)
        res.status(500).send("Ошибка при удалении подписки")
    }
});

module.exports = router;
