const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.redirect("/login");

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey')); //if is valid get a decoded payload. Other wise will get a exception.
        req.user = decoded;
        next()
        // console.log('test: ' + req.user._id);
    }
    catch (ex) {
        res.status(400).send('Invalid token');
    }

    // const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    // if (!decoded) return res.status(400).send('invalid token');
    // req.user = decoded;
    // next();
}

module.exports = auth;
