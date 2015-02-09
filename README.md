# sequentialpromises
[![Circle CI](https://circleci.com/gh/mishguruorg/sequentialpromises.svg?style=svg)](https://circleci.com/gh/mishguruorg/sequentialpromises)
Wrap and run promises in order (not at once)
Like Q.all() but functions will run one after the other

Usage

Install
```
npm install --save seqprom

```
Create the seqprom object by passing in the function you need to loop through

```
var Seqprom = require('seqprom');

//we want to call this function sequentially
function wrapMe(arg1, arg2){
    var deferred = Q.defer();

    setTimeout(function(){
        deferred.resolve(arg1 + arg2);
    }, 200)
    
    return deferred.promise;
}

//Wrap it
var wrappedSeqProm = new Seqprom(wrapMe);

//What we want to call it with
for(var i = 0; i < 10; i++){
	wrappedSeqProm.queueCall(i, i+1);
}

//run it
wrappedSeqProm.run()
	.then(function(results){
		//results[0] === 1
		//results[1] === 2
		//...etc
	});

```
