/**
 * Created by mathi on 16/04/2018.
 */

import * as ml from "./../../hooks/ml-sentiment";
import * as darktriad from "./../../hooks/darktriad";
import * as bigfive from "./../../hooks/bigfive";
import * as predictgender from "./../../hooks/predictgender";
import * as prospectimo from "./../../hooks/prospectimo";
import * as translate from "./../../hooks/translate";



translate.from = "fr";

export class TextAnalysis {

    public translate(sentence: string) {
        return translate(sentence);
    }

    public sentimentAnalysis(sentence: string, language: string = 'en') {
        const sentiment = ml({lang:'en'}); // par défaut on met en anglais, mais le package permet aussi d'analyser l'allemand
        return sentiment.classify(sentence);
    }

    public darktriadAnalysis(sentence: string, language: string = 'en') {
        return darktriad(sentence);
    }

    public personalityAnalysis(sentence: string, language: string = 'en') {
        return bigfive(sentence);
    }

    public genderPrediction(sentence: string, language: string = 'en') {
        return predictgender(sentence);
    }

    public temporalOrientationPrediction(sentence: string, language: string = 'en') {
        return prospectimo(sentence);
    }


}
