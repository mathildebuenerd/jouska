var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        console.log("The device is ready");
        var recognition = window['SpeechRecognition'];
        recognition.lang = "fr-FR";
        recognition.continuous = true;
        recognition.interimResults = false;
        var button = document.querySelector('#startSpeechRecognition');
        button.addEventListener('click', function () {
            console.log("le listener marche");
            console.log(recognition);
            recognition.start();
        });
        var PushNotification = window['PushNotification'];
        var push = PushNotification.init({
            android: {},
            ios: {
                alert: "true",
                badge: true,
                sound: 'false'
            },
            windows: {}
        });
        push.on('registration', function (data) {
            console.log(data.registrationId);
        });
        push.on('notification', function (data) {
            console.log(data.message);
            console.log(data.title);
            console.log(data.count);
            console.log(data.sound);
            console.log(data.image);
            console.log(data.additionalData);
        });
        push.on('error', function (e) {
            console.log(e.message);
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