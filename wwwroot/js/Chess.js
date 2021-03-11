//création du plateau
function LoadChessBoard() {

    $('#replay').hide();



    var board = document.getElementById("board");

    board.innerHTML = '';

    //empecher la selection
    $(board).attr('unselectable', 'on');

    var chessGame = new ChessGame();

    $('#giveUp').show();
    $('#giveUp').click(function () {
        //si les blancs abandonnent on passe en parametre les noirs
        chessGame.endGame(chessGame.toWhite ? 7 : 1, true);
    });

    for (var i = 0; i < 8; i++) {

        var row = document.createElement("row");
        row.classList.add("d-flex")
        row.classList.add("flex-row")

        var position = document.createElement("number");
        position.classList.add("numberContainer");
        var text = document.createElement("span");
        text.classList.add("number");
        text.innerHTML = 8 - i;
        position.appendChild(text);
        row.appendChild(position);

        for (var j = 0; j < 8; j++) {

            var square = document.createElement("square");
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    square.classList.add("white");
                }
                else {
                    square.classList.add("black");
                }
            } else {
                if (j % 2 == 0) {
                    square.classList.add("black");
                }
                else {
                    square.classList.add("white");
                }
            }

            square.classList.add("pieceContainer");

            var numPiece = chessGame.initialState[i][j];

            var piece = 

            square.innerHTML = !numPiece ? "" : "&#" + (9811 + numPiece) + ";";
            square.classList.add("piece");

            square.id = String.fromCharCode(97 + j) + (8-i);


            row.appendChild(square);


        }


        board.appendChild(row);

        $(".pieceContainer").droppable({
            //revert: true
            drop: function (event, ui) {
                if ($('#' + ui.draggable[0].id).data('position').p != 0) {
                    var childId = event.target.id;
                    if (!childId) {
                        childId = event.target.firstChild.firstChild.firstChild.id;
                    }
                    var dataDepart = $("#" + ui.draggable[0].id).data('position');
                    var dataArrivee = $("#" + childId).data('position');
                    //fonction de déclenchement du move
                    chessGame.PlayMove(dataDepart, dataArrivee);
                }

            }
        });
    }

    //ajout des lettres en bas
    var row = document.createElement("lettreRow");
    row.classList.add("d-flex")
    row.classList.add("flex-row")

    var cornerPosition = document.createElement("corner");
    cornerPosition.classList.add("corner");
    row.appendChild(cornerPosition);

    for (var j = 0; j < 8; j++) {

        var position = document.createElement("row");
        position.classList.add("letterContainer");
        var text = document.createElement("span");
        text.classList.add("letter");
        text.innerHTML = String.fromCharCode(65 + j)
        position.appendChild(text);
        row.appendChild(position);

    }

    board.appendChild(row);

    //affectation data sur chaque tile
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            console.log(chessGame.getSquareId(i, j));
            var ligne = Math.trunc(i / 8, 0);
            var colonne = i % 8;

            $(chessGame.getSquareId(i,j)).data('position', { i: ligne, j: colonne, p: chessGame.currentState[ligne][colonne] });

            chessGame.listTileNotPreview.push($(chessGame.getSquareId(i, j)));

            $(chessGame.getSquareId(i, j)).click(function () {
                var data = $(this).data('position');
                //Fonction de Preview
                chessGame.GestionClick(data, true);

            });
        }
    }

    $(".piece").each(function () {
        $(this).draggable({
            helper: 'clone',
            start: function (event, ui) {
                var data = $(event.target).data('position');
                chessGame.GestionClick(data);
            }
        });
        // on désactive le drag'n'drop des pieces noires
        if ($(this).data('position').p > 6) {
            $(this).draggable('disable');
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


        this.selectedPiece;

        this.listTilePreview = [];
        this.listTileNotPreview = [];


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

                return freeTiles;

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
                return freeTiles;
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
                return freeTiles;
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
                return freeTiles;
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
                return freeTiles;
                break;
            //pion blanc et pion noir
            case 6:
            case 12:

                var direction = 1;

                if (this.isWhite(data.p)) {
                    direction = -1;
                }

                //si les pions sont sur leur ligne de départ alors +2 sinon + 1
                if ((this.isWhite(data.p) && data.i == 6) || (this.isBlack(data.p) && data.i == 1)) {
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
                return freeTiles;
                break;
            default:
                break;
        }
    }

    posToElement(pos) {
        return $(this.getSquareId(pos[0],pos[1]));
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
                if ((this.isWhite(data.p) && !isWhiteTurn || this.isBlack(data.p) && isWhiteTurn) && data.p != 0) {
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
            //console.log('Cannot play that, you will be in check...');
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

                if (this.getColor(p) == this.getColor(piece)) {

                    var availablePositions = this.checkPossibleTiles(data);

                    for (var k = 0; k < availablePositions.length; k++) {

                        var dataTarget = { i: availablePositions[k][0], j: availablePositions[k][1], p: piece };

                        if (!this.willBeInCheck(data, dataTarget, this.isWhite(data.p))) {
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
        }else {
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

        return !this.isSameColor(dataD.p, dataA.p);
    }

    //on retourne "a1" pour la case 7,0
    getSquare(i, j) {
        return String.fromCharCode(97 + i) + (8 - j);
    }

    getSquareId(i, j) {
        return '#' + String.fromCharCode(97 + i) + (8 - j);
    }

    getColor(p) {
        if (this.isWhite(p)) {
            return "white";
        }
        else if (this.isBlack(p)) {
            return "black";
        }
        else {
            return "vide";
        }
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

    isColorTurn(p) {
        return (this.isBlack(p)) && this.toBlack || (this.isWhite(p) && (this.toWhite));
    }

    isSelectedPiece(pieceHTML) {
        if (!this.selectedPiece) {
            return false;
        }
        return this.selectedPiece.attr('id') == pieceHTML.attr('id');
    }

    isPreview() {
        return this.listTilePreview.length > 0;
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

            //console.log(positionDepart);
            //console.log(positionArrivee);
            console.log('parcouruLeft : ' + parcouruLeft);
            console.log('parcouruTop : ' + parcouruTop);



            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.cssClass { left: ' + positionArrivee.left + 'px; top : ' + positionArrivee.top + 'px }';
            document.getElementsByTagName('head')[0].appendChild(style);

            elementDepart.addClass('cssClass');
            //document.getElementById('someElementId').className = 'cssClass';

            return;





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

            //on si la pièce dans la position d'arrivée met en écheck le roi adverse
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

    GestionClick(data, click = false) {

        var i = data.i;
        var j = data.j;
        var clickedElement = $(this.getSquareId(i,j));
        //Si on re-clique sur le même élément on quitte la fonction
        if (this.isSelectedPiece(clickedElement) && click) {
            return;
        }

        var availablePositions = this.checkPossibleTiles(data);


        var dataSelectedPiece = $(this.selectedPiece).data('position');

        //réinitialiser les cases
        resetIndications();


        //si on clique sur une case vide qui n'appartient pas à la liste de preview, on reset les listes et on sort de la fonction
        if (data.p == 0 && !this.listTilePreview.containsHTML(clickedElement)) {
            this.EmptyPreviewList();
            return;
        }

        this.selectedPiece = clickedElement;

        //Gestion de la preview : on crée une liste des éléments HTML (les tiles) que la piece peut viser dans l'objet chessGame
        //puis on y ajoute les events de click
        //Après le move on supprime ces événements et on réinjecte l'event click de la preview
        //this.listTilePreview détient la liste des tiles visées par la piece en preview
        //this.listeTileNotPreview détient la liste des tiles qui peuvent passer en preview(toute piece différente de la piece en preview et de ses targets)
        //la somme des 2 listes doit contenir toutes les pieces + les cases vides visées

        //Si le point d'entrée c'est le drag on fait juste un preview


        //console.log(this.isPreview() ? 'Preview' : 'Pas Preview');

        //Si on entre en preview
        if (!this.isPreview()) {
            this.LaunchPreview(data, availablePositions);
        }
        //Si on est déjà en preview
        else {

            if (!this.listTilePreview.containsHTML(clickedElement)) {
                //On clique sur une autre piece -> on transfere le liste des preview dans la liste des non preview
                //On veut afficher la preview de cette autre piece
                this.EmptyPreviewList();
                this.LaunchPreview(data, availablePositions);
            } else {
                //on déclenche le move, on récupère la pièce sélectionnée et l'inject avec la tile cliquée
                this.PlayMove(dataSelectedPiece, data)
            }

        }
        //console.log(this.listTilePreview.length);
        //console.log(this.listTileNotPreview.length);
    }

    LaunchPreview(data, availablePositions) {

        for (var i = 0; i < availablePositions.length; i++) {


            var iTarget = availablePositions[i][0];
            var jTarget = availablePositions[i][1];
            var targetElement = $(this.getSquareId(iTarget, jTarget));

            var targetPieceType = this.currentState[iTarget][jTarget];
            var dataTarget = { i: iTarget, j: jTarget, p: targetPieceType };

            if (this.willBeInCheck(data, dataTarget, this.isWhite(data.p))) {
                continue;
            }


            this.listTilePreview.push(targetElement);
            if (!this.listTileNotPreview.deleteHTMLElement(targetElement)) {
                console.log("L'élément à supprimer n'existe pas dans la liste des tiles qui ne sont pas en preview");
            }


            this.AfficherPreview(data, dataTarget, targetElement);

        }
    }

    AfficherPreview(data, dataTarget, targetElement) {

        if (data.p != 0 && (targetElement == 0 || !this.isSameColor(data.p, targetElement))) {

            if (dataTarget.p == 0) {
                var previewElement = document.createElement("span");
                previewElement.classList.add("dot");
                targetElement.append(previewElement);
            } else {
                var innerHtml = targetElement.html();
                var targetElementOuter = document.createElement('div');
                var targetElementInner = document.createElement('div');
                targetElementOuter.classList.add('targetOuter');
                targetElementInner.classList.add('targetInner');
                targetElementInner.innerHTML = innerHtml;
                targetElementOuter.appendChild(targetElementInner);
                targetElement.html('');
                targetElement.append(targetElementOuter);
            }
        }
    }

    //Visualiser un etat
    VisualizeState(State, index = null, white = null) {

        if (index) {
            //console.log("Position N°" + (index + 1) + " : " + (white ? "Trait aux blancs" : "Trait aux noirs"));
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
        if (this[i].attr('id') == element.attr('id')) {
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


