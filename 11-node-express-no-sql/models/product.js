const getDb = require('../util/database').getDb;
const mongoDb = require('mongodb');

class Product  {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongoDb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbo;

    if(this._id) {
      dbo = db.collection('products').updateOne({_id: this._id}, {$set: this});
    } else {
      dbo = db.collection('products').insertOne(this)
    }
    return dbo.then((result) => {
      console.log(result);
    });
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products')
    .find()
    .toArray()
    .then((products) => {
      return products
    })
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('products').find({_id: new mongoDb.ObjectId(prodId)}).next().then((product) => {
      return product;
    }).catch();
  }

  static deleteById(prodId) {
    const db = getDb();
    return db.collection('products').deleteOne({_id: new mongoDb.ObjectId(prodId)})
    .then((result) => result);
  }
}

module.exports = Product;
