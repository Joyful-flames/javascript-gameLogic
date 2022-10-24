const Plant = require("./Plant")
const Species = require("./TempData/Species.json");

/** This function used to generate a blank matrix with given size. (Not in use)
 *
 * @param {Number} width
 * @param {Number} height
 * @return {any[null][null]} blank matrix
 */
function blankMatrix(width = 1, height = 1,) {
    return Array(height).fill(null).map(item => item = Array(width).fill(null))
}

/** This function used to print Matrix to Console with given matrix.
 *
 * @param {Array} matrix
 * @returns {Promise<void>}
 */
async function printMatrix(matrix) {
    var printString = ""

    for (let i = 0; i < matrix[0].length; i++) {
        printString += "[__" + String(i) + "__]"
    }

    printString += "\n"

    matrix.map(function (row) {
        row.map(function (column) {
            printString += "["
            if (column instanceof Plant.Plant) {
                printString += column.consoleView()
            } else if (column === "MK") {
                printString += "_MK_"
            } else {
                printString += "_____"
            }
            printString += "]"
        })
        printString += " " + matrix.indexOf(row) + "\n"
    })
    console.log(printString)
}


function outputMatrix(matrix) {
    var printString = ""

    for (let i = 0; i < matrix[0].length; i++) {
        printString += "[__" + String(i) + "__]"
    }

    printString += "\n"

    matrix.map(function (row) {
        row.map(function (column) {
            printString += "["
            if (column instanceof Plant.Plant) {
                printString += column.consoleView()
            } else if (column === "MK") {
                printString += "_MK_"
            } else {
                printString += "_____"
            }
            printString += "]"
        })
        printString += " " + matrix.indexOf(row) + "\n"
    })
    return printString
}

/** This function used to place a plant on matrix with given matrix, coordinate and plant specie.
 *
 * @param {Array} matrix
 * @param {Array[Number]} position
 * @param {Plant.Plant}plant
 */
function placePlantOnMatrix(matrix, position, plant) {
    matrix[position[0]][position[1]] = plant
    // console.log("A", plant.name, "place on", xCord, ",", yCord)
}

/** This function is used to get the coordinate within a square based on given radius and board. (Not in used)
 *
 * @param {Array} board
 * @param {Number} centerX
 * @param {Number} centerY
 * @param {Number} radius
 * @return {Array} coordinates
 */
function getSqrCordByCenter(board, centerX, centerY, radius) {

    const xBound = board[0].length
    const yBound = board.length

    const xRange = [centerX - radius, centerX + radius].map(cord => boundaryLimiter(xBound, cord))
    const yRange = [centerY - radius, centerY + radius].map(cord => boundaryLimiter(yBound, cord))
    var cordInRadius = []

    board.map(function (row) {
        var postInBoard = board.indexOf(row)
        if (yRange[1] >= postInBoard && yRange[0] <= postInBoard) {
            for (var postInRow = xRange[0]; postInRow <= xRange[1]; postInRow++) {
                cordInRadius.push([postInRow, postInBoard])
            }
        }
    })
    return cordInRadius
}

/** This function is used to generate a matrix with given coordinates marked.
 *
 * @param {Array} matrix
 * @param {Number} coordinates
 * @return {Promise<void>}
 */
async function matrixMarker(matrix, coordinates) {
    var board = blankMatrix(matrix.length, matrix[0].length)
    coordinates.map(cell => board[cell[1]][cell[0]] = "MK")
    printMatrix(board).then()
}


module.exports = {
    outputMatrix,
    placePlantOnMatrix,
    printMatrix,
    blankMatrix,
    getSqrCordByCenter,
    matrixMarker
}