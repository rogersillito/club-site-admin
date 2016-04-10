var _ = require('underscore');

var menuDataReducer = function(out, monYear) {
	  if (typeof(out[monYear.year]) === 'undefined') {
		    out[monYear.year] = [];
        out.years.push(monYear.year);
	  }
	  var entry = _.extend({}, monYear);
	  out[monYear.year].push(entry);
	  delete entry.year;
	  return out;
};

exports = module.exports = {};

exports.transformMenuData = function(monthYearResult) {
    return _.reduce(monthYearResult, menuDataReducer, {years: []});
};

