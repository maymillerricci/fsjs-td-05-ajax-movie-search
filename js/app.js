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
  } else if (response["Error"] === "Movie not found!") {
    moviesHtml += buildNoMoviesHtml(searchTerm, searchYear);
  } else {
    moviesHtml += buildOtherErrorHtml(response["Error"]);
  }

  $("#movies").html(moviesHtml);
}

function buildMovieListItemHtml(movieInfo) {
  var movieListItem = "<li><a href='#' class='show-details'>"
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

function isInvalidYear(input) {
  return isNaN(input) || input < 1800 || input > 2500;
}



$("#movies").on("click", ".show-details", function(e) {
  e.preventDefault();
  $("#movies").hide();
  var movieDetailsHtml = buildMovieDetailsHtml();
  $("#movie-details").html(movieDetailsHtml).show();
});

$("#movie-details").on("click", ".back-to-results", function(e) {
  e.preventDefault();
  $("#movie-details").hide();
  $("#movies").show();
});

function buildMovieDetailsHtml() {
  var movieDetails = "<header><a href='#'' class='back-to-results'><strong><</strong> Search results</a>";
  movieDetails += "<h1>" + "The Yellow Sea" + " (" + "2010" + ")</h1>";
  movieDetails += "<h4>IMDb rating: " + "7.4" + "</h4></header> ";
  movieDetails += "<figure><img src='" + "http://ia.media-imdb.com/images/M/MV5BMTQ1MjQwMTE5OF5BMl5BanBnXkFtZTgwNjk3MTcyMDE@._V1_SX300.jpg" + "' class='details-poster'></figure>";
  movieDetails += "<section><h3>Plot synopsis:</h3><p>" + "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text." + "</p>";
  movieDetails += "<a href='#' class='imdb-link'>View on IMDb</a></section>";
  return movieDetails;           
}
