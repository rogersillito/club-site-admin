describe('when an object Is Dumped', function() {
    var obj = {'a': 1, 'b': 2};
    var result;
    var sut = require('../../lib/utils');

    beforeEach(function() {
        result = sut.dumpObject(obj);
    });
    it('dump should get correct string representation', function() {
        expect(result.dump).to.equal('\'a\' : 1, \'b\' : 2');
    });
    it('len should get correct property length', function() {
        expect(result.len).to.equal(2);
    });
});

describe('when capitalizeFirst is called', function() {
  var sut = require('../../lib/utils');

  it('should return string in title case', function() {
    expect(sut.toTitleCase('abc DEFG')).to.equal('Abc Defg');
  });
});
