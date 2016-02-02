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

var h2 = document.getElementsByTagName('h2')[0],
    list = document.getElementsByTagName('ul')[0],
    start = document.getElementById('start'),
    stop = document.getElementById('stop'),
    total = document.getElementById('total'),
    form = document.querySelector('#form'),
    seconds = 0,
    minutes = 0,
    hours = 0,
    time,
    interval;

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
  h2.textContent = formatTime(time); 
}

function formatTime(t) {
  t = (t.hours ? (t.hours > 9 ? t.hours : '0' + t.hours) : '00') + ':' + (t.minutes ? (t.minutes > 9 ? t.minutes : '0' + t.minutes) : '00') + ':' + (t.seconds > 9 ? t.seconds : '0'+ t.seconds);  
  return t;
}

function timer() {
  interval = setInterval(countUp, 1000);
}

function createTaskItem(values) {
  var taskInfo = _.map(values, function(v,k) {
    if (k === 'time') {
      v = formatTime(time);
    } 
    return k + ': ' + v 
    }).join(' ');
  var li = document.createElement('li');
  li.textContent = taskInfo; 
  return li;
}

function update(s) {
  list.innerHTML = '';
  _.forEach(_.map(s.tasks, createTaskItem), function(element) {
    list.appendChild(element);
  });
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  clearInterval(interval);
  var taskObj = serialize(form, true);
  taskObj.time = time;
  state.tasks.push(taskObj);
  update(state);
  form.reset();
  h2.textContent = '00:00:00';
  seconds = 0;
  minutes = 0;
  hours = 0;
});

start.onclick = function() {
  timer();
}

stop.onclick = function() {
  clearInterval(interval);
}

function displayTotal(total) {
  var p = document.createElement('p');
  p.textContent = 'Total hours: ' + total;
  return p;
}

total.onclick = function() {
  var totalHours = _.reduce(state.tasks, function(task) { return task.time.hours } );
  list.appendChild(displayTotal(totalHours));
}
