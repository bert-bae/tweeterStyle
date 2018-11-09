// "use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const session       = require('cookie-session');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  name: 'session',
  keys: ["TEST1", "TEST2"],
}));

// The in-memory database of tweets. It's a basic object with an array in it.
const mongoClient = require('mongodb').MongoClient;
const mongodbURI = "mongodb://localhost:27017/tweeter";

const db = mongoClient.connect(mongodbURI, function (err, db) {
  if (err) {
    console.log("There was an err: ", err);
    return;
  }
  console.log("Connected to tweeter database");
  const DataHelpers = require("./lib/data-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  app.use("/tweets", tweetsRoutes);

// when you login, retrieve the data based on user E-Mail... WORK IN PROGRESS
  app.post("/login", function(req, res) {
    db.collection('users').find({email: req.body.email}).toArray((err, users) => {
      if (err) {
        console.log("There was an error: ", err);
        return;
      }
      if (users.length === 0) {
        console.log("There is no user associated with this E-Mail.");
        return;
      }
      if (users[0].password !== req.body.password) {
        console.log("Password is incorrect!");
        return;
      }
      if (users[0].email === req.body.email && users[0].password === req.body.password) {
        req.session.temp = users[0].email;
        console.log("Login successful!");
        res.send();
      }
    });
  });

// when you register, create user data
  app.post("/register", function(req, res) {
    db.collection('users').find({email: req.body.email}).toArray((err, users) => {
      if (users.length === 0) {
        let user = {
          "name" : req.body.email,
          "email" : req.body.email,
          "password" : req.body.password,
          "avatars" : {
            "regular" : "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
            },
          "handle" : req.body.email,
        };
        db.collection('users').insert(user);
        req.session.temp = user.email;
        res.send();
      } else {
        console.log("E-Mail is in use!");
        return;
      }
    });
  });

});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.

// Mount the tweets routes at the "/tweets" path prefix: