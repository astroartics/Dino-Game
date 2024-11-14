
let canvasHeight = 300;
let canvasWidth = 750;
let dinoHeight = 90;
let dinoWidth = 84;
let dinoX = 20;
let dinoY = canvasHeight - dinoHeight;
let dinoImg;
let context;

let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = canvasHeight - cactusHeight;
let cactus1, cactus2, cactus3;

let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;
let gameOver = false;
let score = 0;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

window.onload = function () {
    let canvas = document.querySelector("#game");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context = canvas.getContext('2d');

    dinoImg = new Image();
    dinoImg.src = "img/dino.png";
    dinoImg.onload = () => {
        context.drawImage(dinoImg, dinoX, dinoY, dinoWidth, dinoHeight);
    }

    cactus1 = new Image();
    cactus1.src = "img/cactus1.png";
    cactus2 = new Image();
    cactus2.src = "img/cactus2.png";
    cactus3 = new Image();
    cactus3.src = "img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    document.addEventListener('keydown', jump);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); // First, in jump function, the dino goes up by 10 units,
    // and then this line takes the dino down by 0.4 units everytime and as
    // the values on y axis increase as we go down, we have to stop the dino
    // at the fixed ground position i.e. at dinoY, hence getting the dino down
    // until it reaches the dinoY(ground position).
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "img/dino-dead.png";
            dinoImg.onload = () => {
                // context.clearRect(dino.x, dino.y, dino.width, dino.height);
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }


    context.fillStyle = "black";
    context.font = "20px Courier";
    score++;
    context.fillText(score, 5, 20);
}

function placeCactus() {
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let selectCactus = Math.random();

    if (selectCactus > 0.90) // 10% chance
    {
        cactus.img = cactus3;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } else if (selectCactus > 0.70) {
        cactus.img = cactus2;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    } else if (selectCactus > 0.50) {
        cactus.img = cactus1;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

function jump(e) {
    if ((e.code == 'Space' || e.code == 'ArrowUp') && dino.y == dinoY) {
        velocityY = -10;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && // a -> top left corner, b-> top right corner
        a.x + a.width > b.x && // a-> top right corner, b-> top left corner
        a.y < b.y + b.height &&// a-> top left corner, b-> bottom left corner
        a.y + a.height > b.y   // a-> bottom left corner, b-> top left corner
}