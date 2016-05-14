/**
 *
 * Created by Matthias on 11/5/15.
 */
'use strict';
var passport = require('passport');

module.exports = function(app){
    var networkController = require('../controllers/networks.server.controller.js');

    //Needs login
    app.route('/networks/deleteNetwork').put(passport.authenticate('session'), requiresLogin, networkController.deleteNetwork);
    app.route('/networks/deleteTmpNetwork').put(passport.authenticate('session'), requiresLogin, networkController.deleteTmpNetwork);
    app.route('/networks/saveNetwork').put(passport.authenticate('session'), requiresLogin, networkController.saveNetwork);
    app.route('/networks/makeTmpPublic').put(passport.authenticate('session'), requiresLogin, networkController.makeTmpPublic);
    app.route('/networks/getJSON').get(passport.authenticate('session'), requiresLogin, networkController.JSONDump);
    app.route('/networks/updateJSON').post(passport.authenticate('session'), requiresLogin, networkController.updateJSON);
    app.route('/networks/uploadGML').post(passport.authenticate('session'), requiresLogin, networkController.uploadGML);
    app.route('/networks/downloadGML').put(passport.authenticate('session'), requiresLogin, networkController.downloadGML);
    app.route('/networks/getLinkRot').get(passport.authenticate('session'), requiresLogin, networkController.getLinkRot);


    //public
    app.route('/networks/saveTmpNetwork').put(networkController.saveTmpNetwork);
    app.route('/networks/getUniqueAttrs').get(networkController.getUniqueAttrs);
    app.route('/networks/getTmpNetworks').get(networkController.getTmpNetworks);
    app.route('/networks/updateDate').get(networkController.addDate);

    function requiresLogin(req, res, next){
      	if (!req.isAuthenticated()) {
            return res.status(401).send({
                message: 'User is not logged in'
            });
	    }
    	next();
    }

};
