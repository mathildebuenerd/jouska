import {SMSManager} from "./manageSMS";
import {SentimentAnalysis} from "./sentimentAnalysis";
import set = Reflect.set;
import * as translate from "./../../hooks/translate";


export class CordovaApp {
    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }

    onDeviceReady() {

        console.profile();
        console.log("The device is ready");

        console.log('localStorage');
        console.log(localStorage);
        let sms = new SMSManager({
            box : 'sent', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
            // following 4 filters should NOT be used together, they are OR relationship
            //  read : 0, // 0 for unread SMS, 1 for SMS already read
            //_id : 1234, //  specify the msg id
            //address : '// +8613601234567',  sender's phone number
            // body : 'This is a test SMS', // content to match

            // following 2 filters can be used to list page up/down
            //   indexFrom : 0, // start from index 0
            maxCount : 2000, // count of SMS to return each time
        });


        // let allSMS = sms.getAllSMS();
        // console.log("allSMS");
        // console.log(allSMS);
        let analysis = new SentimentAnalysis('en');
        let allSMS;

        // let mytest = sms.getAllSMS();
        // for (let key in allSMS) {
        //     console.log(allSMS[key]);
        // }

        document.querySelector('#loadSMS').addEventListener('click', () => {
            sms.getAllSMS().then( allSMS => {
                console.group("getAllSMS");
                console.log('je suis dans then getAllSMS');
                console.log('typeof allSMS : ' + typeof allSMS);
                console.log(allSMS);
                console.groupEnd();

                document.querySelector('#translateSMS').addEventListener('click', () => {
                    console.group("translate");
                    console.log(allSMS);
                    for (const contact in allSMS) {
                        console.log(allSMS[contact]);
                        for (const smsID in allSMS[contact]) {
                            console.log(allSMS[contact][smsID].body.fr);
                            translate(allSMS[contact][smsID].body.fr, {to: 'en'}).then(translatedText => {
                                let text = translatedText;
                                if (translatedText.indexOf('&#39;') !== -1) {
                                    text = translatedText.replace('&#39;', "'"); // il y a un problème d'encodage avec l'apostrophe, donc on remplace les erreurs
                                }
                                allSMS[contact][smsID].body.en = text;
                            });
                            // allTranslatedSMS[contact][smsID].body.en = "test";
                        }
                    }
                    console.log('Mes traductions :');
                    console.log(allSMS);
                    console.groupEnd();

                    document.querySelector('#addToStorage').addEventListener('click', () => {
                        console.log('Storage');
                        localStorage.removeItem('allSMS');
                        localStorage.setItem("allSMS", JSON.stringify(allSMS)); // On ne peut stocker que des string dans le local storage, il faut donc strigifier
                        let storageSMS = localStorage.getItem("allSMS");
                        console.log("Mon local storage :");
                        console.log(JSON.parse(storageSMS));
                        console.groupEnd();
                    });


                });



                // localStorage.setItem("allSMS", JSON.stringify(allSMS)); // On ne peut stocker que des string dans le local storage, il faut donc strigifier





            }).catch(
                error => console.error("la promesse concernant getAllSMS a échoué")
            );
        });






        function analyze(translatedSMS) {
            console.log('analyze');

            let stats = [];
            for (let i=0; i<20; i++) {
                stats[i] = analysis.analyze(translatedSMS[i], 'en');
            }
            console.log('stats');
            console.log(stats);

        }




    }

}

let instance = new CordovaApp();
