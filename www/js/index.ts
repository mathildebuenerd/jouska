let blockSentences = document.querySelector('#blockSentences');

let app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        console.log("The device is ready");



        // SMS
        let filter = {
            box : 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
            // following 4 filters should NOT be used together, they are OR relationship
            //  read : 0, // 0 for unread SMS, 1 for SMS already read
            //_id : 1234, //  specify the msg id
            //address : '// +8613601234567',  sender's phone number
            // body : 'This is a test SMS', // content to match
            // following 2 filters can be used to list page up/down
            //   indexFrom : 0, // start from index 0
            maxCount : 200, // count of SMS to return each time
        };
        if(SMS) SMS.listSMS(filter, function(data){

            // D'abord on fait une list des adresses (address)
            // Puis on ajoute les messages correspondants dans cette liste
            let contacts = {};

            for (let i=0; i<data.length; i++) {
                // on regarde d'abord si le numéro est un vrai numéro, pour éviter les numéros comme SNCF ou 36105 etc...
                if ((data[i].address).length > 7 && (data[i].address).match("[0-9]+")) {
                    if (contacts.hasOwnProperty(data[i].address)) {
                        Object.defineProperty(
                            contacts[data[i].address],
                            data[i]._id,
                            {
                                value: {
                                    "body": data[i].body,
                                    "date": data[i].date
                                }
                            }
                        );
                    } else {
                        let myid = String(data[i]._id);
                        Object.defineProperty(
                            contacts,
                            data[i].address,
                            {
                                value: {
                                    "000": {
                                        "body": data[i].body,
                                        "date": data[i].date
                                    }
                                }
                            }
                        );
                    }
                }
            }
            console.log('contacts');
            console.log(contacts);
        }, function(err){
            console.log('error list sms: ' + err);
        });

        console.log('localStorage');
        console.log(localStorage);







        // // Notifications
        // const PushNotification = window['PushNotification'];
        // const push = PushNotification.init({
        //     android: {
        //     },
        //     ios: {
        //         alert: "true",
        //         badge: true,
        //         sound: 'false'
        //     },
        //     windows: {}
        // });
        //
        // push.on('registration', (data) => {
        //     console.log(data.registrationId);
        // });
        //
        // push.on('notification', (data) => {
        //     console.log(data.message);
        //     console.log(data.title);
        //     console.log(data.count);
        //     console.log(data.sound);
        //     console.log(data.image);
        //     console.log(data.additionalData);
        // });
        //
        // push.on('error', (e) => {
        //     console.log(e.message);
        // });
    }

};

app.initialize();











// -----------------------------------------------------------------------------------

// import {SMSManager} from "./manageSMS";
//
// export class CordovaApp {
//     constructor() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//         let blockSentences = document.querySelector('#blockSentences');
//     }
//
//     onDeviceReady() {
//         console.log("The device is ready");
//         console.log('localStorage');
//         console.log(localStorage);
//         let sms = new SMSManager();
//
//     }
// }
//
// let instance = new CordovaApp();