export function generateMaze(rows, cols, start = [0, 0]){
    const endRow = rows;
    const endCol = cols;
    const mazeArr = [];
    let lastPoint;
    const [startRow, startCol] = start;


    //Generate maze of all walls and start and end points
    for(let r = 0; r < rows; r++){
        const rowArr = [];
        for(let c  = 0; c < cols; c++){
            if(r === startRow && c === startCol){
                rowArr.push('S');
            }else{
                rowArr.push('#');
            }
        }
        mazeArr.push(rowArr);
    }

    function dfs(row, col){
        const directions = [[1,0], [0,1],[-1,0],[0,-1]];
        if(mazeArr !== 'E'){
            mazeArr[row][col] = '_'
            lastPoint = [row, col]
            
        }
        const visitedSet = new Set()
        for (let i = 0; i < 4; i++){
            let randDir = Math.floor((Math.random() * 4))
            while(visitedSet.has(randDir)){
                randDir = Math.floor((Math.random() * 4))
            }
            visitedSet.add(randDir);
            const dr = directions[randDir][0];
            const dc = directions[randDir][1];
            const newRow = row + 2 * dr;
            const newCol = col + 2 * dc;
            if(newRow >= 0 && newCol >= 0 && newRow < endRow && newCol < endCol && mazeArr[newRow][newCol] !== '_'){
                mazeArr[row + dr][col + dc] = '_';
                dfs(newRow, newCol); 
            }
        }
    }


    dfs(startRow, startCol);
    mazeArr[startRow][startCol] = 'S';
    mazeArr[lastPoint[0]][lastPoint[1]] = 'E'
    return mazeArr;
}



