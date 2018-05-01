import * as translate from "./../../hooks/translate";

declare const SMS: any;
declare const navigator: any;
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



    public findContactName(phonenumber: string): Promise<string> {

        // console.log(contacts);

        return new Promise(
            (resolve, reject) => {

                let numberToFind = phonenumber;
                let contactName = "";
                navigator.contactsPhoneNumbers.list((contacts) => {
                    // console.log('les contacts du téléphone :');
                    // console.log(contacts);
                    for (const singleContact in contacts) {
                        let contactNumbers = contacts[singleContact].phoneNumbers;
                        for (const numbers in contactNumbers) { // chaque contact peut avoir plusieurs numéros, il faut tous les rester pour ne pas louper
                            let singleNumber = contactNumbers[numbers].normalizedNumber;
                            if (singleNumber == phonenumber) { // quand on trouve le numéro, on note le nom du contact et on break la loop
                                contactName = contacts[singleContact].displayName;
                                // console.log("j'ai trouvé le numéro !");
                                // console.log(phonenumber);
                                // console.log(contacts[singleContact].displayName);
                                break;
                            }
                        }
                    }
                    // console.group("findContactName");
                    // console.log('contact name: ' + contactName);
                    // console.groupEnd();
                    resolve(contactName);
                    // return contactName;

                }, (error) => {
                    console.error(error);
                    reject(error);
                });



        });

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

