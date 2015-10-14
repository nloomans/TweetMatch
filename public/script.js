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

function percentage(factor) {
  return Math.round(factor*100).toString()+"%";
}

$(document).ready(function () {
  $("form").submit(function (event) {
    event.preventDefault();
    $(".selectUser").css("display","none");
    $(".loader").css("display","block");
    $.ajax({
      url: "api",
      method: "POST",
      dataType: "json",
      data: { username: $("#input").val().substring(1), addToDatabase: $("#addToDatabase").is(":checked") }
    }).done(function (data) {
      console.log(data);
      window.data = data;
      $('.percentage').text(percentage(data.match.percentage));
      $('.twitterUrl').find('a')
        .attr("href","https://twitter.com/"+data.match.name)
        .text("@"+data.match.name);

      $(".selectUser").css("display","block");
      $(".loader").css("display","none");
      $(".result").css("display", "table-row");

      for (var key in data.match.data) {
        if (data.match.data.hasOwnProperty(key)) {
          console.log(key);
          // TODO: add cross site scripting protection
          $(".score").html($(".score").html()
          +"<tr>"
            +"<td>"+key+"</td>"
            +"<td>"+percentage(data.thisUser[key])+"</td>"
            +"<td>"+percentage(data.match.data[key])+"</td>"
          +"</tr>");
        }
      }
    });
    return false;
  });

  $()

});
