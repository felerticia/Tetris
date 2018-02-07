function Arena(){
    this.board =  [];
    this.emptyColor = "#f5f0e4";
    this.score = 0;
    this.lines = 0;

    this.init = function(){
        this.board =  [];
        for(var x = 0; x < 25; x++){
            this.board[x] = []; 
            for(var y = 0; y < 16; y++){ 
                this.board[x][y] = this.emptyColor;    
            }    
        }
        this.updateScore(0);
    }

    this.draw = function(direction){
        var xx = newpiece.x;
        var yy = newpiece.y;
        var collides = false;

        //CHECK FOR OUT OF BOUND -- LEFT
        if (direction == 'l'){
            for (var x=0; x<newpiece.matrix[newpiece.index].length; x++)
                if (( newpiece.matrix[newpiece.index][x][0] == 1 && newpiece.y == 0 ) || newpiece.y == -1)
                    return !collides;
        }

        //CHECK FOR OUT OF BOUND -- RIGHT
        if (direction == 'r'){
            for (var x=0; x<newpiece.matrix[newpiece.index].length; x++)
                if (( newpiece.matrix[newpiece.index][x][2] == 1 && newpiece.y == 13 ) || newpiece.y == 14)
                    return !collides;
        }
        

        // CHECK FOR COLLISION
        for (var x=0; x<newpiece.matrix[newpiece.index].length; x++)
            for (var y=0; y<newpiece.matrix[newpiece.index][x].length; y++)
                // IF REACHED BOTTOM
                if (xx+x+1 === this.board.length && !collides){
                    for (var temp=0; temp<newpiece.matrix[newpiece.index][x].length; temp++)
                        if (newpiece.matrix[newpiece.index][x][temp] == 1){
                            this.addToArena(newpiece);
                            return !collides;
                        }
                }
                // IF REACHED ANOTHER PIECE
                else if ( xx>-1 && this.board[xx+x+1][yy+y] !== this.emptyColor && newpiece.matrix[newpiece.index][x][y] !== 0 ){
                    this.addToArena(newpiece);
                    return !collides;
                }

        
                // DRAW THE BOARD        
        for (var i=0; i<this.board.length; i++)
            for (var j=0; j<this.board[i].length; j++){
                ctx.fillStyle = this.board[i][j];
                ctx.fillRect(j * 20, i * 20  , 19 , 19);
            }
        return collides;
    }

    this.addToArena = function(currentPiece){
        for (var x=0; x<currentPiece.matrix[currentPiece.index].length; x++)
            for (var y=0; y<currentPiece.matrix[currentPiece.index][x].length; y++)
                if (currentPiece.matrix[currentPiece.index][x][y] !== 0)
                    this.board[currentPiece.x + x][currentPiece.y + y] = currentPiece.color[currentPiece.index]
        this.updateScore(10)            
        this.checkupLines();
        newpiece = new Piece();
    }

    this.updateScore = function(sc){
        this.score += sc;
        framesToSkip = 20 - Math.floor(this.score/500)
        document.getElementById("score").innerHTML = 'Lines: ' + this.lines + '<br/>Score: ' +  this.score;
    }

    this.checkupLines = function(){
        var clearedLines = 0;
        for(var x = 24; x > 0 ; x--){
            var weight = 0;
            for(var y = 0; y < 16; y++){ 
                weight += (this.board[x][y] !== this.emptyColor) ?  1 : 0;
            }
            if (weight == 16){
                clearedLines++;
                this.cleanUpRow(y);
                this.updateScore(100*clearedLines);
                this.updateLines(clearedLines);
                x++;
            }
        }
    }

    this.cleanUpRow = function(a){
        for(var y = 0; y < 16; y++){
            this.board[a][y] = this.emptyColor;
        }
        for(var x = 24; x > 1 ; x--)
            for(var y = 0; y < 16; y++)
                this.board[x][y] = this.board[x-1][y];
    }

    this.updateLines = function(ln){
        this.lines ++;
        document.getElementById("score").innerHTML = 'Lines: ' + this.lines + '<br/>Score: ' +  this.score;
    }

    this.isGameOver = function(){
        return (this.board[0][6] !== this.emptyColor || this.board[0][7] !== this.emptyColor || this.board[0][8] !== this.emptyColor ||
            this.board[1][6] !== this.emptyColor || this.board[1][7] !== this.emptyColor || this.board[1][8] !== this.emptyColor)
    }
}

function Piece(){
    this.matrix = [
        [ // T
            [0 , 0 , 0],
            [1 , 1 , 1],
            [0 , 1 , 0],
        ],
        [ // I
            [0 , 1 , 0],
            [0 , 1 , 0],
            [0 , 1 , 0]
        ],
        [ // J
            [0 , 1 , 0],
            [0 , 1 , 0],
            [1 , 1 , 0]
        ],
        [ // L
            [0 , 1 , 0],
            [0 , 1 , 0],
            [0 , 1 , 1]
        ],
        [ // O
            [0 , 0 , 0],
            [0 , 1 , 1],
            [0 , 1 , 1]
        ],
        [ // S
            [0 , 0 , 0],
            [0 , 1 , 1],
            [1 , 1 , 0]
        ],
        [ // Z
            [0 , 0 , 0],
            [1 , 1 , 0],
            [0 , 1 , 1]
        ],

        
    ];
    this.index = Math.floor(Math.random()*7);
    this.color = ["#0071bd","#ff00fe","#92278f","#009345","#facb01","#fe0000","#a60000"];

    this.x = -3;  // 0 - 16-1
    this.y = 7;  // 0 - 25-3

    this.draw = function(){
        for (var i=0; i<this.matrix[this.index].length; i++)
            for (var j=0; j<this.matrix[this.index][i].length; j++){
                ctx.fillStyle = this.color[this.index];
                if (this.matrix[this.index][i][j] != 0)
                    ctx.fillRect(this.y * 20 + j*20,this.x * 20 + i*20 , 19 , 19);
            }
    }

    this.isSquare = function(){
        return (this.index == 4)
    }

    this.move = function(dir){
        if (dir == 'd'){
            if (!arena.draw('d')){
                this.x++;
                this.draw();
            }
        }
        if (dir == 'u'){ // rotate
            if (!arena.draw('u')){
                this.rotate();
                this.draw();
            }
        }
        if (dir == 'l'){ // left
            if (!arena.draw('l')){
                this.y--;
                this.draw()
            }
        }
        if (dir == 'r'){ // right
            if (!arena.draw('r')){
                this.y++;
                this.draw()
            }
        }
    }

    this.rotate = function(){
        if (this.isSquare())
            return;
        var local = [];
        for(var x = 0; x < 3; x++){
            local[x] = []; 
            for(var y = 0; y < 3; y++){ 
                local[x][y]  = this.matrix[this.index][x][y];
            }
        }
        var rotate = function(matrix) {
            // reverse the rows
             matrix = matrix.reverse();
             // swap the symmetric elements
             for (var i = 0; i < matrix.length; i++) {
               for (var j = 0; j < i; j++) {
                 var temp = matrix[i][j];
                 matrix[i][j] = matrix[j][i];
                 matrix[j][i] = temp;
               }
             }
             return matrix
           };

        this.matrix[this.index] = rotate(local);
    }

}

var arena = new Arena();
arena.init()
var framesToSkip = 20;
var counter = 0;
var newpiece;
var c=document.getElementById("canvas");
var ctx=c.getContext("2d");
loop();
var myReq;

function loop() {
    if (arena.isGameOver()){
        cancelAnimationFrame(myReq);
        return false;
    }
    if (counter < framesToSkip) {
        counter++;
        myReq = requestAnimationFrame(loop);
        return;
    }

    /// do regular stuff
    if (newpiece === undefined){
        newpiece = new Piece();
    }
    

    newpiece.move('d');
    newpiece.draw();
    counter = 0;
    myReq = requestAnimationFrame(loop);
}

window.onkeydown = function(event){
    if (!arena.isGameOver()){
        if (event.which == 37) {
            event.preventDefault();
            newpiece.move('l');
        } else if (event.which == 38) {
            event.preventDefault();
            newpiece.move('u');
        } else if (event.which == 39) {
            event.preventDefault();
            newpiece.move('r');
        } else if (event.which == 40) {
            event.preventDefault();
            newpiece.move('d');
        }
    }
};
