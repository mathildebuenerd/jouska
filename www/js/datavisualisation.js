"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var manageSMS_1 = require("./manageSMS");
var Datavisualisation = (function () {
    function Datavisualisation(data, type) {
        this.data = data;
        this.type = type;
    }
    Datavisualisation.prototype.calculateUserScore = function () {
    };
    Datavisualisation.prototype.calculateUserScoreWithContact = function (contact) {
    };
    Datavisualisation.prototype.calculateScorePerDay = function () {
    };
    Datavisualisation.prototype.calculateScorePerWeek = function () {
    };
    Datavisualisation.prototype.getMostPositiveMessage = function () {
    };
    Datavisualisation.prototype.getMostNegativeMessage = function () {
    };
    Datavisualisation.prototype.simpleContactComparison = function () {
        var sms = new manageSMS_1.SMSManager();
        console.log("data reçue :");
        console.log(this.data);
        var data = this.data;
        classifyContacts().then(function (contactList) {
            console.log('contactList:');
            console.log(contactList);
            localStorage.setItem("contactList", JSON.stringify(contactList));
        });
        function getScoresPerContact() {
        }
        function classifyContacts() {
            return new Promise(function (resolve, reject) {
                var contactScores = {};
                for (var contact in data) {
                    var sentimentScore = 0;
                    var numberOfSMS = 0;
                    for (var smsId in data[contact]) {
                        var sentiment = data[contact][smsId].analysis.sentiment;
                        if (sentiment) {
                            sentimentScore += sentiment.score;
                            numberOfSMS++;
                        }
                    }
                    contactScores[contact] = {
                        sentimentScore: sentimentScore,
                        numberOfSMS: numberOfSMS,
                        relativeScore: sentimentScore / numberOfSMS
                    };
                    console.group("Score de " + contactScores[contact].contactName);
                    console.log("score total: " + sentimentScore);
                    console.log("scrore relatif: " + sentimentScore / numberOfSMS);
                    console.groupEnd();
                }
                resolve(contactScores);
            }).then(function (contactScores) {
                var _loop_1 = function (contact) {
                    var contactName = sms.findContactName(contact).then(function (contactName) {
                        contactScores[contact].contactName = contactName;
                    });
                };
                for (var contact in contactScores) {
                    _loop_1(contact);
                }
                return contactScores;
            });
        }
    };
    return Datavisualisation;
}());
exports.Datavisualisation = Datavisualisation;
//# sourceMappingURL=datavisualisation.js.map