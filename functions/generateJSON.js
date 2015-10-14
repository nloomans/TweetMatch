module.exports = function (data) {
  var json = {};

  // save the big5 in a variable so we don't have to reference them using
  // this giant key.
  var big5 = data.tree.children[0].children[0].children; // get the big5

  for (var i = 0; i < big5.length; i++) {
    json[big5[i].id] = big5[i].percentage; // get the main numbers
    for (var j = 0; j < big5[i].children.length; j++) {
      json[big5[i].children[j].id] = big5[i].children[j].percentage; // get the sub numbers
    }
  }

  /* this will look like:
  {
    "Openness": 0.9454668869823971,
    "Adventurousness": 0.9290343527058391,
    "Artistic interests": 0.22847246785944592,
    "Emotionality": 0.04742013509065905,
    "Imagination": 0.9550963886751785,
    "Intellect": 0.9717546989273806,
    "Liberalism": 0.912860922984129,
    [...]

  } */

  return json;
}
