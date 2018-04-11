var blockSentences = document.querySelector('#blockSentences');
var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        console.log("The device is ready");
        var recognition = new SpeechRecognition();
        recognition.lang = "fr-FR";
        recognition.continuous = true;
        recognition.maxAlternatives = 1;
        var recognizing = false;
        var mybutton = document.querySelector('#startSpeechRecognition');
        mybutton.addEventListener('click', restartRecognition);
        recognition.onstart = function (event) {
            console.log(event.type);
            blockSentences.style.backgroundColor = "blue";
            recognizing = true;
        };
        recognition.onresult = function (event) {
            console.log(event.type);
            var sentence = '';
            for (var i = 0; i < event.results.length; i++) {
                sentence += event.results[i][0].transcript + ' ';
            }
            blockSentences.textContent = sentence;
            console.log(sentence);
            restartRecognition();
        };
        recognition.onend = function (event) {
            console.log(event.type);
            blockSentences.style.backgroundColor = "red";
            restartRecognition();
        };
        recognition.onspeechend = function (event) {
            console.log(event.type);
        };
        function restartRecognition() {
            console.log('je restart');
            recognition.stop();
            console.log('jai stop dans le restart');
            recognition.start();
            console.log('jai redemarré dans le restart');
        }
        console.log('localStorage');
        console.log(localStorage);
    }
};
app.initialize();
//# sourceMappingURL=index.js.map