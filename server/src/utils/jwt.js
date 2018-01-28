const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = {
  create: userId => {
    console.log(userId);
    const token = jwt.sign({ userId }, 'secret');
    console.log(token);
    return token;
  },
  read: tokenValue => {
    if (tokenValue) {
      try {
        return jwt.verify(tokenValue, 'secret');
      } catch (err) {
        console.log(err);
        return null;
      }
    }
    return null;
  },
};
