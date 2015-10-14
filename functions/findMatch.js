module.exports = function (thisUser, allUsers) {
  var currentUser;
  var compaired = {};

  // compair this user to all the userers in the database
  for (var i = 0; i < allUsers.docs.length; i++) {
    console.log("checking "+allUsers.docs[i]._id);
    var values = [], diff, total = 0;
    currentUser = allUsers.docs[i];
    for (var key in currentUser.data) {
      // check if key is correct, it will alsways be correct but just in case.
      if (currentUser.data.hasOwnProperty(key) && thisUser.hasOwnProperty(key)) {
        diff = thisUser[key] / currentUser.data[key]; // calculate diff
        if (diff > 1) {
          diff = Math.pow(diff,-1); // we only want numbers below 100%
        }
        values.push(diff);
      }
      }
    for (var j = 0; j < values.length; j++) {
      total += values[j];
    }
    compaired[allUsers.docs[i]._id] = total/values.length;
  }
  // find the user with the highest maths
  var i = 0;
  var highest;
  for (key in compaired) {
    if (compaired.hasOwnProperty(key)) {
      if (i == 0) {
        highest = key;
      }
      else {
        console.log(compaired[key]+" > "+compaired[highest]);
        if (compaired[key] > compaired[highest]) {
          highest = key;
        }
      }
      i++;
    }
  }
  console.log("log:");
  console.log(allUsers);

  var data = {};
  for (var i = 0; i < allUsers.docs.length; i++) {
    if (allUsers.docs[i]._id == highest) {
      data = allUsers.docs[i].data;
      break;
    }
  }

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
