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

var showHelp = function(){
	var refreshCharListBtn = $('#refreshCharListBtn');
	var addCharBtn = $('#addCharBtn');
	var spawnCharBtn = $('#spawnCharBtn');
	var genItemBtn = $('#genItemBtn');
	var firstRow = $('.tblRow').first();
	var firstRowEditButton = firstRow.find('.edit-btn');
	var firstRowDelBtn = firstRow.find('.delete-btn');

	$('.notification').remove();
	$('.alertRow').append('<button></button>').text('Next');
	$("#refreshCharListBtn").addClass('show');
	$('.tblRow').fadeTo(500, .5).css('background-color', 'grey');
	$('nav').fadeTo(500, .2);
	$('.pageTitle').addClass('darkened');

	var alertBar = $('#alertBar').clone().addClass("help notification alert-info");
	alertBar.find('button').remove();
	var alertText = $('<p></p>')
	var nextButton = $('<button></button>').text('Next').addClass('btn btn-info');
	alertBar.append(alertText);
	alertBar.append(nextButton);
	$('#alertRow').append(alertBar);
	alertBar.css('margin-bottom', '0px');
	alertBar.css('padding-bottom', '11px');
	alertBar.addClass('animated rotateIn');
	alertBar.show();
	$('.button-wrapper').fadeTo(500, .2);

	$('.tblRow').first().fadeTo(500,1).css('background-color', 'white');
	alertText.text('');

	var index = 0;
	var focusElements = [
		firstRow, firstRowEditButton, firstRowDelBtn, refreshCharListBtn, addCharBtn, spawnCharBtn, genItemBtn
	]

	var elementDescriptions = [
	"Each character is displayed in a row with its respective attributes. Click a row to view the character's character card",
	"Click on the character's edit button to edit the attributes of the character",
	"To remove a character from the game, click the character's delete button",
	"To update the list of characters with all of the current characters in the game, click \"Refresh Character List \"",
	"To create your own character for the game with your own desired attributes, click the \"add new character\" button",
	"Spawns a character with all attributes randomly generated",
	"Generates a new random item to be used in the game"
	]
	
	alertText.text(elementDescriptions[index]);
	nextButton.click(function(){
		index++;
		if (index > 0 && index !== 1) {
			focusElements[index - 1].fadeTo(500,.2);
		}
		else if (index === 1) {
			firstRow.css('background-color', 'grey');
			firstRowDelBtn.fadeTo(500, .5);
		};
		if (index > 2) {
			$('.tblRow').fadeTo(500, .5).css('background-color', 'grey');
		};
		focusElements[index].fadeTo(500,1);
		focusElements[index].find('.btn').addClass('glow')
		alertText.text(elementDescriptions[index]);

		if (index === focusElements.length - 1) {
			nextButton.remove();
			var closeButton = $('<button></button>').addClass('btn btn-info').text('close');
			alertBar.append(closeButton);

			closeButton.click(
				function(){
					closeHelp(focusElements)
				}
			)
		};
	})
	
}

var closeHelp = function(elementsToShow){
	$('.help').addClass('animated zoomOut')
	setTimeout(function(){
		$('.help').remove()
	}, 3000)

	for (var i = 0; i < elementsToShow.length; i++){
		elementsToShow[i].fadeTo(500, 1)
	}

	$('.tblRow').fadeTo(500, 1).css('background-color', 'white');
	$('nav').fadeTo(500, 1);
	$('.pageTitle').removeClass('darkened');
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
			$('.feedback').text('All characters loaded');
			setTimeout(function(){$('.feedback').addClass('animated fadeOut')}, 3000);
			return tr;
	      	}));
	    }
	);
	
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
	        	alertType: 'warning',
	        	character:character,
	        	item: null,
	        	undo:'delete'
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
	        	action: 'Character Deleted: ' + character.name,
	        	character:character,
	        	undo:'add'
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

		var character = {
		name: $('#addCharacterName').val(),
		classType : $('#addCharacterClass').val(),
		gender : $('#addCharacterGender').val(),
		level : parseInt($('#addCharacterLevel').val()),
		money : parseInt($('#addCharacterMoney').val()),
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
	        	alertType:'success',
	        	undo : null,
	        	item : null
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

var checkGenItemInputs = function(){

}

var viewNotification = function(notification){
	if (notification.character === null) {
		item = notification.item;
		console.log(notification.item)
		$(".itemName").text(item.name);
		$("#slot").text(item.slot);
		$('#level').text(item.level);
		$('#absorption').text(item.absorption);
		$('#atkspeed').text(item.atkspeed);
		$('#blockchance').text(item.blockchance);
		$('#critchance').text(item.critchance);
		$('#defense').text(item.defense);
		$('#maxdamage').text(item.maxdamage);
		$('#mindamage').text(item.mindamage);

		$('#viewItemModal').modal();
	}else{
		viewCharacter(notification.character);
	}
}

var alertUser = function(notification){
	$('.notification').remove();
	$('.undo-btn').show();
	$('.notificationBar').remove();
	var alertBar = $('#alertBar').clone().addClass("notification alert-" + notification.alertType).addClass('notificationBar');
	$('#alertRow').append(alertBar);
	alertBar.show();

	if (notification.undo !== 'add') {
		$('.undo-btn').hide();
	};
	alertBar.find('.alertMessage').text(notification.action);
	$('.viewNotification').click(
		function(){
			viewNotification(notification)
		})

	$('.undo-btn').click(
		function(){undoDelete(notification.character)})

}

var createRandomItem = function(){
	$('.feedback').removeClass('animated fadeOut')
	$('.feedback').text("Generating Item...")
	
	var item ={bodyPart: $('#itemBodyPart').val(),
		unlockLevel: parseInt($('#itemUnlockLevel').val()),
	}
	alert(item.bodyPart)

	$('#itemCloseBtn').click();

	$.getJSON(
    "http://lmu-diabolical.appspot.com/items/spawn",
    {
        level: item.unlockLevel,
        slot: item.bodyPart
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

var undoDelete = function(character){
	
	$('#addCharacterName').val(character.name),
	$('#addCharacterClass').val(character.classType)
	$('#addCharacterGender').val(character.gender)
	$('#addCharacterLevel').val(character.level)
	$('#addCharacterMoney').val(character.money)
	addCharacter();

	$('#addCharacterName').val('');
	$('#addCharacterClass').val('');
	$('#addCharacterGender').val('');
	$('#addCharacterLevel').val('');
	$('#addCharacterMoney').val('');
}
//function obtained from http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
var isNumeric = function(input){
    return (input - 0) == input && (''+input).replace(/^\s+|\s+$/g, "").length > 0;
}

var checkAddInputs = function(){
	var errorsInInputs = false;

	var name = $('#addCharacterName').val()
	var classType = $('#addCharacterClass').val()
	var gender = $('#addCharacterGender').val()
	var level = parseInt($('#addCharacterLevel').val())
	var money = parseInt($('#addCharacterMoney').val())

	if (name === '') {
		errorsInInputs = true;
		$('#addCharacterName').parent().addClass('has-error');
		$('.nameError').show();
	}
	else{
		$('.nameError').hide();
	}

	if (classType === '') {
		errorsInInputs = true;
		$('#addCharacterClass').parent().addClass('has-error');
		$('.classError').show();
	}
	else{
		$('.classError').hide();
	}

	if (!(isNumeric(level))) {
		errorsInInputs = true;
		$('#addCharacterLevel').parent().addClass('has-error');
		$('.levelError').show();
	}
	else{
		$('.levelError').hide();
	}

	if (!(isNumeric(money))) {
		errorsInInputs = true;
		$('#addCharacterMoney').parent().addClass('has-error');
		$('.moneyError').show();
	}
	else{
		$('.moneyError').hide();
	}

	if (errorsInInputs) {
		$('.addErrors').show();
	}
	else if (!errorsInInputs) {
		//removes any feedback about user errors on the add character modal
		$('.addErrors').children().remove().hide();
		addCharacter();
		//clears the input warnings from the add character modal
		$('#addCharacterMoney').val('').parent().removeClass('has-error');
		$('#addCharacterLevel').val('').parent().removeClass('has-error');
		$('#addCharacterClass').val('').parent().removeClass('has-error');
		$('#addCharacterName').val('').parent().removeClass('has-error');	
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
$createNewCharacterBtn.click(checkAddInputs);
$('#refreshCharListBtn').click(displayCharacters);
$('.spawnCharacter').click(spawnRandomCharacter)
$('.genItemBtn').click(createRandomItem);
$("#helpButton").click(showHelp);
$('#searchBar').tooltip()
$('#addCharacterName').popover('show');
})