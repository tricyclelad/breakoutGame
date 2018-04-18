let Game = (function() {
  let that = {};
  let inputDispatch = {};
  let previousTime = performance.now();
  let elapsedTime = 0;
  let canvas = $('#menuCanvas')[0];
  let context = canvas.getContext('2d');
  that.passed100 = false;
  that.needBall = false;
  that.ball = null;
  let ball1 = null;
  that.countdownStartingValue = 3;
  that.countdown= 1000;
  that.beginCountdown = false;
  let drawFlag = false;
  let keyLeft = true;
  let keyRight = true;
  that.pause = false;
  that.gameOver = false;
  that.brickCollision = {active: false,x: -1, y:-1};
  let particlesNum = 5;
  let pDx = 0;
  let pDy = 0;
  let particles = [];
  let activeParticles = [];

   function update(elapsedTime) {
    activeParticles = [];

    if (particles.length < 30) {

      for (let prt = 0; prt < particles.length; prt++) {
        if (particles[prt].update(elapsedTime)) {
          activeParticles.push(particles[prt]);
        }
      }
    } else {
      for (let prt = 0; prt < 30; prt++) {
        if (particles[prt].update(elapsedTime)) {
          activeParticles.push(particles[prt]);
        }
      }
    }

    particles = activeParticles;

    if (that.brickCollision.active != false) {
      for (let i = 0; i < particlesNum; i++) {
        pDx = Math.random() < 0.5 ? 1 : -1;
        pDy = Math.random() < 0.5 ? 1 : -1;
        p = {
          position: {x: that.brickCollision.x + 20, y: that.brickCollision.y},
          direction: {x: Math.random() * pDx, y: Math.random() * pDy},
          speed: 300, 
          rotation: 0,
          lifetime:  1	
        };

        particles.push(Graphics.particle(p));
      }

      that.brickCollision.active = false;
    }

    if(that.beginCountdown) {
      particles = [];
      that.countdown-= elapsedTime;
    }
    if(that.countdownStartingValue < 0) {
      that.beginCountdown = false;
    }

    if (that.needBall) {
      that.ball = Graphics.gameBall(Graphics.paddle.center.x + 20,500);
      that.needBall = false;
    }

    if (that.passed100) {
      let ball1 = Graphics.gameBall(Graphics.paddle.center.x + 20,500);
      that.passed100 = false;
    }

    if(that.gameOver) {
      particles = [];
      let storeScore = function() {
        localStorage.setItem(Graphics.score, $('.names').val());
        location.reload();
        return true;
      };

      inputDispatch[13] = storeScore;
      inputDispatch[27] = 0;

    }
  }

  function render() {
    if (that.countdown <= 0 && that.countdownStartingValue >= 0) {
      that.pause = true;
      Graphics.drawCountdown(that.countdownStartingValue);
      $('#countCanvas').removeClass('hidden');
      that.countdown= 1000;
      that.countdownStartingValue -= 1;
    } else if (that.countdownStartingValue == -1) {
      $('#countCanvas').addClass('hidden');
      that.pause = false;
      drawFlag = true;
      that.countdownStartingValue = -2;
    }

    if (drawFlag && !that.pause) {
      $('#brickCanvas').removeClass('hidden');
      inputDispatch[13] = 0;
      that.ball.drawBall();
    }

    for (let i=0; i < particles.length; i++) {
      particles[i].draw();
    }
  }

  function gameLoop(time) {
    elapsedTime = time - previousTime;
    previousTime = time;
    update(elapsedTime);
    render();
    requestAnimationFrame(gameLoop);
  }

  function keyDown(e) {
    if (inputDispatch.hasOwnProperty(e.keyCode)) {
        inputDispatch[e.keyCode](elapsedTime);
    }
  }

  that.initialize = function() {
    window.addEventListener('keydown', keyDown, true);

    that.needBall = true;
    that.gameOver = false;

    let esc = function() {
      Menu.drawMenu();
      drawFlag = false;
      $('#brickCanvas').addClass('hidden');
      $('#gameCanvas').addClass('hidden');

      inputDispatch[13] = Menu.selectOption;
    };
    esc();    

    inputDispatch[27] = esc;

    inputDispatch[40] = Menu.downArrow; //down Arrow

    inputDispatch[38] = Menu.upArrow; //up arrow


    Bricks.initialize();
    requestAnimationFrame(gameLoop);
  }

  return that;
}());
