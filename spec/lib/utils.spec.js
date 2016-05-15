describe('when an object Is Dumped', function() {
    var obj = {'a': 1, 'b': 2};
    var result;
    var sut = require('../../lib/utils');

    beforeAll(function() {
        result = sut.dumpObject(obj);
    });
    it('dump should get correct string representation', function() {
        expect(result.dump).toBe('\'a\' : 1, \'b\' : 2');
    });
    it('len should get correct property length', function() {
        expect(result.len).toBe(2);
    });
});

describe('when capitalizeFirst is called', function() {
  var sut = require('../../lib/utils');

  it('should return string in title case', function() {
    expect(sut.toTitleCase('abc DEFG')).toBe('Abc Defg');
  });
});
