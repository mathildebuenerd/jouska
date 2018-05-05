import * as getData from "./getData";
const installation = new getData.Installation();
import * as score from "./calculateScores";
const calculate = new score.CalculateScore();
import set = Reflect.set;




export class CordovaApp {
    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    }

    onDeviceReady() {

        // s'il n'y a pas de smsData, ça veut dire qu'on a pas encore installé l'application
        if (localStorage.getItem('smsData') === null) {
            installation.start();
        }

        let myscore = calculate.scoreWithContact('0675611341', 'sent');
        let momscore = calculate.scoreWithContact('0675611341', 'inbox');
        let clemence = calculate.scoreWithContact('0783094512', 'inbox');
        let samy = calculate.scoreWithContact('0638768915', 'inbox');

        console.group("Résultats des scores");
        console.log('my score:');
        console.log(myscore);
        console.log('mom score:');
        console.log(momscore);
        console.log('clemence:');
        console.log(clemence);
        console.log('samy:');
        console.log(samy);
        console.groupEnd();




    }

}

let instance = new CordovaApp();
