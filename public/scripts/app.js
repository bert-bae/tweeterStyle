/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


let createTweetElement = (data) => {

  let user = data.user;
  let content = data.content;
  let dateCreated;

  const pluralizeText = () => {
    let time = ((Date.now() - data.created_at) / 86400000).toFixed(0);

    if (time > 1 ) {
      dateCreated = time + " days ago.";
    }
    if (time === 1) {
      dateCreated = time + " day.";
    }
    if (time < 1) {
      dateCreated = "Less than 1 day.";
    }
  };
  pluralizeText();

  const createCommentHeader = () => {
    let commentHeader =
    $('<div>').addClass('comment-header').append(
      $('<img>').attr('src', user.avatars.regular),
      $('<h2>').text(user.name),
      $('<p>').text(user.handle)
    );
    return commentHeader;
  };
  const createTextContainer = () => {
    let textContainer = $('<div>').addClass('text-container').append($('<p>').text(content.text));
    return textContainer;
  };
  const createCommentFooter = () => {
    let commentFooter =
    $('<div>').addClass('comment-footer').append(
      $('<p>').text(dateCreated),
      $('<i>').addClass("fab fa-font-awesome-flag"),
      $('<i>').addClass("fas fa-retweet"),
      $('<i>').addClass("fas fa-heart")
    );
    return commentFooter;
  };

// http://api.jquery.com/prepend/ (make most recent appear at the top)
  $('section#comment-section').prepend($('<article>').append(
    createCommentHeader(),
    createTextContainer(),
    createCommentFooter()
  ));
};

let renderTweets = (data) => {
  data.forEach(tweet => {
    createTweetElement(tweet);
  });
};


// TWEETS ARE LOADING, BUT THERE IS A DELAY (ask if this is typical?)
let loadTweets = () => {
  let $data = $('form.twitter-form');
  $data.on('submit', function () {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:8080/tweets',
      dataType: 'json',
      success: function(data) {
        renderTweets(data);
        $('textarea#submit-tweet').val("");
        $('span.counter').text("140");
      }
    });
  });
};
loadTweets();

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