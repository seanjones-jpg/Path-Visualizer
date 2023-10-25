const graph = [
    ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '#', '#', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', 'S', '#', '_', '_', '_', '_', '_', '_'],
    ['#', '#', '#', '_', '_', '_', '_', '_', '_', '_'],
    ['_', 'E', '_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_']
]

const mazeStart = [3, 2];

export function navigateMaze(graph, start) {
    const visited = new Set();
    const stack = [];
    const visitedCells = [];
    stack.push(start);


    const R = graph.length;
    const C = graph[0].length;
    const startNode = start.toString();
    const parentMap = new Map();
   
    parentMap.set(startNode, null);

    while(stack.length > 0){
        const current = stack.pop();
        const[r, c] = current;
        const pointValue = graph[r][c];
        visitedCells.push(current);


        if(graph[r][c] === 'E'){
            const path = [];
            var node = [r, c].toString();
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

        const currentString = String(current)
        visited.add(currentString);

        const neighbors = [
            [r, c + 1],
            [r, c - 1],
            [r + 1, c],
            [r - 1, c]
        ]

        for (const neighbor of neighbors){
            const [nr, nc] = neighbor;
            const neighborString = String(neighbor);
            if(
                nr >= 0 &&
                nc >= 0 &&
                nr < R &&
                nc < C &&
                graph[nr][nc] !== '#' &&
                !visited.has(neighborString)
            ){
                stack.push(neighbor);
                
                const parentNodeStr = [r, c].toString()
                parentMap.set(neighborString, parentNodeStr);
            }
        }
    }

    return -1;
}

console.log(navigateMaze(graph, mazeStart))

