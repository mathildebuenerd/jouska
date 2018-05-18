/**
 * Created by mathi on 18/05/2018.
 */

export class DiscussionThread {

    showContactThread= (contact: string) => {

        const smsData = JSON.parse(localStorage.getItem('smsData'));


        // Create a list where we are going to put the HTMLElements of the messages from that contact
        let messagesList = [];
        const thread = document.querySelector("#discussion-thread");

        for (const type in smsData[contact]) {
            if (type !== "name") {
                for (const smsId in smsData[contact][type]) {
                    const sms = smsData[contact][type][smsId];
                    let bubble = this.createMessageBubble(sms, smsId);
                    console.log(`bubble:`);
                    console.log(bubble);
                    thread.appendChild(bubble);
                }
            }
        }

        console.log(`j'ai fini d'ajouter mes bulles à mon thread`);


    };

    createMessageBubble= (sms: object, id: string): HTMLElement => {

        console.log(`voici l'objet reçu dans createMessageBubble:`);
        console.log(sms);
        // Create the tag
        let tag = document.createElement("div");
        tag.classList.add("singleSMS");
        tag.classList.add(sms["type"]);
        tag.id = id;
        let text = document.createElement("p");
        text.textContent = sms["text"]["original"];
        text.classList.add("smsText");
        tag.appendChild(text);

        return tag;

    }


}