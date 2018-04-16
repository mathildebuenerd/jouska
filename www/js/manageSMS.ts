declare const SMS: any;
// declare const SMSManager: any;


export class SMSManager {

    filters: object;
    constructor(filter: object) {
        this.filters = filter;
    }

    public static convertUnixDate(unixTimeStamp: number): object {
        let date = new Date(unixTimeStamp*1000); // comme javascript fonctionne en millisecondes, on multiple par 1000 les secondes unix
        return {
            'day': date.getDate(),
            'month': date.getMonth(),
            'year': date.getUTCFullYear(),
            'hour': date.getHours(),
            'minutes': date.getMinutes(),
            'seconds': date.getSeconds()
        };
    }

    public getAllSMS() {
        if (SMS) {
            SMS.listSMS(this.filters, function (data) {
                let contacts = {};
                for (let i = 0; i < data.length; i++) {
                    if ((data[i].address).length > 7 && (data[i].address).match("[0-9]+")) {
                        let date = SMSManager.convertUnixDate(data[i].date);
                        if (contacts.hasOwnProperty(data[i].address)) {
                            Object.defineProperty(contacts[data[i].address], data[i]._id, {
                                value: {
                                    "body": data[i].body,
                                    "date": date
                                }
                            });
                        } else {
                            let myid = String(data[i]._id);
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

    }

    public displaySMS() {

    }

}

