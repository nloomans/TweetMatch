"use strict";

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
      // TODO: skip this is we added to database.
      // TODO: only remove scrollbar when showing the load icon.
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
});
