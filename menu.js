let Menu = (function() {
  let that = {};
  let menuCount = 0;

  let backgroundReady = false;
  let background = new Image();

  let highlighterReady = false;
  let highlighter = new Image();

  let canvas = $('#menuCanvas')[0];
  let context = canvas.getContext('2d');

  let x = 500;
  let y = 300;

  let numPlay = 0;

  background.onload = () => {
    backgroundReady = true;
  };

  highlighter.onload = () => {
    highlighterReady = true;
  };

  background.src = 'Images/background.png';
  highlighter.src = 'Images/highlighter.png';


  that.drawMenu = function(){

    if(backgroundReady) {
      menuCount = 0;
      context.clearRect(0,0,canvas.width,canvas.height);
      context.drawImage(background, 0,0, canvas.width, canvas.height);

      context.textAlign = 'left';

      context.font = '60px Helvetica';
      context.fillText('BREAKOUT', x, 100);

      context.font = '30px Helvetica';

      context.fillText('Play', x, 200);

      context.fillText('High Scores', x, 300);

      context.fillText('Credits', x, 400);

      context.font = '20px Helvetica';

      context.textAlign = 'center';
      context.fillText('Press ENTER to select an option', x, 610);

      canvas = $('#menuSprite')[0];
      context = canvas.getContext('2d');

      $('#menuSprite').removeClass('hidden');
      context.drawImage(highlighter, x-40, 180, 25, 25);

      canvas = $('#menuCanvas')[0];
      context = canvas.getContext('2d');


    } 
  }

  function highlightOption(x,y) {
    canvas = $('#menuSprite')[0];
    context = canvas.getContext('2d');
    switch (y) {
      case 1:
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(highlighter, x-40, 180, 25, 25);
        break;
      case 2:
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(highlighter, x-40, 280, 25, 25);
        break;
      case 3:
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(highlighter, x-40, 380, 25, 25);
        break;
    }
  }

  that.selectOption = function() {
    switch (menuCount) {
      case 0: //Start Game 
        menuCount = 0;
        numPlay += 1;

        context.clearRect(0,0,canvas.width, canvas.height);

        $('#menuSprite').addClass('hidden');
        $('#gameCanvas').removeClass('hidden');
        $('#brickCanvas').removeClass('hidden');

        if (numPlay == 1) {
          context.drawImage(background, 0, 0, canvas.width, canvas.height);
          Graphics.paddle.drawPaddle();

          Game.beginCountdown = true;
          Game.countdownStartingValue = 3;
          Game.countdown= 0;
        } else {
          Game.beginCountdown = true;
          Game.countdownStartingValue = 3;
          Game.countdown= 0;
          Graphics.drawCountdown(Game.countdownStartingValue);
          $('#countCanvas').removeClass('hidden');
        }
        break;
      case 1: //HighScores
        menuCount = 0;
        context.clearRect(0,0,canvas.width, canvas.height);
        HighScores.initialize();
        break;
      case 2: //Credits
        menuCount = 0;
        context.clearRect(0,0,canvas.width, canvas.height);
        Credits.initialize();
        break;
    }
  };

  that.downArrow = function() {
    //toggle the options arrow
    if (menuCount >= 2) {
      menuCount = 0;
    } else {
      menuCount += 1;
    }

    switch (menuCount) {
      case 0:
        highlightOption(x,1)
        break;
      case 1:
        highlightOption(x,2)
        break;
      case 2:
        highlightOption(x,3)
        break;
    }


  };


  that.upArrow = function() {
    if (menuCount <= 0) {
      menuCount = 2;
    } else {
      menuCount -= 1;
    }

    switch (menuCount) {
      case 0:
        highlightOption(x,1)
        break;
      case 1:
        highlightOption(x,2)
        break;
      case 2:
        highlightOption(x,3)
        break;
    }
  };

  return that;
}());
