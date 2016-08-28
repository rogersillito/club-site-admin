describe('when menu data is transformed', function() {
    var sut = require('../../lib/meetingResultHelpers.js');
    var result;
    var input = [{
        year: 2016,
        month: 1,
        monthName: 'January',
        count: 2
    }, {
        year: 2016,
        month: 2,
        monthName: 'February',
        count: 4
    }, {
        year: 2016,
        month: 3,
        monthName: 'March',
        count: 1
    }, {
        year: 2016,
        month: 5,
        monthName: 'May',
        count: 1
    }, {
        year: 2015,
        month: 9,
        monthName: 'September',
        count: 1
    }, {
        year: 2014,
        month: 4,
        monthName: 'April',
        count: 1
    }];

    beforeEach(function() {
        result = sut.transformMenuData(input);
    });

    it('should get an array with 1 element per year', function() {
        expect(result.length).to.equal(3);
    });
    it('years should be returned in descending order', function() {
        expect(result[0].year).to.equal(2016);
        expect(result[1].year).to.equal(2015);
        expect(result[2].year).to.equal(2014);
    });
    it('should give correct number of month entries for each year', function() {
        expect(result[0].months.length).to.equal(4);
        expect(result[1].months.length).to.equal(1);
        expect(result[2].months.length).to.equal(1);
    });
    it('month entries should be in correct order', function() {
        expect(result[0].months[0].month).to.equal(1);
        expect(result[0].months[1].month).to.equal(2);
        expect(result[0].months[2].month).to.equal(3);
        expect(result[0].months[3].month).to.equal(5);
    });
});
