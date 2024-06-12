const express = require("express");
const Account = require("../../models/account");
const router = express.Router();

router.post("/save-subscription", async (req, res) => {
    const accountId = req.body.accountId;

    try {
        await Account.update({isSignedUpPush: true}, {where: {id: accountId}})
    }
    catch(err){
        console.log(err)
        res.status(500).send("Ошибка при сохранении подписки")
    }
});


router.post("/delete-subscription", async (req, res) => {
    const accountId = req.body.accountId;

    try {
        await Account.update({isSignedUpPush: false}, {where: {id: accountId}})
    }
    catch(err){
        console.log(err)
        res.status(500).send("Ошибка при удалении подписки")
    }
});
