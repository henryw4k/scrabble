var app = angular.module('Scrabble', [])

app.controller('MainCtrl', [
'$scope', 'wordNik', '$filter',
function($scope, wordNik, $filter){
  $scope.guess = '';

  wordNik.getWordPromise()
  .then(function(response){
  	$scope.word = response.data.word.toUpperCase();
  	$scope.shuffled = wordNik.shuffle($scope.word);
 	  $scope.$on('my:keyup', function(event, keyEvent) {
 	var shuffled = $scope.shuffled;
    var keyTyped = $filter('convert')(keyEvent.keyCode);
	$scope.shuffled = wordNik.checkHelper(keyTyped, shuffled);
	if($scope.shuffled.length !== shuffled.length){
		$scope.guess = $scope.guess + keyTyped;
	}
  });
  });

}]);

app.filter('convert', function(){
  return function(keycode){
  	return String.fromCharCode(keycode);
  };
});

app.factory('wordNik', ['$http',
	function($http){
		var obj = {};
		obj.getWordPromise = function(){
		 return $http.get("http://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5");
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
	    			var left = shuffle.substring(0,i);
	    			var right = shuffle.substring(i+1);
	    			console.log(left+right);
	    			return left+right;
	    		}
	    	}
	    	return shuffle;
	    };

	     return obj;
}]);