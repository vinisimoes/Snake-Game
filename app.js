window.onload = function() {
    canvas = this.document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    start_span = document.getElementById("start");
    score_p = document.querySelector(".score");
    end_span = document.getElementById("end");
    final_score_span = document.getElementById("final-score");
    highscore_span = document.getElementById("highscore");

    grid = 20;

    game = {
        snake: new Snake(),
        apple: new Apple(20, 20),
        score: 0,
        highscore: 0
    };

    this.setInterval(gameLoop, 1000 / 10);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.apple.drawApple(ctx);

    start_span.addEventListener('click', () => startGame());

    game.snake.move(canvas);

    game.snake.drawSnake(ctx);

    game.snake.checkCollisionsApple(game.apple);

    if (game.snake.checkDeath()) {
        console.log("MORREU 😢");
        game.snake = new Snake();
        endGame();
    }
}

function startGame() {
    game.snake.canMove = true;
    start_span.style.display = "none";
    end_span.style.display = "none";
}

function updateScore(origin) {
    switch (origin) {
        case "eat":
            game.score++;
            break;
        case "dead":
            game.score = 0;
            break;
    }
    score_p.innerHTML = `Score: ${game.score}`;
}

function endGame() {
    start_span.style.display = "inline-block";
    end_span.style.display = "inline-block";
    final_score_span.innerHTML = `Your score : ${game.score}`;
    if (game.score > game.highscore) {
        game.highscore = game.score;
        highscore_span.innerHTML = `Highscore: ${game.highscore}`;
    }
    updateScore("dead");
}


document.addEventListener("keydown", function(e) {
    switch (e.keyCode) {
        case 87: // UP
            game.snake.moveUp(canvas);
            break;
        case 68: // RIGHT
            game.snake.moveRight(canvas);
            break;
        case 83: // DOWN
            game.snake.moveDown(canvas);
            break;
        case 65: // LEFT
            game.snake.moveLeft(canvas);
            break;
    }
})

class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    drawBlock(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, grid, grid);
    }
}

class Snake {
    constructor() {
        this.head = new Block(Math.ceil((canvas.width / 2) / grid) * grid, Math.ceil((canvas.height / 2) / grid) * grid);
        this.body = [this.head];
        this.xspeed = 1;
        this.yspeed = 0;
        this.canMove = false;
    }

    move(canvas) {
        if (this.canMove) {
            let newX_head = this.body[0].x + this.xspeed * grid;
            let newY_head = this.body[0].y + this.yspeed * grid;
            this.body.unshift(new Block(newX_head, newY_head));
            this.body.pop();
            if (this.body[0].x >= canvas.width) {
                this.body[0].x = 0;
            }
            if (this.body[0].y >= canvas.height) {
                this.body[0].y = 0;
            }
            if (this.body[0].x < 0) {
                this.body[0].x = canvas.width;
            }
            if (this.body[0].y < 0) {
                this.body[0].y = canvas.height;
            }
        }
    }

    moveUp(canvas) {
        for (let i = 0; i < this.body.length; i++) {
            if (this.yspeed != 1) {
                this.xspeed = 0
                this.yspeed = -1;
            }
        }
    }

    moveRight(canvas) {
        for (let i = 0; i < this.body.length; i++) {
            if (this.xspeed != -1) {
                this.xspeed = 1;
                this.yspeed = 0;
            }
        }
    }

    moveDown(canvas) {
        for (let i = 0; i < this.body.length; i++) {
            if (this.yspeed != -1) {
                this.xspeed = 0;
                this.yspeed = 1;
            }
        }
    }

    moveLeft(canvas) {
        for (let i = 0; i < this.body.length; i++) {
            if (this.xspeed != 1) {
                this.xspeed = -1;
                this.yspeed = 0;
            }
        }
    }

    grow() {
        this.body.push(new Block(this.body[this.body.length - 1].x, this.body[this.body.length - 1].y));
    }

    checkCollisionsApple(apple) {
        if (this.body[0].x == apple.x && this.body[0].y == apple.y) {
            this.grow();
            apple.generateApple();
            updateScore("eat");
        }
    }

    checkDeath() {
        for (let i = 2; i < this.body.length; i++) {
            if (this.body[i].x === this.body[0].x && this.body[i].y === this.body[0].y)
                return true;
        }
        return false;
    }

    drawSnake(ctx) {
        for (let i = 0; i < this.body.length; i++) {
            this.body[i].drawBlock(ctx, "black");
        }
    }
}

class Apple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    generateApple() {
        let xRand = Math.floor(Math.random() * canvas.width);
        let yRand = Math.floor(Math.random() * canvas.height);

        this.x = Math.ceil(xRand / grid) * grid - grid;
        this.y = Math.ceil(yRand / grid) * grid - grid;
    }

    drawApple(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, grid, grid);
    }
}