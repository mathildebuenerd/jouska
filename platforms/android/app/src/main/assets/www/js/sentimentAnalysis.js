"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sentiment = require("./../../hooks/node-sentiment");
var darktriad = require("./../../hooks/darktriad");
var bigfive = require("./../../hooks/bigfive");
var predictgender = require("./../../hooks/predictgender");
var prospectimo = require("./../../hooks/prospectimo");
var TextAnalysis = (function () {
    function TextAnalysis() {
    }
    TextAnalysis.extractClauses = function (sentence) {
        var sentenceToSlice = sentence;
        var separators = new RegExp(/[.?!,]\s| et | and /, 'gim');
        var array;
        var subSentences = [];
        while ((array = separators.exec(sentenceToSlice)) !== null) {
            var subSentence = sentenceToSlice.slice(0, array.index);
            subSentences.push(subSentence);
            sentenceToSlice = sentenceToSlice.replace(subSentence, '');
        }
        if (subSentences.length > 1) {
            return subSentences;
        }
        else {
            return sentence;
        }
    };
    TextAnalysis.prototype.sentimentAnalysis = function (textMessage, language, originalMessage) {
        if (language === void 0) { language = 'en'; }
        if (originalMessage === void 0) { originalMessage = textMessage; }
        var message = TextAnalysis.extractClauses(textMessage);
        if (Array.isArray(message)) {
            var analysis = [];
            for (var clause in message) {
                analysis.push(sentiment(message[clause], language, originalMessage));
            }
            return analysis;
        }
        else {
            return sentiment(message, language, originalMessage);
        }
    };
    TextAnalysis.prototype.darktriadAnalysis = function (textMessage, language) {
        if (language === void 0) { language = 'en'; }
        return darktriad(textMessage);
    };
    TextAnalysis.prototype.personalityAnalysis = function (textMessage, language) {
        if (language === void 0) { language = 'en'; }
        return bigfive(textMessage);
    };
    TextAnalysis.prototype.genderPrediction = function (textMessage, language) {
        if (language === void 0) { language = 'en'; }
        return predictgender(textMessage);
    };
    TextAnalysis.prototype.temporalOrientationPrediction = function (textMessage, language) {
        if (language === void 0) { language = 'en'; }
        return prospectimo(textMessage);
    };
    return TextAnalysis;
}());
exports.TextAnalysis = TextAnalysis;
//# sourceMappingURL=sentimentAnalysis.js.map