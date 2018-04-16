import {SMSManager} from "./manageSMS";
declare const nodejs: any;

export class CordovaApp {
    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }

    onDeviceReady() {
        console.log("The device is ready");

        startNodeProject();
        console.log('localStorage');
        console.log(localStorage);
        let sms = new SMSManager({
            box : 'sent', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
            // following 4 filters should NOT be used together, they are OR relationship
            //  read : 0, // 0 for unread SMS, 1 for SMS already read
            //_id : 1234, //  specify the msg id
            //address : '// +8613601234567',  sender's phone number
            // body : 'This is a test SMS', // content to match

            // following 2 filters can be used to list page up/down
            //   indexFrom : 0, // start from index 0
            maxCount : 2000, // count of SMS to return each time
        });
        sms.getAllSMS();
    }
}

let instance = new CordovaApp();

