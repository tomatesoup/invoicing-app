var formatTime = require('../utilities/utilities').formatTime;

var timer = function(container) {
  return function updateTimer(time) {
    if (!time) {
      time = { hours: 0, minutes: 0, seconds: 0 };
    }
    
    var timeElement = document.createElement('time')
    timeElement.textContent = formatTime(time);
    container.innerHTML = '';
    container.appendChild(timeElement);
  }
}

module.exports = timer;
