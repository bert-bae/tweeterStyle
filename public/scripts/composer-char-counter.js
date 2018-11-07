$(document).ready(function() {
  $('#submit-tweet').on('keyup', function () {
    let count = 140;
    let length = this.value.length;
    let maxCount = Number($(this).siblings('span.counter').text());
    if (maxCount < 0) {
      $(this).siblings('span.counter').css({
        "color": "red",
      });
      maxCount = count - length;
    } else {
      $(this).siblings('span.counter').css({
        "color": "black",
      });
      maxCount = count - length;
    }
    $('span.counter').text(maxCount);
  });
});