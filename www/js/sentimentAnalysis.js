"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sentiment = require("./../../hooks/sentiment-multilang");
var darktriad = require("./../../hooks/darktriad");
var translate = require("./../../hooks/translate");
translate.from = "fr";
var SentimentAnalysis = (function () {
    function SentimentAnalysis(language) {
        this.language = language;
    }
    SentimentAnalysis.prototype.translate = function (sentence) {
        return translate(sentence);
    };
    SentimentAnalysis.prototype.analyze = function (sentence, language) {
        if (language === 'en') {
            var sentimentanalysis = sentiment(sentence, 'en');
            var testTriad = darktriad(sentence);
            return {
                sentiment: sentimentanalysis,
                triad: testTriad
            };
        }
        else if (language === 'fr') {
            var sentimentfrench = sentiment(sentence, 'fr');
            return {
                sentiment: sentimentfrench
            };
        }
    };
    return SentimentAnalysis;
}());
exports.SentimentAnalysis = SentimentAnalysis;
//# sourceMappingURL=sentimentAnalysis.js.map