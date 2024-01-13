/*******************************************************************
* Class to rotate the hues of objects making for an interesting animation.
*
* Version: 0.1 (only tested in Chrome/Firefox)
* Copyright: 2023 Cynic Placebo (https://localmess.com/)
* License: BSD-3-Clause
*******************************************************************/
class RotateHue {
  static defaultHueShifts = [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]; //e.g. hue-rotate(0.1turn)

  /**
  * Default the member variables
  * @param speedMS: how many milliseconds between color changes
  * @param percent: 0.1 - 100. percent of .rotate_hue to change each time
  * @param shifts: array of hue shifts to use
  */
  constructor(speedMS=50, percent=4, shifts) {
    this.shifts = RotateHue.defaultHueShifts;
    if (Array.isArray(shifts))
      this.shifts = shifts;
    this.speed = speedMS;
    this.percent = percent;
  }

  /** Rotates the hue for a random set of .rotate_hue elements */
  shiftRandomSet() {
    // Get All Items to Potentially hue-rotate
    let items = Array.from(document.getElementsByClassName('rotate_hue'));
    // Get a Random Percentage of them
    let chosenIndices = {};
    let numChosen = 0;
    let numToChoose = Math.round(items.length / 100 * this.percent);
//console.log('numToChoose: ' + numToChoose);
    while (numChosen < numToChoose) {
      let rand = Math.floor(Math.random() * items.length);
      if (rand in chosenIndices)
        continue; //we've already chosen this one, try again
      numChosen++;
      chosenIndices[rand] = true;
    }
//console.log(Object.keys(chosenIndices));
    // Shift the Color of the Chosen Elements
    for (let i in chosenIndices) {
      let shift = RotateHue.randA(this.shifts);
      items[i].style.filter = "hue-rotate(" + shift + "turn)";
    }

  }


  /** Returns a random element of the provided array */
  static randA(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
} // --- END of Class RotateHue ---