/**
 * Created by mathi on 16/04/2018.
 */

import * as sentiment from "./../../hooks/sentiment-multilang";
import * as darktriad from "./../../hooks/darktriad";

export class SentimentAnalysis {
    language: string;
    constructor(language: string) {
        this.language = language;
    }

    public analyze(sentence: string) {
        let test = sentiment(sentence, this.language);
        if (this.language === 'en') {
            let testTriad = darktriad(sentence);
            console.log('darktriad');
            console.log(testTriad);
        } else {
            console.log("darktriad only works with the english language");
        }
        console.log(test);
        console.log('analyse');
    }


}
