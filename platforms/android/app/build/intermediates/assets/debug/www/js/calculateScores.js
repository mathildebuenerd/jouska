"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CalculateScore = (function () {
    function CalculateScore() {
        var _this = this;
        this.scoreWithContact = function (contact, type) {
            var smsData = JSON.parse(localStorage.getItem('smsData'));
            console.log(smsData);
            var messages = smsData[contact];
            var scores = {
                "bigfive": {
                    "openness": 0,
                    "conscientiousness": 0,
                    "extraversion": 0,
                    "agreeableness": 0,
                    "neuroticism": 0
                },
                "darktriad": {
                    "machiavellianism": 0,
                    "narcissism": 0,
                    "psychopathy": 0,
                    "triad": 0
                },
                "gender": 0,
                "sentiment": {
                    "comparative": 0,
                    "score": 0
                },
                "temporalOrientation": {
                    "past": 0,
                    "present": 0,
                    "future": 0
                },
                "totalMessages": 0
            };
            for (var sms in messages[type]) {
                if (messages[type].hasOwnProperty(sms)) {
                    var analysis = messages[type][sms].analysis;
                    scores.bigfive.openness += analysis.bigfive.O;
                    scores.bigfive.conscientiousness += analysis.bigfive.C;
                    scores.bigfive.extraversion += analysis.bigfive.E;
                    scores.bigfive.agreeableness += analysis.bigfive.A;
                    scores.bigfive.neuroticism += analysis.bigfive.N;
                    scores.darktriad.machiavellianism += analysis.darktriad.machiavellianism;
                    scores.darktriad.narcissism += analysis.darktriad.narcissism;
                    scores.darktriad.psychopathy += analysis.darktriad.psychopathy;
                    scores.darktriad.triad += analysis.darktriad.triad;
                    scores.gender += analysis.gender.GENDER;
                    scores.temporalOrientation.past += analysis.temporalOrientation.PAST;
                    scores.temporalOrientation.present += analysis.temporalOrientation.PRESENT;
                    scores.temporalOrientation.future += analysis.temporalOrientation.FUTURE;
                    if (analysis.sentiment.hasOwnProperty(scores)) {
                        scores.sentiment.comparative += analysis.sentiment.comparative;
                        scores.sentiment.score += analysis.sentiment.score;
                    }
                    else {
                        for (var i = 0; i < (analysis.sentiment).length; i++) {
                            if (typeof (analysis.sentiment)[i] === "object") {
                                scores.sentiment.comparative += (analysis.sentiment)[i].comparative;
                                scores.sentiment.score += (analysis.sentiment)[i].score;
                            }
                        }
                    }
                }
            }
            var totalMessages = Object.keys(messages[type]).length;
            scores.darktriad.machiavellianism = (scores.darktriad.machiavellianism) / totalMessages;
            scores.darktriad.narcissism = (scores.darktriad.narcissism) / totalMessages;
            scores.darktriad.psychopathy = (scores.darktriad.psychopathy) / totalMessages;
            scores.darktriad.triad = (scores.darktriad.triad) / totalMessages;
            scores.gender = (scores.gender) / totalMessages;
            scores.sentiment.score = (scores.sentiment.score) / totalMessages;
            scores.temporalOrientation.past = (scores.temporalOrientation.past) / totalMessages;
            scores.temporalOrientation.present = (scores.temporalOrientation.present) / totalMessages;
            scores.temporalOrientation.future = (scores.temporalOrientation.future) / totalMessages;
            scores.totalMessages = totalMessages;
            console.groupEnd();
            return scores;
        };
        this.compareScores = function (contact, type) {
            var userScore = _this.scoreWithContact(contact, "sent");
            var contactScore = _this.scoreWithContact(contact, "inbox");
            if (type in userScore) {
                console.log("userscore:");
                console.log(userScore[type]);
            }
        };
        this.getMostUsedWords = function (valence, contact, type, language) {
            if (language === void 0) { language = "en"; }
            var words = [];
            if (valence !== 'positive' && type !== 'negative') {
                console.error("The getMostUsedWords() parameter has to be either 'positive' or 'negative");
            }
            var smsData = JSON.parse(localStorage.getItem('smsData'));
            var messages = smsData[contact][type];
            for (var sms in messages) {
                var analysis = void 0;
                if (language === "en") {
                    analysis = messages[sms].analysis.sentiment;
                }
                else if (language === "fr") {
                    analysis = messages[sms].analysis.sentimentFr;
                }
                if (analysis.hasOwnProperty(valence)) {
                    if (analysis[valence].length > 0) {
                        for (var i = 0; i < (analysis[valence]).length; i++) {
                            words.push(analysis[valence][i]);
                        }
                    }
                }
                else {
                    for (var i = 0; i < analysis.length; i++) {
                        if (typeof analysis[i] === "object") {
                            if (analysis[i][valence].length > 0) {
                                for (var i_1 = 0; i_1 < (analysis[i_1][valence]).length; i_1++) {
                                    words.push(analysis[i_1][valence][i_1]);
                                }
                            }
                        }
                    }
                }
            }
            return words;
        };
    }
    return CalculateScore;
}());
exports.CalculateScore = CalculateScore;
//# sourceMappingURL=calculateScores.js.map