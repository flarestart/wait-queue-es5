/*
 * Javascript WaitQueue Object in ES5
 * https://github.com/flarestart/wait-queue-es5
 */
'use strict';

var LinkList = require('./libs/LinkList');

function TerminateError(message) {
	var error = new Error(message);
	error.name = 'TerminateError';
	error.isTerminateQueue = true;
	return error;
}

function WaitQueue() {
	this.queue = new LinkList();
	this.listeners = [];
	this.terminated = false;
}

WaitQueue.prototype.setImmediate = typeof setImmediate == 'function' ? setImmediate : function (callback) {
	return setTimeout(callback, 0);
};

WaitQueue.prototype._flush = function () {
	var self = this;
	if (this.terminated) {
		while (this.listeners.length > 0) {
			var listener = this.listeners.shift();
			this.setImmediate(function(){
				listener.call(self)
			});
		}
	} else {
		if (this.queue.length > 0 && this.listeners.length > 0) {
			var _listener = this.listeners.shift();
			// delay listener
			_listener.call(this);
			this.setImmediate(function(){
				self._flush.call(self)
			});
		}
	}
};
WaitQueue.prototype.empty = function () {
	this.queue = [];
};
WaitQueue.prototype.unshift = function (item) {
	var success = false;
	if (!this.terminated) {
		success = true;
		var self = this;
		this.setImmediate(function () {
			self.queue.unshift(item);
			self._flush();
		});
	}
	return success;
};
WaitQueue.prototype.push = function (item) {
	var success = false;
	if (!this.terminated) {
		success = true;
		var self = this;
		this.setImmediate(function () {
			self.queue.push(item);
			self._flush();
		});
	}
	return success;
};
WaitQueue.prototype.shift = function (callback) {
	if (this.queue.length > 0) {
		if (this.terminated) {
			return callback(new TerminateError('WaitQueue Terminate'), null);
		}
		return callback(null, this.queue.shift());
	} else {
		var self = this;
		this.listeners.push(function () {
			if (self.terminated) {
				return callback(new TerminateError('WaitQueue Terminate'), null);
			}
			return callback(null, self.queue.shift());
		});
	}
};
WaitQueue.prototype.pop = function (callback) {
	if (this.queue.length > 0) {
		if (this.terminated) {
			return callback(new TerminateError('WaitQueue Terminate'), null);
		}
		return callback(null, this.queue.pop());
	} else {
		var self = this;
		this.listeners.push(function () {
			if (self.terminated) {
				return callback(new TerminateError('WaitQueue Terminate'), null);
			}
			return callback(null, self.queue.pop());
		});
	}
};
WaitQueue.prototype.terminate = function () {
	this.terminated = true;
	this.queue = [];
	this._flush();
};
module.exports = WaitQueue;