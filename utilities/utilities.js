const _ = require('lodash');

const addZero = function(unit) {
  if (!unit) {
    unit = 0;
  }
  return unit > 9 ? unit : '0' + unit;
};

const formatTime = function(time) {
  if (!time) {
    time = { hours: 0, minutes: 0, seconds: 0 };
  }
  return _.map(time, addZero).join(':');
};

module.exports = {
  formatTime
};
