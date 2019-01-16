//  Chaining Promises
//`then()` always returns a promise
// then 每次返回promise
function Promise(fn){
    var state = 'pending';
    var value;
    var deferred = null;

    function resolve(newValue){
        value = newValue;
        state = 'resolved';

        if(deferred){                   //如果存在deferred 则执行handle
            handle(deferred);
        }
    }

    function handle(handler){
        // console.log(state)
        if(state === 'pending'){        // 判断状态，若resolve后于then执行，则先将then的回调函数缓存至deferred  等到resolve执行后 状态改变 再执行then的回调函数onResolved
            deferred = handler;
            return;
        }

        if(!handler.onResolved){
            handler.resolve(value);
            return;
        }

        var ret = handler.onResolved(value);   //执行.then方法里面的回调函数  并将返回值保存至ret
        // console.log(ret)
        handler.resolve(ret);                  //储存返回值  提供给下一个Promise
    }

    this.then = function(onResolved){
        return new Promise(function(resolve){     //这里返回一个新的Promise 实现.then的无限调用
            handle({
                onResolved: onResolved,
                resolve:resolve
            });
        })
    }

    fn(resolve);
}

function doBetter(){
    return new Promise(function(resolve){
        var value = "i'm fine!"
        resolve(value)
    })
}

// doBetter().then(function(a){
//     console.log(a)
//     console.log('aaabbb')
// })

//分析：
//执行顺序：
// doBetter -> Promise -> fn -> resolve -> then  -> new  Promise -> fn -> handle -> handler.onResolved -> handler.resolve


doBetter().then(function(a){
    console.log(a)
}).then(function (b) {
    console.log(b)
}).then(function (c) {
    console.log(c)
})

