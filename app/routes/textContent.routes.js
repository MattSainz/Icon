/**
 * Created by Matthias on 9/12/15.
 */

var passport = require('passport');

module.exports = function(app){
    var textContent = require('../../app/controllers/textContent.server.controller');

    app.route('/textContent/addContent').post(textContent.addContent);
    app.route('/textContent/updateEntry').put(textContent.updateContent);
    app.route('/textContent/getContent').get(textContent.getContent);
    app.route('/textContent/deleteContent/:_id').delete(textContent.deleteContent);
};
