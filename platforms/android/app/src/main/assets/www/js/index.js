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
var manageSMS_1 = require("./manageSMS");
var sms = new manageSMS_1.SMSManager();
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
        var scorePerDay = calculate.scorePerTime(smsData, "weekday");
        var scorePerDate = calculate.scorePerTime(smsData, "day");
        var scorePerMonth = calculate.scorePerTime(smsData, "month");
        var scorePerMinutes = calculate.scorePerTime(smsData, "minutes");
        var scorePerSeconds = calculate.scorePerTime(smsData, "seconds");
        console.log("scorePerDay:");
        console.log(scorePerDay);
        console.log("scorePerDate:");
        console.log(scorePerDate);
        console.log("scorePerMonth:");
        console.log(scorePerMonth);
        console.log("scorePerMinutes:");
        console.log(scorePerMinutes);
        console.log("scorePerSeconds:");
        console.log(scorePerSeconds);
    };
    return CordovaApp;
}());
exports.CordovaApp = CordovaApp;
var instance = new CordovaApp();
//# sourceMappingURL=index.js.map