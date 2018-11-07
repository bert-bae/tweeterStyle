/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const tweetData = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];


let createTweetElement = function (tweet) {

  for (let data in tweet) {
    let user = data.user;
    let content = data.content;
    let dateCreated = ((Date.now() - data.created_at) / 86400000).toFixed(0) + " days ago.";

    $('section#comment-section').append($('<article>').append(
      createCommentHeader(),
      createTextContainer(),
      createCommentFooter()
    ));
  }

  function createCommentHeader () {
    let commentHeader =
    $('<div>').addClass('comment-header').append(
      $('<img>').attr('src', user.avatars.regular),
      $('<h2>').text(user.name),
      $('<p>').text(user.handle)
    );
    return commentHeader;
  }
  function createTextContainer () {
    let textContainer = $('<div>').addClass('text-container').append($('<p>').text(content.text));
    return textContainer;
  }
  function createCommentFooter () {
    let commentFooter =
    $('<div>').addClass('comment-footer').append(
      $('<p>').text(dateCreated),
      $('<i>').addClass("fab fa-font-awesome-flag"),
      $('<i>').addClass("fas fa-retweet"),
      $('<i>').addClass("fas fa-heart")
    );
    return commentFooter;
  }
};

createTweetElement(tweetData);
// $(document).ready(function () {

//   const tweetData = {
//   "user": {
//       "name": "Newton",
//       "avatars": {
//         "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
//         "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
//         "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
//       },
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   };

//   console.log(tweetData.user);



// });