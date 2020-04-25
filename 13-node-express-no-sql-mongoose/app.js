const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5e9abacbdef7c946c03824e0')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://sanchit:root@cluster0-ux1kh.mongodb.net/shop?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => {
  User.findOne().then((user) => {
    if(!user) {
      const user = new User({
        name: 'Sanchit',
        email: 'sanchitmirg0@gmail.com',
        cart: {
          items: []
        }
      })
      user.save();
    }
  })
  app.listen(3000);
}).catch((error) => {
  console.log(error);
})
