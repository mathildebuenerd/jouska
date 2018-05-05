/**
 * Created by mathi on 05/05/2018.
 */

export class CalculateScore {


    scoreWithContact(contact: string, type: string): object {

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

        scores.totalMessages = totalMessages;

        // console.log(`scores finaux: `);
        // console.log(scores);

        console.groupEnd();

        return scores;


    }


}