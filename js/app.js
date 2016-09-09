"use strict";

// on click search, check for valid search inputs and perform search if valid
$(".search-form").on("submit", function(e) {
  e.preventDefault();
  var searchTerm = $("#search").val();
  var searchYear = $("#year").val();
  
  if (searchTerm.length < 2) {
    alert("Please enter a search term of at least 2 characters.");
  } else if (searchYear && isInvalidYear(searchYear)) {
    alert("If you want to filter by year, please enter a valid year.");
  } else {
    performSearch(searchTerm, searchYear);
  }
});

// on click on movie, send ajax request to api for individual movie info 
// and show movie details page w/that info
$("#movies").on("click", ".show-details", function(e) {
  e.preventDefault();
  var imdbId = $(this).data("imdb-id");
  $.ajax("http://www.omdbapi.com", {
    data: {i: imdbId, plot: "full", r: "json"},
    success: function(response) {
      $("#movies").hide();
      var movieDetailsHtml = buildMovieDetailsHtml(response);
      $("#movie-details").html(movieDetailsHtml).show();
    },
    error: function() {
      alert("Something went wrong. Please try again later.");
    }
  }); 
});

// on click back, hide movie details and show movies list
$("#movie-details").on("click", ".back-to-results", function(e) {
  e.preventDefault();
  $("#movie-details").hide();
  $("#movies").show();
});

// send ajax request to api to get movies data based on search inputs
function performSearch(searchTerm, searchYear) {
  $.ajax("http://www.omdbapi.com", {
    data: {s: searchTerm, y: searchYear, r: "json"},
    success: function(response) {
      showSearchResults(response, searchTerm, searchYear);
    },
    error: function() {
      alert("Something went wrong. Please try again later.");
    }
  }); 
}

// show markup on movies page:
// if results, loop through them adding list items for each movie
// otherwise, display error message
function showSearchResults(response, searchTerm, searchYear) {
  var moviesHtml = "";
  
  if (response["Response"] === "True") {
    for (var i = 0; i < response["Search"].length; i++) {
      moviesHtml += buildMovieListItemHtml(response["Search"][i]);
    }
  } else if (response["Error"] === "Movie not found!") {
    moviesHtml += buildNoMoviesHtml(searchTerm, searchYear);
  } else {
    moviesHtml += buildOtherErrorHtml(response["Error"]);
  }

  $("#movies").html(moviesHtml);
}

// return markup for individual movie list item on movies page
function buildMovieListItemHtml(movieInfo) {
  var movieListItem = "<li><a href='#' class='show-details' data-imdb-id='" + movieInfo["imdbID"] + "'>";
  movieListItem += "<div class='poster-wrap'>";

  if (movieInfo["Poster"] === "N/A") {
    movieListItem += "<i class='material-icons poster-placeholder'>crop_original</i>";
  } else {
    movieListItem += "<img class='movie-poster' src='" + movieInfo["Poster"] + "'>";
  }

  movieListItem += "</div><span class='movie-title'>" + movieInfo["Title"] + "</span>";
  movieListItem += "<span class='movie-year'>" + movieInfo["Year"] + "</span></a></li>";
  return movieListItem;
}

// return markup to display when no movies are found matching the search inputs
function buildNoMoviesHtml(searchTerm, searchYear) {
  var moviesHtml = "<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>No movies found that match: ";
  moviesHtml += searchTerm;
  
  if (searchYear) {
    moviesHtml += " (" + searchYear + ")";
  }
  
  moviesHtml += ".</li> ";
  return moviesHtml;
}

// return markup to display if something else goes wrong
function buildOtherErrorHtml(errorMessage) {
  var moviesHtml = "<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>";
  moviesHtml += errorMessage + "</li> ";
  return moviesHtml;
}

// return markup for individual movie details page
function buildMovieDetailsHtml(movieInfo) {
  var movieDetails = "<header><a href='#' class='back-to-results'><strong><</strong> Search results</a>";
  movieDetails += "<a href='http://www.imdb.com/title/" + movieInfo["imdbID"] + "' target='_blank'>";
  movieDetails += "<h1>" + movieInfo["Title"] + " (" + movieInfo["Year"] + ")</h1></a>";
  movieDetails += "<h4>IMDb rating: " + movieInfo["imdbRating"] + "</h4></header> <figure class='details-poster'>";

  if (movieInfo["Poster"] === "N/A") {
    movieDetails += "<div class='poster-wrap'><i class='material-icons poster-placeholder'>crop_original</i></div>";
  } else {
    movieDetails += "<img src='" + movieInfo["Poster"] + "'>";
  }

  movieDetails += "</figure><section><h3>Plot synopsis:</h3><p>" + movieInfo["Plot"] + "</p>";
  movieDetails += "<a href='http://www.imdb.com/title/" + movieInfo["imdbID"] + "' target='_blank' ";
  movieDetails += "class='imdb-link'>View on IMDb</a></section>";
  return movieDetails;           
}

// check whether input is a valid year for a movie
function isInvalidYear(input) {
  return isNaN(input) || input < 1800 || input > 2500;
}
