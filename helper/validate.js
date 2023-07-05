const { body } = require("express-validator");

module.exports.signUp = [
  body("email").isEmail().withMessage("Enter Valid Email Address"),

];

module.exports.checkIds = [
  body("employeeId").isEmpty(),
  body("adminId").isEmpty(),
];
