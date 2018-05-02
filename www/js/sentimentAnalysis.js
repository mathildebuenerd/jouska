"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var darktriad = require("./../../hooks/darktriad");
var bigfive = require("./../../hooks/bigfive");
var predictgender = require("./../../hooks/predictgender");
var prospectimo = require("./../../hooks/prospectimo");
var translate = require("./../../hooks/translate");
translate.from = "fr";
var TextAnalysis = (function () {
    function TextAnalysis() {
    }
    TextAnalysis.prototype.translate = function (sentence) {
        return translate(sentence);
    };
    TextAnalysis.prototype.sentimentAnalysis = function (sentence, language) {
        if (language === void 0) { language = 'en'; }
    };
    TextAnalysis.prototype.darktriadAnalysis = function (sentence, language) {
        if (language === void 0) { language = 'en'; }
        return darktriad(sentence);
    };
    TextAnalysis.prototype.personalityAnalysis = function (sentence, language) {
        if (language === void 0) { language = 'en'; }
        return bigfive(sentence);
    };
    TextAnalysis.prototype.genderPrediction = function (sentence, language) {
        if (language === void 0) { language = 'en'; }
        return predictgender(sentence);
    };
    TextAnalysis.prototype.temporalOrientationPrediction = function (sentence, language) {
        if (language === void 0) { language = 'en'; }
        return prospectimo(sentence);
    };
    return TextAnalysis;
}());
exports.TextAnalysis = TextAnalysis;
//# sourceMappingURL=sentimentAnalysis.js.map