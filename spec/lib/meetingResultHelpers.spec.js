var keystone = require('keystone');
var MeetingResult = keystone.list('MeetingResult');
var sut = require('../../lib/meetingResultHelpers');
var _ = require('underscore');
var async = require('async');


function newResult(name, isPublished, date, resultHtml, link, resetPublisehd) {
  return function (callback) {
    new MeetingResult.model({
      nameOrLocation: name.toString(),
      publishedState: isPublished ? 'published' : 'draft',
      resetPublisehd: !!resetPublisehd,
      resultUrl: link,
      resultHtml: resultHtml,
      date: date
    }).save(function(err) {
      if (err) {
        return callback(err);
      }
      // console.log(this.emitted.complete[0]);
      return callback(null, this.emitted.complete[0]);
    });
  };
}

describe('when getting latest results', function() {
    var result;
    var count = 3;
    before(function(done) {
      MeetingResult.model.find().remove(function(err) {
        if (err) {
          done(err);
        }
        var series = [];
        series.push(newResult(3, false, new Date(2013,11,1)));
        series.push(newResult(4, false, new Date(2012,11,1)));
        series.push(newResult(6, true, new Date(2010,11,1), undefined, undefined, true));
        series.push(newResult(5, true, new Date(2011,11,1), undefined, undefined, true));
        series.push(newResult(1, true, new Date(2015,11,1), '<p>Club Results</p>', undefined, true));
        series.push(newResult(2, true, new Date(2014,11,1), undefined, 'http://somewhere.com', true));

				async.series(series, (err, results) => {
					if (err) {
						done(err);
					}
          sut.getLatestResults(MeetingResult.model, 3).then(r => {
            result = r;
            done();
          });
				});
      });
    });

    it('should get correct number', function() {
      expect(result.length).to.equal(3);
    });

  it('should set date', function() {
    expect(result[1].resultDate).to.equal('Tuesday 1st December 2015');
  });

  it('should set club results link', function() {
    expect(result[0].hasResultsContent).to.be.false;
    expect(result[0].link).to.match(/^\/results\/December\/2014#2-/);
    expect(result[1].hasResultsContent).to.be.true;
    expect(result[1].link).to.match(/^\/results\/December\/2015#1-/);
  });

  it('should set full results link when possible', function() {
    expect(result[0].fullResultsLink).to.equal('http://somewhere.com');
    expect(result[1].fullResultsLink).to.be.undefined;
  });

  it('should get results in descending order of date published', function() {
    const titles = _.map(result, r => r.title);
    const expected = ['2','1','5'];
    expect(_.isEqual(titles, expected)).to.equal(true);
  });
});

describe('when menu data is transformed', function() {
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
    var result;
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
