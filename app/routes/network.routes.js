/**
 *
 * Created by Matthias on 11/5/15.
 */
'use strict';
var passport = require('passport');

module.exports = function(app){
    var networkController = require('../controllers/networks.server.controller.js');

    app.route('/networks/readFromFile').get(networkController.loadFromFile);
    app.route('/networks/addNetwork').post(passport.authenticate('session'), requiresLogin,networkController.addNetwork);
    app.route('/networks/updateNetwork').put(passport.authenticate('session'), requiresLogin,networkController.updateNetwork);
    app.route('/networks/deleteNetwork').put(passport.authenticate('session'), requiresLogin, networkController.deleteNetwork);
    app.route('/networks/getUniqueAttrs').get(networkController.getUniqueAttrs);
    app.route('/networks/doSearchOld').post(networkController.getNetworks);
    app.route('/networks/syncElastic').get(networkController.syncElastic);
    app.route('/networks/updateDate').get(networkController.addDate);
    app.route('/networks/getJSON').get(passport.authenticate('session'), requiresLogin, networkController.JSONDump);
    app.route('/networks/updateJSON').post(passport.authenticate('session'), requiresLogin, networkController.updateJSON);
    app.route('/networks/uploadGML').post(passport.authenticate('session'), requiresLogin, networkController.uploadGML);
    app.route('/networks/downloadGML').put(passport.authenticate('session'), requiresLogin, networkController.downloadGML);
    app.route('/networks/getLinkRot').get(passport.authenticate('session'), requiresLogin, networkController.getLinkRot);

    function requiresLogin(req, res, next){
      	if (!req.isAuthenticated()) {
            return res.status(401).send({
                message: 'User is not logged in'
            });
	    }
    	next();
    }

};
