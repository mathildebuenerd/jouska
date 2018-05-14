import * as getData from "./getData";
const installation = new getData.Installation();
import * as score from "./calculateScores";
const calculate = new score.CalculateScore();
import * as writingInterface from "./writingInterface";
const writingAssistant = new writingInterface.WritingInterface();
import set = Reflect.set;

import * as translate from "./../../hooks/translate";
import * as keys from './apiKeys';
import {TextAnalysis} from "./sentimentAnalysis";
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

        // detect("Je viens demain").then(lang => {
        //     console.log(`lang: ${lang}`);
        // });

        let myscore = calculate.scoreWithContact('0675611341', 'sent');
        let momscore = calculate.scoreWithContact('0675611341', 'inbox');
        // let clemence = calculate.scoreWithContact('0783094512', 'inbox');
        // let samy = calculate.scoreWithContact('0638768915', 'inbox');

        let wordsMom = calculate.getMostUsedWords("positive", "0675611341", "inbox", "fr");
        let wordsMe = calculate.getMostUsedWords("positive", "0675611341", "sent", "fr");

        console.log(`wordsMe:`);
        console.log(wordsMe);
        console.log(`wordsMom:`);
        console.log(wordsMom);


        // console.group("Résultats des scores");
        console.log('my score:');
        console.log(myscore);
        console.log('mom score:');
        console.log(momscore);
        // console.log('clemence:');
        // console.log(clemence);
        // console.log('samy:');
        // console.log(samy);
        // console.groupEnd();

        // let test = text.sentimentAnalysis("The team has just finished. So we can meet now?", "en");
        // console.log(`test:`);
        // console.log(test);

        // console.log(text.sentimentAnalysis())

        writingAssistant.startAssistance();




    }

}

let instance = new CordovaApp();
