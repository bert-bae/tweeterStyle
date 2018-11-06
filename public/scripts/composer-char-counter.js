$(document).ready(function() {
  $('#submit-tweet').on('keypress', function () {
    // console.log(this.value.length + 1); //counts length of input
    let maxCount = Number($(this).siblings('span.counter').text())
    if (maxCount < 0) {
      // polish up this error sign, maybe a hidden error that pops up would be better
      $(this).siblings('.tweet-submit').css({
        "background-color": "red",
        "color": "yellow",
      });
    } else {
      maxCount--;
    }
    $('span.counter').text(maxCount);
  });
});