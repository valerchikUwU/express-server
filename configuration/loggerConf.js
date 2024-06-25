// loggingConfig.js
const winston = require("winston");
const morgan = require("morgan");
const chalk = require("chalk");

const { combine, timestamp, json, errors, colorize, align, printf } =
  winston.format;

const errorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === "info" ? info : false;
});

const combinedFileRotateTransport = new winston.transports.DailyRotateFile({
  filename: "../logs/combined-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  maxFiles: "30d",
});

const errorFileRotateTransport = new winston.transports.DailyRotateFile({
  filename: "../logs/app-error-%DATE%.log",
  level: "error",
  datePattern: "DD-MM-YYYY",
  maxFiles: "30d",
  format: combine(errors({ stack: true }), errorFilter(), timestamp(), json()),
});

const infoFileRotateTransport = new winston.transports.DailyRotateFile({
  filename: "../logs/app-info-%DATE%.log",
  level: "info",
  datePattern: "DD-MM-YYYY",
  maxFiles: "30d",
  format: combine(infoFilter(), timestamp(), json()),
});

const logger = winston.createLogger({
  exitOnError: false,
  prettyPrint: true,
  level: "http",
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: "DD-MM-YYYY hh:mm:ss.SSS A",
    }),
    json()
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        align(),
        printf(
          (info) =>
            `[${chalk.blue(info.timestamp)}]  ${info.level}:  ${chalk.yellow(
              info.status ? info.status : (info.level.includes('info') ? 200 : 500)
            )} - ${info.url ? info.url : ""} - ${
              info.method ? info.method : ""
            } - ${info.response_time ? info.response_time : ""} - ${
              info.ip ? chalk.red(info.ip) : ""
            } - ${info.message} ---------------- \n ${
              info.stack ? info.stack : "no stack trace"
            } \n`
        )
      ),
    }),
    combinedFileRotateTransport,
    errorFileRotateTransport,
    infoFileRotateTransport,
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "../logs/exception.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "../logs/rejections.log" }),
  ],
});

const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      ip: req.ip,
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, "content-length"),
      response_time: Number.parseFloat(tokens["response-time"](req, res)),
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        logger.http(`incoming-request`, data);
      },
    },
  }
);

module.exports = { logger, morganMiddleware };
