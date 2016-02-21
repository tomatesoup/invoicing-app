var serialize = require('form-serialize');
var _ = require('lodash');

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
    timeElement = document.getElementsByTagName('time')[0],
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
    billableHours = [];

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
  timeElement.textContent = formatTime(time); 
}

function formatTime(t) {
  return (t.hours ? (t.hours > 9 ? t.hours : '0' + t.hours) : '00') + ':' + (t.minutes ? (t.minutes > 9 ? t.minutes : '0' + t.minutes) : '00') + ':' + (t.seconds > 9 ? t.seconds : '0'+ t.seconds);
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

function createTaskItem(values) {
  var taskInfo = _.map(values, function(v,k) {
    if (k === 'time') {
      v = formatTime(v);
    } 
    return k + ': ' + v 
  }).join(' ');
  var li = document.createElement('li');
  li.textContent = taskInfo; 
  return li;
}

function update(s) {
  if (!s.tasks.length) {
    total.classList.add('is-disabled');
  } else {
    total.classList.remove('is-disabled');   
  }  
  list.innerHTML = '';
  _.forEach(_.map(s.tasks, createTaskItem), function(element) {
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
  timeElement.textContent = '00:00:00';
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
