var $ = require('jquery');

var h2 = document.getElementsByTagName('h2')[0],
    list = document.getElementsByTagName('ul')[0],
    start = document.getElementById('start'),
    stop = document.getElementById('stop'),
    done = document.getElementById('done'),
    total = document.getElementById('total'),
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

$('form').on('submit', function(e) {
  e.preventDefault();
  var values = $('form').serializeArray();
  var valuesObj = {};
  console.log(values)
  var taskInfo = values.reduce(function(prev, curr) {
    return prev + ' ' + curr.name + ': ' + curr.value;
  },'');
  var li = document.createElement('li');
  li.textContent = taskInfo + ' time: ' + time;
  $(li).data('task', {})
  list.appendChild(li);
  $('input').val('');
});

start.onclick = function() {
  timer();
}

stop.onclick = function() {
  clearInterval(interval);
}

done.onclick = function() {
  $('form').submit();
  clearInterval(interval);
  h2.textContent = '00:00:00';
  seconds = 0;
  minutes = 0;
  hours = 0;
}

total.onclick = function() {
  console.log($('li'));
  // $('section').append('<p>Total hours: ' + hours + '</p>');
  // console.log(parseInt(time, 10));
}
