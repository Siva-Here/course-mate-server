// const jwt = require('jsonwebtoken');
// const {jwtDecode} = require('jwt-decode');
// const verifyToken = (req, res, next) => {
//   next();
//   const bearerHeader = req.headers['authorization'];
//   console.log(bearerHeader);
//   if (typeof bearerHeader !== 'undefined') {  
//     const bearerToken = bearerHeader.split(' ')[1];
//     const decodedToken = jwtDecode(bearerToken);
//     const userEmail = decodedToken.email;
//     if (userEmail.slice()) {
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

const jwt = require('jsonwebtoken');
const {jwtDecode} = require('jwt-decode');
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  console.log(bearerHeader);
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    try {
      const decodedToken = jwtDecode(bearerToken);
      const userEmail = decodedToken.email;
      
      // Check if userEmail ends with '@rguktn.ac.in'
      if (userEmail.slice(-13) === '@rguktn.ac.in') {
        req.userEmail = userEmail;
        next();
      } else {
        res.status(401).json({ error: 'Unauthorized: Email domain not allowed' });
      }
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  } else {
    res.sendStatus(401);
  }
};

module.exports = verifyToken;
