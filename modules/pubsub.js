
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
    return {
        publish,
        subscribe,
    }
}

function testFunc(test){
    console.log(test)
}
