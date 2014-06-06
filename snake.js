var left=37;
var up=38;
var right=39;
var down=40;
var field;
var snake;
var currentScore = 0;
var gameSpeed = 1

function field()
{
	this.drawSomething = function(class, x, y)
	{
		var $newThing = $().addClass(class);
		$newThing.css("left",x+"px");
		$newThing.css("top",y+"px");
		$("#gameBoard").append($newThing);
	}
}


function snake() {
	var length = 1;
	//this.blah = function() {
	//	...
	//};
	//or
	//this.blahblah = dkjfskd;
}
dfksjdfks
/*function drawSnake() {
	for(var i=0; i<snake.length; ++i)
	{
		//field.drawElement('bo')
	}
}*/

function initializeGame() {
	endPreviousGame();
	field = new field();
	snake = new snake();
	currentScore = 0;
	var directionToMove = right;
	drawSnake(snake);
};

$(document).ready(function() {
	initializeGame();
	$(document).keydown(function(key) {
		directionToMove = parseIn(key.which, 10);
		moveInDirection(directionToMove);
	});
});