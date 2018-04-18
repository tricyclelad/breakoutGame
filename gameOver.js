let GameOver = (function () {
  let that = {};
  let canvas = $('#menuCanvas')[0];
  let context = canvas.getContext('2d');
  let backgroundReady = false;
  let background = new Image();
  let x = 500;

  background.onload = () => {
    backgroundReady = true;
  };
  background.src = 'Images/background.png';

  that.drawLoss = function(score) {
    if(backgroundReady) {
      context.clearRect(0,0,canvas.width,canvas.height);
      context.drawImage(background,0,0, canvas.width, canvas.height);

      context.textAlign = 'left';
      context.fillStyle = 'Black';

      context.font = "80px Helvetica"

      context.fillText("Game Over!", x,  100);

      context.font = '50px Helvetica';

      context.fillText("Score: " + score, x,  200);

      context.fillText("Enter Your Name", x,  300);

      $('.names').removeClass('hidden');

      context.font = '20px Helvetica';

      context.textAlign = 'center';
      context.fillText("Press ESC To Exit", x,  610);

    }
  };

  that.drawWin = function(score) {
    if(backgroundReady) {
      context.clearRect(0,0,canvas.width,canvas.height);
      context.drawImage(background,0,0, canvas.width, canvas.height);

      context.textAlign = 'left';
      context.fillStyle = 'black';

      context.font = "80px Helvetica"

      context.fillText("You Won!", x,  100);

      context.font = '30px Helvetica';

      context.fillText("Score: " + score, x,  200);

      context.fillText("Enter Your name: ", x,  300);

      $('.names').removeClass('hidden');

      context.textAlign = 'center';
      context.font = '20px Helvetica';

      context.fillText("Press ESC To Exit", x,  610);

    }
  };


  return that;

}());
