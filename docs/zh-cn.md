# wait-queue-es5

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

  一个javascript等待队列，可以让你更有效率的处理无限循环任务或事件触发式任务，这是一个ES5版本，可以在浏览器或低版本的NodeJS中运行。
  这个对象可以在没有数据时等待在那里，直到有数据进入队列再返回。如果使用`Array`对象进行出列操作时，即使没有数据也会马上返回。

## 安装方式

```
$ npm install wait-queue-es5
```

## ES6版本的Wait-Queue

[ES6版本的Wait-Queue](https://github.com/flarestart/wait-queue)

## 性能测试

```
$ npm install    # 首先安装 benchmark 库
$ npm run benchmark  # 运行性能测试
```

这是一份使用Macbook Pro MF839/8GB进行的压力测试样例

    .push() 1k data speed test x 395,760 ops/sec ±29.88% (33 runs sampled)
    .unshift() 1k data speed test x 203,834 ops/sec ±49.09% (25 runs sampled)
    .push() 4k data speed test x 48,703 ops/sec ±38.31% (11 runs sampled)
    .unshift() 4k data speed test x 37,036 ops/sec ±49.09% (11 runs sampled)
    .shift() 106449.58100205069 /s

## 更新日志

### 1.0.3

 * 修复了一个bug, 当调用`empty()`或`terminate()`方法时，应该将`wq.queue`设置为了`LinkList`，实际上却设置为了`Array`

### 1.0.2
 
 * 更新中文文档并修订原来的文档中的一些错误

### 1.0.1

 * 将内部队列存储对象wq.queue，从`Array`（数组）替换为 `LinkList`（链表）, 因为当队列达到千万级别时使用`Array`的`shift()`操作消耗的时间过长了
 * 添加性能测试

## 简单使用例子

```js
'use strict';

var WaitQueue = require('wait-queue-es5');
var wq = new WaitQueue();

// 这里wq队列内还没有数据, 将会等待队列中有数据才会返回
wq.shift(function (err, item) {
    console.log(err, item);
});

// 1秒后添加一个对象到等待队列
setTimeout(function () {
    wq.push('any object');
}, 1000);
```

## 更复杂一点的例子

```js
'use strict';

var WaitQueue = require('wait-queue-es5');
var wq = new WaitQueue();

// 进行一个无限递归循环直到执行wq.terminate()
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
// 这里每秒钟添加一个对象到队列中
interval = setInterval(function () {
    wq.push({
        taskid: taskID++
    });
}, 1000);

// 10秒后调用wq.terminate()方法中止队列
setTimeout(function () {
    wq.terminate();
}, 10 * 1000);

```

## 对象方法

### wq.push(item)

将一个对象添加到队列尾部，返回值为`true`表示对象添加成功，如果调用了`terminate()`, 将会返回false

### wq.shift(function(err, item){...})

从队列头部获取一个对象，参数是一个回调方法，如果队列中没有对象，它会一直等待在这里
`err`总会是`null`，除非调用了`wq.terminate()`，这种情况下，`err`将会是一个`TerminateError`的实例, 你可以使用`err.isTerminateQueue`来判断是否是一个`TerminateError`

### wq.unshift(item)

将一个对象添加到队列头部，返回值为`true`表示对象添加成功，如果调用了`terminate()`, 将会返回false

### wq.pop(function(err, item){...})

从队列尾部获取一个对象，参数与`shift()`方法相同

### wq.terminate()

中止队列，将会清空队列中的数据，如果有`shift()`或`pop()`操作正在等待，它们将会收到一个`TerminateError`的实例。你可以使用`err.isTerminateQueue`来判断是否是一个`TerminateError`

### wq.empty()

清空队列中还没有被`pop()`和`shift()`的数据

## 对象属性

### wq.queue

一个LinkList对象，用于内部存储队列中的对象

### wq.listeners

当队列中没有对象时，用于存储`pop()`和`shift()`的回调方法，不要修改这个对象

### wq.terminated

一直是`false`，除非调用了`terminate()`方法

## 对象事件

这个版本未添加事件支持

## License

  MIT

[npm-image]: https://img.shields.io/npm/v/wait-queue-es5.svg
[npm-url]: https://npmjs.org/package/wait-queue-es5
[downloads-image]: http://img.shields.io/npm/dm/wait-queue-es5.svg
[downloads-url]: https://npmjs.org/package/wait-queue-es5