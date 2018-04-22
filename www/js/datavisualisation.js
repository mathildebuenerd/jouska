"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var manageSMS_1 = require("./manageSMS");
var Datavisualisation = (function () {
    function Datavisualisation(data, type) {
        this.data = data;
        this.type = type;
    }
    Datavisualisation.prototype.simpleContactComparison = function () {
        var sms = new manageSMS_1.SMSManager({});
        console.group("Simple contact comparison");
        console.log("data reçue :");
        console.log(this.data);
        var data = this.data;
        classifyContacts();
        function classifyContacts() {
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
                var contactName = sms.findContactName(contact);
                console.group("Score de " + contactName);
                console.log("score total: " + sentimentScore);
                console.log("scrore relatif: " + sentimentScore / numberOfSMS);
                console.groupEnd();
            }
        }
        console.groupEnd();
    };
    return Datavisualisation;
}());
exports.Datavisualisation = Datavisualisation;
//# sourceMappingURL=datavisualisation.js.map