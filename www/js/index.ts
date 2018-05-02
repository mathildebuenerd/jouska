import {SMSManager} from "./manageSMS";
import {TextAnalysis} from "./sentimentAnalysis";
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

            let sms = new SMSManager(); // on instancie l'objet sms pour utiliser les fonctions de la classe
            let textAnalysis = new TextAnalysis();
            let smsData = {}; // on crée un objet qui va contenir toutes les données récupérées sur les messages

            const install = document.querySelector("#installTheApp");

            // -------- Get text messages ----------
            // Get received messages
            const getReceivedMessages = install.querySelector("#getReceivedMessages");
            getReceivedMessages.addEventListener('click', () => {
                sms.getAllSMS({
                    box : 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
                    //   indexFrom : 0, // start from index 0
                    maxCount : 10000, // count of SMS to return each time
                }).then( allSMS => {
                    smsData = allSMS;
                    console.log(smsData);
                }).catch(
                    error => console.error("la promesse concernant getAllSMS a échoué")
                );
            });


            // Get sent messages
            const getSentMessages = document.querySelector("#getSentMessages");
            getSentMessages.addEventListener('click', () => {
                sms.getAllSMS({
                    box : 'sent', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
                    //   indexFrom : 0, // start from index 0
                    maxCount : 10000, // count of SMS to return each time
                }).then( allSMS => {
                    for (let contact in smsData) {
                        Object.assign(smsData[contact], allSMS[contact]); // on ajoute les messages envoyés à l'objet qui sert de base de données
                    }
                }).catch(
                    error => console.error("la promesse concernant getAllSMS a échoué")
                );
            });



            // -------- Translate to english ----------
            // Translate messages

            const translateMessagesToEnglish = install.querySelector("#translateMessages");
            translateMessagesToEnglish.addEventListener('click', () => {
                for (const contact in smsData) {
                    console.log(smsData[contact]);
                    for (const type in smsData[contact]) { // le type correspond à 'sent' ou 'inbox' (messages reçus ou envoyés)
                        // console.log("type:");
                        // console.log(sms)
                        for (const smsID in smsData[contact][type]) {
                            console.log(smsData[contact][type][smsID].text.fr);
                            translate(smsData[contact][type][smsID].text.fr, {to: 'en'}).then(translatedText => {
                                let text = translatedText;
                                if (translatedText.indexOf('&#39;') !== -1) { // il y a un problème d'encodage avec l'apostrophe, donc on remplace les erreurs
                                    text = translatedText.replace('&#39;', "'");
                                }
                                smsData[contact][type][smsID].text.en = text;
                            });
                            // allTranslatedSMS[contact][smsID].body.en = "test";
                        }
                    }
                }
                console.log("avec traduction");
                console.log(smsData);
            });



            // -------- Analyze text content ----------
            // Sentiment analysis
            const sentimentAnalysis = install.querySelector("#analyzeSentiment");
            sentimentAnalysis.addEventListener('click', () => {
                let test = textAnalysis.sentimentAnalysis(`How are you doing today ? I feel a bit strange I think`);
                console.log('test sentiment analysis: ');
                console.log(test);
            });

            // Darktriad analysis
            const darktriadAnalysis = install.querySelector("#analyzeDarktriad");
            darktriadAnalysis.addEventListener('click', () => {

            });


            // Personality analysis (Big Five)
            const bigfiveAnalysis = install.querySelector("#analyzePersonality");
            bigfiveAnalysis.addEventListener('click', () => {

            });

            // Personality analysis (Big Five)
            const genderPrediction = install.querySelector("#analyzeGender");
            genderPrediction.addEventListener('click', () => {

            });

            // Personality analysis (Big Five)
            const temporalOrientation = install.querySelector("#analyzeTemporalOrientation");
            genderPrediction.addEventListener('click', () => {

            });





            // -------- Calculate average scores ----------
            // Calculate average score of each contact

            // Calculate average score of the user per contact



            // -------- Get contact names ----------
            // Get contact names
            const getContactNames = install.querySelector("#getContactNames");
            getContactNames.addEventListener('click', () => {

                sms.findContactsName(smsData).then((smsDataWithNames) => {
                    smsData = smsDataWithNames; // on récupère le même json mais avec les noms en plus
                }, (error) => {
                    console.error(error);
                });

                console.group("Get contact names");
                console.log(smsData);
                console.groupEnd();
            });




            // -------- Get meta data from the installation ----------
            // Get current date/hour

            // Get last SMS ids

            // Add average scores to metadata


        }

        console.log(localStorage);

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
