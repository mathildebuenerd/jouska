"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scores = require("./calculateScores");
var Score = new scores.CalculateScore();
var sms = require("./manageSMS");
var Sms = new sms.SMSManager();
var Datavisualisation = (function () {
    function Datavisualisation() {
        var _this = this;
        this.drawBigFiveGraph = function (data) {
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