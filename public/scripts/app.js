/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function () {
  let $data = $('form.twitter-form');
  let $textarea = $('textarea#submit-tweet');

// jQuery UI

  let hideAll = () => {
    $('.login-page').hide();
    $('.register-page').hide();
    $('.login-prompt').hide();
    $('.new-tweet').hide();
  };

  let successfulLogin = () => {
    hideAll();
    $('.login-button').css('display', 'none');
    $('.register-button').css('display', 'none');
    $('.login input').val("");
    $('.logout-button').css('display', 'block');
  };

  let logout = () => {
    hideAll();
    $('.login-button').css('display', 'block');
    $('.register-button').css('display', 'block');
    $('.register input').val("");
    $('.logout-button').css('display', 'none');
  };

  let loginPrompt = () => {
    hideAll();
    $('.login-prompt').show().text("Must be logged in to access!");
  };

  $('.login-button').on('click', function () {
    hideAll();
    $('.register-page').slideUp(500);
    $('.login-page').slideToggle(500);
  });

  $('.register-button').on('click', function () {
    hideAll();
    $('.login-page').slideUp(500);
    $('.register-page').slideToggle(500);
  });

  $('.create-comment').on('click', function () {
    hideAll();
    $('.new-tweet').slideToggle(500);
    $('#submit-tweet').focus();
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
        $('<span>').addClass("fa-layers fa-fw").append(
          $('<i>').addClass("fab fa-font-awesome-flag")
        ),
        $('<span>').addClass("fa-layers fa-fw").append(
          $('<i>').addClass("fas fa-retweet")
        ),
        $('<span>').addClass("fa-layers fa-fw").append(
          $('<i>').addClass("fas fa-heart"),
          $('<span>').addClass("fa-layers-counter fa-heart")
        )
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
      $('.twitter-form p').text("Enter your tweet!");
      $('.twitter-form').on('submit', function () {
        $('.twitter-form p').slideDown("fast");
      });
      return;
    }
    if ($textarea.val().length > 140) {
      $('.twitter-form p').text("Max characters allowed is 140!");
      $('.twitter-form').on('submit', function () {
        $('.twitter-form p').slideDown("fast");
      });
      return;
    }
    $.ajax({
      type: 'POST',
      url: 'http://localhost:8080/tweets',
      data: $(this).serialize(),
      success: loadTweets,
      error: function(jqXHR, textStatus, errorThrown) {
        loginPrompt();
      }
    });
  });

// when clicking login, send req to route /login
  $('.login').on('submit', function () {
    event.preventDefault();
    $.ajax({
      type: 'POST',
      data: $(this).serialize(),
      url: 'http://localhost:8080/login',
      success: successfulLogin,
      error: function(jqXHR, textStatus, errorThrown) {
        $('.login-page p').slideDown(500).text("E-mail or password is incorrect!").delay(2000).slideUp(500);
      }
    });
  });

// when clicking register, send req to route /register
  $('.register').on('submit', function () {
    event.preventDefault();
    $.ajax({
      type: 'POST',
      data: $(this).serialize(),
      url: 'http://localhost:8080/register',
      success: successfulLogin,
      error: function(jqXHR, textStatus, errorThrown) {
        $('.register-page p').slideDown(500).text("Credentials are already taken! Try changing your handle or E-Mail").delay(2000).slideUp(500);
      }
    });
  });

  // when clicking login, send req to route /login
  $('.logout-button').on('click', function () {
    event.preventDefault();
    $.ajax({
      type: 'POST',
      url: 'http://localhost:8080/logout',
      success: logout,
    });
  });

  $('#comment-section').on('click','i.fa-font-awesome-flag', function () {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:8080/tweets/:tweetid',
      success: function () {
        $('i.fa-font-awesome-flag').toggleClass('flagged');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        loginPrompt();
      },
    });
  });

  $('#comment-section').on('click','i.fa-retweet', function () {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:8080/tweets/:tweetid',
      success: function () {
        $('i.fa-retweet').toggleClass('flagged');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        loginPrompt();
      },
    });
  });

    // $('span.fa-heart').text(1).css("display", "block"); // counter in work
  $('#comment-section').on('click','i.fa-heart', function () {
     $.ajax({
      type: 'POST',
      url: 'http://localhost:8080/tweets/:tweetid',
      success: function () {
        $('i.fa-heart').toggleClass('liked');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        loginPrompt();
      },
    });
  });

});

