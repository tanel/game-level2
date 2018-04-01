window.app = {};

window.app.code = function (s) {
    return s.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
};


window.onload = function () {
	  var player = document.getElementById('player');

	  var handleSuccess = function(stream) {
	    if (window.URL) {
	      player.src = window.URL.createObjectURL(stream);
	    } else {
	      player.src = stream;
	    }
	  };

	  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
};
