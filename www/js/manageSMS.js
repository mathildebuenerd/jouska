"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SMSManager = (function () {
    function SMSManager(filter) {
        this.filters = filter;
    }
    SMSManager.convertUnixDate = function (unixTimeStamp) {
        var date = new Date(unixTimeStamp * 1000);
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
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (SMS) {
                SMS.listSMS(_this.filters, function (data) {
                    resolve(data);
                }, function (err) {
                    console.log('error list sms: ' + err);
                    reject(err);
                });
            }
            else {
                resolve([]);
            }
        }).then(function (data) {
            var contacts = {};
            for (var key in data) {
                var address = data[key].address;
                if (address.length > 7 && address.match("[0-9]+")) {
                    var date = SMSManager.convertUnixDate(data[key].date);
                    var myid = String(data[key]._id);
                    if (address in contacts) {
                        contacts[address][myid] = {
                            "body": data[key].body,
                            "date": date
                        };
                    }
                    else {
                        contacts[address] = {
                            myid: {
                                "body": data[key].body,
                                "date": date
                            }
                        };
                    }
                }
            }
            return contacts;
        });
    };
    SMSManager.prototype.translateSMS = function (SMS) {
        return new Promise(function (resolve, reject) {
        });
    };
    SMSManager.prototype.displaySMS = function () {
    };
    return SMSManager;
}());
exports.SMSManager = SMSManager;
//# sourceMappingURL=manageSMS.js.map