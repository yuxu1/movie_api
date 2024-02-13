//import packages
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    ImageURL:{type: String},
    Featured:{type: Boolean}
});

//define schema for users collection
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

//hashes user-submitted passwords
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

//compares submitted hashed passwords with hashed passwords stored in database
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

//create models that uses the above defined schemas
//Movie --> db.movies collection
//User --> db.users collection
let Movie = mongoose.model('Movie',movieSchema);
let User = mongoose.model('User',userSchema);

//export models to be used
module.exports.Movie = Movie;
module.exports.User = User;