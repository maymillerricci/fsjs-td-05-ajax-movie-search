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
  var movieListItem = "<li><div class='poster-wrap'><img class='movie-poster' src='";
  movieListItem += movieInfo["Poster"];
  movieListItem += "'></div><span class='movie-title'>";
  movieListItem += movieInfo["Title"];
  movieListItem += "</span><span class='movie-year'>";
  movieListItem += movieInfo["Year"];
  movieListItem += "</span></li>";
  return movieListItem;
}
