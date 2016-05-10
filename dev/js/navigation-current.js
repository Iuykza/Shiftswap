//navigation-current.js
//Finds which page the user is currently on and points to it on the navigation bar.
(function(){




var loop = setInterval(function(){
	if(document.readyState === 'complete'){
		clearInterval(loop);
		begin();
	}
}, 250);




function begin(){
	var $ = jQuery;



	var link = linkToHighlight();


	$('header nav a').each(function(){ //find the matching link.
		var $text = $(this).text();
		if($text == link){
			$(this).addClass('active');
			console.log($(this));
		}
	});




	function linkToHighlight(){

		var linkName = {
			'index':'Home',
			'whats-this': 'What\'s this?',
		};

		//1. Get the file name.
		var file = getFileName();

		//2. Match if name is predefined.
		for(var link in linkName){
			console.log(link);
			if(file == link){
				console.log('predefined', linkName[link]);
				return linkName[link];
			}
		}

		//3. Make a guess for other links.
		var fuzzy = FuzzySet();
		$('header nav a').each(function(){
			fuzzy.add($(this).text());
		});

		console.log(file, fuzzy.get(file));
		return fuzzy.get(file)[0][1] || '';







		function getFileName() {
			var url = document.location.href;
			url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#")); //strip anchor
			url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?")); //strip query
			url = url.substring(url.lastIndexOf("/") + 1, url.length); //filename
			url = url.substring(0, url.length - url.lastIndexOf(".")); //strip extension
			return url;
		}
	}


}//begin





})();
