/**
 * Created by Matthias on 9/12/15.
 */

'use strict';

var _ = require('lodash'),
        errorHandler = require('./errors.server.controller.js'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        TextContent = mongoose.model('TextContent');

exports.addContent = function(req, res){

    /*
    passport.authenticate('local', function(err, user, info){

        if(err || !user){
            res.status(400).send(info);
        } else {
    */
            var newContent = new TextContent(req.body);

            newContent.save(function(err){
                if(err){
                    console.log("In err");
                    console.log(err);
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    console.log("Not in error but Err returned?");
                    return res.status(201).send({
                        message: 'New Content Created'
                    });

                }

            });
        /*
        }//end auth

    });//end passport
    */

};//end addContent

exports.deleteContent = function(req, res){
    console.log(req);
    TextContent.remove({ _id: req.params._id }, function(err) {
        if (!err) {
            res.status(200).send({
                message : 'Item Deleted'
            });
        }
        else {
            res.status(500).send({
                message : 'Unable to Delete Item'
            });
        }
    });
};

exports.updateContent = function(req, res){
    console.log(req);
    TextContent.findById(req.body._id, function(err, oldEntry){
        oldEntry.title = req.body.title;
        oldEntry.contentBody= req.body.contentBody;

        oldEntry.save(function(err){
            if(err){
                return res.status(400).send({
                    message:'unable to update entry'
                })
            } else {
                return res.status(200).send({
                   message:'Update successful'
                }) ;
            }
        });
    });
};

exports.getContent = function(req, res){
    TextContent.find({}, function(err, content){
       if(err)
       {
          return res.status(500).send({
              message:err
          })
       }else{
          return res.status(200).send({
              message: content
          });
       }

    });

};
