/**
 * Created by mathi on 18/05/2018.
 */

export class DiscussionThread {

    showContactThread= (contact: string) => {

        console.log(`showDiscussionThread`);

        const smsList = JSON.parse(localStorage.getItem('smsList'));

        console.log(`smsList:`);
        console.log(smsList);

        const thread = document.querySelector("#discussion-thread");

            for (const smsId in smsList[contact]) {
                const sms = smsList[contact][smsId];
                let bubble = this.createMessageBubble(sms, smsId);
                console.log(`bubble:`);
                console.log(bubble);
                thread.appendChild(bubble);
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

    };





}