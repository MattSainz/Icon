/**
 * Created by Matthias on 9/12/15.
 */

var passport = require('passport');

module.exports = function(app){
    var textContent = require('../../app/controllers/textContent.server.controller');

    app.route('/textContent/addContent').post(passport.authenticate('session'), requiresLogin,textContent.addContent);
    app.route('/textContent/updateEntry').put(passport.authenticate('session'), requiresLogin, textContent.updateContent);
    app.route('/textContent/deleteContent').delete(passport.authenticate('session'), requiresLogin, textContent.deleteContent);
    app.route('/textContent/getContent').get(textContent.getContent);
    app.route('/textContent/getAboutPages').get(textContent.getAboutPages);

    function requiresLogin(req, res, next){
      	if (!req.isAuthenticated()) {
            return res.status(401).send({
                message: 'User is not logged in'
            });
	    }
    	next();
    }
};

