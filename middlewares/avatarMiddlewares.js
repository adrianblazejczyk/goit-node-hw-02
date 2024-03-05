const path = require("path");
const multer = require("multer");

const UPLOAD_DIR = path.join(__dirname, "../", "tmp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}.jpg`);
  },
});
const upload = multer({ storage: storage }).single("avatar");
module.exports = upload;
