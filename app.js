window.app = {};

window.app.canvas = null;
window.app.volume = 0;
window.app.background = 'rgba(255,255,255,1)';
window.app.color = 'rgba(40,40,40,1)';
window.app.chosenColors = [
	'rgba(0,0,0,1)',	
	'rgba(209,0,0,1)',
	'rgba(255,102,34,1)',
	'rgba(255,218,33,1)',
	'rgba(51,221,0,1)',
	'rgba(17,51,204,1)',
	'rgba(34,0,102,1)',
	'rgba(200, 162, 200, 1)',
	'rgba(51,0,68,1)'
];

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

		window.app.handleAudioInput();

		window.app.draw();
	};
};

window.app.changeColor = function () {
	window.app.color = window.app.randomColor(); 
};

window.app.randomColor = function () {
	return window.app.chosenColors[Math.floor(Math.random()*Math.floor(window.app.chosenColors.length))];
};

window.app.draw = function () {
	if (window.app.color === window.app.lastColor &&
		window.app.background === window.app.lastBackground) {
		return;
	}

  	var canvas = window.app.canvas;
  	if (!canvas.getContext) {
  		return;
  	}

	var ctx = canvas.getContext('2d');

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = window.app.background;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

    window.app.rectangle(100, 100, ctx);
    ctx.stroke();
    
    window.app.lastColor = window.app.color;
    window.app.lastBackground = window.app.background;	    
};

window.app.rectangle = function (var x, var y, var ctx) {
	ctx.fillStyle = window.app.color;
	ctx.fillRect(x, y, 100, 100);
    
}

window.app.handleAudioInput = function () {
	if (window.app.volume < 30.0) {
		return;
	}

	window.app.background = window.app.randomColor();
};

window.onload = function () {
	window.app.canvas = document.getElementById('canvas');

	window.setInterval(window.app.changeColor, 3500);

	navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(window.app.handleStream);
};