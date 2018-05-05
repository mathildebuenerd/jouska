"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getData = require("./getData");
var installation = new getData.Installation();
var score = require("./calculateScores");
var calculate = new score.CalculateScore();
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
        var clemence = calculate.scoreWithContact('0783094512', 'inbox');
        var samy = calculate.scoreWithContact('0638768915', 'inbox');
        console.group("Résultats des scores");
        console.log('my score:');
        console.log(myscore);
        console.log('mom score:');
        console.log(momscore);
        console.log('clemence:');
        console.log(clemence);
        console.log('samy:');
        console.log(samy);
        console.groupEnd();
    };
    return CordovaApp;
}());
exports.CordovaApp = CordovaApp;
var instance = new CordovaApp();
//# sourceMappingURL=index.js.map