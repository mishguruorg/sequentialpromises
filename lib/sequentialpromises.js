var Q = require('q')

/**
 *
 * @param functionToWrap
 * @constructor
 */
var SequentialPromise = function (functionToWrap) {
  if (!functionToWrap) {
    throw new Error('need to include a function to wrap as the argument')
  }
  this.functionToWrap = functionToWrap
  this.queuedFunctions = []
}

/**
 *
 */
SequentialPromise.prototype.queue = function () {
  var self = this
  var args = arguments
  self.queuedFunctions.push(function () {
    return self.functionToWrap.apply(this, args)
  })
}

/**
 *
 * @param allSettled
 * @returns {*}
 */
SequentialPromise.prototype.run = function (allSettled) {
  var self = this

  var length = self.queuedFunctions.length

  if (length === 0) {
    return Q.resolve()
  }

  var current = Q.resolve()
  var results = new Array(length)

  for (var i = 0; i < length; ++i) {
    current = current.then(self.queuedFunctions[i])

    results[i] = current
  }

  if (allSettled) {
    return Q.allSettled(results)
  } else {
    return Q.all(results)
  }
}

module.exports = SequentialPromise
