"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var translate = require("./../../hooks/translate");
var LanguageDetect = require("./../../hooks/languagedetect");
var SMSManager = (function () {
    function SMSManager() {
    }
    SMSManager.convertUnixDate = function (unixTimeStamp) {
        var date = new Date(unixTimeStamp * 1000);
        return {
            'day': date.getDate(),
            'month': date.getMonth(),
            'year': date.getFullYear(),
            'hour': date.getHours(),
            'minutes': date.getMinutes(),
            'seconds': date.getSeconds()
        };
    };
    SMSManager.normalizeAddress = function (address) {
        var normalizedAddress = address.replace(' ', '');
        var plusSign = new RegExp(/\+/);
        var doubleZero = new RegExp(/^0{2}/);
        if (plusSign.exec(address) !== null) {
            var identifiant = new RegExp(/\+[0-9]{2}/);
            normalizedAddress = normalizedAddress.replace(identifiant, '0');
        }
        else if (doubleZero.exec(address) !== null) {
            var identifiant = new RegExp(/^0{2}[0-9]{2}/);
            normalizedAddress = normalizedAddress.replace(identifiant, '0');
        }
        return normalizedAddress;
    };
    SMSManager.detectLanguage = function (sms) {
        var languageDetector = new LanguageDetect();
        var lang = languageDetector.detect(sms)[0][0];
        var confidence = languageDetector.detect(sms)[0][1];
        console.log([lang, confidence]);
        if (lang !== undefined) {
            return [lang, confidence];
        }
        else {
            return [];
        }
    };
    SMSManager.prototype.findContactsName = function (smsData) {
        return new Promise(function (resolve, reject) {
            navigator.contactsPhoneNumbers.list(function (phoneContacts) {
                for (var phonenumber in smsData) {
                    var numberToFind = phonenumber.replace(/^0/, '');
                    for (var singleContact in phoneContacts) {
                        var contactNumbers = phoneContacts[singleContact].phoneNumbers;
                        for (var numbers in contactNumbers) {
                            var espace = new RegExp(' ', 'g');
                            var singleNumber = (contactNumbers[numbers].normalizedNumber).replace(espace, '');
                            if (singleNumber.match(numberToFind) !== null) {
                                smsData[phonenumber].name = {};
                                smsData[phonenumber].name = phoneContacts[singleContact].displayName;
                                break;
                            }
                        }
                    }
                }
                resolve(smsData);
            }, function (error) {
                console.error(error);
                reject(error);
            });
        });
    };
    SMSManager.prototype.getAllSMS = function (filters) {
        return new Promise(function (resolve, reject) {
            if (SMS) {
                SMS.listSMS(filters, function (data) {
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
                var type = filters.box;
                var address = SMSManager.normalizeAddress(data[key].address);
                var myid = data[key]._id;
                if (address.length > 7 && address.match("[0-9]+")) {
                    var date = SMSManager.convertUnixDate(data[key].date);
                    if (address in contacts) {
                        contacts[address][type][myid] = {
                            "text": {
                                "fr": data[key].body
                            },
                            "date": date
                        };
                    }
                    else {
                        contacts[address] = {};
                        contacts[address][type] = {};
                        contacts[address][type][myid] = {
                            "text": {
                                "fr": data[key].body
                            },
                            "date": date
                        };
                    }
                }
            }
            return contacts;
        });
    };
    SMSManager.prototype.translateSMS = function (allSMS) {
        return new Promise(function (resolve, reject) {
            var counter = 0;
            for (var key in allSMS) {
                if (allSMS.hasOwnProperty(key)) {
                    if (counter < 20) {
                        for (var subkey in allSMS[key]) {
                            var englishSentence = translate(allSMS[key][subkey].body.fr);
                            allSMS[key][subkey].body.en = englishSentence;
                            console.log(englishSentence);
                            counter++;
                        }
                    }
                }
            }
            console.log('translate: je vais résoudre la promesse');
            resolve(allSMS);
        });
    };
    SMSManager.prototype.displaySMS = function () {
    };
    return SMSManager;
}());
exports.SMSManager = SMSManager;
//# sourceMappingURL=manageSMS.js.map