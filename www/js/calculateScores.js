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
                    scores.bigfive.openness += analysis.bigfive.O.score;
                    scores.bigfive.conscientiousness += analysis.bigfive.C.score;
                    scores.bigfive.extraversion += analysis.bigfive.E.score;
                    scores.bigfive.agreeableness += analysis.bigfive.A.score;
                    scores.bigfive.neuroticism += analysis.bigfive.N.score;
                    scores.darktriad.machiavellianism += analysis.darktriad.machiavellianism.score;
                    scores.darktriad.narcissism += analysis.darktriad.narcissism.score;
                    scores.darktriad.psychopathy += analysis.darktriad.psychopathy.score;
                    scores.darktriad.triad += analysis.darktriad.triad.score;
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
            scores.bigfive.openness = (scores.bigfive.openness) / totalMessages;
            scores.bigfive.conscientiousness = (scores.bigfive.conscientiousness) / totalMessages;
            scores.bigfive.extraversion = (scores.bigfive.extraversion) / totalMessages;
            scores.bigfive.agreeableness = (scores.bigfive.agreeableness) / totalMessages;
            scores.bigfive.neuroticism = (scores.bigfive.neuroticism) / totalMessages;
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
            if (valence == 'positive' || valence == 'negative') {
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
                                    for (var j = 0; j < (analysis[i][valence]).length; j++) {
                                        words.push(analysis[i][valence][j]);
                                    }
                                }
                            }
                        }
                    }
                }
                return words;
            }
            else {
                console.error("The getMostUsedWords() parameter can't be " + valence + ", it has to be either 'positive' or 'negative");
            }
        };
        this.scorePerTime = function (smsData, timePeriod) {
            console.warn("--------------- TIMEPERIOD: " + timePeriod);
            var periods = {
                "weekday": {
                    "start": 0,
                    "end": 6
                },
                "day": {
                    "start": 1,
                    "end": 31
                },
                "month": {
                    "start": 0,
                    "end": 11
                },
                "year": {
                    "start": 2012,
                    "end": 2018
                },
                "hour": {
                    "start": 0,
                    "end": 23
                },
                "minutes": {
                    "start": 0,
                    "end": 59
                },
                "seconds": {
                    "start": 0,
                    "end": 59
                },
            };
            var scorePerTimePeriod = {};
            for (var i = periods[timePeriod].start; i <= periods[timePeriod].end; i++) {
                scorePerTimePeriod[i] = {
                    "score": 0,
                    "totalMessage": 0
                };
            }
            for (var contact in smsData) {
                for (var type in smsData[contact]) {
                    if (type !== "name") {
                        for (var message in smsData[contact][type]) {
                            var singleMessage = smsData[contact][type][message];
                            var unit = singleMessage.date[timePeriod];
                            if (singleMessage.analysis.sentimentFr.hasOwnProperty("comparative")) {
                                scorePerTimePeriod[unit].score += singleMessage.analysis.sentimentFr.comparative;
                                scorePerTimePeriod[unit].totalMessage++;
                            }
                            else {
                                for (var i = 0; i < (singleMessage.analysis.sentimentFr).length; i++) {
                                    if (typeof singleMessage.analysis.sentimentFr[i] === "object") {
                                        scorePerTimePeriod[unit].score += singleMessage.analysis.sentimentFr[i].comparative;
                                        scorePerTimePeriod[unit].totalMessage++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (var unit in scorePerTimePeriod) {
                scorePerTimePeriod[unit].score = (scorePerTimePeriod[unit].score) / (scorePerTimePeriod[unit].totalMessage);
            }
            return scorePerTimePeriod;
        };
    }
    return CalculateScore;
}());
exports.CalculateScore = CalculateScore;
//# sourceMappingURL=calculateScores.js.map