import {showBoard} from './view-engine.js'
import {pubSub} from './pubsub.js'

showBoard()

const row = [2, 2,-2,-2, 1,1,-1,-1];
const col = [-1,1, 1,-1,-2,2,-2,2];
const ps = pubSub()

ps.subscribe('knight-move',moveKnightPiece)
ps.subscribe('knight-move',testFunc)
ps.subscribe('choose-dest',findShortest)
ps.subscribe('choose-dest',addFlag)
ps.subscribe('move-completed',removeFlag)

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
    

    while (moveQueue){
        let node = moveQueue.shift();
        console.log({node})
        console.log({moveQueue});

        let x = node.x
        let y = node.y
        let dist = node.dist

        if(x == dest.x && y == dest.y){

            let knightMoves = []
            knightMoves.push([node.x,node.y]);
            function findPath(node){

                if(!node.prevNode){
                    return ps.publish('knight-move',knightMoves);
                }
               
                knightMoves.push([node.prevNode.x,node.prevNode.y])
                findPath(node.prevNode)
                
            }
            findPath(node);

            return dist     
            }

        if(!inArr(visitedNodes,node.x,node.y)){
            visitedNodes.push([node.x,node.y])

        for (let i = 0; i < 8; i ++){
            let x1 = x + row[i];
            let y1 = y + col[i];

            if(testMove(x1,y1)){
                let newNode = Node(x1,y1,node);
                newNode.dist = node.dist +1
                moveQueue.push(newNode)
            }
        }
        }
            
        }

}

function inArr(someArr,nested1,nested2){
    return !!someArr.find(el=>el[0]== nested1 && el[1] == nested2)
}

const wrapper = document.querySelector(".container")

wrapper.addEventListener("click",(e)=>
    handleMove(e)
);

let moveFlag = true

function addFlag(){
    moveFlag = false
}
function removeFlag(){
    moveFlag = true
}



function handleMove(e){
    if(!moveFlag)return;
    console.log(e.target)
    let x = e.target.id.substr(e.target.id.length-2,1)
    let y = e.target.id.substr(e.target.id.length-1,1)
    let dest = [x,y]
    ps.publish('choose-dest',dest)
}

function chooseTest(arg,arg2){
    console.log({arg})
    console.log({arg2})
}

ps.subscribe('choose-test',chooseTest)

function moveKnightPiece(moveArr){

    if(!moveArr.length) return ps.publish('move-completed');
    else {
    const move = moveArr.pop()
        const space = document.querySelector(`#space-${move[0]}${move[1]}`)
        const knight = document.querySelector("#knight")
        space.appendChild(knight);
    return setTimeout(()=>{
        console.log({move})
        moveKnightPiece(moveArr)},
    500)
    }
}

function showPath(moveArr){

    moveArr.forEach((move)=>{

        const space = document.querySelector(`#space-${move[0]}${move[1]}`)
        space.classList.add("pulse")
    });
}

function removePath(){
    const pulseList = document.querySelectorAll(".pulse")
    pulseList.forEach((pulse)=> {
        pulse.classList.remove("pulse")
    }
)}

ps.subscribe("move-completed",removePath)
ps.subscribe("knight-move",showPath)