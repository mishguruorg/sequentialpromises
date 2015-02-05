var Q = require('q');

var SequentialPromise = function(functionToWrap){
	if(!functionToWrap)
		throw "need to include a function to wrap as the argument";
	this.functionToWrap = functionToWrap;
	this.queuedFunctions = [];
}

SequentialPromise.prototype.queueCall = function(){
	var self = this;
	var args = arguments;
	self.queuedFunctions.push(function(){
		return self.functionToWrap.apply(this, args)
	});
}

SequentialPromise.prototype.run = function(){
	var self = this;

	var length = self.queuedFunctions.length;

	if(length === 0)
		return Q.resolve();
	
	var current = Q.resolve();
	var results = new Array(length);

	for (var i = 0; i < length; ++i) {
		current = results[i] = current.then(self.queuedFunctions[i]);
	}

	return Q.all(results);
}

module.exports = SequentialPromise;