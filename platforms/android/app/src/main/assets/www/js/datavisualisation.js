"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scores = require("./calculateScores");
var Score = new scores.CalculateScore();
var sms = require("./manageSMS");
var Sms = new sms.SMSManager();
require("./../../hooks/p5");
var Datavisualisation = (function () {
    function Datavisualisation() {
        var _this = this;
        this.drawBigFiveGraph = function (data) {
            new p5(function (bigFive) {
                var colors = [
                    "#2121ff",
                    "#00ffff",
                    "#f2f2f2",
                    "#eccbd9",
                    "#e1eff6"
                ];
                var values = [
                    data["person"]["openness"],
                    data["person"]["conscientiousness"],
                    data["person"]["extraversion"],
                    data["person"]["agreeableness"],
                    data["person"]["neuroticism"]
                ];
                var valuesOther = [
                    data["other"]["openness"],
                    data["other"]["conscientiousness"],
                    data["other"]["extraversion"],
                    data["other"]["agreeableness"],
                    data["other"]["neuroticism"]
                ];
                var traits = [
                    "openness",
                    "conscientiousness",
                    "extraversion",
                    "agreeableness",
                    "neuroticism"
                ];
                var y = 100;
                var offset = 45;
                bigFive.setup = function () {
                    var cnv = bigFive.createCanvas(window.innerWidth, 200);
                    cnv.parent("userStats");
                    bigFive.noStroke();
                    bigFive.drawGraph();
                };
                bigFive.drawText = function (txt, clr, x, y) {
                    bigFive.noStroke();
                    bigFive.fill(clr);
                    bigFive.textAlign(bigFive.CENTER);
                    bigFive.textSize(10);
                    bigFive.text(txt, x, y);
                    bigFive.noFill();
                };
                bigFive.drawGraph = function () {
                    for (var i = 0; i < 5; i++) {
                        bigFive.noStroke();
                        if (values[i] > 0) {
                            bigFive.fill(colors[i]);
                        }
                        else {
                            bigFive.fill("black");
                        }
                        var x = 60 * i + offset;
                        bigFive.ellipse(x, y, values[i], values[i]);
                        bigFive.drawText(traits[i], "black", x, y + 30);
                        bigFive.noFill();
                        if (valuesOther[i] > 0) {
                            bigFive.stroke("#ff00ff");
                        }
                        else {
                            bigFive.stroke("#aaaaaa");
                        }
                        bigFive.ellipse(x, y, valuesOther[i], valuesOther[i]);
                    }
                };
                bigFive.draw = function () {
                };
            });
        };
        this.bigFiveGraph = function (contact, type) {
            var dataOther;
            if (type === "sent") {
                dataOther = Score.scoreWithContact(contact, "inbox");
            }
            else if (type === "inbox") {
                dataOther = Score.scoreWithContact(contact, "sent");
            }
            var data = Score.scoreWithContact(contact, type);
            console.log("data: ");
            console.log(data);
            var mult = 2000;
            var dataBigFive = {
                "person": {
                    "openness": (data["bigfive"]["openness"]) * mult,
                    "conscientiousness": (data["bigfive"]["conscientiousness"]) * mult,
                    "extraversion": (data["bigfive"]["extraversion"]) * mult,
                    "agreeableness": (data["bigfive"]["agreeableness"]) * mult,
                    "neuroticism": (data["bigfive"]["neuroticism"]) * mult
                },
                "other": {
                    "openness": (dataOther["bigfive"]["openness"]) * mult,
                    "conscientiousness": (dataOther["bigfive"]["conscientiousness"]) * mult,
                    "extraversion": (dataOther["bigfive"]["extraversion"]) * mult,
                    "agreeableness": (dataOther["bigfive"]["agreeableness"]) * mult,
                    "neuroticism": (dataOther["bigfive"]["neuroticism"]) * mult
                },
            };
            _this.drawBigFiveGraph(dataBigFive);
        };
        this.userStats = document.querySelector("#userStats");
        this.contactStats = document.querySelector("#contactStats");
    }
    Datavisualisation.prototype.calculateUserScore = function () {
    };
    Datavisualisation.prototype.calculateUserScoreWithContact = function (contact) {
    };
    Datavisualisation.prototype.perDay = function () {
    };
    Datavisualisation.prototype.calculateScorePerWeek = function () {
    };
    Datavisualisation.prototype.getWords = function (valence, phonenumber, type, lang) {
        if (valence === void 0) { valence = ("positive" || "negative"); }
        if (type === void 0) { type = ("inbox" || "sent"); }
        if (lang === void 0) { lang = "fr"; }
        var words = Score.getMostUsedWords(valence, phonenumber, type, lang);
        console.log("words");
        console.table(words);
        var title = document.createElement("h2");
        var contactName = Sms.getContactName(phonenumber);
        title.textContent = "Words " + valence + " from " + contactName;
        var wordList = document.createElement("ul");
        wordList.classList.add(valence + "-wordList", "wordList");
        for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
            var word = words_1[_i];
            var wordTag = document.createElement("li");
            wordTag.textContent = word;
            wordList.appendChild(wordTag);
        }
        this.userStats.appendChild(title);
        this.userStats.appendChild(wordList);
    };
    return Datavisualisation;
}());
exports.Datavisualisation = Datavisualisation;
//# sourceMappingURL=datavisualisation.js.map