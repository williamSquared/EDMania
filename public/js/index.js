$().ready(function() {

  var setGallery = new Vue({
    el: '#setGallery',
    data: {
			search: '',
      sets: null,
    },
    computed: {
			filteredSets() {
				if (!this.sets) return;
				return this.sets.filter(set => {
					return set.artist.toLowerCase().includes(this.search.toLowerCase())
			})
			}
    },
    methods: {
			viewSetData: function(set) {
				$('#setImage').attr('src', set.image);
				$('#setArtist').text(set.artist);
				$('#setTitle').text(set.title);
				$('#setTrack').html(set.iHeartTrackURL);
				$('#setDownloadLink').attr('href', set.download_link);
				$('#setDisplay').show();
    	}
    }
  });

  $.getJSON('/setData.json', function(json) {
    setGallery.sets = Set.createSets(json.sets);
  });

  setupScrollingDiv();
});

class Set {
  constructor(title, artist, iHeartTrackURL, image, download_link) {
    this.title = title;
    this.artist = artist;
    this.iHeartTrackURL = iHeartTrackURL;
    this.image = image;
    this.download_link = download_link;
  }

	static createSets(sets) {
		var newSets = [];
		for (var i = 0; i < sets.length; i++) {
			newSets.push(new Set(
				sets[i].title, sets[i].artist, sets[i].iHeartTrackURL, sets[i].image, sets[i].download_links['zippyshare']
			));
		}

	return newSets;
	}
}

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