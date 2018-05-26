"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getData = require("./getData");
var installation = new getData.Installation();
var score = require("./calculateScores");
var calculate = new score.CalculateScore();
var writingInterface = require("./writingInterface");
var writingAssistant = new writingInterface.WritingInterface();
var discussionThread = require("./discussionThread");
var thread = new discussionThread.DiscussionThread();
var translate = require("./../../hooks/translate");
var keys = require("./apiKeys");
var sentimentAnalysis_1 = require("./sentimentAnalysis");
var manageSMS_1 = require("./manageSMS");
var sms = new manageSMS_1.SMSManager();
var text = new sentimentAnalysis_1.TextAnalysis();
var dataV = require("./datavisualisation");
var DataVis = new dataV.Datavisualisation();
var Keys = new keys.Keys();
translate.key = Keys.API_KEY;
translate.from = 'fr';
var CordovaApp = (function () {
    function CordovaApp() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }
    CordovaApp.prototype.onDeviceReady = function () {
        DataVis.testp5();
    };
    return CordovaApp;
}());
exports.CordovaApp = CordovaApp;
var instance = new CordovaApp();
//# sourceMappingURL=index.js.map