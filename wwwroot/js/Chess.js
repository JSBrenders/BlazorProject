//création du plateau
function LoadChessBoard() {

    $('#replay').hide();



    var firstContainer = document.getElementById('board');

    board.innerHTML = '';

    //empecher la selection
    $(board).attr('unselectable', 'on');

    var cgHelper = document.createElement('cg-helper');
    board.appendChild(cgHelper);
    var cgContainer = document.createElement('cg-container');
    cgHelper.appendChild(cgContainer);
    var cgBoard = document.createElement('cg-board');
    cgContainer.appendChild(cgBoard);


    var chessGame = new ChessGame();

    $('#giveUp').show();
    $('#giveUp').click(function () {
        //si les blancs abandonnent on passe en parametre les noirs
        chessGame.endGame(chessGame.toWhite ? 7 : 1, true);
    });

    chessGame.listPiece = [
        ["black rook", "&#9820", 9],
        ["black knight", "&#9822", 11],
        ["black bishop", "&#9821", 10],
        ["black queen", "&#9819", 8],
        ["black king", "&#9818", 7],
        ["black pawn", "&#9823", 12],
        ["white rook", "&#9814", 3],
        ["white knight", "&#9816", 5],
        ["white bishop", "&#9815", 4],
        ["white queen", "&#9813", 2],
        ["white king", "&#9812", 1],
        ["white pawn", "&#9817", 6]
    ]

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
            piece.id = chessGame.listPiece[indexPiece][0];
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

        chessGame.alreadyPlayed = false;

        var clickX = event.pageX - chessGame.board.offset().left;
        var clickY = event.pageY - chessGame.board.offset().top;
        var pos = [clickX, clickY];
        var newSquare = chessGame.isInListAvailablePos(pos);
        //l'on clique ou non sur une case available en preview
        if (newSquare != null) {
            //On clique sur une case de la preview        
            $(chessGame.selectedPiece).css('transition-duration', '0.4s');
            chessGame.playMove2(newSquare);
            chessGame.alreadyPlayed = true;

        } else {
            $(chessGame.selectedPiece).css('transition-duration', '');
            chessGame.resetPreview();
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

                chessGame.playMove2(newSquare);
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

        this.audio = new Audio('FX/ChessMove.mp3');

        this.hasMoved = [];

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
        this.currentTurn = 0;


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
                    console.log("Ce roi n'a pas encore joué");
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
                if (this.isSameColorParType(p,piece)) {

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
        console.log("CHECKMATE !!!");
        return true;
    }

    //p représente la couleur du vainqueur (entre 1 et 6 blanc, entre 7 et 12 noir) forfeit est un paramètre optionnel pour gérer l'abandon
    endGame(p, forfeit = false) {

        console.log('Grats to the ' + this.getColor(p));

        var ffColor;
        if (this.getColor(p) == "black") {
            ffColor = 'Blancs';
        } else if (this.getColor(p) == "white") {
            ffColor = 'Noirs';
        }

        var winnerColor;
        if (this.getColor(p) == "white") {
            winnerColor = 'Blancs';
        } else if (this.getColor(p) == "black") {
            winnerColor = 'Noirs';
        }

        if (forfeit) {
            $('#trait').html('Les ' + ffColor + ' ont abandonnés : Victoire des ' + winnerColor);
        } else {
            $('#trait').html('Félicitation aux ' + winnerColor + ' ! Victoire par  Echec et Mat !');
        }

        $('#giveUp').hide();
        $('#replay').click(LoadChessBoard);
        $('#replay').show();
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


    SelectPiece(event, ui) {

        var chessGame = this;

        this.selectedPiece = null;

        this.resetSelection();

        var board = this.board;

        var relX = event.pageX - board.offset().left;
        var relY = event.pageY - board.offset().top;
        pos = [relX, relY];

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
            $(this.selectedPiece).addClass('selectedPiece');


            var step = this.step;

            //Gestion mousemove
            $('cg-board').mousemove(function (event) {

                var relX = event.pageX - $(this).offset().left;/* - (step / 2);*/
                var relY = event.pageY - $(this).offset().top; /*- (step / 2);*/
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

            //for (var i = 0; i < availablePositions.length; i++) {

            //    var pos = [availablePositions[i][0] * this.step, availablePositions[i][1] * this.step];
            //    this.listTileAvailable.push(pos)
            //}

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

        var relX = $(el).offset().top - board.offset().top;
        var relY = $(el).offset().left - board.offset().left;
        var pos1 = [relX, relY];

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
            if (this.listPiece[i][0] == el.id) {
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

    PlayMove(dataDepart, dataArrivee) {

        resetIndications();


        var posDepart = [dataDepart.i, dataDepart.j];
        var posArrivee = [dataArrivee.i, dataArrivee.j];

        //if (this.checkPossibleTiles(dataDepart).contains(posArrivee) && this.isColorTurn(dataDepart.p) && !this.isInCheck() && !this.willBeInCheck()) {
        if (this.checkPossibleTiles(dataDepart).contains(posArrivee) && this.isColorTurn(dataDepart.p) && !this.willBeInCheck(dataDepart, dataArrivee, this.toWhite)) {

            var elementDepart = $(this.getSquareId(dataDepart.i, dataDepart.j));
            var elementArrivee = $(this.getSquareId(dataArrivee.i, dataArrivee.j));


            //Gestion de la transition
            //on calcul la distance entre le point de départ et le point d'arrivée
            //on créer une classe temporaire de déplacement css et on l'ajoute à la case

            var positionDepart = elementDepart.position();
            var positionArrivee = elementArrivee.position();


            var parcouruLeft = positionArrivee.left - positionDepart.left;
            var parcouruTop = positionArrivee.top - positionDepart.top;


            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.cssClass { left: ' + positionArrivee.left + 'px; top : ' + positionArrivee.top + 'px }';
            document.getElementsByTagName('head')[0].appendChild(style);

            elementDepart.addClass('cssClass');
            //document.getElementById('someElementId').className = 'cssClass';


            elementArrivee.html(elementDepart.html());
            elementDepart.html('');

            this.currentState[posDepart[0]][posDepart[1]] = 0;
            this.currentState[posArrivee[0]][posArrivee[1]] = dataDepart.p;

            this.listePositions.push(this.currentState);
            this.currentTurn++;
            this.toWhite = !this.toWhite;
            this.toBlack = !this.toBlack;
            this.VisualizeState(this.currentState, this.currentTurn, this.toWhite);

            //on enleve le check si il y a check
            $('.check').removeClass('check');

            //update front
            //update des datas des 2 tiles concernées
            dataArrivee.p = dataDepart.p;
            dataDepart.p = 0;

            var chessGame = this;

            //on disable le drag and drop pour la couleur dont ce n'est pas le tour
            $(".piece").each(function (index, pieceElement) {
                if ($(pieceElement).data('position')) {

                    var piece = $(pieceElement).data('position').p

                    //si c'est au tour des blancs
                    if (chessGame.toWhite) {
                        //si la piece traitée est noire on disable sinon on enable
                        if (chessGame.isBlack(piece)) {
                            $(pieceElement).draggable('disable');
                        } else if (chessGame.isWhite(piece)) {
                            $(pieceElement).draggable({
                                helper: 'clone'
                            });
                            $(pieceElement).draggable('enable');
                        }
                    } else {
                        //sinon c'est le tour des noirs et on inverse
                        if (chessGame.isWhite(piece)) {
                            $(pieceElement).draggable('disable');
                        } else {
                            $(pieceElement).draggable({
                                helper: 'clone'
                            });
                            $(pieceElement).draggable('enable');
                        }
                    }
                }
            });

            this.EmptyPreviewList();

            //on vérifie si la pièce dans la position d'arrivée met en échec le roi adverse
            var chessGameL = this;
            var listNewTargets = this.checkPossibleTiles(dataArrivee);
            listNewTargets.forEach(function (element) {
                var i = element[0];
                var j = element[1];
                if (chessGameL.currentState[i][j] == 1 || chessGameL.currentState[i][j] == 7) {
                    var roiElement = chessGameL.posToElement([i, j]);
                    roiElement.addClass('check');
                    //on vérifie si on a une situation de checkMate
                    if (chessGameL.checkMate(chessGameL.toWhite ? 1 : 7)) {
                        //Si checkMate on passe en parametre le vainqueur
                        chessGameL.endGame(chessGameL.toWhite ? 7 : 1);
                    }
                }
            });
        }
    }

    playMove2(newSquare) {

        $('.check').remove();

        var posDepart = this.initialSelectedPiecePos;
        var typePieceDepart = this.getPieceTypeFromEl(this.selectedPiece);

        var dataDepart = { i: posDepart[0], j: posDepart[1], p: typePieceDepart };

        var chessGame = this;

        var target = this.getElsAt([newSquare[0], newSquare[1]], 'piece').filter(function (el) {

            var found = !chessGame.isSameColor(chessGame.selectedPiece, this);

            return found;

        });

        var dataArrivee = { i: newSquare[1] / this.step, j: newSquare[0] / this.step, p: target.length > 0 ? this.getPieceTypeFromEl(target[0]) : 0 };

        //on vérifie tout d'abord que l'on ne va pas se mettre en échec (fonction willBeInCheck) ---> ATTENTION DONNEES INVERSEES POUR L'ARRIVEE
        if (this.willBeInCheck(dataDepart, dataArrivee, this.toWhite)) {
            console.log('Warning : Will be in check');
            return;
        }

        //on vérifie si on a pris une piece, si oui on la supprimer
        if (target.length == 1) {

            $(target[0]).remove()

        }


        $(this.selectedPiece).css('transform', 'translate( ' + newSquare[0] + 'px, ' + newSquare[1] + 'px)');
        this.resetPiece(false);
        this.resetPreview();
        $('.selected').remove();

        var InewSquare = newSquare[1] / this.step;
        var JnewSquare = newSquare[0] / this.step ;
        var posArrivee = [InewSquare , JnewSquare];

        var x = posDepart[0];
        var y = posDepart[1];

        this.currentState[x][y] = 0;

        var typePiece = this.getPieceTypeFromEl(this.selectedPiece)
        this.currentState[posArrivee[0]][posArrivee[1]] = typePiece;

        this.listePositions.push(this.currentState);

        this.currentTurn++;

        this.isWhiteTurn = !this.isWhiteTurn;
        this.toBlack = !this.toBlack;
        this.toWhite = !this.toWhite;


        var chessGameL = this;
        var dataArrivee = { i: InewSquare, j: JnewSquare, p: typePiece }
        var listNewTargets = this.checkPossibleTiles(dataArrivee);

        $('#trait').html(this.toWhite ? 'Trait aux blancs' : 'Trait aux noirs');

        listNewTargets.forEach(function (element) {
            var i = element[0];
            var j = element[1];
            if (chessGameL.currentState[i][j] == 1 || chessGameL.currentState[i][j] == 7) {

                var pos = [j * chessGame.step, i * chessGame.step]
                var roiElement = chessGameL.getElsAt(pos, 'piece');

                var checkSquare = chessGame.createSquareAtPos(pos, 'square', 'check');

                //on vérifie si on a une situation de checkMate
                if (chessGameL.checkMate(chessGameL.toWhite ? 1 : 7)) {
                    //Si checkMate on passe en parametre le vainqueur
                    chessGameL.endGame(chessGameL.toWhite ? 7 : 1);
                }
            }
        });

        this.crossOrigin = 'anonymous';
        this.audio.play();
        console.log(this.audio)
        this.VisualizeState(this.currentState, this.currentTurn, this.toWhite);


        //si tour ou roi on marque met la piece dans la liste des hasMoved pour le castle
        if ([1, 7, 3, 9].includes(this.getPieceTypeFromEl(this.selectedPiece))) {
            this.hasMoved.push(this.selectedPiece);
        }
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
            console.log("Position N°" + (index + 1) + " : " + (white ? "Trait aux blancs" : "Trait aux noirs"));
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


