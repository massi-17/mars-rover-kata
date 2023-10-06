//dom
const grid = document.getElementById('grid')
const r = document.querySelector('#r')
const l = document.querySelector('#l')
const f = document.querySelector('#f')
const b = document.querySelector('#b')
const xCoord = document.querySelectorAll('.x-coordinate')
const yCoord = document.querySelectorAll('.y-coordinate')
const degCoord = document.querySelectorAll('.deg-coordinate')
const dirCoord = document.querySelectorAll('.dir-coordinate')
const obstacleCoord = document.querySelector('.obs')
const colonObs = document.querySelector('.colonObs')
const obsBool = document.querySelector('.obsBool')
//var global
const cellsX = 5
const cellsY = 4
const cells = []
const roverIndex = 16
let rover
let roverX = 0
let roverY = 0
let roverDeg = 0
let newX
let newY
let movedRover

const cardinalDirections = {
	N: [0],
	E: [90, -270],
	S: [180, -180],
	W: [-90, 270],
}

function renderGrid(nCellsX, nCellsY) {
	for (let z = nCellsY - 1; z >= 0; z--) {
		for (let i = 0; i < nCellsX; i++) {
			const cell = document.createElement('div')
			cell.dataset.x = i
			cell.dataset.y = z
			cells.push(cell)
			grid.appendChild(cell)
		}
	}
}

function renderObstacles() {
	const obstaclesIndexArray = []
	for (let i = 0; i < 3; i++) {
		let randomObstacleIndex
		for (let i = 0; i < cells.length; i++) {
			randomObstacleIndex = Math.floor(Math.random() * cells.length)
			if (
				randomObstacleIndex !== roverIndex &&
				!obstaclesIndexArray.includes(randomObstacleIndex)
			) {
				break
			}
		}
		obstaclesIndexArray.push(randomObstacleIndex)
		cells[randomObstacleIndex].classList.add('obstacle')
	}
}
function renderRover(position) {
	cells[position].classList.add('rover')
	rover = cells.find((cell) => cell.classList.contains('rover'))
	roverX = rover.dataset.x
	roverY = rover.dataset.y
}

function degreesToDirection(degrees) {
	for (const direction in cardinalDirections) {
		const value = cardinalDirections[direction]
		if (Array.isArray(value) ? value.includes(degrees) : value === degrees) {
			return direction
		}
	}
}
function logRoverCoordinates(obs) {
	let direction = degreesToDirection(roverDeg)
	let coordinates = `${rover.dataset.x}:${rover.dataset.y}:${direction}`
	if (obs) {
		coordinates = `${obs}:${coordinates}`
	}
	console.log(coordinates)
}

function updateRoverCoordinates() {
	const direction = degreesToDirection(roverDeg)
	dirCoord.forEach((spanDir) => (spanDir.textContent = direction))
	xCoord.forEach((spanX) => (spanX.textContent = rover.dataset.x))
	yCoord.forEach((spanY) => (spanY.textContent = rover.dataset.y))
	degCoord.forEach((spanDeg) => (spanDeg.textContent = roverDeg))
}

function moveRover() {
	if (movedRover) {
		rover.classList.remove('rover')
		movedRover.classList.add('rover')
		roverX = newX
		roverY = newY
		rover = movedRover
		rotateRover(0)
	} else {
		console.log('Bordo raggiunto')
	}
}

function rotateRover(degrees) {
	roverDeg = (roverDeg + degrees + 360) % 360
	rover.style.transform = `rotate(${roverDeg}deg)`
	hideObstacle()
}

function findNextForwardCell() {
	newX = parseInt(roverX)
	newY = parseInt(roverY)
	switch (roverDeg) {
		case cardinalDirections['N'][0]:
			newY = (newY + 1) % cellsY
			break
		case cardinalDirections['E'][0]:
		case cardinalDirections['E'][1]:
			newX = (newX + 1) % cellsX
			console.log('right', newX)
			break
		case cardinalDirections['S'][0]:
		case cardinalDirections['S'][1]:
			newY = (newY - 1 + cellsY) % cellsY
			break
		case cardinalDirections['W'][0]:
		case cardinalDirections['W'][1]:
			newX = (newX - 1 + cellsX) % cellsX
			break
	}
	const nextCell = cells.find(
		(cell) => cell.dataset.y == newY && cell.dataset.x == newX
	)
	return nextCell
}

function moveRoverForward() {
	const nextCell = findNextForwardCell()
	if (nextCell.classList.contains('obstacle')) {
		console.log('Rover cannot move forward due to an obstacle.')
		logRoverCoordinates('O')
		updateRoverCoordinates()
		showObstacle()
		return
	}
	hideObstacle()
	movedRover = nextCell
	moveRover()
	logRoverCoordinates()
	updateRoverCoordinates()
}

function findNextBackwardCell() {
	newX = parseInt(roverX)
	newY = parseInt(roverY)
	switch (roverDeg) {
		case cardinalDirections['N'][0]:
			newY = (newY - 1 + cellsY) % cellsY
			break
		case cardinalDirections['E'][0]:
		case cardinalDirections['E'][1]:
			newX = (newX - 1 + cellsX) % cellsX
			break
		case cardinalDirections['S'][0]:
		case cardinalDirections['S'][1]:
			newY = (newY + 1) % cellsY
			break
		case cardinalDirections['W'][0]:
		case cardinalDirections['W'][1]:
			newX = (newX + 1) % cellsX
			break
	}
	const nextCell = cells.find(
		(cell) => cell.dataset.y == newY && cell.dataset.x == newX
	)

	return nextCell
}

function moveRoverBackward() {
	const nextCell = findNextBackwardCell()

	if (nextCell.classList.contains('obstacle')) {
		console.log('Rover cannot move backward due to an obstacle.')
		logRoverCoordinates('O')
		updateRoverCoordinates()
		showObstacle()
		return
	}
	hideObstacle()
	movedRover = nextCell
	moveRover()
	logRoverCoordinates()
	updateRoverCoordinates()
}
function moveRoverLeft() {
	rotateRover(-90)
	logRoverCoordinates()
	updateRoverCoordinates()
}
function moveRoverRight() {
	rotateRover(90)
	logRoverCoordinates()
	updateRoverCoordinates()
}

function showObstacle() {
	obsBool.textContent = 'true'
	obstacleCoord.style.display = 'block'
	colonObs.style.display = 'block'
	obstacleCoord.textContent = 'O'
	colonObs.textContent = ':'
}

function hideObstacle() {
	obsBool.textContent = 'false'
	obstacleCoord.style.display = 'none'
	colonObs.style.display = 'none'
}

renderGrid(cellsX, cellsY)
renderObstacles()
renderRover(roverIndex)

//event listener
r.addEventListener('click', moveRoverRight)
l.addEventListener('click', moveRoverLeft)
f.addEventListener('click', moveRoverForward)
b.addEventListener('click', moveRoverBackward)
