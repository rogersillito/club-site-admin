describe('when a month is looked up', function() {
  var sut = require('../../lib/dateHelpers');

  it('should get correct index', function() {
    expect(sut.getMonthIndex('NOVEMBER'))
      .toBe(10);
  });

  it('should get correct number', function() {
    expect(sut.getMonthNumber('may'))
      .toBe(5);
  });

  it('should throw error if month invalid', function() {
    expect(function() {
        sut.getMonthIndex('Bungle');
      })
      .toThrow();
  });
});

describe('when a year is validated', function() {
  var sut = require('../../lib/dateHelpers');

  it('should accept year as string', function() {
    expect(function() {
        sut.validateYear('1999');
      })
      .not.toThrow();
  });

  it('should accept minimum valid value', function() {
    expect(function() {
        sut.validateYear(1);
      })
      .not.toThrow();
  });

  it('should not accept fraction', function() {
    expect(function() {
        sut.validateYear(1999.9);
      })
      .toThrow();
  });

  it('should not accept negative number', function() {
    expect(function() {
        sut.validateYear("-2000");
      })
      .toThrow();
  });
});
