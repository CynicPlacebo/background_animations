let CGV = { //CGV stands for Countdown Global Variables
  'countdowns':[] //Holds Countdown Class Objects
  ,'requestID':0
};


/**
* Create a Countdown Timer
* @param doKeyListener: only true for demos. Usually you'll control timers in your own JS code.
*/
function _countdown_init(doKeyListener=false) {
  let countdowns = document.getElementsByClassName("_countdown");
  // Parse Config & Create each Countdown
  for (let i=0; i < countdowns.length; i++) {
    let config = _countdown_get_config(countdowns[i]);
    CGV.countdowns.push(new Countdown(countdowns[i], config));
  }
  // Event Listener for Hot Keys to start/pause/reset countdowns
  if (doKeyListener)
    window.addEventListener('keyup', _countdown_handleKeyUp, false);
}


/**
* Parse Config from an HTML ._countdown element
* @param e: the HTML Element
*/
function _countdown_get_config(e) {
  let keys = ['start','stop','speedMS','warnAt','critAt'
    ,'color_stroke','color_back','color_back_stroke','color_bar'
	,'color_text','color_text_stroke'
	,'color_warn','color_warn_stroke'
	,'color_crit','color_crit_stroke'];
  let rtn = {};
  // Get all-in-1 config definition first (allow overrides)
  if ('config' in e.dataset) {
	let config = e.dataset.config.split(';');
	for (let setting of config) {
	  setting = setting.split(':');
	  rtn[setting[0]] = setting[1];
	}
  }
  // Get Individual Datasets
  for (let k of keys) {
	let lowerK = k.toLowerCase(); //All dataset keys are lower case, but we want camel case for Countdown.config
	if (!(lowerK in e.dataset)) //All are optional. So we'll skip many that don't exist
	  continue;
	rtn[k] = e.dataset[lowerK];
  }
  return rtn;
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
  CGV.requestID = requestAnimationFrame(_countdown_animate);
  let complete = true; //Assume complete, but any countdown still running invalidates it
  for (let countdown of CGV.countdowns) {
    countdown.animation_update(); //Will immediately return if countdown.complete
	if (!countdown.complete)
	  complete = false;
  }
  // End all animations if all are completed
  if (complete)
    _countdown_animation_clear();
}
// Starts the Animation
function _countdown_start() {
  _countdown_animation_start();
  _countdown_animate();
}
// Resets the Counter
function _countdown_reset() {
  _countdown_animation_clear();
  for (let countdown of CGV.countdowns)
    countdown.animation_reset();
}
// Pause/Unpause the Counter
function _countdown_pause() {
console.log('===== FUNC _countdown_pause() =====');
  for (let countdown of CGV.countdowns)
    countdown.animation_pause();
  if (CGV.countdowns[0].paused == false && CGV.countdowns[0].timeStarted > 0) //was Unpaused
    _countdown_animate(); //so start animation again
  else //Clear animation on Pause
    _countdown_animation_clear();
}

/*************** Animation Functions ***************/
// Clears out a requestAnimationFrame()
function _countdown_animation_clear() {
  if (0 === CGV.requestID)
    return; //Nothing to clear
  cancelAnimationFrame(CGV.requestID);
  CGV.requestID = 0; //Reset flag to "not animating" state of "0"
}

// Stop timer, because it's done
function _countdown_animation_end() {
  _countdown_animation_clear(); //Leave everything else as is
}

// Begin Animation (save start time)
function _countdown_animation_start() {
  _countdown_animation_clear();
  let now = Date.now();
  for (let countdown of CGV.countdowns)
    countdown.animation_start();
}
