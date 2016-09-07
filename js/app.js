"use strict";

$(".search-form").on("submit", function(e) {
  e.preventDefault();
  var searchTerm = $("#search").val();
  performSearch(searchTerm);
});

function performSearch(searchTerm) {
  var url = "http://www.omdbapi.com";
  var data = {s: searchTerm};
  $.ajax(url, {
    data: data,
    success: function(response) {
      showSearchResults(response);
    }
  }); 
}

function showSearchResults(response) {
  var moviesHtml = "";
  
  if (response["Response"] === "True") {
    for (var i = 0; i < response["Search"].length; i++) {
      moviesHtml += buildMovieListItem(response["Search"][i]);
    }
  } else {
    moviesHtml += "<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>No movies found that match: "
    moviesHtml += $("#search").val() + ".</li> ";
  }

  $("#movies").html(moviesHtml);
}

function buildMovieListItem(movieInfo) {
  var movieListItem = "<li><div class='poster-wrap'>";

  if (movieInfo["Poster"] === "N/A") {
    movieListItem += "<i class='material-icons poster-placeholder'>crop_original</i>";
  } else {
    movieListItem += "<img class='movie-poster' src='" + movieInfo["Poster"] + "'>"
  }

  movieListItem += "</div><span class='movie-title'>" + movieInfo["Title"] + "</span>";
  movieListItem += "<span class='movie-year'>" + movieInfo["Year"] + "</span></li>";
  return movieListItem;
}
