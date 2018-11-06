$(document).ready(function() {
  $('#submit-tweet').on('keyup', function () {
    // console.log(this.value.length + 1); //counts length of input
    let count = 140;
    let length = this.value.length;
    let maxCount = Number($(this).siblings('span.counter').text());
    if (maxCount < 0) {
      // polish up this error sign, maybe a hidden error that pops up would be better
      $(this).siblings('span.counter').css({
        "color": "red",
      });
    } else {
      maxCount = count - length;
    }
    $('span.counter').text(maxCount);
  });
});