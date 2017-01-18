'use strict';

var WaitQueue = require('../index');
var wq = new WaitQueue();

// do loop while catch a error
function loop() {
    wq.shift(function (err, item) {
        if (err) {
            return console.error('end loop', err);
        }
        console.log(item);
        setTimeout(loop, 0);
    });
}
setTimeout(loop, 0);

var taskID = 0;
var interval;
// add a task every 1s
interval = setInterval(function () {
    wq.push({
        taskid: taskID++
    });
}, 1000);

// terminate after 10s
setTimeout(function () {
    wq.terminate();
}, 10 * 1000);