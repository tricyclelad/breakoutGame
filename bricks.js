let Bricks = (function() {
  let that = {};
  that.rows = 8;
  that.cols = 14;

  let bricks = new Array(that.rows);

  let colorIndex = 0;
  let colorCount = -1;

  let colors = ['Yellow', 'Orange', 'Blue', 'Green'];
  let brickPoints = [1, 2, 3, 5];

  let cvs_x = 70;
  let cvs_y = 300;

  for (let i=0; i < that.rows; i++) {
    bricks[i] = new Array(that.cols);
  }

  that.initialize = function() {
    colorIndex = 0;
    colorCount = -1;

    cvs_x = 70;
    cvs_y = 300;
    for(let i=0; i < that.rows; i++) {
      colorCount += 1;

      if (colorCount == 2) {
        colorCount = 0;
        colorIndex += 1;
        cvs_y -= 80;
      }
      cvs_x = 17;
      for (let j=0; j < that.cols; j++) {
        if (colorCount == 0) {
          bricks[i][j] = {color: colors[colorIndex], x: (i+cvs_x), y: cvs_y, points: brickPoints[colorIndex] };
        } else if (colorCount == 1) {
          bricks[i][j] = {color: colors[colorIndex], x: (i+cvs_x), y: cvs_y-39, points: brickPoints[colorIndex] };
        }
        cvs_x += 69;
      }
    }

  }
  that.bricks = function() {
    return bricks;
  };

  return that;
}());
