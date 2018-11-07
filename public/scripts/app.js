/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function () {

  let $data = $('form.twitter-form');
  let $textarea = $('textarea#submit-tweet');

// jQuery UI
  $('span.create-comment').on('click', function () {
    $('section.new-tweet').slideToggle(500);
  });


// create comments
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
    $('section#comment-section').empty();
    data.forEach(tweet => {
      createTweetElement(tweet);
    });
    $textarea.val("");
    $('span.counter').text("140");
  };

  // AJAX jQuery
  let loadTweets = () => {
    $('form.twitter-form p').slideUp("fast");
    $.ajax({
      type: 'GET',
      url: 'http://localhost:8080/tweets',
      dataType: 'json',
      success: renderTweets,
    });
  };
  loadTweets();

  $data.on('submit', function (event) {
    event.preventDefault();
    if ($textarea.val() === "") {
      $('form.twitter-form p').text("Enter your tweet!");
      $('form.twitter-form').on('submit', function () {
        $('form.twitter-form p').slideDown("fast");
      });
      return;
    }
    if ($textarea.val().length > 140) {
      $('form.twitter-form p').text("Max characters allowed is 140!");
      $('form.twitter-form').on('submit', function () {
        $('form.twitter-form p').slideDown("fast");
      });
      return;
    }
    $.ajax({
      type: 'POST',
      url: 'http://localhost:8080/tweets',
      data: $(this).serialize(),
      success: loadTweets,
    });
  });

});
