window.app = {};

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

    processor.onaudioprocess = function(e) {
      // Do something with the data, i.e Convert this to WAV
		console.log(e.inputBuffer);
    };
 };

window.onload = function () {
	navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(window.app.handleStream);
};
