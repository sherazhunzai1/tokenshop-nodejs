const multer = require("multer");
const storage = multer.memoryStorage();

// Configure multer with the storage and other options
module.exports = multer({ storage: storage });