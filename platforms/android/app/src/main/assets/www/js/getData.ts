import {SMSManager} from "./manageSMS";
import {TextAnalysis} from "./sentimentAnalysis";
import * as translate from "./../../hooks/translate";


const sms: SMSManager = new SMSManager();
const textAnalysis: TextAnalysis = new TextAnalysis();
let smsData: any = {};

export class Installation {

    start() {

        const install = <HTMLElement>document.querySelector("#installTheApp");
        install.style.display = 'block';

        // get HTML elements
        const getReceivedMessagesButton = install.querySelector("#getReceivedMessages");
        const getSentMessagesButton = document.querySelector("#getSentMessages");
        const translateToEnglishButton = install.querySelector("#translateMessages");
        const sentimentAnalysisButton = install.querySelector("#analyzeSentiment");
        const darktriadAnalysisButton = install.querySelector("#analyzeDarktriad");
        const bigfiveAnalysisButton = install.querySelector("#analyzePersonality");
        const genderPredictionButton = install.querySelector("#analyzeGender");
        const temporalOrientationButton = install.querySelector("#analyzeTemporalOrientation");
        const getContactNamesButton = install.querySelector("#getContactNames");
        const addToLocalStorageButton = install.querySelector('#addToLocalStorage');
        const getCurrentDateButton = install.querySelector("#getCurrentDate");


        // Add listeners

        // -------- Get text messages ----------
        // Get received messages
        getReceivedMessagesButton.addEventListener('click', this.getReceivedMessages);
        // Get sent messages
        getSentMessagesButton.addEventListener('click', this.getSentMessages);

        // -------- Translate to english ----------
        // Translate messages
        translateToEnglishButton.addEventListener('click', this.translateToEnglish);

        // -------- Analyze text content ----------
        // Sentiment analysis
        sentimentAnalysisButton.addEventListener('click', this.sentimentAnalysis);
        // Darktriad analysis
        darktriadAnalysisButton.addEventListener('click', this.darktriadAnalysis);
        // Personality analysis (Big Five)
        bigfiveAnalysisButton.addEventListener('click', this.bigfiveAnalysis);
        // Gender prediction
        genderPredictionButton.addEventListener('click', this.genderAnalysis);
        // Temporal orientation
        temporalOrientationButton.addEventListener('click', this.temporalOrientationAnalysis);

        // -------- Get contact names ----------
        // Get contact names
        getContactNamesButton.addEventListener('click', this.getContactNames);

        // -------- Add to localStorage ----------
        // Add to localStorage
        addToLocalStorageButton.addEventListener('click', this.addToLocalStorage);

        // -------- Get meta data from the installation ----------
        // Get current date/hour
        getCurrentDateButton.addEventListener('click', this.getCurrentDate);



    }

    getReceivedMessages() {
        sms.getAllSMS({
            box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
            //   indexFrom : 0, // start from index 0
            maxCount: 10000, // count of SMS to return each time
        }).then(allSMS => {
            smsData = allSMS;
            console.group(`Get received messages (inbox)`);
            console.log('smsData: ');
            console.log(smsData);
            console.groupEnd();
        }).catch(
            error => console.error("la promesse concernant getAllSMS a échoué")
        );


    }

    getSentMessages() {
        sms.getAllSMS({
            box: 'sent', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
            //   indexFrom : 0, // start from index 0
            maxCount: 10000, // count of SMS to return each time
        }).then(allSMS => {
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
    }

    translateToEnglish() {
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
    }

    sentimentAnalysis() {
        for (const contact in smsData) {
            for (const type in smsData[contact]) { // type = inbox | sent | name
                if (type !== 'name') { // on ne boucle que dans inbox et sent
                    for (const singleSMS in smsData[contact][type]) {
                        const englishSMS = smsData[contact][type][singleSMS].text.en;
                        smsData[contact][type][singleSMS].analysis = {}; // on initialise
                        smsData[contact][type][singleSMS].analysis.sentiment = {};
                        smsData[contact][type][singleSMS].analysis.sentiment = textAnalysis.sentimentAnalysis(englishSMS, 'en');
                    }
                }
            }
        }

        console.group(`Sentiment analysis`);
        console.log('smsData: ');
        console.log(smsData);
        console.groupEnd();
    }

    darktriadAnalysis() {
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
    }

    bigfiveAnalysis() {
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
    }

    genderAnalysis() {
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
    }

    temporalOrientationAnalysis() {
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
    }

    getContactNames() {
        sms.findContactsName(smsData).then((smsDataWithNames) => {
            smsData = smsDataWithNames; // on récupère le même json mais avec les noms en plus
        }, (error) => {
            console.error(error);
        });

        console.group("Get contact names");
        console.log(smsData);
        console.groupEnd();
    }

    addToLocalStorage() {
        console.group("Finalisation de l'installation");
        console.log("Final sms data: ");
        console.log(smsData);
        localStorage.setItem('smsData', JSON.stringify(smsData));
        console.log(`Local storage: `);
        console.log(localStorage);
        console.groupEnd();
    }

    getCurrentDate() {
        const today = new Date(); // on récupère la date d'installation
        console.log(typeof today);
        localStorage.setItem('installation', JSON.stringify(today));
    }

}
