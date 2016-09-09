"use strict";

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

$("#movies").on("click", ".show-details", function(e) {
  e.preventDefault();
  var imdbId = $(this).data("imdb-id");
  $.ajax("http://www.omdbapi.com", {
    data: {i: imdbId, plot: "full"},
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

$("#movie-details").on("click", ".back-to-results", function(e) {
  e.preventDefault();
  $("#movie-details").hide();
  $("#movies").show();
});

function performSearch(searchTerm, searchYear) {
  $.ajax("http://www.omdbapi.com", {
    data: {s: searchTerm, y: searchYear},
    success: function(response) {
      showSearchResults(response, searchTerm, searchYear);
    },
    error: function() {
      alert("Something went wrong. Please try again later.");
    }
  }); 
}

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

function buildNoMoviesHtml(searchTerm, searchYear) {
  var moviesHtml = "<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>No movies found that match: ";
  moviesHtml += searchTerm;
  
  if (searchYear) {
    moviesHtml += " (" + searchYear + ")";
  }
  
  moviesHtml += ".</li> ";
  return moviesHtml;
}

function buildOtherErrorHtml(errorMessage) {
  var moviesHtml = "<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>";
  moviesHtml += errorMessage + "</li> ";
  return moviesHtml;
}

function buildMovieDetailsHtml(movieInfo) {
  var movieDetails = "<header><a href='#'' class='back-to-results'><strong><</strong> Search results</a>";
  movieDetails += "<h1>" + movieInfo["Title"] + " (" + movieInfo["Year"] + ")</h1>";
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

function isInvalidYear(input) {
  return isNaN(input) || input < 1800 || input > 2500;
}
