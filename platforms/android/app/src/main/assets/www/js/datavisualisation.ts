import {SMSManager} from "./manageSMS";
import * as scores from "./calculateScores";
const Score = new scores.CalculateScore();

import * as sms from "./manageSMS";
const Sms = new sms.SMSManager();

import "./../../hooks/p5";




export class Datavisualisation {

    userStats: HTMLElement;
    contactStats: HTMLElement;

    constructor() {
        this.userStats = document.querySelector("#userStats");
        this.contactStats = document.querySelector("#contactStats");
    }

    testp5() {
        new p5( function(monSketch) {

            let x = 100;
            let y = 100;

            monSketch.setup = function() {
                monSketch.createCanvas(700, 410);
            };

            monSketch.draw = function() {
                monSketch.background(0);
                monSketch.fill(255);
                monSketch.rect(x,y,50,50);
            };
        });
    }

    public calculateUserScore() {

    }

    public calculateUserScoreWithContact(contact) {

    }

    public perDay() {

    }

    public calculateScorePerWeek() {

    }


    bigFiveGraph = (contact: string, type: string) => {
        let data = Score.scoreWithContact(contact, type);
        let dataUser = Score.scoreWithContact(contact, "sent");
        console.log(`data: `);
        console.log(data);

        let bigFiveTag = document.createElement("div");
        bigFiveTag.textContent = `
        Openess: ${data["bigfive"]["openness"]}, 
        Conscious: ${data["bigfive"]["conscientiousness"]}`;
        const mult = 300;
        const rO = (data["bigfive"]["openness"])*mult;
        const rC = (data["bigfive"]["conscientiousness"])*mult;

        new p5( function(monSketch) {

            var x = 100;
            var y = 100;

            monSketch.setup = function() {
                monSketch.createCanvas(700, 410);
            };

            monSketch.draw = function() {
                monSketch.background(0);
                monSketch.fill(255);
                monSketch.rect(x,y,50,50);
            };
        });

        // fill("blue");
        // ellipse(20,20,rO,rO);
        // fill("red");
        // ellipse(50,20,rC, rC);




        this.userStats.appendChild(bigFiveTag);


    };


    public getWords(valence: string = ("positive" || "negative"), phonenumber: string, type: string = ("inbox" || "sent"), lang: string = "fr") {

        let words = Score.getMostUsedWords(valence, phonenumber, type, lang);
        console.log("words");
        console.table(words);

        let title = document.createElement("h2");
        let contactName = Sms.getContactName(phonenumber);
        title.textContent = `Words ${valence} from ${contactName}`;

        // we create a ul li that will store all words
        let wordList = document.createElement("ul");
        wordList.classList.add(`${valence}-wordList`, `wordList`);

        // we loop through the array that stores the words
        for (const word of words) {
            let wordTag = document.createElement("li");
            wordTag.textContent = word;
            wordList.appendChild(wordTag);
        }

        this.userStats.appendChild(title);
        this.userStats.appendChild(wordList);

    }

}



