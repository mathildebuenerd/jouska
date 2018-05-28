"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _SMS = require("./manageSMS");
var sms = new _SMS.SMSManager();
var sentimentAnalysis_1 = require("./sentimentAnalysis");
var textAnalysis = new sentimentAnalysis_1.TextAnalysis();
var WritingInterface = (function () {
    function WritingInterface() {
        var _this = this;
        this.startAssistance = function () {
            var textArea = document.querySelector('#smsContent');
            textArea.addEventListener('keyup', _this.analyzeText);
            var sendButton = document.querySelector('#sendMessage');
            sendButton.addEventListener('click', _this.sendMessage);
        };
        this.changeSidebarColor = function (color) {
            var sidebar = document.querySelector('#feedback');
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
        this.analyzeText = function () {
            var language = 'fr';
            var textArea = document.querySelector('#smsContent');
            var text = textArea.textContent;
            console.log("text: " + text);
            var allWordsExceptLast = new RegExp(/.+/, 'gim');
            var sentence = text.match(allWordsExceptLast);
            var letters = new RegExp(/\S/, 'gi');
            if (letters.test(sentence[0])) {
                console.log("Sentence existe, voici son analyse:");
                var score = 0;
                var colors = {
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
                var analysis = textAnalysis.sentimentAnalysis(sentence[0], language);
                console.log("analysis:");
                console.dir(analysis);
                if (analysis['score'] !== undefined) {
                    console.log("analysis['score'] existe");
                    console.dir(analysis['score']);
                    score += analysis['score'];
                }
                else {
                    console.log("analysis['score'] n'existe pas");
                    for (var object in analysis) {
                        console.dir(analysis[object]['score']);
                        score += analysis[object]['score'];
                    }
                }
                console.log("colors: " + colors);
                console.log("score: " + score);
                var color_1 = _this.getColor(colors, score);
                _this.changeSidebarColor(color_1);
                console.log("score: " + score);
                if (analysis["negative"].length > 0) {
                    console.log("analysis.negative length > 0");
                    _this.animateNegativeWords(analysis["negative"]);
                }
            }
            else {
                console.warn("sentence n'existe pas, elle est \u00E9gale \u00E0 " + sentence + " et est de type " + typeof sentence);
            }
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
            var message = messageElement.value;
            var confirmationMessage = document.querySelector('#confirmationMessage');
            SMS.sendSMS(recipient, message, function () {
                console.log("sms envoy\u00E9! destinaire: " + recipient + "; message: " + message);
                recipientElement.value = '';
                messageElement.value = '';
                confirmationMessage.textContent = "Message correctement envoyé :)";
            }, function (err) {
                confirmationMessage.textContent = "Il y a eu une erreur, le message n'est pas parti...";
                throw err;
            });
        };
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