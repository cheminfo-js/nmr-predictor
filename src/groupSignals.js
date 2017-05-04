'use strict';

/**
 *
 * @param signals
 * @returns {*}
 */

module.exports = function group(signals) {
    signals.sort((a, b) => {
        if (a.diaIDs[0] < b.diaIDs[0]) return -1;
        if (a.diaIDs[0] > b.diaIDs[0]) return 1;
        return 0;
    });
    for (let i = signals.length - 2; i >= 0; i--) {
        if (signals[i].diaIDs[0] === signals[i + 1].diaIDs[0]) {
            signals[i].integral += signals[i + 1].integral;
            signals[i].atomIDs = signals[i].atomIDs.concat(signals[i + 1].atomIDs);
            signals.splice(i + 1, 1);
        }
    }

    for (let i = 0; i < signals.length; i++) {
        let j = signals[i].j;
        if (j && j.length > 0) {
            j.sort((a, b) => {
                return a.diaID.localeCompare(b.diaID);
            });
            //It is supposed that multiplicity is always `d`
            //Remove the assignment because it is not correct anymore
            delete j[j.length - 1].assignment;
            for (let k = j.length - 2; k >= 0; k--) {
                delete j[k].assignment;
                if (j[k].diaID === j[k + 1].diaID && j[k].coupling === j[k + 1].coupling) {
                    j[k].multiplicity += j[k + 1].multiplicity;
                    //j[k].assignment += ',' + j[k + 1].assignment;
                    j.splice(k + 1, 1);
                }
            }
        }
    }
    return signals;
};
