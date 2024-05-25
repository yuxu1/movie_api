
# Movie API Documentation

## Description
This REST API is the server-side component for the "myFlix" application. It interacts with a database, providing users with access to information about different movies, directors, and genres. Users will be able to sing up, update their personal information, and create a list of their favorite movies.

## Technologies
* **Node.js**: JavaScript runtime for server-side scripting
* **Express**: Back end web application framework for building RESTful APIs with Node.js
* **MongoDB**: NoSQL database program for building the database
* **Mongoose**: Object-oriented programming library for modeling the business logic
* **body-parser**: Express middleware for parsing request bodies
* **express-validator**: Middleware for input validation in Express
* **passport**: Authentication middleware for Node.js
* **passport-jwt**: Passport strategy for JWT authentication
* **passport-local**: Passport strategy for username/password authentication
* **uuid**: Library for generating unique identifiers
* **Postman**: API platform for testing API endpoints
* **Heroku**: Cloud platform as a service (PaaS) for hosting the API

## Endpoints
### Get a list of all movies
* **URL**: `/movies`
* **HTTP Method**: GET
* **Request Body Data Format**: None
* **Response Body Data Format**: A JSON object holding data about all the movies

### Get single movie by title
* **URL**: `/movies/[Movie Title]`
* **HTTP Method**: GET
* **Request Body Data Format**: None
* **Response Body Data Format**: A JSON object holding data about a single movie, containing title, description, genre, and director

### Get genre by name
* **URL**: `/movies/genres/[Genre Name]`
* **HTTP Method**: GET
* **Request Body Data Format**: None
* **Response Body Data Format**: A JSON object holding data about the specified genre

### Get director by name
* **URL**: `/movies/directors/[Director Name]`
* **HTTP Method**: GET
* **Request Body Data Format**: None
* **Response Body Data Format**: A JSON object containing data about the requested director

### Register a user
* **URL**: `/users`
* **HTTP Method**: POST
* **Request Body Data Format**: A JSON object holding data about the user being added
* **Response Body Data Format**: A JSON object holding data about the newly added user with an assigned ID

### Update user information by username
* **URL**: `/users/[User Name]`
* **HTTP Method**: PUT
* **Request Body Data Format**: A JSON object containing the new user information that needs to be updated in the database (information not being updated do not need to be included)
* **Response Body Data Format**: A JSON object containing the user's data with the updated information

### Add a movie to a user's list of favorites
* **URL**: `/users/[User Name]/movies/[Movie ID]`
* **HTTP Method**: POST
* **Request Body Data Format**: None
* **Response Body Data Format**: A JSON object containing the user's data with the updated information

### Remove a movie from a user's list of favorites
* **URL**: `/users/[User Name]/movies/[Movie ID]`
* **HTTP Method**: DELETE
* **Request Body Data Format**: None
* **Response Body Data Format**: A JSON object containing the user's data with the updated information

### Unregister (remove) a user
* **URL**: `/users/[User Name]`
* **HTTP Method**: DELETE
* **Request Body Data Format**: None
* **Response Body Data Format**: A text message indicating whether the user was successfully removed

## Hosted API
https://my-flix-project-b74d36752ec6.herokuapp.com/
