//import express & morgan
const express = require('express');
const morgan = require('morgan');

//encapsulate express functionality in 'app'
const app=express();
//invoke Morgan to log requests in Morgan's 'common' format
app.use(morgan('common'));

//data about top 10 movies
let topMovies = [
    {
        title:'Journey to the West',
        mainCast:['Dicky Cheung','Kwong Wa','Wayne Lai','Evergreen Mak'],
        year:'1996'
    },
    {
        title:'Virtues of Harmony',
        mainCast:['Nancy Sit','Louis Yuen','Frankie Lam','Michael Tse','Joyce Chen','Bondy Chiu','Cutie Mui','Yvonne Lam','Bernice Liu'],
        year:'2001'
    },
    {
        title:'Moonlight Resonance',
        mainCast:['Raymond Lam','Ha Yu','Susanna Kwan','Chow Chung','Linda Chung','Moses Chan','Michelle Yim','Louise Lee','Tavia Yeung'],
        year:'2008'
    },
    {
        title:'Lady Fan',
        mainCast:['Jessica Hsuan','Joe Ma'],
        year:'2004'
    },
    {
        title:'The Four',
        mainCast:['Raymond Lam','Kenneth Ma','Sammul Chan','Ron Ng'],
        year:'2008'
    },
    {
        title:'Twin of Brothers',
        mainCast:['Raymond Lam','Rong Ng','Leila Tong','Li Qian','Nancy Wu','Tavia Yeung'],
        year:'2004'
    },
    {
        title:'Eternal Happiness',
        mainCast:['Michelle Ye','Raymond Lam','Joe Ma'],
        year:'2002'
    },
    {
        title:'Yummy Yummy',
        mainCast:['Raymond Lam','Charmaine Sheh','Kevin Cheng','Tavia Yeung','Ben Yeo'],
        year:'2005'
    },
    {
        title:'Whatever It Takes',
        mainCast:['Benny Chan','Annie Man','Tavia Yeung'],
        year:'2003'
    },
    {
        title:'The Seventh Day',
        mainCast:['Kevin Cheng','Bosco Wong','Niki Chow','Natalie Tong'],
        year:'2008'
    }
];

//return JSON object of topMovies data
app.get('/movies/',(req,res)=> {
    res.json(topMovies);
});

app.get('/',(req,res)=>{
    res.send('Welcome and explore some movies!');
});

//route all requests for static files to corresponding files in 'public'
app.use (express.static('public'));

app.listen(8080,()=> {
    console.log('Your app is listening on port 8080.');
});

//error-handling; log errors to terminal
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
});