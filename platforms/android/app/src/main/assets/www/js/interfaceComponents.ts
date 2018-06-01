export class InterfaceComponents {

    constructor() {
        this.addListeners();
        // on cache le menu quand le clavier sort
        window.addEventListener('native.keyboardshow', this.hideBottomMenu);
    }

    addListeners = () => {

        // console.log(`j'ajoute les listeners`);

        // Il faut refaire le HTML en veillant à ce que la classe du menu soit égale à l'id de la section

        // Menu principal
        let navLinks = document.querySelectorAll(".bottom-nav .nav-link");
        // console.log(`navLinks`, navLinks);
        for (let i=0; i<navLinks.length; i++) {
            navLinks[i].addEventListener("click", (e) => {
                let targ = <HTMLElement> e.target;
                let targId = targ.classList;
                for (let i=0; i<targId.length; i++) {
                    if (targId[i] !== "nav-link") {
                        // console.log(`targid`, targId[i]);
                        this.switchPages(targId[i]);
                        return;
                    }
                }
            } )
        }

        // Menu de la page Messages
        const iconSettingsNav = document.querySelector(`#top-icon-nav-settings`);
        iconSettingsNav.addEventListener('click', this.toggleSettingsNav);


    };

    hideBottomMenu() {
        const bottomMenu = <HTMLElement> document.querySelector(".bottom-nav");
        bottomMenu.style.display = "none";
    }

    toggleSettingsNav = () => {
        const settingsNav = document.querySelector(`nav#options-visualisation`);
        const iconSettingsNav = document.querySelector(`#top-icon-nav-settings`);
        settingsNav.classList.toggle("active");
        iconSettingsNav.classList.toggle("active");
    };

    addTag= (tag: string, parent: string, text: string, elmtClass?: string) => {

        let element = document.createElement(tag);
        element.textContent = text;

        // comme il est facultatif d'ajouter une class, on check qu'elle exite d'abord
        if (elmtClass !== undefined) {
            element.classList.add(elmtClass);
        }

        let parentElmt = document.querySelector(parent);
        parentElmt.appendChild(element);
    };

    switchMenu() {
        // on change le statut des icones du menu
        // for (let i=0; i<itemsNav.length; i++) {
        // let icon = <HTMLElement> itemsNav[i].childNodes.item(0);
        // if (icon.classList.contains("active")) {
        //     icon.classList.remove("active");
        // }
        // let imageIcon = <HTMLImageElement> icon.childNodes.item(0);
        // if (itemsNav[i].id === navToDisplayId) {
        //     imageIcon.src.indexOf();
        // } else {
        //     imageIcon.src = `img/icons/icon-${id}-inactive.png`;
        // }
        // }

        // let navToDisplay = <HTMLElement> document.querySelector(`#${navToDisplayId}`);
        // if (!navToDisplay.classList.contains("visible")) {
        //     navToDisplay.classList.add("visible");
        // }

    }



    switchPages= (sectionToDisplay: string) => {
        // let itemsNav = <HTMLCollection> document.querySelectorAll(".nav-link");
        let idSections = ["writing", "stats", "messages"];

        for (let i=0; i<idSections.length; i++) {
            const section = <HTMLElement> document.querySelector(`#${idSections[i]}`);

            // si l'id correspond la section à montrer, on lui donne la classe "visible", sinon on donne la class "hidden"
            if (idSections[i] === sectionToDisplay) {
                if (section.classList.contains("hidden")) {
                    section.classList.remove("hidden");
                }
            } else {
                if (!section.classList.contains("hidden")) {
                    section.classList.add("hidden");
                }
            }
        }

        this.switchMenu();

    }

}