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

  time = h2.textContent = (hours ? (hours > 9 ? hours : '0' + hours) : '00') + ':' + (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') + ':' + (seconds > 9 ? seconds : '0'+ seconds);
}

function timer() {
  interval = setInterval(countUp, 1000);
}

function createTaskItem (values) {
  var taskInfo = _.map(values, function(v,k) { return k + ': ' + v }).join(' ');
  var li = document.createElement('li');
  li.textContent = taskInfo + ' time: ' + time; 
  return li;
}

function render (s) {
  list.innerHTML = '';
  _.forEach(_.map(s.tasks, createTaskItem), function (element) {
    list.appendChild(element)
  });
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  clearInterval(interval);
  h2.textContent = '00:00:00';
  seconds = 0;
  minutes = 0;
  hours = 0;
  state.tasks.push(serialize(form, true));
  render(state);
  form.reset();
});

start.onclick = function() {
  timer();
}

stop.onclick = function() {
  clearInterval(interval);
}

total.onclick = function() {
  // console.log($('li'));
  // $('section').append('<p>Total hours: ' + hours + '</p>');
}
