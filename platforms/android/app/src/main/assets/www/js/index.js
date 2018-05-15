"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getData = require("./getData");
var installation = new getData.Installation();
var score = require("./calculateScores");
var calculate = new score.CalculateScore();
var writingInterface = require("./writingInterface");
var writingAssistant = new writingInterface.WritingInterface();
var translate = require("./../../hooks/translate");
var keys = require("./apiKeys");
var sentimentAnalysis_1 = require("./sentimentAnalysis");
var text = new sentimentAnalysis_1.TextAnalysis();
var Keys = new keys.Keys();
translate.key = Keys.API_KEY;
translate.from = 'fr';
var CordovaApp = (function () {
    function CordovaApp() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }
    CordovaApp.prototype.onDeviceReady = function () {
        if (localStorage.getItem('smsData') === null) {
            installation.start();
        }
        var smsData = JSON.parse(localStorage.getItem('smsData'));
        for (var contact in smsData) {
            for (var type in smsData[contact]) {
                if (type !== 'name') {
                    for (var singleSMS in smsData[contact][type]) {
                        var englishSMS = smsData[contact][type][singleSMS].text.en;
                        var originalSMS = smsData[contact][type][singleSMS].text.original;
                        smsData[contact][type][singleSMS].analysis.sentiment = {};
                        smsData[contact][type][singleSMS].analysis.sentimentFr = {};
                        smsData[contact][type][singleSMS].analysis.sentimentFr = text.sentimentAnalysis(originalSMS, 'fr');
                        smsData[contact][type][singleSMS].analysis.sentiment = text.sentimentAnalysis(englishSMS, 'en', originalSMS);
                    }
                }
            }
        }
        console.log("smsData:");
        console.log(smsData);
        document.querySelector('#addThisToStorage').addEventListener('click', function () {
            var str = JSON.stringify(smsData);
            localStorage.setItem('smsData', str);
            console.log(localStorage);
        });
        for (var contact in smsData) {
            for (var type in smsData[contact]) {
                if (type !== 'name') {
                    for (var singleSMS in smsData[contact][type]) {
                        var analysis = smsData[contact][type][singleSMS].analysis;
                        var englishSMS = smsData[contact][type][singleSMS].text.en;
                        var bigfive_m = text.personalityAnalysis(englishSMS, { "output": "matches" });
                        analysis.bigfive = {};
                        analysis.bigfive.O = {};
                        analysis.bigfive.C = {};
                        analysis.bigfive.E = {};
                        analysis.bigfive.A = {};
                        analysis.bigfive.N = {};
                        for (var personalityTrait in bigfive_m) {
                            analysis.bigfive[personalityTrait].score = 0;
                            analysis.bigfive[personalityTrait].words = [];
                            for (var word in bigfive_m[personalityTrait].matches) {
                                analysis.bigfive[personalityTrait].score += bigfive_m[personalityTrait].matches[word][3];
                                analysis.bigfive[personalityTrait].words.push(bigfive_m[personalityTrait].matches[word][0]);
                            }
                        }
                    }
                }
            }
        }
        console.log("smsData apr\u00E8s bigfive:");
        console.log(smsData);
        var myscore = calculate.scoreWithContact('0675611341', 'sent');
        var momscore = calculate.scoreWithContact('0675611341', 'inbox');
        var wordsMom = calculate.getMostUsedWords("positive", "0783094512", "inbox", "fr");
        var wordsMe = calculate.getMostUsedWords("positive", "0783094512", "sent", "fr");
        var wordsMomNeg = calculate.getMostUsedWords("negative", "0783094512", "inbox", "fr");
        var wordsMeNeg = calculate.getMostUsedWords("negative", "0783094512", "sent", "fr");
        console.log("wordsMe:");
        console.log(wordsMe);
        console.log("wordsMom:");
        console.log(wordsMom);
        console.log("wordsMeNeg:");
        console.log(wordsMeNeg);
        console.log("wordsMomNeg:");
        console.log(wordsMomNeg);
        console.log('my score:');
        console.log(myscore);
        console.log('mom score:');
        console.log(momscore);
        writingAssistant.startAssistance();
    };
    return CordovaApp;
}());
exports.CordovaApp = CordovaApp;
var instance = new CordovaApp();
//# sourceMappingURL=index.js.map