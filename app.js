window.app = {};

window.app.volume = 0;
window.app.color = 'rgba(40,40,40,1)';
window.app.chosenColors = [
	'rgba(0,0,0,1)',	
	'rgba(209,0,0,1)',
	'rgba(255,102,34,1)',
	'rgba(255,218,33,1)',
	'rgba(51,221,0,1)',
	'rgba(17,51,204,1)',
	'rgba(34,0,102,1)',
	'rgba(51,0,68,1)'
];

window.app.code = function (s) {
    return s.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
};

window.app.handleStream = function (stream) {
    var context = new AudioContext(),
    	source = context.createMediaStreamSource(stream),
    	processor = context.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function (e) {
		var input = e.inputBuffer.getChannelData(0),
			len = input.length,
			total = 0,
			i = 0;
		
		while (i < len) {
			total += Math.abs(input[i++]);
		}
		
		var rms = Math.sqrt(total / len);
		
		window.app.volume = rms * 100;

		window.app.draw();
	};
 };

window.onload = function () {
	window.setInterval(window.app.onInterval, 3500);
	navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(window.app.handleStream);
};

window.app.onInterval = function () {
	window.app.color = window.app.chosenColors[Math.floor(Math.random()*Math.floor(window.app.chosenColors.length))];
};

window.app.draw = function () {
  	var canvas = document.getElementById('canvas');

  	if (!canvas.getContext) {
  		return;
  	}

	var ctx = canvas.getContext('2d');

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'rgba(255,255,255,1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = window.app.color;
	ctx.fillRect(60, 60, 50, 50);
    ctx.stroke();	    
};
