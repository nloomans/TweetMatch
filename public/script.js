"use strict";

function gererateJson (data) {
  window.data = data;
  console.log(data);
  console.log(typeof data);
  var json = {}

  // get the big 5 values and put them in a nice json
  for (var i = 0; i < data.length; i++) {
    if (data[i].title && data[i].value != "") { // is it one of the big 5?
      console.log(data[i]);
      console.log(data[i].id);
      json[data[i].id] = Number(
        data[i].value
        .substring(0,data[i].value.length-1) // remove the % at the end
      ) * 0.01; // turn it intro a factor
    }
  }

  console.log(json);
  return json;
}

$(document).ready(function () {
  $("form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      url: "api",
      method: "POST",
      dataType: "json",
      data: { username: $("#input").val().substring(1) }
    }).done(function (data) {
      console.log(data);
    });
    return false;
  })
});
