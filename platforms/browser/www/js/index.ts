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
import * as dataV from "./datavisualisation";
const DataVis = new dataV.Datavisualisation();
const Keys = new keys.Keys();
translate.key = Keys.API_KEY;
translate.from ='fr';


import "./../../hooks/p5";

export class CordovaApp {
    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }

    onDeviceReady() {

        // DataVis.testp5();

        new p5( function(monSketch) {

            let x = 100;
            let y = 100;

            monSketch.setup = function() {
                monSketch.createCanvas(700, 410);
            };

            monSketch.draw = function() {
                monSketch.background(0);
                monSketch.fill(255);
                monSketch.rect(x,y,50,50);
            };
        });

        // localStorage.removeItem('smsData');

        // s'il n'y a pas de smsData, ça veut dire qu'on a pas encore installé l'application
        // if (localStorage.getItem('smsData') === null) {
        //     installation.start();
        // }



        // let smsData = JSON.parse(localStorage.getItem('smsData'));

        // DataVis.getWords("positive", "0675611341", "inbox", "fr");
        // DataVis.getWords("negative", "0675611341", "inbox", "fr");
        // DataVis.getWords("positive", "0783094512", "inbox", "fr");
        // DataVis.getWords("negative", "0783094512", "inbox", "fr");
        //------------------------------------------------------------------------
        // DataVis.bigFiveGraph("0675611341", "inbox");





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


        // document.querySelector('#addThisToStorage').addEventListener('click', () => {
        //     let str = JSON.stringify(smsData);
        //     // localStorage.removeItem('allSMS');
        //     // localStorage.removeItem('allSMSanalyzed');
        //     localStorage.setItem('smsData', str);
        //     console.log(localStorage);
        // });




        //text.updateSentimentAnalysis();


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

        // let myscore = calculate.scoreWithContact('0675611341', 'sent');
        // console.log('my score:');
        // console.log(myscore);
        //
        // let wordsMom = calculate.getMostUsedWords("positive", "0675611341", "inbox", "fr");
        // console.log(`wordsMom:`);
        // console.log(wordsMom);






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


        // let momscore = calculate.scoreWithContact('0675611341', 'inbox');
        // let clemence = calculate.scoreWithContact('0783094512', 'inbox');
        // let samy = calculate.scoreWithContact('0638768915', 'inbox');

        // let wordsMe = calculate.getMostUsedWords("positive", "0675611341", "sent", "fr");
        // let wordsMomNeg = calculate.getMostUsedWords("negative", "0675611341", "inbox", "fr");
        // let wordsMeNeg = calculate.getMostUsedWords("negative", "0675611341", "sent", "fr");
        //
        // console.log(`wordsMe:`);
        // console.log(wordsMe);

        // console.log(`wordsMeNeg:`);
        // console.log(wordsMeNeg);
        // console.log(`wordsMomNeg:`);
        // console.log(wordsMomNeg);

        //
        // console.group("Résultats des scores");

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
