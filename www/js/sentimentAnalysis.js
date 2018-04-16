"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sentiment = require("./../../hooks/sentiment-multilang");
var darktriad = require("./../../hooks/darktriad");
var SentimentAnalysis = (function () {
    function SentimentAnalysis(language) {
        this.language = language;
    }
    SentimentAnalysis.prototype.analyze = function (sentence) {
        var test = sentiment(sentence, this.language);
        if (this.language === 'en') {
            var testTriad = darktriad(sentence);
            console.log('darktriad');
            console.log(testTriad);
        }
        else {
            console.log("darktriad only works with the english language");
        }
        console.log(test);
        console.log('analyse');
    };
    return SentimentAnalysis;
}());
exports.SentimentAnalysis = SentimentAnalysis;
//# sourceMappingURL=sentimentAnalysis.js.map