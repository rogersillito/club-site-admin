var keystone = require('keystone'),
  moment = require('moment'),
  _ = require('underscore'),
  resultHelpers = require('../../lib/meetingResultHelpers'),
  MeetingResult = keystone.list('MeetingResult');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.data = {};
  locals.section = 'results';

  //TODO: get from menuLink
  locals.pageTitle = 'results'; //result.name;

  view.on('init', function(next) {
    // Get results
    var criteria = resultHelpers.publishedCriteria();
    MeetingResult.model.findOne(criteria, 'year month')
      .sort({
        date: 'desc'
      })
      .exec(function(err, latest) {
        if (err || latest === null) {
          next(err);
        } else {
          locals.data.displayMonth = moment()
            .month(latest.month - 1)
            .format('MMMM');
          locals.data.displayYear = latest.year;

          resultHelpers.getDataByMonthFor(locals.data.displayMonth, latest.year, MeetingResult.model)
            .then(function(data) {
              locals.data.jsonResults = JSON.stringify(data);
              next();
            }, function(err) {
              next(err);
            });
        }
      });
  });

  view.on('init', function(next) {
    // Get menu data
    resultHelpers.getMenuData(MeetingResult.model)
      .then(function(data) {
        locals.data.jsonMenu = JSON.stringify(data);
        next();
      }, function(err) {
        next(err);
      });
  });

  // Render the view
  view.render('results');
};
