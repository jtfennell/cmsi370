var $searchButton = $('#searchButton');

var openSearchBar = function(){
	var $parentElement = $searchButton.parent();
	$searchButton.remove();

	//creates the searchbar, inserts into page, gives focus
	var $searchbBarDiv = $('div');
	var $searchbar = $('input');

	$searchbar.attr('type', 'text');
	$searchbar.attr('placeholder','Search for a character');
	$searchbar.attr('autocomplete', 'on');
	$searchbar.addClass('form-control');
	$parentElement.append($searchbar);
	$searchbar.focus();
}

var closeSearchBar = function(){

}

$searchButton.mouseenter(openSearchBar);
$searchButton.mouseout(closeSearchBar);
