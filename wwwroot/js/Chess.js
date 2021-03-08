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

                resetIndications();

                var dataDepart = $("#" + ui.draggable[0].id).data('position')
                var dataArrivee = $("#" + event.target.firstChild.id).data('position')
                var posDepart = [dataDepart.i, dataDepart.j];
                var posArrivee = [dataArrivee.i, dataArrivee.j];


                if (chessGame.checkPossibleTiles(dataDepart).contains(posArrivee)) {
                    event.target.firstChild.innerHTML = ui.draggable[0].innerHTML;
                    ui.draggable[0].innerHTML = "";


                    chessGame.currentState[posDepart[0]][posDepart[1]] = 0;
                    chessGame.currentState[posArrivee[0]][posArrivee[0]] = dataDepart.p;

                    chessGame.listePositions.push(chessGame.currentState);
                    //chessGame.VisualizeState(chessGame.currentState, chessGame.currentTurn, chessGame.toWhite);
                    chessGame.currentTurn++;
                    chessGame.toWhite = !chessGame.toWhite;
                    chessGame.toBlack = !chessGame.toBlack;


                    //update front
                    //update des datas des 2 tiles concernées
                    $('#' + event.target.firstChild.id).data('position').p = $('#' + ui.draggable[0].id).data('position').p;
                    $('#' + ui.draggable[0].id).data('position').p = 0;

                    //on disable le drag and drop pour la couleur dont ce n'est pas le tour
                    $(".piece").each(function () {
                        if ($(this).data('position')) {

                            var piece = $(this).data('position').p

                            //si c'est au tour des blancs
                            if (chessGame.toWhite) {
                                //si la piece traitée est noire on disable sinon on enable
                                if (chessGame.isBlack(piece)) {
                                    //console.log("black disabled");
                                    $(this).draggable('disable');
                                } else if (chessGame.isWhite(piece)) {
                                    //console.log("white enabled");
                                    $(this).draggable({
                                        helper: 'clone'
                                    });
                                    $(this).draggable('enable');
                                }
                            } else {
                                //sinon c'est le tour des noirs et on inverse
                                if (chessGame.isWhite(piece)) {
                                    //console.log("white disabled");
                                    $(this).draggable('disable');
                                } else {
                                    //console.log("black enabled");
                                    $(this).draggable({
                                        helper: 'clone'
                                    });
                                    $(this).draggable('enable');
                                }
                            }
                        }
                    });

                }
            }
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
        $('#tile' + i).click(function () {
            var data = $(this).data('position');
            var availablePositions = chessGame.checkPossibleTiles(data);
            //afficher les cases possibles
            console.log("Positions disponibles : " + availablePositions);

            //réinitialiser les cases
            resetIndications();


            for (var i = 0; i < availablePositions.length; i++) {

                var x = availablePositions[i][0];
                var y = availablePositions[i][1];


                var tile = $('#tile' + (x * 8 + y));
                var parent = $('#tile' + (x * 8 + y)).parent();

                console.log(availablePositions[i]);
                var tileJS = document.getElementById('tile' + (x * 8 + y));

                var targetPiece = chessGame.currentState[x][y]

                console.log("same couleur : " + chessGame.isSameColor(data.p, targetPiece));

                if (data.p != 0 && (targetPiece == 0 || !chessGame.isSameColor(data.p, targetPiece))) {
                    if (targetPiece == 0) {
                        var previewElement = document.createElement("span");
                        previewElement.classList.add("dot");
                        parent.append(previewElement);
                    } else {
                        var targetElementOuter = document.createElement('div');
                        var targetElementInner = document.createElement('div');
                        targetElementOuter.classList.add('targetOuter');
                        targetElementInner.classList.add('targetInner');
                        targetElementInner.appendChild(tileJS);
                        targetElementOuter.appendChild(targetElementInner);
                        parent.append(targetElementOuter);
                    }
                }
            }
        });

    }

    $(".piece").each(function () {
        if ($(this).data('position').p < 7) {
            $(this).draggable({
                helper: 'clone'
            });
        }
    });

}



class ChessGame {

    constructor() {

        this.initialState = [];

        this.listePositions = [this.initialState];

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

        this.toWhite = true;
        this.toBlack = false;

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
        this.currentTurn = 0;
    }


    //On vérifie les cases possibles sur le board
    //data.i = ligne, data.j = colonne, data.p = numéro du type de piece
    checkPossibleTiles(data) {
        //on va renvoyer une liste d'objet pos = (ligne,colonne) de cases libres ou de pièces à prendre
        var freeTiles = [];

        var i = data.i;
        var j = data.j;

        switch (data.p) {
            //roi blanc et roi noir
            case 1:
            case 7:
                for (var x = -1; x < 2; x++) {
                    for (var y = -1; y < 2; y++) {
                        if (i + x >= 0 && i + x < 8 && j + y >= 0 && j + y < 8) {
                            if (this.currentState[i + x][j + y] == 0) {
                                console.log("case traitée : " + (i + x) + "," + (j + y));
                                freeTiles.push([i + x, j + y]);
                            }
                            else {
                                var dataD = { i: i + x, j: j + y, p: this.currentState[i + x][j + y] }
                                if (this.canTake(data, dataD)) {
                                    var pos = [i + x, j + y]
                                    freeTiles.push(pos);
                                }
                            }
                        }
                    }
                }

                return freeTiles;

                break;
            //reine blanche et reine noire
            case 2:
            case 8:

                //horizontal et vertical
                //vertical - on procède case par case depuis la position de la piece
                var direction = [1, -1];
                for (var t = 0; t < 2; t++) {
                    console.log(direction[t]);
                    for (var x = direction[t]; x + i < 8 && x + i >= 0 ; x += direction[t]) {
                        //console.log("i : " + x + " j : ", + y);
                        console.log(x + i);
                        if (this.currentState[x + i][j] == 0) {
                            console.log("case traitée : " + x + i + "," + (j));
                            freeTiles.push([x + i, j]);
                        }
                        else {
                            var dataD = { i: x + i, j: j, p: this.currentState[x + i][j] }
                            if (this.canTake(data, dataD)) {
                                var pos = [x + i, j]
                                freeTiles.push(pos);
                            }
                            break;
                        }
                    }
                }
                //if (i + x >= 0 && i + x < 8) {
                //    if (this.currentState[i + x][j + y] == 0) {
                //        console.log("case traitée : " + (i + x) + "," + (j + y));
                //        freeTiles.push([i + x, j]);
                //    }
                //    else {
                //        var dataD = { i: i + x, j: j, p: this.currentState[i + x][j + y] }
                //        if (this.canTake(data, dataD)) {
                //            var pos = [i + x, j]
                //            freeTiles.push(pos);
                //        }
                //    }
                //}


                //diagonales


                return freeTiles;
                break;
            //tour blanche et tour noir
            case 3:
            case 9:
                return freeTiles;
                break;
            //fou blanc et fou noir
            case 4:
            case 10:
                return freeTiles;
                break;
            //cavalier blanc et cavalier noir
            case 5:
            case 11:
                return freeTiles;
                break;
            //pion blanc et pion noir
            case 6:
            case 12:
                freeTiles.push([4, 4], [4, 5])
                return freeTiles;
                break;
            ////roi noir
            //case 7:
            //    //on utilise le code du roi blanc
            //    var data1 = data;
            //    data1.p = 1;
            //    return checkPossibleTiles(data1)
            //    //return freeTiles;
            //    break;
            ////reine noire
            //case 8:
            //    return freeTiles;
            //    break;
            ////tour noire
            //case 9:
            //    return freeTiles;
            //    break;
            ////fou noir
            //case 10:
            //    return freeTiles;
            //    break;
            ////cavalier noir
            //case 11:
            //    return freeTiles;
            //    break;
            ////pion noir
            //case 12:
            //    freeTiles.push([6, 4])
            //    return freeTiles;
            //    break;
            default:
                break;
        }
    }

    //si il y a un check
    isCheked() {

    }


    //peut prendre la piece adverse ou non
    canTake(dataD, dataA) {
        var posD = [dataD.i, dataD.j]
        var posA = [dataA.i, dataA.j]

        //si les pieces sont de couleur opposé
        //if (dataA.p != 0 && this.isWhite(dataD.p) != this.isWhite(dataA.p)) {
        //    //la piece visée est bien dans les cases possibles
        //    //if (this.checkPossibleTiles(dataD).includes((dataD.i, dataD.j))) {
        //        return true;
        //    //}
        //}
        return !this.isSameColor(dataD.p, dataA.p);
    }

    //renvoi la couleur de la piece
    isWhite(p) {
        return p < 7 && p > 0;
    }

    isBlack(p) {
        return p > 6 && p < 13;
    }

    isSameColor(p1, p2) {
        return (this.isWhite(p1) && this.isWhite(p2)) || (this.isBlack(p1) && this.isBlack(p2));
    }

    //Visualiser un etat
    VisualizeState(State, index, white) {

        console.log("Position N°" + (index + 1) + " : " + (white ? "Trait aux blancs" : "Trait aux noirs"));

        State.forEach(ligne => {
            var row = "";
            ligne.forEach(col => {
                row += col + " ";
            });
            console.log(row);
        });

    }
}




Array.prototype.contains = function (subArray) {

    var contain = false;

    this.forEach(function (element) {
        if (subArray.equals(element)) {
            contain = true;
        }
    });


    return contain;
}

Array.prototype.equals = function (Array2) {

    var equals = true;

    if (this.length != Array2.length) {
        return false;
    }

    for (var i = 0; i < this.length; i++) {
        if (this[i] != Array2[i]) {
            equals = false;
        }
    }
    return equals;
}

function resetIndications() {
    $('.dot').remove();
    $('.targetOuter').each(function () {
        var piece = $(this).find('.piece');
        var parent = $(this).parent();
        $(parent).append(piece);
    });
    $('.targetOuter').remove();
}