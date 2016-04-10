var sut = require('../../lib/utils');

describe('when an object Is Dumped', function() {
    var obj = {'a': 1, 'b': 2};
    var result;

    beforeEach(function() {
        result = sut.dumpObject(obj);
    });
    it('dump should get correct string representation', function() {
        expect(result.dump).toBe('\'a\' : 1, \'b\' : 2');
    });
    it('len should get correct property length', function() {
        expect(result.len).toBe(2);
    });
});
