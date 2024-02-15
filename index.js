//import express,morgan,bodyParser,and uuid
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');

//import models from models.js
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

//allow Mongoose to connect to moviesDB database (MongoDB)
/*mongoose.connect('mongodb://localhost:27017/moviesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/

//allow Mongoose to connect to online database
//access environment variable for connection URI to hide password and database name
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//encapsulate express functionality in 'app'
const app = express();

//invoke Morgan to log requests in Morgan's 'common' format
app.use(morgan('common'));
//invoke body-parser to read body of requests
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

//import auth.js file, ensuring Express is available in auth.js file
let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

//express validator library
const { check, validationResult } = require('express-validator');

//[READ] GET list of all movies - return JSON object of movies list
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send('Error: ' + err);
      });
  }
);

//[READ] GET data about single movie by title
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.status(200).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send('No such movie found');
      });
  }
);

//[READ] GET data of genre by name
app.get(
  '/movies/genres/:genreName',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    //finds first movie with 'Genre.Name' of :genreName
    await Movies.findOne({ 'Genre.Name': req.params.genreName })
      //returns the Genre portion only, not the full movie data
      .then((movie) => {
        res.status(200).json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send('No such genre found');
      });
  }
);

//[READ] GET data about a director by name
app.get(
  '/movies/directors/:directorName',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    //find first movie with 'Director.Name' that matches :directorName
    await Movies.findOne({ 'Director.Name': req.params.directorName })
      //return only the data under Director portion, not whole movie
      .then((movie) => {
        res.status(200).json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send('No such director found');
      });
  }
);

//endpoint to retrieve all users
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//endpoint to retrieve a single user by username
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    //find the first user whose "Username" matches the one in the :Username req parameters
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/*[CREATE] Allow user to register (POST user to users array)
no authentication - allow anyone to register
We'll expect JSON in this format
{
  ID: String (auto assigned),
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
app.post(
  '/users',
  //validation logic for request, checking for valid Username, password, email
  [
    check(
      'Username',
      'Username is required and should be at least 5 characters'
    ).isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    //check the validation object for errors & puts errors occurred into variable "errors"
    let errors = validationResult(req);
    //if an error occurs (store in variable),stop the rest of the code from executing and notify client of error(s)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //hash the password inputted by user in req body
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        //check if returned user by Username already exists
        if (user) {
          //if user is found, send response that user already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          //create user in database w/ req.body values if user doesn't exist yet
          Users.create({
            Username: req.body.Username,
            //stores hashed version of password in database
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            //return the newly created user or error message if unsuccessful
            .then((newUser) => {
              res.status(201).json(newUser);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      //error-handling function for POST command
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

//[UPDATE]Allow user to update user info, by username
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  //validation logic for request, checking for valid Username, password, email
  [
    check(
      'Username',
      'Username is required and should be at least 5 characters'
    ).isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
   // check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    //condition to check if user is requesting access to their own user data
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }

    //check the validation object for errors & puts errors occurred into variable "errors"
    let errors = validationResult(req);
    //if an error occurs (store in variable),stop the rest of the code from executing and notify client of error(s)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //retrieve current user data of authenticated user
    let currentData = Users.findOne({Username: req.params.Username});

    //convert newly inputted password (if exists) into hashed version, or take current hashedpassword in database
    let hashedPassword = req.body.Password ? Users.hashPassword(req.body.Password) : currentData.Password;
    
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        //update user database with new data if exists; else keep current data
        $set: {
          Username: req.body.Username || currentData.Username,
          Password: hashedPassword,
          Email: req.body.Email || currentData.Email,
          Birthday: req.body.Birthday || currentData.Birthday,
        },
      },
      //ensures the updated user document is returned
      { new: true }
    )
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//[CREATE] Allow user to add a movie to their favorites list
app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    //condition to check if user is requesting access to their own user data
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }

    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        //add movie found (via MovieID) to favorites if not already added (no duplicates)
        $addToSet: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res
          .status(200)
          .json(updatedUser);
          /*.send(
            `Successfully added to user ${updatedUser.Username}\'s favorites`
          );*/
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//[DELETE] Allow users to remove a movie from their favorites list
app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    //condition to check if user is requesting access to their own user data
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }

    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res
          .status(200)
          .json(updatedUser);
         /* .send(
            `Successfully removed from user ${updatedUser.Username}'s favorites`
          );*/
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//[DELETE] Allow a user to deregister (remove from users array)
//locate user by username
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    //condition to check if user is requesting access to their own user data
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }

    await Users.findOneAndDelete({ Username: req.params.Username })
      //check if user exists
      .then((user) => {
        if (!user) {
          res.status(400).send('User was not found.');
        } else {
          res.status(200).send(req.params.Username + ' has been deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

app.get('/', (req, res) => {
  res.send('Welcome and explore some movies!');
});

//route all requests for static files to corresponding files in 'public'
app.use(express.static('public'));

/*look for pre-configured port number in the environment variable,
if nothing found, set port to 8080*/
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port' + port);
});

//error-handling; log errors to terminal
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
