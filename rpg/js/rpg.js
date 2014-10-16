/**
to work on:
	-look up character by name, rather than by ID
	-create right click menu

**/
var $searchButton = $('#searchButton');
var $searchDiv = $('#searchDiv');
var $searchBar = $('#searchBar');
var $charSearchBtn = $('#charSearchBtn');

var opensearchBar = function(){
	$searchDiv.show();
	$searchButton.hide();
	$searchBar.focus();
}

var closesearchBar = function(){
	//searchbar will disappear if the user has not typed in anything
	if ($searchBar.val().trim() === ''){
		$searchBar.val('');
		$searchDiv.hide();
		$searchButton.show();
	}
}

var getCharacter = function(){
	var characterName = $searchBar.val();
	
	var characterId = getCharacterId(characterName);
	
	if (characterIdValid(characterId)) {
		var getCharacterURL ="http://lmu-diabolical.appspot.com/characters/" + characterId;

		$.getJSON(
	    	getCharacterURL,
		    function (character) {
		        // Do something with the character.
		        alert("received response!")
		    }
		);
	};
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

$searchButton.mouseenter(opensearchBar);
$searchDiv.mouseleave(closesearchBar);
$charSearchBtn.click(getCharacter);

$.ajax({
    type: 'POST',
    url: "http://lmu-diabolical.appspot.com/characters",
    data: JSON.stringify({
        name: "Rick Ro$$",
        classType: "UH",
        gender: "MALE",
        level: 10,
        money: 10000000000
    }),
    contentType: "application/json",
    dataType: "json",
    accept: "application/json",
    complete: function (jqXHR, textStatus) {
        // The new character can be accessed from the Location header.
        console.log("You may access the new character at:" +
            jqXHR.getResponseHeader("Location"));
    }
});

