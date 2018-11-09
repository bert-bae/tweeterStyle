"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const userRoutes    = express();
const session       = require('cookie-session');
const bcrypt        = require('bcrypt');

userRoutes.use(bodyParser.urlencoded({ extended: true }));
userRoutes.use(express.static("public"));
userRoutes.use(session({
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
  userRoutes.use("/tweets", tweetsRoutes);

// when you login, retrieve the data based on user E-Mail... WORK IN PROGRESS
  userRoutes.post("/login", function(req, res) {
    db.collection('users').find({email: req.body.email}).toArray((err, users) => {
      if (err) {
        res.status(403).send(err);
        return;
      }
      if (!users.length) {
        res.status(403).send("There is no user associated with this E-Mail.");
        return;
      }
      if (!req.body.email) {
        res.status(403).send("E-Mail is required.");
        return;
      }
      if (!req.body.password) {
        res.status(403).send("Password not entered.");
        return;
      }
      if (!bcrypt.compareSync(req.body.password, users[0].password)) {
        res.status(403).send("Password is incorrect!");
        return;
      }
      req.session.temp = users[0].email;
      res.send("Login successful!");
    });
  });

// when you register, create user data
  userRoutes.post("/register", function(req, res) {
    //verify existance of unique handle
    db.collection('users').find({handle: req.body.handle}).toArray((err, users) => {
      if (err || users.length > 0) {
        res.status(403).send(err);
      } else {
        //verify existance of unique email
        db.collection('users').find({email: req.body.email}).toArray((err, users) => {
          if (err || users.length > 0) {
            res.status(403).send(err);
          } else {
            let user = {
              "name" : req.body.name,
              "email" : req.body.email,
              "password" : bcrypt.hashSync(req.body.password, 8),
              "handle" : req.body.handle,
              "avatars" : {
                "regular" : "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
                },
            };
            db.collection('users').insert(user);
            req.session.temp = user.email;
            res.send();
          }
        });
      }
    });
  });

  userRoutes.post("/logout", function(req, res) {
    req.session = null;
    res.send();
  });
});

userRoutes.listen(PORT, () => {
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