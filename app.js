var h2 = document.getElementsByTagName('h2')[0],
    list = document.getElementsByTagName('ul')[0],
    start = document.getElementById('start'),
    stop = document.getElementById('stop'),
    done = document.getElementById('done'),
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

  time = h2.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
}

function timer() {
  interval = setInterval(countUp, 1000);
}

start.onclick = function() {
  timer();
}

stop.onclick = function() {
  clearInterval(interval);
}

done.onclick = function() {
  h2.textContent = "00:00:00";
  seconds = 0;
  minutes = 0;
  hours = 0;

  var li = document.createElement('li');
  li.textContent = time;
  list.appendChild(li);
}
