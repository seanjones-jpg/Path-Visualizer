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
    const path = [];

    while(stack.length > 0){
        const current = stack.pop();
        const[r, c] = current;
        const pointValue = graph[r][c];
        path.push(current);
        visitedCells.push(current);


        if(graph[r][c] === 'E'){
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
            }
        }
    }

    return -1;
}

console.log(navigateMaze(graph, mazeStart))

