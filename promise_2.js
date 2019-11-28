/*defining the promise type*/
function Promise (fn) {
    var callback = null;
    this.then = function (cb) {
        callback = cb;
        console.log(new Date().getTime());
    }
    function resolve (value) {
        console.log(new Date().getTime()+"ddddddddddd");
        setTimeout(function() {
            callback(value);
            console.log(new Date().getTime());
        },5000)
    }
    fn(resolve)            //这里传入函数resolve
}

function doSomething () {
    return new Promise(function(resolve){
        var value = 42;
        resolve(value);    //传入的resolve执行
    })
}

console.log("进行了test")
console.log("dev进行了test等等")

//情况一：
// doSomething().then(function(){
//     console.log("promise me !")
// })
//现在的执行顺序很明朗：
// doSomething -> Promise -> fn -> resolve -> then -> resolve里面的callback

//情况二：
// var promise = doSomething();
// setTimeout(function () {
//     promise.then(function(){
//         console.log("promise me !");
//     })
// },300)

//现在的执行顺序：
//doSomething -> Promise -> fn -> resolve ->setTimeout(5000ms) 之后执行callback  ->setTimeout(300ms)之后执行 promise.then ->300ms到了执行promise.then -> 5000ms到了执行resolve里面的callback

//上面的执行好像没有什么问题 结果也是按照预期的。
//下面再来看一个情况

//情况三：
var promise = doSomething();
setTimeout(function(){
    promise.then(function(){
        console.log("promise me !")
    })
},6000)

//现在的执行顺序：
//oSomething -> Promise -> fn -> resolve ->setTimeout(5000ms) 之后执行callback  ->setTimeout(6000ms)之后执行 promise.then -> 5000ms到了执行resolve里面的callback，但是这里报错了！！！
//you’ll see an error about the callback not being a function,  此时callback还是null 只有promise.then回调执行之后callback才有值。promise,then执行应该早于resovle中的setTimeout的回调方法。


