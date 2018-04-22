/**
 * Created by mathi on 16/04/2018.
 */

import * as sentiment from "./../../hooks/sentiment-multilang";
import * as darktriad from "./../../hooks/darktriad";
import * as translate from "./../../hooks/translate";

translate.from = "fr";

export class SentimentAnalysis {
    language: string;
    constructor(language: string) {
        this.language = language;
    }

    public translate(sentence: string) {
        return translate(sentence);
    }

    public analyze(sentence: string, language: string) {

        if (language === 'en') {
            let sentimentanalysis = sentiment(sentence, 'en');
            let testTriad = darktriad(sentence);
            return {
                sentence: sentence,
                sentiment: sentimentanalysis,
                triad: testTriad
            };
        } else if (language === 'fr') {
            let sentimentfrench = sentiment(sentence, 'fr');
            return {
                sentence: sentence,
                sentiment: sentimentfrench
            };
        }

    }


}
