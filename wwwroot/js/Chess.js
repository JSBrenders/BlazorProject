//création du plateau
function LoadChessBoard() {
    var board = document.getElementById("board")

    var chessGame = new ChessGame();

    var tileNumber = 0;

    for (var i = 0; i < 8; i++) {

        var row = document.createElement("div");
        row.classList.add("d-flex")
        row.classList.add("flex-row")

        var position = document.createElement("div");
        position.classList.add("numberContainer");
        var text = document.createElement("span");
        text.classList.add("number");
        text.innerHTML = 8 - i;
        position.appendChild(text);
        row.appendChild(position);

        for (var j = 0; j < 8; j++) {

            var tile = document.createElement("div");
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    tile.classList.add("white")               
                }
                else {
                    tile.classList.add("black")
                }
            } else {
                if (j % 2 == 0) {
                    tile.classList.add("black")
                }
                else {
                    tile.classList.add("white")
                }
            }

            tile.classList.add("pieceContainer");
          
            var numPiece = chessGame.initialState[i][j];

            var piece = document.createElement("div");
            piece.innerHTML = !numPiece ? "" : "&#" + (9811 + numPiece) + ";";
            piece.classList.add("piece");

            piece.id = "tile" + tileNumber;
            tileNumber++;

            tile.appendChild(piece);

            row.appendChild(tile);


        }


        board.appendChild(row);       

        $(".pieceContainer").droppable({
            //revert: true
            drop: function (event, ui) {
                //event.target.firstChild.innerHTML == ui.draggable.innerHTML;
                if (event.target.firstChild.innerHTML == "") {
                    event.target.firstChild.innerHTML = ui.draggable[0].innerHTML;
                    //event.target.firstChild.innerHTML = "test";
                    //console.log(event.target.firstChild.innerHTML);
                    ui.draggable[0].innerHTML = "";
                }
            }
        });

        $(".piece").draggable({
            helper: 'clone',
            //connectToSortable: ".pieceContainer",
            //revert: "invalid"
        }); 

        
    }

    //ajout des lettres en bas
    var row = document.createElement("div");
    row.classList.add("d-flex")
    row.classList.add("flex-row")

    var cornerPosition = document.createElement("div");
    cornerPosition.classList.add("corner");
    row.appendChild(cornerPosition);

    for (var j = 0; j < 8; j++) {

        var position = document.createElement("div");
        position.classList.add("letterContainer");
        var text = document.createElement("span");
        text.classList.add("letter");
        text.innerHTML = String.fromCharCode(65 + j)
        position.appendChild(text);
        row.appendChild(position);

    }

    board.appendChild(row);

    //affectation data sur chaque tile
    for (var i = 0; i < 64; i++) {
        var ligne = Math.trunc(i / 8, 0);
        var colonne = i % 8;
        $('#tile' + i).data('position', { i: ligne, j: colonne, p: chessGame.currentState[ligne][colonne] });
        //console.log($('#tile' + i).data('position'));
        $('#tile' + i).click(function () {
            console.log($(this).data('position'));
            //var availablePositions = chessGame.checkPossibleTiles()
        });

    }
   
}



//Fonction drag'n'drop
function drop(ev) {
    //ev.preventDefault();

}

function drag(ev) {
    //ev.preventDefault();
}

function allowDrop(ev) {
    //ev.preventDefault();
}

class ChessGame {

    constructor() {

        this.initialState = [];

        //this.WR = ["R","white rook",3];
        //this.WN = ["N","white night",5];
        //this.WB = ["B","white biskop",4];
        //this.WQ = ["Q","white queen",2];
        //this.WK = ["K","white king",1];
        //this.WP = ["P","white pawn",6];

        //this.BR = ["R","white rook",9];
        //this.BN = ["N","white night",11];
        //this.BB = ["B","white biskop",10];
        //this.BQ = ["Q","white quenn",8];
        //this.BK = ["K","white king",7];
        //this.BP = ["P","white pawn",12];

        this.WR = 3;
        this.WN = 5;
        this.WB = 4;
        this.WQ = 2;
        this.WK = 1;
        this.WP = 6;

        this.BR = 9;
        this.BN = 11;
        this.BB = 10;
        this.BQ = 8;
        this.BK = 7;
        this.BP = 12;

        this.E = 0;

        //ajout des pièces noires
        this.initialState.push([this.BR, this.BN, this.BB, this.BQ, this.BK, this.BB, this.BN, this.BR])
        var whitePawnRow = []
        for (var i = 0; i < 8; i++) {
            whitePawnRow.push(this.BP);
        }
        this.initialState.push(whitePawnRow);

        //ajout des lignes vides
        for (var i = 0; i < 4; i++) {
            var emptyRow = []
            for (var j = 0; j < 8; j++) {
                emptyRow.push(this.E)
            }
            this.initialState.push(emptyRow);
        }

        //ajout des pièces blanches
        var whitePawnRow = []
        for (var i = 0; i < 8; i++) {
            whitePawnRow.push(this.WP);
        }
        this.initialState.push(whitePawnRow);
        this.initialState.push([this.WR, this.WN, this.WB, this.WQ, this.WK, this.WB, this.WN, this.WR])

        this.currentState = this.initialState;

    }


    //On vérifie les cases possibles sur le board
    checkPossibleTiles(numPiece) {

        //on va renvoyer un tuple représentant une position
        var freeTiles = [];

        switch (numPiece) {
            //roi blanc
            case 1:

                break;
            //reine blanc
            case 2:
                break;
            //tour blanc
            case 3:
                break;
            //fou blanc
            case 4:
                break;
            //cavalier blanc
            case 5:
                break;
            //pion blanc
            case 6:
                break;
            //roi noir
            case 7:
                break;
            //reine noir
            case 8:
                break;
            //tour noir
            case 9:
                break;
            //fou noir
            case 10:
                break;
            //cavalier noir
            case 11:
                break;
            //pion noir
            case 12:
                break;
        }
    }

    getPosition(numPiece) {

    }
}