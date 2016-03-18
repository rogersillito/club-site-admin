var keystone = require('keystone'),
    moment = require('moment'),
    _ = require('underscore');

var MeetingResult = keystone.list('MeetingResult');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'results';

    var criteria = {'isPublished': true};

    view.on('init', function(next) {

        MeetingResult.model.findOne(criteria, 'year month').sort({date: 'desc'}).exec(function(err, latest) {

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

            //TODO: allow qs to override current month for display

            next();
        });
    });

    view.on('init', function(next) {
        // get month/year aggregation summary for archive menu
        var group = {$group: {_id: { month: "$month", year: "$year"}, count: {$sum: 1}}};
        var project = {$project: {_id: 0, year: "$_id.year", month: "$_id.month", count: "$count"}};
        var sort = {$sort: {year:-1, month: 1}};
        MeetingResult.model.aggregate([group, project, sort])
        .exec(function(err, results) {
            var monthYears = _.map(results, function(monthYear) {
                monthYear.monthName = moment().month(monthYear.month - 1).format("MMMM");
                return monthYear;
            });
            // console.log(monthYears);
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
