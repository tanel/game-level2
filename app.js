window.app = {};

window.app.volume = 0;

window.app.code = function (s) {
    return s.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
};

window.app.handleStream = function (stream) {
    var context = new AudioContext();
    var source = context.createMediaStreamSource(stream);
    var processor = context.createScriptProcessor(1024, 1, 1);

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
	navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(window.app.handleStream);
};

window.app.draw = function () {
  	var canvas = document.getElementById('canvas');
  	var radius = window.app.volume;
  	if (canvas.getContext) {
    	var ctx = canvas.getContext('2d');
		
		//ctx.clearRect(0, 0, 480, 640);
	    
	    ctx.beginPath();
	    ctx.arc(75, 75, radius, 0, Math.PI * 2, true); // Outer circle
	    ctx.moveTo(110, 75);
	    ctx.arc(75, 75, 35, 0, Math.PI, false);  // Mouth (clockwise)
	    ctx.moveTo(65, 65);
	    ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // Left eye
	    ctx.moveTo(95, 65);
	    ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // Right eye
	    ctx.stroke();	    
  	}
}