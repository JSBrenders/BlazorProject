//création du plateau
function LoadChessBoard() {
    var board = document.getElementById("board")

    var chessGame = new ChessGame();

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
          
            var numPiece = chessGame.initialState[i][j][2];

            var piece = document.createElement("div");

           

            piece.classList.add("piece")
            piece.innerHTML = !numPiece ? "" : "&#" + (9811 + numPiece) + ";";
            piece.setAttribute("draggable", true);

            tile.appendChild(piece);

            row.appendChild(tile);
        }

        $(".piece").draggable({
            helper: 'clone'
        }); 

        board.appendChild(row);

    }

    //ajout des lettres en bas
    var row = document.createElement("div");
    row.classList.add("d-flex")
    row.classList.add("flex-row")

    var cornerPosition = document.createElement("div");
    cornerPosition.classList.add("corner");
    row.appendChild(cornerPosition);

    for (var j = 0; j < 8; j++) {

        //    var position = document.createElement("div");
        //    position.classList.add("letter");
        //    position.innerHTML = String.fromCharCode(65 + j)
        //row.appendChild(position);

        var position = document.createElement("div");
        position.classList.add("letterContainer");
        var text = document.createElement("span");
        text.classList.add("letter");
        text.innerHTML = String.fromCharCode(65 + j)
        position.appendChild(text);
        row.appendChild(position);

    }

    board.appendChild(row);
}

class ChessGame {
    constructor() {

        this.initialState = [];

        this.WR = ["R","white rook",3];
        this.WN = ["N","white night",5];
        this.WB = ["B","white biskop",4];
        this.WQ = ["Q","white queen",2];
        this.WK = ["K","white king",1];
        this.WP = ["P","white pawn",6];

        this.BR = ["R","white rook",9];
        this.BN = ["N","white night",11];
        this.BB = ["B","white biskop",10];
        this.BQ = ["Q","white quenn",8];
        this.BK = ["K","white king",7];
        this.BP = ["P","white pawn",12];

        this.E = ["","empty tile", 0];

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
    }
}