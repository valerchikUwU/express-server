// uploadModule.js

const multer = require("multer");
const path = require("path");
const dateFns = require("date-fns");

try {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Здесь можно определить логику выбора директории для сохранения файлов
      const directory = "../uploads/";
      cb(null, directory);
    },
    filename: function (req, file, cb) {
      // Генерация имени файла
      const extname = path.extname(file.originalname).toLowerCase();
      const originalName = path.basename(file.originalname, path.extname(file.originalname));
      const uniqueSuffix = dateFns.format(Date.now(),  "dd.MM.yyyy") + "-" + Math.round(Math.random() * 1e9);
      const newFilename = `${originalName}-${uniqueSuffix}${extname}`;
      cb(null, newFilename);
    },
  });

  function checkFileType(file, cb) {
    // Allowed extenstions
    const allowedExtensions = [".jpeg", ".jpg", ".png"];
    // Check ext
    const extname = path.extname(file.originalname).toLowerCase();
    // Проверяем, есть ли расширение среди допустимых
    const isValidExtension = allowedExtensions.includes(extname);
    // Check mime
    if (isValidExtension) {
      return cb(null, true);
    } else {
      cb(new Error("Images only."));
    }
  }
  module.exports = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5 MB
    },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  });
} catch (err) {
  console.log(err);
}
// Определение storage для multer
