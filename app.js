var serialize = require('form-serialize');
var _ = require('lodash');
var formatTime = require('./utilities/utilities').formatTime;
var timer = require('./components/timer');
var taskItem = require('./components/taskItem');

var state = {
  timer: {
    seconds: 0,
    minutes: 0,
    hours: 0
  },
  tasks: []
}

var EMPTY_TIMER = {
  hours: 0,
  minutes: 0,
  seconds: 0
}

var h1 = document.getElementsByTagName('h1')[0],
    list = document.getElementsByTagName('ul')[0],
    main = document.querySelector('#main-button'),
    done = document.getElementById('done'),
    total = document.getElementById('total'),
    form = document.querySelector('#form'),
    create = document.getElementById('create-invoice'),
    p = document.getElementById('total-hours'),
    seconds = 0,
    minutes = 0,
    hours = 0,
    time = {},
    interval = null,
    billableHours = [],
    updateTimer = timer(document.querySelector('#timer-container'));

create.style.display = 'none';

function countUp() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours ++;
    }
  }
  time = { hours: hours, minutes: minutes, seconds: seconds };
  updateTimer(time); 
}

function startTimer() {
  interval = setInterval(countUp, 1000);
  main.classList.add('is-danger');
  main.textContent = 'stop';
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
  main.classList.remove('is-danger');
  main.textContent = 'start';
}

function update(s) {
  if (!s.tasks.length) {
    total.classList.add('is-disabled');
  } else {
    total.classList.remove('is-disabled');   
  }  
  list.innerHTML = '';
  _.forEach(_.map(s.tasks, taskItem), function(element) {
    list.appendChild(element);
  });
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  stopTimer();
  var taskObj = serialize(form, true);
  taskObj.time = Object.assign({}, time);
  state.tasks.push(taskObj);
  update(state);
  form.reset();
  done.classList.add('is-disabled');
  updateTimer();
  seconds = 0;
  minutes = 0;
  hours = 0;
});

main.onclick = function() {
  done.classList.remove('is-disabled');
  if (interval === null) {
    startTimer();
  } else {
    stopTimer();
  }
}

function displayTotal(total) {
  p.textContent = 'Total hours: ' + total;
  return p;
}

function timeConverter(t) {
  return {
    carry: Math.floor(t / 60),
    remainder: t % 60
  }; 
}

total.onclick = function() {
  this.classList.add('is-disabled');
  
  var totalTime = _.reduce(state.tasks, function(pile, task) {
    return {
      hours: pile.hours + task.time.hours, 
      minutes: pile.minutes + task.time.minutes, 
      seconds: pile.seconds + task.time.seconds 
    };
  }, Object.assign({}, EMPTY_TIMER))
  
  var convertedSeconds = timeConverter(totalTime.seconds);
  var convertedMinutes = timeConverter(totalTime.minutes + convertedSeconds.carry);
  var convertedHours = totalTime.hours + convertedMinutes.carry;

  var finalTime = {
    hours: convertedHours,
    minutes: convertedMinutes.remainder,
    seconds: convertedSeconds.remainder
  }
  
  billableHours.push(finalTime);
  
  list.appendChild(displayTotal(formatTime(finalTime)));
  create.style.display = '';
}
