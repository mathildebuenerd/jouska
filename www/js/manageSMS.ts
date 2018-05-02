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

    public static normalizeAddress(address: string): string {
        let normalizedAddress = address.replace(' ', ''); // le numéro est peut-être mal formaté (06 xx xx xx xx au lieu de 06xxxxxxxx), donc on enlève les espaces
        let plusSign = new RegExp(/\+/);
        let doubleZero = new RegExp(/^0{2}/);
        if (plusSign.exec(address) !== null) { // si l'adresse contient un identifiant national comme +33 ou +41, on l'enlève pour avoir un numéro de la forme 06xxxxxx, ça permet d'éviter les doublons
            console.log(address);
            const identifiant = new RegExp(/\+[0-9]{2}/); // un identifiant est un + (/+) suivit de deux nombres ([0-9]{2})
            normalizedAddress = normalizedAddress.replace(identifiant, '0'); // on remplace l'identifiant par un zéro
        } else if (doubleZero.exec(address) !== null) {
            const identifiant = new RegExp(/^0{2}[0-9]{2}/); // un identifiant est un 00 suivi de deux nombres, par exemple 0033 ou 0041
            normalizedAddress = normalizedAddress.replace(identifiant, '0');
        }
        console.group("Normalized adress");
        console.log('address: ' + address);
        console.log('normalized address: ' + normalizedAddress);
        console.groupEnd();
        return normalizedAddress;
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
                    // let address = data[key].address;
                    // console.log("ma fonction");
                    // let plusSign = new RegExp('\+', '');
                    // console.log(plusSign.exec(address));
                    let address = SMSManager.normalizeAddress(data[key].address); // on normalize le numéro pour enlever les espaces et les +33, +41...
                    const myid = data[key]._id; // chaque numéro possède un identifiant unique

                    // on checke si le numéro de téléphone est standard pour éviter pubs et numéros spéciaux : constitué de chiffres et de + seulement et au moins 7 chiffres
                    if (address.length > 7 && address.match("[0-9]+")) {
                        const date = SMSManager.convertUnixDate(data[key].date); // on converti le format de date de listSMS
                        if (address in contacts) { // si le numéro est vu dans la liste, on ajoute les sms dans ce numéro
                            contacts[address][myid] = {
                                "text": {
                                    "fr": data[key].body
                                },
                                "date": date
                            };
                        } else { // si le numéro n'est pas dans la liste, on le crée
                            contacts[address] = {}; // on doit initialiser la nouvelle adresse
                            contacts[address][myid] = {
                                "text": {
                                    "fr": data[key].body
                                },
                                "date": date
                            };
                            // contacts[address] = {
                            //     "0000": {
                            //         "text": {
                            //             "fr": data[key].body
                            //         },
                            //         "date": date
                            //     }
                            // };
                        }
                    } // if address est correct
                    // }
                } // for key in data
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

