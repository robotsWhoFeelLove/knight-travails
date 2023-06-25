import {showBoard,moveKnightPiece} from './view-engine.js'
import {pubSub} from './pubsub.js'

// const ps = pubSub()
showBoard()

const row = [2, 2,-2,-2, 1,1,-1,-1];
const col = [-1,1, 1,-1,-2,2,-2,-2];

const ps = pubSub()

ps.subscribe('knight-move',moveKnightPiece)

ps.subscribe('knight-move',testFunc)

ps.subscribe('choose-dest',findShortest)

function testFunc(test){
    console.log(test)
}


function testMove(x,y,n=8){
    return x >= 0 && x < n && y >= 0 && y < n
}

const Node = function (x,y,prevNode=null,dist = 0){
    x = x,
    y = y,
    dist = dist
    prevNode = prevNode
    // console.log(x + y + dist)
    return{
        x,
        y,
        dist,
        prevNode
    }

}

function findShortest(destNode,n=8){
    
    const srcSpace = document.querySelector('#knight').parentElement
    console.log({srcSpace})
    let a = Number(srcSpace.id.substr(srcSpace.id.length-2,1))
    let b = Number(srcSpace.id.substr(srcSpace.id.length-1,1))


   const src = Node(a,b)
   console.log({src})
   const dest = Node(destNode[0],destNode[1])
   console.log({dest})
    let visitedNodes = []
    let moveQueue = []
    moveQueue.push(src)
    
    // console.log(moveQueue);

    while (moveQueue){
        let node = moveQueue.shift();
        console.log({node})
        console.log({moveQueue});

       let x = node.x
        let y = node.y
        let dist = node.dist

        if(x == dest.x && y == dest.y){
            // console.log(`${dist}`)
            let knightMoves = []
            knightMoves.push([node.x,node.y]);
            function findPath(node){
                if(!node.prevNode){
                    // console.log({knightMoves});
                    return ps.publish('knight-move',knightMoves);}
                knightMoves.push([node.prevNode.x,node.prevNode.y])
                // console.log (knightMoves)
                findPath(node.prevNode)
                
            }
            findPath(node);

            return dist
                   
            }

        if(!inArr(visitedNodes,node.x,node.y)){
            visitedNodes.push([node.x,node.y])
            // console.log({visitedNodes})
        for (let i = 0; i < 8; i ++){
            let x1 = x + row[i];
            let y1 = y + col[i];
            // console.log({x1},{y1})
            if(testMove(x1,y1)){
                let newNode = Node(x1,y1,node);
                newNode.dist = node.dist +1
                moveQueue.push(newNode)
            }
        }
        }
            
        }

}

// let src = Node(0,0);
// let dest = Node(4,7);
// findShortest([0,0],[5,6])

let someArr = [[1,2],[2,4],[5,6]];
function inArr(someArr,nested1,nested2){
    return !!someArr.find(el=>el[0]== nested1 && el[1] == nested2)
}
// console.log(inArr(someArr,2,4))

document.querySelector(".container").addEventListener("click",(e)=>{
    // console.log(e.target);
    handleMove(e)

});

function handleMove(e){
    console.log(e.target)
    let x = e.target.id.substr(e.target.id.length-2,1)
    let y = e.target.id.substr(e.target.id.length-1,1)
    let dest = [x,y]
    // const srcSpace = document.querySelector('#knight').parentElement
    // console.log({srcSpace})
    // let a = srcSpace.id.substr(srcSpace.id.length-2,1)
    // let b = srcSpace.id.substr(srcSpace.id.length-1,1)
    // console.log(a);
    // console.log(b);
    // let src = (a,b)
    ps.publish('choose-dest',dest)
}

function chooseTest(arg,arg2){
    console.log({arg})
    console.log({arg2})
}

ps.subscribe('choose-test',chooseTest)