$(function(){
/**
to work on:
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
var spawnRandomCharacter = function(){
	$.getJSON(
    "http://lmu-diabolical.appspot.com/characters/spawn",
    function (character) {
    	$('#addCharacterName').val(character.name);
		$('#addCharacterClass').val(character.classType);
		$('#addCharacterGender').val(character.gender);
		$('#addCharacterLevel').val(character.level);
		$('#addCharacterMoney').val(character.money);
		$('#addCharacterId').val(getCharacterId(character.name));
		
		addCharacter();

		$('#addCharacterName').val('');
		$('#addCharacterClass').val('');
		$('#addCharacterGender').val('');
		$('#addCharacterLevel').val('');
		$('#addCharacterMoney').val('');
		$('#addCharacterId').val('');
    }
	);

}

var getCharacter = function(){
	var characterName = $searchBar.val();
	
	var characterId = getCharacterId(characterName);
	
	var getCharacterURL ="http://lmu-diabolical.appspot.com/characters/" + characterId;

	$.getJSON(
	  getCharacterURL,
		  function (character) {
		    // Do something with the character.
		    console.log("received response!")
		  }
	);
}


var displayCharacters = function(){
	$('.feedback').removeClass('animated fadeOut')
	$('.feedback').text('Loading Characters...');
	$('tbody').find('.tblRow').remove();

	$.getJSON(
    "http://lmu-diabolical.appspot.com/characters",
    function (characters) {
    	
	    $('tbody').append(characters.map(function (character){
	      	var tr = $('.tblRowTemplate').clone();
	      	tr.removeClass('tblRowTemplate');
	      	tr.addClass('tblRow');
			tr.find('.char-name').text(character.name);
			tr.find('.char-gender').text(character.gender);
			tr.find('.char-class').text(character.classType);
			tr.find('.char-level').text(character.level);
			tr.find('.char-money').text(character.money);
			tr.data('character', character);
			tr.find('.edit-btn').click(loadEditModal);
			tr.find('.delete-btn').click(deleteCharacter);
			tr.find('.viewCharArea').click(function(){viewCharacter(character)})

			if (character.gender === 'MALE') {
				tr.find('img').attr('src','http://goodfilmguide.co.uk/wp-content/uploads/2010/04/avatar12.jpg' )
			}else{
				tr.find('img').attr('src','http://fantasy-faction.com/wp-content/uploads/2014/04/Avatar.jpg');
			}
			tr.show();
			return tr;
	      	}));
	    }
	);
	$('.feedback').text('All characters loaded');
	setTimeout(function(){$('.feedback').addClass('animated fadeOut')}, 3000);
}

var editCharacter = function(character, parentDiv){
	characterURL = "http://lmu-diabolical.appspot.com/characters/" + character.id;
		character.name = $('#edit-name').val();
		character.gender = $('#edit-gender').val();
		character.classType = $('#edit-class').val();
		character.level = parseInt($('#edit-level').val());
		character.money = parseInt($('#edit-money').val());

		$.ajax({
    type: 'PUT',
    url: characterURL,
    data: JSON.stringify({
        id: character.id,
        name: character.name,
        classType: character.classType,
        gender: character.gender,
        level: character.level,
        money: character.money
    }),
    contentType: "application/json",
    dataType: "json",
    accept: "application/json",
    success: function (data, textStatus, jqXHR) {
        parentDiv.remove();
        createSuccessDiv(character);
	        alertUser(
	        	{action: "Character Modified: " + character.name,
	        	alertType: 'warning'
	        	}
	        )
    	}
	});
}

var loadEditModal = function(){
	var parentDiv =$(this).parent().parent();
	var character = parentDiv.data('character');
	var characterURL = "http://lmu-diabolical.appspot.com/characters/" + character.id;

	$('#edit-name').val(character.name);
	$('#edit-gender').val(character.gender);
	$('#edit-class').val(character.classType);
	$('#edit-level').val(character.level);
	$('#edit-money').val(character.money);
	
	$('.submit-edits').click(
		function(){
			editCharacter(character,parentDiv);
		})
	$('.submit-edits').click(
		function(){
			$('.edit-close').click();
		})
}

var deleteCharacter = function(){
	$('.feedback').removeClass('animated fadeOut');
	$('.feedback').text('Deleting Character...');
	var characterRow = $(this).parent().parent();
	var character = $(this).parent().parent().data('character');
	var characterURL = "http://lmu-diabolical.appspot.com/characters/" + character.id;
		$.ajax({
	    type: 'DELETE',
	    url: characterURL,
	    success: function (data, textStatus, jqXHR) {
	        alertUser({
	        	alertType: 'danger',
	        	action: 'Character Deleted: ' + character.name
	        })
	       characterRow.remove();
	       $('.feedback').addClass('animated fadeOut');
	    }
	});
		
		
}
var createSuccessDiv = function(character){
	var newRow = $('.tblRowTemplate').clone();
    newRow.find('.char-name').text(character.name);
    newRow.find('.char-gender').text(character.gender);
    newRow.find('.char-class').text(character.classType);
    newRow.find('.char-level').text(character.level);
    newRow.find('.char-money').text(character.money);
    newRow.find('.edit-btn').click(loadEditModal);
	newRow.find('.delete-btn').click(deleteCharacter);
    newRow.show();
    newRow.data('character', character);

    if (character.gender === 'MALE') {
		newRow.find('img').attr('src','http://goodfilmguide.co.uk/wp-content/uploads/2010/04/avatar12.jpg' )
	}else{
		newRow.find('img').attr('src','http://fantasy-faction.com/wp-content/uploads/2014/04/Avatar.jpg');
	}

    newRow.addClass('success');
    $(".contentArea").animate({ scrollTop: 0 }, 500);
    $('tbody').prepend(newRow);
    newRow.removeClass('tblRowTemplate').addClass('tblRow');
    setTimeout(function(){
    newRow.removeClass('success');
   	}, 5000)

}

var addCharacter = function(){
	$('.add-cancel').click();
	$('.feedback').removeClass('animated fadeOut');
	$('.feedback').text('Adding Character...');

		character = {
		name: $('#addCharacterName').val(),
		classType : $('#addCharacterClass').val(),
		gender : $('#addCharacterGender').val(),
		level : parseInt($('#addCharacterLevel').val()),
		money : parseInt($('#addCharacterMoney').val()),
		id: $('#addCharacterId').val()
		}

	$.ajax({
	    type: 'POST',
	    url: "http://lmu-diabolical.appspot.com/characters",
	    data: JSON.stringify({
	        name: character.name,
	        classType: character.classType,
	        gender: character.gender,
	        level: character.level,
	        money: character.money
	    }),
	    contentType: "application/json",
	    dataType: "json",
	    accept: "application/json",
	    complete: function (jqXHR, textStatus) {
	        createSuccessDiv(character);
	        alertUser({
	        	action: 'Character Added: ' + character.name,
	        	character: character,
	        	alertType:'success'
	        })
	       $('.feedback').addClass('animated fadeOut');

	    }
	});
	
}
var viewCharacter = function(character){
	$('#viewCharModal').modal('toggle');

	$('.charName').text(character.name);
	$('.charGender').text(character.gender);
	$('.charLevel').text(character.level);
	$('.charClass').text(character.classType);
	$('.charMoney').text(character.money);

	if (character.gender === 'MALE') {
		$('.charPic').attr('src','http://goodfilmguide.co.uk/wp-content/uploads/2010/04/avatar12.jpg' )
	}else{
		$('.charPic').attr('src','http://fantasy-faction.com/wp-content/uploads/2014/04/Avatar.jpg');
	}


}

var viewNotification = function(notification){

	if (notification.character === null) {
		alert('this is an item')
	}else{
		viewCharacter(notification.character);
	}
}

var alertUser = function(notification){
	$('.notificationBar').remove();
	alertBar = $('#alertBar').clone().addClass("alert-" + notification.alertType).addClass('notificationBar');
	$('#alertRow').append(alertBar);
	alertBar.show();

	$('.alertMessage').text(notification.action);
	$('.viewNotification').click(
		function(){
			viewNotification(notification)
		})
}

var showItemModal = function(){

}

var createRandomItem = function(){
	$('.feedback').removeClass('animated fadeOut')
	$('.feedback').text("Generating Item...")
	$('#itemCloseBtn').click();
	var itemBodyPart = $('#itemBodyPart').val();
	var itemUnlockLevel = $('#itemUnlockLevel').val();

	$.getJSON(
    "http://lmu-diabolical.appspot.com/items/spawn",
    {
        level: itemUnlockLevel,
        slot: itemBodyPart
    },
    function (item) {
        alertUser({
    	alertType: 'success',
    	action: 'Item generated: ' + item.name,
    	character:null,
    	item:item
    })
        $('.feedback').addClass('animated fadeOut')
    }

);
}

var getCharacterId = function(characterName){
	$.getJSON(
    "http://lmu-diabolical.appspot.com/characters",
    function (characters) {
      // Do something with the character list.
      for(var i = 0; i < characters.length; i++){
      	if (characters[i].name == characterName) {
      		return characters[i].id;
      	};
      }
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
$('.spawnCharacter').click(spawnRandomCharacter)
$('#genItemBtn').click(createRandomItem);

})