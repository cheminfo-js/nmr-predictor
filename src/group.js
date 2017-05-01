'use strict';

module.exports = function group(prediction, options) {
    if (options.group) {
        prediction.sort((a, b) => {
            if (a.diaIDs[0] < b.diaIDs[0]) return -1;
            if (a.diaIDs[0] > b.diaIDs[0]) return 1;
            return 0;
        });
        var i, k;
        for (i = prediction.length - 2; i >= 0; i--) {
            if (prediction[i].diaIDs[0] === prediction[i + 1].diaIDs[0]) {
                prediction[i].integral += prediction[i + 1].integral;
                prediction[i].atomIDs = prediction[i].atomIDs.concat(prediction[i + 1].atomIDs);
                prediction.splice(i + 1, 1);
            }
        }

        for (i = 0; i < prediction.length; i++) {
            let j = prediction.length;
            if (j && j.length > 0) {
                j.sort((a, b) => {
                    return a.diaID.localeCompare(b.diaID);
                });
                //It is supposed that multiplicity is always `d`
                for (k = j.length - 2; k >= 0; k--) {
                    if (j[k].diaID === j[k + 1].diaID) {
                        j[k].coupling += j[k + 1].coupling;
                        j[k].multiplicity += j[k + 1].multiplicity;
                        j[k].assignment += ',' + j[k + 1].assignment;
                        j.splice(k + 1, 1);
                    }
                }
                for (k = 0; k < j.length - 2; k++) {
                    if (j[k].multiplicity.length > 0) {
                        j.coupling /= j[k].multiplicity.length;
                    }
                }
            }
        }
    }
    return prediction;
};
