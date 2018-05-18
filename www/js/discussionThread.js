"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DiscussionThread = (function () {
    function DiscussionThread() {
        var _this = this;
        this.showContactThread = function (contact) {
            var smsData = JSON.parse(localStorage.getItem('smsData'));
            var messagesList = [];
            var thread = document.querySelector("#discussion-thread");
            for (var type in smsData[contact]) {
                if (type !== "name") {
                    for (var smsId in smsData[contact][type]) {
                        var sms = smsData[contact][type][smsId];
                        var bubble = _this.createMessageBubble(sms, smsId);
                        console.log("bubble:");
                        console.log(bubble);
                        thread.appendChild(bubble);
                    }
                }
            }
            console.log("j'ai fini d'ajouter mes bulles \u00E0 mon thread");
        };
        this.createMessageBubble = function (sms, id) {
            console.log("voici l'objet re\u00E7u dans createMessageBubble:");
            console.log(sms);
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
    }
    return DiscussionThread;
}());
exports.DiscussionThread = DiscussionThread;
//# sourceMappingURL=discussionThread.js.map