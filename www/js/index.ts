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

        window['plugins'].speechRecognition.isRecognitionAvailable(function(available){
            if(available){
                console.log("speechRecognition est available");
                console.log(available);
                window['plugins'].speechRecognition.hasPermission(function (isGranted){
                    if(isGranted){
                        console.log("speechRecognition a la permission");
                    }else{
                        console.log("speechRecognition n'a la permission");
                        window['plugins'].speechRecognition.requestPermission(function (){
                            console.log("je requière la permission");
                        }, function (err){
                            console.log("je n'arrive pas à avoir la permission");
                            console.log(err);
                        });
                    }
                }, function(err){
                    console.log(err);
                });

                // on paramètre la langue d'écoute
                let settings = {
                    lang: "fr-FR"
                    // showPopup: true
                };

                // on commence à écouter
                window['plugins'].speechRecognition.startListening(function(result){
                    console.log(result);
                }, function(err){
                    console.log(err);
                }, settings);

            }
        }, function(err){
            console.log("speechRecognition n'est pas available");
            console.error(err);
        });
    }

};

app.initialize();