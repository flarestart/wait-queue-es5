'use strict'
const WaitQueue = require('../index')
const wq = new WaitQueue

// there's no task here 
wq.shift(function(err, item){
    console.log(err, item)
})

// task will add after 1s
setTimeout(function(){
    wq.push('any object')
}, 1000)