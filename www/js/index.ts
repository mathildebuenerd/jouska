// export class CordovaApp {
//     constructor() {
//
//     }
// }
// import 'phonegap-plugin-push'
// import 'phonegap-plugin-speech-recognition'

let blockSentences = document.querySelector('#blockSentences');

let app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        console.log("The device is ready");

        // Setup
        let recognition = new SpeechRecognition();
        recognition.lang = "fr-FR";
        recognition.continuous = true;
        // recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        let recognizing = false;

        let mybutton = document.querySelector('#startSpeechRecognition');

        mybutton.addEventListener('click', restartRecognition);

        recognition.start();

        recognition.onstart = function(event) {
            console.log(event.type);
            blockSentences.style.backgroundColor = "blue";
            recognizing = true;
        };

        recognition.onresult = function(event) {
            console.log(event.type);
            let sentence = '';

            // we go into the results in order to have the whole sentence
            for (let i=0; i<event.results.length; i++) {
                sentence+=event.results[i][0].transcript + ' ';
            }

            blockSentences.textContent = sentence;
            console.log(sentence);
            restartRecognition();

            // when we have 10 words, we send it to the server and restart the recording
            // if ((sentence.split(' ')).length > 10) {
            //     // socket.emit('newSentence', {sentence: sentence}); // on envoie un message de type 'newsentence, avec la sentence en contenu
            //     // sentences.push({sentence:sentence});
            //     restartRecognition();
            // }
        };

        // permet de redémarrer la recognition quand elle s'arrête
        recognition.onend = (event) => {
            console.log(event.type);
            blockSentences.style.backgroundColor = "red";
            restartRecognition();
        };

        function restartRecognition() {
            recognition.stop();
            recognition.start();
        }



        // // Notifications
        // const PushNotification = window['PushNotification'];
        // const push = PushNotification.init({
        //     android: {
        //     },
        //     ios: {
        //         alert: "true",
        //         badge: true,
        //         sound: 'false'
        //     },
        //     windows: {}
        // });
        //
        // push.on('registration', (data) => {
        //     console.log(data.registrationId);
        // });
        //
        // push.on('notification', (data) => {
        //     console.log(data.message);
        //     console.log(data.title);
        //     console.log(data.count);
        //     console.log(data.sound);
        //     console.log(data.image);
        //     console.log(data.additionalData);
        // });
        //
        // push.on('error', (e) => {
        //     console.log(e.message);
        // });

    }

};

app.initialize();