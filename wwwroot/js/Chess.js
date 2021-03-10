//création du plateau
function LoadChessBoard() {


    var board = document.getElementById("board");

    //empecher la selection
    $(board).attr('unselectable', 'on');

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
                    tile.classList.add("white");
                }
                else {
                    tile.classList.add("black");
                }
            } else {
                if (j % 2 == 0) {
                    tile.classList.add("black");
                }
                else {
                    tile.classList.add("white");
                }
            }

            tile.classList.add("pieceContainer");

            var numPiece = chessGame.initialState[i][j];

            tile.innerHTML = !numPiece ? "" : "&#" + (9811 + numPiece) + ";";
            tile.classList.add("piece");

            tile.id = "tile" + tileNumber;
            tileNumber++;


            row.appendChild(tile);


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

        chessGame.listTileNotPreview.push($('#tile' + i));

        $('#tile' + i).click(function () {
            var data = $(this).data('position');
            //Fonction de Preview
            chessGame.GestionClick(data, true);

        });

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
                var directionVertical = [1, -1];
                for (var t = 0; t < 2; t++) {
                    for (var x = directionVertical[t]; x + i < 8 && x + i >= 0; x += directionVertical[t]) {
                        if (this.currentState[x + i][j] == 0) {
                            ;
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
                //horizontal
                var directionHorizontal = [1, -1];
                for (var t = 0; t < 2; t++) {
                    for (var y = directionHorizontal[t]; y + j < 8 && y + j >= 0; y += directionHorizontal[t]) {
                        if (this.currentState[i][j + y] == 0) {
                            freeTiles.push([i, j + y]);
                        }
                        else {
                            var dataD = { i: i, j: j + y, p: this.currentState[i][j + y] }
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

                            if (this.currentState[i + x][j + y] == 0) {
                                freeTiles.push([x + i, j + y]);
                            }
                            else {
                                var dataD = { i: i + x, j: j + y, p: this.currentState[i + x][j + y] }
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
                        if (this.currentState[x + i][j] == 0) {
                            ;
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
                //horizontal
                var directionHorizontal = [1, -1];
                for (var t = 0; t < 2; t++) {
                    for (var y = directionHorizontal[t]; y + j < 8 && y + j >= 0; y += directionHorizontal[t]) {
                        if (this.currentState[i][j + y] == 0) {
                            freeTiles.push([i, j + y]);
                        }
                        else {
                            var dataD = { i: i, j: j + y, p: this.currentState[i][j + y] }
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

                            if (this.currentState[i + x][j + y] == 0) {
                                freeTiles.push([x + i, j + y]);
                            }
                            else {
                                var dataD = { i: i + x, j: j + y, p: this.currentState[i + x][j + y] }
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
                        if (this.currentState[i + x][j + y] == 0) {
                            freeTiles.push([x + i, j + y]);
                        }
                        else {
                            var dataD = { i: i + x, j: j + y, p: this.currentState[i + x][j + y] }
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
                            if (this.currentState[i + x][j] == 0) {
                                freeTiles.push([x + i, j]);
                            }
                        }
                    }
                } else {
                    var x = direction;
                    if (x + i < 8 && x + i >= 0) {
                        if (this.currentState[i + x][j] == 0) {
                            freeTiles.push([x + i, j]);
                        }
                    }
                }

                //On check les diagonales en avant pour les potentielles cibles
                var directionDiag = [1, -1];
                for (var t = 0; t < directionDiag.length; t++) {
                    if (i + direction < 8 && i + direction >= 0 && j + directionDiag[t] < 8 && j + directionDiag[t] >= 0) {

                        if (this.currentState[direction + i][j + directionDiag[t]] != 0) {
                            var dataD = { i: direction + i, j: j + directionDiag[t], p: this.currentState[i + direction][j + directionDiag[t]] }
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

    //si il y a un check
    isCheked() {

    }

    //peut prendre la piece adverse ou non
    canTake(dataD, dataA) {
        var posD = [dataD.i, dataD.j]
        var posA = [dataA.i, dataA.j]

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

        if (this.checkPossibleTiles(dataDepart).contains(posArrivee) && this.isColorTurn(dataDepart.p)) {

            $('#tile' + (dataArrivee.i * 8 + dataArrivee.j)).html($('#tile' + (dataDepart.i * 8 + dataDepart.j)).html());
            $('#tile' + (dataDepart.i * 8 + dataDepart.j)).html('');

            this.currentState[posDepart[0]][posDepart[1]] = 0;
            this.currentState[posArrivee[0]][posArrivee[1]] = dataDepart.p;

            this.listePositions.push(this.currentState);
            this.currentTurn++;
            this.toWhite = !this.toWhite;
            this.toBlack = !this.toBlack;
            this.VisualizeState(this.currentState, this.currentTurn, this.toWhite);

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
        }
    }

    GestionClick(data, click = false) {

        var availablePositions = this.checkPossibleTiles(data);


        var i = data.i;
        var j = data.j;

        var clickedElement = $('#tile' + (i * 8 + j));

        //Si on re-clique sur le même élément on quitte la fonction
        if (this.isSelectedPiece(clickedElement) && click) {
            return;
        }

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


        console.log(this.isPreview() ? 'Preview' : 'Pas Preview');

        //Si on entre en preview
        if (!this.isPreview()) {
            this.LaunchPreview(data, availablePositions);
        }
        //Si on est déjà en preview
        else {

            if (!this.listTilePreview.containsHTML(clickedElement)) {
                //on clique sur une autre piece -> on transfere le liste des preview dans la liste des non preview
                //On veut afficher la preview de cette autre piece
                this.EmptyPreviewList();
                this.LaunchPreview(data, availablePositions);
            } else {
                //this.BalancePreviewLists(availablePositions);
            }

        }
        console.log(this.listTilePreview.length);
        console.log(this.listTileNotPreview.length);
    }

    LaunchPreview(data, availablePositions) {

        for (var i = 0; i < availablePositions.length; i++) {

            var iTarget = availablePositions[i][0];
            var jTarget = availablePositions[i][1];
            var targetElement = $('#tile' + (iTarget * 8 + jTarget));

            var targetPieceType = this.currentState[iTarget][jTarget];

            this.listTilePreview.push(targetElement);
            if (!this.listTileNotPreview.deleteHTMLElement(targetElement)) {
                console.log("L'élément à supprimer n'existe pas dans la liste des tiles qui ne sont pas en preview");
            }

            var dataTarget = { i: iTarget, j: jTarget, p: targetPieceType };

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
            console.log('here');
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
    VisualizeState(State, index, white) {

        console.log("Position N°" + (index + 1) + " : " + (white ? "Trait aux blancs" : "Trait aux noirs"));

        if (($('#detail').is(':checked'))) {
            State.forEach(ligne => {
                var row = "";
                ligne.forEach(col => {
                    row += col + " ";
                });
                console.log(row);
            });
        }
    }

    EmptyPreviewList() {
        this.listTileNotPreview = this.listTileNotPreview.concat(this.listTilePreview);
        this.listTilePreview = [];
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


