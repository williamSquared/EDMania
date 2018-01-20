(function() {
	'use strict';

	init();

	function init() {
		getSetData();
	}

	function getSetData() {
		$.ajax({
		  url: "/setData.json",
		  type: "GET",
		  dataType: "json",
		  success: function(data) {
		    document.getElementById("setData").innerHTML = JSON.stringify(data.sets);
		  },
		  error: function(httpRequest, status, error) {
		    console.log(error);
		  }
		});
	}

})(window.jQuery);