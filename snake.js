var left=37;
var up=38;
var right=39;
var down=40;
var field;
var snake;
var eatenItemsCount = 0;
var oneStep = 1;
var currentFoodItem = {};

function bodyPart(x, y, direction)
{
	this.x = x;
	this.y = y;
	this.direction = direction;
}
function snake()
{
	this.bodyParts = [];
	this.bodyParts.push(new bodyPart(4,4,right));
	this.getHead = function()
	{
		return this.bodyParts[0];
	};
	this.getTail = function()
	{
		return this.bodyParts[this.bodyParts.length-1];
	};
	this.addBodyPartToTail = function()
	{
		var currentTail = this.getTail();
		if(currentTail.direction === right)
		{
			this.bodyParts.push(new bodyPart(currentTail.x-oneStep, currentTail.y, currentTail.direction)); 
		}
		if(currentTail.direction === left)
		{
			this.bodyParts.push(new bodyPart(currentTail.x+oneStep, currentTail.y, currentTail.direction)); 
		}
		if(currentTail.direction === up)
		{
			this.bodyParts.push(new bodyPart(currentTail.x, currentTail.y+oneStep, currentTail.direction)); 
		}
		if(currentTail.direction === down)
		{
			this.bodyParts.push(new bodyPart(currentTail.x, currentTail.y-oneStep, currentTail.direction)); 
		}
		++eatenItemsCount;
	};
	this.move = function(newDirection)
	{
		var newHead;
		var currentHead = this.getHead();
		if(newDirection === right)
		{
			newHead = new bodyPart(currentHead.x+oneStep, currentHead.y, newDirection);
		}
		else if(newDirection === left)
		{
			newHead = new bodyPart(currentHead.x-oneStep, currentHead.y, newDirection);
		}
		else if(newDirection === up)
		{
			newHead = new bodyPart(currentHead.x, currentHead.y-oneStep, newDirection);
		}
		else if(newDirection === down)
		{
			newHead = new bodyPart(currentHead.x, currentHead.y+oneStep, newDirection);
		}
		for(var i=this.bodyParts.length-1; i>0; --i)
		{
			this.bodyParts[i] = this.bodyParts[i-1];
		}
		this.bodyParts[0] = newHead;
	};
	this.ateFood = function(foodX, foodY)
	{
		var currentHead = this.getHead();
		console.log(currentHead.x);
		console.log(currentHead.y);
		console.log(foodX);
		console.log(foodY);
		if(currentHead.x === foodX && currentHead.y === foodY)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	this.crashed = function()
	{
		var currentHead = this.getHead();
		if(currentHead.x >= 20 || currentHead.x <= 0 || currentHead.y >= 20 || currentHead.y <= 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	};
}
function field()
{	
	this.numFood = 0;
	this.drawSomething = function(className, x, y)
	{
		var $newThing = $("<div></div>").addClass(className);
		$newThing.css("left",x*25+"px");
		$newThing.css("top",y*25+"px");
		$("#gameBoard").append($newThing);
	};
	this.hasFood = function()
	{
		if(this.numFood === 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	this.clearEntireField = function()
	{
		$(".bodyPart").remove();
		$(".food").remove();
	};
	this.removeOnlySnake = function()
	{
		$(".bodyPart").remove();
	};
	this.removeOnlyFood = function()
	{
		$(".food").remove();
	};
}

function endPreviousGame()
{
	field.clearEntireField();
}
function drawSnake()
{
	field.removeOnlySnake();
	var snakeBody = snake.bodyParts;
	for(var i=0; i<snakeBody.length; ++i)
	{
		field.drawSomething('bodyPart', snakeBody[i].x, snakeBody[i].y);
	}
}
function createFood()
{
	foodX = Math.floor((Math.random()*500)/25);
	foodY = Math.floor((Math.random()*500)/25);
	field.drawSomething('food', foodX, foodY);
	field.numFood++;
	currentFoodItem.x = foodX;
	currentFoodItem.y = foodY;
}
var gameExecutor;
function initializeGame()
{
	field = new field();
	snake = new snake();
	drawSnake();
	createFood();
}

function move(keyPressed)
{
	snake.move(keyPressed);
}

$(document).ready(function(){
	var directionToMoveIn = right;
	initializeGame();
	var keys = {};
	$(document).keydown(function(key){
		directionToMoveIn = key.which;
	});
	function gameLoop()
	{
			if(directionToMoveIn === left)
			{
				move(left);
			}
			else if(directionToMoveIn === right)
			{
				move(right);
			}
			else if(directionToMoveIn === up)
			{
				move(up);
			}
			else if(directionToMoveIn === down)
			{
				move(down);
			}
			drawSnake();
			if(snake.crashed())
			{
				field.clearEntireField();
				initializeGame();
			}
			if(snake.ateFood(currentFoodItem.x, currentFoodItem.y))
			{
				field.removeOnlyFood();
				snake.addBodyPartToTail();
				createFood();
			}
			setTimeout(gameLoop, 190);
	}
	gameLoop();
	$(document).focus();
});