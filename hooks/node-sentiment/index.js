/*
 * Multilanguage AFINN-based sentiment analysis for Node.js
 */
var oDictionary = require('./lib/AFINN.js');
var oLangDetect = new (require('languagedetect'));

var frenchExtraWords = {
    'bien': 2,
    'bise': 2,
    'bisou': 2,
    'bisous': 2,
    'bonne': 3,
    'cimer': 2,
    'comme': 0,
    'coucou': 2,
    'dommage': -4,
    'nickel': 2,
    'morte': -3,
    'parfait': 3,
    'ptin': -5,
    'super': 5
};

Object.assign(oDictionary['fr'], frenchExtraWords); // on ajoute le lexique personnalisé au lexique


/**
 * Split a sentence into words
 *
 * @param sInput
 * @returns {Array}
 */
function tokenize(sInput) {

    if (sInput.length === 0) {
        return [];
    }

    return sInput
        .toLowerCase()
        .replace(/\r?\n|\r/g, ' ') // line breaks replaced by space https://stackoverflow.com/a/10805292
        .replace(/[.,\/#!$%\^&\*;:{}=_`\"~()]/g, '')
        .replace(/\s{2,}/g, ' ') // remove extra spaces https://stackoverflow.com/a/4328722
        .split(' ');
};

// Performs sentiment analysis on the provided input 'phrase'
module.exports = function (sPhrase, sLangCode, mCallback) {

    if (typeof sPhrase === 'undefined') {
        sPhrase = '';
    }


    // Storage objects
    var aTokens = tokenize(sPhrase),
        iGlobalScore = 0,
        aWords = [],
        aPositive = [],
        aNegative = [],
        bNegation = false;


    // Detect language if needed (beta must be performed on each word for more efficiency)
    if (sLangCode == null) {
        var aDetectedLang = oLangDetect.detect(aTokens.join(' '), 2);
        console.log('aDetectLang');
        console.log(`sentence ${aTokens.join(' ')}`);
        console.log(aDetectedLang);
        if (aDetectedLang[0]) {
            sLangCode = aDetectedLang[0][0].substring(0, 2);
        }
    }

    // Iterate over tokens
    var len = aTokens.length;
    while (len--) {
        var sToken = String(aTokens[len]), iCurrentScore = 0;

        // Negation flag
        if (oDictionary["negations"][sLangCode] && oDictionary["negations"][sLangCode][sToken]) {
            bNegation = true;
        }

        if (! oDictionary[sLangCode] || ! oDictionary[sLangCode][sToken]) {
            if (! oDictionary['emoji'][sToken]) {
                continue;
            }
            // It's an emoji
            iCurrentScore = Number(oDictionary['emoji'][sToken]);
        } else {
            // It's a word
            iCurrentScore = Number(oDictionary[sLangCode][sToken]);
        }

        aWords.push(String(sToken));
        if (iCurrentScore > 0) {
            aPositive.push(String(sToken));
        } else if (iCurrentScore < 0) {
            aNegative.push(String(sToken));
        }
        iGlobalScore += iCurrentScore;
    }

    // Handle negation detection flag
    // Plutot que de multiplier par -1 s'il y a une négation, on enlève -3, ça évite qu'il y ai des scores trop bas dans des propositions où il n'y a qu'une négation et plusieurs mots positifs
    iGlobalScore = iGlobalScore + (bNegation === true ? -3 : 0);





    // On regarde s'il y a des smileys 'inline' comme :) ou :-) ou ^^
    // On le fait après le calcul de la négation, car leur valeur ne doit pas être inversée s'il y a une négation
    let inlineSmileys = new RegExp(/(<[\/\\]?3|[()/|*$][-^]?[:;=]|x[d()]|\^[a-z._-]{0,1}\^['"]{0,1}|[:;=B8][\-^]?[3DOPp@$*\\)(\/|])(?=\s|[!.?]|$)/, 'gim'); // detect smileys like :) ;) :p :/ =/ :-) :( :D xD :-)
    // il faut convertir les smileys reçus en lowercase
    const smileyValues = {
        ':)': 5,
        ';)': 5,
        ':(': -5,
        'x)': 5,
        ':p': 4,
        ':o': -2,
        ':3': -3,
        ':|': -4,
        ':/': -4,
        ':\\': -4,
        ':$': -3,
        ':*': 5,
        ':@': -3,
        ':-)': 5,
        ';-)': 5,
        ':-(': -5,
        ':-p': 4,
        ':-o': -2,
        ':-3': -3,
        ':-|': -4,
        ':-/': -4,
        ':-\\': -4,
        ':-$': -3,
        ':-*': 4,
        ':-@': -2,
        '(:': 5,
        '):': -5,
        '(x': 5,
        '$:': -3,
        '*:': 5,
        '/:': -4,
        '\\:': -4,
        '(-:': 5,
        ')-:': -5,
        '$-:': -3,
        '*-:': 5,
        '/-:': -4,
        '\\-:': -4,
        '<3': 5,
        '</3': -5,
        '<\\3': -5,
        '^^': 3,
        '^.^': 3,
        '^o^': 5,
        '^-^': 3,
        '^_^': 3,
        '^^"': -3,
        "^^'": -3,
        'xd': 4
    };

    let smileyArray;
    while ((smileyArray = inlineSmileys.exec(sPhrase.toLocaleLowerCase())) !== null) { // pour chaque smiley
        console.log('smileyArray');
        console.log(smileyArray);

        // la fonction ne trouve que le premier smiley de la proposition
        // elle pourrait être améliorée
        const smileyScore = smileyValues[smileyArray[0]]; // on récupère la valeur du smiley
        iGlobalScore += Number(smileyScore); // on ajoute la valeur du smiley au score global

        // on ajoute le smiley dans le tableau des mots positfs/négatifs
        if (smileyScore > 0) {
            aPositive.push(String(smileyArray[0]));
        } else {
            aNegative.push(String(smileyArray[0]));
        }
    }

    // Handle optional async interface
    var oResult = {
        score: iGlobalScore,
        comparative: iGlobalScore / aTokens.length,
        vote: 'neutral',
        tokens: aTokens,
        words: aWords,
        positive: aPositive,
        negative: aNegative,
        negation: bNegation,
        language: sLangCode
    };

    // Classify text as positive, negative or neutral.
    if (oResult.score > 0) {
        oResult.vote = 'positive';
    } else if (oResult.score < 0) {
        oResult.vote = 'negative';
    }

    if (mCallback == null) {
        return oResult;
    }

    process.nextTick(function () {
        mCallback(null, oResult);
    });
};
