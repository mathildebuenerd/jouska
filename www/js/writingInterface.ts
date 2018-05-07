/**
 * Created by mathi on 05/05/2018.
 */
import * as SMS from "./manageSMS";
import getPrototypeOf = Reflect.getPrototypeOf;
const sms = new SMS.SMSManager();
import {TextAnalysis} from "./sentimentAnalysis";
const textAnalysis: TextAnalysis = new TextAnalysis();


export class WritingInterface {


    startAssistance() {
        const textArea = <HTMLTextAreaElement>document.querySelector('#smsContent');
        textArea.addEventListener('keyup', this.analyzeText); // keypress ne fontionne pas avec le clavier android, il faut utiliser keyup
    }


    analyzeText() {

        const language = 'fr';
        console.group('Analyze text');
        const textArea = <HTMLTextAreaElement>document.querySelector('#smsContent');
        const text = textArea.value;
        console.log(`text: ${text}`);
        const allWordsExceptLast = new RegExp(/.+ /, 'gim'); // récupère tous les mots suivits d'un espace (tous sauf celui qui est en train d'être écrit)
        const sentence = text.match(allWordsExceptLast); // match renvoie un tableau de correspondances, mais avec la regex il n'est sensé renvoyer qu'un seul tableau
        const letters = new RegExp(/[a-z]/, 'i');

        if (letters.test(sentence[0])) { // sentence[0] est parfois égal à plein d'espaces ('     '), pour être sûr qu'il y a bien du texte, on vérifie qu'il y ai une lettre
            console.log(`Sentence existe, voici son analyse:`);

            console.log(textAnalysis.sentimentAnalysis(sentence[0], language));

            // const languages = sms.detectLanguage(String(sentence));
            // console.log(`languages: `);
            // console.log(languages);
        } else {
            console.log(`sentence n'existe pas, elle est égale à ${sentence} et est de type ${typeof sentence}`);
        }
        console.groupEnd();






    }


}