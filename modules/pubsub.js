import {inArr} from './index.js'

 export function pubSub() {
    const subscribers = {};

    function publish(eventName, data,...args) {
        if(!Array.isArray(subscribers[eventName])) {
            return
        }
        subscribers[eventName].forEach((callback) => {
            callback(data,...args)
        })
    }

    function subscribe(eventName, callback) {
        if (!Array.isArray(subscribers[eventName])) {
           subscribers[eventName] = []
        }
        subscribers[eventName].push(callback)
    }

    function unsubscribe(eventName,callback){
        if (Array.isArray(subscribers[eventName])) {
        const callbackIndex = subscribers[eventName].indexOf(callback);
        subscribers[eventName].splice(callbackIndex,1)
        } 
    }

    function show(){
        console.log({subscribers})
    }

    return {
        publish,
        subscribe,
        unsubscribe,
        show
    }
}

function testFunc(test){
    console.log(test)
}
