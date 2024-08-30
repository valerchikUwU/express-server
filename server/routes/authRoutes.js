const { startBot } = require('../../utils/tgBotLogic');
const express = require('express');
const router = express.Router();
const sequelize = require('../../database/connection');
const WebSocket = require('ws');
const url = require('url');
const Account = require('../../models/account');
const crypto = require('crypto');
const { message } = require('telegraf/filters');
const { logger } = require("../../configuration/loggerConf");
const chalk = require("chalk");

const wss = new WebSocket.Server({ port: 3002 });
const connections = {};

wss.on('connection', (ws, req) => {
  console.log(url.parse(req.url, true).query);
  const obj = url.parse(req.url, true).query
  const sessionId = obj.sessionId;
  console.log(`WSSSSSS: ${sessionId}`) // Получаем sessionId из сессии
  connections[sessionId] = ws; // Сохраняем WebSocket соединение
});





router.post('/auth', async (req, res) => {
  const phoneNumber = req.body.phone;
  const id = req.body.id;
  const token = req.body.token;
  const sessionId = req.body.sessionId;

  try {
    const foundNumber = await getTelephoneNumber(phoneNumber);
    const generatedToken = await getGeneratedToken(sessionId);
    console.log(`/auth: ${token}`);
    console.log(`/auth: ${generatedToken}`);
    if (generatedToken === token) {
      if (foundNumber) {
        await Account.update({ lastSeen: new Date(), telegramId: id }, { where: { telephoneNumber: foundNumber } });
        const account = await Account.findOne({ where: { telephoneNumber: foundNumber } });
        const accountId = account.id;
        const accountRoleId = account.roleId;
        // Передаем accountId через URL
        await sendMessageToClient(sessionId, accountId, accountRoleId);
        await setSessionAccountId(sessionId, accountId, accountRoleId);
        logger.info(
          `${chalk.yellow("Вы успешно аутентифицированы!")} - ${chalk.red(req.ip)} - ACCOUNT PROPS: ${JSON.stringify(account)}`
        );
        res.status(200).json({ message: 'Вы успешно аутентифицированы' });
      } else {
        res.status(404).json({ message: 'Номер телефона не найден' });
      }
    } else {
      await sendMessageToClient(sessionId, 'false')
      console.log('Ошибка аутентификации!');
      res.status(401).json({ message: 'Ошибка аутентификации!' });
    }
  } catch (err) {
    // Обработка ошибок, возникающих при обращении к базе данных
    console.error('Ошибка при запросе к БД:', err);

    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: 'Что - то пошло не так!' });
  }
});



router.get('/homepage', async (req, res) => {
  const token = crypto.randomBytes(10).toString('hex')
  req.session.generatedToken = token;
  if (req.session.isLogged === undefined) {
    req.session.isLogged = false;
  }
  console.log(`/homepage: ${req.session.generatedToken}`)
  console.log(`/homepage: ${req.sessionID}`)
  res.json({
    token: token,
    sessionId: req.sessionID,
    isLogged: req.session.isLogged,
    accountId: req.session.accountId,
    accountRoleId: req.session.accountRoleId
  });
})



router.post('/:accountId/logout', async (req, res) => {
  try {

    await Account.update({ lastSeen: new Date() }, { where: { id: req.params.accountId } });
    req.session.destroy();
    res.status(200).json({ message: 'Вы успешно вышли из аккаунта!' })
  }
  catch (err) {

    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: 'Что - то пошло не так!' });
  }
})





// Запуск бота
if (process.env.NODE_ENV === 'production') {

  startBot();
}



async function getTelephoneNumber(telephoneNumber) {
  try {
    const account = await Account.findOne({
      where: {
        telephoneNumber: telephoneNumber
      }
    });
    if (account) {
      return account.telephoneNumber;
    } else {
      return null;
    }
  } catch (err) {
    
    err.ip = req.ip;
    logger.error(err);
    console.error('Error fetching telephone number:', err);
    return null;
  }
}



async function setSessionAccountId(sessionID, accountId, accountRoleId) {
  try {
    const updatedRows = await sequelize.query(
      `UPDATE sessions SET data = JSON_SET(data, '$.accountId', :accountId, '$.isLogged', true, '$.accountRoleId', :accountRoleId) WHERE session_id = :sessionId`,
      {
        replacements: { sessionId: sessionID, accountId: accountId, accountRoleId: accountRoleId },
        type: sequelize.QueryTypes.UPDATE
      }
    );

    console.log(updatedRows);
    console.log(`setSessionAccountId ${updatedRows[1]}`)
    if (updatedRows[1] > 0) {
      console.log(`Updated ${updatedRows} rows.`);
      return true;
    } else {
      throw new Error('No rows updated');
    }
  } catch (err) {
    
    err.ip = req.ip;
    logger.error(err);
    console.error('Error updating generatedToken:', err);
    throw err; // Перебрасываем ошибку, чтобы она могла быть обработана вызывающей функцией
  }
}

async function getGeneratedToken(sessionID) {
  const sqlQuery = `
      SELECT JSON_EXTRACT(data, '$.generatedToken') AS generatedToken
      FROM sessions
      WHERE session_id = :sessionId
    `;

  try {
    const results = await sequelize.query(sqlQuery, {
      replacements: { sessionId: sessionID },
      type: sequelize.QueryTypes.SELECT
    });

    if (results.length > 0) {
      // Возвращаем значение generatedToken
      return results[0].generatedToken;
    } else {
      throw new Error('Session not found');
    }
  } catch (err) {
    console.error('Error:', err);
    
    err.ip = req.ip;
    logger.error(err);
    throw err; // Перебрасываем ошибку, чтобы она могла быть обработана вызывающей функцией
  }
}


async function sendMessageToClient(sessionId, accountId, accountRoleId) {
  const ws = connections[sessionId];
  if (ws) {
    console.log(`ot servera klienty: ${accountId}, ${accountRoleId}`)
    const jsonMessage = JSON.stringify({ accountId, accountRoleId });
    ws.send(jsonMessage);
  } else {
    
    console.error('WebSocket connection not found for sessionId:', sessionId);
    throw new Error('WebSocket connection not found for sessionId:', sessionId)
  }
}


module.exports = router;
exports.getGeneratedToken = getGeneratedToken;