const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

function tokenVerify(token) {
    return jwt.verify(token, config.jwtSecret);
}

module.exports = { tokenVerify };