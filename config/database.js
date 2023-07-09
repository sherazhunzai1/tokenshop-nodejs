const mysql = require("mysql2");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "190.92.150.239",
  user: "legaland_sheraz",
  password: "Sherazali11.",
  database: "legaland_tokenshop",
});
module.exports = pool.promise();
