"use strict";

const fs = require("fs"); // fs is built into node, no need to for an "npm -install"
const jsonPretty = require("json-pretty"); // need to do "npm -install json-pretty"
const words = require("./words_js.js"); // in local directory, from Buis' spelling correction project on GitHub
const lexicon = words.getLexicon(); // bug in words.js, workaround:
                                    // call getLexicon() before getDictionary()!
const dictionary = words.getDictionary();

function readCommonMisspellings() {
    const lines = fs.readFileSync("common.txt", "utf-8").split(/\r\n|\n|\r/);
    const misspellings = {};
    for (let line of lines) {
        let misspelling = "";
        let corrections = [];
        // see documentation for split at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
        // consider using split() function to break line into array of size 2 using something like /\s*->\s*/ for separator"
        // for comma separated list of words, consider using split again with a separator
        // of /\s*,\s*/ (a regular expression for zero or more whitespace space characters, followed by a comma
    // followed by zero or more whitespace characters)
        misspelling = line.split('->')[0];
        corrections = line.split('->')[1].split(', ');
        misspellings[misspelling] = corrections;
    }
    return Object.freeze(misspellings);
}

const misspellings = readCommonMisspellings();
// if jsonPretty not availble, JSON.stringify() will work, but be less pretty
fs.writeFileSync("common.json", jsonPretty(misspellings));


function common(misspelling) {
    const corrections = misspellings[misspelling];
    if (!corrections) {
        return undefined;
    }
    if (correction.length == 1) {
        return corrections[0];
    }
    for (let line of dictionary) {
        for (let correction of correction) {
            if (line == correction) {
                return correction;
            }
        }
    }
}

console.log(`common("aboat") returns ${common("aboat")}`,
    `${common("aboat")===undefined ? "(pass)" : "(fail)"}`);
console.log(`common("abotu") returns ${common("abotu")}`,
    `${common("abotu")==="about" ? "(pass)" : "(fail)"}`);
console.log(`dictionary["accession"] evaluates to ${dictionary["accession"]}`);
console.log(`dictionary["ascension"] evaluates to ${dictionary["ascension"]}`);
console.log(`common("accension") returns ${common("accension")}`,
    `${common("accension")==="accession" ? "(pass)" : "(fail)"}`);