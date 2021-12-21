/*
*
* 遊戲名稱:單人版_貪吃蛇遊戲
* 失敗條件:吃到自己或是撞到邊界
* 2021/12/21
*
*/
const score = document.getElementById('score');
var canvas = document.getElementById('playing_canvas')
var cx = canvas.getContext('2d')

let dx=0;//紀錄位移量x
let dy=0;//紀錄位移量y
let eatOrNot=false;//判別是否有吃到食物
let eatItemNum=0;//計分用
let initial=true;//為了初始化生成食物
let movingState=false;//這個是為了迴避按其他鍵造成game over
let gameOver=false;//for reload()
let ticks = 100;//speed
let clock = 0;

var bound = {
    width: 500,
	height: 500,
    fillColor:'rgb(0,0,0)',
    boundColor:'rgb(255,255,255)'
};

var snake = {
    body:[{x:bound.width/2,y:bound.height/2}],
    size_X:10,
    size_Y:10,
    headColor:'rgb(255,255,0)',    
    bodyColor:'rgb(0,255,0)',
    boundColor:'rgb(255,255,255)',   
};

var food = {
    body:[{x:0,y:0}],
    size_X:10,
    size_Y:10,
    bodyColor:'rgb(0,255,255)',
    boundColor:'rgb(255,255,255)'
};

function drawBlock()
{
    cx.fillStyle = bound.fillColor;
    cx.fillRect(0, 0, bound.width, bound.height);
    cx.strokeStyle = bound.boundColor;
    cx.strokeRect(0, 0, bound.width, bound.height);
};

function drawSnake(dx,dy) 
{
    snake.body.forEach((currentNode,index) => {
        if(index ===0)
        {
            cx.fillStyle = snake.headColor;
            cx.fillRect(snake.body[0].x, snake.body[0].y,snake.size_X,snake.size_Y);
            cx.strokeStyle = snake.boundColor;
            cx.strokeRect(snake.body[0].x, snake.body[0].y,snake.size_X,snake.size_Y);
        }
        else
        {
            cx.fillStyle = snake.bodyColor;
            cx.fillRect(currentNode.x, currentNode.y,snake.size_X,snake.size_Y);
            cx.strokeStyle = snake.boundColor;
            cx.strokeRect(currentNode.x,currentNode.y,snake.size_X,snake.size_Y);
        }
    });
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
    drawSnake(dx,dy);
    putFood();
});

function reload()
{
    clock = 0;
    ticks = 100;
    dx = 0;
    dy = 0;
    eatOrNot=false;
    eatItemNum=0;
    initial=true;
    movingState=false;
    gameOver=false;
    food.body.pop();
    snake.body.length=0;
    snake.body[0]={x:bound.width/2,y:bound.height/2};
    console.log('snake x:',snake.body.length,'snake x:',snake.body);
    score.textContent='分數為 : 0';
}

function direction(event) {
    // Up
    if (event.keyCode === 38 && dy !== 10) {
      dy = -10;
      dx = 0;
    }
    // Down
    else if (event.keyCode === 40 && dy !== -10) {
      dy = 10;
      dx = 0;
    }
    // Left
    else if (event.keyCode === 37 && dx !== 10) {
      dy = 0;
      dx = -10;
    }
    // Right
    else if (event.keyCode === 39 && dx !== -10) {
      dy = 0;
      dx = 10;
    }
}

function autoMoving(){
    clock = setInterval(()=>{loopProcess();}, ticks);
    if (clock > 1 )
    {
        clearInterval(clock);
        console.log("stop.");
    }
    else
        console.log('clock:',clock);
}

window.addEventListener("keydown", (event) => {
    direction(event);
    if(event.keyCode === 32){autoMoving();};
});

function moving(snake,food,dx,dy)
{
    if(gameOver!==true){
        let newPosition={x:snake.body[0].x+dx,y:snake.body[0].y+dy};

        if(snake.body.length>1){
            snake.body.forEach((item,index)=>{
                if((newPosition.x===item.x)&&(newPosition.y===item.y))
                {
                    alert('Game Over:Eat Youself');
                    gameOver=true;
                    return false; 
                }   
            });
        }

        if(initial==false)
        {
            if((newPosition.x+snake.size_X > bound.width) || (newPosition.x < 0))
            {
                alert('Game Over:Over Width');
                gameOver=true;
                return false; 
            }
            else if((newPosition.y+snake.size_Y > bound.height) || (newPosition.y < 0))
            {
                console.log('newPosition:',newPosition.x,newPosition.y,'bound:',bound.width,bound.height)
                alert('Game Over:Over Height');
                gameOver=true;
                return false; 
            }
        }

        if((newPosition.x===food.body[0].x)&&(newPosition.y===food.body[0].y))
        {
            snake.body.unshift(newPosition);
            eatItemNum=eatItemNum+1;
            eatOrNot=true;
            score.textContent='分數為 : '+eatItemNum*10;
            ticks=ticks-5; 
        }
        else
        {
            snake.body.unshift(newPosition);
            snake.body.pop();
            eatOrNot=false;
        }
    }
}

function loopProcess()
{
    moving(snake,food,dx,dy);
    if (gameOver === true)
    {
        reload();
        drawBlock();
        drawSnake(dx,dy);
        putFood();
        return false; 
    }
    else
    {
        drawBlock();
        drawSnake(dx,dy);
        putFood();
    }   
}