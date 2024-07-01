import { mazeMap } from './utils/BFS.js';
import { navigateMaze } from './utils/DFS.js';
import { generateMaze } from './utils/generateMaze.js';

const grid = document.getElementById('grid');

const gridData = []
let size;

const gridSizeDropdown = document.getElementById('grid-size');
let selectedSize = gridSizeDropdown.value;
let numRows;
let numCols;

document.addEventListener('DOMContentLoaded', function(){
    createGrid(10);
})

gridSizeDropdown.addEventListener('change', function () {
    selectedSize = gridSizeDropdown.value;
    switch (selectedSize){
        case 'small':
            size = 10;
            break;
        case 'medium':
            size = 50;
            break;
        case 'large':
            size = 100;
            break;
    }
    clearGrid();
    createGrid(size);
})

function clearGrid() {
    console.log('clearing grid')
    if(grid) {
        grid.innerHTML = '';
        gridData.length = 0;
    }
}

function createGrid(size){
    //Creates a 2d Array of all cells
    clearGrid()
    console.log("creating grid")
    numRows = size;
    numCols = 2 * size;
    const cellSize = Math.max(450/numRows, 10);

    for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement('td')
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.dataset.isWall = false;
            cell.dataset.isStart = false;
            cell.dataset.isEnd = false;
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            row.push(cell)
        }
        gridData.push(row)
    }
    console.log(gridData)

    // iterates through each cell and appends them to the HTML
    gridData.forEach((row) => {
        const tr = document.createElement('tr');
        row.forEach((cell) => {
            tr.appendChild(cell);
        });
        grid.appendChild(tr);
    });

    
    addClickEventListeners();
}

addClickEventListeners();

//Selecting what cells to place 
const cellTypeDropdown = document.getElementById('cell-type');
let selectedNodeType = cellTypeDropdown.value

cellTypeDropdown.addEventListener('change', function () {
    selectedNodeType = cellTypeDropdown.value;
})

const startCellSet = new Set();
const endCellSet = new Set();


function addClickEventListeners() {
    gridData.forEach(row => {
        row.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    });
}

function handleCellClick(event) {
    const cell = event.target;
    
    // Remove all classes and reset data attributes
    cell.classList.remove('wall', 'start', 'end');
    cell.dataset.isWall = 'false';
    cell.dataset.isStart = 'false';
    cell.dataset.isEnd = 'false';

    // Handle different node types
    switch (selectedNodeType) {
        case 'wall':
            cell.classList.add('wall');
            cell.dataset.isWall = 'true';
            break;
        case 'start':
            updateCellSet(startCellSet, cell, 'start');
            break;
        case 'end':
            updateCellSet(endCellSet, cell, 'end');
            break;
    }
}

function updateCellSet(cellSet, newCell, className) {
    if (cellSet.size > 0) {
        const existingCell = cellSet.values().next().value;
        existingCell.classList.remove(className);
        existingCell.dataset[`is${className.charAt(0).toUpperCase() + className.slice(1)}`] = 'false';
    }
    newCell.classList.add(className);
    newCell.dataset[`is${className.charAt(0).toUpperCase() + className.slice(1)}`] = 'true';
    cellSet.clear();
    cellSet.add(newCell);
}

function generateMap(gridData) {
    const mapArray = [];
    let startPoint = null

    for (let i = 0; i < numRows; i++) {
        const mapArrayRow = []
        for (let j = 0; j < numCols; j++) {
            if (gridData[i][j].dataset.isWall === 'true') {
                mapArrayRow.push('#')
            } else if (gridData[i][j].dataset.isStart === 'true') {
                mapArrayRow.push('S')
                startPoint = [i, j]
            } else if (gridData[i][j].dataset.isEnd === 'true') {
                mapArrayRow.push('E')
            } else {
                mapArrayRow.push('_')
            }
        }
        mapArray.push(mapArrayRow)
    }

    return { mapArray, startPoint }
}

const solveMazeButton = document.getElementById('solve-maze-button');
const searchTypeDropdown = document.getElementById('search-type');
const generateMazeButton = document.getElementById('generate-maze');

let selectedAlgorithm = searchTypeDropdown.value;
let path, visitedCells;
let mazeSolvable = false; 

searchTypeDropdown.addEventListener('change', function () {
    selectedAlgorithm = searchTypeDropdown.value;
})

generateMazeButton.addEventListener('click', ()=>{
    
    gridData.forEach((row) => {
        row.forEach((cell) => {
            cell.classList.remove('wall', 'start', 'end', 'visited', 'path');
            cell.dataset.isWall = 'false';
            cell.dataset.isStart = 'false';
            cell.dataset.isEnd = 'false';
            cell.classList.remove('visited');
            cell.classList.remove('path');

        });
    });

    const generatedMaze = generateMaze(numRows, numCols)

    function setCellToWall(row, col) {
        const cell = gridData[row][col];
        cell.dataset.isWall = true;
        cell.classList.add('wall');
    }

    const R = generatedMaze.length;
    const C = generatedMaze[0].length;
    for(let i = 0; i < R; i++){
        for(let j = 0; j < C; j ++){
            if(generatedMaze[i][j] === '#'){
                setCellToWall(i, j)
            }
        }
    }

    let startCell = gridData[0][0]
    startCell.dataset.isStart = true;
    startCellSet.clear();
    startCell.classList.add('start');
    startCellSet.add(startCell);

    let endCell = gridData[R-2][C-2]
    endCell.dataset.isEnd = true;
    endCell.classList.add('end');
    endCellSet.clear();
    endCellSet.add(endCell);
    console.log(endCellSet.size);

})

solveMazeButton.addEventListener('click', () => {
    if(endCellSet.size < 1 || startCellSet.size < 1){
        alert("Please Select a Start and End Point")
        return;
    }
    solveMazeButton.disabled = true;
    generateMazeButton.disabled = true;
    resetButton.disabled = true;

    console.log(selectedAlgorithm)
    const { mapArray, startPoint } = generateMap(gridData)

    if (selectedAlgorithm === 'BFS') {
        const result = mazeMap(mapArray, startPoint);
        if(result == -1){
            mazeSolvable = false;
            alert('Maze not solvable')
        }else{
            path = result.path || [];
            visitedCells = result.visitedCells || [];
            mazeSolvable = true;
        }

    } else if(selectedAlgorithm === 'DFS'){
        console.log(mapArray)
        const result = navigateMaze(mapArray, startPoint);

        if (result == -1){
            mazeSolvable = false;
            alert('Maze not solvable');
            
        }else{
            path = result.path || [];
            visitedCells = result.visitedCells || [];
            mazeSolvable = true;
        }
    }

        function highlightCellPath(row, col) {
            const cell = gridData[row][col];
            cell.classList.remove('visited');
            cell.classList.add('path');
        }


        function highlightCellVisited(row, col) {
            const cell = gridData[row][col];
            cell.classList.add('visited');
        }

        if(mazeSolvable){
            function highlightVisited() {
                return new Promise((resolve) => {
                    const visitedCellsCopy = visitedCells.slice();
                    function nextVisited() {
                        if (visitedCellsCopy.length > 0) {
                            const [row, col] = visitedCellsCopy.shift();
                            highlightCellVisited(row, col);
                            setTimeout(nextVisited, 10);
                        } else {
                            resolve();
                        }
                    }
                    nextVisited();
                });
            }

            function highlightPath() {
                return new Promise((resolve) => {
                    const pathCopy = path.slice();
                    function nextPath() {
                        if (pathCopy.length > 0) {
                            const [row, col] = pathCopy.shift();
                            highlightCellPath(row, col);
                            setTimeout(nextPath, 25); // Adjust the delay (in milliseconds) as needed
                        } else {
                            resolve();
                        }
                    }
                    nextPath();
                });
            }

            highlightVisited()
                .then(() => {
                    return highlightPath()
                })
                .then(() => {
                    solveMazeButton.disabled = false;
                    generateMazeButton.disabled = false;
                    resetButton.disabled = false;
                });
        }

        
        

})



const resetButton = document.getElementById('reset-search')
resetButton.addEventListener('click', () => {
    gridData.forEach((row) => {
        row.forEach((cell) => {
            cell.classList.remove('path');
            cell.classList.remove('visited')

        });
    });
});
