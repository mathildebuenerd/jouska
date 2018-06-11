"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _SMS = require("./manageSMS");
var sms = new _SMS.SMSManager();
var sentimentAnalysis_1 = require("./sentimentAnalysis");
var textAnalysis = new sentimentAnalysis_1.TextAnalysis();
var getData = require("./getData");
var ManageData = new getData.Installation();
var WritingInterface = (function () {
    function WritingInterface() {
        var _this = this;
        this.startAssistance = function () {
            var textArea = document.querySelector('#smsContent');
            textArea.addEventListener('keyup', _this.analyzeText);
            var sendButton = document.querySelector('#sendMessage');
            sendButton.addEventListener('click', _this.sendMessage);
        };
        this.changeSidebarColor = function (barSelector, color) {
            var sidebar = document.querySelector("#" + barSelector + " > .fill");
            console.log("barselector:", barSelector);
            sidebar.style.backgroundColor = '#' + color;
        };
        this.getColor = function (object, value) {
            if (value > 8) {
                value = 8;
            }
            else if (value < -8) {
                value = -8;
            }
            return Object.keys(object).find(function (key) { return object[key] === value; });
        };
        this.getSentence = function () {
            var textArea = document.querySelector('#smsContent');
            var text = textArea.textContent;
            var allWords = new RegExp(/.+/, 'gim');
            var sentence = text.match(allWords);
            var letters = new RegExp(/\S/, 'gi');
            if (letters.test(sentence[0])) {
                return sentence[0];
            }
            else {
                console.warn("sentence n'existe pas, elle est \u00E9gale \u00E0 " + sentence + " et est de type " + typeof sentence);
            }
        };
        this.showFeedback = function (analysis, type) {
            var score = 0;
            var triad = ["triad", "narcissism", "machiavellianism", "psychopathy"];
            if (type === "polarity" || type === "selfishness") {
                if (analysis['score'] !== undefined) {
                    score += analysis['score'];
                }
                else {
                    for (var object in analysis) {
                        console.log("score " + type + ": " + analysis[object]['score']);
                        score += analysis[object]['score'];
                    }
                }
            }
            else if (triad.indexOf(type) !== -1) {
                score = analysis;
            }
            var color = _this.getColor(_this.colors, score);
            _this.changeSidebarColor(type, color);
        };
        this.analyzeText = function () {
            var language = 'fr';
            var sentence = _this.getSentence();
            if (sentence !== undefined) {
                var polarity = textAnalysis.sentimentAnalysis(sentence, language);
                _this.showFeedback(polarity, "polarity");
                var selfish = textAnalysis.selfishnessAnalysis(sentence, language);
                _this.showFeedback(selfish, "selfishness");
                var ignoreLastWord = new RegExp(/.+[ !?,.:"]/, 'gim');
                var allWordsExceptLast = sentence.match(ignoreLastWord);
                var wordsToAnalyze = String(allWordsExceptLast);
                _this.tempSentences[1] = wordsToAnalyze;
                if (_this.tempSentences[1] !== _this.tempSentences[0]) {
                    console.log("c'est different", _this.tempSentences[1], _this.tempSentences[0]);
                    _this.tempSentences[0] = wordsToAnalyze;
                    textAnalysis.translateToEnglish(wordsToAnalyze)
                        .then(function (englishSentence) {
                        console.log("english sentence: " + englishSentence);
                        var darktriad = textAnalysis.darktriadAnalysis(englishSentence);
                        var interpretation = _this.interpretDarktriad(darktriad);
                        console.log("interpretation", interpretation);
                        for (var trait in interpretation) {
                            _this.showFeedback(interpretation[trait].score, String(trait));
                        }
                    })
                        .catch(function (err) { return console.log(err); });
                }
                else {
                }
            }
        };
        this.interpretDarktriad = function (triad) {
            var analyses = {
                "triad": {
                    "score": 0,
                    "negativeWords": [],
                    "positiveWords": []
                },
                "narcissism": {
                    "score": 0,
                    "negativeWords": [],
                    "positiveWords": []
                },
                "machiavellianism": {
                    "score": 0,
                    "negativeWords": [],
                    "positiveWords": []
                },
                "psychopathy": {
                    "score": 0,
                    "negativeWords": [],
                    "positiveWords": []
                },
            };
            for (var trait in triad) {
                if (triad[trait] !== []) {
                    for (var word in triad[trait]) {
                        var _word = triad[trait][word][0];
                        var wordScore = triad[trait][word][3];
                        if (wordScore > 0) {
                            analyses[trait].score--;
                            analyses[trait].negativeWords.push(_word);
                        }
                        else {
                            analyses[trait].score++;
                            analyses[trait].positiveWords.push(_word);
                        }
                    }
                }
            }
            return analyses;
        };
        this.animateNegativeWords = function (words) {
            console.log("words:");
            console.log(words);
            var textArea = document.querySelector('#smsContent');
            for (var word in words) {
                var slicedWord = _this.sliceWord(words[word], "negative");
                console.log("slicedWord:");
                console.log(slicedWord);
                console.log("textarea.value: " + textArea.textContent);
                var toReplace = new RegExp("" + words[word], 'gi');
                textArea.innerHTML = (textArea.textContent).replace(toReplace, slicedWord);
            }
            var wordsToAnimate = document.querySelectorAll(".negative");
            if (wordsToAnimate !== undefined) {
                for (var singleWord in wordsToAnimate) {
                    var lettersToAnimate = wordsToAnimate[singleWord].querySelectorAll("span");
                    for (var letter in lettersToAnimate) {
                        var aLetter = lettersToAnimate[letter];
                        var randomValue = Math.floor(Math.random() * 3);
                        aLetter.style.animationName = "marionettes" + randomValue;
                    }
                }
            }
        };
        this.setEndOfContenteditable = function (contentEditableElement) {
            var range, selection;
            range = document.createRange();
            range.selectNodeContents(contentEditableElement);
            range.collapse(false);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        };
        this.sendMessage = function () {
            var recipientElement = document.querySelector('#contactNumber');
            var recipient = recipientElement.value;
            var messageElement = document.querySelector('#smsContent');
            var message = messageElement.textContent;
            var confirmationMessage = document.querySelector('#confirmationMessage');
            SMS.sendSMS(recipient, message, function () {
                console.log("sms envoy\u00E9! destinaire: " + recipient + "; message: " + message);
                recipientElement.value = '';
                messageElement.contentEditable = "false";
                messageElement.style.border = "none";
                messageElement.style.color = "#aaa";
                confirmationMessage.textContent = "Message correctement envoyé :)";
            }, function (err) {
                confirmationMessage.textContent = "Il y a eu une erreur, le message n'est pas parti...\n            Erreur: " + err;
                throw err;
            });
        };
        this.colors = {
            "a5f31b": 8,
            "a4ed2b": 7,
            "a2e739": 6,
            "a1dc52": 5,
            "a1d16b": 4,
            "a1c087": 3,
            "a1b595": 2,
            "a1a69f": 1,
            "a39ba1": 0,
            "ae849b": -1,
            "b57794": -2,
            "c26185": -3,
            "cf4c74": -4,
            "db3863": -5,
            "e82551": -6,
            "f21542": -7,
            "fb0736": -8
        };
        this.tempSentences = ["", ""];
    }
    WritingInterface.prototype.sliceWord = function (word, elmtClass) {
        var tag = "<span class=\"" + elmtClass + "\">";
        for (var letter = 0; letter < word.length; letter++) {
            tag += "<span>" + word[letter] + "</span>";
        }
        tag += "</span>";
        return tag;
    };
    return WritingInterface;
}());
exports.WritingInterface = WritingInterface;
//# sourceMappingURL=writingInterface.js.map