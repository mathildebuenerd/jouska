/**
 * Created by mathi on 11/04/2018.
 */

export class SMSManager {

    constructor() {
        let filter = {
            box : 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
            // following 4 filters should NOT be used together, they are OR relationship
            //  read : 0, // 0 for unread SMS, 1 for SMS already read
            //_id : 1234, //  specify the msg id
            //address : '// +8613601234567',  sender's phone number
            // body : 'This is a test SMS', // content to match

            // following 2 filters can be used to list page up/down
            //   indexFrom : 0, // start from index 0
            maxCount : 20, // count of SMS to return each time
        };
    }

    getAllSMS(filter) {
        if (SMS) SMS.listSMS(filter, function(data){
            console.log('sms listed as json array');
            // console.log( JSON.stringify(data) );
            console.log('20 last SMS');
            console.log(data);
            // localStorage.setItem('allMySMS', data);
            if(Array.isArray(data)) {
                for(let i in data) {
                    let sms = data[i];
                }
            }
            console.log('success! sms :');
            // console.log(sms);
        }, function(err){
            console.log('error list sms: ' + err);
        });
    }

}

