const multer = require("multer");
const path = require("node:path");
const sanitize = require("sanitize-filename");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const route = path.join(__dirname, "..", "public", "adImages");
    callback(null, route);
  },
  filename: function (req, file, callback) {
    try {
      const sanitizedFilename = sanitize(file.originalname);
      const filename = `${file.fieldname}-${Date.now()}-${sanitizedFilename}`;
      callback(null, filename);
    } catch (error) {
      callback(error);
    }
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
