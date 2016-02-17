var keystone = require('keystone'),
    moment = require('moment');

var MeetingResult = keystone.list('MeetingResult');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'results';

    var criteria = {'isPublished': true};

    view.on('init', function(next) {


        MeetingResult.model.findOne(criteria, 'date').sort({date: 'desc'}).exec(function(err, latest) {
            
			      if (err || latest === null) {
				        return next(err);
			      }

            var displayDate = moment(latest.date);
            locals.displayYear = displayDate.year();
            var monthIdx = displayDate.month();
            locals.displayMonth = displayDate.format('MMMM');

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
	      view.query('results', MeetingResult.model.find(criteria).sort('-date'));
        next();
    });

    //TODO: something like this.....
	  // view.query('latestResult',
		//            MeetingResult.model.findone()
		// 	         .where('state', 'active')
		// 	         .sort('-startdate')
	  //            , 'talks[who]');
	  
	  // view.query('pastMeetups',
		//            Meetup.model.find()
		// 	         .where('state', 'past')
		// 	         .sort('-startDate')
	  //            , 'talks[who]');

    // keystone.list('MeetingResult').model.find().exec(function(err, doc) {
    //     console.log(typeof(doc[0].dumpy)); 
    // });
	
	// Load the results by sortOrder
	
	// Render the view
	view.render('results');
};
