var _ = require('underscore');

var menuDataReducer = function(out, monYear) {
    var y = out[out.length - 1];
	  if (typeof(y) === 'undefined' || y.year !== monYear.year) {
        y = {year: monYear.year, months: []};
		    out.push(y);
	  }
	  var m = _.extend({}, monYear);
	  y.months.push(m);
	  delete m.year;
	  return out;
};

exports = module.exports = {};

exports.transformMenuData = function(monthYearResult) {
    return _.reduce(monthYearResult, menuDataReducer, []);
};

