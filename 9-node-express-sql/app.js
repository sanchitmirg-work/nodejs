const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();
const sequelize = require('./util/database');

const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then((user) => {
        req.user = user
        next();
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

Cart.belongsTo(User);
User.hasOne(Cart);

Product.belongsToMany(Cart, {through: CartItem});
Cart.belongsToMany(Product, {through: CartItem});

sequelize
    // .sync({force: true})
    .sync()
    .then(() => {
        return User.findByPk(1)
    })
    .then((user) => {
        if(!user) {
            return User.create({name: 'Sanchit Mirg', email: 'sanchitmirg0@gmail.com'})
        }
        return user
    })
    .then((user) => {
        return user.createCart();
    })
    .then(() => {
        app.listen(3000);
    })


