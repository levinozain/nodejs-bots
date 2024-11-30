const { MongoClient } = require('mongodb')
const { MONGO_URL } = require('../../config.json')

//File untuk koneksi ke database MONGODB

const MONGOURL = MONGO_URL

clientdb = new MongoClient(MONGOURL)
clientdb.connect()
const db = clientdb.db('Data')
const coll = db.collection('Data')

exports.coll = coll