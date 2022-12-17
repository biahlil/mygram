const { User } = require('../models');
const { verifyToken } = require('../helpers/jwt');

function auth(req, res, next) {
    try {
        const token = req.get('token');
        const userDecoded = verifyToken(token);

        User.findOne({
            where: {
                id: userDecoded.id,
                email: userDecoded.email
            }
        })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    name: 'Authentication Error',
                    devMessage: 'User with id ' + userDecoded.id + ' does not exist in database.'
                })
            }
            res.locals.user = user;
            return next()
        })
        .catch (err => {
            res.status(500).json(error);
        })
    }
    catch (err) {
        return res.status(401).json(err);
    }
}

module.exports = auth;