// const {jwtDecode} = require('jwt-decode');
// require('dotenv').config();
// const adminEmails = process.env.ADMIN_EMAILS.split(',');

// const verifyToken = (req, res, next) => {
//   next();
//   const bearerHeader = req.headers['authorization'];

//   if (typeof bearerHeader !== 'undefined') {
//     const bearerToken = bearerHeader.split(' ')[1];
//     const decodedToken = jwtDecode(bearerToken);
//     const userEmail = decodedToken.email;
//     if (adminEmails.includes(userEmail)) {
//         req.userEmail = userEmail;
//         next();
//     } else {
//         res.status(401).json({ error: 'Unauthorized: Email not allowed' });
//     }
//   } else {
//     res.sendStatus(401); 
//   }
// };

// module.exports = verifyToken;

const jwtDecode = require('jwt-decode');
require('dotenv').config();
const adminEmails = process.env.ADMIN_EMAILS.split(',');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwtDecode(bearerToken);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const userEmail = decodedToken.email;
    if (adminEmails.includes(userEmail)) {
      req.userEmail = userEmail;
      next();
    } else {
      return res.status(401).json({ error: 'Unauthorized: Email not allowed' });
    }
  } else {
    return res.sendStatus(401); // Unauthorized
  }
};

module.exports = verifyToken;
