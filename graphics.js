let Graphics = (function(){
  let that = {};
  let canvas = $('#gameCanvas')[0];
  let context = canvas.getContext('2d');
  let backgroundReady = false;
  let background = new Image();
  let particleImageReady = false;
  let particleImage = new Image();
  let x = 300;
  that.score = 0;
  that.lives = 3;
  let newBallScore = 100;
  let balls = [];

  background.onload = () => {
    backgroundReady = true;
  };

  particleImage.onload = () => {
    particleImageReady = true;
  };

  particleImage.src = 'Images/flower.png';

  background.src = 'Images/background.png';

  that.gameBall = function(x,y) {
    let that = {};
    that.pos = {x: x, y: y, dx: 2, dy: -4};
    balls.push(that.pos);

    let bricks = Bricks.bricks();

    let maxSpeed = 1.6;
    let ballSpeed = .8;
    let speedIncrease = 0.20;

    let magnitude = -1;
    let radius = 10;

    let greenHits = 0;
    let hitsPerLife = 0;

    let cols = 14;
    let rows = 8;

    let xPadding = 0;
    let yPadding = 0;


    that.createCircle = function(x, y) {
      context.beginPath();
      context.fillStyle = 'Red';
      context.arc(x,y,radius,0,2*Math.PI);
      context.closePath();
      context.fill();

    };

    function detectDeath(x, y, dy) {
      if (dy > 0 && y >= 600 ) {
        for (let j=0; j < balls.length; j++) {
          if (balls[j].x == x && balls[j].y == y) {
            balls.splice(j, 1);
          }
        }

        if(balls.length == 0) {
          Graphics.lives -= 1;
          ballSpeed = 0.60;

          hitsPerLife = 0;
          greenHits = 0;

          that.pos = {x: Graphics.paddle.center.x + (Graphics.paddle.width / 2), y: Graphics.paddle.center.y};

          Graphics.paddle.width = 100;
          Game.countdownStartingValue = 3;
          Game.countdown  = 0;

          Game.needBall = true;
          Game.beginCountdown = true;

          dx = 2;
          dy = -4;

          that.drawBall();
          Graphics.drawCountdown(Game.countdownStartingValue);

          if (Graphics.lives <= 0) {
            //end the game
            Game.gameOver = true;

            Game.countdownStartingValue = -2;
            Game.countdown= 0;

            Game.beginCountdown = false;

            $('#gameCanvas').addClass('hidden');
            $('#brickCanvas').addClass('hidden');
            GameOver.drawLoss(Graphics.score);
          }
        }
        return true;

      } else {
        return false;
      }


    }

    function paddleIntersect(x, y, dx, dy) {
      if (dy > 0 && ((x + dx) <= xPadding + Graphics.paddle.width + 10 && (x + dx) >= xPadding - 15) && (y + dy >= 510 && y + dy <= 515 ) ) {
        return true;
      } else {
        return false;
      }
    }

    function brickIntersect(x, y, dx, dy) {
      for (let i=0; i < rows; i++) {
        for (let j=0; j < cols; j++) {
          if(typeof(bricks[i][j]) != 'undefined') {

            if (x + dx <= bricks[i][j].x + 70 && x + dx >= bricks[i][j].x - 10 && y + dy >= bricks[i][j].y - 5  && y + dy <= bricks[i][j].y + 32 ) {

              hitsPerLife += 1;


              Game.brickCollision.active = true;
              Game.brickCollision.x = bricks[i][j].x;
              Game.brickCollision.y = bricks[i][j].y;

              if (Graphics.score + bricks[i][j].points >= newBallScore) {
                newBallScore += 100;
                Game.passed100 = true;
              }

              Graphics.score += bricks[i][j].points;

              if (bricks[i][j].color == 'Green') {
                greenHits += 1;

                if (greenHits == 1) {
                  Graphics.paddle.width = Graphics.paddle.width / 2;
                }
              }

              if (hitsPerLife == 4) {
                ballSpeed += speedIncrease;
              } else if (hitsPerLife == 12 ) {
                ballSpeed += speedIncrease;
              } else if (hitsPerLife == 36) {
                ballSpeed += speedIncrease;
              } else if (hitsPerLife == 62) {
                ballSpeed += speedIncrease;
              }

              bricks[i].splice(j,1);

              if (bricks[i].length == 0) {
                if (Graphics.score + 25 >= newBallScore) {
                  newBallScore += 100;
                  Game.passed100 = true;
                }

                Graphics.score += 25;
              }
              return true;
            }
          } else {
              if (Graphics.score >= 508) {

                context.clearRect(0,0,canvas.width, canvas.height);
                Game.beginCountdown = false;
                Game.countdownStartingValue = -2;
                Game.countdown= 0;
                Game.pause = true;
                Game.gameOver = true;
                $('#gameCanvas').addClass('hidden');
                $('#brickCanvas').addClass('hidden');
                GameOver.drawWin(Graphics.score);
              } else {
                continue;
              }
              return false;
          }
        }

      }
    }

    that.drawBall = function() {

      Graphics.paddle.drawPaddle();
      xPadding = Graphics.paddle.center.x;
      yPadding = Graphics.paddle.center.y;

      Graphics.bricks.drawBricks();

      for (let i = 0; i < balls.length; i++) {

        that.createCircle(balls[i].x, balls[i].y);

        if (balls[i].x + balls[i].dx > canvas.width-5 || balls[i].x + balls[i].dx < 5) {
          balls[i].dx = -balls[i].dx;
        }

        if (balls[i].y + balls[i].dy > canvas.height-5 || balls[i].y + balls[i].dy < 5) {
          balls[i].dy = -balls[i].dy;
        }

        if (paddleIntersect(balls[i].x, balls[i].y, balls[i].dx, balls[i].dy)){

          //http://seangeo.blogspot.com/2011/03/breakout-week-3-when-balls-collide.html
          balls[i].dx = (canvas.width/2 - Graphics.paddle.center.x) / (Graphics.paddle.width / 2);
          balls[i].dy = -balls[i].dy;
          
        }

        if (brickIntersect(balls[i].x, balls[i].y, balls[i].dx, balls[i].dy)) {
          balls[i].dy = -balls[i].dy;
          Graphics.bricks.drawBricks();
        }

        if (detectDeath(balls[i].x, balls[i].y, balls[i].dy)) {
          break;
        }
        balls[i].x += balls[i].dx * ballSpeed;
        balls[i].y += balls[i].dy * ballSpeed;
      };
    }

    that.pause = function() {
      dx = 2;
      dy = 4;

    };

    return that;
  };

  that.bricks = (function() {
    let that = {};
    let bricks = Bricks.bricks();

    let brickWidth = 60;
    let brickHeight = 20;

    let canvas = $('#brickCanvas')[0];
    let context = canvas.getContext('2d');

    let greenReady = false;
    let greenBrick = new Image();
    
    let yellowReady = false;
    let yellowBrick = new Image();

    let orangeReady = false;
    let orangeBrick = new Image();

    let blueReady = false;
    let blueBrick = new Image();


    greenBrick.onload = () => {
      greenReady = true;
    };

    greenBrick.src = 'Images/greenBrick.png';

    orangeBrick.onload = () => {
      orangeReady = true;
    };

    orangeBrick.src = 'Images/orangeBrick.png';

    yellowBrick.onload = () => {
      yellowReady = true;
    };

    yellowBrick.src = 'Images/yellowBrick.png';

    blueBrick.onload = () => {
      blueReady = true;
    };

    blueBrick.src = 'Images/blueBrick.png';

    that.drawBricks = function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let i=0; i < 8; i++) {
        for (let j=0; j < 14; j++) {
          if(typeof(bricks[i][j]) != 'undefined'){
            if( bricks[i][j].color == 'Yellow') {
              context.drawImage(yellowBrick, bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);
            } else if( bricks[i][j].color == 'Blue') {
              context.drawImage(blueBrick, bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);
            } else if( bricks[i][j].color == 'Green') {
              context.drawImage(greenBrick, bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);
            } else if( bricks[i][j].color == 'Orange') {
              context.drawImage(orangeBrick, bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);
            }
          } else {
            continue;
          }
        }
      }
    };

    return that;

  }());

  that.paddle = (function() {
    let that = {};

    let paddleImageReady = false;
    let image = new Image();

    that.width = 100;
    that.height = 25;
    that.center = {x: 450, y: 500};

    let paddleSpeed = 15;
    let friction = 0.98;

    let keyLeft = false;
    let keyRight = false;


    $(document).keydown(function(e) {
      if (e.keyCode == 37) {
        keyLeft = true;
      } else if (e.keyCode == 39) {
        keyRight = true;
      }

    }).keyup(function(e) {
      if (e.keyCode == 37) {
        keyLeft = false;
      } else if (e.keyCode == 39) {
        keyRight = false;
      }
    })

    image.onload = () => {
      paddleImageReady = true;
    }

    image.src = 'Images/paddle.png';

    that.drawPaddle = function() {
      if (paddleImageReady) {
        context.clearRect(0,0,canvas.width,canvas.height);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        if(keyLeft) {
          that.moveLeft();
        }

        if(keyRight) {
          that.moveRight();
        }
        context.textAlign = 'center';

        context.fillStyle = 'Black';
        context.font = '20px Helvetica';
        context.fillText('Lives:', 30, 610);

        for (let i=1; i <= Graphics.lives; i++) {

          context.drawImage(image, 60*i, 595, 50, 20);
        }

        context.fillText('Score: ' + Graphics.score, 900, 610);

        context.drawImage(image, that.center.x, that.center.y, that.width, that.height);

      } 
    };

    that.moveLeft = function(elapsedTime) {
      if (that.center.x - (paddleSpeed * friction) >= 0) {

        that.center.x -= (paddleSpeed * friction);
      } else {
        that.center.x = 0;
      }
    };

    that.moveRight = function(elapsedTime) {
      if (that.center.x + (paddleSpeed * friction) <= (canvas.width - that.width)) {

        that.center.x += (paddleSpeed * friction);
      } else {
        that.center.x = (canvas.width - that.width);
      }

    };
    return that;
  }());

  that.particle = function(p) {
    let that = {};
    p.alive = 0;

    p.width = 20;
    p.height = 20;



    that.update = function(elapsedTime) {
      elapsedTime = elapsedTime / 1000;

      p.alive += elapsedTime;

      p.position.x += (elapsedTime * p.speed * p.direction.x);
      p.position.y += (elapsedTime * p.speed * p.direction.y);

      p.rotation += p.speed / 500;

      return (p.alive < p.lifetime);
    }

    that.draw = function() {

      context.save();
    	context.translate(p.position.x + p.width / 2, p.position.y + p.height / 2);
    	context.rotate(p.rotation);
    	context.translate(-(p.position.x + p.width / 2), -(p.position.y + p.height / 2));

      context.drawImage(particleImage, p.position.x, p.position.y, p.width, p.height);

    	context.restore();
    }

    return that;

  };


  that.drawCountdown = function(countdownStartingValue) {

    canvas = $('#countCanvas')[0];
    context = canvas.getContext('2d');

    if (countdownStartingValue > 0) {
      Game.pause = true;

      context.clearRect(0,0,canvas.width, canvas.height);

      context.fillStyle = 'Black';
      context.textAlign = 'center';

      context.font = '300px Helvetica';
      context.fillText(countdownStartingValue, 500, 400);
    }
    canvas = $('#gameCanvas')[0];
    context = canvas.getContext('2d');

  };

  return that;


}());
