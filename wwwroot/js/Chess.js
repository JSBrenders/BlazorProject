//création du plateau
let dotNetObject;
let currentChessGame;
let gameOver;

function LoadChessBoard(autoPlay = false, AISide = null, dotnetObject = null) {

    dotNetObject = dotnetObject
    gameOver = false;

    $('#replay').hide();

    let board = document.getElementById("board");
    board.innerHTML = '';

    $('.rowRecap').remove();

    //empecher la selection
    $(board).attr('unselectable', 'on');

    let cgHelper = document.createElement('cg-helper');
    board.appendChild(cgHelper);
    let cgContainer = document.createElement('cg-container');
    cgHelper.appendChild(cgContainer);
    let cgBoard = document.createElement('cg-board');
    cgContainer.appendChild(cgBoard);

    let chessGame = new ChessGame();

    currentChessGame = chessGame;
    chessGame.autoPlay = autoPlay;
    chessGame.AISide = AISide
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

    let step = $('cg-helper').width();

    chessGame.step = step;

    let indexPiece;

    for (let i = 0; i < 8; i++) {
        if (i > 1 && i < 6) {
            continue;
        }
        for (let j = 0; j < 8; j++) {

            let piece = document.createElement("piece");

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

            let posY = i * step;
            let posX = j * step;
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
        let relX = event.pageX - $(this).offset().left;
        let relY = event.pageY - $(this).offset().top;
        let pos = [relX, relY];
        chessGame.relPos = pos;
    });

    //Gestion du déplacement des pièces
    $('cg-board').mousedown(function (event) {

        if (!equalState(chessGame.consultedState, chessGame.currentState)) {
            return;
        }

        chessGame.alreadyPlayed = false;

        let clickX = event.pageX - chessGame.board.offset().left;
        let clickY = event.pageY - chessGame.board.offset().top;
        let pos = [clickX, clickY];
        let newSquare = chessGame.isInListAvailablePos(pos);
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
            let clickX = eventObj.pageX - chessGame.board.offset().left;
            let clickY = eventObj.pageY - chessGame.board.offset().top;
            let pos = [clickX, clickY];

            let newSquare = chessGame.isInListAvailablePos(pos);

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

}

function RepositionPieces(chessGame) {


    let step = $('cg-helper').width();
    let board = document.getElementsByTagName('cg-board')[0];

    let boardWidth = $('cg-board').width();

    let ancienStep = chessGame.step;


    $('piece, square').each(function () {

        let posX = $(this).position().left;
        let posY = $(this).position().top;


        let i = Math.round((posY / ancienStep));
        let j = Math.round((posX / ancienStep));

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
        this.turn = true //au départ c'est aux blancs de jouer

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
        let blackPawnRow = []
        for (let i = 0; i < 8; i++) {
            blackPawnRow.push(this.BP);
        }
        this.initialState.push(blackPawnRow);

        //ajout des lignes vides
        for (let i = 0; i < 4; i++) {
            let emptyRow = []
            for (let j = 0; j < 8; j++) {
                emptyRow.push(this.E)
            }
            this.initialState.push(emptyRow);
        }

        //ajout des pièces blanches
        let whitePawnRow = []

        for (let i = 0; i < 8; i++) {
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
        let currentState = State == null ? this.currentState : State;

        let freeTiles = [];

        let i = data.i;
        let j = data.j;

        let directionVertical
        let directionHorizontal
        let directionDesc

        switch (data.p) {
            //roi blanc et roi noir
            case 1:
            case 7:


                for (let x = -1; x < 2; x++) {
                    for (let y = -1; y < 2; y++) {
                        if (i + x >= 0 && i + x < 8 && j + y >= 0 && j + y < 8) {
                            if (currentState[i + x][j + y] == 0) {
                                freeTiles.push([i + x, j + y]);
                            }
                            else {
                                let dataD = { i: i + x, j: j + y, p: currentState[i + x][j + y] }
                                if (this.canTake(data, dataD)) {
                                    let pos = [i + x, j + y]
                                    freeTiles.push(pos);
                                }
                            }
                        }
                    }
                }

                //gestion du castle
                //utilisation de la liste 'hasMoved' de l'objet ChessGame pour savoir si on a bougé telle ou telle piece
                if (!this.hasMoved.containsHTML(this.selectedPiece)) {

                    let listPos = [0, 7]

                    for (let x = 0; x < 2; x++) {
                        for (let y = 0; y < 2; y++) {

                            let posTour = [listPos[x] * this.step, listPos[y] * this.step];

                            let tour = this.getElsAt(posTour, 'piece');

                            if (tour.length == 0) {
                                continue;
                            }

                            if (!this.hasMoved.containsHTML(tour[0])) {
                                //ligne : listPos[x] colonne : listPos[y]
                                switch (listPos[y]) {
                                    case 7:
                                        if (currentState[data.i][5] == 0 && currentState[data.i][6] == 0) {

                                            let targeted = false;

                                            for (const element of this.listTargetedSquare) {

                                                if (Array.isArray(element)) {
                                                    if (element.contains([i, 5]) || element.contains([i, 6])) {
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

                                            let targeted = false;

                                            for (const element of this.listTargetedSquare) {

                                                if (Array.isArray(element)) {
                                                    if (element.contains([i, 1]) || element.contains([i, 2]) || element.contains([i, 3])) {
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
                directionVertical = [1, -1];
                for (let t = 0; t < 2; t++) {
                    for (let x = directionVertical[t]; x + i < 8 && x + i >= 0; x += directionVertical[t]) {
                        if (currentState[x + i][j] == 0) {

                            freeTiles.push([x + i, j]);
                        }
                        else {
                            let dataD = { i: x + i, j: j, p: currentState[x + i][j] }
                            if (this.canTake(data, dataD)) {
                                let pos = [x + i, j]

                                freeTiles.push(pos);
                            }
                            break;
                        }
                    }
                }
                //horizontal
                directionHorizontal = [1, -1];
                for (let t = 0; t < 2; t++) {
                    for (let y = directionHorizontal[t]; y + j < 8 && y + j >= 0; y += directionHorizontal[t]) {
                        if (currentState[i][j + y] == 0) {
                            
                            freeTiles.push([i, j + y]);
                        }
                        else {
                            let dataD = { i: i, j: j + y, p: currentState[i][j + y] }
                            if (this.canTake(data, dataD)) {
                                let pos = [i, j + y]

                                freeTiles.push(pos);
                            }
                            break;
                        }
                    }
                }
                directionDesc = [1, -1];
                for (let t1 = 0; t1 < 2; t1++) {
                    for (let t2 = 0; t2 < 2; t2++) {
                        for (let x = directionDesc[t1], y = directionDesc[t2]; x + i < 8 && x + i >= 0 && y + j < 8 && y + j >= 0; x += directionDesc[t1], y += directionDesc[t2]) {

                            if (currentState[i + x][j + y] == 0) {

                                freeTiles.push([x + i, j + y]);
                            }
                            else {
                                let dataD = { i: i + x, j: j + y, p: currentState[i + x][j + y] }
                                if (data.p == dataD.p) {
                                    continue;
                                }
                                if (this.canTake(data, dataD)) {
                                    let pos = [x + i, j + y]
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
                directionVertical = [1, -1];
                for (let t = 0; t < 2; t++) {
                    for (let x = directionVertical[t]; x + i < 8 && x + i >= 0; x += directionVertical[t]) {
                        if (currentState[x + i][j] == 0) {
                            
                            freeTiles.push([x + i, j]);
                        }
                        else {
                            let dataD = { i: x + i, j: j, p: currentState[x + i][j] }
                            if (this.canTake(data, dataD)) {
                                let pos = [x + i, j]
                                freeTiles.push(pos);
                            }
                            break;
                        }
                    }
                }
                //horizontal
                directionHorizontal = [1, -1];
                for (let t = 0; t < 2; t++) {
                    for (let y = directionHorizontal[t]; y + j < 8 && y + j >= 0; y += directionHorizontal[t]) {

                        if (currentState[i][j + y] == 0) {
                            freeTiles.push([i, j + y]);
                        }
                        else {
                            let dataD = { i: i, j: j + y, p: currentState[i][j + y] }
                            if (this.canTake(data, dataD)) {
                                let pos = [i, j + y]
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
                //diagonales descendante
                directionDesc = [1, -1];
                for (let t1 = 0; t1 < 2; t1++) {
                    for (let t2 = 0; t2 < 2; t2++) {
                        for (let x = directionDesc[t1], y = directionDesc[t2]; x + i < 8 && x + i >= 0 && y + j < 8 && y + j >= 0; x += directionDesc[t1], y += directionDesc[t2]) {

                            if (currentState[i + x][j + y] == 0) {
                                freeTiles.push([x + i, j + y]);
                            }
                            else {
                                let dataD = { i: i + x, j: j + y, p: currentState[i + x][j + y] }
                                if (data.p == dataD.p) {
                                    continue;
                                }
                                if (this.canTake(data, dataD)) {
                                    let pos = [x + i, j + y]
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
                let directionI = [2, 1, -1, -2, -2, -1, 1, 2];
                let directionJ = [1, 2, 2, 1, -1, -2, -2, -1];

                for (let t = 0; t < directionI.length; t++) {

                    let x = directionI[t];
                    let y = directionJ[t];

                    if (x + i < 8 && x + i >= 0 && y + j < 8 && y + j >= 0) {
                        if (currentState[i + x][j + y] == 0) {
                            freeTiles.push([x + i, j + y]);
                        }
                        else {
                            let dataD = { i: i + x, j: j + y, p: currentState[i + x][j + y] }
                            if (this.canTake(data, dataD)) {
                                let pos = [x + i, j + y]
                                freeTiles.push(pos);
                            }
                        }
                    }
                }

                break;
            //pion blanc et pion noir
            case 6:
            case 12:

                let direction = 1;

                if (this.isWhiteParPiece(data.p)) {
                    direction = -1;
                }

                //si les pions sont sur leur ligne de départ alors +2 sinon + 1
                if ((this.isWhiteParPiece(data.p) && data.i == 6) || (this.isBlackParPiece(data.p) && data.i == 1)) {
                    for (let t = 1; t < 3; t++) {
                        let x = direction * t;
                        if (x + i < 8 && x + i >= 0) {

                            if (currentState[i + x][j] == 0) {
                                freeTiles.push([x + i, j]);
                            }
                        }
                    }
                } else {
                    let x = direction;
                    if (x + i < 8 && x + i >= 0) {
                        try {
                            if (currentState[i + x][j] == 0) {
                                freeTiles.push([x + i, j]);
                            }
                        }
                        catch (ex) {
                            console.log("Excpetion : " + ex)
                        }
                    }
                }

                //On check les diagonales en avant pour les potentielles cibles
                let directionDiag = [1, -1];
                for (const element of directionDiag) {
                    if (i + direction < 8 && i + direction >= 0 && j + element < 8 && j + element >= 0) {

                        if (currentState[direction + i][j + element] != 0) {
                            let dataD = { i: direction + i, j: j + element, p: currentState[i + direction][j + element] }
                            if (this.canTake(data, dataD)) {
                                let pos = [i + direction, j + element]
                                freeTiles.push(pos);
                            }
                        }
                    }
                }

                //Gestion en-passant
                let sides = [1, -1];
                if ((this.isWhiteParPiece(data.p) && i == 3) || (this.isBlackParPiece(data.p) && i == 4)) {
                    for (let k = 0; k < 2; k++) {

                        if (j + sides[k] < 8 && j + sides[k] >= 0) {

                            if (currentState[i][j + sides[k]] == 6 || currentState[i][j + sides[k]] == 12) {

                                let pos = [(j + sides[k]) * this.step, i * this.step]

                                let pawn = this.getElsAt(pos, 'piece');

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
    //Si checkSelfKing est non null on est dans le cas où on veut vérifier si notre coup va ou non nous mettre en échec
    isInCheck(isWhiteTurn, checkSelfKing = null, State = null) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                let currentState = State == null ? this.currentState : State;

                let piece = currentState[i][j];
                let data = { i: i, j: j, p: piece };

                if (this.KingIsTargeted(data, isWhiteTurn, currentState)) {
                    return true;
                }                              
            }
        }
        return false;
    }

    KingIsTargeted(data, isWhiteTurn, State) {
        //Dans le cas de checkSelfKing null on ne prend que les piece (pas les cases vides) et les pièces adverse et on regarde notre roi
        //Dans le cas de checkSelfKing non null on prend les pieces adverses et on regarde notre roi dans le state 'provisoire'
        if ((this.isWhiteParPiece(data.p) && !isWhiteTurn || this.isBlackParPiece(data.p) && isWhiteTurn) && data.p != this.E) {
            let targets = this.checkPossibleTiles(data, State);
            for (const element of targets) {
                let targetType = State[element[0]][element[1]];

                if (targetType == (isWhiteTurn ? this.WK : this.BK)) {
                    return true;
                }
            }
        }
    }

    //renvoie true si le coup va mettre le roi en échec
    willBeInCheck(dataD, dataA, isWhiteTurn) {

        let state = _.cloneDeep(this.currentState);

        let posDepart = [dataD.i, dataD.j];
        let posArrivee = [dataA.i, dataA.j];

        state[posDepart[0]][posDepart[1]] = 0;
        state[posArrivee[0]][posArrivee[1]] = dataD.p;

        return !!(this.isInCheck(isWhiteTurn, true, state));
    }


    //p représente la couleur du joueur dont on vérifie s'il est mis en échec et mat (entre 1 et 6 blanc, entre 7 et 12 noir)
    checkMate(p) {

        for (let i = 0; i < 8; i++) {
            //on regarde les pièces du joueur et dès qu'on trouve un coup possible on retourne faux, sinon c'est qu'il n'a aucun coup possible et on retourne true
            for (let j = 0; j < 8; j++) {
                let piece = this.currentState[i][j];

                let data = { i: i, j: j, p: piece };

                if (this.isSameColorParType(p, piece)) {

                    let availablePositions = this.checkPossibleTiles(data);

                    for (const element of availablePositions) {

                        let dataTarget = { i: element[0], j: element[1], p: piece };

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

        let fen = this.generateFEN();
        let colorLastTurn = fen.split(' ')[1];
        let ffColor = colorLastTurn == 'w' ? 'Blancs' : 'Noirs';
        let winnerColor = colorLastTurn == 'w' ? forfeit ? 'Blancs' : 'Noirs' : forfeit ? 'Noirs' : 'Blancs';

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
        let posD = [dataD.i, dataD.j]
        let posA = [dataA.i, dataA.j]

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

        let chessGame = this;

        this.selectedPiece = null;

        this.resetSelection();

        let board = this.board;

        if (event != null && pos == null) {
            let relX = event.pageX - board.offset().left;
            let relY = event.pageY - board.offset().top;
            pos = [relX, relY];
        }


        let elements = this.getElsAt(pos);

        this.posOrigin = this.getSquareAtPos(pos);

        let listSelectedPiece = elements.filter(function () {
            return this.tagName == 'PIECE' && chessGame.isColorTurn(this);
        });


        if (listSelectedPiece.length != 0) {

            this.selectedPiece = listSelectedPiece[0];
            this.initialSelectedPiecePos = this.getPosFromElement(this.selectedPiece, true);

            let ghostSquare = this.createSquareAtPos(pos, 'square', 'selected');
            $(ghostSquare).html(this.selectedPiece.innerHTML);

            //On enleve la classe selected piece de la piece précédente
            $('.selectedPiece').removeClass('selectedPiece')

            $(this.selectedPiece).addClass('selectedPiece');

            $(chessGame.selectedPiece).css('transition-duration', '');
            let step = this.step;

            //Gestion mousemove
            $('cg-board').mousemove(function (event) {

                let relX = event.pageX - $(this).offset().left;
                let relY = event.pageY - $(this).offset().top;
                pos = [relX, relY];
                chessGame.relPos = pos;

                event.stopPropagation();

                $(chessGame.selectedPiece).css('transform', 'translate( ' + (pos[0] - (step / 2)) + 'px, ' + (pos[1] - (step / 2)) + 'px)');

            })

            //Gestion Preview
            //Récupération des cases disponibles

            let smallPos = this.getPosFromElement(this.selectedPiece, true);

            let i = Math.round(smallPos[0],0);
            let j = Math.round(smallPos[1],0);

            let pieceType = this.getPieceTypeFromEl(this.selectedPiece);

            let data = { i: i, j: j, p: pieceType };

            let availablePositions = this.checkPossibleTiles(data)
            

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
        let top = pos[1] + 1;
        let left = pos[0] + 1;

        let selectedPiece = $(this.selectedPiece);

        let step = this.step;
        return $(this.board)
            .find(type == null ? 'square, piece' : type == 'square' ? type : 'piece')
            .filter(function () {
                let actualOffsetTop = (Math.abs($(this).offsetParent().offset().top - $(this).offset().top));
                let actualOffsetLeft = (Math.abs($(this).offsetParent().offset().left - $(this).offset().left));

                let found = top.between(actualOffsetTop, actualOffsetTop + step) && left.between(actualOffsetLeft, actualOffsetLeft + step);
                return selectedPiece != $(this) && found;
            });
    }

    //renvoie une position (haut gauche) qui représente une case
    getSquareAtPos(pos) {

        let top = pos[1];
        let left = pos[0];

        let step = this.step;

        let posTop = top - (top % step);
        let posLeft = left - (left % step);

        return [posLeft, posTop];
    }

    createSquareAtPos(pos, type = null, css = null) {

        //Si il n'y a pas une square a cette position
        if (this.getElsAt(pos).filter(function () { return this.tagName == 'SQUARE' }).length == 0) {

            let top = pos[1];
            let left = pos[0];

            let step = this.step;

            let posTop = top - (top % step);
            let posLeft = left - (left % step);

            let square = document.createElement(!type ? 'square' : type);

            square.style.transform = 'translate(' + posLeft + 'px, ' + posTop + 'px)';
            if (css != null) {
                square.classList.add(css);
            }
            this.board.append(square);

            return square;
        }
    }

    getPosFromElement(el, small = false) {

        let board = this.board;

        let relY = $(el).offset().top - board.offset().top;

        let relX = $(el).offset().left - board.offset().left;
        let pos1 = [relY, relX];

        let pos2 = this.getSquareAtPos(pos1);

        if (small) {
            return this.getSmallPos(pos2);
        } else {
            return pos2;
        }
    }

    getSmallPos(pos) {
        return [pos[0] == 0 ? 0 : Math.round((pos[0] / this.step), 0), pos[1] == 0 ? 0 : Math.round((pos[1] / this.step),0)]
    }

    getPieceTypeFromEl(el) {
        for (const element of this.listPiece) {
            if (el.id.includes(element[0])) {
                return element[2];
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
        let chessGame = this;
        this.listTargetedSquare = [];
        $('piece').each(function () {
            if (this.id.includes(isWhiteTurn ? 'white' : 'black')) {

                let pos = chessGame.getPosFromElement(this);
                let type = chessGame.getPieceTypeFromEl(this);
                let data = { i: Math.round(pos[0] / chessGame.step, 0), j: Math.round(pos[1] / chessGame.step,0), p: type }


                let listTargets = chessGame.checkPossibleTiles(data);


                chessGame.listTargetedSquare.push(listTargets);
            }
        });
    }

    //supprime les square hover
    resetHover(allHover, pos = null) {

        let chessGame = this;

        if (!allHover) {
            $('square.hover').each(function (index, el) {
                let relX = Math.abs(chessGame.board.offset().left - $(el).offset().left);/* - (step / 2);*/
                let relY = Math.abs(chessGame.board.offset().top - $(el).offset().top); /*- (step / 2);*/
                let posEl = [relX, relY];

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

        let foundSquare = null;

        for (const element of this.listTileAvailable) {

            if (pos[0].between(element[1], element[1] + this.step) && pos[1].between(element[0], element[0] + this.step)) {

                foundSquare = [element[1], element[0]];

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

        let nbPieceBefore = $('piece').length;

        this.pawnJustAdvancedOfTwo = null;
        this.enPassantPos = null;

        $('square.oldDest, square.newDest').remove();
        $('.check').remove();

        let posDepart = this.initialSelectedPiecePos;
        let typePieceDepart = this.getPieceTypeFromEl(this.selectedPiece);

        let dataDepart = { i: posDepart[0], j: posDepart[1], p: typePieceDepart };

        let chessGame = this;

        let target = this.getElsAt(newSquare, 'piece').filter(function (el) {

            let found = !chessGame.isSameColor(chessGame.selectedPiece, this);

            return found;

        });

        let dataArrivee = { i: Math.round(newSquare[1] / this.step, 0), j: Math.round(newSquare[0] / this.step,0), p: target.length > 0 ? this.getPieceTypeFromEl(target[0]) : 0 };

        //on vérifie tout d'abord que l'on ne va pas se mettre en échec (fonction willBeInCheck)
        if (this.willBeInCheck(dataDepart, dataArrivee, this.toWhite)) {
            return;
        }

        if (!drag) {
            $(chessGame.selectedPiece).css('transition-duration', '0.4s');
        }

        let castle = false;
        //Code de déplacement
        //castle
        if (this.selectedPiece.id.includes('king') && (Math.abs(dataDepart.j - dataArrivee.j) > 1)) {
            //Si on passe ici c'est qu'on a cliqué sur une case castle après avoir sélectionné le roi

            castle = true;

            if (dataArrivee.j - dataDepart.j > 0) {
                //castle king side
                let tour = this.getElsAt([7 * this.step, dataDepart.i * this.step]);
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
                let tour = this.getElsAt([0, dataDepart.i * this.step]);

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
            let targetEnPassant = this.getElsAt([newSquare[0], newSquare[1] + this.step * (this.toWhite ? 1 : -1)], 'piece');

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

                let promotion = document.createElement('div');
                promotion.id = 'promotion-choice';
                promotion.classList.add('top');

                for (let t = 0; t < 4; t++) {

                    if (dataArrivee.i == 0) {
                        //Promotion piece blanche
                        let pieceProm = document.createElement('squarePromotion');
                        pieceProm.style.top = t * 12.5 + '%';
                        pieceProm.style.left = (87.5 - (12.5 * (7 - dataArrivee.j))) + '%';

                        let piece = document.createElement('piecePromotion');
                        piece.innerHTML = this.listProm[t][0];
                        piece.id = (this.listProm[t][1])
                        pieceProm.appendChild(piece)
                        promotion.appendChild(pieceProm);
                    } else if (dataArrivee.i == 7) {
                        //Promotion piece noire
                        let pieceProm = document.createElement('squarePromotion');
                        pieceProm.style.top = 87.5 - (t * 12.5) + '%';
                        pieceProm.style.left = (87.5 - (12.5 * (7 - dataArrivee.j))) + '%';

                        let piece = document.createElement('piecePromotion');
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

                } else if (dataArrivee.i == 7) {
                    this.selectedPiece.id = this.listProm[4][1];
                    this.selectedPiece.innerHTML = this.listProm[4][0];

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

        let InewSquare = newSquare[1] / this.step;
        let JnewSquare = newSquare[0] / this.step;
        let posArrivee = [InewSquare, JnewSquare];

        let x = posDepart[0];
        let y = posDepart[1];

        let typePiece;

        if (!castle) {
            this.currentState[x][y] = 0;
            typePiece = this.getPieceTypeFromEl(this.selectedPiece);
            this.currentState[posArrivee[0]][posArrivee[1]] = typePiece;
        }

        this.consultedState = _.cloneDeep(this.currentState);

        this.listePositions.push(this.currentState);


        if (this.toWhite) {

            let rowRecap = document.createElement('div');
            rowRecap.classList.add('rowRecap');
            rowRecap.style.top = ((this.currentTurn == 1 ? 0 : (this.currentTurn - 1)) * 5) + '%'
            rowRecap.id = 'row' + this.currentTurn;
            $('.recapContainer').append(rowRecap);

            let index = document.createElement('div');
            index.classList.add('index');
            index.innerHTML = this.currentTurn;
            $(rowRecap).append(index);

            index.style.left = "0%";
        }

        let moveElement;
        let move;

        if (target.length == 1) {

            //recap si capture
            moveElement = document.createElement('div');
            moveElement.classList.add(this.toWhite ? 'whiteMove' : 'blackMove');
            move = (this.selectedPiece.id.includes('pawn') ? String.fromCharCode(97 + dataDepart.j) : $(this.selectedPiece).html()) + 'x' + String.fromCharCode(97 + dataArrivee.j) + (8 - dataArrivee.i);
            moveElement.innerHTML = move;
            moveElement.style.cursor = 'pointer';
            $('#row' + this.currentTurn).append(moveElement);

        } else {
            moveElement = document.createElement('div');
            moveElement.classList.add(this.toWhite ? 'whiteMove' : 'blackMove');
            move = (this.selectedPiece.id.includes('pawn') ? '' : $(this.selectedPiece).html()) + String.fromCharCode(97 + dataArrivee.j) + (8 - dataArrivee.i);
            moveElement.innerHTML = move;
            $('#row' + this.currentTurn).append(moveElement);
        }

        $(moveElement).data({ state: _.cloneDeep(this.currentState), posD: posDepart, posA: posArrivee });

        $(moveElement).click(function () {
            event.stopPropagation();
            $('square.oldDest, square.newDest').remove();

            let oldDestT = document.createElement('square');
            let newDestT = document.createElement('square');

            oldDestT.classList.add('oldDest');
            newDestT.classList.add('newDest');

            chessGame.loadPosition($(this).data().state);
            chessGame.board.append(oldDestT);
            chessGame.board.append(newDestT);

            $('.oldDest').css('transform', 'translate( ' + ($(this).data().posD[1] * chessGame.getStep()) + 'px, ' + ($(this).data().posD[0] * chessGame.getStep()) + 'px)');
            $('.newDest').css('transform', 'translate( ' + ($(this).data().posA[1] * chessGame.getStep()) + 'px, ' + ($(this).data().posA[0] * chessGame.getStep()) + 'px)');

        });

        let element = document.getElementsByClassName('recapContainer')[0]
        element.scrollTop = element.scrollHeight;

        this.listMoves.push(move);

        if (this.toBlack) {
            this.currentTurn++;
        }

        this.isWhiteTurn = !this.isWhiteTurn;
        this.toBlack = !this.toBlack;
        this.toWhite = !this.toWhite;
        this.turn = !this.turn;

        let chessGameL = this;
        dataArrivee = { i: InewSquare, j: JnewSquare, p: typePiece }
        let listNewTargets = this.checkPossibleTiles(dataArrivee);

        $('#trait').html(this.toWhite ? 'Trait aux blancs' : 'Trait aux noirs');

        this.listTargets(!this.toWhite);

        //Creation des squares oldDest et newDest
        let oldDest = document.createElement('square');
        let newDest = document.createElement('square');

        oldDest.classList.add('oldDest');
        newDest.classList.add('newDest');

        this.board.append(oldDest);
        this.board.append(newDest);

        oldDest.style.transform = 'translate( ' + (posDepart[1] * this.step) + 'px, ' + (posDepart[0] * this.step) + 'px)';
        newDest.style.transform = 'translate( ' + newSquare[0] + 'px, ' + newSquare[1] + 'px)';

        //Gestion check
        let check = false;
        let end = false;
        listNewTargets.forEach(function (element) {
            let i = element[0];
            let j = element[1];
            if (chessGameL.currentState[i][j] == 1 || chessGameL.currentState[i][j] == 7) {
                check = true;
                let pos = [j * chessGame.step, i * chessGame.step]
                let roiElement = chessGameL.getElsAt(pos, 'piece');

                let checkSquare = chessGame.createSquareAtPos(pos, 'square', 'check');

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

            for (const element of this.listTargetedSquare) {

                let listPos = element;

                for (const element of listPos) {

                    let pos = [element[1] * this.step, element[0] * this.step];
                    let target = this.getElsAt(pos, 'piece');
                    if (target.length > 0) {

                        if (target[0].id == (this.toWhite ? 'white king' : 'black king')) {

                            check = true;
                            let checkSquare = this.createSquareAtPos(pos, 'square', 'check');
                        }
                    }
                }
            }
        }

        this.crossOrigin = 'anonymous';
        this.audio.play();

        this.VisualizeState(this.currentState, this.currentTurn, this.toWhite);

        //si tour ou roi on marque met la piece dans la liste des hasMoved pour le castle
        let type = this.getPieceTypeFromEl(this.selectedPiece);
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

        let nbPieceAfter = $('piece').length;
        let pieceTaken = nbPieceBefore - nbPieceAfter > 0;

        if (!pieceTaken && !this.selectedPiece.id.includes('pawn')) {
            this.halfClock++;
        } else {
            this.halfClock = 0;
        }

        //On vide la liste des positions available
        this.listTileAvailable = [];

        //Affichage du FEN
        let fen = this.generateFEN();
        $('#FEN').html(this.generateFEN());

        if (this.autoPlay && this.AISide == this.turn) {
            dotNetObject.invokeMethodAsync('PlayAIMove', fen);
        }
    }

    LaunchPreview(data, availablePositions) {

        this.resetPreview();

        for (const element of availablePositions) {

            let iTarget = element[0];
            let jTarget = element[1];
            let targetElement = $(this.getSquareId(iTarget, jTarget));

            let targetPieceType = this.currentState[iTarget][jTarget];
            let dataTarget = { i: iTarget, j: jTarget, p: targetPieceType };

            if (this.willBeInCheck(data, dataTarget, this.isWhiteParPiece(data.p))) {
                continue;
            }



            let pos = [element[0] * this.step, element[1] * this.step];
            this.listTileAvailable.push(pos)


            this.AfficherPreview(data, dataTarget, targetElement);

        }
    }

    AfficherPreview(data, dataTarget, targetElement) {

        let posTarget = [dataTarget.j * this.step, dataTarget.i * this.step]

        if (dataTarget.p == 0) {
            //case vide
            let square = this.createSquareAtPos(posTarget, 'square', 'move-dest')

        } else {
            //piece adverse
            let square = this.createSquareAtPos(posTarget, 'square', 'move-destTarget');

        }
    }

    //Visualiser un etat
    VisualizeState(State, index = null, white = null) {

        if (index) {
            console.log("Position N°" + (index) + " : " + (white ? "Trait aux blancs" : "Trait aux noirs"));
        }

        if (($('#detail').is(':checked')) || index == null) {
            State.forEach(ligne => {
                let row = "";
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

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                let posY = i * this.step;
                let posX = j * this.step;
                let piece = state[i][j];

                if (piece != 0) {
                    let pieceElement = document.createElement("piece");

                    for (const element of this.listPiece) {
                        if (element[2] == piece) {
                            pieceElement.id = element[0];
                            pieceElement.innerHTML = element[1];
                            break;
                        }
                    }

                    this.board.append(pieceElement);

                    pieceElement.style.transform = 'translate( ' + posX + 'px, ' + posY + 'px)';
                }

            }
        }

        $('piece').css('transition-duration', '');

        this.consultedState = _.cloneDeep(state);
    }

    listAllAvailableTiles() {

        let positionObject = []

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let type = this.currentState[i][j]
                if (type != 0 && this.isColorTurnParType(type)) {
                    let posD = [i, j];
                    let data = { i: i, j: j, p: type }
                    let listPosAvailable = this.checkPossibleTiles(data);
                    if (listPosAvailable.length > 0) {
                        let dataPos = { posD: posD, listPosA: listPosAvailable };
                        positionObject.push(dataPos);
                    }
                }
            }
        }
        return positionObject;
    }

    generateFEN() {
        let FEN = "";
        for (let i = 0; i < 8; i++) {
            let nbVide = 0;
            for (let j = 0; j < 8; j++) {

                let type = currentChessGame.currentState[i][j];

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
        let enPassant = '-';
        if (currentChessGame.pawnJustAdvancedOfTwo != null) {

            let pos = this.enPassantPos;

            let direction = currentChessGame.isWhiteParPiece(currentChessGame.getPieceTypeFromEl(currentChessGame.pawnJustAdvancedOfTwo)) ? 1 : -1;

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

    console.log(result)

    let posDY = (8 - result.charAt(1)) * currentChessGame.step //Y de départ
    let posDX = (result.charAt(0).charCodeAt(0) - 97) * currentChessGame.step // X de départ

    let posAX = (8-result.charAt(3)) * currentChessGame.step
    let posAY = (result.charAt(2).charCodeAt(0) - 97) * currentChessGame.step



    currentChessGame.SelectPiece(null, [posDX, posDY]);

    currentChessGame.playMove2([posAY, posAX], !$('#AutoTransition').prop('checked'), true);

    $('cg-board').unbind('mousemove');
}

function getState() {
    return currentChessGame.generateFEN();
}

function equalState(state1, state2) {
    let equals = true;
    for (let i = 0; i < 8; i++) {
        if (!state1[i].equals(state2[i])) {
            equals = false;
        }
    }
    return equals;
}

function findPieceInList(p) {
    for (const element of currentChessGame.listPiece) {
        if (element[2] == p) {
            return element[3];
        }
    }
}

Array.prototype.contains = function (subArray) {

    let contain = false;

    this.forEach(function (element) {
        if (subArray.equals(element)) {
            contain = true;
        }
    });


    return contain;
}

Array.prototype.containsHTML = function (element) {
    for (let i = 0; i < this.length; i++) {

        let elementList = this[i];

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

    let equals = true;

    if (this.length != Array2.length) {
        return false;
    }

    for (let i = 0; i < this.length; i++) {
        if (this[i] != Array2[i]) {
            equals = false;
        }
    }
    return equals;
}

Array.prototype.deleteHTMLElement = function (element) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].attr('id') == element.attr('id')) {
            let deletedElement = this.splice(i, 1);
            return deletedElement;
        }
    }
    return null;
}


function resetIndications() {
    $('.dot').remove();
    $('.targetInner').each(function () {
        let innerHtml = $(this).html();
        let parent = $(this).parent().parent();
        $(parent).html(innerHtml);
    });
    $('.targetOuter').remove();
}

Number.prototype.between = function (a, b) {
    let min = Math.min(a, b),
        max = Math.max(a, b);
    return this >= min && this <= max;
};


