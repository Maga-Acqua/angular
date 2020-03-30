$(document).ready(function(){

  $('#consultIMDB').on('click',function(e){
    e.preventDefault();
    var title = $('#movieName').val().trim();
    var isTitleEmpty = ( title == '' );
    if(isTitleEmpty){
      //Nothing happens
    }else{
      const url = "https://api.themoviedb.org/3/search/movie?api_key={...}&query=" + title;
      $.when(
        $.ajax({url:url, dataType: 'jsonp'})
      ).then(
        (response, status, xhr)=>{
          processResponse(response)
        });
      }
    });
});

var callback = function(){
  $.ajax({
      url: "http://www.omdbapi.com/?t=", // search by title
      dataType: 'jsonp', //JSONP method for sending JSON data without worrying about cross-domain issues
      success: function(data){
            console.log(data);
        }
    });
};

var getFormattedData = function (data) {
  var results = {
    poster: 'https://image.tmdb.org/t/p/w500/' + data.images.posters[0]['file_path'], //poster API
    actors: null,
    director: null,
    country: data.production_countries[0].name,
    released: data.release_date,
    imdbRating: data.vote_average
  }
  results.actors = _.map(data.credits.cast, function(actor){ // "_.map()" underscore function that return the results of applying the iteratee to each element.
      return " " + actor.name;
  });
  _.each(data.credits.crew, function(crewman){ // "_.forEach" underscore function
      if(crewman.job === 'Director')
        results.director = crewman.name;
      }).join();

  return results;
};

const completeTemplate = function(data){
  var $template = $('#imdb-info-template').html(); //.html() method sets or returns the content (innerHTML) of the selected elements.
  var templateFunction = _.template($template);
  var compiledHTML = templateFunction(getFormattedData(data));
  $('.imdb-info-content').html(compiledHTML);
};

const processResponse = function(response){
  var urlData = "https://api.themoviedb.org/3/movie/" + response.results[0].id + "?api_key={...}&append_to_response=images,credits";
  $.when( 
      $.ajax({url: urlData,dataType: 'jsonp'}) 
      ).then(
        function(serverResponse){ completeTemplate(serverResponse);
  });
};


