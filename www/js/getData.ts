import {SMSManager} from "./manageSMS";
import {TextAnalysis} from "./sentimentAnalysis";
import * as translate from "./../../hooks/translate";
import * as keys from './apiKeys';
const Keys = new keys.Keys();
translate.key = Keys.API_KEY;
translate.from ='fr';

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
        const selfishnessButton = install.querySelector("#analyzeSelfishness");
        const getContactNamesButton = install.querySelector("#getContactNames");
        const addToLocalStorageButton = install.querySelector('#addToLocalStorage');
        const mergeInboxAndSentMessagesButton = install.querySelector("#mergeInboxAndSentMessages");
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
        // Selfishness analysis
        selfishnessButton.addEventListener('click', this.selfishnessAnalysis);

        // -------- Get contact names ----------
        // Get contact names
        getContactNamesButton.addEventListener('click', this.getContactNames);

        // -------- Add to localStorage ----------
        // Add to localStorage
        addToLocalStorageButton.addEventListener('click', this.addToLocalStorage);

        // -------- We create another "database" for the messages in order to manipulate it more easily in the discussion thread
        mergeInboxAndSentMessagesButton.addEventListener('click', this.mergeInboxAndSentMessages);

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
                    console.log(smsData[contact][type][smsID].text.original);
                    translate(smsData[contact][type][smsID].text.original, {to: 'en'}).then(translatedText => {
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

        // analyse en anglais
        for (const contact in smsData) {
            for (const type in smsData[contact]) { // type = inbox | sent | name
                if (type !== 'name') { // on ne boucle que dans inbox et sent
                    for (const singleSMS in smsData[contact][type]) {
                        const englishSMS = smsData[contact][type][singleSMS].text.en;
                        const originalSMS = smsData[contact][type][singleSMS].text.original;
                        smsData[contact][type][singleSMS].analysis.sentiment = {};
                        smsData[contact][type][singleSMS].analysis.sentimentFr = {};
                        smsData[contact][type][singleSMS].analysis.sentimentFr = textAnalysis.sentimentAnalysis(originalSMS, 'fr');
                        smsData[contact][type][singleSMS].analysis.sentiment = textAnalysis.sentimentAnalysis(englishSMS, 'en', originalSMS)
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
        console.log(`L'analyse de la darktriad commence... Elle peut être un peu longue (plus d'une minute)`);
        for (const contact in smsData) {
            for (const type in smsData[contact]) { // type = inbox | sent | name
                if (type !== 'name') { // on ne boucle que dans inbox et sent
                    for (const singleSMS in smsData[contact][type]) {
                        const englishSMS = smsData[contact][type][singleSMS].text.en;
                        const analysis = smsData[contact][type][singleSMS].analysis;
                        const darktriad_m = textAnalysis.darktriadAnalysis(englishSMS, {"output": "matches"});
                        analysis.darktriad = {};
                        analysis.darktriad.machiavellianism = {};
                        analysis.darktriad.narcissism = {};
                        analysis.darktriad.psychopathy = {};
                        analysis.darktriad.triad = {};
                        for (const trait in darktriad_m) {// trait is machiavelllianism or narcissism or psychopathy or triad
                            analysis.darktriad[trait].score = 0;
                            analysis.darktriad[trait].words = {
                                "positive": [],
                                "negative": []
                            };
                            if (darktriad_m[trait] !== []) {
                                for (const word in darktriad_m[trait]) {
                                    analysis.darktriad[trait].score += darktriad_m[trait][word][3]; // word[3] c'est la valeur du mot
                                    if (darktriad_m[trait][word][3] > 0) { // le mot peut soit faire augmenter, soit faire baisser un certain trait de personnalité, il faut donc classifier les mots
                                        analysis.darktriad[trait].words.positive.push(darktriad_m[trait][word][0]); // word[0] c'est le mot qui a matché
                                    } else {
                                        analysis.darktriad[trait].words.negative.push(darktriad_m[trait][word][0]); // word[0] c'est le mot qui a matché
                                    }
                                }
                            }

                        }
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
                        const analysis = smsData[contact][type][singleSMS].analysis;
                        const englishSMS = smsData[contact][type][singleSMS].text.en;
                        const bigfive_m = textAnalysis.personalityAnalysis(englishSMS, {"output":"matches"});
                        analysis.bigfive = {};
                        analysis.bigfive.O = {};
                        analysis.bigfive.C = {};
                        analysis.bigfive.E = {};
                        analysis.bigfive.A = {};
                        analysis.bigfive.N = {};
                        for (const personalityTrait in bigfive_m) { // personality trait is 0 -C - E - A or N
                            analysis.bigfive[personalityTrait].score = 0;
                            analysis.bigfive[personalityTrait].words = {
                                "positive": [],
                                "negative": []
                            };

                            for (const word in bigfive_m[personalityTrait].matches) { // un match correspond à un mot repéré
                                analysis.bigfive[personalityTrait].score += bigfive_m[personalityTrait].matches[word][3]; // word[3] c'est la valeur du mot
                                if (bigfive_m[personalityTrait].matches[word][3] > 0) { // le mot peut soit faire augmenter, soit faire baisser un certain trait de personnalité, il faut donc classifier les mots
                                    analysis.bigfive[personalityTrait].words.positive.push(bigfive_m[personalityTrait].matches[word][0]); // word[0] c'est le mot qui a matché
                                } else {
                                    analysis.bigfive[personalityTrait].words.negative.push(bigfive_m[personalityTrait].matches[word][0]); // word[0] c'est le mot qui a matché
                                }

                            }
                        }
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

    selfishnessAnalysis() {

        for (const contact in smsData) {
            for (const type in smsData[contact]) { // type = inbox | sent | name
                if (type !== 'name') { // on ne boucle que dans inbox et sent
                    for (const singleSMS in smsData[contact][type]) {
                        const originalSMS = smsData[contact][type][singleSMS].text.original;
                        smsData[contact][type][singleSMS].analysis.selfishness = {};
                        smsData[contact][type][singleSMS].analysis.selfishness = textAnalysis.selfishnessAnalysis(originalSMS, 'fr');
                    }
                }
            }
        }

        console.group(`Sentiment analysis`);
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

    mergeInboxAndSentMessages = (): void => {

        const smsData = JSON.parse(localStorage.getItem('smsData'));

        const messages = {};

        for (const contact in smsData) {
            messages[contact] = {};
            let mergedMessages = {};
            for (const type in smsData[contact]) {
                if (type !== "name") {
                    for (const id in smsData[contact][type]) {
                        let tempSMS = smsData[contact][type][id];
                        tempSMS.name = "";
                        if (type === "inbox") {
                            tempSMS.name = smsData[contact]["name"];
                        } else {
                            tempSMS.name = "me";
                        }
                        mergedMessages[id] = tempSMS;
                    }
                }

            }
            messages[contact] = mergedMessages;
        }

        console.log("messages");
        console.log(messages);
        localStorage.setItem("smsList", JSON.stringify(messages));
        console.log(`localstorage:`);
        console.log(localStorage);

    }

}
