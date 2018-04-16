"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sentiment = require("./../../hooks/sentiment-multilang");
var darktriad = require("./../../hooks/darktriad");
var translate = require("./../../hooks/translate");
translate.key = "";
translate.from = "fr";
var SentimentAnalysis = (function () {
    function SentimentAnalysis(language) {
        this.language = language;
    }
    SentimentAnalysis.prototype.analyze = function (sentence) {
        var englishSentence = translate(sentence).then(function (text) {
            console.log(text);
            var sentimentanalysis = sentiment(text, 'en');
            var testTriad = darktriad(text);
            console.log(sentimentanalysis);
            console.log(testTriad);
        });
        var sentimentfrench = sentiment(sentence, 'fr');
        console.log(sentimentfrench);
    };
    return SentimentAnalysis;
}());
exports.SentimentAnalysis = SentimentAnalysis;
//# sourceMappingURL=sentimentAnalysis.js.map