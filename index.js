//import express,morgan,bodyParser,and uuid
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');

//allow Mongoose to connect to moviesDB database (MongoDB)
mongoose.connect('mongodb://localhost:27017/moviesDB',{useNewUrlParser: true, useUnifiedTopology: true});

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

//[READ] Get list of all movies - return JSON object of movies list
app.get('/movies/', (req, res) => {
  res.status(200).json(movies);
});

//[READ] Get data of single movie by title
app.get('/movies/:title',(req,res)=>{
    const {title} = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if(movie){
        res.status(200).json(movie);
    }else{
        res.status(400).send('No such movie found');
    }
})

//[READ] Get data of genre by name
app.get('/movies/genres/:genreName',(req,res)=>{
    const {genreName} = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if(genre){
        res.status(200).json(genre);
    }else{
        res.status(400).send('No such genre found');
    }
})

//[READ] Get data about a director
app.get('/movies/directors/:directorName',(req,res)=>{
    const {directorName} = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if(director){
        res.status(200).json(director);
    }else{
        res.status(400).send('No such director found');
    }
})

//[CREATE] Allow user to register (add user to users array)
app.post('/users',(req,res)=>{
    const newUser = req.body;

    if(newUser.Name){
        newUser.ID=uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    }else{
        res.status(400).send('Please enter a name for the user');
    }
}) 

//[UPDATE]Allow user to update user info(name)
app.put('/users/:id',(req,res)=>{
    const {id} = req.params;
    const updatedUser = req.body;

    //check if user is valid
    let user = users.find(user => user.ID === id);

    if(user){
        user.Name = updatedUser.Name;
        res.status(200).json(user);
    }else{
        res.status(400).send('User not found');
    }
}) 

//[CREATE] Allow user to add a movie to their favorites list
app.post('/users/:id/:movieTitle',(req,res)=>{
    const {id,movieTitle} = req.params;

    //check the user is valid
    let user = users.find(user => user.ID === id);

    if(user){
        user.Favorites.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s favorites`);
    }else{
        res.status(400).send('User not found');
    }
})

//[DELETE] Allow users to remove a movie from their favorites list
app.delete('/users/:id/:movieTitle',(req,res)=>{
    const {id,movieTitle} = req.params;

    //check the user is valid
    let user = users.find(user => user.ID === id);

    if(user){
        user.Favorites = user.Favorites.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s favorites`);
    }else{
        res.status(400).send('User not found');
    }
})

//[DELETE] Allow a user to deregister (remove from users array)
app.delete('/users/:id',(req,res)=>{
    const {id} = req.params;

    //check the user is valid
    let user = users.find(user => user.ID === id);

    if(user){
       users = users.filter( user => user.ID !== id);
       res.status(200).send(`User ${id} has been deleted`)
    }else{
        res.status(400).send('User not found');
    }
})


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
