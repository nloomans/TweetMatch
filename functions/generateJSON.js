module.exports = function (data) {
  var json = {};

  var big5 = data.tree.children[0].children[0].children; // get the big5

  // return big5;

  for (var i = 0; i < big5.length; i++) {
    json[big5[i].id] = big5[i].percentage; // get the main numbers
    for (var j = 0; j < big5[i].children.length; j++) {
      json[big5[i].children[j].id] = big5[i].children[j].percentage; // get the sub numbers
    }
  }

  // console.log(json);
  return json;
}
