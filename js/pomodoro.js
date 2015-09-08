'use strict';

// TODO: Callbacks after events
// TODO: Load Sound

(function(global) {

  function Pomodoro(options) {

    //
    // Variables
    //

    var timer;
    var config;
    var defaultConfig = {
      timeInMinutes: 10,
      timeEl: null,
      buttons: {
        start: null,
        pause: null,
        stop: null
      }
    };

    //
    // Functions
    //
    function _merge(obj1, obj2) {
      var o1 = obj1;
      var o2 = obj2;
      var prop;

      if (typeof o1 !== 'object') {
        return {};
      } else if (typeof o2 !== 'object') {
        return o1;
      }

      for (prop in o2) {
        if (o2.hasOwnProperty(prop)) {
          o1[prop] = o2[prop];
        }
      }

      return o1;
    }

    function enableButtons() {
      config.buttons.start.removeAttribute('disabled');
      config.buttons.pause.removeAttribute('disabled');
      config.buttons.stop.removeAttribute('disabled');
    }

    function updateView(time) {
      var minutes = ('0' + time.minutes).slice(-2);
      var seconds = ('0' + time.seconds).slice(-2);

      config.timeEl.innerHTML = minutes + ':' + seconds;
    }

    function getTimeRemaining(endtime) {
      var t = Date.parse(endtime) - Date.parse(new Date());
      var seconds = Math.floor((t / 1000) % 60);
      var minutes = Math.floor((t / 1000 / 60) % 60);
      var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      var days = Math.floor(t / (1000 * 60 * 60 * 24));

      return {
        total: t,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      };
    }

    function updateClock() {
      var t = getTimeRemaining(timer.deadline);

      updateView(t);

      if (t.total <= 0) {
        onStop();
      }
    }

    function reset() {
      timer = {
        deadline: new Date(
          Date.parse(new Date()) + config.timeInMinutes * 60 * 1000
        ),
        intervalId: null,
        pause: false
      };

      updateClock();
    }

    function stopTimer(shouldReset) {
      global.clearInterval(timer.intervalId);
      timer.intervalId = null;

      enableButtons();

      if (shouldReset) {
        reset();
      }
    }

    function startTimer() {
      if (timer.pause) {
        timer.deadline = new Date(
          Date.parse(new Date()) + (Math.floor(((timer.deadline / 1000) / 60) % 60))
        );
        console.log('Start timer after pause', timer);
      } else {
        timer.deadline = new Date(
          Date.parse(new Date()) + config.timeInMinutes * 60 * 1000
        );
      }

      timer.intervalId = null;
      timer.pause = false;

      timer.intervalId = global.setInterval(updateClock, 1000);
    }

    function onPause(e) {
      if (e) {
        e.preventDefault();
      }

      console.log('Pause: ', timer);
      timer.pause = true;

      stopTimer(false);
    }

    function onStop(e) {
      if (e) {
        e.preventDefault();
      }

      stopTimer(true);
    }

    function onStart(e) {
      if (e) {
        e.preventDefault();
      }

      if (timer.intervalId) {
        return false;
      }

      // Disable button
      config.buttons.start.setAttribute('disabled', 'disabled');

      startTimer();
    }

    function dispatchEvents() {
      if (config.buttons.start) {
        config.buttons.start.addEventListener('click', onStart, false);
      } else {
        throw new Error('Error. Pomodoro app. No start button.');
      }

      if (config.buttons.stop) {
        config.buttons.stop.addEventListener('click', onStop, false);
      } else {
        throw new Error('Error. Pomodoro app. No stop button.');
      }

      // Pause button is optional
      if (config.buttons.pause) {
        config.buttons.pause.addEventListener('click', onPause, false);
      }
    }

    function init() {
      config = _merge(defaultConfig, options);

      reset();
      dispatchEvents();
    }

    init();
  }

  global.Pomodoro = Pomodoro;

})(typeof window !== 'undefined' ? window : this);
