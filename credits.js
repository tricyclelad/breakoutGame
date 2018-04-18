let Credits = (function(){
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

  function drawCredits() {
      if(backgroundReady) {
        context.clearRect(0,0,canvas.width,canvas.height);
        context.drawImage(background,0,0, canvas.width, canvas.height);

        context.textAlign = 'left';

        context.font = "60px Helvetica"

        context.fillText("Credits:", x,  100);

        context.font = '30px Helvetica';

        context.fillText("Camron Martinez", x+50,  200);

        context.fillText("A01632454", x+50,  250);

        context.font = '20px Helvetica';

        context.textAlign = 'center';

        context.fillText("Press ESC To Exit", x,  610);

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
    inputDispatch[27] = Menu.drawMenu;  //enter key
    drawCredits();
  };

  return that;
}());
