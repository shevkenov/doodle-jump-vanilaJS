document.addEventListener("DOMContentLoaded", () => {
  let grid = document.querySelector(".grid");
  let doodler = document.createElement("div");
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  let paltformCaount = 5;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let leftTimerId;
  let rightTimerId;
  let isRight;
  let isLeft;
  let score = 0;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + "px";
    doodler.style.bottom = doodlerBottomSpace + "px";
  }

  class Platform {
    constructor(platBottom) {
      this.bottom = platBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement("div");

      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }

  function createPlatform() {
    for (let index = 0; index < paltformCaount; index++) {
      let platGap = 600 / paltformCaount;
      let platBottom = 100 + index * platGap;
      let newPlat = new Platform(platBottom);
      platforms.push(newPlat);
    }
  }

  function movePlatform() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((plat) => {
        plat.bottom -= 4;
        let visual = plat.visual;
        visual.style.bottom = plat.bottom + "px";

        if(plat.bottom < 10){
            let firstPlat = platforms[0].visual;
            firstPlat.classList.remove('platform');
            platforms.shift();

            score++
            const newPlat = new Platform(600);
            platforms.push(newPlat)
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(() => {
      doodlerBottomSpace += 20;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace > startPoint + 200) {
        fall();
      }
    }, 30);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((plat) => {
        if (
          doodlerBottomSpace >= plat.bottom &&
          doodlerBottomSpace <= plat.bottom + 15 &&
          doodlerLeftSpace + 60 >= plat.left &&
          doodlerLeftSpace <= plat.left + 85 &&
          !isJumping
        ) {
          console.log("landed");
          startPoint = doodlerBottomSpace;
          jump();
        }
      });
    }, 30);
  }

  function control(e) {
    if (e.key == "ArrowLeft") {
      moveLeft();
    } else if (e.key == "ArrowRight") {
      moveRight();
    } else if (e.key == "ArrowUp") {
      moveStraight();
    }
  }

  function moveStraight() {
    isLeft = false;
    isRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function moveLeft() {
    if (isRight) {
        clearInterval(rightTimerId);
        isRight = false;
    }

    isLeft = true;
    leftTimerId = setInterval(() => {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + "px";
      } else {
        moveRight();
      }
    }, 30);
  }

  function moveRight() {
    if (isLeft) {
        clearInterval(leftTimerId);
        isLeft = false;
    }

    isRight = true;
    rightTimerId = setInterval(() => {
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + "px";
      } else {
        moveLeft();
      }
    }, 30);
  }

  function start() {
    if (!isGameOver) {
      createPlatform();
      createDoodler();
      setInterval(movePlatform, 30);
      jump();
      document.addEventListener("keyup", control);
    }
  }

  function gameOver() {
    console.log("game over");
    isGameOver = true;

    while(grid.firstChild){
        grid.removeChild(grid.firstChild)
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    isRight = false;
    isLeft = false;
  }

  document.addEventListener('keyup', (e) => {
      if(e.key == ' '){
          isGameOver = false;
          platforms = [];
          score = 0;
          grid.innerHTML = '';
          start();
      }
  })
});
