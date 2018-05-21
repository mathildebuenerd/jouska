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
        this.createTags = function (sms, analysis) {
            var tag = sms;
            var sentiment = analysis["sentimentFr"];
            var valence = ["positive", "negative"];
            if (Array.isArray(sentiment)) {
                for (var i = 0; i < sentiment.length; i++) {
                    for (var v = 0; v < valence.length; v++) {
                        if (sentiment[i][valence[v]].length > 0) {
                            for (var j = 0; j < sentiment[i][valence[v]].length; j++) {
                                if ((tag.outerHTML).indexOf(sentiment[i][valence[v]][j]) !== -1) {
                                    var wordWithTag = "<span class=\"" + valence[v] + "Word\">" + sentiment[i][valence[v]][j] + "</span>";
                                    var newTag = (tag.outerHTML).replace(sentiment[i][valence[v]][j], wordWithTag);
                                    tag.innerHTML = newTag;
                                }
                            }
                        }
                    }
                }
            }
            else {
                for (var v = 0; v < valence.length; v++) {
                    if (sentiment[valence[v]].length > 0) {
                        for (var i = 0; i < sentiment[valence[v]].length; i++) {
                            if ((tag.outerHTML).indexOf(sentiment[valence[v]][i]) !== -1) {
                                var wordWithTag = "<span class=\"" + valence[v] + "Word\">" + sentiment.positive[i] + "</span>";
                                var newTag = (tag.outerHTML).replace(sentiment[valence[v]][i], wordWithTag);
                                tag.innerHTML = newTag;
                            }
                        }
                    }
                }
            }
            console.log("my tag is:");
            console.log(tag);
            console.log("I return:");
            while (tag.firstChild.nodeName.toLowerCase() !== "p") {
                tag = tag.firstChild;
            }
            return tag;
        };
    }
    return DiscussionThread;
}());
exports.DiscussionThread = DiscussionThread;
//# sourceMappingURL=discussionThread.js.map