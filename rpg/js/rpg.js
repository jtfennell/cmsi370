$(function(){
/**
to work on:
	-game itself
	-need to store last few (5) user actions as objects, in order to allow the user to undo
	-ask user if they want to create duplicate character if the same character has already been created
	notification bar: "view button" calls method that creates table of characters, highlights the table row that was changed
	-validation for inputs
**/
var $searchButton = $('#searchButton');
var $searchDiv = $('#searchDiv');
var $searchBar = $('#searchBar');
var $charSearchBtn = $('#charSearchBtn');
var $logInBtn = $("#logInBtn");
var $createNewCharacterBtn = $('#createNewCharacterBtn');

var openSearchBar = function(){
	$searchDiv.show();
	$searchDiv.addClass('animate bounceIn')
	$searchButton.hide();
	$searchBar.focus();
}

var checkIfUserLoggedIn = function(){
	if(localStorage.getItem("userName") !== null){
		fillInUserName();
	};
}

var setContentHeight = function(){
var optimalWindowHeight = window.innerHeight *.58;

$('.contentArea').height(optimalWindowHeight + "px");
}

var closeSearchBar = function(){
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
	
	var getCharacterURL ="http://lmu-diabolical.appspot.com/characters/" + characterId;

	$.getJSON(
	  getCharacterURL,
		  function (character) {
		    // Do something with the character.
		    alert("received response!")
		  }
	);
}


var displayCharacters = function(){
	$('tbody').children().remove();
$.getJSON(
    "http://lmu-diabolical.appspot.com/characters",
    function (characters) {
      $('#tbl-body').append(characters.map(function (character){
      		/*
      		var $newRow = $('<tr></tr>');
      		//stores character object in the row element, to be accessed when the user clicks or hovers over the element
      		$newRow.data('character', character);
      		var $editButton = $('<button></button>');
      		$editButton.text('Edit');
      		$editButton.addClass('btn btn-info edit-btn');
      		$('.edit-btn').click(editCharacter);

      		var $deleteButton = $('<button></button>');
      		$deleteButton.text('delete');
      		$deleteButton.addClass('btn btn-danger edit-btn');
      		
      		return $newRow
      		.append($('<td><.td>').text(character.name))
      		.append($('<td><.td>').text(character.gender))
      		.append($('<td><.td>').text(character.classType))
      		.append($('<td><.td>').text(character.level))
      		.append($('<td><.td>').text(character.money))
      		.append($('<td></td>').append($editButton))
      		.append($('<td></td>').append($deleteButton))
					*/
					
					$tr = $('#tblRowTemplate').clone();
					$tr.find('.tblCharacterName').text(character.name);
					$tr.find('.tblCharacterGender').text(character.gender);
					$tr.find('.tblCharacterClass').text(character.classType);
					$tr.find('.tblCharacterLevel').text(character.level);
					$tr.find('.tblCharacterMoney').text(character.money);
					return $tr;
      }));
    }
);
}

var editCharacter = function(){
	var character = $(this).parent().parent().data('character');
	console.log(JSON.stringify(character));
}

var  validateAddInputs = function(){
	name = $('#addCharacterName').val();
	classType = $('#addCharacterClass').val();
	gender = $('#addCharacterGender').val().toUpperCase();
	level = parseInt($('#addCharacterLevel').val());
	money = parseInt($('addCharacterMoney').val());
}

var addCharacter = function(){
	name = $('#addCharacterName').val();
	classType = $('#addCharacterClass').val();
	gender = $('#addCharacterGender').val().toUpperCase();
	level = parseInt($('#addCharacterLevel').val());
	money = parseInt($('addCharacterMoney').val());

	$.ajax({
	    type: 'POST',
	    url: "http://lmu-diabolical.appspot.com/characters",
	    data: JSON.stringify({
	        name: name,
	        classType: classType,
	        gender: gender,
	        level: level,
	        money: money
	    }),
	    contentType: "application/json",
	    dataType: "json",
	    accept: "application/json",
	    complete: function (jqXHR, textStatus) {
	        alert(textStatus);
	        alertUser({
	        	action: "added",
	        	character: name
	        })
	    }
	});


}


var alertUser = function(notification){
	$('#alertBar').show();

	$('#alertMessage').text("character " + notification.action + ": " + notification.character);

}

var getCharacterId = function(characterName){
	$.getJSON(
    "http://lmu-diabolical.appspot.com/characters",
    function (characters) {
      // Do something with the character list.
      characters.map(function (character) {
       return this.characterName = characterName});
    }
	);
}

var checkIfUserLoggedIn = function(){
	var userName = localStorage.getItem("userName")
	
	if (userName !== null) {
		fillInUserName(userName);
	};
}

var fillInUserName = function(userName){
	var $logoutButton = $('<button></button>');
	$logoutButton.text('Log out');
	$logoutButton.addClass('btn navbar-btn btn-link')
	$logoutButton.click(clearLocalStorage);

	$("#userInfoLogin").empty().text("Welcome back, " + userName);
	$('#userInfoLogin').append($logoutButton);
	$('#userInfoLogin').addClass('user-greeting');
}

var getUserName = function(){
	var $userNameInput = $('#userNameInput');
	var userName = $userNameInput.val();
	
	if (userName === "") {
		$userNameInput.parent().addClass("has-error")
		return;
	};
	if (userName !== "") {
		localStorage.setItem("userName", userName);
		fillInUserName(userName);
	};
}

var clearLocalStorage = function(){
	localStorage.removeItem("userName");
}

var hideLoginModal = function(){
	if ($('#userNameInput').val() !== "") {
		$('#closeModal').click();
	};
}

setContentHeight();
displayCharacters();
$(document).ready(checkIfUserLoggedIn());
$searchButton.mouseenter(openSearchBar);
$(window).resize(setContentHeight);
$searchDiv.mouseleave(closeSearchBar);
$charSearchBtn.click(getCharacter);
$('#submitLogInBtn').click(getUserName);
$('#submitLogInBtn').click(hideLoginModal);
$createNewCharacterBtn.click(addCharacter);
$('#refreshCharListBtn').click(displayCharacters);
displayCharacters();

})