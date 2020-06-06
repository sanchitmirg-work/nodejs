const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

//==================Session=========================================
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

//-------------------CSRF setting------------------------------------
const csrf = require('csurf');
const flash = require('connect-flash');



const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://sanchit:root@cluster0-ux1kh.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();

//=========================Setting to store session in DB==============
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//----------------------Using Session----------------
app.use(
  session({
    secret: 'my secret',  //Setting secret key
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

//----------------applying Middle csrfProtection-----------
//----------------It will provide csrfToken() function------------
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

//----------------Setting locals, it will be available in all views------
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
