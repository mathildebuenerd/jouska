/**
 * Created by mathi on 05/05/2018.
 */

export class CalculateScore {


    scoreWithContact=(contact: string, type: string): object => {

        const smsData = JSON.parse(localStorage.getItem('smsData'));
        console.log(smsData);

        const messages = smsData[contact];

        let scores = {
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

        for (const sms in messages[type]) {
            if (messages[type].hasOwnProperty(sms)) {
                const analysis = messages[type][sms].analysis;
                // console.log(`scores.bigfive.openness ${scores.bigfive.openness}`);
                // console.log(`typeof analysis.bigfive.O ${typeof analysis.bigfive.O}`);
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

                // Si la phrase est trop longue, on la découpe en sous-phrases avant de faire l'analyse de sentiment
                // on peut donc avoir un tableau d'objets
                if (analysis.sentiment.hasOwnProperty(scores)) {
                    scores.sentiment.comparative += analysis.sentiment.comparative;
                    scores.sentiment.score += analysis.sentiment.score;
                } else {
                    for (let i=0; i<(analysis.sentiment).length; i++) {
                        if (typeof (analysis.sentiment)[i] === "object") {
                            scores.sentiment.comparative += (analysis.sentiment)[i].comparative;
                            scores.sentiment.score += (analysis.sentiment)[i].score;
                        }
                    }
                }
            }
        }

        // console.group('Scores');
        // console.log(`scores ajoutés: `);
        // console.log(scores);

        const totalMessages = Object.keys(messages[type]).length; // nombre total de messages
        // console.log(`total messages: ${totalMessages}`);
        // console.log(`typeof total messages ${typeof totalMessages}`);

        // on divise le score par le nombre de messages pour certaines analyses
        // pour certaines ce n'est pas utile, par exemple pour les big five, ce qui est intéressant ce n'est pas le score total mais la différence entre les différentes "pôles"
        scores.darktriad.machiavellianism = (scores.darktriad.machiavellianism)/totalMessages;
        scores.darktriad.narcissism = (scores.darktriad.narcissism)/totalMessages;
        scores.darktriad.psychopathy = (scores.darktriad.psychopathy)/totalMessages;
        scores.darktriad.triad = (scores.darktriad.triad)/totalMessages;

        scores.gender = (scores.gender)/totalMessages;

        scores.sentiment.score = (scores.sentiment.score)/totalMessages;

        scores.temporalOrientation.past = (scores.temporalOrientation.past)/totalMessages;
        scores.temporalOrientation.present = (scores.temporalOrientation.present)/totalMessages;
        scores.temporalOrientation.future = (scores.temporalOrientation.future)/totalMessages;

        scores.bigfive.openness = (scores.bigfive.openness)/totalMessages;
        scores.bigfive.conscientiousness = (scores.bigfive.conscientiousness)/totalMessages;
        scores.bigfive.extraversion = (scores.bigfive.extraversion)/totalMessages;
        scores.bigfive.agreeableness = (scores.bigfive.agreeableness)/totalMessages;
        scores.bigfive.neuroticism = (scores.bigfive.neuroticism)/totalMessages;

        scores.totalMessages = totalMessages;

        // console.log(`scores finaux: `);
        // console.log(scores);

        console.groupEnd();

        return scores;


    };

    compareScores=(contact: string, type: any) => {
        const userScore: object = this.scoreWithContact(contact, "sent");
        const contactScore = this.scoreWithContact(contact, "inbox");

        // console.log(userScore);
        // console.log(co)

        if (type in userScore) {
            console.log(`userscore:`);
            console.log(userScore[type]);
        }

    };

    getMostUsedWords= (valence: string, contact: string, type: string, language: string = "en"): string[] => {

        let words = [];

        // language is fr or en, default is en
        // type is either inbox or sent
        // contact is the phone number
        // valence is either 'positive' or 'negative'
        if (valence == 'positive' || valence == 'negative') {
            const smsData = JSON.parse(localStorage.getItem('smsData'));
            const messages = smsData[contact][type];
            for (const sms in messages) {
                let analysis;
                if (language === "en") {
                    analysis = messages[sms].analysis.sentiment;
                } else if (language === "fr") {
                    analysis = messages[sms].analysis.sentimentFr;
                }
                // Si la phrase est trop longue, on la découpe en sous-phrases avant de faire l'analyse de sentiment
                // on peut donc avoir soit un objet, soit un tableau d'objets
                if (analysis.hasOwnProperty(valence)) {
                    if (analysis[valence].length > 0) {
                        for (let i=0; i<(analysis[valence]).length; i++) {
                            words.push(analysis[valence][i]);
                        }
                    }
                } else {
                    for (let i=0; i<analysis.length; i++) {
                        if (typeof analysis[i] === "object") {
                            // console.log(`valence, tableau / positive words:`);
                            // console.log(analysis[i][valence]);
                            if (analysis[i][valence].length > 0) {
                                for (let j=0; j<(analysis[i][valence]).length; j++) {
                                    words.push(analysis[i][valence][j]);
                                }
                            }
                        }
                    }
                }
            }
            return words;
        } else {
            console.error(`The getMostUsedWords() parameter can't be ${valence}, it has to be either 'positive' or 'negative`);
        }


    };

    scorePerTime= (smsData: object, timePeriod: string) => {

        console.warn(`--------------- TIMEPERIOD: ${timePeriod}`);

        const periods = {
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

        let scorePerTimePeriod = {};
        for (let i=periods[timePeriod].start; i<=periods[timePeriod].end; i++) {
            scorePerTimePeriod[i] = {
                "score": 0,
                "totalMessage": 0
            };
        }

        for (const contact in smsData) {
            for (const type in smsData[contact]) {
                if (type !== "name") {
                    for (const message in smsData[contact][type]) {
                        const singleMessage = smsData[contact][type][message];
                        const unit = singleMessage.date[timePeriod]; // unit c'est l'heure de 0 à 23, le jour de 0 à 30 etc../
                        if (singleMessage.analysis.sentimentFr.hasOwnProperty("comparative")) {
                            // console.log(`comparative score ${singleMessage.analysis.sentimentFr.comparative}`);
                            // console.log(`score per time period unit`);
                            // console.log(scorePerTimePeriod);
                            // console.log(scorePerTimePeriod[unit]);
                            scorePerTimePeriod[unit].score += singleMessage.analysis.sentimentFr.comparative;
                            scorePerTimePeriod[unit].totalMessage++;
                            // console.log(`score per hour: ${scorePerTimePeriod[unit].score}`);
                        } else {
                            for (let i=0; i<(singleMessage.analysis.sentimentFr).length; i++) {
                                if (typeof singleMessage.analysis.sentimentFr[i] === "object") {
                                    // console.log(`timePeriod: ${timePeriod}, unit: ${unit}`);
                                    // console.log(`scorePerTimePeriod[unit]`);
                                    // console.log(scorePerTimePeriod[unit]);
                                    scorePerTimePeriod[unit].score += singleMessage.analysis.sentimentFr[i].comparative;
                                    scorePerTimePeriod[unit].totalMessage++;
                                }
                            }
                        }
                    }
                }
            }
        }

        for (const unit in scorePerTimePeriod) {
            // console.log(`scorePerHour[hour].score: ${scorePerHour[hour].score}`);
            // console.log(`scorePerHour[hour].totalMessages: ${scorePerHour[hour].totalMessage}`);
            scorePerTimePeriod[unit].score = (scorePerTimePeriod[unit].score)/(scorePerTimePeriod[unit].totalMessage);
        }

        return scorePerTimePeriod;
    }
}