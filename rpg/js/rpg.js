/**
to work on:
	-look up character by name, rather than by ID
	-create right click menu
	-use animate css
	-login menu
		-local storage for username

**/
var $searchButton = $('#searchButton');
var $searchDiv = $('#searchDiv');
var $searchBar = $('#searchBar');
var $charSearchBtn = $('#charSearchBtn');

var openSearchBar = function(){
	$searchDiv.show();
	$searchDiv.addClass('animate bounceIn')
	$searchButton.hide();
	$searchBar.focus();
}

var checkIfUserLoggedIn = function(){
	if(localStorage.getItem("userLoggedIn") === null){
		promptUserForLogin();
	};
}

var closeSearchBar = function(){
	//searchbar will disappear if the user has not typed in anything
	if ($searchBar.val().trim() === ''){
		$searchBar.val('');
		$searchDiv.hide();
		$searchButton.show();
	}
}

var promptUserForLogin = function(){

}

var getCharacter = function(){
	var characterName = $searchBar.val();
	
	var characterId = getCharacterId(characterName);
	
	var getCharacterURL ="http://lmu-diabolical.appspot.com/characters/" + characterId;

	$.getJSON(
	  getCharacterURL,
		  function (character) {
		    // Do something with the character.
		    alert("received response!")
		  }
	);
}

//create modal form to receive character data
var addCharacter = function(){

}

var getCharacterId = function(characterName){
	$.getJSON(
    "http://lmu-diabolical.appspot.com/characters",
    function (characters) {
        // Do something with the character list.
        characters.forEach(function (character) {
            console.log(character);
        });
    }
);
}

$searchButton.mouseenter(openSearchBar);
$searchDiv.mouseleave(closeSearchBar);
$charSearchBtn.click(getCharacter);