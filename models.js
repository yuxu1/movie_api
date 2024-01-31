//import mongoose package
const mongoose = require('mongoose');

//define schema for movies collection
let movieSchema = mongoose.Schema({
    Title: {type:String, required:true},
    Description: {type:String, required:true},
    Director:{
        Name:String,
        Bio:String,
        Birthyear:String,
        Deathyear:String
    },
    Genre: {
        Name:String,
        Description:String
    },
    ImageURL:String,
    Featured:Boolean
});

//define schema for users collection
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

//create models that uses the above defined schemas
//Movie --> db.movies collection
//User --> db.users collection
let Movie = mongoose.model('Movie',movieSchema);
let User = mongoose.model('User',userSchema);

//export models to be used
module.exports.Movie = Movie;
module.exports.User = User;