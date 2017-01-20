
var nightmare = require('nightmare')({'show':true});

nightmare
.goto('https://www.cinemark.com/louisiana/cinemark-lake-charles-and-xd')
.evaluate(function(){

    //jQuery.eachWith passes a variable to the jQuery each function.
    $.fn.extend({
        eachWith: function(input, fn){
            this.each(function(){
                fn.call(this, input);
            });
        }
    });

    var movies = [];

    //Jump to each title
    $('.showtimeMovieBlock h2').each(jumpByTitle);

    function jumpByTitle(){
        var movie = {
            title: $(this)[0].innerHTML, //save the title
            times: [],
        };

        //look at times
        $times = $(this).parent().parent().parent().parent().parent().children('.showtimeMovieTimes');
        $times.eachWith(movie, jumpByTime);

        movies.push(movie); //save this movie onto the array
    }

    function jumpByTime(movie){
        var $theatreType = $(this).children('.row');  //Split by type such as XD, 3D, standard
        var $button = $theatreType.children('.showtime').children('a'); //Get the buttons on each of these rows

        $button.eachWith(movie, jumpByButton);
    }

    function jumpByButton(movie){ 
        var text = $(this)[0].innerHTML; //finally get the written time inside the buttons
        movie.times.push(text); //save written time to this movie
    }


    return movies;  //output movie data back to Node

})//end evaluate
.end()
.then(function(movies){
    console.log(JSON.stringify(movies));
});