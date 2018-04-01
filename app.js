window.app = {};

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
		
		var rms = Math.sqrt(total / len),
			volume = rms * 100;

		console.log(volume);
	};
 };

window.onload = function () {
	navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(window.app.handleStream);
};
