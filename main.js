import { mazeMap } from './utils/BFS.js';
import { navigateMaze } from './utils/DFS.js';

const grid = document.getElementById('grid');
const numRows = 15;
const numCols = 30;
const cellSize = 30;

//Creates a 2d Array of all cells
const gridData = []

for (let i = 0; i < numRows; i++) {
    const row = []
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


// iterates through each cell and appends them to the HTML
gridData.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
        tr.appendChild(cell);
    });
    grid.appendChild(tr);
});

//Selecting what cells to place 
const cellTypeDropdown = document.getElementById('cell-type');
let selectedNodeType = cellTypeDropdown.value

cellTypeDropdown.addEventListener('change', function () {
    selectedNodeType = cellTypeDropdown.value;
})

const startCellSet = new Set();
const endCellSet = new Set();

gridData.forEach(row => {
    row.forEach(cell => {

        cell.addEventListener('click', (event) => {
            const target = event.target;
            console.log(target.classList)

            target.classList.remove('wall');
            target.classList.remove('start');
            target.classList.remove('end');

            cell.dataset.isWall = 'false';
            cell.dataset.isStart = 'false';
            cell.dataset.isEnd = 'false';

            if (selectedNodeType === 'wall') {

                target.classList.toggle('wall');
                cell.dataset.isWall = 'true';

            } else if (selectedNodeType === 'start') {

                if (startCellSet.size > 0) {
                    const existingStartCell = startCellSet.values().next().value;
                    existingStartCell.classList.remove('start');
                    existingStartCell.dataset.isStart = 'false';
                }

                target.classList.toggle('start');
                cell.dataset.isStart = 'true';
                startCellSet.clear();
                startCellSet.add(target)


            } else if (selectedNodeType === 'end') {

                if (endCellSet.size > 0) {
                    const existingEndCell = endCellSet.values().next().value;
                    existingEndCell.classList.remove('end');
                    existingEndCell.dataset.isEnd = 'false';
                }

                target.classList.toggle('end');
                cell.dataset.isEnd = 'true';
                endCellSet.clear();
                endCellSet.add(target);

            }

        });
    });
});

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

const devButton = document.getElementById('dev-button');
const searchTypeDropdown = document.getElementById('search-type');
let selectedAlgorithm = searchTypeDropdown.value;
let path, visitedCells;
let mazeSolvable = false; 

searchTypeDropdown.addEventListener('change', function () {
    selectedAlgorithm = searchTypeDropdown.value;
})


devButton.addEventListener('click', () => {
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
                            setTimeout(nextPath, 50); // Adjust the delay (in milliseconds) as needed
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
