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
                // console.log("data[contact]: ");
                // console.log(Object.keys(data[contact]));
                let contactName = sms.findContactName(contact);
                console.group("Score de " + contactName);
                console.log("score total: " + sentimentScore);
                console.log("scrore relatif: " + sentimentScore/numberOfSMS);
                console.groupEnd();
            }
        }



        console.groupEnd();
    }

}