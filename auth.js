//same key used in JWTStrategy (/passport.js)
const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
  passport = require('passport');

//require the local passport file
require('./passport');

//function to create a JWT based on the username and password
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    //the username you're encoding in the JWT
    subject: user.Username,
    //specifies token will expire in 7 days
    expiresIn: '7d',
    //algorithm used to "sign"/encode values of the JWT
    algorithm: 'HS256',
  });
};

//POST login
module.exports = (router) => {
  router.post('/login', (req, res) => {
    //use LocalStrategy to check if the username/password in req body exists in database
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        //if username/password matches one in database, generate a JWT token
        let token = generateJWTToken(user.toJSON());
        //return the token to the client
        return res.json({ user, token });
      });
    })(req, res);
  });
};
