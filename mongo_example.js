const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.log(`Failed to connect with ${MONGODB_URI}`);
    throw err;
  }

  console.log(`Connecting with mongodb: ${MONGODB_URI}`);

  function getTweets(cb) {
    db.collection("tweets").find().toArray((err, tweets) => {
      console.log(tweets);
    });
    db.close();
  }
  getTweets();
});