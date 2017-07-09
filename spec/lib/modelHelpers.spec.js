var sut = require('../../lib/modelHelpers');
var _ = require('underscore');

describe('when tidying html', function() {
  var html = '<table cellpadding="2" width="200" class"some-table">\n' +
        '<thead><tr><td style="color: fuchsia"><p style="font-family: courier">Heading</p></td>\n' +
                  '<td><p id="some-id">Heading2</p></td></tr></thead>\n' +
        '<tbody><tr><td colspan="2"><p class="blart">Cell Content</p></td></tr></tbody>\n' +
        '</table>\n';

  var expected = '<table class="table table-striped">\n' +
        '<thead><tr><td><p>Heading</p></td>\n' +
        '<td><p>Heading2</p></td></tr></thead>\n' +
        '<tbody><tr><td colspan="2"><p>Cell Content</p></td></tr></tbody>\n' +
        '</table>\n';

  it('should remove unwanted markup elements', function() {
    expect(sut.cleanHtml(html)).to.equal(expected);
  });


  it('should be able to override default options', function() {
    const customizer = opt => { opt.allowedTags = _.reject(opt.allowedTags, x => x === 'h3'); };
    expect(sut.fixMeetingResultHtml('<h3>stuff</h3>', customizer)).to.equal('stuff');
  });
});

/*
describe('when a big chunk is cleaned', function() {
  var html = "<div>\r\n<div>\r\n<table>\r\n<thead>\r\n<tr><th><a>POS.</a></th><th><a>BIB NO.</a></th><th><a>NAME</a></th><th>GENDER</th><th><a>CAT.</a></th><th><a>CLUB</a></th><th><a>GUN TIME</a></th><th><a>CHIP TIME</a></th><th><a>GENDER POS.</a></th><th><a>CAT. POS.</a></th><th><a>CHIP POS.</a></th><th>SHARE</th></tr>\r\n</thead>\r\n<tbody>\r\n<tr>\r\n<td>51</td>\r\n<td>4108</td>\r\n<td><a>Gavin THOMPSON</a></td>\r\n<td>Male</td>\r\n<td>HM-M40</td>\r\n<td>Low Fell</td>\r\n<td>01:26:20</td>\r\n<td>01:26:13</td>\r\n<td>47</td>\r\n<td>13</td>\r\n<td>51</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td>137</td>\r\n<td>4233</td>\r\n<td><a>Michael GRAHAM</a></td>\r\n<td>Male</td>\r\n<td>HM-M50</td>\r\n<td>Low Fell</td>\r\n<td>01:34:14</td>\r\n<td>01:34:14</td>\r\n<td>126</td>\r\n<td>10</td>\r\n<td>143</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td>154</td>\r\n<td>4470</td>\r\n<td><a>Keith ROLL</a></td>\r\n<td>Male</td>\r\n<td>HM-MS</td>\r\n<td>Low Fell</td>\r\n<td>01:35:13</td>\r\n<td>01:34:44</td>\r\n<td>143</td>\r\n<td>76</td>\r\n<td>153</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td>301</td>\r\n<td>4762</td>\r\n<td><a>Gavin DOWD</a></td>\r\n<td>Male</td>\r\n<td>HM-M40</td>\r\n<td>Low Fell</td>\r\n<td>01:42:21</td>\r\n<td>01:41:53</td>\r\n<td>276</td>\r\n<td>90</td>\r\n<td>303</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td>330</td>\r\n<td>4138</td>\r\n<td><a>Mark PARKER</a></td>\r\n<td>Male</td>\r\n<td>HM-M40</td>\r\n<td>Low Fell</td>\r\n<td>01:43:25</td>\r\n<td>01:43:16</td>\r\n<td>302</td>\r\n<td>101</td>\r\n<td>337</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td>631</td>\r\n<td>5546</td>\r\n<td><a>Alan TODD</a></td>\r\n<td>Male</td>\r\n<td>HM-MS</td>\r\n<td>Low Fell</td>\r\n<td>01:54:13</td>\r\n<td>01:53:17</td>\r\n<td>534</td>\r\n<td>268</td>\r\n<td>628</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td>700</td>\r\n<td>5357</td>\r\n<td><a>Michael STYAN</a></td>\r\n<td>Male</td>\r\n<td>HM-M40</td>\r\n<td>Low Fell</td>\r\n<td>01:56:50</td>\r\n<td>01:56:04</td>\r\n<td>583</td>\r\n<td>208</td>\r\n<td>702</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td>718</td>\r\n<td>5581</td>\r\n<td><a>Michael MCKEOUGH</a></td>\r\n<td>Male</td>\r\n<td>HM-M50</td>\r\n<td>Low Fell</td>\r\n<td>01:57:30</td>\r\n<td>01:56:41</td>\r\n<td>595</td>\r\n<td>79</td>\r\n<td>723</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td>729</td>\r\n<td>4112</td>\r\n<td><a>Mark LISLE</a></td>\r\n<td>Male</td>\r\n<td>HM-M40</td>\r\n<td>Low Fell</td>\r\n<td>01:57:49</td>\r\n<td>01:57:40</td>\r\n<td>602</td>\r\n<td>214</td>\r\n<td>748</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td>925</td>\r\n<td>4267</td>\r\n<td><a>Kelly COOK</a></td>\r\n<td>Female</td>\r\n<td>HM-FS</td>\r\n<td>Low Fell</td>\r\n<td>02:06:29</td>\r\n<td>02:05:39</td>\r\n<td>212</td>\r\n<td>122</td>\r\n<td>936</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td>1137</td>\r\n<td>4130</td>\r\n<td><a>Nicola ROBINSON</a></td>\r\n<td>Female</td>\r\n<td>HM-F40</td>\r\n<td>Low Fell</td>\r\n<td>02:17:36</td>\r\n<td>02:16:46</td>\r\n<td>332</td>\r\n<td>117</td>\r\n<td>1143</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td>1225</td>\r\n<td>4793</td>\r\n<td><a>Leanne WALTON</a></td>\r\n<td>Female</td>\r\n<td>HM-FS</td>\r\n<td>Low Fell</td>\r\n<td>02:24:33</td>\r\n<td>02:23:43</td>\r\n<td>385</td>\r\n<td>199</td>\r\n<td>1230</td>\r\n<td>\r\n<p><a>LinkedIn</a> <a>Facebook</a> <a>Twitter</a></p>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</div>\r\n</div>\r\n\r\n<div> </div>\r\n";

  it('should not fail!', function() {
    expect(sut.cleanHtml(html)).not.to.be.an("undefined");
  });

});
//*/

describe('when tidying html with multiple tables', function() {
  var html = '<table cellpadding="2" width="200" class"some-table">\n' +
        '<tr><td><table class="a"><tr><td></td></tr></table></td></tr>\n' +
        '<tr><td><table class="a"><tr><td><table class="a"><tr><td></td></tr></table></td></tr></table></td></tr>\n' +
        '</table>\n' +
        'some text' +
        '<table><tr><td><table><tr><td>A</td></tr></table></td></tr></table>\n' +
        '<table><tr><td>B</td></tr></table>\n';

  var expected = '<table class="table table-striped">\n' +
        '<tr><td><table><tr><td></td></tr></table></td></tr>\n' +
        '<tr><td><table><tr><td><table><tr><td></td></tr></table></td></tr></table></td></tr>\n' +
        '</table>\n' +
        'some text' +
        '<table class="table table-striped"><tr><td><table><tr><td>A</td></tr></table></td></tr></table>\n' +
        '<table class="table table-striped"><tr><td>B</td></tr></table>\n';

  it('should add table classes to all top-level tables only', function() {
    expect(sut.cleanHtml(html)).to.equal(expected);
  });
});

describe('when tidying html with a deeply nested table', function() {
  var html = '<div><div><div><table></table></div></div></div> stuff';

  var expected = '<div><div><div><table class="table table-striped"></table></div></div></div> stuff';

  it('should add table classes to top-level table', function() {
    expect(sut.cleanHtml(html)).to.equal(expected);
  });
});
