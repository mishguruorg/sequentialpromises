var SeqProm = require('../lib/sequentialpromises.js'),
  describe = global.describe,
  expect = require('chai').expect,
  it = global.it,
  beforeEach = global.beforeEach,
  Q = require('q')

describe('When queuing a function', function () {
  var seqprom

  function wrapMe () {
    return Q.resolve()
  }

  beforeEach(function () {
    seqprom = new SeqProm(wrapMe)
  })

  it('should wrap the original function passed into the object', function () {
    seqprom.queue()
    expect(seqprom.queuedFunctions.length).equal(1)
  })
})

describe('When queueing a series of functions', function () {
  this.timeout(2000)

  var seqprom

  function wrapMe (arg1, arg2) {
    var deferred = Q.defer()

    setTimeout(function () {
      if (!arg1 || !arg2) {
        deferred.reject(new Error('this is an error'))
        return
      }

      deferred.resolve(arg1 + arg2)
    }, 200)

    return deferred.promise
  }

  beforeEach(function () {
    seqprom = new SeqProm(wrapMe)
  })

  it('should run each function in order', function (done) {
    seqprom.queue(1, 2)
    seqprom.queue(2, 2)
    seqprom.queue(3, 2)
    seqprom.queue(4, 2)

    seqprom.run()
      .then(function (results) {
        expect(results[0]).equal(3)
        expect(results[1]).equal(4)
        expect(results[2]).equal(5)
        expect(results[3]).equal(6)
        done()
      })
      .catch(done)
  })

  it('should fail if any function fails', function (done) {
    seqprom.queue(1, 2)
    seqprom.queue(2, 2)
    seqprom.queue()
    seqprom.queue(4, 2)

    seqprom.run()
      .then(function (results) {
        done('Should have thrown an error, instead got ' + results)
      })
      .catch(function () {
        done()
      })
  })

  it('should continue if any function fails and allSettled is true', function (done) {
    seqprom.queue(1, 2)
    seqprom.queue(2, 2)
    seqprom.queue()
    seqprom.queue(4, 2)

    seqprom.run(true)
      .then(function (results) {
        expect(results.length).to.be.eq(4)
        console.log(results)
        done()
      })
      .catch(done)
  })
})
