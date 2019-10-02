const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken (req,res,next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            mensagem: 'Não autorizado, token não provisto'
        });
    }
    
    const decoded = jwt.verify(token, config.secret);
    req.userId = decoded.id;
    next();
}

module.exports = verifyToken;