const g = [
    ['_','_','_','#','_','_','_','_','_','_'],
    ['_','_','_','#','_','_','_','_','_','_'],
    ['_','S','_','_','_','_','_','_','_','_'],
    ['_','_','_','#','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','E','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_'],
    ['_','_','_','_','_','_','_','_','_','_'],
]

//console.log(mazeMap(g, [3 ,1]))
// const arr = [1,2,3];
// const arrStr = arr.toString();
// const newArr = arrStr.split(',');
// const finalArr = []
// for(let i = 0; i < newArr.length; i++){
//     finalArr.push(parseInt(newArr[i]))
// }

// console.log(finalArr, finalArr[0] + finalArr[1])


export function mazeMap(graph, start){5
    const R = graph.length;
    const C = graph[0].length;

    const rowQueue = [];
    const colQueue = [];

    const startRow = start[0];
    const startCol = start[1];

    const parentMap = new Map();
    const startNode = [startRow, startCol]
    startNode.toString();
    parentMap.set(startNode, null);


    let reachedEnd = false;

    //We start with one node so only 1 left in layer,
    //Nodes in next layer will be updated with the search function
    let nodesInNextLayer = 0;
    let nodesLeftInLayer = 1;

    let moveCount = 0;
    let visitedCells = [];
    let visited = [];

    for(let i = 0; i < R; i++){
        const row = [];
        for(let j = 0; j < C; j++){
            const nodeBool = false;
            row.push(nodeBool)
        }
        visited.push(row)
    }
    
    visited[startRow][startCol] = true;
    
    //Add start points to respective Queues: [startRow] & [startCol] 
    rowQueue.push(startRow);
    colQueue.push(startCol);

    while(rowQueue.length > 0){

        //Remove row and col from front of Array, maintain FIFO
        var row = rowQueue.shift()
        var col = colQueue.shift()
        //console.log(graph[row][col])
        if(graph[row][col] === 'E'){
            reachedEnd = true

            const path = [];
            var node = [row, col].toString();
            // path.push(node);
            // node.toString();

            while (parentMap.get(node)){

                const nodeStrArr = node.split(',');
                const pathNode = [];
                for(let i = 0; i < nodeStrArr.length; i++){
                    pathNode.push(parseInt(nodeStrArr[i]))
                }
                path.push(pathNode)

                node = parentMap.get(node)
            }
            path.reverse()
            return {
                path,
                visitedCells
            }
        }

        const dr = [-1, 1, 0, 0];
        const dc = [0, 0, -1, 1];

        if(reachedEnd === false){
            for(let i = 0; i < 4; i++){
                var rr = row + dr[i];
                var cc = col + dc[i];

                if(rr < 0 || cc < 0 || rr >= R || cc >= C){
                    continue;
                }

                if(graph[rr][cc] === '#' || visited[rr][cc] === true){
                    continue;
                }

                rowQueue.push(rr);
                colQueue.push(cc);

                const neighbor = [rr,cc].toString();
                const parentNodeStr = [row, col].toString()
                parentMap.set(neighbor, parentNodeStr);
                const node = [rr, cc];
                visitedCells.push(node);
                visited[rr][cc] = true;
                nodesInNextLayer++;
            }
        }
        nodesLeftInLayer--;
        //console.log(nodesLeftInLayer)
        

        if(nodesLeftInLayer === 0){
            nodesLeftInLayer = nodesInNextLayer;
            nodesInNextLayer = 0;
            moveCount++;
        }
    } 
    return -1;
}