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
        var test = text.sentimentAnalysis("The team has just finished. So we can meet now?", "en");
        console.log("test:");
        console.log(test);
        writingAssistant.startAssistance();
    };
    return CordovaApp;
}());
exports.CordovaApp = CordovaApp;
var instance = new CordovaApp();
//# sourceMappingURL=index.js.map