const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
function generateToken(payload) {
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    return token;
}

function verifyToken(token) {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    return decoded;
}

function getPayloadId(token) {
    const decoded = jwt.decode(token, {complete: true});
    return decoded.payload.id;
}

module.exports = {
    generateToken, 
    verifyToken,
    getPayloadId
};