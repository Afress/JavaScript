/*
*
* 遊戲名稱:雙人版_貪吃蛇遊戲
* 失敗條件:吃到自己、撞到別人或是撞到邊界
* 2021/12/21
* 
*/
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');

var canvas = document.getElementById('playing_canvas')
var cx = canvas.getContext('2d')

let eatOrNot=false;//判別是否有吃到食物
let initial=true;//為了初始化生成食物
let movingState=false;//這個是為了迴避按其他鍵造成game over
let finish=false;//for reload()
let ticks = 100;//speed
let clock = 0;

var bound = {
    width: 500,
	height: 500,
    fillColor:'rgb(0,0,0)',
    boundColor:'rgb(255,255,255)'
};

class SNAKE {
    constructor(playerColor,startX,startY){
        this.body=[{x:startX,y:startY}];
        this.size_X=10;
        this.size_Y=10;
        this.headColor=playerColor;
        this.bodyColor='rgb(0,255,0)';
        this.boundColor='rgb(255,255,255)';
        this.dx = 0;
        this.dy = 0;
        this.gameOver=false;
        this.eatItemNum=0;
    }
    drawSnake(dx,dy){
        this.body.forEach((currentNode,index) => {
            if(index ===0)
            {
                cx.fillStyle = this.headColor;
                cx.fillRect(this.body[0].x, this.body[0].y,this.size_X,this.size_Y);
                cx.strokeStyle = this.boundColor;
                cx.strokeRect(this.body[0].x, this.body[0].y,this.size_X,this.size_Y);
            }
            else
            {
                cx.fillStyle = this.bodyColor;
                cx.fillRect(currentNode.x, currentNode.y,this.size_X,this.size_Y);
                cx.strokeStyle = this.boundColor;
                cx.strokeRect(currentNode.x,currentNode.y,this.size_X,this.size_Y);
            }
        });        
    }
    eatYourSelf(newPosition)
    {
        if(this.body.length>1){
            this.body.forEach((item,index)=>{
                if((newPosition.x===item.x)&&(newPosition.y===item.y))
                {
                    this.gameOver=true;
                    return true;
                }   
            });
        }
    }
    collisionWall(newPosition,bound)
    { 
        if((newPosition.x+this.size_X > bound.width) || (newPosition.x < 0))
        {
            this.gameOver=true;
            return true; 
        }
        else if((newPosition.y+this.size_Y > bound.height) || (newPosition.y < 0))
        {
            this.gameOver=true;
            return true; 
        }
    }
    collisionSnake(snake)
    {
        snake.body.forEach((v,i,a)=>{ 
            if((v.x===this.body[0].x)&&(v.y===this.body[0].y))
            {
                this.gameOver=true;
            }
        });  
    }
    reSet(startX,startY){
        this.body=[{x:startX,y:startY}];
        this.dx = 0;
        this.dy = 0;
        this.gameOver=false;
        this.eatItemNum=0;
    }
};

class FOOD  {
    constructor(){
        this.body=[{x:0,y:0}],
        this.size_X=10,
        this.size_Y=10,
        this.bodyColor='rgb(0,255,255)',
        this.boundColor='rgb(255,255,255)'
    }
    checkEaten(snake,snake_newPosition){
        if((snake_newPosition.x===this.body[0].x)&&(snake_newPosition.y===this.body[0].y))
        {
            snake.body.unshift(snake_newPosition);
            snake.eatItemNum=snake.eatItemNum+1;
            eatOrNot=true;
        }
        else
        {
            snake.body.unshift(snake_newPosition);
            snake.body.pop();
        }
    }
};

var player01=new SNAKE('rgb(255,255,0)',genRandom(bound.width/10)*10,genRandom(bound.height/10)*10); //yellow block
var player02=new SNAKE('rgb(255,255,255)',genRandom(bound.width/10)*10,genRandom(bound.height/10)*10); //white block
var food=new FOOD();

function drawBlock() 
{
    cx.fillStyle = bound.fillColor;
    cx.fillRect(0, 0, bound.width, bound.height);
    cx.strokeStyle = bound.boundColor;
    cx.strokeRect(0, 0, bound.width, bound.height);
};

function genRandom(rangeNum){
     return Math.floor(Math.random()*rangeNum);
}

function putFood(){
    if(initial===true)
    {
        let newPosition={x:genRandom(bound.width/10)*10,y:genRandom(bound.height/10)*10};
        food.body[0]=newPosition;
        //Drawing
        cx.fillStyle = food.bodyColor;
        cx.fillRect(newPosition.x, newPosition.y,food.size_X,food.size_Y);
        cx.strokeStyle = food.boundColor;
        cx.strokeRect(newPosition.x, newPosition.y,food.size_X,food.size_Y);
    }
    else
    {
        if(eatOrNot===true){
            let newPosition={x:genRandom(bound.width/10)*10,y:genRandom(bound.height/10)*10};
            food.body[0]=newPosition;
            eatOrNot=false;
            //Drawing
            cx.fillStyle = food.bodyColor;
            cx.fillRect(newPosition.x, newPosition.y,food.size_X,food.size_Y);
            cx.strokeStyle = food.boundColor;
            cx.strokeRect(newPosition.x, newPosition.y,food.size_X,food.size_Y);
        }
        else
        {
            //Drawing
            cx.fillStyle = food.bodyColor;
            cx.fillRect(food.body[0].x, food.body[0].y,food.size_X,food.size_Y);
            cx.strokeStyle = food.boundColor;
            cx.strokeRect(food.body[0].x, food.body[0].y,food.size_X,food.size_Y);
        }
    }
    initial=false;
};

window.addEventListener("load", () => {
    drawBlock();
    player01.drawSnake();
    player02.drawSnake();
    putFood();
});

function reload()
{
    clock = 0;
    ticks = 100;
    eatOrNot=false;
    initial=true;
    movingState=false;
    finish=false;

    food.body.pop();

    player01.reSet(genRandom(bound.width/10)*10,genRandom(bound.height/10)*10); 
    player02.reSet(genRandom(bound.width/10)*10,genRandom(bound.height/10)*10); 

    score1.textContent='玩家一(黃色)分數為 : 0';
    score2.textContent='玩家二(白色)分數為 : 0';
}

function direction(event) {
    // Up
    if (event.keyCode === 38 && player01.dy !== 10) {
        player01.dy = -10;
        player01.dx = 0;
    }
    // Down
    else if (event.keyCode === 40 && player01.dy !== -10) {
        player01.dy = 10;
        player01.dx = 0;
    }
    // Left
    else if (event.keyCode === 37 && player01.dx !== 10) {
        player01.dy = 0;
        player01.dx = -10;
    }
    // Right
    else if (event.keyCode === 39 && player01.dx !== -10) {
        player01.dy = 0;
        player01.dx = 10;
    }

    // Up w
    else if (event.keyCode === 87 && player02.dy !== 10) {
        player02.dy = -10;
        player02.dx = 0;
    }
    // Down s
    else if (event.keyCode === 83 && player02.dy !== -10) {
        player02.dy = 10;
        player02.dx = 0;
    }
    // Left a
    else if (event.keyCode === 65 && player02.dx !== 10) {
        player02.dy = 0;
        player02.dx = -10;
    }
    // Right d
    else if (event.keyCode === 68 && player02.dx !== -10) {
        player02.dy = 0;
        player02.dx = 10;
    }
}

function autoMoving(){
    clock = setInterval(()=>{loopProcess();}, ticks);
    if (clock > 1 )
    {
        clearInterval(clock);
    }
}

window.addEventListener("keydown", (event) => {
    direction(event);
    if(event.keyCode === 32){autoMoving();};
});

function moving(snake01,snake02,food)
{
    if(finish!==true){
        let player01_newPosition={x:snake01.body[0].x+snake01.dx,y:snake01.body[0].y+snake01.dy};
        let player02_newPosition={x:snake02.body[0].x+snake02.dx,y:snake02.body[0].y+snake02.dy};
        
        snake01.eatYourSelf(player01_newPosition);
        snake02.eatYourSelf(player02_newPosition);
        if((snake01.gameOver===true)&&(snake02.gameOver===true)){
            alert('Both Players Game Over:eat youself');
            finish=true;
            return false;
        }
        else if(snake01.gameOver===true){
            alert('Player 02 Win The Game : Player1 eat youself');
            finish=true;
            return false;
        }
        else if(snake02.gameOver===true){
            alert('Player 01 Win The Game : Player2 eat youself');
            finish=true;
            return false; 
        }

        if(initial===false)
        {
            snake01.collisionWall(player01_newPosition,bound);
            snake02.collisionWall(player02_newPosition,bound);


            if((snake01.gameOver===true)&&(snake02.gameOver===true)){
                alert('Both Players Game Over:Crash Wall');
                finish=true;
                return false; 
            }    
            else if(snake01.gameOver===true){
                alert('Player 02 Win The Game : Player1 Crash Wall');
                finish=true;
                return false; 
            }
            else if(snake02.gameOver===true){
                alert('Player 01 Win The Game : Player2 Crash Wall');
                finish=true;
                return false;
            }

        }

        food.checkEaten(snake01,player01_newPosition);
        food.checkEaten(snake02,player02_newPosition);

        snake01.collisionSnake(snake02);
        snake02.collisionSnake(snake01);
        if((snake01.gameOver===true)&&(snake02.gameOver===true)){
            alert('Both Players Game Over:Collision Both');
            finish=true;
            return false;
        }
        else if(snake01.gameOver===true){
            alert('Player 02 Win The Game : Player1 Collide Player2 ');
            finish=true;
            return false;
        }
        else if(snake02.gameOver===true){
            alert('Player 01 Win The Game : Player2 Collide Player1 ');
            finish=true;
            return false;
        }
        score1.textContent='玩家一(黃色)分數為 : '+snake01.eatItemNum*10;
        score2.textContent='玩家二(白色)分數為 : '+snake02.eatItemNum*10;
    }
}

function loopProcess()
{
    moving(player01,player02,food);
    if (finish === true)
    {
        reload();
        drawBlock();
        player01.drawSnake();
        player02.drawSnake();
        putFood();
        return false;
    }
    else
    {
        drawBlock();
        player01.drawSnake();
        player02.drawSnake();
        putFood();
    }   
}