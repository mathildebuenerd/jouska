/**
 * Created by mathi on 05/05/2018.
 */
import * as _SMS from "./manageSMS";
import getPrototypeOf = Reflect.getPrototypeOf;
const sms = new _SMS.SMSManager();
import {TextAnalysis} from "./sentimentAnalysis";
const textAnalysis: TextAnalysis = new TextAnalysis();
// import * as {SMSMa} from "./manageSMS";

declare const SMS: any;


export class WritingInterface {

    startAssistance= () => {
        const textArea = <HTMLElement>document.querySelector('#smsContent');
        textArea.addEventListener('keyup', this.analyzeText); // keypress ne fontionne pas avec le clavier android, il faut utiliser keyup

        const sendButton = <HTMLElement>document.querySelector('#sendMessage');
        sendButton.addEventListener('click', this.sendMessage);
    };

    public changeSidebarColor= (color: string) => {
        let sidebar = <HTMLElement>document.querySelector('#feedback');
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

    public analyzeText=() => {
        const language = 'fr';
        const textArea = <HTMLElement>document.querySelector('#smsContent');
        const text = textArea.textContent;
        console.log(`text: ${text}`);
        const allWordsExceptLast = new RegExp(/.+/, 'gim'); // récupère tous les mots
        const sentence = text.match(allWordsExceptLast); // match renvoie un tableau de correspondances, mais avec la regex il n'est sensé renvoyer qu'un seul tableau
        const letters = new RegExp(/\S/, 'gi');

        if (letters.test(sentence[0])) { // sentence[0] est parfois égal à plein d'espaces ('     '), pour être sûr qu'il y a bien du texte, on vérifie qu'il y ai une lettre
            console.log(`Sentence existe, voici son analyse:`);

            // let analysis = {};
            let score = 0;
            let colors = {
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
            const analysis = textAnalysis.sentimentAnalysis(sentence[0], language);
            console.log(`analysis:`);
            console.dir(analysis);

            if (analysis['score'] !== undefined) {
                console.log(`analysis['score'] existe`);
                console.dir(analysis['score']);
                score += analysis['score'];
            } else {
                console.log(`analysis['score'] n'existe pas`);
                for (const object in analysis) {
                    console.dir(analysis[object]['score']);
                    score += analysis[object]['score'];
                }
            }
            console.log(`colors: ${colors}`);
            console.log(`score: ${score}`);
            let color = this.getColor(colors, score);
            this.changeSidebarColor(color);
            console.log(`score: ${score}`);

            if (analysis["negative"].length > 0) {
                console.log(`analysis.negative length > 0`);
                this.animateNegativeWords(analysis["negative"]);
            }


            // const languages = sms.detectLanguage(String(sentence));
            // console.log(`languages: `);
            // console.log(languages);
        } else {
            console.warn(`sentence n'existe pas, elle est égale à ${sentence} et est de type ${typeof sentence}`);
        }
    };

    animateNegativeWords= (words: string[]) => {
        console.log(`words:`);
        console.log(words);
        const textArea = <HTMLElement>document.querySelector('#smsContent');
        for (const word in words) {
            let slicedWord = `<span class="negative">`;
            for (let letter = 0; letter < words[word].length; letter++) {
                slicedWord += `<span>${words[word][letter]}</span>`; // on ajoute chaque lettre entourée d'un span, comme ça on pourra les animer séparement
            }
            slicedWord += `</span>`;
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