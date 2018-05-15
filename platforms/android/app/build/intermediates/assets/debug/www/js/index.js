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
                        var englishSMS = smsData[contact][type][singleSMS].text.en;
                        var analysis = smsData[contact][type][singleSMS].analysis;
                        var darktriad_m = text.darktriadAnalysis(englishSMS, { "output": "matches" });
                        analysis.darktriad = {};
                        analysis.darktriad.machiavellianism = {};
                        analysis.darktriad.narcissism = {};
                        analysis.darktriad.psychopathy = {};
                        analysis.darktriad.triad = {};
                        for (var trait in darktriad_m) {
                            analysis.darktriad[trait].score = 0;
                            analysis.darktriad[trait].words = {
                                "positive": [],
                                "negative": []
                            };
                            if (darktriad_m[trait] !== []) {
                                for (var word in darktriad_m[trait]) {
                                    analysis.darktriad[trait].score += darktriad_m[trait][word][3];
                                    if (darktriad_m[trait][word][3] > 0) {
                                        analysis.darktriad[trait].words.positive.push(darktriad_m[trait][word][0]);
                                    }
                                    else {
                                        analysis.darktriad[trait].words.negative.push(darktriad_m[trait][word][0]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        console.log("smsData apr\u00E8s darktriad:");
        console.log(smsData);
    };
    return CordovaApp;
}());
exports.CordovaApp = CordovaApp;
var instance = new CordovaApp();
//# sourceMappingURL=index.js.map