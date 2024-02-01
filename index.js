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
mongoose.connect('mongodb://localhost:27017/moviesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//encapsulate express functionality in 'app'
const app = express();

//invoke Morgan to log requests in Morgan's 'common' format
app.use(morgan('common'));
//invoke body-parser to read body of requests
app.use(bodyParser.json());

/*in-memory database
let movies = [
  {
    Title: 'The Shawshank Redemption',
    Description:
      "Chronicles the experiences of a formerly successful banker as a prisoner in the gloomy jailhouse of Shawshank after being found guilty of a crime he did not commit. The film portrays the man's unique way of dealing with his new, torturous life; along the way he befriends a number of fellow prisoners, most notably a wise long-term inmate named Red.",
    Genre: {
      Name: 'Drama',
      Description:
        'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
    },
    Director: {
      Name: 'Frank Darabont',
      Birth: '1959',
    },
  },
  {
    Title: 'Saltburn',
    Description:
      'Struggling to find his place at Oxford University, student Oliver Quick finds himself drawn into the world of the charming and aristocratic Felix Catton, who invites him to Saltburn, his eccentric family\'s sprawling estate, for a summer never to be forgotten.',
    Genre: [
      {
        Name: 'Drama',
        Description:
          'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
      },
      {
        Name: 'Comedy',
        Description:
          'A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh.',
      },
      {
        Name: 'Thriller',
        Description:
          'Thriller is a genre of fiction with numerous, often overlapping, subgenres, including crime, horror, and detective fiction. Thrillers are characterized and defined by the moods they elicit, giving their audiences heightened feelings of suspense, excitement, surprise, anticipation and anxiety.',
      },
    ],
    Director: {
      Name: 'Emerald Fennell',
      Birth: '1985',
    },
  },
  {
    Title: 'Poor Things',
    Description:
      'From filmmaker Yorgos Lanthimos and producer Emma Stone comes the incredible tale and fantastical evolution of Bella Baxter (Stone), a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter (Willem Dafoe). Under Baxter\'s protection, Bella is eager to learn. Hungry for the worldliness she is lacking, Bella runs off with Duncan Wedderburn (Mark Ruffalo), a slick and debauched lawyer, on a whirlwind adventure across the continents. Free from the prejudices of her times, Bella grows steadfast in her purpose to stand for equality and liberation.',
    Genre: [
      {
        Name: 'Drama',
        Description:
          'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.',
      },
      {
        Name: 'Comedy',
        Description:
          'A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh.',
      },
      {
        Name: 'Romance',
        Description:
          'Romance films involve romantic love stories recorded in visual media for broadcast in theatres or on television that focus on passion, emotion, and the affectionate romantic involvement of the main characters. ',
      },
    ],
    Director: {
      Name: 'Yorgos Lanthimos',
      Birth: '1973',
    },
  },
  {
    Title: 'Elemental',
    Description:
      'The film journeys alongside an unlikely pair, Ember and Wade, in a city where fire-, water-, land- and air-residents live together. The fiery young woman and the go-with-the-flow guy are about to discover something elemental: how much they actually have in common.',
    Genre: [
      {
        Name: 'Animation',
        Description:
          'Animation is a filmmaking technique by which still images are manipulated to create moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film. ',
      },
      {
        Name: 'Adventure',
        Description:
          'Adventure fiction is a type of fiction that usually presents danger, or gives the reader a sense of excitement. ',
      },
      {
        Name: 'Comedy',
        Description:
          'A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh.',
      },
    ],
    Director: {
      Name: 'Peter Sohn',
      Birth: '1977',
    },
  },
  {
    Title: 'Soul',
    Description:
      'Joe is a middle-school band teacher whose life hasn\'t quite gone the way he expected. His true passion is jazz and he\'s good. But when he travels to another realm to help someone find their passion, he soon discovers what it means to have soul.',
    Genre: [
      {
        Name: 'Animation',
        Description:
          'Animation is a filmmaking technique by which still images are manipulated to create moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film. ',
      },
      {
        Name: 'Adventure',
        Description:
          'Adventure fiction is a type of fiction that usually presents danger, or gives the reader a sense of excitement. ',
      },
      {
        Name: 'Comedy',
        Description:
          'A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh.',
      },
    ],
    Director: [
      {
        Name: 'Pete Docter',
        Birth: '1968',
      },
      {
        Name: 'Kemp Powers',
        Birth: '1973',
      },
    ],
  },
];

//array of users
let users = [
  {
    ID:'1',
    Name: 'Jeffrey',
    Favorites: ['Elemental']
  },
  {
    ID:'2',
    Name: 'Miles',
    Favorites: []
  },
  {
    ID:'3',
    Name:'Vincent',
    Favorites:['Saltburn']
  }
];*/

//[READ] GET list of all movies - return JSON object of movies list
app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Error: ' + err);
    });
});

//[READ] GET data about single movie by title
app.get('/movies/:Title', async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('No such movie found');
    });
});

//[READ] GET data of genre by name
app.get('/movies/genres/:genreName', async (req, res) => {
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
});

//[READ] GET data about a director by name
app.get('/movies/directors/:directorName', async (req, res) => {
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
});

//[CREATE] Allow user to register (POST user to users array)
/* We'll expect JSON in this format
{
  ID: String (auto assigned),
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      //check if returned user by Username already exists
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        //create user in database w/ req.body values if user doesn't exist yet
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
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
});

//[UPDATE]Allow user to update user info, by username
/* We'll expect JSON in this format
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
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
});

//[CREATE] Allow user to add a movie to their favorites list
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      //add movie found (via MovieID) to favorites if not already added (no duplicates)
      $addToSet: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.status(200).send(`Successfully added to user ${updatedUser.Username}\'s favorites`);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//[DELETE] Allow users to remove a movie from their favorites list
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.status(200).send(`Successfully removed from user ${updatedUser.Username}'s favorites`);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//[DELETE] Allow a user to deregister (remove from users array)
//locate user by username
app.delete('/users/:Username', async (req, res) => {
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
});

app.get('/', (req, res) => {
  res.send('Welcome and explore some movies!');
});

//route all requests for static files to corresponding files in 'public'
app.use(express.static('public'));

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

//error-handling; log errors to terminal
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
