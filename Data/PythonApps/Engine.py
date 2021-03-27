import json
import sys
import random
import chess


x = '{ "name":"John", "age":30, "city":"New York"}'


fen = sys.argv[1]

board = chess.Board(fen)

print(board.legal_moves)

#listPieceDepart = []

#for piece in listPos:
#	index = listPos.index(piece)
#	listPieceDepart.append([piece["posD"], index])     

#rn = random.randint(0, len(listPieceDepart) - 1 )


#chosenPiece = listPos[listPieceDepart[rn][1]]

#rn1 = random.randint(0, len(chosenPiece["listPosA"]) - 1 )

#chosenTarget = chosenPiece["listPosA"][rn1];

#print(chosenPiece['posD'])
#print(chosenTarget)

#print('{ "posD" :  %s , "posA" : %s }' % (chosenPiece['posD'], chosenTarget))

#print(listPieceDepart)
#print(my_dict["listPos"])
#print('{ "posD" : [6,3], "posA" : [4,3]}')
#parameter = {posD:[6,3], posA:[4,3]}
#print(my_dict[state])

