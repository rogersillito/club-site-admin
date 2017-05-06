var _ = require('underscore'),
    moment = require('moment'),
    dateHelpers = require('./dateHelpers'),
    utils = require('./utils'),
    Promise = require('es6-promise').Promise;

var menuDataReducer = function(out, monYear) {
  var y = out[out.length - 1];
  if (typeof(y) === 'undefined' || y.year !== monYear.year) {
    y = {
      year: monYear.year,
      months: []
    };
    out.push(y);
  }
  var m = _.extend({}, monYear);
  y.months.push(m);
  delete m.year;
  return out;
};

var menuQueryGroup = {
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

var menuQuerySort = {
  $sort: {
    "_id.year": -1,
    "_id.month": 1
  }
};

var getFilterCriteriaFor = function(monthName, year) {
  var monthIdx = dateHelpers.getMonthIndex(monthName);
  dateHelpers.validateYear(year);
  var filterStartDate = new moment()
        .year(year)
        .month(monthIdx)
        .date(1);
  var filterEndDate = new moment()
        .year(year)
        .month(monthIdx + 1)
        .date(1);
  return {
    $gte: filterStartDate,
    $lt: filterEndDate
  };
};

exports = module.exports = {};

exports.publishedCriteria = function() {
  return {
    'isPublished': true
  };
};

exports.getDataByMonthFor = function(month, year, model) {
  var criteria = exports.publishedCriteria();
  criteria.date = getFilterCriteriaFor(month, year);

  return new Promise(function(resolve, reject) {
    var q = model.find(criteria)
      .lean()
      .sort('-date');
    q.exec(function(err, results) {
      if (err) {
        reject(err);
      }
      var resultsMin = _.map(results, function(r) {
        return {
          key: r.key,
          name: r.nameOrLocation,
          date: moment(r.date).format('dddd Do MMMM YYYY'),
          url: r.resultUrl,
          linkText: r.resultLinkText,
          html: r.resultHtml
        };
      });
      resolve({
        items: resultsMin,
        displayMonth: utils.toTitleCase(month),
        displayYear: parseInt(year)
      });
    });
  });
};

exports.transformMenuData = function(monthYearResult) {
  return _.reduce(monthYearResult, menuDataReducer, []);
};

exports.getMenuData = function(model) {
  // get month/year aggregation summary for results menu
  return new Promise(function(resolve, reject) {
    model.aggregate([menuQueryGroup, menuQuerySort])
      .exec(function(err, results) {
        var monthYears = _.map(results, function(r) {
          if (err) {
            reject(err);
          }
          return {
            year: r._id.year,
            month: r._id.month,
            monthName: moment()
              .month(r._id.month - 1)
              .format("MMMM"),
            count: r.count
          };
        });
        // console.log(monthYears);
        resolve(exports.transformMenuData(monthYears));
      });
  });
};
