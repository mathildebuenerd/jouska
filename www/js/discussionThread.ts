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

    createTags = (sms: HTMLElement, analyses: object): HTMLElement => {

        let tag = sms;

        // console.log(`tag reçu dans la fonction`);
        // console.log(tag);
        // console.log(`string tag`);
        // console.log(tag.outerHTML);

        const analysis = ["sentimentFr", "selfishness"];
        const valence = ["positive", "negative"];

        // on checke s'il y a une seule ou plusieurs phrases dans l'analyse.
        for (const a of analysis) {

            if (Array.isArray(analyses[a])) {
                for (let i=0; i<analyses[a].length; i++) {
                    // on cherche d'abord pour les mots positifs, puis pour les mots négatifs
                    for (let v = 0; v < valence.length; v++) {
                        if (analyses[a][i][valence[v]].length > 0) {
                            // s'il y en a plusieurs, on les parcourt
                            for (let j = 0; j < analyses[a][i][valence[v]].length; j++) {
                                // on vérifie que le mot est bien présent, parce qu'il peut ne pas être trouvé à cause de la tokenization
                                tag = this.addClassToWord(analyses[a][i][valence[v]][j], tag, a, valence[v]);

                            }
                        }
                    }
                }
            } else {
                // on cherche d'abord pour les mots positifs, puis pour les mots négatifs
                for (let v = 0; v < valence.length; v++) {
                    // on checke s'il y a des mots dans la liste de l'analyse de sentiment
                    if (analyses[a][valence[v]].length > 0) {
                        // s'il y en a plusieurs, on les parcourt
                        for (let i = 0; i < analyses[a][valence[v]].length; i++) {
                            tag = this.addClassToWord(analyses[a][valence[v]][i], tag, a, valence[v]);
                        }
                    }
                }
            }
        }



        // le process peut créer des div dans des divs
        // on fait une boucle pour être sûr de récupérer le bon élément
        while (tag.firstChild.nodeName.toLowerCase() !== "p") {
            tag = <HTMLElement> tag.firstChild;
        }
        console.log(`je renvoie`);
        console.log(tag);
        return <HTMLElement> tag;



    };

    addClassToWord = (wordToFind: string, tag: HTMLElement, analysis: string, valence: string): HTMLElement => {
        // on vérifie que le mot est bien présent, parce qu'il peut ne pas être trouvé à cause de la tokenization
        let elmtClass = "";
        if (analysis == "sentimentFr") {
            elmtClass = `sentiment-${valence}`;
        } else if (analysis == "selfishness") {
            elmtClass = `selfish-${valence}`;
        }

        if ((tag.outerHTML).indexOf(wordToFind) === -1) {
            // la raison la plus probable pour laquelle un mot n'est pas trouvé est qu'il est en minuscule dans le tableau, et comporte une majuscule dans le message
            // pour éviter ça on pourrait aussi utiliser une regex, mais ça pose problème avec les smileys "inline" comme :) ou :/
            // on passe donc la première lettre en majuscule
            wordToFind = wordToFind.charAt(0).toUpperCase() + wordToFind.slice(1);
        }
        let wordWithTag = `<span class="${elmtClass}">${wordToFind}</span>`;
        let newTag = (tag.outerHTML).replace(wordToFind, wordWithTag);
        tag.innerHTML = newTag;

        return tag;
    }





}