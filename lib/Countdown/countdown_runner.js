let CGV = { //CGV stands for Countdown Global Variables
  'countdown':null, //Holds Countdown Class Object
};

// Create a Countdown Timer
function initCountdown(pathToRoot) {
  let start = 12;
  let stop = 0;
  let speedMS = 1000; //Most common speed is 1000 (1 step per second)
  let warnAt = 3; //Time is almost out at 3 seconds
  let critAt = 0; //Critical color only at 0
  //start = 0; stop = 20; warnAt = 17; critAt = 20; //A Test for Counting Up
  CGV.countdown = new Countdown(pathToRoot, 'countdown', start, stop, speedMS, warnAt, critAt);
  
  // Event Listener for Speed/Color hot keys
  window.addEventListener('keyup', _countdown_handleKeyUp, false);
}

// Start/Pause/Unpause Countdown Timer
function _countdown_handleKeyUp(e) {
  if ("Space" == e.code) { //Pauses/unpauses
    _countdown_pause(); //on a toggle, so handles unpause too
  } else if ("Enter" == e.code) { //Starts timer (or resets & starts if finished)
    _countdown_start(); //Start or Reset-and-Start the timer
  } else if ("KeyR" == e.code) { //Resets the timer
    _countdown_reset();
  }
}

// Starts the Animation
function _countdown_animate() {
  CGV.countdown.requestID = requestAnimationFrame(_countdown_animate);
  CGV.countdown.animation_update();
}

// Starts the Animation
function _countdown_start() {
  if (CGV.countdown.timeStarted > 0) //Not Fresh. Reset First
    _countdown_reset();
  CGV.countdown.animation_start();
  _countdown_animate();
}

// Resets the Counter
function _countdown_reset() { CGV.countdown.animation_reset(); }

// Pause/Unpause the Counter
function _countdown_pause() {
  CGV.countdown.animation_pause();
  if (CGV.countdown.paused == false) //was Unpaused
    _countdown_animate(); //so start animation again
}