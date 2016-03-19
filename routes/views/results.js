var keystone = require('keystone'),
    moment = require('moment'),
    _ = require('underscore');

var MeetingResult = keystone.list('MeetingResult');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // Set locals
    locals.section = 'results';

    //TODO: allow qs to override current month for display (handle invalid params)
    //      BUT if I'm going to use react, parameterised queries will actually go to the api so this won't be needed
    locals.filters = {
        year: req.params.year,
        month: req.params.month
    };
    console.log(locals.filters);

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
        // get month/year aggregation summary for archive menu
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
                locals.monthYears = _.map(results, function(r) {
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
                console.log(locals.monthYears);
            });
        next();
    });

    view.on('init', function(next) {
        // get the actual results for display year/month
        view.query('results', MeetingResult.model.find(criteria).sort('-date'));
        next();
    });

    // Render the view
    view.render('results');
};
