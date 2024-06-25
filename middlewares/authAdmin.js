const {jwtDecode} = require('jwt-decode');
require('dotenv').config();
const adminEmails = process.env.ADMIN_EMAILS.split(',');

const verifyToken = (req, res, next) => {
  next();
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    const decodedToken = jwtDecode(bearerToken);
    const userEmail = decodedToken.email;
    if (adminEmails.includes(userEmail)) {
        req.userEmail = userEmail;
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized: Email not allowed' });
    }
  } else {
    res.sendStatus(401); 
  }
};

module.exports = verifyToken;
