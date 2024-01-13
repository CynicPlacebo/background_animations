//TODO: do another page with specified colors

/********** Global Variables **********/
var SGV = { //SGV stands for Squares Global Variables
  colors:['#012','#021','#023','#102','#109','#120','#201','#208','#210','#301','#330','#410'],
  cssClassContainer:'rotate_hue_container',
  cssClassRotateHue:'rotate_hue',
  div:null, //will hold the element meant to contain all squares
  num:{
    cells:0, //Will be calculated later rows * cols
    cols:0, //Start with Default cols
    rows:14, //Start with Default rows (14 works well in 1080p)
  },
  h:0, //Height of each square (or rectangle)
  w:0, //Width of each square (or rectangle)
};

/**********************************************************************
* Populates the identified div with a bunch of squares to colorize
* @param id: ID of the div where the squares should go
* @param rows: number of desired rows
* @param cols: number of desired columns (0 or -1 to auto-detect based on rows)
**********************************************************************/
function squares_init(id='squares', rows=SGV.num.rows, cols=0) {
  // Get or Create the Container for the Squares
  SGV.div = document.getElementById(id);
  if (null == SGV.div) {
    console.log("No container found. Creating DIV #" + id);
    SGV.div = document.createElement('DIV');
    SGV.div.id = id;
    document.body.appendChild(SGV.div);
  }
  // Rows must be at least 1
  if (Number.isInteger(rows) && rows > 0) {
    SGV.num.rows = rows;
  } else {
    console.log("WARNING: Invalid 'rows' specification. Setting to default: " + SGV.num.rows);
    rows = SGV.num.rows;
  }
  // Style the Container with CSS  
  SGV.div.classList.add(SGV.cssClassContainer);

  // Round UP to 1 decimal (hence *10 then /10)
  SGV.h = Math.ceil(window.innerHeight * 10 / rows) / 10;
  if (cols) {
    SGV.w = Math.ceil(window.innerWidth * 10 / cols) / 10;
  } else { //Cols not specified. Determine based on "square" squares
    SGV.w = SGV.h; //Width = Height for a true square
    cols = Math.ceil(window.innerWidth / SGV.w);
  }
  SGV.num.cols = cols;
  SGV.num.cells = rows * cols;

  // Generate Squares
  console.log("Generating Grid: " + cols + "x" + rows);
  console.log("Each Square: " + SGV.w + "x" + SGV.h);
  for (let i=0; i<rows; ++i) {
    for (let j=0; j<cols; ++j) {
      let cell = document.createElement('DIV');
      cell.classList.add('rotate_hue');
      cell.style.backgroundColor = RotateHue.randA(SGV.colors);
      cell.style.height = SGV.h + 'px';
      cell.style.width = SGV.w + 'px';
      SGV.div.appendChild(cell);
    }
    let br = document.createElement('BR');
    SGV.div.appendChild(br); // Line Break after each row
  }

  //TODO: move some of this to RotateHue.js
  SGV.rotator = new RotateHue(); //TODO: don't always do defaults
  setInterval(doHueRotate, 50);
}
function doHueRotate() {
  SGV.rotator.shiftRandomSet();
}
