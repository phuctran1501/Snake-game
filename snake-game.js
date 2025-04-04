const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

let gameOver = false;
let gameLoopInterval;
let gameSpeed = document.getElementById('speed'); 
const headImage = new Image();
headImage.src = "images.jpg";

const bodyImage = new Image();
bodyImage.src = "images2.jpg";

window.onload = () => {
    showMenu();
};

function showMenu() {
    const gameOverElement = document.getElementById('gameOverText');
    if (gameOverElement) {
        gameOverElement.innerHTML = `
            <div style="text-align: center;">
                <h1 style="color: white; font-size: 36px;">Chọn Chế Độ</h1>
                <button id="speed" onclick="startGame(10)" style="padding: 10px 20px; font-size: 20px; margin: 5px;">Dễ</button>
                <button id="speed" onclick="startGame(15)" style="padding: 10px 20px; font-size: 20px; margin: 5px;">Trung Bình</button>
                <button id="speed" onclick="startGame(25)" style="padding: 10px 20px; font-size: 20px; margin: 5px;">Khó</button>
                <button id="speed" onclick="startGame(50)" style="padding: 10px 20px; font-size: 20px; margin: 5px;">Asian</button>
                </div>
        `;
        gameOverElement.style.display = 'block';
    }
    canvasContainer.style.display = 'none';
    canvasElement.style.display = 'none';
}

function startGame(speed) {
    gameSpeed = speed;
    resetGame();
}

function resetGame() {
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
    }
    gameOver = false;
    snake = new Snake(20, 20, 20);
    apple = new Apple();
    const gameOverElement = document.getElementById('gameOverText');
    if (gameOverElement) {
        gameOverElement.style.display = 'none';
    }
    const canvasContainer = document.getElementById('game-container');
    const canvasElement = document.getElementById('canvas');
    canvasContainer.style.display = 'block';
    canvasElement.style.display = 'block';
    gameLoop();
}

function gameLoop() {
    gameLoopInterval = setInterval(show, 1000 / gameSpeed);
}


function show() {
    update();
    draw();
}

function update() {
    if (gameOver) return;
    
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    snake.move();
    checkCollisionWithBody();
    eatApple();
    checkHitWall();
}

function checkCollisionWithBody() {
    let head = snake.tail[snake.tail.length - 1];
    
    for (let i = 0; i < snake.tail.length - 1; i++) {
        if (head.x === snake.tail[i].x && head.y === snake.tail[i].y) {
            gameOver = true;
            showGameOver();
            return;
        }
    }
}

function showGameOver() {
    const gameOverElement = document.getElementById('gameOverText');
    if (!gameOverElement) return;
    
    gameOverElement.style.display = 'block';
    gameOverElement.innerHTML = `
        <div style="text-align: center;">
            <h1 style="color: red; font-size: 48px;">GAME OVER!</h1>
            <p style="color: white; font-size: 24px;">Score: ${snake.tail.length - 1}</p>
            <button onclick="resetGame()" style="
                padding: 10px 20px;
                font-size: 20px;
                background: #00FF42;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">Play Again</button>
            <button onclick="showMenu()" style="
                padding: 10px 20px;
                font-size: 20px;
                background: #FF6347;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            ">Back to Menu</button>
        </div>
    `;
    
    clearInterval(gameLoopInterval);
}

function eatApple() {
    let head = snake.tail[snake.tail.length - 1];
    if (head.x === apple.x && head.y === apple.y) {
        snake.tail.push({ x: apple.x, y: apple.y });
        apple = new Apple();
    }
}

function checkHitWall() {
    let headTail = snake.tail[snake.tail.length - 1];
    if (gameSpeed == 50 || gameSpeed == 25) {
        if (headTail.x < 0 || headTail.x >= canvas.width || headTail.y < 0 || headTail.y >= canvas.height) {
            gameOver = true;
            showGameOver();
        }
    }
    if (headTail.x < 0) {
        headTail.x = canvas.width - snake.size;
    } else if (headTail.x >= canvas.width) {
        headTail.x = 0;
    }

    if (headTail.y < 0) {
        headTail.y = canvas.height - snake.size;
    } else if (headTail.y >= canvas.height) {
        headTail.y = 0;
    }
}

function draw() {
    createRect(0, 0, canvas.width, canvas.height, "black");

    for (let i = 0; i < snake.tail.length; i++) {
        if (i === snake.tail.length - 1) {
            canvasContext.drawImage(headImage, snake.tail[i].x, snake.tail[i].y, snake.size, snake.size);
        } else {
            canvasContext.drawImage(bodyImage, snake.tail[i].x, snake.tail[i].y, snake.size, snake.size);
        }
    }

    canvasContext.font = "20px Arial";
    canvasContext.fillStyle = "#00FF42";
    canvasContext.fillText("Score: " + (snake.tail.length - 1), canvas.width - 120, 18);

    createCircle(apple.x + apple.size / 2, apple.y + apple.size / 2, apple.size / 2, apple.color);
}

function createRect(x, y, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

function createCircle(x, y, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, Math.PI * 2);
    canvasContext.fill();
}

window.addEventListener("keydown", (event) => {
    if (gameOver) return;
    
    setTimeout(() => {
        if (event.keyCode === 37 && snake.rotateX !== 1) {
            snake.rotateX = -1;
            snake.rotateY = 0;
        } else if (event.keyCode === 38 && snake.rotateY !== 1) {
            snake.rotateX = 0;
            snake.rotateY = -1;
        } else if (event.keyCode === 39 && snake.rotateX !== -1) {
            snake.rotateX = 1;
            snake.rotateY = 0;
        } else if (event.keyCode === 40 && snake.rotateY !== -1) {
            snake.rotateX = 0;
            snake.rotateY = 1;
        }
    }, 1);
});

class Snake {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.tail = [{ x: this.x, y: this.y }];
        this.rotateX = 0;
        this.rotateY = 1;
    }

    move() {
        let newRect;

        if (this.rotateX === 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y,
            };
        } else if (this.rotateX === -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y,
            };
        } else if (this.rotateY === 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size,
            };
        } else if (this.rotateY === -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size,
            };
        }

        this.tail.shift();
        this.tail.push(newRect);
    }
}

class Apple {
    constructor() {
        let isTouching;

        while (true) {
            isTouching = false;
            this.x = Math.floor(Math.random() * (canvas.width / snake.size)) * snake.size;
            this.y = Math.floor(Math.random() * (canvas.height / snake.size)) * snake.size;

            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x === snake.tail[i].x && this.y === snake.tail[i].y) {
                    isTouching = true;
                    break;
                }
            }

            this.size = snake.size;
            this.color = "red";

            if (!isTouching) {
                break;
            }
        }
    }
}

let snake = new Snake(20, 20, 20);
let apple = new Apple();