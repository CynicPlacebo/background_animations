let CGV = { //CGV stands for Countdown Global Variables
  'countdown':null, //Holds Countdown Class Object
};

/**
* Create a Countdown Timer
* @param id: id of DIV to put countdown in
* @param path: prefix for our Image URLs (the path to the Countdown Library folder)
* @param start: Integer to start the countdown at (can handle counting up too)
* @param stop: Integer to end the countdown at (most commonly 0 or 1, but can count up too)
* @param speedMS: Number of milliseconds between numbers (1000 is most common for SECONDS)
* @param warnAt: Integer to alter the color of the countdown text at (a Warning color)
* @param critAt: Integer to alter the color of the countdown text further (a Critical color)
*/
function initCountdown(id, path, start, stop, speedMS, warnAt, critAt) {
  let config = { 'id':id, 'path':path, 'start':start, 'stop':stop, 'speedMS':speedMS, 'warnAt':warnAt, 'critAt':critAt };
  let test_colors = false;
  let test_count_up = false;

//test_colors = true; //TODO: keep commented out
//test_count_up = true; //TODO: keep commented out

  if (test_colors) { //Ensure weird colors work
    config['color_stroke'] = '#FFF';
	config['color_back'] = 'magenta';
	config['color_back_stroke'] = 'purple';
	config['color_bar'] = '#777';
    config['color_text'] = 'lightblue';
	config['color_text_stroke'] = 'blue';
    config['color_warn'] = 'yellow';
	config['color_crit'] = 'pink';
  }

  if (test_count_up) { //A Test for Counting Up
    config.start = 0;
	config.stop = 20;
	config.warnAt = 17;
	config.critAt = 20;
  }

  // Setup Countdown with defined `config`
  CGV.countdown = new Countdown(config);
  
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
  if (CGV.countdown.paused == false && CGV.countdown.timeStarted > 0) //was Unpaused
    _countdown_animate(); //so start animation again
}