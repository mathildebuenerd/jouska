var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        console.log("The device is ready");
        var recognition = window['SpeechRecognition'];
        var button = document.querySelector('#startSpeechRecognition');
        button.addEventListener('click', function () {
            console.log("le listener marche");
            console.log(recognition);
            recognition.start();
        });
        console.log(recognition);
        recognition.onresult = function (event) {
            if (event.results.length > 0) {
                console.log(event.results[0][0].transcript);
            }
        };
    }
};
app.initialize();
//# sourceMappingURL=index.js.map