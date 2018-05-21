import * as getData from "./getData";
const installation = new getData.Installation();
import * as score from "./calculateScores";
const calculate = new score.CalculateScore();
import * as writingInterface from "./writingInterface";
const writingAssistant = new writingInterface.WritingInterface();
import * as discussionThread from "./discussionThread";
const thread = new discussionThread.DiscussionThread();
import set = Reflect.set;

import * as translate from "./../../hooks/translate";
import * as keys from './apiKeys';
import {TextAnalysis} from "./sentimentAnalysis";
import {SMSManager} from "./manageSMS";
const sms = new SMSManager();
const text = new TextAnalysis();
const Keys = new keys.Keys();
translate.key = Keys.API_KEY;
translate.from ='fr';

export class CordovaApp {
    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    }

    onDeviceReady() {

        // localStorage.removeItem('smsData');

        // s'il n'y a pas de smsData, ça veut dire qu'on a pas encore installé l'application
        if (localStorage.getItem('smsData') === null) {
            installation.start();
        }



        let smsData = JSON.parse(localStorage.getItem('smsData'));

        // for (const contact in smsData) {
        //     for (const type in smsData[contact]) { // type = inbox | sent | name
        //         if (type !== 'name') { // on ne boucle que dans inbox et sent
        //             for (const singleSMS in smsData[contact][type]) {
        //                 smsData[contact][type][singleSMS].type = "";
        //                 smsData[contact][type][singleSMS].type = type;
        //             }
        //         }
        //     }
        // }

        console.log(`smsData:`);
        console.log(smsData);
        document.querySelector('#addThisToStorage').addEventListener('click', () => {
            let str = JSON.stringify(smsData);
            // localStorage.removeItem('allSMS');
            // localStorage.removeItem('allSMSanalyzed');
            localStorage.setItem('smsData', str);
            console.log(localStorage);
        });

        // for (const contact in smsData) {
        //     for (const type in smsData[contact]) { // type = inbox | sent | name
        //         if (type !== 'name') { // on ne boucle que dans inbox et sent
        //             for (const singleSMS in smsData[contact][type]) {
        //                 const originalSMS = smsData[contact][type][singleSMS].text.original;
        //                 smsData[contact][type][singleSMS].analysis.selfishness = {};
        //                 smsData[contact][type][singleSMS].analysis.selfishness = text.selfishnessAnalysis(originalSMS, 'fr');
        //             }
        //         }
        //     }
        // }

        console.log(`smsdata after slefish`);
        console.log(smsData);

        // thread.showContactThread("0675611341");

        // let scorePerDay = calculate.scorePerTime(smsData, "weekday");
        // let scorePerDate = calculate.scorePerTime(smsData, "day");
        // let scorePerMonth = calculate.scorePerTime(smsData, "month");
        // let scorePerMinutes = calculate.scorePerTime(smsData, "minutes");
        // let scorePerSeconds = calculate.scorePerTime(smsData, "seconds");
        //
        // console.log(`scorePerDay:`);
        // console.log(scorePerDay);
        // console.log(`scorePerDate:`);
        // console.log(scorePerDate);
        // console.log(`scorePerMonth:`);
        // console.log(scorePerMonth);
        // console.log(`scorePerMinutes:`);
        // console.log(scorePerMinutes);
        // console.log(`scorePerSeconds:`);
        // console.log(scorePerSeconds);






        // detect("Je viens demain").then(lang => {
        //     console.log(`lang: ${lang}`);
        // });

        // let contactScores = {};
        //
        // for (const contact in smsData) {
        //     contactScores[smsData[contact].name] = {
        //         "me": {},
        //         "you": {}
        //     };
        //     contactScores[smsData[contact].name].me = calculate.scoreWithContact(contact, "sent");
        //     contactScores[smsData[contact].name].you = calculate.scoreWithContact(contact, "inbox");
        // }
        //
        // console.log(`contactScores:`);
        // console.log(contactScores);


        // let myscore = calculate.scoreWithContact('0675611341', 'sent');
        // let momscore = calculate.scoreWithContact('0675611341', 'inbox');
        // let clemence = calculate.scoreWithContact('0783094512', 'inbox');
        // let samy = calculate.scoreWithContact('0638768915', 'inbox');

        // let wordsMom = calculate.getMostUsedWords("positive", "0675611341", "inbox", "fr");
        // let wordsMe = calculate.getMostUsedWords("positive", "0675611341", "sent", "fr");
        // let wordsMomNeg = calculate.getMostUsedWords("negative", "0675611341", "inbox", "fr");
        // let wordsMeNeg = calculate.getMostUsedWords("negative", "0675611341", "sent", "fr");
        //
        // console.log(`wordsMe:`);
        // console.log(wordsMe);
        // console.log(`wordsMom:`);
        // console.log(wordsMom);
        // console.log(`wordsMeNeg:`);
        // console.log(wordsMeNeg);
        // console.log(`wordsMomNeg:`);
        // console.log(wordsMomNeg);

        //
        // console.group("Résultats des scores");
        // console.log('my score:');
        // console.log(myscore);
        // console.log('mom score:');
        // console.log(momscore);
        // console.log('clemence:');
        // console.log(clemence);
        // console.log('samy:');
        // console.log(samy);
        // console.groupEnd();

        // let test = text.sentimentAnalysis("The team has just finished. So we can meet now?", "en");
        // console.log(`test:`);
        // console.log(test);

        // console.log(text.sentimentAnalysis())

        // writingAssistant.startAssistance();




    }

}

let instance = new CordovaApp();
