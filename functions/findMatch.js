module.exports = function (thisUser, allUsers) {
  // TODO: optimize this.

  var currentUser, compaired = {};

  // compair this user to all the userers in the database
  for (var i = 0; i < allUsers.docs.length; i++) {
    console.log("checking "+allUsers.docs[i]._id);
    var values = [], diff, total = 0;

    currentUser = allUsers.docs[i];

    // for in is the only way to for a json. see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
    for (var key in currentUser.data) {
      // check if key is correct, it will alsways be correct but just in case.
      if (currentUser.data.hasOwnProperty(key) && thisUser.hasOwnProperty(key)) {
        diff = thisUser[key] / currentUser.data[key]; // calculate the difference between you and the current celeberty
        if (diff > 1) {
          diff = Math.pow(diff,-1); // we only want numbers below 100%
        }
        // add the difference to an array so we can do easy calculation.
        values.push(diff);
      }
    }

    // calculate the avrage.
    for (var j = 0; j < values.length; j++) {
      total += values[j];
    }
    // example:
    // compaired.IBM = 0.75458916432
    compaired[allUsers.docs[i]._id] = total/values.length;
  }
  // find the user with the highest maths
  var i = 0, highest;

  // set the first on as highest, then if we find any one higher set that
  // one as highest
  for (key in compaired) {
    if (compaired.hasOwnProperty(key)) {
      if (i == 0) {
        highest = key;
      }
      else {
        if (compaired[key] > compaired[highest]) {
          highest = key;
        }
      }
      i++; // the for in loop doesn't give you an index, so we have to keep track of it our selfs.
    }
  }

  // get the highest and add them to data, this will later be returnd.
  var data = {};
  for (var i = 0; i < allUsers.docs.length; i++) {
    if (allUsers.docs[i]._id == highest) {
      data = allUsers.docs[i].data;
      break;
    }
  }

  // TODO: don't return what we don't need.
  return {
    allUsers: compaired,
    thisUser: thisUser,
    match: {
      name: highest,
      percentage: compaired[highest],
      data: data
    }
  };
}
