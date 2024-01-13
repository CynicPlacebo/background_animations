/*******************************************************************
* Class for an animated Countdown Timer
*
* KNOWN LIMIT: Currently only supports counting 0 - 20. Need more SVGs for 21 - 99
*
* Version: 0.1 (only tested in Firefox)
* Copyright: 2024 Cynic Placebo (https://localmess.com/)
* License: BSD-3-Clause
*******************************************************************/
class Countdown {


  /************** Static Variables ***************/
  static HUE_ROTATION = [0, -0.15, -0.3]; //for warnAt/critAt coloring
  static SVG_NUM_DIR = "num/"; //inside SVG_PREFIX folder
  static SVG_PREFIX = "lib/Countdown/img/"; //Relative Path for Images
  static SVG_SUFFIX = ".svg";
  static THRESH = [0, 0.48, 0.65, 0.75, 0.88, 0.946, 0.991]; //Percents where we need to switch images
  static URLS = {
    "back":"ring_back",
    "bottom":["bottom1","bottom2","bottom3","bottom4","bottom5","bottom6","bottom7"],
    "cap":["cap1","cap2","cap3","cap4","cap5","cap6","cap7"],
    "num":[
      '0','1','2','3','4','5','6','7','8','9',
      '10','11','12','13','14','15','16','17','18','19',
      '20','21','22','23','24','25','26','27','28','29',
      '30','31','32','33','34','35','36','37','38','39',
      '40','41','42','43','44','45','46','47','48','49',
      '50','51','52','53','54','55','56','57','58','59',
      '60','61','62','63','64','65','66','67','68','69',
      '70','71','72','73','74','75','76','77','78','79',
      '80','81','82','83','84','85','86','87','88','89',
      '90','91','92','93','94','95','96','97','98','99',
    ],
  };



  /************** Constructor ***************/

  /**
  * Sets up some Timer Variables
  * @param path: Path to Root of Site (to prefix our URLs with) [INCLUDE a trailing slash, please]
  * @param id: ID of the <div> you want the timer in
  * @param start: Number of seconds to start Countdown from
  * @param stop: Number to end on (usually 0, but might be 1. Rarely other)
  * @param speedMS: Number of Milliseconds between counts
  * @param warnAt: Number to color with "warning" color
  * @param critAt: Number to color with "critical" color
  */
  constructor(path, id, start=10, stop=0, speedMS=1000, warnAt=null, critAt=null) {
    this.rootPath = path;
    this.id = id;
    this.requestID = 0; //Holds ID from requestAnimationFrame (used for cancelAnimationFrame())
    this.start = start;
    this.stop = stop;
    this.warnAt = warnAt;
    this.critAt = critAt;
    // Assume Counting Up
    this.max = stop;
    this.min = start;
    this.displayedSteps = {}; //Hash of counters we've shown so far
    this.displayedThresh = {}; //Hash of thresholds we've switched to
    this.increment = 1;
    if (start > stop) { //Counting Down
      this.max = start;
      this.min = stop;
      this.increment = -1;
    }
    this.numSteps = this.max - this.min;
    this.numSteps++; //+1 because 3->2->1 is actually 3 steps, not 2
    this.speed = speedMS;
    this.duration = speedMS * this.numSteps;
    this.paused = false; //doesn't auto-start, but hasn't actively been "paused"
    this.timeStarted = 0; //Will hold time Animation started, so we can calculate % complete based on this.duration
    this.timePaused = 0; //Will hold time Animation was paused
    // Create DOM Elements we need
    this.e = document.getElementById(id); //Container Element (need for sizing)
    this.dom = {};
    this.initDOM();
  }



  /************** Functions ***************/

  /**
  * Creates sub-elements in this.e that we need for display.
  * All elements will be cached in this.dom
  */
  initDOM() {
    this.e.classList.add('_counter_div');
    let imgs = [
      'back', //Dark ring in the background that doesn't change
      'bottom', //Bottom section of shrinking ring (to hide bottom gap)
      'num',
      'cap', //Left section of the shrinking ring
      'cap_right' //Right section of the shrinking ring
      //NOTE: above is an _ separated list of "url name" vs class name
    ];
    // Create, Cache, & Append necessary IMGs in DOM
    for (let id of imgs) {
      let temp = document.createElement('img');
      let img = id.split("_");
      img = img[0]; //Allows Left/Right caps to use same image
      this.dom[id] = temp; //Cache the element
      temp.className = '_counter_' + id;
      if ('num' != id) {
        temp.src = this.url(img);
      } else { //Start Counter at right number
        temp.src = this.url(img, this.start);
      }
      this.e.appendChild(temp);
    }
  }


  /** Clears out a requestAnimationFrame() */
  animation_clear() {
    if (0 === this.requestID)
      return; //Nothing to clear
    cancelAnimationFrame(this.requestID);
    this.requestID = 0;
  }


  /** Stop timer, because it's done */
  animation_end() {
    this.animation_clear(); //Leave everything else as is
  }


  /**
  * Empties this.e and runs the initial init again
  */
  animation_reset() {
    this.animation_clear();
    while (this.e.firstChild) //Remove all children
      this.e.removeChild(this.e.lastChild);
    this.paused = false;
    this.timeStarted = 0; //Flag indicates no animation has started. It's a FRESH timer.
    this.timePaused = 0; //just to be clean
    this.displayedSteps = {}; //reset displayed step hash
    this.displayedThresh = {}; //reset displayed threshold hash
    this.dom.num.classList.remove('counter_num_crit'); //Reset Hue-Rotation
    this.dom.num.classList.remove('counter_num_warn'); //Reset Hue-Rotation

    this.initDOM(); //Recreate them
  }


  /** Begin Animation (save start time) */
  animation_start() {
    this.animation_clear();
    this.timeStarted = Date.now();
  }


  /** End of the animation (Just stay on last num/frame) */
  animation_stop() {
    this.animation_clear();
  }


  /** Pause/Unpause the animation */
  animation_pause() {
    if (this.timeStarted == 0)
      return; //Can't pause what hasn't Started
    if (this.paused) { //Unpause
      //Get new this.timeStarted
      let now = Date.now();
      let diff = this.timePaused - this.timeStarted;
      this.timeStarted = now - diff; //Pretend it started more recently
      this.timePaused = 0;
      this.paused = false;
    } else { //Pause
      this.animation_clear();
      this.paused = true;
      this.timePaused = Date.now();
    }
  }


  /** Animate counter based on time passed since this.timeStarted */
  animation_update() {
    if (this.paused)
      return;
    let diff = Date.now() - this.timeStarted; //How many MS since start
    let perc = diff / this.duration; //Percent Complete

    // Change Counter Number based on Percent
    let elapsedSteps = Math.floor(perc * this.numSteps);
    let currNum = this.start + (elapsedSteps * this.increment); //Count Up or Down
    if (currNum < this.min)
      currNum = this.min;
    else if (currNum > this.max)
      currNum = this.max;
    if (!(currNum in this.displayedSteps)) {
      this.displayedSteps[currNum] = true;
      this.dom.num.src = this.url("num", currNum);
      if (currNum == this.warnAt) {
        this.dom.num.classList.remove('counter_num_crit');
        this.dom.num.classList.add('counter_num_warn');
      } else if (currNum == this.critAt) {
        this.dom.num.classList.remove('counter_num_warn');
        this.dom.num.classList.add('counter_num_crit');
      }
      //TODO: Animate number bounce/wobble with ._counter_bounce class & requestTimeout
    }

    // Thresholds for when Images Switch
    let index = 0; //Index for thresh[] AND for url(name, index)
    let len = Countdown.THRESH.length;
    for (let i = len; i > 0; --i) { //Get largest threshold it's bigger than
      if (perc > Countdown.THRESH[i]) {
        index = i;
        break;
      }
    }
    // Switch Images. NOTE: Use NEW child, as switching .src flickers
    if (index > 0) { //Switch Images
      if (!(index in this.displayedThresh)) {
        this.displayedThresh[index] = true;
        let bottom = document.createElement('img');
        let left = document.createElement('img');
        let right = document.createElement('img');
        bottom.className = '_counter_bottom';
        left.className = '_counter_cap';
        right.className = '_counter_cap_right';
        bottom.src = this.url("bottom", index);
        left.src = this.url("cap", index);
        right.src = left.src; //Same img, just flipped
        //Add New, Remove Old, Fix Cache
        this.e.appendChild(bottom);
        this.e.appendChild(left);
        this.e.appendChild(right);
        this.e.removeChild(this.dom.bottom);
        this.e.removeChild(this.dom.cap);
        this.e.removeChild(this.dom.cap_right);
        this.dom.bottom = bottom;
        this.dom.cap = left;
        this.dom.cap_right = right;
      }
    }
    // Calculate Rotation from Percent
    let x = 2.06; //it's only half a ring (slightly under half)
    let rotate = perc / x; //so we "half" the rotation
    if (rotate > 0) //Sometimes buffer leads to a slight negative
      this.setRotation(rotate);

    //End Animation if it's been longer than the Duration
    if (diff >= this.duration)
      this.animation_stop();
  }


  /**
  * Sets the Rotation on the Left/Right ring pieces for all Browsers
  * @param rotate: integer 0 - 0.5 for how much to rotate (never over half, because rings are in 2 pieces)
  */
  setRotation(rotate) {
    // Apply Rotation for All Browsers
    rotate *= -1;
    let tRight = 'scaleX(-1) rotate(' + rotate + 'turn)';
    let tLeft = 'rotate(' + rotate + 'turn)';
    this.dom.cap.style.transform = tLeft; //Chrome
    this.dom.cap_right.style.transform = tRight;
    this.dom.cap.style.OTransform = tLeft; //Opera
    this.dom.cap_right.style.OTransform = tRight;
    this.dom.cap.style.MozTransform = tLeft; //Mozilla
    this.dom.cap_right.style.MozTransform = tRight;
    this.dom.cap.style.msTransform = tLeft; //Microsoft
    this.dom.cap_right.style.msTransform = tRight;
    this.dom.cap.style.webkitTransform = tLeft; //Webkit
    this.dom.cap_right.style.webkitTransform = tRight;
  }


  /**
   * Returns the URL of a named asset in Countdown.URLS
   * @param name: key to fetch in Countdown.URLS
   * @param index: [optional] if array of related images, the index to the one you want
   */
  url(name, index=0) {
    let path = Countdown.SVG_PREFIX;
    if ("num" == name) //These are in a subdirectory
      path += Countdown.SVG_NUM_DIR;
    if(!(name in Countdown.URLS)) {
      console.log("ERROR: no such URL: '" + name + "'");
      return;
    }
    let url = Countdown.URLS[name];
    if (Array.isArray(url))
      url = url[index]; //Note: Let out of bounds error normally
    return this.rootPath + path + url + Countdown.SVG_SUFFIX;
  }
}
