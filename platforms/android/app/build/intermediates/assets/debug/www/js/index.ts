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
                    console.group(`Get received messages (inbox)`);
                    console.log('smsData: ');
                    console.log(smsData);
                    console.groupEnd();
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
                    console.group(`Get sent messages`);
                    console.log('smsData: ');
                    console.log(smsData);
                    console.groupEnd();
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
                for (const contact in smsData) {
                    for (const type in smsData[contact]) { // type = inbox | sent | name
                        if (type !== 'name') { // on ne boucle que dans inbox et sent
                            for (const singleSMS in smsData[contact][type]) {
                                const englishSMS = smsData[contact][type][singleSMS].text.en;
                                smsData[contact][type][singleSMS].analysis = {}; // on initialise
                                smsData[contact][type][singleSMS].analysis.sentiment = {};
                                smsData[contact][type][singleSMS].analysis.sentiment = textAnalysis.sentimentAnalysis(englishSMS);
                            }
                        }
                    }
                }

                console.group(`Sentiment analysis`);
                console.log('smsData: ');
                console.log(smsData);
                console.groupEnd();
                // console.log(textAnalysis.sentimentAnalysis('😊', 'en'));
            });

            // Darktriad analysis
            const darktriadAnalysis = install.querySelector("#analyzeDarktriad");
            darktriadAnalysis.addEventListener('click', () => {
                for (const contact in smsData) {
                    for (const type in smsData[contact]) { // type = inbox | sent | name
                        if (type !== 'name') { // on ne boucle que dans inbox et sent
                            for (const singleSMS in smsData[contact][type]) {
                                const englishSMS = smsData[contact][type][singleSMS].text.en;
                                smsData[contact][type][singleSMS].analysis.darktriad = {};
                                smsData[contact][type][singleSMS].analysis.darktriad = textAnalysis.darktriadAnalysis(englishSMS);
                            }
                        }
                    }
                }

                console.group(`Dark triad`);
                console.log('smsData: ');
                console.log(smsData);
                console.groupEnd();
            });


            // Personality analysis (Big Five)
            const bigfiveAnalysis = install.querySelector("#analyzePersonality");
            bigfiveAnalysis.addEventListener('click', () => {
                for (const contact in smsData) {
                    for (const type in smsData[contact]) { // type = inbox | sent | name
                        if (type !== 'name') { // on ne boucle que dans inbox et sent
                            for (const singleSMS in smsData[contact][type]) {
                                const englishSMS = smsData[contact][type][singleSMS].text.en;
                                smsData[contact][type][singleSMS].analysis.bigfive = {};
                                smsData[contact][type][singleSMS].analysis.bigfive = textAnalysis.personalityAnalysis(englishSMS);
                            }
                        }
                    }
                }
                console.group(`Big Five`);
                console.log('smsData: ');
                console.log(smsData);
                console.groupEnd();
            });

            // Personality analysis (Big Five)
            const genderPrediction = install.querySelector("#analyzeGender");
            genderPrediction.addEventListener('click', () => {
                for (const contact in smsData) {
                    for (const type in smsData[contact]) { // type = inbox | sent | name
                        if (type !== 'name') { // on ne boucle que dans inbox et sent
                            for (const singleSMS in smsData[contact][type]) {
                                const englishSMS = smsData[contact][type][singleSMS].text.en;
                                smsData[contact][type][singleSMS].analysis.gender = {};
                                smsData[contact][type][singleSMS].analysis.gender = textAnalysis.genderPrediction(englishSMS);
                            }
                        }
                    }
                }
                console.group(`Gender prediction`);
                console.log('smsData: ');
                console.log(smsData);
                console.groupEnd();
            });

            // Personality analysis (Big Five)
            const temporalOrientation = install.querySelector("#analyzeTemporalOrientation");
            temporalOrientation.addEventListener('click', () => {
                for (const contact in smsData) {
                    for (const type in smsData[contact]) { // type = inbox | sent | name
                        if (type !== 'name') { // on ne boucle que dans inbox et sent
                            for (const singleSMS in smsData[contact][type]) {
                                const englishSMS = smsData[contact][type][singleSMS].text.en;
                                smsData[contact][type][singleSMS].analysis.temporalOrientation = {};
                                smsData[contact][type][singleSMS].analysis.temporalOrientation = textAnalysis.temporalOrientationPrediction(englishSMS);
                            }
                        }
                    }
                }
                console.group(`Temporal Orientation`);
                console.log('smsData: ');
                console.log(smsData);
                console.groupEnd();
            });




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


            // -------- Add to localStorage ----------
            // Add to localStorage
            const addToLocalStorage = install.querySelector('#addToLocalStorage');
            addToLocalStorage.addEventListener('click', () => {
                console.group("Finalisation de l'installation");
                console.log("Final sms data: ");
                console.log(smsData);
                localStorage.setItem('smsData', JSON.stringify(smsData));
                console.log(`Local storage: `);
                console.log(localStorage);
                console.groupEnd();
            });






            // -------- Get meta data from the installation ----------
            // Get current date/hour
            const getCurrentDate = install.querySelector("#getCurrentDate");
            getCurrentDate.addEventListener('click', () => {
                const today = new Date(); // on récupère la date d'installation
                console.log(typeof today);
                localStorage.setItem('installation', JSON.stringify(today));
            });



            // -------- Calculate average scores ----------
            // Calculate average score of each contact

            // Calculate average score of the user per contact


        }

    }

}

let instance = new CordovaApp();
