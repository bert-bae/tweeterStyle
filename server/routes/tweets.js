// "use strict";

// const userHelper    = require("../lib/util/user-helper");
// const express       = require('express');
// const tweetsRoutes  = express.Router();

// module.exports = function(DataHelpers) {

//   tweetsRoutes.get("/", function(req, res) {
//     DataHelpers.getTweets((err, tweets) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json(tweets);
//       }
//     });
//   });

//   tweetsRoutes.post("/:tweetid", function (req, res) {
//     if (!req.session.temp) {
//       res.status(403).json({ error: 'user needs to be logged in' });
//       return;
//     }
//     res.send();
//   });

//   return tweetsRoutes;

// };
