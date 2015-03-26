var SeqProm = require('../lib/sequentialpromises.js'),
	Q = require('q');
 
describe('When queuing a function', function () {
    var seqprom;

    function wrapMe(){
    	return Q.resolve();
    }
 
    before(function () {
        seqprom = new SeqProm(wrapMe);
    });
 
    it('should wrap the original function passed into the object', function () {
        seqprom.queueCall();
        expect(seqprom.queuedFunctions.length).equal(1);
    });
});

describe('When queueing a series of functions', function () {
    this.timeout(2000);

    var seqprom;

    function wrapMe(arg1, arg2){
        var deferred = Q.defer();

        setTimeout(function(){
            deferred.resolve(arg1 + arg2);
        }, 200)
        
        return deferred.promise;
    }
 
    before(function () {
        seqprom = new SeqProm(wrapMe);
    });
 
    it('should run each function in order', function (done) {
        seqprom.queueCall(1, 2);
        seqprom.queueCall(2, 2);
        seqprom.queueCall(3, 2);
        seqprom.queueCall(4, 2);

        seqprom.run()
            .then(function(results){
                expect(results[0]).equal(3);
                expect(results[1]).equal(4);
                expect(results[2]).equal(5);
                expect(results[3]).equal(6);
                done();
            })
            .catch(done);
    });
});