$().ready(function() {

  var setGallery = new Vue({
    el: '#setGallery',
    data: {
      sets: null,
    }
  });

  $.getJSON('/setData.json', function(json) {
    setGallery.sets = json.sets;
  });

  var $scrollingDiv = $("#scrollingDiv");
  $(window).scroll(function() {
    $scrollingDiv
      .stop()
      .animate({
        "marginTop": ($(window).scrollTop())
      }, 400);
  });
});