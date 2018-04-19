import {SMSManager} from "./manageSMS";
import {SentimentAnalysis} from "./sentimentAnalysis";
import set = Reflect.set;

export class CordovaApp {
    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }

    onDeviceReady() {
        console.log("The device is ready");

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


        // let allSMS = sms.getAllSMS();
        // console.log("allSMS");
        // console.log(allSMS);
        let analysis = new SentimentAnalysis('en');
        let allSMS;

        // let mytest = sms.getAllSMS();
        // for (let key in allSMS) {
        //     console.log(allSMS[key]);
        // }


        sms.getAllSMS().then( allSMS => {
            console.log('allSMS');
            console.log(allSMS);
            console.log('then is readed');
            for (let key in allSMS) {
                console.log(allSMS[key]);
            }
        }).catch(
            error => console.warn("quelque chose va pas!!!")
        );


        // let getAllSMS = new Promise(function (resolve, reject) {
        //     console.log('getAllSMS');
        //     let allSMS = sms.getAllSMS();
        //
        //     if (Object.keys(allSMS).length !== 0) {
        //         resolve("j'ai résolu");
        //     } else {
        //         reject("j'ai pas résolu");
        //     }
        // });




        function translate(allSMS) {
            console.log('translate');
            console.log('translate : allSMS: ');
            console.log(allSMS);
            // console.log(allSMS[0]);
            let translatedSMS = [];
            let counter = 0;
            console.log('je test');


            if (Object.keys(allSMS).length !== 0) { //
                for (let key in allSMS) {
                    // if (allSMS.hasOwnProperty(key)) {
                    console.log('je test 2');
                    // console.log(allSMS[key]);
                    // let mykey = allSMS[key];
                    // console.log('my key');
                    console.log(allSMS[key]);
                    // if (counter <20) {
                    //     for (let subkey in allSMS[key]) {
                    //         console.log(allSMS[key][subkey]);
                    //         translatedSMS[counter] = analysis.translate(allSMS[key][subkey].body);
                    //         counter++;
                    //     }
                    // }
                    // } // hasownproperty

                }
            } else {
                console.log("allSMS n'existe pas");
            }



            // setTimeout(function() {
            //     setTimeout(function() {
            //
            //         setTimeout(function() {
            //             analyze(translatedSMS);
            //         }, 5000);
            //     }, 5000);
            // }, 5000);

        }

        function analyze(translatedSMS) {
            console.log('analyze');

            let stats = [];
            for (let i=0; i<20; i++) {
                stats[i] = analysis.analyze(translatedSMS[i], 'en');
            }
            console.log('stats');
            console.log(stats);

        }

        // getAllSMS(translate);



        // let getSMS = new Promise((resolve, reject) => {
        //         allSMS = sms.getAllSMS();
        //         if (err) {
        //             reject(err);
        //         } else {
        //             resolve(allSMS);
        //         }
        //     }
        // );
        //
        // getSMS.then(
        //     function() {
        //         for (let i=0; i<20; i++) {
        //             analysisResult[i] = analysis.translate(allSMS[i][0].body);
        //         }
        //     }
        // ).catch(
        //     function () {
        //         console.log('promesse rompue');
        //     }
        // );



        //
        //
        //
        // console.log("analysisResult");
        // console.log(analysisResult);




    }
}

let instance = new CordovaApp();
