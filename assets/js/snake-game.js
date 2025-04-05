const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

let gameOver = false;
let gameLoopInterval;
let gameSpeed = 5;  // Mặc định chế độ dễ
let gameMode = "oneApple"; // Mặc định là chế độ một táo
const headImage = new Image();
headImage.src = "./assets/img/images.jpg";

const bodyImage = new Image();
bodyImage.src = "./assets/img/images2.jpg";

let highScore = 0;

window.onload = () => {
    showInitialMenu();
};

function showInitialMenu() {
    const gameOverElement = document.getElementById('gameOverText');
    if (gameOverElement) {
        gameOverElement.innerHTML = `
            <div style="text-align: center;">
                <h1 style="color: white; font-size: 40px;">Chọn Chế Độ Táo</h1>
                <button onclick="selectGameMode('oneApple')" style="padding: 10px 20px; font-size: 20px; margin: 5px;">Một Táo</button>
                <button onclick="selectGameMode('multipleApples')" style="padding: 10px 20px; font-size: 20px; margin: 5px;">Nhiều Táo</button>
            </div>
        `;
        gameOverElement.style.display = 'block';
    }
    const canvasElement = document.getElementById('canvas');
    const canvasContainer = document.getElementById('game-container');
    if (canvasElement && canvasContainer) {
        canvasElement.style.display = 'none';  
        canvasContainer.style.background = 'black';
        canvasContainer.style.display = 'block';  
    }
    const backToMenuButton = document.getElementById('backToMenu');
    if (backToMenuButton) {
        backToMenuButton.style.display = 'none';
    }
    clearInterval(gameLoopInterval);
}

function selectGameMode(mode) {
    gameMode = mode;
    showDifficultyMenu(); // Sau khi chọn chế độ táo, hiển thị menu chọn mức độ
}

function showDifficultyMenu() {
    const gameOverElement = document.getElementById('gameOverText');
    if (gameOverElement) {
        gameOverElement.innerHTML = `
            <div style="text-align: center;">
                <h1 style="color: white; font-size: 40px;">Chọn Mức Độ</h1>
                <button onclick="startGame(5)" style="padding: 10px 20px; font-size: 20px; margin: 5px;">Dễ</button>
                <button onclick="startGame(10)" style="padding: 10px 20px; font-size: 20px; margin: 5px;">Trung Bình</button>
                <button onclick="startGame(20)" style="padding: 10px 20px; font-size: 20px; margin: 5px;">Khó</button>
                <button onclick="startGame(40)" style="padding: 10px 20px; font-size: 20px; margin: 5px;">Asian</button>
            </div>
        `;
        gameOverElement.style.display = 'block';
    }
    const backToMenuButton = document.getElementById('backToMenu');
    if (backToMenuButton) {
        backToMenuButton.style.display = 'none';
    }
    clearInterval(gameLoopInterval);
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
    apple = gameMode === "multipleApples" ? new MultipleApples() : new Apple();
    blueApples = [];  // Reset blue apples
    const gameOverElement = document.getElementById('gameOverText');
    if (gameOverElement) {
        gameOverElement.style.display = 'none';
    }
    const canvasContainer = document.getElementById('game-container');
    const canvasElement = document.getElementById('canvas');
    canvasContainer.style.display = 'block';
    canvasElement.style.display = 'block';
    const backToMenuButton = document.getElementById('backToMenu');
    if (backToMenuButton) {
        backToMenuButton.style.display = 'block';
    }
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
    createBlueApples(); // Tạo táo xanh dương nếu điều kiện thỏa mãn
}

let blueApples = []; // To store the blue apples
function createBlueApples() {

        if (snake.tail.length > 4 && blueApples.length === 0) { 
            blueApples = [];
            for (let i = 0; i < 2; i++) {
                let newBlueApple;
                do {
                    newBlueApple = new Apple();
                } while (isAppleTouchingSnake(newBlueApple)); 
                newBlueApple.color = "blue"; 
                blueApples.push(newBlueApple);
            }
        }
}

function isAppleTouchingSnake(apple) {
    for (let i = 0; i < snake.tail.length; i++) {
        if (apple.x === snake.tail[i].x && apple.y === snake.tail[i].y) {
            return true; 
        }
    }
    return false;
}

function eatApple() {
    let head = snake.tail[snake.tail.length - 1];
    
    for (let i = 0; i < blueApples.length; i++) {
        if (blueApples[i].x === head.x && blueApples[i].y === head.y) {
            snake.tail.splice(snake.tail.length - 2, 2); 
            highScore -= 2; 
            blueApples.splice(i, 1); 
            break;
        }
    }

    if (apple instanceof MultipleApples) {
        for (let i = 0; i < apple.apples.length; i++) {
            if (head.x === apple.apples[i].x && head.y === apple.apples[i].y) {
                snake.tail.push({ x: apple.apples[i].x, y: apple.apples[i].y });
                apple.apples.splice(i, 1);  
                apple.apples.push(new Apple());  
                break;
            }
        }
    } else {
        if (head.x === apple.x && head.y === apple.y) {
            snake.tail.push({ x: apple.x, y: apple.y });
            apple = new Apple();
        }
    }
}

function checkCollisionWithBody() {
    let head = snake.tail[snake.tail.length - 1];
    if (snake.tail.length <= 4) {
        return; 
    }
    else {
        for (let i = 0; i < snake.tail.length - 1; i++) {
            if (head.x === snake.tail[i].x && head.y === snake.tail[i].y) {
                gameOver = true;
                showGameOver();
                return;
            }
        }
    }
}

function showGameOver() {
    const gameOverElement = document.getElementById('gameOverText');
    if (!gameOverElement) return;
    
    gameOverElement.style.display = 'block';

    // Cập nhật kỷ lục nếu cần
    if (snake.tail.length - 1 > highScore) {
        highScore = snake.tail.length - 1;
    }

    gameOverElement.innerHTML = `
        <div style="text-align: center;">
            <h1 style="color: red; font-size: 48px;">GAME OVER!</h1>
            <p style="color: white; font-size: 24px;">Score: ${snake.tail.length - 1}</p>
            <p style="color: white; font-size: 24px;">High Score: ${highScore}</p>
            <button onclick="resetGame()" style="
                padding: 10px 20px;
                font-size: 20px;
                background: #00FF42;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">Play Again</button>
            <button onclick="showInitialMenu()" style=" 
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
    const backToMenuButton = document.getElementById('backToMenu');
    if (backToMenuButton) {
        backToMenuButton.style.display = 'none';
    }
    clearInterval(gameLoopInterval);
}

function checkHitWall() {
    let headTail = snake.tail[snake.tail.length - 1];
    if (gameSpeed == 40 || gameSpeed == 20) {
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
    canvasContext.fillText("Score: " + (snake.tail.length - 1), canvas.width - 100, 18);
    
    if (apple instanceof MultipleApples) {
        for (let i = 0; i < apple.apples.length; i++) {
            createCircle(apple.apples[i].x + apple.apples[i].size / 2, apple.apples[i].y + apple.apples[i].size / 2, apple.apples[i].size / 2, apple.apples[i].color);
        }
    } else {
        createCircle(apple.x + apple.size / 2, apple.y + apple.size / 2, apple.size / 2, apple.color);
    }

    for (let i = 0; i < blueApples.length; i++) {
        createCircle(blueApples[i].x + blueApples[i].size / 2, blueApples[i].y + blueApples[i].size / 2, blueApples[i].size / 2, blueApples[i].color);
    }
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
            if (snake.rotateX !== -1) {
                snake.rotateX = -1;
                snake.rotateY = 0;
            }
        }
        if (event.keyCode === 38 && snake.rotateY !== 1) {  
            if (snake.rotateY !== -1) {
                snake.rotateX = 0;
                snake.rotateY = -1;
            }
        }
        if (event.keyCode === 39 && snake.rotateX !== -1) {  
            if (snake.rotateX !== 1) {
                snake.rotateX = 1;
                snake.rotateY = 0;
            }
        }
        if (event.keyCode === 40 && snake.rotateY !== -1) {  
            if (snake.rotateY !== 1) {
                snake.rotateX = 0;
                snake.rotateY = 1;
            }
        }
    }, 5);  
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

class MultipleApples {
    constructor() {
        this.apples = [];
        for (let i = 0; i < 5; i++) {
            let newApple;
            do {
                newApple = new Apple();
            } while (this.isTouchingSnake(newApple));
            this.apples.push(newApple);
        }
    }

    isTouchingSnake(apple) {
        for (let i = 0; i < snake.tail.length; i++) {
            if (apple.x === snake.tail[i].x && apple.y === snake.tail[i].y) {
                return true;
            }
        }
        return false;
    }
}

let snake = new Snake(20, 20, 20);
let apple = new Apple();
let blueApple = null;  // Táo xanh dương
