const Board = require("./Board")

const growthSpeedModifier = 1

class Plant {
    function

    /** the class constructor
     *
     * @param coordinate
     * @param {JSON} plantSpecie
     * @param {Number} stage
     * @param {Number} percentage
     */
    constructor(coordinate, plantSpecie, stage = 0, percentage = 0) {

        // basic stats
        this.coordinate = coordinate
        this.xCord = coordinate[1]
        this.yCord = coordinate[0]
        this.plantSpecie = plantSpecie
        this.stage = stage
        this.percentage = percentage
        this.witheredCounter = 0

        // specie property
        this.specieProperty = this.plantSpecie["property"]
        this.tier = this.specieProperty["tier"]
        this.matureStage = this.specieProperty["matureStage"]
        this.maturePercentage = this.specieProperty["maturePercentage"]
        this.growthRate = this.specieProperty["growthRate"]
        this.crowedRange = this.specieProperty["crowedRange"]
        this.crowedRate = this.specieProperty["crowedRate"]
        this.spreadRange = this.specieProperty["spreadRange"]
        this.waterConsume = this.specieProperty["waterConsume"]
        this.sutableLand = this.plantSpecie["conditions"]["terrainID"]
        this.sutableTemp = this.plantSpecie["conditions"]["temp"]

        // specie info
        this.name = plantSpecie.info.name

    }

    /** This method used to add growth stats of a plant based on given cycle number.
     *
     * @param {Object} minMaxTemp
     * @param landType
     * @param {Number} cycle
     */
    grow(minMaxTemp, landType, cycle = 1) {

        var landFactor = 1
        var tempFactor = 1
        if (minMaxTemp.minTemp > this.sutableTemp["suitableLowTemp"] && minMaxTemp.maxTemp < this.sutableTemp["suitableHighTemp"]) {
            tempFactor += 0.25
        } else if (minMaxTemp.minTemp < this.sutableTemp["minTemp"] && minMaxTemp.maxTemp > this.sutableTemp["maxTemp"]) {
            this.percentage -= this.growthRate
        } else {
            this.percentage -= this.growthRate * 0.5
        }

        if (!this.sutableLand.includes(landType)) {
            this.percentage -= this.growthRate
        }

        this.percentage += this.growthRate * growthSpeedModifier * landFactor * tempFactor * cycle

        if (this.percentage > 99) {
            if (this.stage < this.tier) {
                this.stage += 1
                this.percentage = 0
            } else {
                this.percentage = 99
            }
        } else if (this.percentage < 0) {
            if (this.stage > 0) {
                this.stage -= 1
            } else {
                matrix[this.yCord][this.xCord] = null // remove it self
            }
        }
    }


    /** This method used to get the overall stats of given coordinates.
     *
     * @param {Array} matrix
     * @param {Array} coordinates
     * @param {Number} tier
     * @return {{nullPos: *[], highTierPos: *[], sameTierPos: *[], lowTierPos: *[]}}
     */
    rangeStats(matrix, coordinates, tier = this.tier) {

        var nullPos = []
        var lowTierPos = []
        var sameTierPos = []
        var highTierPos = []

        coordinates.map(function (coordinate) {
            var cell = matrix[coordinate[0]][coordinate[1]]
            if (cell instanceof Plant) {
                if (cell.tier > tier) {
                    highTierPos.push(coordinate)
                } else if (cell.tier === tier) {
                    sameTierPos.push(coordinate)
                } else {
                    lowTierPos.push(coordinate)
                }
            } else {
                nullPos.push(coordinate)
            }
        })
        return {nullPos, lowTierPos, sameTierPos, highTierPos}
    }

    /** This method used to determent whether the plant is over crowed in is crowed range
     *  based on given crowed range stats and cell count in range.
     *
     * @param {Object} crowedRangeStats
     * @param {Number} crowedRangePosLen
     * @return {boolean} is plant crowed
     */
    isCrowed(crowedRangeStats, crowedRangePosLen) {
        return (crowedRangeStats["sameTierPos"].length / crowedRangePosLen) > this.crowedRate
    }

    /** This method used to determent whether the plant is mature for spreading seeds
     *  based on current Plant's stage and grow percentage.
     *
     * @return {boolean} is plant ready to spread
     */
    isMature() {
        return this.stage >= this.matureStage && this.percentage >= this.maturePercentage
    }

    /** This method used to spread current plant to nearby coordinates
     *  based on given matrix(map), array of spreadable coordinates and current Plant's specie data.
     *
     * @param {Array[Array]} matrix
     * @param {Array} spreadCords
     * @param {Number} spreadChance
     */
    multiSpread(matrix, spreadCords, spreadChance = 0.3) {

        const newPlantSpecie = this.plantSpecie
        var newSpreadCords = []

        const self_pos = this.coordinate
        var chance

        spreadCords.map(function (cord) {
            chance = Math.random()
            if (chance < 0.3 && cord !== self_pos) {
                newSpreadCords.push(cord)
            }
        })

        if (newSpreadCords.length !== 0) {
            this.percentage = 0
            // console.log(this.name, "at", this.coordinate, "spread to:", newSpreadCords)
            // console.log("Within Cords:", spreadCords)
        }

        newSpreadCords.map(function (cord) {
            matrix[cord[1]][cord[0]] = new Plant(cord, newPlantSpecie)
        })

        return matrix
    }

    /** This method used to spread current plant to a nearby coordinate
     *  based on given matrix(map), array of spreadable coordinates and current Plant's specie data.
     *
     * @param {Array[Array]} matrix
     * @param {Array} spreadCords
     * @param {Number} spreadChance
     */

    singleSpread(matrix, spreadCords, spreadChance = 0.3) {
        const newPlantSpecie = this.plantSpecie
        const newPlantCords = spreadCords[Math.floor(Math.random() * spreadCords.length)]
        if (Math.random() < spreadChance) {
            this.percentage = 0
            matrix[newPlantCords[1]][newPlantCords[0]] = new Plant(newPlantCords, newPlantSpecie)
        }
        return matrix
    }

    /** This method used to return current Plants information for print in console.
     *
     * @return {string}
     */
    consoleView() {
        var returnString = this.name[0] + String(this.stage)
        if (this.percentage > 9) {
            returnString += String(this.percentage)
        } else {
            returnString += "0" + String(this.percentage)
        }

        if (this.crowed) {
            returnString += "C"
        } else {
            returnString += "_"
        }
        return returnString
    }

    /** This method use to get the coordinates within a circle based on given radius and board.
     *
     * @param {Array} matrix
     * @param {Number} centerX
     * @param {Number} centerY
     * @param {Number} radius
     * @return {Array} coordinates
     */
    getCircleCordByCenter(matrix, radius, centerX = this.xCord, centerY = this.yCord) {

        /** This function used to limit the input number's max and min value based on given boundary.
         *
         * @param {Number} boundary
         * @param {Number} num
         * @return {number|*}
         */
        function boundaryLimiter(boundary, num) {
            if (num > boundary) {
                return boundary
            } else if (num < 0) {
                return 0
            } else {
                return num
            }
        }

        const xRange = [centerX - radius, centerX + radius].map(cord => boundaryLimiter(matrix[0].length - 1, cord))
        const yRange = [centerY - radius, centerY + radius].map(cord => boundaryLimiter(matrix.length - 1, cord))

        var cordInRadius = []

        // map evey cell in matrix
        matrix.map(function (row) {
            var postInBoard = matrix.indexOf(row)
            if (yRange[1] >= postInBoard && yRange[0] <= postInBoard) {
                for (var postInRow = xRange[0]; postInRow <= xRange[1]; postInRow++) {
                    // Get the distance from center to current position,
                    // push coordinates if the distance is smaller than radius.
                    if (Math.hypot(Math.abs(postInRow - centerX), Math.abs(postInBoard - centerY)) <= radius) {
                        cordInRadius.push([postInRow, postInBoard])
                    }
                }
            }
        })
        return cordInRadius

    }

    getBioMass() {
        return this.tier * 1000 + this.stage * 100 + this.percentage
    }

    /** This method used to execute sequential components within a logic frame. Return with new matrix
     *
     * @param {Array} _plantMatrix
     * @param landType
     * @param {boolean} logMode
     * @param minMaxTemp
     * @return {Array} matrix
     */
    frameLogic(_plantMatrix, landType, minMaxTemp, logMode = false) {
        // grow plant
        this.grow(minMaxTemp, landType)

        // get coordinates in crowed range and extract stats
        const crowedRangePos = this.getCircleCordByCenter(_plantMatrix, this.crowedRange) // List
        const crowedRangeStats = this.rangeStats(_plantMatrix, crowedRangePos) //

        let spreadRangePos
        let spreadRangeStats

        // determine plant mature and crowed stats
        this.mature = this.isMature()
        this.crowed = this.isCrowed(crowedRangeStats, crowedRangePos.length)

        if (this.crowed || (this.percentage <= 0 && this.stage <= 0)) {
            this.witheredCounter ++
        } else if (this.mature) {
            // check if crowed range is same as spread range, use simplified actions if there are same
            if (this.crowedRange === this.spreadRange) {
                spreadRangePos = crowedRangePos
                spreadRangeStats = crowedRangeStats
            } else {
                spreadRangePos = this.getCircleCordByCenter(_plantMatrix, this.spreadRange)
                spreadRangeStats = this.rangeStats(_plantMatrix, spreadRangePos)
            }
            const availablePos = spreadRangeStats["nullPos"].concat(spreadRangeStats["lowTierPos"])

            return this.multiSpread(_plantMatrix, availablePos)
        } else {
            this.witheredCounter = 0
        }

        return _plantMatrix
    }
}

module.exports = {Plant}