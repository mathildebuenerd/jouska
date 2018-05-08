import * as translate from "./../../hooks/translate";

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

    public getAllSMS(): Promise<object> {
        return new Promise(//return a promise
            (resolve,reject)=>{
                if (SMS) {
                    SMS.listSMS(this.filters, function (data) {
                        resolve(data);//added this, resolve promise
                    }, function (err) {
                        console.log('error list sms: ' + err);
                        reject(err);//added this reject promise
                    });
                }else{
                    resolve([]);//added this, resolving to empty array?
                }
            }
        ).then(
            data=>{
                // On remplir ici l'objet contacts avec les SMS
                let contacts = {};
                for (const key in data) {
                    const address = data[key].address;
                    // on checke si le numéro de téléphone est standard pour éviter pubs et numéros spéciaux : constitué de chiffres et de + seulement et au moins 7 chiffres
                    if (address.length > 7 && address.match("[0-9]+")) {
                        const date = SMSManager.convertUnixDate(data[key].date); // on converti le format de date de listSMS
                        const myid = data[key]._id;
                        if (address in contacts) {
                            contacts[address][myid] = {
                                "body": {
                                    "fr": data[key].body
                                },
                                "date": date
                            };
                        }
                        else {
                            contacts[address] = {
                                "0000": {
                                    "body": {
                                        "fr": data[key].body
                                    },
                                    "date": date
                                }
                            };
                        }
                    }
                }
                return contacts;
            }
        );
    }

    public translateSMS(allSMS: any) {
        return new Promise(
            (resolve, reject) => {
                let counter = 0;
                for (const key in allSMS) {
                    if (allSMS.hasOwnProperty(key)) {
                        if (counter <20) {
                            for (let subkey in allSMS[key]) {
                                console.trace();
                                // const englishSentence = translate(allSMS[key][subkey].body).then( text => {
                                //     allSMS[key][subkey].body.en = text;
                                //     console.log(text);
                                // });
                                const englishSentence = translate(allSMS[key][subkey].body.fr);
                                allSMS[key][subkey].body.en = englishSentence;
                                console.log(englishSentence);
                                counter++;
                            }
                        }
                    } // hasownproperty

                }
                console.log('translate: je vais résoudre la promesse');
                resolve(allSMS);
                //         console.log('translate: je vais rejeter la promesse');
                // reject();
            });
    }


    public displaySMS() {

    }

}
