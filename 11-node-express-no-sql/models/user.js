const getdb = require('../util/database').getDb;
const mongoDb = require('mongodb');

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getdb();
    return db.collection('users').insertOne(this)
    .then((result) => {
      return result;
    })
  }

  addToCart(product) {
    const updatedCart = { items: [{productId: new mongoDb.ObjectId(product._id), quantity: 1}]};
    const db = getdb();
    return db.collection('users').updateOne({_id: new mongoDb.ObjectId(this._id)}, {$set: {cart: updatedCart}})
  }

  static findById(userId) {
    const db = getdb();
    return db.collection('users').find({_id: new mongoDb.ObjectId(userId)}).next().then((user) => {
      return user;
    }).catch();
  }
}

module.exports = User;
