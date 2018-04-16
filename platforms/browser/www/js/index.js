"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var manageSMS_1 = require("./manageSMS");
var CordovaApp = (function () {
    function CordovaApp() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }
    CordovaApp.prototype.onDeviceReady = function () {
        console.log("The device is ready");
        startNodeProject();
        console.log('localStorage');
        console.log(localStorage);
        var sms = new manageSMS_1.SMSManager({
            box: 'sent',
            maxCount: 2000,
        });
        sms.getAllSMS();
    };
    return CordovaApp;
}());
exports.CordovaApp = CordovaApp;
var instance = new CordovaApp();
//# sourceMappingURL=index.js.map