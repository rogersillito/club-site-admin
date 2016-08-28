describe('when a month is looked up', function() {
  var sut = require('../../lib/dateHelpers');

  it('should get correct index', function() {
    expect(sut.getMonthIndex('NOVEMBER'))
      .to.equal(10);
  });

  it('should get correct number', function() {
    expect(sut.getMonthNumber('may'))
      .to.equal(5);
  });

  it('should throw error if month invalid', function() {
    expect(function() {
        sut.getMonthIndex('Bungle');
      })
      .to.throw();
  });
});

describe('when a year is validated', function() {
  var sut = require('../../lib/dateHelpers');

  it('should accept year as string', function() {
    expect(function() {
        sut.validateYear('1999');
      })
      .to.not.throw();
  });

  it('should accept minimum valid value', function() {
    expect(function() {
        sut.validateYear(1);
      })
      .not.to.throw();
  });

  it('should not accept fraction', function() {
    expect(function() {
        sut.validateYear(1999.9);
      })
      .to.throw();
  });

  it('should not accept negative number', function() {
    expect(function() {
        sut.validateYear("-2000");
      })
      .to.throw();
  });
});
