const mysql = require("mysql2");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "aiedc097_sheraz",
  password: "Sherazali11.",
  database: "aiedc097_nftbay1.0",
});
module.exports = pool.promise();