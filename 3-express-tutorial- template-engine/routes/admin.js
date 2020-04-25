const express = require('express');

const path = require('path');

const router = express.Router();

const rootDir = require('../utils/path')

const products = [];

// admin/add-product
router.get('/add-product', (req, res, next) => {
    // res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'))
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    // res.render('add-product')
    res.render('add-product-extends-main-layout')
});
  
//admin/product
router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    products.push({title: req.body.title})
    res.redirect('/');
});

// module.exports = router;
exports.routes = router;
exports.products = products;


