/*defining the promise type*/
function Promise (fn) {
    var callback = null;
    this.then = function (cb) {
        callback = cb;
    }
    function resolve (value) {
        console.log(value);
        callback(value);
    }
    fn(resolve)            //这里传入函数resolve
}

function doSomething () {
    return new Promise(function(resolve){
        var value = 42;
        resolve(value);    //传入的resolve执行
    })
}



// doSomething();
doSomething().then(function(){
    console.log("promise me !")
})


//Promise类中传入函数fn  fn函数中传入resolve函数   resolve函数执行  最后执行then cb
//但是这里有个问题：按照上面这个顺序执行 会报错，因为callback函数还是null  then方法之后callback才会有值
//所以 这里我们要让then里面的callback 赋值之后再执行 resolve里面的callback方法。

//If you trace through the execution, you’ll see that resolve() gets called before then(), which means callback will be null.原文描述目前的问题
