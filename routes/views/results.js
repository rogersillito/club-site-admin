var keystone = require('keystone'),
    moment = require('moment'),
    _ = require('underscore'),
    dataHelpers = require('../../lib/dataHelpers');

var MeetingResult = keystone.list('MeetingResult');

var transformMenuData = function(out, monYear) {
	  if (typeof(out[monYear.year]) === 'undefined') {
		    out[monYear.year] = [];
        out.years.push(monYear.year);
	  }
	  var entry = _.extend({}, monYear);
	  out[monYear.year].push(entry);
	  delete entry.year;
	  return out;
};

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.data = {};

    // Set locals
    locals.section = 'results';

    //TODO: allow qs to override current month for display (handle invalid params)
    //      BUT if I'm going to use react, parameterised queries will actually go to the api so this won't be needed
    locals.filters = {
        year: req.params.year,
        month: req.params.month
    };
    // console.log(locals.filters);

    var criteria = {
        'isPublished': true
    };

    view.on('init', function(next) {


        MeetingResult.model.findOne(criteria, 'year month').sort({
            date: 'desc'
        }).exec(function(err, latest) {

            if (err || latest === null) {
                return next(err);
            }

            var monthIdx = latest.month - 1;
            locals.displayMonth = moment().month(monthIdx).format('MMMM');
            locals.displayYear = latest.year;

            var filterStartDate = new moment().year(locals.displayYear).month(monthIdx).date(1);
            var filterEndDate = new moment().year(locals.displayYear).month(monthIdx + 1).date(1);
            criteria['date'] = {
                $gte: filterStartDate,
                $lt: filterEndDate
            };

            next();
        });
    });

    view.on('init', function(next) {
        // get month/year aggregation summary for results menu
        var group = {
            $group: {
                _id: {
                    month: "$month",
                    year: "$year"
                },
                count: {
                    $sum: 1
                }
            }
        };
        var sort = {
            $sort: {
                "_id.year": -1,
                "_id.month": 1
            }
        };
        MeetingResult.model.aggregate([group, sort])
            .exec(function(err, results) {
                var monthYears = _.map(results, function(r) {
                    if (err) {
                        return next(err);
                    }
                    return {
                        year: r._id.year,
                        month: r._id.month,
                        monthName: moment().month(r._id.month - 1).format("MMMM"),
                        count: r.count
                    };
                });
                console.log(monthYears);
                locals.data.menu = dataHelpers.transformMenuData(monthYears);
                // console.log(locals.data.menu);
            });
        next();
    });

    view.on('init', function(next) {
        // get the actual results for display year/month
        var q = MeetingResult.model.find(criteria).sort('-date');
        q.exec(function(err, results) {
			      locals.data.results = results;
            next(err);
        });
    });

    // Render the view
    view.render('results');
};
