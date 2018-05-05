/**
 * Created by mathi on 16/04/2018.
 */

import * as sentiment from "./../../hooks/sentiment-multilang";
import * as darktriad from "./../../hooks/darktriad";
import * as translate from "./../../hooks/translate";

translate.key = "AIzaSyBYwKXPMsTG4zJpXt9-p2_NwDGR-A0NP9U";
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
                sentiment: sentimentanalysis,
                triad: testTriad
            };
        } else if (language === 'fr') {
            let sentimentfrench = sentiment(sentence, 'fr');
            return {
                sentiment: sentimentfrench
            };
        }

    }


}
