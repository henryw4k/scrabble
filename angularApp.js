var app = angular.module('Scrabble', [])

app.controller('MainCtrl', [
'$scope', 'wordNik', '$filter','$document',
function($scope, wordNik, $filter, $document){
  $scope.guess = '';

  wordNik.getWordPromise()
  .then(function(response){
  	$scope.word = response.data.word.toUpperCase();
  	$scope.shuffled = wordNik.shuffle($scope.word);
    //storeLeftOver in wordNik

    $scope.$on('my:keyup', function(event, keyEvent) {
      var keyTyped = $filter('convert')(keyEvent.keyCode);
      var tempShuffled = wordNik.checkHelper(keyTyped, $scope.shuffled);
      //tempShuffled has value if key is a match
      if( tempShuffled && $scope.guess.length <= $scope.word.length){

        //model updates
        $scope.shuffled = wordNik.scramble;
        $scope.guess = wordNik.guess;
        //winning logic
        if(new String($scope.word).valueOf() === new String($scope.guess).valueOf()){
          console.log("YOU WIN!!!!!");
          window.alert("You Win!");
        }
      }
    });
      console.log("shuffled word: ", wordNik.scramble);
      console.log("guess word: ", wordNik.guess);
      console.log("stack: ", wordNik.stack);

  });

  //Back space logic
  $document.on('keydown', function(e){
    if(e.which === 8){
        e.preventDefault();
          wordNik.backHelper();

          //model updates
          console.log(' back key: ', wordNik.scramble);
          $scope.shuffled = wordNik.scramble;
          $scope.guess = wordNik.guess;
    }
  });

}]);//controller logic

app.filter('convert', function(){
  return function(keycode){
  	return String.fromCharCode(keycode);
  };
});

app.factory('wordNik', ['$http',
	function($http){
		var obj = {};

    //persistent memory
    obj.scramble = '';
    obj.guess = '';
    obj.stack = []; //a stack {character, index}
    //Setter methods
    obj.storeLeftOver = function(val){
      this.scramble = val;
    };

    obj.storeGuess = function(val){
      this.guess = val;
    }

		obj.getWordPromise = function(){
      //TODO: making strings come without a '-'
		 return $http.get("https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5");
	     };//getWord

	    obj.shuffle = function(string){
		    var a = string.split(""),
		        n = a.length;

		    for(var i = n - 1; i > 0; i--) {
		        var j = Math.floor(Math.random() * (i + 1));
		        var tmp = a[i];
		        a[i] = a[j];
		        a[j] = tmp;
		    }
		    return a.join("");
	    };

	    obj.checkHelper = function(character, shuffle){
	    	for(var i = 0; i < shuffle.length; i++){
	    		if(character === shuffle[i]){
            this.stack.push({'character': character,'index': i});
	    			var left = shuffle.substring(0,i);
	    			var right = shuffle.substring(i+1);
            var newShuffle = left+right;

            this.scramble = newShuffle;
            this.guess = this.guess + character;
	    			return true;
	    		}
	    	}
	    	return false;
	    };
      obj.backHelper = function(){
        if(this.stack.length > 0){
          var lastItem = this.stack.pop();//need index location
          
          this.guess = this.guess.substring(0, this.guess.length-1);
          //update guess & scramble local variables
          var left = this.scramble.substring(0,lastItem.index);
          var right = this.scramble.substring(lastItem.index);
          var newValue = left + lastItem.character + right;
          this.scramble = newValue;
        }
      }

	     return obj;
}]);