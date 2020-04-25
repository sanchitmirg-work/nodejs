const express = require('express');
const path = require('path');

const router = express.Router();

const adminProducts = require('./admin');

router.get('/', (req, res, next) => {
    // res.send('<h1>Hello from Express!</h1>');
    // console.log("Shop.js", adminProducts.products)
    // res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'))

    const products = adminProducts.products;
    //============As we have already configured the template engine and views with express ==================
    //============in app.js so we don't need to set path=====================================================
    res.render('shop', {prods: products, docTitle: "Shop"})
});

module.exports = router;
