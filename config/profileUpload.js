const util = require("util");
const multer = require("multer");
const path = require("node:path");
const baseUrl = require("./baseUrl");
const maxSize = 1024 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, baseUrl + "/public/assets/profilePic/");
  },
  filename: (req, file, cb) => {
    // console.log(file.originalname);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file");
function checkFileType(file, next) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return next(null, true);
  } else {
    return next({ code: 400, message: "Please upload a file!" });
  }
}

// var uploadFiles = multer({ storage: storage }).array("multi-files", 10);
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
