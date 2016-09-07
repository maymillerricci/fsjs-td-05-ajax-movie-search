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
  for (var i = 0; i < response["Search"].length; i++) {
    moviesHtml += buildMovieListItem(response["Search"][i]);
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
