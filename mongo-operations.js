function getAllSets(db, callback) {
  db.collection('setData').createIndex({
      'artist': 1,
      'title': 1
    }, {
      unique: true
    },
    function() {
      db.collection("setData").find().toArray(function(err, results) {
        if (err) {
          console.log(err)
        } else {
          callback(results);
        }
      });
    }
  );
}
exports.getAllSets = getAllSets;