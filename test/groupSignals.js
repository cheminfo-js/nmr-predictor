describe('Test grouping function', function () {
    it('1H chemical shift prediction expanded', async function () {
        this.timeout(10000);
        const prediction = await predictor.spinus(molfile);
        prediction.length.should.equal(10);
    });
});

[
    {
        "atomIDs": ["1","2"],
        "diaIDs": ["A"],
        "integral": 2,
        "delta": 7
    },
    {
        "atomIDs": ["3"],
        "diaIDs": ["A"],
        "integral": 1,
        "delta": 8
    },
    {
        "atomIDs": ["4"],
        "diaIDs": ["B"],
        "integral": 1,
        "delta": 7.26
    }
]
