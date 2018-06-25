
const nmr = require('..');


const molfile = 'CCc1ccccc1\nJME 2017-11-16 Mon Jun 25 16:33:25 GMT+200 2018\n\n  8  8  0  0  0  0  0  0  0  0999 V2000\n    2.4249    0.7000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.4249    2.1000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.2124    2.8000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    2.1000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    0.7000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.2124    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.6373    2.8000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.8497    2.1000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  2  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  2  0  0  0  0\n  5  6  1  0  0  0  0\n  6  1  2  0  0  0  0\n  2  7  1  0  0  0  0\n  7  8  1  0  0  0  0\nM  END\n';

jest.setTimeout(10000);

test('1H prediction from molfile', async function () {
    const ranges = await nmr.spinus(molfile);
    expect(ranges).toMatchSnapshot();
});

test('13C prediction from molfile', async function () {
    await nmr.fetchCarbon();
    const ranges = nmr.carbon(molfile);
    expect(ranges).toMatchSnapshot();
});