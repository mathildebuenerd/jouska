"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var manageSMS_1 = require("./manageSMS");
var sentimentAnalysis_1 = require("./sentimentAnalysis");
var CordovaApp = (function () {
    function CordovaApp() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }
    CordovaApp.prototype.onDeviceReady = function () {
        console.log("The device is ready");
        console.log('localStorage');
        console.log(localStorage);
        var sms = new manageSMS_1.SMSManager({
            box: 'sent',
            maxCount: 2000,
        });
        var analysis = new sentimentAnalysis_1.SentimentAnalysis('en');
        var allSMS;
        sms.getAllSMS().then(function (allSMS) {
            console.log('allSMS');
            console.log(allSMS);
            console.log('then is readed');
            for (var key in allSMS) {
                console.log(allSMS[key]);
            }
        }).catch(function (error) { return console.warn("quelque chose va pas!!!"); });
        function translate(allSMS) {
            console.log('translate');
            console.log('translate : allSMS: ');
            console.log(allSMS);
            var translatedSMS = [];
            var counter = 0;
            console.log('je test');
            if (Object.keys(allSMS).length !== 0) {
                for (var key in allSMS) {
                    console.log('je test 2');
                    console.log(allSMS[key]);
                }
            }
            else {
                console.log("allSMS n'existe pas");
            }
        }
        function analyze(translatedSMS) {
            console.log('analyze');
            var stats = [];
            for (var i = 0; i < 20; i++) {
                stats[i] = analysis.analyze(translatedSMS[i], 'en');
            }
            console.log('stats');
            console.log(stats);
        }
    };
    return CordovaApp;
}());
exports.CordovaApp = CordovaApp;
var instance = new CordovaApp();
//# sourceMappingURL=index.js.map