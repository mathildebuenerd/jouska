/**
 * Created by mathi on 05/05/2018.
 */
import * as _SMS from "./manageSMS";
import getPrototypeOf = Reflect.getPrototypeOf;
const sms = new _SMS.SMSManager();
import {TextAnalysis} from "./sentimentAnalysis";
const textAnalysis: TextAnalysis = new TextAnalysis();
// import * as {SMSMa} from "./manageSMS";
import * as getData from "./getData"; // on récupère la fonction translate qu'on utilise lors de l'installation de l'app
const ManageData = new getData.Installation();

declare const SMS: any;


export class WritingInterface {

    colors: object;
    tempSentences: Array<string>;

    constructor() {
        this.colors = {
            "a5f31b": 8,
            "a4ed2b": 7,
            "a2e739": 6,
            "a1dc52": 5,
            "a1d16b": 4,
            "a1c087": 3,
            "a1b595": 2,
            "a1a69f": 1,
            "a39ba1": 0,
            "ae849b": -1,
            "b57794": -2,
            "c26185": -3,
            "cf4c74": -4,
            "db3863": -5,
            "e82551": -6,
            "f21542": -7,
            "fb0736": -8
        };
        this.tempSentences = ["", ""]; // on utilise cette variable pour optimiser l'usage de le fonction de traduction. On stocke la dernière phrase traduite dedans, et on checke ensuite chaque fois qu'une touche est pressée pour comparer et voir s'il y a un mot supplémentaire
    }

    startAssistance= () => {

        const textArea = <HTMLElement>document.querySelector('#smsContent');
        textArea.addEventListener('keyup', this.analyzeText); // keypress ne fontionne pas avec le clavier android, il faut utiliser keyup

        const sendButton = <HTMLElement>document.querySelector('#sendMessage');
        sendButton.addEventListener('click', this.sendMessage);
    };

    public changeSidebarColor= (barSelector: string, color: string) => {
        let sidebar = <HTMLElement>document.querySelector(`#${barSelector} .fill`);
        sidebar.style.backgroundColor = '#' + color;
    };

    public getColor= (object: object, value: number): string => {
        if (value > 8) {
            value = 8;
        } else if (value < -8) {
            value = -8;
        }
        return Object.keys(object).find(key => object[key] === value);
    };

    getSentence= (): string => {

        const textArea = <HTMLElement>document.querySelector('#smsContent'); // c'est pas un textArea mais un bloc avec contenteditable
        const text = textArea.textContent;
        const allWords = new RegExp(/.+/, 'gim'); // récupère tous les mots
        const sentence = text.match(allWords);
        const letters = new RegExp(/\S/, 'gi');

        // sentence[0] est parfois égal à plein d'espaces ('     '), pour être sûr qu'il y a bien du texte, on vérifie qu'il y ai une lettre
        if (letters.test(sentence[0])) {
            return sentence[0]; // match renvoie un tableau de correspondances, mais avec la regex il n'est sensé renvoyer qu'un seul tableau
        } else {
            console.warn(`sentence n'existe pas, elle est égale à ${sentence} et est de type ${typeof sentence}`);
        }
    };

    showFeedback= (analysis: object, type: string) => {

        let score = 0;

        if (analysis['score'] !== undefined) {
            score += analysis['score'];
        } else {
            for (const object in analysis) {
                console.log(`score ${type}: ${analysis[object]['score']}`);
                score += analysis[object]['score'];
            }
        }

        let color = this.getColor(this.colors, score);
        this.changeSidebarColor(type, color);

        // if (analysis["negative"].length > 0) {
        //     // this.animateNegativeWords(analysis["negative"]);
        // }
    };

    public analyzeText=() => {

        const language = 'fr';
        let sentence = this.getSentence();


        if (sentence !== undefined) {
            // Analyses en français
            // sentence peut être undefined s'il y a trop peu de lettres
            const polarity = textAnalysis.sentimentAnalysis(sentence, language);
            this.showFeedback(polarity, "polarity");
            const selfish = textAnalysis.selfishnessAnalysis(sentence, language);
            this.showFeedback(selfish, "selfishness");

            // Analyses en anglais
            // Pour ces analyses, on traduit en anglais avant d'analyser
            // D'abord on récupère uniquement les mots entiers
            const ignoreLastWord = new RegExp(/.+[ !?,.:"]/, 'gim');
            // const test = sentence.split(" ");
            // console.log(`test: `, test);
            const allWordsExceptLast = sentence.match(ignoreLastWord); // match renvoie un tableau de correspondances, mais avec la regex il n'est sensé renvoyer qu'un seul tableau
            // console.log(`allwordsexc`, allWordsExceptLast);
            const wordsToAnalyze = String(allWordsExceptLast);

            this.tempSentences[1] = wordsToAnalyze;

            // Si ces deux valeurs sont différentes, c'est qu'il y a un mot de plus ou de moins
            if (this.tempSentences[1] !== this.tempSentences[0]) {
                console.log(`c'est different`, this.tempSentences[1], this.tempSentences[0]);
                this.tempSentences[0] = wordsToAnalyze;
                let promise = textAnalysis.translateToEnglish(wordsToAnalyze);
                console.log(`promise:`, promise);
                promise.then((englishSentence) => {
                    console.log(`english sentence: ${englishSentence}`);
                    const darktriad = textAnalysis.darktriadAnalysis(englishSentence);
                    console.log(`darktriad:`, darktriad);
                }).catch( (err) => console.log(err));
            } else {
                console.log(`c'est pareil!`);
            }



        }





        // this.analyzeSelfishness();
        // this.analyzeDarktriad();
        // this.analyzePersonality();


    };

    sliceWord(word: string, elmtClass: string): string {

        let tag = `<span class="${elmtClass}">`;
        for (let letter = 0; letter<word.length; letter++) {
            tag += `<span>${word[letter]}</span>`; // on ajoute chaque lettre entourée d'un span, comme ça on pourra les animer séparement
        }
        tag += `</span>`;
        return tag;
    }

    animateNegativeWords= (words: string[]) => {
        console.log(`words:`);
        console.log(words);
        const textArea = <HTMLElement>document.querySelector('#smsContent');
        for (const word in words) {
            let slicedWord = this.sliceWord(words[word], "negative");
            console.log(`slicedWord:`);
            console.log(slicedWord);
            console.log(`textarea.value: ${textArea.textContent}`);
            const toReplace = new RegExp(`${words[word]}`, 'gi');
            textArea.innerHTML = (textArea.textContent).replace(toReplace, slicedWord);
        }

        const wordsToAnimate = document.querySelectorAll(`.negative`);
        if (wordsToAnimate !== undefined) {
            for (const singleWord in wordsToAnimate) {
                let lettersToAnimate = wordsToAnimate[singleWord].querySelectorAll(`span`);
                for (const letter in lettersToAnimate) {
                    const aLetter = <HTMLElement>lettersToAnimate[letter];
                    const randomValue = Math.floor(Math.random()*3);// on a trois animations différentes
                    aLetter.style.animationName = `marionettes${randomValue}`;
                }
            }
        }

        // pour gérer les balises html dans contenteditable
        // https://stackoverflow.com/questions/41433796/html-elements-inside-contenteditable
        // const map = {amp: '&', lt: '<', gt: '>', quot: '"', '#039': "'"}
        // let html = textArea.innerHTML.replace(/&([^;]+);/g, (m, c) => map[c]);
        // textArea.innerHTML = html;

        // this.setEndOfContenteditable(textArea); // est sensé ramener le curseur à la fin de la ligne

    };

    setEndOfContenteditable= (contentEditableElement) => {
        let range,selection;
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    };

    sendMessage= () => {
        const recipientElement = <HTMLInputElement>document.querySelector('#contactNumber');
        const recipient = recipientElement.value;
        const messageElement = <HTMLTextAreaElement>document.querySelector('#smsContent');
        const message = messageElement.value;
        let confirmationMessage = document.querySelector('#confirmationMessage');

        SMS.sendSMS(recipient, message, () => {
            console.log(`sms envoyé! destinaire: ${recipient}; message: ${message}`);
            recipientElement.value = '';
            messageElement.value = '';
            confirmationMessage.textContent = "Message correctement envoyé :)";
        }, (err) => {
            confirmationMessage.textContent = "Il y a eu une erreur, le message n'est pas parti...";
            throw err;
        });

    };



}