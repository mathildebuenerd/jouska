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
        var myscore = calculate.scoreWithContact('0675611341', 'sent');
        var momscore = calculate.scoreWithContact('0675611341', 'inbox');
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