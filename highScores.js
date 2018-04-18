let HighScores = (function(){
  let that = {};
  let inputDispatch = {};

  let canvas = $('#menuCanvas')[0];
  let context = canvas.getContext('2d');

  let backgroundReady = false;
  let background = new Image();

  let x = 500;
  let elapsedTime = 0;

  background.onload = () => {
    backgroundReady = true;
  };

  background.src = 'Images/background.png';


  function drawHighScores() {
      if(backgroundReady) {
        context.clearRect(0,0,canvas.width,canvas.height);
        context.drawImage(background,0,0, canvas.width, canvas.height);

        context.textAlign = 'left';

        context.font = "60px Helvetica"

        context.fillText("HIGH SCORES", x,  100);

        context.font = '30px Helvetica';

        let localStorageArray = [];

        for (let i=0; i < localStorage.length; i++) {
          let key = localStorage.key(i);
          localStorageArray.push(key);
        }
        localStorageArray.sort(function(a, b){return b-a});

        if(localStorageArray.length > 5) {
          localStorage.removeItem(localStorageArray[5]);

          for (let i=0; i < 5; i++) {
            context.fillText((i+1)+') ' + localStorage.getItem(localStorageArray[i])+ ': ' + localStorageArray[i], x, (i*75) + 200);
          }
        } else {
          for (let i=0; i < localStorageArray.length; i++) {
            context.fillText((i+1)+') ' + localStorage.getItem(localStorageArray[i])+ ': ' + localStorageArray[i], x, (i*75) + 200);
          }
        }

        context.font = '20px Helvetica';

        context.fillText("Press ESC To Exit High Scores", x - 450,  610);

        context.fillText("Press S To Reset High Scores", x + 200,  610);

      }

  }

  function keyDown(e) {
    if (inputDispatch.hasOwnProperty(e.keyCode)) {
      inputDispatch[e.keyCode](elapsedTime);
    }
  }

  that.initialize = function() {
    window.addEventListener('keydown', keyDown, true);
    $('#menuSprite').addClass('hidden');

    inputDispatch[27] = Menu.drawMenu;

    let clearScores = function (e) {
      if (e.keyCode == 83) {

        localStorage.clear();
        drawHighScores();
      }
    };

    //if the user enters 's', reset the high scores
    document.onkeydown = clearScores;

    drawHighScores();
  };

  return that;
}());
