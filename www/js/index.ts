// export class CordovaApp {
//     constructor() {
//
//     }
// }


let app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        console.log("The device is ready");
        const recognition = window['SpeechRecognition'];
        let button = document.querySelector('#startSpeechRecognition');
        button.addEventListener('click', function() {
            console.log("le listener marche");
            console.log(recognition);
            recognition.start();



        // Notifications
            const PushNotification = window['PushNotification'];
            const push = PushNotification.init({
                android: {
                },
                ios: {
                    alert: "true",
                    badge: true,
                    sound: 'false'
                },
                windows: {}
            });

            push.on('registration', (data) => {
                console.log(data.registrationId);
            });

            push.on('notification', (data) => {
                console.log(data.message);
                console.log(data.title);
                console.log(data.count);
                console.log(data.sound);
                console.log(data.image);
                console.log(data.additionalData);
            });

            push.on('error', (e) => {
                console.log(e.message);
            });
        });

        // let recognition = new SpeechRecognition();
        console.log(recognition);
        // recognition.start();
        recognition.onresult = function(event) {
            if (event.results.length > 0) {
                console.log(event.results[0][0].transcript);
            }
        }
    }

};

app.initialize();