var mongoOperations = require('./mongo-operations');

function initialize(app, db) {

	//A GET request returning data for all sets in the database
  app.get('/setData.json', function(req, res) {
    mongoOperations.getAllSets(db, function(results) {
      res.json({
        sets: results
      });
    });
  });

}
exports.initialize = initialize;