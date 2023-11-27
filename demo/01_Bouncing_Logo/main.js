/*************** Global Variables & Functions ***************/
var G = {
  explanationSeconds:5, //How long to show #bounce_img_explanation
  img:[], //Holds the BounceImg objects
  request:null, //Holds Animation Frame Request
};


/** Get all images in #bounce_imgs, animate them, & setup Key Listener */
function init() {
  let bounceImgs = document.getElementById('bounce_imgs');
  for (e of bounceImgs.childNodes) {
    if (e.tagName && e.tagName.toUpperCase() == 'IMG') {
      let name = e.src.split('/');
      name = name[name.length - 1]; //Last item in the path
      console.log("BounceImg Found: " + name);
      G.img.push(new BounceImg(e));
    }
  }
  setTimeout(hideExplanation, G.explanationSeconds * 1000);
  animateBounceImgs();
  // Event Listener for Speed/Color hot keys
  window.addEventListener('keyup', handleKeyUp, false);
}


/** Animate each of the images a little bit, & repeat call */
function animateBounceImgs() {
  G.request = requestAnimationFrame(animateBounceImgs);
  for (let img of G.img)
    img.translate();
}


/**
* Spacebar enables/disables logo color change
* 1-9 determine animation speed (0 too, but it's a synonym of 1)
*/
function handleKeyUp(e) {
  let numericPrefixes = {'digit':true, 'numpa':true}; //Numpad trimmed to 5 length
  let prefix = e.code.substr(0,5).toLowerCase();
  let tempInt = parseInt(e.key); //May or may not be a digit for speed setting
  if ('space' == prefix) {
    for (let img of G.img)
      img.colorToggle();
  } else if (prefix in numericPrefixes && Number.isInteger(tempInt)) {
    speed = tempInt - 1;
    if (speed < 0) //1-9 => indexes 0-8. 0 is a synonym for 1
      speed = 0;
    for (let img of G.img)
      img.speed = speed;
  }
}


/** Hide the table that explains hot keys to the user */
function hideExplanation() {
  document.getElementById('bounce_img_explanation').style.display = 'none';
}