const express = require('express');

const path = require('path');

const app = express();

const userRoutes = require('./routes/user');
const landingPageRoutes = require('./routes/landing-page')

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/user', (req, res, next) => {
//     console.log('Inside First Middleware')
//     res.send('<h1>This is Assignment 1</h1>')
// })

// app.use('/', (req, res, next) => {
//     next();
// })

app.use(userRoutes);
app.use(landingPageRoutes);

app.listen(3000);