Number.isInteger = Number.isInteger || function(value) {
  return typeof value === "number" && 
    isFinite(value) && 
    Math.floor(value) === value;
};

var months = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12
};

exports = module.exports = {};

exports.formatStrings = {
  dayDateString: 'dddd Do MMMM YYYY',
  dayDateTimeString: 'dddd Do MMMM YYYY, h:mma'
};

exports.getMonthName = function(monthNumber) {
  for(var m in months) {
    if (months[m] == monthNumber) {
      return m;
    }
  }
  return undefined;
};

exports.getMonthIndex = function(monthName) {
  return this.getMonthNumber(monthName) - 1;
};

exports.getMonthNumber = function(monthName) {
  var val = months[monthName.toLowerCase()];
  if (val === undefined) {
    throw new Error('Invalid month: ' + monthName);
  }
  return val;
};

exports.validateYear = function(year) {
  var intVal = parseInt(year);
  if (Number.isInteger(intVal) && intVal == year && intVal > 0) return;
  throw new Error('Invalid year: ' + year);
};
