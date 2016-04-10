var sut = require('../../lib/dataHelpers');

describe('when menu data is transformed', function() {
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

    beforeAll(function() {
        result = sut.transformMenuData(input);
    });
    it('should get an array with 1 element per year', function() {
        expect(result.length).toBe(3);
    });
    it('years should be returned in descending order', function() {
        expect(result[0].year).toBe(2016);
        expect(result[1].year).toBe(2015);
        expect(result[2].year).toBe(2014);
    });
});
