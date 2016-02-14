var keystone = require('keystone'),
    moment = require('moment');

var MeetingResult = keystone.list('MeetingResult');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'results';

    view.on('init', function(next) {

        var criteria = {'isPublished': true};

        MeetingResult.model.findOne(criteria, 'date').sort({date: 'desc'}).exec(function(err, latest) {
            
			      if (err || latest === null) {
				        return next(err);
			      }

            var latestDate = moment(latest.date);
            locals.currentYear = latestDate.year();
            var monthIdx = latestDate.month();
            locals.currentMonth = latestDate.format('MMMM');

            //TODO: make sure these bring out the right start/end dates
            var displayStartDate = new moment().year(locals.currentYear).month(monthIdx).date(1);
            var displayEndDate = new moment().year(locals.currentYear).month(monthIdx + 1).date(1);
            console.log(displayStartDate.format('D M YYYY'), displayEndDate.format('D M YYYY'));
            criteria['date'] = {
                $gte: displayStartDate,
                $lt: displayEndDate
            };

			      // locals.data.tags = results;
            next();
        });

	      view.query('results', MeetingResult.model.find(criteria).sort('-date'));

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
