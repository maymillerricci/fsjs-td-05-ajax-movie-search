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
  } else {
    moviesHtml += buildNoMoviesHtml(searchTerm, searchYear);
  }

  $("#movies").html(moviesHtml);
}

function buildMovieListItemHtml(movieInfo) {
  var movieListItem = "<li><div class='poster-wrap'>";

  if (movieInfo["Poster"] === "N/A") {
    movieListItem += "<i class='material-icons poster-placeholder'>crop_original</i>";
  } else {
    movieListItem += "<img class='movie-poster' src='" + movieInfo["Poster"] + "'>";
  }

  movieListItem += "</div><span class='movie-title'>" + movieInfo["Title"] + "</span>";
  movieListItem += "<span class='movie-year'>" + movieInfo["Year"] + "</span></li>";
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

function isInvalidYear(input) {
  return isNaN(input) || input < 1800 || input > 2500;
}
