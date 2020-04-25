const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

//=====================================Initially when no routes were used ========================

// router.use('/add-product', (req, res, next) => {
//   res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
// });

// router.post('/product', (req, res, next) => {
//   console.log(req.body);
//   res.redirect('/');
// });

//====================================================================================================

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).send('<h1>Page not found</h1>');
})

// app.use('/', (req, res, next) => {
//   res.send('<h1>Hello from Express!</h1>');
// });

app.listen(3000);


//---------------------Instead of creating server like this-----------------------
// const server = http.createServer(app);
// server.listen(3000);

//---------------------We can do this---------------------------------------------
// app.listen(3000);