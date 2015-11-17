/**
 *
 * Created by Matthias on 11/5/15.
 */
'use strict';
var passport = require('passport');

module.exports = function(app){
    var networkController = require('../controllers/networks.server.controller.js');

    app.route('/networks/readFromFile').get(networkController.loadFromFile);
    app.route('/networks/addNetwork').post(passport.authenticate('session'),networkController.addNetwork);
    app.route('/networks/updateNetwork').put(passport.authenticate('session'),networkController.updateNetwork);
    app.route('/networks/deleteNetwork').put(passport.authenticate('session'), networkController.deleteNetwork);
    app.route('/networks/getUniqueAttrs').get(networkController.getUniqueAttrs);
    app.route('/networks/doSearchOld').post(networkController.getNetworks);
    app.route('/networks/syncElastic').get(networkController.syncElastic);
};
