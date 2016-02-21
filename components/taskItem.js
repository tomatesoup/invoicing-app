var _ = require('lodash');
var formatTime = require('../utilities/utilities').formatTime;

function formatInfo(info) {
  return _.map(info, function(v,k) {
    if (k === 'time') {
      v = formatTime(v);
    } 
    return k + ': ' + v 
  }).join(' ');
}

var taskItem = function(info) {
  var li = document.createElement('li');
  li.textContent = formatInfo(info); 
  return li; 
}

module.exports = taskItem;
