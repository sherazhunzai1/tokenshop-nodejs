const db = require("../config/database");

module.exports = class Creators {
  constructor() {}

  fetchAll(start, end) {
    return db.execute(`SELECT * FROM  creators
    LIMIT ${start}, ${end}
     `);
  }
  fetchAllCount() {
    return db.execute(`SELECT * FROM  creators
     `);
  }
  fetchSingle(wallet) {
    return db.execute(`SELECT * FROM  creators 
    WHERE walletAddress = '${wallet}'
     `);
  }
  checkUserName(username) {
    return db.execute(`SELECT * FROM  creators
    WHERE
    username = '${username}'
     `);
  }
  checkWallet(wallet) {
    return db.execute(`SELECT * FROM  creators
    WHERE
    walletAddress = '${wallet}'
     `);
  }
  checkEmail(email) {
    return db.execute(`SELECT * FROM  creators
    WHERE
    email = '${email}'
     `);
  }

  /**
   * @dev the function will create new record for given `payload`
   * @param {Object} payload is an object. it will contain following properties:
   * - `walletAddress  `,
   * - `firstName`,
   * - `lastName`,
   * - `email`,
   * - `bio`,
   * - `portfolio`,
   * - `twitter`,
   * - `instagram`,
 
 
 
   *
   * @returns it will rertun a Promise <fulfiled | rejected>
   */
  updateInfo({
    walletAddress,
    firstName,
    lastName,
    email,
    bio,
    portfolio,
    twitter,
    instagram,
  }) {
    return db.execute(`UPDATE creators SET firstName = '${firstName}', lastName = '${lastName}' , email = '${email}', bio = '${bio}', portfolio = '${portfolio}', twitter = '${twitter}', instagram = '${instagram}'
WHERE
walletAddress = '${walletAddress}'
`);
  }

  singUp({ walletAddress }) {
    return db.execute(`INSERT INTO creators SET  walletAddress = '${walletAddress}',username='${walletAddress}'
`);
  }
  uploadProfilePic(image, walletAddress) {
    return db.execute(`UPDATE creators SET img = '${image}'
    WHERE
    walletAddress = '${walletAddress}'
`);
  }
  uploadCoverPic(image, walletAddress) {
    return db.execute(`UPDATE creators SET cover = '${image}'
    WHERE
    walletAddress = '${walletAddress}'
`);
  }
};
