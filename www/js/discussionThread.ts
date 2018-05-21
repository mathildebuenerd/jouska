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

        // on récupère les messages
        for (const smsId in smsList[contact]) {
            const sms = smsList[contact][smsId];
            const analysis = smsList[contact][smsId]["analysis"];
            let bubble = this.createMessageBubble(sms, smsId);
            let bubbleAnalyzed = this.createTags(bubble, analysis); // on ajoute des balises autour des mots concernés par les anlyses de sentiment et de selfish
            // console.log(`bubbleAnalyzed:`);
            // console.log(bubbleAnalyzed);
            thread.appendChild(bubbleAnalyzed);
        }

        // on positionne le scroll tout en bas du fil de discussion
        window.scrollTo(0, document.body.clientHeight);



        console.log(`j'ai fini d'ajouter mes bulles à mon thread`);


    };

    createMessageBubble= (sms: object, id: string): HTMLElement => {

        // console.log(`voici l'objet reçu dans createMessageBubble:`);
        // console.log(sms);
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

    createTags = (sms: HTMLElement, analysis: object): HTMLElement => {

        let tag = sms;

        // console.log(`tag reçu dans la fonction`);
        // console.log(tag);
        // console.log(`string tag`);
        // console.log(tag.outerHTML);

        const sentiment = analysis["sentimentFr"];
        const valence = ["positive", "negative"];

        // on checke s'il y a une seule ou plusieurs phrases dans l'analyse.
        if (Array.isArray(sentiment)) {
            for (let i=0; i<sentiment.length; i++) {
                // on cherche d'abord pour les mots positifs, puis pour les mots négatifs
                for (let v = 0; v < valence.length; v++) {
                    if (sentiment[i][valence[v]].length > 0) {
                        // s'il y en a plusieurs, on les parcourt
                        for (let j = 0; j < sentiment[i][valence[v]].length; j++) {
                            // on vérifie que le mot est bien présent, parce qu'il peut ne pas être trouvé à cause de la tokenization
                            if ((tag.outerHTML).indexOf(sentiment[i][valence[v]][j]) !== -1) {
                                let wordWithTag = `<span class="${valence[v]}Word">${sentiment[i][valence[v]][j]}</span>`;
                                let newTag = (tag.outerHTML).replace(sentiment[i][valence[v]][j], wordWithTag);
                                tag.innerHTML = newTag;
                            }
                        }
                    }
                }
            }
        } else {
            // on cherche d'abord pour les mots positifs, puis pour les mots négatifs
            for (let v = 0; v < valence.length; v++) {
                // on checke s'il y a des mots dans la liste de l'analyse de sentiment
                if (sentiment[valence[v]].length > 0) {
                    // s'il y en a plusieurs, on les parcourt
                    for (let i = 0; i < sentiment[valence[v]].length; i++) {
                        // on vérifie que le mot est bien présent, parce qu'il peut ne pas être trouvé à cause de la tokenization
                        if ((tag.outerHTML).indexOf(sentiment[valence[v]][i]) !== -1) {
                            let wordWithTag = `<span class="${valence[v]}Word">${sentiment.positive[i]}</span>`;
                            let newTag = (tag.outerHTML).replace(sentiment[valence[v]][i], wordWithTag);
                            tag.innerHTML = newTag;
                        }
                    }
                }
            }
        }



        console.log(`my tag is:`);
        console.log(tag);



        console.log(`I return:`);

        // le process peut créer des div dans des divs
        // on fait une boucle pour être sûr de récupérer le bon élément
        while (tag.firstChild.nodeName.toLowerCase() !== "p") {
            tag = <HTMLElement> tag.firstChild;
        }
        return <HTMLElement> tag;



    }





}