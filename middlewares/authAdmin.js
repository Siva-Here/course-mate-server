const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const adminEmails = ['n200232@rguktn.ac.in', 'n200086@rguktn.ac.in']; 

const verifyToken = (req, res, next) => {
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
