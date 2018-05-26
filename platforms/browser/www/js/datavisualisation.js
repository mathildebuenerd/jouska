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
        this.bigFiveGraph = function (contact, type) {
            var data = Score.scoreWithContact(contact, type);
            var dataUser = Score.scoreWithContact(contact, "sent");
            console.log("data: ");
            console.log(data);
            var bigFiveTag = document.createElement("div");
            bigFiveTag.textContent = "\n        Openess: " + data["bigfive"]["openness"] + ", \n        Conscious: " + data["bigfive"]["conscientiousness"];
            var mult = 300;
            var rO = (data["bigfive"]["openness"]) * mult;
            var rC = (data["bigfive"]["conscientiousness"]) * mult;
            new p5(function (monSketch) {
                var x = 100;
                var y = 100;
                monSketch.setup = function () {
                    monSketch.createCanvas(700, 410);
                };
                monSketch.draw = function () {
                    monSketch.background(0);
                    monSketch.fill(255);
                    monSketch.rect(x, y, 50, 50);
                };
            });
            _this.userStats.appendChild(bigFiveTag);
        };
        this.userStats = document.querySelector("#userStats");
        this.contactStats = document.querySelector("#contactStats");
    }
    Datavisualisation.prototype.testp5 = function () {
        new p5(function (monSketch) {
            var x = 100;
            var y = 100;
            monSketch.setup = function () {
                monSketch.createCanvas(700, 410);
            };
            monSketch.draw = function () {
                monSketch.background(0);
                monSketch.fill(255);
                monSketch.rect(x, y, 50, 50);
            };
        });
    };
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