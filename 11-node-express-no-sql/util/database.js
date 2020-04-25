const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (cb) => {
  mongoClient.connect('mongodb+srv://sanchit:root@cluster0-ux1kh.mongodb.net/shop?retryWrites=true&w=majority')
  .then((client) => {
    _db = client.db();
    cb()
  })
};

const getDb = () => {
  if(_db) {
    return _db
  }
  throw "No Database found";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
