const jwt = require('jsonwebtoken');
const config = require('config');

function checkAdmin (req, res, next) {
 //   401 Unauthorized
 //   403 Forbidden
    
    if (!req.user.isAdmin) return res.status(403).send('No Admin Permition');
    next();
} 


module.exports = checkAdmin;