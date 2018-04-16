/**
 * Created by mathi on 16/04/2018.
 */

import * as sentiment from "./../../hooks/sentiment-multilang";
import * as darktriad from "./../../hooks/darktriad";
import * as translate from "./../../hooks/translate";

translate.key = "";
translate.from = "fr";

export class SentimentAnalysis {
    language: string;
    constructor(language: string) {
        this.language = language;
    }

    public analyze(sentence: string) {
        let englishSentence = translate(sentence).then(text => {
            console.log(text);  // Hola mundo
            let sentimentanalysis = sentiment(text, 'en');
            let testTriad = darktriad(text);
            console.log(sentimentanalysis);
            console.log(testTriad);
        });

        let sentimentfrench = sentiment(sentence, 'fr');
        console.log(sentimentfrench);

    }


}
