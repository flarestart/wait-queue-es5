# wait-queue-es5

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

[中文文档](https://github.com/flarestart/wait-queue-es5/blob/master/docs/zh-cn.md)

  A javascript wait queue object handle infinity loop tasks more efficiently (ES5), can run in lower version of Node.js or browsers

## Installation

```
$ npm install wait-queue-es5
```

## ES6 NodeJS version

[ES6 version for NodeJS](https://github.com/flarestart/wait-queue)

## Benchmark

```
$ npm run benchmark
```

Sample data in Macbook Pro MF839/8GB

    .push() 1k data speed test x 395,760 ops/sec ±29.88% (33 runs sampled)
    .unshift() 1k data speed test x 203,834 ops/sec ±49.09% (25 runs sampled)
    .push() 4k data speed test x 48,703 ops/sec ±38.31% (11 runs sampled)
    .unshift() 4k data speed test x 37,036 ops/sec ±49.09% (11 runs sampled)
    .shift() 106449.58100205069 /s

## Changes Log

### 1.0.2
 
 * Add a chinese document, and fix some problem in docs

### 1.0.1

 * Replace wq.queue from `Array` to `LinkList`, because do shift() operation on `Array` of 10,000,000 item cost too many time
 * Add Benchmark

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

### wq.shift(function(err, item){...})

Get an item at the front of the queue, this is a callback method, if there's no item
in the queue, it will wait

`err` will always be `null` unless `wq.terminate()` is called, in this case, `err` will be an instance of `TerminateError`
you can use `err.isTerminateQueue` to check if is a TerminateError

### wq.unshift(item)

Put an item in front of the queue, will return true if item added to the queue,
if wait-queue is terminated, it will return false

### wq.pop(function(err, item){...})

Got an item at the end of the queue, this is a callback method, if there's no item
in the queue, it will wait

`err` will always be `null` unless `wq.terminate()` is called, in this case, `err` will be an instance of `TerminateError`
you can use `err.isTerminateQueue` to check if is a TerminateError

### wq.terminate()

Teminate the queue, and if there's any `shift()` or `pop()` waited, every method
will receive a TerminateError, you can use e.isTerminateQueue to check

### wq.empty()

Clear the queue that haven't `pop()` or `shift()`

## Properties

### wq.queue

A LinkList object, used to store the queue items

### wq.listeners

If no elements in queue yet, listener will add here, Don't modify it

### wq.terminated

Always be false, until `terminate()` is called

## Events

This version has no event

## License

  MIT

[npm-image]: https://img.shields.io/npm/v/wait-queue-es5.svg
[npm-url]: https://npmjs.org/package/wait-queue-es5
[downloads-image]: http://img.shields.io/npm/dm/wait-queue-es5.svg
[downloads-url]: https://npmjs.org/package/wait-queue-es5