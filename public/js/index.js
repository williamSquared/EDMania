$().ready(function() {

  var setGallery = new Vue({
    el: '#setGallery',
    data: {
      sets: null,
    },
    methods: {
    	viewSetData: function(setData) {
    		$('#setImage').attr('src', setData.image);
    		$('#setArtist').text(setData.artist);
    		$('#setTitle').text(setData.title);
    		$('#setTrack').html(setData.iHeartTrackURL);
    		$('#setDisplay').show();
    		// setDetails.setData = setData;
    	}
    }
  });

  // var setDetails = new Vue({
  // 	el: '#setDetails',
  // 	data: {
  // 		setData: null,
  // 	}
  // });

  $.getJSON('/setData.json', function(json) {
    setGallery.sets = json.sets;
  });

  setupScrollingDiv();
});

function setupScrollingDiv() {
	var $scrollingDiv = $("#scrollingDiv");
  $(window).scroll(function() {
    $scrollingDiv
      .stop()
      .animate({
        "marginTop": ($(window).scrollTop())
      }, 400);
  });
}