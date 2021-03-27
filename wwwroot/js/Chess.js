//création du plateau

var currentChessGame;
var gameOver;
function LoadChessBoard() {

    
    gameOver = false;

    $('#replay').hide();

    var board = document.getElementById("board");
    board.innerHTML = '';

    $('.rowRecap').remove();

    //empecher la selection
    $(board).attr('unselectable', 'on');

    var cgHelper = document.createElement('cg-helper');
    board.appendChild(cgHelper);
    var cgContainer = document.createElement('cg-container');
    cgHelper.appendChild(cgContainer);
    var cgBoard = document.createElement('cg-board');
    cgContainer.appendChild(cgBoard);

    var chessGame = new ChessGame();


    currentChessGame = chessGame;
  

    $('#giveUp').show();
    $('#giveUp').click(function () {
        //si les blancs abandonnent on passe en parametre les noirs
        chessGame.endGame(true);
    });

    chessGame.listPiece = [
        ["black rook", "&#9820", 9,'r'],
        ["black knight", "&#9822", 11, 'n'],
        ["black bishop", "&#9821", 10, 'b'],
        ["black queen", "&#9819", 8, 'q'],
        ["black king", "&#9818", 7, 'k'],
        ["black pawn", "&#9823", 12, 'p'],
        ["white rook", "&#9814", 3, 'R'],
        ["white knight", "&#9816", 5, 'N'],
        ["white bishop", "&#9815", 4, 'B'],
        ["white queen", "&#9813", 2, 'Q'],
        ["white king", "&#9812", 1, 'K'],
        ["white pawn", "&#9817", 6, 'P']
    ];

    $('#FEN').html(chessGame.generateFEN());

    chessGame.listProm = [
        ["&#9813", 'white queen'],
        ["&#9816", 'white knight'],
        ["&#9814", 'white rook'],
        ["&#9815", 'white bishop'],
        ["&#9819", 'black queen'],
        ["&#9822", 'black knight'],
        ["&#9820", 'black rook'],
        ["&#9821", 'black bishop'],

    ];

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

    var step = $('cg-helper').width();

    chessGame.step = step;

    var indexPiece;

    for (var i = 0; i < 8; i++) {
        if (i > 1 && i < 6) {
            continue;
        }
        for (var j = 0; j < 8; j++) {

            var piece = document.createElement("piece");

            if (i == 0) {
                if (j > 4) {
                    indexPiece = 7 - j;
                }
                else {
                    indexPiece = j;
                }
            }
            if (i == 1) {
                indexPiece = 5;
            }
            if (i == 6) {
                indexPiece = 11;
            }
            if (i == 7) {
                if (j > 4) {
                    indexPiece = 13 - j;
                }
                else {
                    indexPiece = j + 6;
                }
            }

            var posY = i * step;
            var posX = j * step;
            piece.style.transform = 'translate( ' + posX + 'px, ' + posY + 'px)';
            if (chessGame.listPiece[indexPiece][0].includes('pawn')) {
                piece.id = chessGame.listPiece[indexPiece][0] + ' ' + String.fromCharCode(65 + j);
            } else {
                piece.id = chessGame.listPiece[indexPiece][0];
            }
            piece.innerHTML = chessGame.listPiece[indexPiece][1];
            cgBoard.appendChild(piece);

        }
    }

    //récupération en temps réel de la position de la souris sur le plateau
    $('cg-board').mousemove(function (event) {
        var relX = event.pageX - $(this).offset().left;
        var relY = event.pageY - $(this).offset().top;
        pos = [relX, relY];
        chessGame.relPos = pos;
    });

    //Gestion du déplacement des pièces
    $('cg-board').mousedown(function (event) {

        if (!equalState(chessGame.consultedState, chessGame.currentState)) {
            return;
        }

        chessGame.alreadyPlayed = false;

        var clickX = event.pageX - chessGame.board.offset().left;
        var clickY = event.pageY - chessGame.board.offset().top;
        var pos = [clickX, clickY];
        var newSquare = chessGame.isInListAvailablePos(pos);
        //l'on clique ou non sur une case available en preview
        if (newSquare != null) {
            //On clique sur une case de la preview        
            chessGame.playMove2(newSquare, false);
            chessGame.alreadyPlayed = true;

        } else {
            $(chessGame.selectedPiece).css('transition-duration', '');

            event.stopPropagation();
            chessGame.SelectPiece(event);
        }


    });

    $('cg-board').mouseup(function (eventObj) {


        if (!chessGame.alreadyPlayed) {
            var clickX = eventObj.pageX - chessGame.board.offset().left;
            var clickY = eventObj.pageY - chessGame.board.offset().top;
            var pos = [clickX, clickY];

            var newSquare = chessGame.isInListAvailablePos(pos);

            if (newSquare) {

                chessGame.playMove2(newSquare, true);
            }
            else {
                chessGame.resetPiece(true);
              
            }
        }
        $('cg-board').unbind('mousemove');

    });


    $(window).resize(function () { RepositionPieces(chessGame) });
    //chessGame.RepositionPieces();

}

function RepositionPieces(chessGame) {


    var step = $('cg-helper').width();
    var board = document.getElementsByTagName('cg-board')[0];

    var boardWidth = $('cg-board').width();

    var ancienStep = chessGame.step;


    $('piece, square').each(function () {

        var posX = $(this).position().left;
        var posY = $(this).position().top;


        var i = Math.round((posY / ancienStep));
        var j = Math.round((posX / ancienStep));

        this.style.transform = 'translate( ' + j * step + 'px, ' + i * step + 'px)';


        if (this.id.includes('white')) {
            this.style.cursor = 'pointer';
        } else {
            this.style.cursor = 'none';
        }

    });

    chessGame.step = step;
}

class ChessGame {

    constructor() {

        this.initialState = [];

        this.listePositions = [this.initialState];

        this.listMoves = [];

        this.memorizedState;

        this.consultedState = this.initialState;

        this.castleState = "KQkq";

        this.listPiece;
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

        this.selectedPiece;
        this.initialSelectedPiecePos;

        this.listTileAvailable = [];

        this.listTilePreview = [];
        this.listTileNotPreview = [];

        this.board = $('cg-board');

        this.step;

        this.halfClock = 0;

        this.audio = new Audio('FX/ChessMove.mp3');

        this.hasMoved = [];
        this.pawnJustAdvancedOfTwo = null;
        this.enPassantPos = null;
        //liste des targets actuelles de toutes les pièces (pour gérer le castle notamment)
        this.listTargetedSquare = [];

        this.relPos;
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
        this.currentTurn = 1;


        this.VisualizeState(this.currentState, this.currentTurn, this.toWhite, false);
    }


    //On vérifie les cases possibles sur le board
    //data.i = ligne, data.j = colonne, data.p = numéro du type de piece
    checkPossibleTiles(data, State = null) {
        //on va renvoyer une liste d'objet pos = (ligne,colonne) de cases libres ou de pièces à prendre

        //si on veut un state en particulier (State non null) 
        var currentState = State == null ? this.currentState : State;

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
                            if (currentState[i + x][j + y] == 0) {
                                freeTiles.push([i + x, j + y]);
                            }
                            else {
                                var dataD = { i: i + x, j: j + y, p: currentState[i + x][j + y] }
                                if (this.canTake(data, dataD)) {
                                    var pos = [i + x, j + y]
                                    freeTiles.push(pos);
                                }
                            }
                        }
                    }
                }

                //gestion du castle
                //utilisation de la liste 'hasMoved' de l'objet ChessGame pour savoir si on a bougé telle ou telle piece
                if (!this.hasMoved.containsHTML(this.selectedPiece)) {

                    var listPos = [0, 7]

                    for (var x = 0; x < 2; x++) {
                        for (var y = 0; y < 2; y++) {

                            var posTour = [listPos[x] * this.step, listPos[y] * this.step];

                            var tour = this.getElsAt(posTour, 'piece');

                            if (tour.length == 0) {
                                continue;
                            }

                            if (!this.hasMoved.containsHTML(tour[0])) {
                                //ligne : listPos[x] colonne : listPos[y]
                                switch (listPos[y]) {
                                    case 7:
                                        if (currentState[data.i][5] == 0 && currentState[data.i][6] == 0) {

                                            var targeted = false;

                                            for (var k = 0; k < this.listTargetedSquare.length; k++) {

                                                if (Array.isArray(this.listTargetedSquare[k])) {
                                                    if (this.listTargetedSquare[k].contains([i, 5]) || this.listTargetedSquare[k].contains([i, 6])) {
                                                        targeted = true;
                                                    }
                                                }
                                            }

                                            if (!targeted) {
                                                freeTiles.push([data.i, 6])
                                                freeTiles.push([data.i, 7])
                                            }
                                        }
                                        break;
                                    case 0:
                                        if (currentState[data.i][1] == 0 && currentState[data.i][2] == 0 && currentState[data.i][3] == 0) {

                                            var targeted = false;

                                            for (var k = 0; k < this.listTargetedSquare.length; k++) {

                                                if (Array.isArray(this.listTargetedSquare[k])) {
                                                    if (this.listTargetedSquare[k].contains([i, 1]) || this.listTargetedSquare[k].contains([i, 2]) || this.listTargetedSquare[k].contains([i, 3])) {
                                                        targeted = true;
                                                    }
                                                }
                                            }

                                            if (!targeted) {
                                                freeTiles.push([data.i, 2])
                                                freeTiles.push([data.i, 0])
                                            }
                                        }
                                        break;
                                }
                            }
                        }
                    }
                }

                break;
            //reine blanche et reine noire
            case 2:
            case 8:

                //horizontal et vertical
                //vertical - on procède case par case depuis la position de la piece
                var directionVertical = [1, -1];
                for (var t = 0; t < 2; t++) {
                    for (var x = directionVertical[t]; x + i < 8 && x + i >= 0; x += directionVertical[t]) {
                        if (currentState[x + i][j] == 0) {
    
                            //console.log('ici1')
                            //console.log([x + i, j])

                            freeTiles.push([x + i, j]);
                        }
                        else {
                            var dataD = { i: x + i, j: j, p: currentState[x + i][j] }
                            if (this.canTake(data, dataD)) {
                                var pos = [x + i, j]


                               //console.log('ici2')
                               // console.log(pos)
                                

                                freeTiles.push(pos);
                            }
                            break;
                        }
                    }
                }
                //horizontal
                var directionHorizontal = [1, -1];
                for (var t = 0; t < 2; t++) {
                    for (var y = directionHorizontal[t]; y + j < 8 && y + j >= 0; y += directionHorizontal[t]) {
                        if (currentState[i][j + y] == 0) {

                            //console.log('ici3')
                            //console.log([i,j+y])
                            
                            freeTiles.push([i, j + y]);
                        }
                        else {
                            var dataD = { i: i, j: j + y, p: currentState[i][j + y] }
                            if (this.canTake(data, dataD)) {
                                var pos = [i, j + y]

                                //console.log('ici4')
                                //console.log(pos)
                                
                                freeTiles.push(pos);
                            }
                            break;
                        }
                    }
                }

                //diagonales 
                //descendante
                var directionDesc = [1, -1];
                for (var t1 = 0; t1 < 2; t1++) {
                    for (var t2 = 0; t2 < 2; t2++) {
                        for (var x = directionDesc[t1], y = directionDesc[t2]; x + i < 8 && x + i >= 0 && y + j < 8 && y + j >= 0; x += directionDesc[t1], y += directionDesc[t2]) {

                            if (currentState[i + x][j + y] == 0) {

                                //console.log('ici5')
                                //console.log([i + x,j + y])

                                freeTiles.push([x + i, j + y]);
                            }
                            else {
                                var dataD = { i: i + x, j: j + y, p: currentState[i + x][j + y] }
                                if (data.p == dataD.p) {
                                    continue;
                                }
                                if (this.canTake(data, dataD)) {
                                    var pos = [x + i, j + y]

                                    //console.log('ici5')
                                    //console.log(pos)
                                    freeTiles.push(pos);
                                }

                                break;
                            }
                        }

                    }
                }

                break;
            //tour blanche et tour noir
            case 3:
            case 9:
                //horizontal et vertical
                //vertical - on procède case par case depuis la position de la piece
                var directionVertical = [1, -1];
                for (var t = 0; t < 2; t++) {
                    for (var x = directionVertical[t]; x + i < 8 && x + i >= 0; x += directionVertical[t]) {
                        if (currentState[x + i][j] == 0) {
                            ;
                            freeTiles.push([x + i, j]);
                        }
                        else {
                            var dataD = { i: x + i, j: j, p: currentState[x + i][j] }
                            if (this.canTake(data, dataD)) {
                                var pos = [x + i, j]
                                freeTiles.push(pos);
                            }
                            break;
                        }
                    }
                }
                //horizontal
                var directionHorizontal = [1, -1];
                for (var t = 0; t < 2; t++) {
                    for (var y = directionHorizontal[t]; y + j < 8 && y + j >= 0; y += directionHorizontal[t]) {

                        if (currentState[i][j + y] == 0) {
                            freeTiles.push([i, j + y]);
                        }
                        else {
                            var dataD = { i: i, j: j + y, p: currentState[i][j + y] }
                            if (this.canTake(data, dataD)) {
                                var pos = [i, j + y]
                                freeTiles.push(pos);
                            }
                            break;
                        }
                    }
                }

                break;
            //fou blanc et fou noir
            case 4:
            case 10:
                //diagonales 
                //descendante
                var directionDesc = [1, -1];
                for (var t1 = 0; t1 < 2; t1++) {
                    for (var t2 = 0; t2 < 2; t2++) {
                        for (var x = directionDesc[t1], y = directionDesc[t2]; x + i < 8 && x + i >= 0 && y + j < 8 && y + j >= 0; x += directionDesc[t1], y += directionDesc[t2]) {

                            if (currentState[i + x][j + y] == 0) {
                                freeTiles.push([x + i, j + y]);
                            }
                            else {
                                var dataD = { i: i + x, j: j + y, p: currentState[i + x][j + y] }
                                if (data.p == dataD.p) {
                                    continue;
                                }
                                if (this.canTake(data, dataD)) {
                                    var pos = [x + i, j + y]
                                    freeTiles.push(pos);
                                }
                                break;
                            }
                        }

                    }
                }

                break;
            //cavalier blanc et cavalier noir
            case 5:
            case 11:

                //diagonales en L
                var directionI = [2, 1, -1, -2, -2, -1, 1, 2];
                var directionJ = [1, 2, 2, 1, -1, -2, -2, -1];

                for (var t = 0; t < directionI.length; t++) {

                    var x = directionI[t];
                    var y = directionJ[t];

                    if (x + i < 8 && x + i >= 0 && y + j < 8 && y + j >= 0) {
                        if (currentState[i + x][j + y] == 0) {
                            freeTiles.push([x + i, j + y]);
                        }
                        else {
                            var dataD = { i: i + x, j: j + y, p: currentState[i + x][j + y] }
                            if (this.canTake(data, dataD)) {
                                var pos = [x + i, j + y]
                                freeTiles.push(pos);
                            }
                        }
                    }
                }

                break;
            //pion blanc et pion noir
            case 6:
            case 12:

                var direction = 1;

                if (this.isWhiteParPiece(data.p)) {
                    direction = -1;
                }

                //si les pions sont sur leur ligne de départ alors +2 sinon + 1
                if ((this.isWhiteParPiece(data.p) && data.i == 6) || (this.isBlackParPiece(data.p) && data.i == 1)) {
                    for (var t = 1; t < 3; t++) {
                        var x = direction * t;
                        if (x + i < 8 && x + i >= 0) {

                            if (currentState[i + x][j] == 0) {
                                freeTiles.push([x + i, j]);
                            }
                        }
                    }
                } else {
                    var x = direction;
                    if (x + i < 8 && x + i >= 0) {
                        if (currentState[i + x][j] == 0) {
                            freeTiles.push([x + i, j]);
                        }
                    }
                }

                //On check les diagonales en avant pour les potentielles cibles
                var directionDiag = [1, -1];
                for (var t = 0; t < directionDiag.length; t++) {
                    if (i + direction < 8 && i + direction >= 0 && j + directionDiag[t] < 8 && j + directionDiag[t] >= 0) {

                        if (currentState[direction + i][j + directionDiag[t]] != 0) {
                            var dataD = { i: direction + i, j: j + directionDiag[t], p: currentState[i + direction][j + directionDiag[t]] }
                            if (this.canTake(data, dataD)) {
                                var pos = [i + direction, j + directionDiag[t]]
                                freeTiles.push(pos);
                            }
                        }
                    }
                }

                //Gestion en-passant
                var sides = [1, -1];
                if ((this.isWhiteParPiece(data.p) && i == 3) || (this.isBlackParPiece(data.p) && i == 4)) {
                    for (k = 0; k < 2; k++) {

                        if (j + sides[k] < 8 && j + sides[k] >= 0) {

                            if (currentState[i][j + sides[k]] == 6 || currentState[i][j + sides[k]] == 12) {

                                var pos = [(j + sides[k]) * this.step, i * this.step]

                                var pawn = this.getElsAt(pos, 'piece');

                                if (pawn.length > 0 && this.pawnJustAdvancedOfTwo != null) {

                                    if (pawn[0].id == this.pawnJustAdvancedOfTwo.id) {

                                        freeTiles.push([i + (this.isWhiteParPiece(data.p) ? -1 : 1), j + sides[k]])
                                    }
                                }
                            }
                        }
                    }
                }

                break;
            default:
                break;
        }
        return freeTiles;
    }

    posToElement(pos) {
        return $(this.getSquareId(pos[0], pos[1]));
    }



    //Utilisation :
    //Si checkSelfKing est null on est dans le cas où on veut vérifier si l'adversaire nous a mis en échec
    //Si checkSelfKing est non null on est dans le cas où on veut vérifier notre coup va ou non nous mettre en échec
    isInCheck(isWhiteTurn, checkSelfKing = null, State = null) {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {

                var currentState = State == null ? this.currentState : State;

                var piece = currentState[i][j];
                var data = { i: i, j: j, p: piece };

                //Dans le cas de checkSelfKing null on ne prend que les piece (pas les cases vides) et les pièces adverse et on regarde notre roi
                //Dans le cas de checkSelfKing non null on prend les pieces adverses et on regarde notre roi dans le state 'provisoire'
                if ((this.isWhiteParPiece(data.p) && !isWhiteTurn || this.isBlackParPiece(data.p) && isWhiteTurn) && data.p != 0) {
                    var targets = this.checkPossibleTiles(data, State);
                    for (var k = 0; k < targets.length; k++) {
                        var targetType = currentState[targets[k][0]][targets[k][1]];

                        //var kingColor;
                        //if (isWhiteTurn && !Self == null) {
                        //    kingColor = 
                        //}

                        if (targetType == (isWhiteTurn ? 1 : 7)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    willBeInCheck(dataD, dataA, isWhiteTurn) {
        //si le coup va mettre le roi en échec, renvoie true

        var state = _.cloneDeep(this.currentState);

        var posDepart = [dataD.i, dataD.j];
        var posArrivee = [dataA.i, dataA.j];

        state[posDepart[0]][posDepart[1]] = 0;
        state[posArrivee[0]][posArrivee[1]] = dataD.p;

        if (this.isInCheck(isWhiteTurn, true, state)) {
            return true;
        }

        return false;
    }


    //p représente la couleur du joueur dont on vérifie s'il est mis en échec et mat (entre 1 et 6 blanc, entre 7 et 12 noir)
    checkMate(p) {

        for (var i = 0; i < 8; i++) {
            //on regarde les pièces du joueur et dès qu'on trouve un coup possible on retourne faux, sinon c'est qu'il n'a aucun coup possible et on retourne true
            for (var j = 0; j < 8; j++) {
                var piece = this.currentState[i][j];

                var data = { i: i, j: j, p: piece };

                //if (this.getColor(p) == this.getColor(piece)) {
                if (this.isSameColorParType(p, piece)) {

                    var availablePositions = this.checkPossibleTiles(data);

                    for (var k = 0; k < availablePositions.length; k++) {

                        var dataTarget = { i: availablePositions[k][0], j: availablePositions[k][1], p: piece };

                        if (!this.willBeInCheck(data, dataTarget, this.isWhiteParPiece(data.p))) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    //p représente la couleur du vainqueur (entre 1 et 6 blanc, entre 7 et 12 noir) forfeit est un paramètre optionnel pour gérer l'abandon
    endGame(forfeit = false, draw = false) {

        var fen = this.generateFEN();
        var colorLastTurn = fen.split(' ')[1];
        var ffColor = colorLastTurn == 'w' ? 'Blancs' : 'Noirs';
        var winnerColor = colorLastTurn == 'w' ? forfeit ? 'Blancs' : 'Noirs' : forfeit ? 'Noirs' : 'Blancs';

        if (draw) {
            $('#trait').html('Match Nul');
        } else {
            if (forfeit) {
                $('#trait').html('Les ' + ffColor + ' ont abandonnés : Victoire des ' + winnerColor);
            } else {
                $('#trait').html('Félicitation aux ' + winnerColor + ' ! Victoire par  Echec et Mat !');
            }
        }
        $('#FEN').html(this.generateFEN());
        $('#giveUp').hide();
        $('#replay').click(LoadChessBoard);
        $('#replay').show();

        gameOver = true;
    }


    //peut prendre la piece adverse ou non
    canTake(dataD, dataA) {
        var posD = [dataD.i, dataD.j]
        var posA = [dataA.i, dataA.j]

        return !this.isSameColorParType(dataD.p, dataA.p);
    }

    //on retourne "a1" pour la case 7,0
    getSquare(i, j) {
        return String.fromCharCode(97 + i) + (8 - j);
    }

    getSquareId(i, j) {
        return '#' + String.fromCharCode(97 + i) + (8 - j);
    }

    getStep() {
        return this.step;
    }

    // posX,posY
    SelectPiece(event, pos = null) {

        this.resetPreview();

        var chessGame = this;

        this.selectedPiece = null;

        this.resetSelection();

        var board = this.board;

        if (event != null && pos == null) {
            var relX = event.pageX - board.offset().left;
            var relY = event.pageY - board.offset().top;
            pos = [relX, relY];
        }


        var elements = this.getElsAt(pos);

        this.posOrigin = this.getSquareAtPos(pos);

        var listSelectedPiece = elements.filter(function () {
            return this.tagName == 'PIECE' && chessGame.isColorTurn(this);
        });

        if (listSelectedPiece.length != 0) {

            this.selectedPiece = listSelectedPiece[0];
            this.initialSelectedPiecePos = this.getPosFromElement(this.selectedPiece, true);

            var ghostSquare = this.createSquareAtPos(pos, 'square', 'selected');
            $(ghostSquare).html(this.selectedPiece.innerHTML);

            //On enleve la classe selected piece de la piece précédente
            $('.selectedPiece').removeClass('selectedPiece')

            $(this.selectedPiece).addClass('selectedPiece');

            $(chessGame.selectedPiece).css('transition-duration', '');
            var step = this.step;

            //Gestion mousemove
            $('cg-board').mousemove(function (event) {

                var relX = event.pageX - $(this).offset().left;
                var relY = event.pageY - $(this).offset().top;
                pos = [relX, relY];
                chessGame.relPos = pos;

                event.stopPropagation();

                $(chessGame.selectedPiece).css('transform', 'translate( ' + (pos[0] - (step / 2)) + 'px, ' + (pos[1] - (step / 2)) + 'px)');

            })

            //Gestion Preview
            //Récupération des cases disponibles

            var smallPos = this.getPosFromElement(this.selectedPiece, true);

            var i = smallPos[0];
            var j = smallPos[1];

            var pieceType = this.getPieceTypeFromEl(this.selectedPiece);

            var data = { i: i, j: j, p: pieceType };

            var availablePositions = this.checkPossibleTiles(data)



            this.LaunchPreview(data, availablePositions);

        } else {
            this.selectedPiece = null;
            this.initialSelectedPiecePos = null;
        }
    }

    resetPiece(resetSelectedPiece) {
        this.resetHover(true);

        if (resetSelectedPiece && this.selectedPiece != null) {
            $(this.selectedPiece).css('transform', 'translate( ' + this.posOrigin[0] + 'px, ' + this.posOrigin[1] + 'px)');
        }
    }

    getElsAt(pos, type = null) {


        //le + 1 sert à éviter de prendre les cases adjacentes lorsqu'on utilise la position toute en haut à gauche pour identifier une case
        var top = pos[1] + 1;
        var left = pos[0] + 1;

        var selectedPiece = $(this.selectedPiece);

        var chessGame = this;

        var step = this.step;
        return $(this.board)
            .find(type == null ? 'square, piece' : type == 'square' ? type : 'piece')
            .filter(function () {
                var actualOffsetTop = (Math.abs($(this).offsetParent().offset().top - $(this).offset().top));
                var actualOffsetLeft = (Math.abs($(this).offsetParent().offset().left - $(this).offset().left));

                var found = top.between(actualOffsetTop, actualOffsetTop + step) && left.between(actualOffsetLeft, actualOffsetLeft + step);
                return selectedPiece != $(this) && found;
            });
    }

    //renvoie une position (haut gauche) qui représente une case
    getSquareAtPos(pos) {

        var top = pos[1];
        var left = pos[0];

        var step = this.step;

        var posTop = top - (top % step);
        var posLeft = left - (left % step);

        return [posLeft, posTop];
    }

    createSquareAtPos(pos, type = null, css = null) {

        //Si il n'y a pas une square a cette position
        if (this.getElsAt(pos).filter(function () { return this.tagName == 'SQUARE' }).length == 0) {

            var top = pos[1];
            var left = pos[0];

            var step = this.step;

            var posTop = top - (top % step);
            var posLeft = left - (left % step);

            var square = document.createElement(!type ? 'square' : type);

            square.style.transform = 'translate(' + posLeft + 'px, ' + posTop + 'px)';
            if (css != null) {
                square.classList.add(css);
            }
            this.board.append(square);

            return square;
        }
    }

    getPosFromElement(el, small = false) {

        var board = this.board;

        var relY = $(el).offset().top - board.offset().top;

        var relX = $(el).offset().left - board.offset().left;
        var pos1 = [relY, relX];

        var pos2 = this.getSquareAtPos(pos1);

        if (small) {
            return this.getSmallPos(pos2);
        } else {
            return pos2;
        }
    }

    getSmallPos(pos) {
        return [pos[0] == 0 ? 0 : (pos[0] / this.step), pos[1] == 0 ? 0 : (pos[1] / this.step)]
    }

    getPieceTypeFromEl(el) {
        for (var i = 0; i < this.listPiece.length; i++) {
            if (el.id.includes(this.listPiece[i][0])) {
                return this.listPiece[i][2];
            }
        }
    }

    getColor(p) {
        if (this.isWhiteParPiece(p)) {
            return "white";
        }
        else if (this.isBlackParPiece(p)) {
            return "black";
        }
        else {
            return "vide";
        }
    }

    listTargets(isWhiteTurn) {
        var chessGame = this;
        this.listTargetedSquare = [];
        $('piece').each(function () {
            if (this.id.includes(isWhiteTurn ? 'white' : 'black')) {

                var pos = chessGame.getPosFromElement(this);
                var type = chessGame.getPieceTypeFromEl(this);
                var data = { i: pos[0] / chessGame.step, j: pos[1] / chessGame.step, p: type }


                var listTargets = chessGame.checkPossibleTiles(data);
                if (type == 2) {
                    //console.log(this)
                    //console.log(listTargets)
                }

                chessGame.listTargetedSquare.push(listTargets);
            }
        });
    }

    //supprime les square hover
    resetHover(allHover, pos = null) {

        var chessGame = this;

        if (!allHover) {
            $('square.hover').each(function (index, el) {
                var relX = Math.abs(chessGame.board.offset().left - $(el).offset().left);/* - (step / 2);*/
                var relY = Math.abs(chessGame.board.offset().top - $(el).offset().top); /*- (step / 2);*/
                var posEl = [relX, relY];

                if (!chessGame.getSquareAtPos(posEl).equals(chessGame.getSquareAtPos(pos))) {

                    el.remove();
                }

            }
            );
        } else {
            $('square.hover').remove();
        }
    }

    resetSelection() {
        this.listTileAvailable = [];
        $('.selected').remove();
    }

    resetPreview() {
        $('square.move-dest').remove();
        $('square.move-destTarget').remove();
    }

    //renvoi la couleur de la piece
    isWhite(el) {
        return el.id.includes('white');
    }

    isBlack(el) {
        return el.id.includes('black');
    }

    //renvoi la couleur de la piece
    isWhiteParPiece(p) {
        return 0 < p && p < 7;
    }

    isBlackParPiece(p) {
        return 6 < p && p < 13;
    }

    isSameColor(el1, el2) {

        if (el1 instanceof jQuery) {
            el1 = el1.get(0);
        }

        if (el2 instanceof jQuery) {
            el2 = el2.get(0);
        }

        return (this.isWhite(el1) && this.isWhite(el2)) || (this.isBlack(el1) && this.isBlack(el2));
    }

    isSameColorParType(p1, p2) {

        return (this.isWhiteParPiece(p1) && this.isWhiteParPiece(p2)) || (this.isBlackParPiece(p2) && this.isBlackParPiece(p1));
    }

    isColorTurn(el) {
        return (this.isBlack(el)) && this.toBlack || (this.isWhite(el) && (this.toWhite));
    }

    isColorTurnParType(p) {
        return (this.isBlackParPiece(p)) && this.toBlack || (this.isWhiteParPiece(p) && (this.toWhite));
    }

    isInListAvailablePos(pos) {

        var foundSquare = null;

        for (var i = 0; i < this.listTileAvailable.length; i++) {

            if (pos[0].between(this.listTileAvailable[i][1], this.listTileAvailable[i][1] + this.step) && pos[1].between(this.listTileAvailable[i][0], this.listTileAvailable[i][0] + this.step)) {

                foundSquare = [this.listTileAvailable[i][1], this.listTileAvailable[i][0]];

            }
        }

        return foundSquare;
    }

    isSelectedPiece(pieceHTML) {
        if (!this.selectedPiece) {
            return false;
        }
        return $(this.selectedPiece).attr('id') == pieceHTML.attr('id');
    }

    isPreview() {
        return $('.move-dest').length > 0;
    }


    playMove2(newSquare,drag, automaticPlay = false) {

        var nbPieceBefore = $('piece').length;

        this.pawnJustAdvancedOfTwo = null;
        this.enPassantPos = null;

        $('square.oldDest, square.newDest').remove();
        $('.check').remove();

        var posDepart = this.initialSelectedPiecePos;
        var typePieceDepart = this.getPieceTypeFromEl(this.selectedPiece);

        var dataDepart = { i: posDepart[0], j: posDepart[1], p: typePieceDepart };

        var chessGame = this;

        var target = this.getElsAt(newSquare, 'piece').filter(function (el) {

            var found = !chessGame.isSameColor(chessGame.selectedPiece, this);

            return found;

        });

        var dataArrivee = { i: newSquare[1] / this.step, j: newSquare[0] / this.step, p: target.length > 0 ? this.getPieceTypeFromEl(target[0]) : 0 };

        //on vérifie tout d'abord que l'on ne va pas se mettre en échec (fonction willBeInCheck)
        if (this.willBeInCheck(dataDepart, dataArrivee, this.toWhite)) {
            return;
        }

        if (!drag) {
            $(chessGame.selectedPiece).css('transition-duration', '0.4s');
        }

        var castle = false;
        //Code de déplacement
        //castle
        if (this.selectedPiece.id.includes('king') && (Math.abs(dataDepart.j - dataArrivee.j) > 1)) {
            //Si on passe ici c'est qu'on a cliqué sur une case castle après avoir sélectionné le roi

            castle = true;

            if (dataArrivee.j - dataDepart.j > 0) {
                //castle king side
                var tour = this.getElsAt([7 * this.step, dataDepart.i * this.step]);
                if (!automaticPlay) {
                    $(tour[0]).css('transition-duration', '0.4s');
                }

                $(tour[0]).css('transform', 'translate( ' + 5 * this.step + 'px, ' + dataDepart.i * this.step + 'px)')
                $(this.selectedPiece).css('transform', 'translate( ' + 6 * this.step + 'px, ' + dataDepart.i * this.step + 'px)');

                this.currentState[dataDepart.i][5] = this.toWhite ? 3 : 9;
                this.currentState[dataDepart.i][6] = this.toWhite ? 1 : 7;
                this.currentState[dataDepart.i][4] = 0;
                this.currentState[dataDepart.i][7] = 0;

            } else {
                //castle queen side
                var tour = this.getElsAt([0, dataDepart.i * this.step]);

                if (!automaticPlay) {
                    $(tour[0]).css('transition-duration', '0.4s');
                }

                $(tour[0]).css('transform', 'translate( ' + (3 * this.step) + 'px, ' + (dataDepart.i * this.step) + 'px)');
                $(this.selectedPiece).css('transform', 'translate( ' + 2 * this.step + 'px, ' + dataDepart.i * this.step + 'px)');

                this.currentState[dataDepart.i][5] = this.toWhite ? 3 : 9;
                this.currentState[dataDepart.i][6] = this.toWhite ? 1 : 7;
                this.currentState[dataDepart.i][4] = 0;
                this.currentState[dataDepart.i][7] = 0;

            }
        } else if (this.selectedPiece.id.includes('pawn') && (dataArrivee.j != dataDepart.j) && this.getElsAt(newSquare, 'piece').length == 0) {
            //En-passant

            $(this.selectedPiece).css('transform', 'translate( ' + newSquare[0] + 'px, ' + newSquare[1] + 'px)');
            //on supprime le pion pris enpassant
            var targetEnPassant = this.getElsAt([newSquare[0], newSquare[1] + this.step * (this.toWhite ? 1 : -1)], 'piece');

            this.currentState[dataDepart.i][dataArrivee.j] = 0;

            $(targetEnPassant[0]).remove();

        } else if (this.selectedPiece.id.includes('pawn') && (this.toWhite && dataArrivee.i == 0 || this.toBlack && dataArrivee.i == 7)) {
            //promotion
            $(this.selectedPiece).css('transform', 'translate( ' + newSquare[0] + 'px, ' + newSquare[1] + 'px)');
            //on vérifie si on a pris une piece, si oui on la supprimer
            if (target.length == 1) {

                $(target[0]).remove();

            }

            if (!automaticPlay) {

                var promotion = document.createElement('div');
                promotion.id = 'promotion-choice';
                promotion.classList.add('top');

                for (var t = 0; t < 4; t++) {

                    if (dataArrivee.i == 0) {
                        //Promotion piece blanche
                        var pieceProm = document.createElement('squarePromotion');
                        pieceProm.style.top = t * 12.5 + '%';
                        pieceProm.style.left = (87.5 - (12.5 * (7 - dataArrivee.j))) + '%';

                        var piece = document.createElement('piecePromotion');
                        piece.innerHTML = this.listProm[t][0];
                        piece.id = (this.listProm[t][1])
                        pieceProm.appendChild(piece)
                        promotion.appendChild(pieceProm);
                    } else if (dataArrivee.i == 7) {
                        //Promotion piece noire
                        var pieceProm = document.createElement('squarePromotion');
                        pieceProm.style.top = 87.5 - (t * 12.5) + '%';
                        pieceProm.style.left = (87.5 - (12.5 * (7 - dataArrivee.j))) + '%';

                        var piece = document.createElement('piecePromotion');
                        piece.innerHTML = this.listProm[t + 4][0];
                        piece.id = (this.listProm[t + 4][1])
                        pieceProm.appendChild(piece)
                        promotion.appendChild(pieceProm);
                    }
                }

                $('div.main-board').append(promotion);

                $('squarePromotion').click(function (event) {
                    chessGame.selectedPiece.innerHTML = $(event.target).html();
                    chessGame.selectedPiece.id = event.target.id;
                    //this.selectedPiece = chessGame.getElsAt(chessGame.initialSelectedPiecePos)[0];
                    //console.log(chessGame.initialSelectedPiecePos);
                    chessGame.playMove2(newSquare, true);
                    $('#promotion-choice').remove();
                });
                return;
            } else {
                //si on est en automatique
                if (dataArrivee.i == 0) {
                    //Promotion piece blanche
                    this.selectedPiece.innerHTML = this.listProm[0][0];
                    this.selectedPiece.id = this.listProm[0][1];
                    //this.selectedPiece = this.getElsAt(this.initialSelectedPiecePos)[0];

                    //this.playMove2(newSquare);
                    //return;
                } else if (dataArrivee.i == 7) {
                    this.selectedPiece.id = this.listProm[4][1];
                    this.selectedPiece.innerHTML = this.listProm[4][0];
                    //this.selectedPiece = this.getElsAt(this.initialSelectedPiecePos)[0];
                    this.playMove2(newSquare, true);
                }
            }

        } else {

            $(this.selectedPiece).css('transform', 'translate( ' + newSquare[0] + 'px, ' + newSquare[1] + 'px)');
            //on vérifie si on a pris une piece, si oui on la supprimer
            if (target.length == 1) {

                $(target[0]).remove();

            }

        }

        //fin du déplacement des pieces
        setTimeout(() => { $(chessGame.selectedPiece).css('transition-duration', ''); }, 400);

        if (this.selectedPiece.id.includes('pawn') && Math.abs(dataArrivee.i - dataDepart.i) > 1) {
            //On vient de jouer un pion depuis sa ligne de départ de 2 cases 
            this.pawnJustAdvancedOfTwo = this.selectedPiece;
            this.enPassantPos = [dataArrivee.i, dataArrivee.j];
        }

        this.resetPiece(false);
        this.resetPreview();
        $('.selected').remove();

        var InewSquare = newSquare[1] / this.step;
        var JnewSquare = newSquare[0] / this.step;
        var posArrivee = [InewSquare, JnewSquare];

        var x = posDepart[0];
        var y = posDepart[1];


        if (!castle) {
            this.currentState[x][y] = 0;
            var typePiece = this.getPieceTypeFromEl(this.selectedPiece);
            this.currentState[posArrivee[0]][posArrivee[1]] = typePiece;
        }

        this.consultedState = _.cloneDeep(this.currentState);

        this.listePositions.push(this.currentState);


        if (this.toWhite) {

            var rowRecap = document.createElement('div');
            rowRecap.classList.add('rowRecap');
            rowRecap.style.top = ((this.currentTurn == 1 ? 0 : (this.currentTurn - 1)) * 5) + '%'
            rowRecap.id = 'row' + this.currentTurn;
            $('.recapContainer').append(rowRecap);

            var index = document.createElement('div');
            index.classList.add('index');
            index.innerHTML = this.currentTurn;
            $(rowRecap).append(index);

            index.style.left = "0%";
        }

        if (target.length == 1) {

            //recap si capture
            var moveElement = document.createElement('div');
            moveElement.classList.add(this.toWhite ? 'whiteMove' : 'blackMove');
            var move = (this.selectedPiece.id.includes('pawn') ? String.fromCharCode(97 + dataDepart.j) : $(this.selectedPiece).html()) + 'x' + String.fromCharCode(97 + dataArrivee.j) + (8 - dataArrivee.i);
            moveElement.innerHTML = move;
            $('#row' + this.currentTurn).append(moveElement);

        } else {
            var moveElement = document.createElement('div');
            moveElement.classList.add(this.toWhite ? 'whiteMove' : 'blackMove');
            var move = (this.selectedPiece.id.includes('pawn') ? '' : $(this.selectedPiece).html()) + String.fromCharCode(97 + dataArrivee.j) + (8 - dataArrivee.i);
            moveElement.innerHTML = move;
            $('#row' + this.currentTurn).append(moveElement);
        }

        $(moveElement).data({ state: _.cloneDeep(this.currentState), posD: posDepart, posA: posArrivee });

        $(moveElement).click(function () {
            event.stopPropagation();
            $('square.oldDest, square.newDest').remove();
            //$('square.oldDestT, square.newDestT').remove();

            var oldDestT = document.createElement('square');
            var newDestT = document.createElement('square');

            oldDestT.classList.add('oldDest');
            newDestT.classList.add('newDest');

            chessGame.loadPosition($(this).data().state);
            chessGame.board.append(oldDestT);
            chessGame.board.append(newDestT);

            //console.log($(this).data().posA[0])
            //console.log($(this).data().posA[0] * chessGame.getStep())
            //console.log(chessGame.step);
            //console.log(chessGame.getStep());

            console.log(oldDestT)
            console.log(newDestT)
            //$('oldDest').css('transform', 'translate()');
            $('.oldDest').css('transform', 'translate( ' + ($(this).data().posD[1] * chessGame.getStep()) + 'px, ' + ($(this).data().posD[0] * chessGame.getStep()) + 'px)');
            $('.newDest').css('transform', 'translate( ' + ($(this).data().posA[1] * chessGame.getStep()) + 'px, ' + ($(this).data().posA[0] * chessGame.getStep()) + 'px)');

            console.log('translate( ' + ($(this).data().posD[0] * chessGame.getStep()) + 'px, ' + ($(this).data().posD[1] * chessGame.getStep()) + 'px)')

        });

        var element = document.getElementsByClassName('recapContainer')[0]
        element.scrollTop = element.scrollHeight;

        this.listMoves.push(move);

        if (this.toBlack) {
            this.currentTurn++;
        }

        this.isWhiteTurn = !this.isWhiteTurn;
        this.toBlack = !this.toBlack;
        this.toWhite = !this.toWhite;

        var chessGameL = this;
        var dataArrivee = { i: InewSquare, j: JnewSquare, p: typePiece }
        var listNewTargets = this.checkPossibleTiles(dataArrivee);

        $('#trait').html(this.toWhite ? 'Trait aux blancs' : 'Trait aux noirs');

        this.listTargets(!this.toWhite);

        //Creation des squares oldDest et newDest
        var oldDest = document.createElement('square');
        var newDest = document.createElement('square');

        oldDest.classList.add('oldDest');
        newDest.classList.add('newDest');

        this.board.append(oldDest);
        this.board.append(newDest);

        oldDest.style.transform = 'translate( ' + (posDepart[1] * this.step) + 'px, ' + (posDepart[0] * this.step) + 'px)';
        newDest.style.transform = 'translate( ' + newSquare[0] + 'px, ' + newSquare[1] + 'px)';

        //Gestion check
        var check = false;
        var end = false;
        listNewTargets.forEach(function (element) {
            var i = element[0];
            var j = element[1];
            if (chessGameL.currentState[i][j] == 1 || chessGameL.currentState[i][j] == 7) {
                check = true;
                var pos = [j * chessGame.step, i * chessGame.step]
                var roiElement = chessGameL.getElsAt(pos, 'piece');

                var checkSquare = chessGame.createSquareAtPos(pos, 'square', 'check');

                //on vérifie si on a une situation de checkMate
                if (chessGameL.checkMate(chessGameL.toWhite ? 1 : 7)) {
                    //Si checkMate on passe en parametre le vainqueur
                    chessGameL.endGame();
                    end = true;
                }
            }
        });

        if (end) {
            return;
        }

        //Si pas de check avec la piece bougée on regarde quand même les discovered check
        if (!check) {

            for (var k = 0; k < this.listTargetedSquare.length; k++) {

                var listPos = this.listTargetedSquare[k];

                for (var x = 0; x < listPos.length; x++) {

                    var pos = [listPos[x][1] * this.step, listPos[x][0] * this.step];
                    var target = this.getElsAt(pos, 'piece');
                    if (target.length > 0) {

                        if (target[0].id == (this.toWhite ? 'white king' : 'black king')) {

                            check = true;
                            var checkSquare = this.createSquareAtPos(pos, 'square', 'check');
                        }
                    }
                }
            }
        }

        this.crossOrigin = 'anonymous';
        this.audio.play();

        this.VisualizeState(this.currentState, this.currentTurn, this.toWhite);

        //si tour ou roi on marque met la piece dans la liste des hasMoved pour le castle
        var type = this.getPieceTypeFromEl(this.selectedPiece);
        if ([1, 7, 3, 9].includes(type)) {
            this.hasMoved.push(this.selectedPiece);
            switch (type) {
                case 1:
                    this.castleState = this.castleState.replace('K', '');
                    this.castleState = this.castleState.replace('Q', '');
                    break;
                case 7:
                    this.castleState = this.castleState.replace('k', '');
                    this.castleState = this.castleState.replace('q', '');
                    break;
                case 3:
                    if (dataDepart.j == 0) {
                        this.castleState = this.castleState.replace('Q', '');
                    }
                    if (dataDepart.j == 7) {
                        this.castleState = this.castleState.replace('K', '');
                    }
                    break;
                case 9:
                    if (dataDepart.j == 0) {
                        this.castleState = this.castleState.replace('q', '');
                    }
                    if (dataDepart.j == 7) {
                        this.castleState = this.castleState.replace('k', '');
                    }
                    break;
            }
        }
        if (this.castleState == '') {
            this.castleState = '-';
        }

        var nbPieceAfter = $('piece').length;
        var pieceTaken = nbPieceBefore - nbPieceAfter > 0;

        if (!pieceTaken && !this.selectedPiece.id.includes('pawn')) {
            this.halfClock++;
        } else {
            this.halfClock = 0;
        }

        //On vide la liste des positions available
        this.listTileAvailable = [];

        //Affichage du FEN
        $('#FEN').html(this.generateFEN());
    }

    LaunchPreview(data, availablePositions) {

        this.resetPreview();

        for (var i = 0; i < availablePositions.length; i++) {

            var iTarget = availablePositions[i][0];
            var jTarget = availablePositions[i][1];
            var targetElement = $(this.getSquareId(iTarget, jTarget));

            var targetPieceType = this.currentState[iTarget][jTarget];
            var dataTarget = { i: iTarget, j: jTarget, p: targetPieceType };

            if (this.willBeInCheck(data, dataTarget, this.isWhiteParPiece(data.p))) {
                continue;
            }



            var pos = [availablePositions[i][0] * this.step, availablePositions[i][1] * this.step];
            this.listTileAvailable.push(pos)


            this.AfficherPreview(data, dataTarget, targetElement);

        }
    }

    AfficherPreview(data, dataTarget, targetElement) {

        var posTarget = [dataTarget.j * this.step, dataTarget.i * this.step]

        if (dataTarget.p == 0) {
            //case vide
            var square = this.createSquareAtPos(posTarget, 'square', 'move-dest')

        } else {
            //piece adverse
            var square = this.createSquareAtPos(posTarget, 'square', 'move-destTarget');

        }
    }

    //Visualiser un etat
    VisualizeState(State, index = null, white = null) {

        if (index) {
            console.log("Position N°" + (index) + " : " + (white ? "Trait aux blancs" : "Trait aux noirs"));
        }

        if (($('#detail').is(':checked')) || index == null) {
            State.forEach(ligne => {
                var row = "";
                ligne.forEach(col => {
                    row += col + " ";
                });
                console.log(row);
            });
        }

        $('#trait').html((white ? "Trait aux blancs" : "Trait aux noirs"));
    }

    EmptyPreviewList() {
        this.listTileNotPreview = this.listTileNotPreview.concat(this.listTilePreview);
        this.listTilePreview = [];

        //reset de l'événement click

    }

    loadPosition(state) {

        this.board.html('');

        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {

                var posY = i * this.step;
                var posX = j * this.step;
                var piece = state[i][j];

                if (piece != 0) {
                    var pieceElement = document.createElement("piece");

                    for (var k = 0; k < this.listPiece.length; k++) {
                        if (this.listPiece[k][2] == piece) {
                            pieceElement.id = this.listPiece[k][0];
                            pieceElement.innerHTML = this.listPiece[k][1];
                            break;
                        }
                    }

                    this.board.append(pieceElement);

                    //$(pieceElement).css('transition-duration', '1s');
                    pieceElement.style.transform = 'translate( ' + posX + 'px, ' + posY + 'px)';
                }

            }
        }

        $('piece').css('transition-duration', '');

        this.consultedState = _.cloneDeep(state);
    }

    listAllAvailableTiles() {

        var positionObject = []

        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var type = this.currentState[i][j]
                if (type != 0 && this.isColorTurnParType(type)) {
                    var posD = [i, j];
                    var data = { i: i, j: j, p: type }
                    var listPosAvailable = this.checkPossibleTiles(data);
                    if (listPosAvailable.length > 0) {
                        var dataPos = { posD: posD, listPosA: listPosAvailable };
                        positionObject.push(dataPos);
                    }
                }
            }
        }
        return positionObject;
    }

    generateFEN() {
        var FEN = "";
        for (var i = 0; i < 8; i++) {
            var nbVide = 0;
            for (var j = 0; j < 8; j++) {

                var type = currentChessGame.currentState[i][j];

                if (type != 0) {
                    if (nbVide > 0) {
                        FEN += nbVide;
                        nbVide = 0;
                    }
                    FEN += findPieceInList(type);
                } else {
                    nbVide++;
                }
            }
            if (nbVide > 0) {
                FEN += nbVide;
            }
            if (i < 7) {
                FEN += "/";
            }
        }

        //w = trait aux blanc, b = trait aux noir
        FEN += currentChessGame.toWhite ? ' w ' : ' b ';

        //privilèges de rock
        FEN += currentChessGame.castleState + ' ';
        var enPassant = '-';
        if (currentChessGame.pawnJustAdvancedOfTwo != null) {

            var pos = this.enPassantPos;

            var direction = currentChessGame.isWhiteParPiece(currentChessGame.getPieceTypeFromEl(currentChessGame.pawnJustAdvancedOfTwo)) ? 1 : -1;

            enPassant = String.fromCharCode(97 + pos[1]) + '' + (8 - (pos[0] + direction));  
        }

        FEN += enPassant + ' ';

        FEN += currentChessGame.halfClock + ' ';
        FEN += currentChessGame.currentTurn;

        return FEN;
    }
}

function GameOver() {
    return gameOver;
}

// format a2a4
function playMove(result) {

    console.log(result)

    if (result == '1-0' || result == '0-1') {
        currentChessGame.endGame();
        return;
    }
    if (result == '1/2-1/2') {
        currentChessGame.endGame(false, true);
        return;
    }

    if (result == null || result == "" || !result) {
        return false;
    }


    posDY = (8 - result.charAt(1)) * currentChessGame.step //Y de départ
    posDX = (result.charAt(0).charCodeAt(0) - 97) * currentChessGame.step // X de départ

    posAX = (8-result.charAt(3)) * currentChessGame.step
    posAY = (result.charAt(2).charCodeAt(0) - 97) * currentChessGame.step



    currentChessGame.SelectPiece(null, [posDX, posDY]);

    currentChessGame.playMove2([posAY, posAX], !$('#AutoTransition').prop('checked'), true);

    $('cg-board').unbind('mousemove');
}

function getState() {
    return currentChessGame.generateFEN();
}

function equalState(state1, state2) {
    var equals = true;
    for (var i = 0; i < 8; i++) {
        if (!state1[i].equals(state2[i])) {
            equals = false;
        }
    }
    return equals;
}

function findPieceInList(p) {
    for (var i = 0; i < currentChessGame.listPiece.length; i++) {
        if (currentChessGame.listPiece[i][2] == p) {
            return currentChessGame.listPiece[i][3];
        }
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

Array.prototype.containsHTML = function (element) {
    for (var i = 0; i < this.length; i++) {

        var elementList = this[i];

        if (elementList instanceof jQuery) {
            elementList = elementList.get(0);
        }

        if ($(elementList).attr('id') == $(element).attr('id')) {
            return true;
        }
    }
    return false;
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

Array.prototype.deleteHTMLElement = function (element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].attr('id') == element.attr('id')) {
            var deletedElement = this.splice(i, 1);
            return deletedElement;
        }
    }
    return null;
}


function resetIndications() {
    $('.dot').remove();
    $('.targetInner').each(function () {
        var innerHtml = $(this).html();
        var parent = $(this).parent().parent();
        $(parent).html(innerHtml);
    });
    $('.targetOuter').remove();
}

Number.prototype.between = function (a, b) {
    var min = Math.min(a, b),
        max = Math.max(a, b);
    return this >= min && this <= max;
};


