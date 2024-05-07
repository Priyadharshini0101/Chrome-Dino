let board;
let boardWidth = 750;
let boardHeight = 500;
let context;
let dinoWidth = 50;
let dinoHeight = 50;
let dinoX = 25;
let dinoY = 185;
let dinoImg;
let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}
let playAgainImg, id;
let cactusArray = [];
let cactusWidth = 75;
let cactusHeight = 50;
let cactusX = 700;
let cactusY = dinoY;
let cactus1Img;
let cactus2Img;
let cactus3Img;
let flag = true;
let velocityX = -8;
let velocityY = 0;
let gravity = .4;
let gameOver = false;
let start = true;
let score = 0;
let jump = false;
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");
    track = new Image();
    track.src = "./track.png";

    track.onload = function () {
        context.drawImage(track, 5, 225, 735, 25);
    }

    clouds = new Image();
    clouds.src = "./cloud.png";
    clouds.onload = function () {
        context.drawImage(clouds, 210, 75, 50, 50);
        context.drawImage(clouds, 490, 50, 50, 50);
    }

    dinoImg = new Image();
    dinoImg.src = "./dino.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = './cactus1.png';

    cactus2Img = new Image();
    cactus2Img.src = './cactus2.png';

    cactus3Img = new Image();
    cactus3Img.src = './cactus3.png';

    playAgainImg = new Image();
    playAgainImg.src = "./reset.png";

    playAgainImg.addEventListener("click", function (event) {
        playAgain();
    })
    document.addEventListener("keydown", moveDino);
    document.getElementById("board").addEventListener("click", function () {
        playAgain();
    });

    context.font = "24px 'Press Start 2P',system-ui";
    context.fillStyle = "rgb(154, 160, 166)";
    context.fillText("Chrome Dinosur", 15, 300);
    context.font = "16px  sans-serif";
    context.fillText("Tap 'Space' to play", 15, 350)
}

function playAgain() {
    location.reload();
}

function moveDino(e) {
    if (gameOver == true && e.code == "Space") {
        location.reload();
    }
    if (gameOver) {
        context.drawImage(playAgainImg, 350, 100, 50, 50);
        return;
    }

    if (e.code == "Space" && start) {
        id = requestAnimationFrame(update);
        setInterval(placeCactus, 1000);
        setInterval(runDino, 200);
        start = false;
    }
    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        jump = true;
        velocityY = -10;
    }
}

function update() {
    if (gameOver) {
        context.drawImage(playAgainImg, 350, 100, 50, 50);
        return;
    }


    id = requestAnimationFrame(update)

    context.clearRect(0, 0, board.width, board.height);
    context.font = "24px 'Press Start 2P',system-ui";
    context.fillStyle = "rgb(154, 160, 166)";
    context.fillText("Chrome Dinosur", 20, 300);
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);

    context.drawImage(clouds, 210, 75, 50, 50);
    context.drawImage(clouds, 490, 50, 50, 50);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    context.drawImage(track, 5, 225, 735, 25);

    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);
        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./dino-dead.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    context.font = "16px 'Press Start 2P'";
    context.fillStyle = "rgb(154, 160, 166)";
    context.fillText("Score", 550, 25);
    context.fillText(score, 650, 25);
}
function placeCactus() {
    if (gameOver) {
        context.drawImage(playAgainImg, 350, 100, 50, 50);
        return;
    }
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: cactusWidth,
        height: cactusHeight
    }

    let placeCactusChance = Math.random() * 100;
    if (placeCactusChance > 90) {
        cactus.img = cactus3Img;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 70) {
        cactus.img = cactus2Img;
        cactus.width = 50;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 50) {
        cactus.img = cactus1Img;
        cactus.width = 25;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

function runDino() {
    score++;
    if (gameOver) {
        context.drawImage(playAgainImg, 350, 100, 50, 50);
        return;
    }
    if (jump) {
        dinoImg.src = './dino-jump.png';
        jump = false;
    } else {
        if (flag) {
            dinoImg.src = './dino-run1.png';
            flag = false;

        } else {
            dinoImg.src = './dino-run2.png';
            flag = true;

        }
    }

}

function detectCollision(a, b) {
    return a.x < (b.x + b.width) &&
        (a.x + a.width) > b.x &&
        a.y < (b.y + b.height) &&
        (a.y + a.height) > b.y;
}