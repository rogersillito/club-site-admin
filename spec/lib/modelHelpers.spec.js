var sut = require('../../lib/modelHelpers');
var _ = require('underscore');

describe('when tidying html', function() {
  var html = '<table cellpadding="2" width="200" class"some-table">\n' +
        '<thead><tr><td style="color: fuchsia"><p style="font-family: courier">Heading</p></td>\n' +
                  '<td><p id="some-id">Heading2</p></td></tr></thead>\n' +
        '<tbody><tr><td colspan="2"><p class="blart">Cell Content</p></td></tr></tbody>\n' +
        '</table>\n';

  var expected = '<table>\n' +
        '<thead><tr><td><p>Heading</p></td>\n' +
        '<td><p>Heading2</p></td></tr></thead>\n' +
        '<tbody><tr><td colspan="2"><p>Cell Content</p></td></tr></tbody>\n' +
        '</table>\n';

  it('should remove unwanted markup elements', function() {
    expect(sut.cleanHtml(html)).to.equal(expected);
  });


  it('should be able to override default options', function() {
    const customizer = opt => { opt.allowedTags = _.reject(opt.allowedTags, x => x === 'h3'); };
    expect(sut.cleanHtml('<h3>stuff</h3>', customizer)).to.equal('stuff');
  });
});
