import {SMSManager} from "./manageSMS";

export class Datavisualisation {

    data: object;
    type: string;

    constructor(data: object, type: string) {
        this.data = data;
        this.type = type;
    }

    // on ne peut utiliser cette fonction que si le type est "SMS"
    public simpleContactComparison() {

        let sms = new SMSManager({}); // cet objet ne sert à rien, juste à utiliser la fonction findContactname
        console.group("Simple contact comparison");
        console.log("data reçue :");
        console.log(this.data);

        const data = this.data;
        classifyContacts();
        function classifyContacts() {

            let contactScores = {};

            for (const contact in data) {

                let sentimentScore = 0;
                let numberOfSMS = 0;

                for (const smsId in data[contact]) {
                    const sentiment = data[contact][smsId].analysis.sentiment;
                    if (sentiment) {
                        sentimentScore += sentiment.score;
                        numberOfSMS++;
                    }
                }

                contactScores[contact] = {
                    sentimentScore: sentimentScore,
                    numberOfSMS: numberOfSMS,
                    relativeScore: sentimentScore/numberOfSMS
                };



                console.group("Score de " + contactScores[contact].contactName);
                console.log("score total: " + sentimentScore);
                console.log("scrore relatif: " + sentimentScore/numberOfSMS);
                console.groupEnd();
            }

            for (const contact in contactScores) {
                sms.findContactName(contact).then( (contactName) => {
                    contactScores[contact].contactName = contactName;
                });
            }

            console.log("contactScores: ");
            console.log(contactScores);

        }



        console.groupEnd();
    }

}