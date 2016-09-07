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
      console.log(response);
    }
  }); 
}
