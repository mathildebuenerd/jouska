import * as getData from "./getData";
const installation = new getData.Installation();
// import {Installation} from "./getData";
import {Datavisualisation} from "./datavisualisation";
import set = Reflect.set;
import "./visualEffects";




export class CordovaApp {
    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    }

    onDeviceReady() {

        if (localStorage.getItem('smsData') === null) {
            installation.start();
        }




    }

}

let instance = new CordovaApp();
