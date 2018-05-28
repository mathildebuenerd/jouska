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


    public calculateUserScore() {

    }

    public calculateUserScoreWithContact(contact) {

    }

    public perDay() {

    }

    public calculateScorePerWeek() {

    }

    drawBigFiveGraph = (data: object): void => {


        new p5( function(bigFive) {

            const colors = [
                "#2121ff",
                "#00ffff",
                "#f2f2f2",
                "#eccbd9",
                "#e1eff6"
            ];

            const values = [
                data["person"]["openness"],
                data["person"]["conscientiousness"],
                data["person"]["extraversion"],
                data["person"]["agreeableness"],
                data["person"]["neuroticism"]
            ];
            const valuesOther = [
                data["other"]["openness"],
                data["other"]["conscientiousness"],
                data["other"]["extraversion"],
                data["other"]["agreeableness"],
                data["other"]["neuroticism"]
            ];
            const traits = [
                "openness",
                "conscientiousness",
                "extraversion",
                "agreeableness",
                "neuroticism"
            ];
            const y = 100;
            const offset = 45;

            bigFive.setup = function() {
                let cnv = bigFive.createCanvas(window.innerWidth, 200);
                cnv.parent("userStats");
                bigFive.noStroke();
                bigFive.drawGraph();

            };

            bigFive.drawText = (txt: string, clr: string, x: number, y: number): void => {
                bigFive.noStroke();
                bigFive.fill(clr);
                bigFive.textAlign(bigFive.CENTER);
                bigFive.textSize(10);
                bigFive.text(txt, x, y);
                bigFive.noFill();
            };

            bigFive.drawGraph = () => {

                for (let i=0; i<5; i++) {
                    bigFive.noStroke();
                    // la valeur de la personne demandée
                    // si la valeur est négative, on ne l'affiche pas de la même couleur
                    if (values[i] > 0) {
                        bigFive.fill(colors[i]);
                    } else {
                        bigFive.fill("black");
                    }
                    const x = 60*i+offset;
                    bigFive.ellipse(x, y, values[i], values[i]);
                    bigFive.drawText(traits[i], "black", x, y+30);


                    bigFive.noFill();
                    // la valeur de l'interloculteur
                    if (valuesOther[i] > 0) {
                        bigFive.stroke("#ff00ff");
                    } else {
                        bigFive.stroke("#aaaaaa");
                    }
                    bigFive.ellipse(x, y, valuesOther[i], valuesOther[i]);
                }
            };

            bigFive.draw = function() {

            };
        });

    };


    bigFiveGraph = (contact: string, type: string) => {

        let dataOther;

        if (type === "sent") {
            dataOther = Score.scoreWithContact(contact, "inbox");
        } else if (type === "inbox") {
            dataOther = Score.scoreWithContact(contact, "sent");
        }
        let data = Score.scoreWithContact(contact, type);
        console.log(`data: `);
        console.log(data);

        // let bigFiveTag = document.createElement("div");
        const mult = 2000;

        const dataBigFive = {
            "person": {
                "openness": (data["bigfive"]["openness"])*mult,
                "conscientiousness": (data["bigfive"]["conscientiousness"])*mult,
                "extraversion": (data["bigfive"]["extraversion"])*mult,
                "agreeableness": (data["bigfive"]["agreeableness"])*mult,
                "neuroticism": (data["bigfive"]["neuroticism"])*mult
            },
            "other": {
                "openness": (dataOther["bigfive"]["openness"])*mult,
                "conscientiousness": (dataOther["bigfive"]["conscientiousness"])*mult,
                "extraversion": (dataOther["bigfive"]["extraversion"])*mult,
                "agreeableness": (dataOther["bigfive"]["agreeableness"])*mult,
                "neuroticism": (dataOther["bigfive"]["neuroticism"])*mult
            },
        }


        this.drawBigFiveGraph(dataBigFive);

        // this.userStats.appendChild(bigFiveTag);


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



