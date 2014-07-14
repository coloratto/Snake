var left=37;
var up=38;
var right=39;
var down=40;
var space = 32;
var playingField;
var playingSnake;
var oneStep = 1;
var currentFoodItem = {};
var bestScore = 0;

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
	this.numItemsEaten = 0;
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
		if(currentHead.x === foodX && currentHead.y === foodY)
		{
			++this.numItemsEaten;
			if(this.numItemsEaten > bestScore)
			{
				bestScore = this.numItemsEaten;
			}
			return true;
		}
		else
		{
			return false;
		}
	}
	this.crashed = function()
	{
		var crashed = false
		var currentHead = this.getHead();
		if(currentHead.x > 19 || currentHead.x < 0 || currentHead.y > 19 || currentHead.y < 0)
		{
			this.numItemsEaten = 0;
			crashed = true;
		}
		for(var i=0; i<this.bodyParts.length; ++i)
		{
			for(var j=0; j<this.bodyParts.length; ++j)
			{
				if(i===j)
				{
					continue;
				}
				if(this.bodyParts[i].x === this.bodyParts[j].x && this.bodyParts[i].y === this.bodyParts[j].y)
				{
					crashed = true;
				}
			}
		}
		return crashed;
	};
}
function field()
{	
	this.numFood = 0;
	this.drawSomething = function(className, x, y)
	{
		var $newThing = $("<div></div>").addClass(className);
		if(className === "bodyPart")
		{
			$newThing.html("Rafa's Pen0r");
		}
		$newThing.css("left",(x)*25+"px");
		$newThing.css("top",(y)*25+"px");
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
	playingField.clearEntireField();
}
function drawSnake()
{
	playingField.removeOnlySnake();
	var snakeBody = playingSnake.bodyParts;
	for(var i=0; i<snakeBody.length; ++i)
	{
		playingField.drawSomething("bodyPart", snakeBody[i].x, snakeBody[i].y);
	}
}
function createFood()
{
	foodX = Math.floor((Math.random()*500)/25);
	foodY = Math.floor((Math.random()*500)/25);
	playingField.drawSomething('food', foodX, foodY);
	playingField.numFood++;
	currentFoodItem.x = foodX;
	currentFoodItem.y = foodY;
}
var directionToMoveIn;
var beginning;
var fast = 75;
var medium = 100;
var slow = 125;
var speed = slow;
function initializeGame()
{
	playingField = new field();
	playingSnake = new snake();
	drawSnake();
	createFood();
	directionToMoveIn = right;
	beginning = true;
	$('input[type=radio][name=speed]').on('change', function() {
		switch($(this).val())
		{
			case 'slow':
				speed = slow;
				break;
			case 'medium':
				speed = medium;
				break;
			case 'fast':
				speed = fast;
				break;
			default:
				speed = slow;
		}
	});
}
function endGame()
{
	playingField.clearEntireField();
}
function updateScore()
{
	$("#currentScore").html(playingSnake.numItemsEaten);
	$("#bestScore").html(bestScore);
}

function showStartScreen()
{
	$("#gameBoard").css("opacity","0.5");
	$("#gameBoard").append($("<div>Select a speed and press space to begin!</div>").addClass("startMessage"));
	$(".speedForm").css("display","initial");
}
function removeStartScreen()
{
	$("#gameBoard").css("opacity", "");
	$(".startMessage").css("display", "none");
	$(".speedForm").css("display","none");
}
var previousDirection;

$(document).ready(function(){
	showStartScreen();
	initializeGame();
	function gameLoop()
	{
		$(document).keydown(function(key){
			directionToMoveIn = key.which;
		});
		if(beginning === true)
		{
			if(directionToMoveIn === space)
			{
				console.log(speed);
				beginning = false;
				directionToMoveIn = right;
				previousDirection = right;
				removeStartScreen();
			}
		}
		if(beginning === false)
		{
			if(directionToMoveIn === left)
			{
				if(previousDirection !== right)
				{
					playingSnake.move(left);
					previousDirection = directionToMoveIn;
				}
				else
				{
					playingSnake.move(previousDirection);
				}
			}
			else if(directionToMoveIn === right)
			{
				if(previousDirection !== left)
				{
					playingSnake.move(right);
					previousDirection = directionToMoveIn;
				}
				else
				{
					playingSnake.move(previousDirection);
				}
			}
			else if(directionToMoveIn === up)
			{
				if(previousDirection !== down)
				{
					playingSnake.move(up);
					previousDirection = directionToMoveIn;
				}
				else
				{
					playingSnake.move(previousDirection);
				}
			}
			else if(directionToMoveIn === down)
			{
				if(previousDirection !== up)
				{
					playingSnake.move(down);
					previousDirection = directionToMoveIn;
				}
				else
				{
					playingSnake.move(previousDirection);
				}
			}
			else
			{
				playingSnake.move(previousDirection);
			}
		}
		drawSnake();
		if(playingSnake.crashed())
		{
			updateScore();
			endGame();
			showStartScreen();
			initializeGame();
		}
		if(playingSnake.ateFood(currentFoodItem.x, currentFoodItem.y))
		{
			playingField.removeOnlyFood();
			playingSnake.addBodyPartToTail();
			updateScore();
			createFood();
		}
		setTimeout(gameLoop, speed);
	}
	gameLoop();
});