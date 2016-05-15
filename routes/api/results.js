var _ = require('underscore'),
    // async = require('async'),
    keystone = require('keystone'),
    resultHelpers = require('../../lib/meetingResultHelpers'),
    MeetingResult = keystone.list('MeetingResult');

exports = module.exports = function(req, res) {

  var month = req.params.month;
  var year = req.params.year;

  resultHelpers.getDataByMonthFor(month, year, MeetingResult.model)
    .then(function(data) {
      res.json(data);
    }, function(err) {
      res.json({ err: err, params: req.params });
    });
};
