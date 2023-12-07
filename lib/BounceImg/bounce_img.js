/**********************************************************************
* Dependency: BounceImg.js
* This file is just an example of how to use BounceImg.js 
* if you use this file unaltered, you will need to:
*   - Have a #bounce_imgs div with 1 or more <img> tags in it
*   - Call bounce_img_init() to trigger the page to start animating
**********************************************************************/

/*************** Global Variables & Functions ***************/
var BIGV = { //BIGV stands for Bounce Image Global Variables
  id:'bounce_imgs', //ID of element holding images to animate
  img:[], //Holds the BounceImg objects
  request:null, //Holds Animation Frame Request
};


/**********************************************************************
* Get all images in #bounce_imgs, animate them, & setup Key Listener
* @param id: id of element containing the <img>s to animate
* @param explain: true-ish (true or 1) to show an explanation for a few secs
* @param speed: 0-8 for slow to fast animation
* @param colorChange: true-ish to rotate colors. False otherwise
* @param jitter: true-ish (true or 1) to enable jitter. False otherwise
**********************************************************************/
function bounce_img_init(id, explain=0, speed=0, colorChange=1, jitter=1) {
  if (id) //Allow user to swap default ID for their own
    BIGV.id = id;
  if (explain) //true-ish is all that's required
    bounce_img_flashExplanation();

  let bounceImgs = document.getElementById(BIGV.id);
  for (e of bounceImgs.childNodes) {
    if (e.tagName && e.tagName.toUpperCase() == 'IMG') {
      let name = e.src.split('/');
      name = name[name.length - 1]; //Last item in the path
      console.log("BounceImg Found: " + name);
      BIGV.img.push(new BounceImg(e, speed, colorChange, jitter));
    }
  }
  bounce_img_animate();
  // Event Listener for Speed/Color hot keys
  window.addEventListener('keyup', bounce_img_handleKeyUp, false);
}


/** Animate each of the images a little bit, & repeat call */
function bounce_img_animate() {
  BIGV.request = requestAnimationFrame(bounce_img_animate);
  for (let img of BIGV.img)
    img.translate();
}


/** Shows a DIV with a Table of Hot Keys for how to use the application */
function bounce_img_flashExplanation() {
  let divExplain = document.createElement('div');
  divExplain.id = "bounce_img_explanation";
  divExplain.innerHTML =
    '<div id="bounce_img_explanation_close" onclick="bounce_img_hideExplanation()">&times;</div>' +
    '<h1>Description of Hot Keys for the Screensaver</h1>' +
    '<table>' +
      '<thead><tr><th>Hot Keys</th><th>Explanation</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Space Bar</td><td>Enable/Disable Logo Color Changing</td></tr>' +
        '<tr><td>1 - 9</td><td>Slow Speed - Fast Speed</td></tr>' +
      '</tbody>' +
    '</table>';
  document.body.appendChild(divExplain);
}


/**
* Spacebar enables/disables logo color change
* 1-9 determine animation speed (0 too, but it's a synonym of 1)
*/
function bounce_img_handleKeyUp(e) {
  let numericPrefixes = {'digit':true, 'numpa':true}; //Numpad trimmed to 5 length
  let prefix = e.code.substr(0,5).toLowerCase();
  let tempInt = parseInt(e.key); //May or may not be a digit for speed setting
  if ('space' == prefix) {
    for (let img of BIGV.img)
      img.colorToggle();
  } else if (prefix in numericPrefixes && Number.isInteger(tempInt)) {
    speed = tempInt - 1;
    if (speed < 0) //1-9 => indexes 0-8. 0 is a synonym for 1
      speed = 0;
    for (let img of BIGV.img)
      img.speed = speed;
  }
}


/** Hide the table that explains hot keys to the user */
function bounce_img_hideExplanation() {
  let explanation = document.getElementById('bounce_img_explanation');
  if (null != explanation)
    explanation.style.display = 'none';
}