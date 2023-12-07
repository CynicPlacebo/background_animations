/*******************************************************************
* Class for images that will be animated around the screen
*
* Version: 0.1 (only tested in Chrome)
* Copyright: 2023 Cynic Placebo (https://localmess.com/)
* License: BSD-3-Clause
*******************************************************************/
class BounceImg {
  static colors = ['0', '0.1', '0.2', '0.5', '0.7', '0.9']; //e.g. hue-rotate(0.1turn)
  static jitterFactor = 1000; //Decimals to round Jitter to (1000 = 3 decimals)
  static jitterMax = 0.3; //Must be smaller than speeds[0]
  static speeds = [0.4, 0.5, 0.8, 1.2, 1.7, 2.3, 2.9, 3.6, 4.4];

  /**
  * Default the member variables
  * @param e: the DOM Element of the <img> to animate
  * @param speed: 0-8 for slowest to fastest
  * @param changeColors: 1 to change colors, 0 to not
  * @param jitter: 1 to enable a random amount of jitter (avoid synchronized images)
  *                0 otherwise
  */
  constructor(e, speed=0, changeColors=1, jitter=1) {
    this.e = e;
    this.currColor = 0;
    this.deltaX = Math.floor(Math.random() * (window.innerWidth - this.w()));
    this.deltaY = Math.floor(Math.random() * (window.innerHeight - this.h()));
    this.directionX = (Math.random() >= 0.5) ? 1 : -1;
    this.directionY = (Math.random() >= 0.5) ? 1 : -1;
    this.flagColorChange = (changeColors) ? 1 : 0; //true-ish defaults to "on"
    this.jitter = 0; //Assume Jitter Off
    if (jitter) //Turn Jitter On
      this.setRandJitter();
    this.speed = speed;
    // Force speed to be in-bounds
    if (speed >= BounceImg.speeds.length)
      this.speed = BounceImg.speeds.length - 1;
    else if (speed < 0)
      this.speed = 0;
  }


  /********** Getters **********/
  h() { return this.e.offsetHeight; }
  w() { return this.e.offsetWidth; }
  left() { return this.e.offsetLeft; }
  top() { return this.e.offsetTop; }
  minX() { return this.left() * -1; }
  maxX() { return window.innerWidth - this.left() - this.w(); }
  minY() { return this.top() * -1; }
  maxY() { return window.innerHeight - this.top() - this.h(); }
  // NOTE: Don't cache window.innerWidth so resize works automatically


  /** If it's gone out of bounds, change direction & switch color */
  checkBounds() {
    if (this.deltaX > this.minX() && this.deltaX < this.maxX()
      && this.deltaY > this.minY() && this.deltaY < this.maxY())
      return; //Nothing is out of bounds
    this.switchColor();
    if (this.deltaX <= this.minX()) //Too far West
      this.directionX = 1; //Positive X movement = East
    else if (this.deltaX >= this.maxX())
      this.directionX = -1; //Negative X movement = West
    if (this.deltaY <= this.minY()) //Too far North
      this.directionY = 1; //Positive Y movement = South
    if (this.deltaY >= this.maxY()) //Too far South
      this.directionY = -1; //Negative Y movement = North
  }


  /** Turn color alteration on or off */
  colorToggle() {
    this.flagColorChange++;
    this.flagColorChange %= 2; //Keep it 0 or 1
  }


  /** Returns a random amount of Jitter to apply to the speed */
  setRandJitter() {
    let jitterRange = BounceImg.jitterMax * 2; //for both pos or neg jitter
    let rand = Math.random() * jitterRange;
    let jitter = rand - BounceImg.jitterMax; //either pos or neg jitter
    // Round & Set to Member Variable
    jitter = Math.round(BounceImg.jitterFactor * jitter) / BounceImg.jitterFactor;
    this.jitter = jitter;
  }


  /** Alter the image color (if flag enabled) to randomize the hue */
  switchColor() {
    var color = 0;
    if (this.flagColorChange == 1) {
      color = Math.floor(Math.random() * BounceImg.colors.length);
      while(color == this.currColor)
        color = Math.floor(Math.random() * BounceImg.colors.length);
    }
    this.e.style.filter = "hue-rotate(" + BounceImg.colors[color] + "turn)";
    this.currColor = color;
  }


  /**
  * Move this object through CSS Transform.
  * Use this.speed to determine how much to move.
  */
  translate() {
    let speedX = (BounceImg.speeds[this.speed] + this.jitter) * this.directionX;
    let speedY = (BounceImg.speeds[this.speed] + this.jitter) * this.directionY;
    this.deltaX += speedX;
    this.deltaY += speedY;
    this.checkBounds();

    let transform = 'translate3d(' + this.deltaX + 'px, ' + this.deltaY + 'px, 0)';
    this.e.style.transform = transform;
    //Handle Other Browsers
    this.e.style.OTransform = transform; //Opera
    this.e.style.MozTransform = transform; //Mozilla
    this.e.style.msTransform = transform; //Microsoft
    this.e.style.webkitTransform = transform; //Webkit
  }
} // --- END of Class BounceImg ---