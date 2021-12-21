/*
*
* 遊戲名稱:雙人版_貪吃蛇遊戲
* 失敗條件:吃到自己或是撞到到邊界
* 無成功條件退出
* 
*/
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');

var canvas = document.getElementById('playing_canvas')
var cx = canvas.getContext('2d')

//let dx=0;//紀錄位移量x
//let dy=0;//紀錄位移量y
let eatOrNot=false;//判別是否有吃到食物
//let eatItemNum=0;//計分用
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
        this.body=[{x:startX,y:startY}];//初始預定頭位置 x,y
        this.size_X=10;
        this.size_Y=10;
        this.headColor=playerColor; //'rgb(255,255,0)'
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
        //console.log(snake.body[0].x,snake.body[0].y)
    }
    eatYourSelf(newPosition)
    {
        if(this.body.length>1){
            this.body.forEach((item,index)=>{
                //console.log(item);
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
            //alert('game over:over width');
            this.gameOver=true;
            return true; //exit function
        }
        else if((newPosition.y+this.size_Y > bound.height) || (newPosition.y < 0))
        {
            //console.log('newPosition:',newPosition.x,newPosition.y,'bound:',bound.width,bound.height)
            //alert('game over:over height');
            this.gameOver=true;
            return true; //exit function
        }
    }
    collisionSnake(snake)//自己頭撞到別人
    {
        snake.body.forEach((v,i,a)=>{
            //console.log('snake body:',v);   
            if((v.x===this.body[0].x)&&(v.y===this.body[0].y))
            {
                this.gameOver=true;
            }
        });  
    }
    reSet(startX,startY){
        this.body=[{x:startX,y:startY}];//初始預定頭位置 x,y
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

var player01=new SNAKE('rgb(255,255,0)',genRandom(bound.width/10)*10,genRandom(bound.height/10)*10); //黃色
var player02=new SNAKE('rgb(255,255,255)',genRandom(bound.width/10)*10,genRandom(bound.height/10)*10); //白色
var food=new FOOD();


function drawBlock() //繪製遊玩區
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
        //console.log(newPosition.x,newPosition.y);
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
            eatOrNot=false;//reset the Statement to not eaten
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
    //console.log(food.body[0].x,food.body[0].y)
};

window.addEventListener("load", () => {
    drawBlock();
    player01.drawSnake();
    player02.drawSnake();
    //drawSnake(dx,dy);
    putFood();
});

function reload()
{
    clock = 0;
    ticks = 100;
    eatOrNot=false;
    initial=true;//為了初始化生成食物
    movingState=false;//這個是為了迴避按其他鍵造成game over
    finish=false;
    //
    food.body.pop();

    player01.reSet(genRandom(bound.width/10)*10,genRandom(bound.height/10)*10); 
    player02.reSet(genRandom(bound.width/10)*10,genRandom(bound.height/10)*10); 

    //console.log('snake x:',snake.body.length,'snake x:',snake.body);
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
    //在此要特別限制左右的原因是因為避免長度超出1的時候回頭吃自己
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
    //遭遇的奇怪bug,使用setInterval()時，參數要放入的function一定要再用()=>{}包起來，不可直接呼叫loopProcess()
    //在此的clock會因為隨著隨意按鍵按下而導致數量增加，實際反應就是遞增速度會加速，所以要限制於只需要一個clock計數即可
}

window.addEventListener("keydown", (event) => {
    direction(event);
    if(event.keyCode === 32){autoMoving();};
    //clock = setInterval(loopProcess(), ticks);
    //loopProcess();
});

function moving(snake01,snake02,food)
{
    if(finish!==true){
        //在此有修改過，原本是採用全array皆修改x,y座標，但參考其他人的程式碼後改成只改頭尾
        let player01_newPosition={x:snake01.body[0].x+snake01.dx,y:snake01.body[0].y+snake01.dy};
        let player02_newPosition={x:snake02.body[0].x+snake02.dx,y:snake02.body[0].y+snake02.dy};
        //console.log('newPosition:',newPosition.x,newPosition.y,'bound:',bound.width,bound.height)

        //失敗條件:吃到自己或是撞到到邊界或是
        //吃自己
        
        snake01.eatYourSelf(player01_newPosition);
        snake02.eatYourSelf(player02_newPosition);
        if((snake01.gameOver===true)&&(snake02.gameOver===true)){
            alert('Both Players Game Over:eat youself');
            finish=true;
            return false; //exit function
        }
        else if(snake01.gameOver===true){
            alert('Player 02 Win The Game : Player1 eat youself');
            finish=true;
            return false; //exit function
        }
        else if(snake02.gameOver===true){
            alert('Player 01 Win The Game : Player2 eat youself');
            finish=true;
            return false; //exit function
        }

        //撞牆
        if(initial===false)
        {
            snake01.collisionWall(player01_newPosition,bound);
            snake02.collisionWall(player02_newPosition,bound);

            if(snake01.gameOver===true){
                alert('Player 02 Win The Game : Player1 Crash Wall');
                finish=true;
                return false; //exit function
            }
            else if(snake02.gameOver===true){
                alert('Player 01 Win The Game : Player2 Crash Wall');
                finish=true;
                return false; //exit function
            }if((snake01.gameOver===true)&&(snake02.gameOver===true)){
                alert('Both Players Game Over:Crash Wall');
                finish=true;
                return false; //exit function
            }
        }
        //失敗條件:吃到自己或是撞到到邊界
        
        //吃到食物
        //snake01.eatFood(player01_newPosition,food);
        food.checkEaten(snake01,player01_newPosition);//在此才更新snake01的位置
        food.checkEaten(snake02,player02_newPosition);//在此才更新snake02的位置

        snake01.collisionSnake(snake02);
        snake02.collisionSnake(snake01);
        if((snake01.gameOver===true)&&(snake02.gameOver===true)){
            alert('Both Players Game Over:Collision Both');
            finish=true;
            return false; //exit function
        }
        else if(snake01.gameOver===true){
            alert('Player 02 Win The Game : Player1 Collide Player2 ');
            finish=true;
            return false; //exit function
        }
        else if(snake02.gameOver===true){
            alert('Player 01 Win The Game : Player2 Collide Player1 ');
            finish=true;
            return false; //exit function
        }

        score1.textContent='玩家一(黃色)分數為 : '+snake01.eatItemNum*10;
        //snake02.eatFood(player02_newPosition,food);
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
        //drawSnake(dx,dy);
        player01.drawSnake();
        player02.drawSnake();
        putFood();
        return false; //exit function
    }
    else
    {
        drawBlock();
        //drawSnake(dx,dy);
        player01.drawSnake();
        player02.drawSnake();
        putFood();
        //movingState=false;
        //dx=0;
        //dy=0;
    }   
    //console.log('ticks:',ticks)
}