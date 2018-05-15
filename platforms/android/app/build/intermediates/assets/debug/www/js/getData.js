"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var manageSMS_1 = require("./manageSMS");
var sentimentAnalysis_1 = require("./sentimentAnalysis");
var translate = require("./../../hooks/translate");
var keys = require("./apiKeys");
var Keys = new keys.Keys();
translate.key = Keys.API_KEY;
translate.from = 'fr';
var sms = new manageSMS_1.SMSManager();
var textAnalysis = new sentimentAnalysis_1.TextAnalysis();
var smsData = {};
var Installation = (function () {
    function Installation() {
    }
    Installation.prototype.start = function () {
        var install = document.querySelector("#installTheApp");
        install.style.display = 'block';
        var getReceivedMessagesButton = install.querySelector("#getReceivedMessages");
        var getSentMessagesButton = document.querySelector("#getSentMessages");
        var translateToEnglishButton = install.querySelector("#translateMessages");
        var sentimentAnalysisButton = install.querySelector("#analyzeSentiment");
        var darktriadAnalysisButton = install.querySelector("#analyzeDarktriad");
        var bigfiveAnalysisButton = install.querySelector("#analyzePersonality");
        var genderPredictionButton = install.querySelector("#analyzeGender");
        var temporalOrientationButton = install.querySelector("#analyzeTemporalOrientation");
        var getContactNamesButton = install.querySelector("#getContactNames");
        var addToLocalStorageButton = install.querySelector('#addToLocalStorage');
        var getCurrentDateButton = install.querySelector("#getCurrentDate");
        getReceivedMessagesButton.addEventListener('click', this.getReceivedMessages);
        getSentMessagesButton.addEventListener('click', this.getSentMessages);
        translateToEnglishButton.addEventListener('click', this.translateToEnglish);
        sentimentAnalysisButton.addEventListener('click', this.sentimentAnalysis);
        darktriadAnalysisButton.addEventListener('click', this.darktriadAnalysis);
        bigfiveAnalysisButton.addEventListener('click', this.bigfiveAnalysis);
        genderPredictionButton.addEventListener('click', this.genderAnalysis);
        temporalOrientationButton.addEventListener('click', this.temporalOrientationAnalysis);
        getContactNamesButton.addEventListener('click', this.getContactNames);
        addToLocalStorageButton.addEventListener('click', this.addToLocalStorage);
        getCurrentDateButton.addEventListener('click', this.getCurrentDate);
    };
    Installation.prototype.getReceivedMessages = function () {
        sms.getAllSMS({
            box: 'inbox',
            maxCount: 10000,
        }).then(function (allSMS) {
            smsData = allSMS;
            console.group("Get received messages (inbox)");
            console.log('smsData: ');
            console.log(smsData);
            console.groupEnd();
        }).catch(function (error) { return console.error("la promesse concernant getAllSMS a échoué"); });
    };
    Installation.prototype.getSentMessages = function () {
        sms.getAllSMS({
            box: 'sent',
            maxCount: 10000,
        }).then(function (allSMS) {
            for (var contact in smsData) {
                Object.assign(smsData[contact], allSMS[contact]);
            }
            console.group("Get sent messages");
            console.log('smsData: ');
            console.log(smsData);
            console.groupEnd();
        }).catch(function (error) { return console.error("la promesse concernant getAllSMS a échoué"); });
    };
    Installation.prototype.translateToEnglish = function () {
        var _loop_1 = function (contact) {
            console.log(smsData[contact]);
            var _loop_2 = function (type) {
                var _loop_3 = function (smsID) {
                    console.log(smsData[contact][type][smsID].text.original);
                    translate(smsData[contact][type][smsID].text.original, { to: 'en' }).then(function (translatedText) {
                        var text = translatedText;
                        if (translatedText.indexOf('&#39;') !== -1) {
                            text = translatedText.replace('&#39;', "'");
                        }
                        smsData[contact][type][smsID].text.en = text;
                    });
                };
                for (var smsID in smsData[contact][type]) {
                    _loop_3(smsID);
                }
            };
            for (var type in smsData[contact]) {
                _loop_2(type);
            }
        };
        for (var contact in smsData) {
            _loop_1(contact);
        }
        console.log("avec traduction");
        console.log(smsData);
    };
    Installation.prototype.sentimentAnalysis = function () {
        for (var contact in smsData) {
            for (var type in smsData[contact]) {
                if (type !== 'name') {
                    for (var singleSMS in smsData[contact][type]) {
                        var englishSMS = smsData[contact][type][singleSMS].text.en;
                        var originalSMS = smsData[contact][type][singleSMS].text.original;
                        smsData[contact][type][singleSMS].analysis.sentiment = {};
                        smsData[contact][type][singleSMS].analysis.sentimentFr = {};
                        smsData[contact][type][singleSMS].analysis.sentimentFr = textAnalysis.sentimentAnalysis(originalSMS, 'fr');
                        smsData[contact][type][singleSMS].analysis.sentiment = textAnalysis.sentimentAnalysis(englishSMS, 'en', originalSMS);
                    }
                }
            }
        }
        console.group("Sentiment analysis");
        console.log('smsData: ');
        console.log(smsData);
        console.groupEnd();
    };
    Installation.prototype.darktriadAnalysis = function () {
        for (var contact in smsData) {
            for (var type in smsData[contact]) {
                if (type !== 'name') {
                    for (var singleSMS in smsData[contact][type]) {
                        var englishSMS = smsData[contact][type][singleSMS].text.en;
                        smsData[contact][type][singleSMS].analysis.darktriad = {};
                        smsData[contact][type][singleSMS].analysis.darktriad = textAnalysis.darktriadAnalysis(englishSMS);
                    }
                }
            }
        }
        console.group("Dark triad");
        console.log('smsData: ');
        console.log(smsData);
        console.groupEnd();
    };
    Installation.prototype.bigfiveAnalysis = function () {
        for (var contact in smsData) {
            for (var type in smsData[contact]) {
                if (type !== 'name') {
                    for (var singleSMS in smsData[contact][type]) {
                        var analysis = smsData[contact][type][singleSMS].analysis;
                        var englishSMS = smsData[contact][type][singleSMS].text.en;
                        var bigfive_m = textAnalysis.personalityAnalysis(englishSMS, { "output": "matches" });
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
        console.group("Big Five");
        console.log('smsData: ');
        console.log(smsData);
        console.groupEnd();
    };
    Installation.prototype.genderAnalysis = function () {
        for (var contact in smsData) {
            for (var type in smsData[contact]) {
                if (type !== 'name') {
                    for (var singleSMS in smsData[contact][type]) {
                        var englishSMS = smsData[contact][type][singleSMS].text.en;
                        smsData[contact][type][singleSMS].analysis.gender = {};
                        smsData[contact][type][singleSMS].analysis.gender = textAnalysis.genderPrediction(englishSMS);
                    }
                }
            }
        }
        console.group("Gender prediction");
        console.log('smsData: ');
        console.log(smsData);
        console.groupEnd();
    };
    Installation.prototype.temporalOrientationAnalysis = function () {
        for (var contact in smsData) {
            for (var type in smsData[contact]) {
                if (type !== 'name') {
                    for (var singleSMS in smsData[contact][type]) {
                        var englishSMS = smsData[contact][type][singleSMS].text.en;
                        smsData[contact][type][singleSMS].analysis.temporalOrientation = {};
                        smsData[contact][type][singleSMS].analysis.temporalOrientation = textAnalysis.temporalOrientationPrediction(englishSMS);
                    }
                }
            }
        }
        console.group("Temporal Orientation");
        console.log('smsData: ');
        console.log(smsData);
        console.groupEnd();
    };
    Installation.prototype.getContactNames = function () {
        sms.findContactsName(smsData).then(function (smsDataWithNames) {
            smsData = smsDataWithNames;
        }, function (error) {
            console.error(error);
        });
        console.group("Get contact names");
        console.log(smsData);
        console.groupEnd();
    };
    Installation.prototype.addToLocalStorage = function () {
        console.group("Finalisation de l'installation");
        console.log("Final sms data: ");
        console.log(smsData);
        localStorage.setItem('smsData', JSON.stringify(smsData));
        console.log("Local storage: ");
        console.log(localStorage);
        console.groupEnd();
    };
    Installation.prototype.getCurrentDate = function () {
        var today = new Date();
        console.log(typeof today);
        localStorage.setItem('installation', JSON.stringify(today));
    };
    return Installation;
}());
exports.Installation = Installation;
//# sourceMappingURL=getData.js.map