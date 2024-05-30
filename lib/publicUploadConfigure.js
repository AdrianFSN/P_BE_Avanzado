const multer = require("multer");
const path = require("node:path");
const sanitize = require("sanitize-filename");

const checkFileIsImage = (req, file, callback) => {
  try {
    const validExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (validExtensions.includes(fileExtension)) {
      callback(null, true);
    } else {
      callback(new Error("Only .jpg, .jpeg, and .png formats allowed."));
    }
  } catch (error) {
    callback(error);
  }
};

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

const upload = multer({ storage: storage, fileFilter: checkFileIsImage });

module.exports = upload;
