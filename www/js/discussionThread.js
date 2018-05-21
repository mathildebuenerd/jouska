"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DiscussionThread = (function () {
    function DiscussionThread() {
        var _this = this;
        this.showContactThread = function (contact) {
            console.log("showDiscussionThread");
            var smsList = JSON.parse(localStorage.getItem('smsList'));
            console.log("smsList:");
            console.log(smsList);
            var thread = document.querySelector("#discussion-thread");
            for (var smsId in smsList[contact]) {
                var sms = smsList[contact][smsId];
                var analysis = smsList[contact][smsId]["analysis"];
                var bubble = _this.createMessageBubble(sms, smsId);
                var bubbleAnalyzed = _this.createTags(bubble, analysis);
                thread.appendChild(bubbleAnalyzed);
            }
            window.scrollTo(0, document.body.clientHeight);
            console.log("j'ai fini d'ajouter mes bulles \u00E0 mon thread");
        };
        this.createMessageBubble = function (sms, id) {
            var tag = document.createElement("div");
            tag.classList.add("singleSMS");
            tag.classList.add(sms["type"]);
            tag.id = id;
            var text = document.createElement("p");
            text.textContent = sms["text"]["original"];
            text.classList.add("smsText");
            tag.appendChild(text);
            return tag;
        };
        this.createTags = function (sms, analyses) {
            var tag = sms;
            var analysis = ["sentimentFr", "selfishness"];
            var valence = ["positive", "negative"];
            for (var _i = 0, analysis_1 = analysis; _i < analysis_1.length; _i++) {
                var a = analysis_1[_i];
                if (Array.isArray(analyses[a])) {
                    for (var i = 0; i < analyses[a].length; i++) {
                        for (var v = 0; v < valence.length; v++) {
                            if (analyses[a][i][valence[v]].length > 0) {
                                for (var j = 0; j < analyses[a][i][valence[v]].length; j++) {
                                    tag = _this.addClassToWord(analyses[a][i][valence[v]][j], tag, a, valence[v]);
                                }
                            }
                        }
                    }
                }
                else {
                    for (var v = 0; v < valence.length; v++) {
                        if (analyses[a][valence[v]].length > 0) {
                            for (var i = 0; i < analyses[a][valence[v]].length; i++) {
                                tag = _this.addClassToWord(analyses[a][valence[v]][i], tag, a, valence[v]);
                            }
                        }
                    }
                }
            }
            while (tag.firstChild.nodeName.toLowerCase() !== "p") {
                tag = tag.firstChild;
            }
            console.log("je renvoie");
            console.log(tag);
            return tag;
        };
        this.addClassToWord = function (wordToFind, tag, analysis, valence) {
            var elmtClass = "";
            if (analysis == "sentimentFr") {
                elmtClass = "sentiment-" + valence;
            }
            else if (analysis == "selfishness") {
                elmtClass = "selfish-" + valence;
            }
            if ((tag.outerHTML).indexOf(wordToFind) === -1) {
                wordToFind = wordToFind.charAt(0).toUpperCase() + wordToFind.slice(1);
            }
            var wordWithTag = "<span class=\"" + elmtClass + "\">" + wordToFind + "</span>";
            var newTag = (tag.outerHTML).replace(wordToFind, wordWithTag);
            tag.innerHTML = newTag;
            return tag;
        };
    }
    return DiscussionThread;
}());
exports.DiscussionThread = DiscussionThread;
//# sourceMappingURL=discussionThread.js.map