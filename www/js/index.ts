import {SMSManager} from "./manageSMS";
import {SentimentAnalysis} from "./sentimentAnalysis";
import {Datavisualisation} from "./datavisualisation";
import set = Reflect.set;
import * as translate from "./../../hooks/translate";
import "./visualEffects";


export class CordovaApp {
    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }

    onDeviceReady() {

        installTheApp();
        function installTheApp() {

            let smsData = {}; // on crée un objet qui va contenir toutes les données récupérées sur les messages

            const install = document.querySelector("#installTheApp");

            // -------- Get text messages ----------
            // Get received messages
            const getReceivedMessages = install.querySelector("#getReceivedMessages");

            getReceivedMessages.addEventListener('click', () => {
                sms.getAllSMS().then( allSMS => {
                    console.group("getAllSMS");
                    console.log('je suis dans then getAllSMS');
                    console.log('typeof allSMS : ' + typeof allSMS);
                    console.log(allSMS);
                    console.groupEnd();
                }).catch(
                    error => console.error("la promesse concernant getAllSMS a échoué")
                );
            });


            // Get sent messages
            const getSentMessages = document.querySelector("#getSentMessages");




            // -------- Translate to english ----------
            // Translate messages

            const translateMessagesToEnglish = install.querySelector("#translateMessages");
            translateMessagesToEnglish.addEventListener('click', () => {
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



            // -------- Analyze text content ----------
            // Sentiment analysis

            // Darktriad analysis

            // Personality analysis (Big Five)




            // -------- Calculate average scores ----------
            // Calculate average score of each contact

            // Calculate average score of the user per contact



            // -------- Get contact names ----------
            // Get contact names



            // -------- Get meta data from the installation ----------
            // Get current date/hour

            // Get last SMS ids

            // Add average scores to metadata


        }

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

        let analysis = new SentimentAnalysis('en');
        let allSMS;
        let userData;


        // si l'usager n'a jamais utilisé l'appli, on initialise son profil

        // console.log(localStorage.getItem());
        // if (localStorage.getItem("userData") === undefined) {
        userData = {
            firstUsage: true,
            lastSynchro: '',
            smsLoaded: false,
            smsTranslated: false,
            smsAnalyzed: {
                darktriad: false,
                sentiment: false
            }
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        // console.log('Nouvel usager');
        // console.log(userData);
        // } else {
        //     let userDataString = localStorage.getItem('userData');
        //     userData = JSON.parse(userDataString);
        //     console.log("Pas nouvel usager");
        //     console.log(userData);
        // }

        // document.querySelector('#loadSMS').addEventListener('click', () => {
        // });



        // analyse les phrases qui se trouvent dans l'objet allSMS
        // La majorité des librairies d'analyse de sentiments sont en anglais, c'est pourquoi on utilise la traduction anglais pour faire cette analyse
        document.querySelector('#analyzeSMS').addEventListener('click', () => {
            const allSMS = JSON.parse(localStorage.getItem('allSMS'));
            console.group("Analyze SMS");
            console.log(allSMS);

            for (const contact in allSMS) {
                for (const smsId in allSMS[contact]) {
                    const englishSentence = allSMS[contact][smsId].body.en;
                    allSMS[contact][smsId].analysis = analysis.analyze(englishSentence, 'en');
                }
            }

            console.log('allSMS + analyse');
            console.log(allSMS);
            console.groupEnd();

            document.querySelector('#addAnalyzeToStorage').addEventListener('click', () => {
                localStorage.setItem('allSMSanalyzed', JSON.stringify(allSMS));
                console.log("l'analyse est bien ajoutée au stockage!!");
            });

        });

        document.querySelector("#startVisualisation").addEventListener('click', () => {
            console.group("Start visualisation selector");
            const stringyfiedSMSData = localStorage.getItem('allSMSanalyzed');
            const SMSdata = JSON.parse(stringyfiedSMSData);
            console.log("SMSdata:");
            console.log(SMSdata);
            let visualisationSMS = new Datavisualisation(SMSdata, 'sms');
            visualisationSMS.simpleContactComparison();
            console.groupEnd();
        });





    }

}

let instance = new CordovaApp();
