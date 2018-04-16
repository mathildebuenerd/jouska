"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SMSManager = (function () {
    function SMSManager(filter) {
        this.filters = filter;
    }
    SMSManager.convertUnixDate = function (unixTimeStamp) {
        var date = new Date(unixTimeStamp * 1000);
        console.log(date.getFullYear());
        return {
            'day': date.getDate(),
            'month': date.getMonth(),
            'year': date.getUTCFullYear(),
            'hour': date.getHours(),
            'minutes': date.getMinutes(),
            'seconds': date.getSeconds()
        };
    };
    SMSManager.prototype.getAllSMS = function () {
        if (SMS) {
            SMS.listSMS(this.filters, function (data) {
                var contacts = {};
                for (var i = 0; i < data.length; i++) {
                    if ((data[i].address).length > 7 && (data[i].address).match("[0-9]+")) {
                        var date = SMSManager.convertUnixDate(data[i].date);
                        if (contacts.hasOwnProperty(data[i].address)) {
                            Object.defineProperty(contacts[data[i].address], data[i]._id, {
                                value: {
                                    "body": data[i].body,
                                    "date": date
                                }
                            });
                        }
                        else {
                            var myid = String(data[i]._id);
                            Object.defineProperty(contacts, data[i].address, {
                                value: {
                                    "000": {
                                        "body": data[i].body,
                                        "date": date
                                    }
                                }
                            });
                        }
                    }
                }
                console.log('contacts');
                console.log(contacts);
            }, function (err) {
                console.log('error list sms: ' + err);
            });
        }
    };
    SMSManager.prototype.displaySMS = function () {
    };
    return SMSManager;
}());
exports.SMSManager = SMSManager;
//# sourceMappingURL=manageSMS.js.map