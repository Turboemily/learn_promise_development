// Promises have State 需要状态支持
function Promise (fn) {
    var state = 'pending';
    var value;
    var deferred;

    function resolve(newValue) {
        value = newValue;
        state = 'resolved';
        console.log(value,deferred)
        if(deferred){
            handler(deferred)
        }
    }

    function handler(onResolved) {
        if(state === 'pending'){
            deferred = onResolved;
            return;
        }

        onResolved(value);
    }

    this.then = function (onResovled) {
        handler(onResovled);
    }

    fn(resolve);
}

function doSomething () {
    return new Promise(function(resolve){
        var value = 42;
        resolve(value);
    })
}

function doSomethingOther () {
    return new Promise(function(resolve){
        var value = 50;
        setTimeout(function(){
            resolve(value);
        },200)
    })
}

//情况一：
//doSomething()
//执行顺序：
//doSomething -> Promise -> fn -> resolve


//情况二：
// var promise = doSomething();
// promise.then(function(){
//     console.log("finished!")
// })
//执行顺序：
//doSomething -> Promise -> fn -> resolve -> then -> handler -> onResolved


//情况三
// var promise = doSomething();
// setTimeout(function () {
//     promise.then(function(){
//         console.log("finished!")
//     })
// },100)
//执行顺序：
//doSomething -> Promise -> fn -> resolve -> setTimeout等待300ms -> then -> handler -> onResolved


// //情况四：
// var promiseother = doSomethingOther();
// promiseother.then(function(){
//     console.log("finished again!")
// })
//执行顺序：
//doSomethingOther -> Promise -> fn -> setTimeout 200ms -> then -> handler -> 200ms后执行 resolve  -> onResolved
//这里解释一下：
//执行至 setTimeout 200ms的时候 resolve方法被挂起 所以先执行then -> 再到handler -> Promise里面的state是pending,所以deferred 被then的回调函数赋值  -> 到了200ms 执行resolve 然后 直接执行deferred(即then里面的回调函数)
//翻译原文：
// 调用者可以在任何时候调用then()，而被调用者可以在任何时候调用resolve()。它完全可以与同步或异步代码一起工作。
// 调用方在被调用方调用resolve()之前调用then()，这意味着没有可以返回的值。
// 在这种情况下，状态将是挂起的，因此我们保留调用者的回调，以便稍后使用。
// 稍后，当resolve()被调用时，我们可以调用回调并发送值。
// 被调用方在调用then()之前调用resolve():在这种情况下，我们保留结果值。一旦调用then()，我们就可以返回值了。


//情况五：
var promise = doSomething();
promise.then(function(){
    console.log("promise finished")
})
promise.then(function(){
    console.log("promise finished again!")
})

var promiseother = doSomethingOther();
promiseother.then(function(){
    console.log("promiseother finished")
})
promiseother.then(function(){
    console.log("promiseother finished again!")
})

// 结果发现  ：promiseother的then 只执行最后一次的回调。
// 原文翻译：
// 对于本文中的promise实现，这并不完全正确。如果发生相反的情况，即调用方在调用resolve()之前多次调用then()，则只执行最后一次调用then()。
// 解决这个问题的方法是在承诺中保留一个连续的延迟列表，而不是一个。为了让文章更简单，我决定不这么做，因为它足够长:)
