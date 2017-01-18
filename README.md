# wait-queue-es5

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

  A javascript wait queue object handle infinity loop tasks more efficiently (ES5), can run in lower version of Node.js or browsers

## Installation

```
$ npm install wait-queue-es5
```

## ES6 NodeJS version

[ES6 version for NodeJS](https://github.com/flarestart/wait-queue)
## Simple Example

```js
'use strict';

var WaitQueue = require('wait-queue-es5');
var wq = new WaitQueue();

// there's no task here 
wq.shift(function (err, item) {
    console.log(err, item);
});

// task will add after 1s
setTimeout(function () {
    wq.push('any object');
}, 1000);
```

## Example(More Complex)

```js
'use strict';

var WaitQueue = require('wait-queue-es5');
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

```

## Methods

### wq.push(item)

Add an item to the end of the queue, will return true if item added to the queue,
if wait-queue is terminated, it will return false

### wq.shift(function(item){...})

Get an item at the front of the queue, this is a callback method, if there's no item
in the queue, it will wait

### wq.unshift(item)

Put an item in front of the queue, will return true if item added to the queue,
if wait-queue is terminated, it will return false

### wq.pop(function(item){...})

Got an item at the end of the queue, this is a callback method, if there's no item
in the queue, it will wait

### wq.terminate()

Teminate the queue, and if there's any `shift()` or `pop()` waited, every method
will receive a TerminateError, you can use e.isTerminateQueue to check

### wq.empty()

Clear the queue that haven't assign

## Properties

### wq.queue

A plain javascript array, used to store the queue items

### wq.listeners

If no elements in queue yet, listener will add here, Don't modify it

### wq.terminated

Always be false, until `terminate()` is called

## Events

This version has no event

## License

  MIT

[npm-image]: https://img.shields.io/npm/v/wait-queue.svg
[npm-url]: https://npmjs.org/package/wait-queue
[downloads-image]: http://img.shields.io/npm/dm/wait-queue.svg
[downloads-url]: https://npmjs.org/package/wait-queue