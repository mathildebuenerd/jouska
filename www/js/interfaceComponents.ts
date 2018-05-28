



export class InterfaceComponents {

    addTag= (tag: string, parent: string, text: string, elmtClass?: string) => {

        let element = document.createElement(tag);
        element.textContent = text;

        // comme il est facultatif d'ajouter une class, on check qu'elle exite d'abord
        if (elmtClass !== undefined) {
            element.classList.add(elmtClass);
        }

        let parentElmt = document.querySelector(parent);
        parentElmt.appendChild(element);
    }

}