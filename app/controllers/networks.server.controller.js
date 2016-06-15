/**
 *
 * Created by Matthias on 11/3/15.
 */

'use strict';

var _ = require('lodash'),
    errorHandler = require('./errors.server.controller.js'),
    mongoose = require('mongoose'),
    Networks = mongoose.model('Network'),
    TmpNetworks = mongoose.model('TmpNetwork'),
    async = require('async'),
    path = require('path'),
    Q = require('q');

var fs = require('fs');

var uniqueAttrs = [
    'networkDomain',
    'subDomain',
    'graphProperties',
    'minEdges',
    'maxEdges',
    'minNodes',
    'maxNodes'
];

function save(notTmp, req, res){
    var model = (notTmp) ? Networks : TmpNetworks;

    if(notTmp && req.body.email) delete req.body.email;
        //Don't save contributor's email in the public db

    //Must save for sync to elasticsearch
    if(req.body._id == 'new'){
      delete req.body._id;
      console.log(req.body);
      console.log('=========');
      new model(req.body).save(function(err, ret){
          console.log(ret);
          if (err) return res.status(400).send({ error: err });
          return res.status(200).send({message:'Save successful', id:ret._id});
      });
    } else {
        model.findOne({'_id':req.body._id}, function(err, doc){
            _.assign(doc, req.body);
            doc.save(function(err, ret){
                if (err) return res.status(400).send({ error: err });
                return res.status(200).send({message:'Save successful', id:ret._id});
            });
        });
    }

}

exports.saveNetwork = function(req, res){
    save(true, req, res);
};

exports.saveTmpNetwork = function(req, res){
    save(false, req, res);
};

exports.getTmpNetworks = function(req, res){
  TmpNetworks.find({}, function(err, ret){
      if(err){
          res.status(400).send({
              message: errorHandler.getErrorMessage(err)
          })
      } else {
          res.status(200).send({
              message: (req.user) ? ret : _.map(ret, function(n){
                 console.log(n);
                 if( n.email ){
                    delete n.email;
                 }
                 return n;
              })
          });
      }
  })
};

function deleteN (isNormal, req, res) {

    var model = (isNormal) ? Networks : TmpNetworks;

    console.log(req.body);
    model.findById(req.body.id, function (err, doc) {
        if (err) {
            return res.status(400).send(err);
        } else {
            if (doc) {
                doc.remove(function (err) {
                    if (err) return res.status(400).send(err);
                    return res.status(200).send({message: 'Document Deleted'});
                });
            } else {
                return res.status(400).send({message: 'Document not found'});
            }
        }
    });
}

module.exports.deleteNetwork = function(req, res){
   deleteN(true, req, res);
};

module.exports.deleteTmpNetwork = function(req, res){
    deleteN(false, req, res);
};

module.exports.makeTmpPublic = function(req, res){
   TmpNetworks.remove({_id: req.body._id}, function(err){
      if(err) return res.status(400).send(err);

      delete req.body._id;
      new Networks(req.body).save(function(err, ret){
          if(err) return res.status(400).send(err);
          return res.status(200).send({message:'Successfully Made Public'})
      });
   });
};

exports.getUniqueAttrs = function (req, res) {
    async.map(uniqueAttrs, function (attr, cb) {
        Networks.find().distinct(attr, function (err, uniqAttrs) {
            if (err) {
                return cb(err, null);
            } else {
                var toRet = {};
                toRet['attrCat'] = attr;
                toRet['attrs'] = uniqAttrs;
                return cb(null, toRet);
            }
        });
    }, function (err, unique) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {

            processAttributes(unique, function (err, data) {
                if (err) {
                    return res.status(400).send({
                        message: err
                    });
                } else {
                    return res.status(200).send(data);
                }
            });

        }
    });

};

exports.addDate = function(req, res){
  Networks.find({}, function(err, content){
      _.forEach(content, function(o){
          o.updateDate = Date.now();
          o.save(function(err, ret){
            console.log(ret);
          });
      });
  });
};

exports.JSONDump = function(req, res){

  Networks.find({}, function(err, content){
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(content, null, 2));
  });

};

exports.updateJSON = function(req, res){

    var bulkNetwork = Networks.collection.initializeUnorderedBulkOp();
    var runBulk = false;
    var doneSavingNew = Q.defer();

    var newDocs = [];
    req.body.forEach(function(doc){
       if(doc._id.toLowerCase() == 'new') {
           delete doc._id;
           newDocs.push(doc);
       }else{
           runBulk = true;
           bulkNetwork.find({'_id':doc._id}).save(doc);
       }
    });

    if( newDocs.length > 0 ) {
        Networks.create(newDocs, function (err, toRet) {
            (err) ? doneSavingNew.resolve(err) : doneSavingNew.resolve(toRet);
        });
    } else {
        doneSavingNew.resolve(false);
    }


    doneSavingNew.promise.then(function(isDocs){
        if(runBulk) {
            bulkNetwork.execute(function (err, result) {
                if (!err) {
                    res.status(200).send({message: 'Successfully Updated'})
                } else {
                    res.status(400).send({message: 'Error Saving Networks'})
                }
            });
        } else if(isDocs){
            res.status(200).send({message: 'Successfully Saved'});
        } else {
            res.status(400).send({message:'No Documents Found to Insert or Update'})
        }
    });

};

exports.uploadGML = function(req, res){
    res.status(200).send({path:req.files.file.path})
};

exports.downloadGML = function(req, res){
   var file = req.body.path;
   res.download(file);
};

exports.getLinkRot = function(req, res){
   Networks.find({}, function(err, content){
      var links = [];
      var brokenCount = 0;

      _.forEach(content, function(c){
           if( c.brokenLinks && c.brokenLinks.length > 0 ) {
               brokenCount++;
               links.push(c.brokenLinks);
           }
      });
      console.log('Number of broken links: ' + brokenCount);

      res.status(200).send({
         message:links
      });
   });
};


/* Helper functions */

//TODO move to model
function processAttributes(unique, cb) {
    //Get unique graph properties
    unique[2].attrs = _.reduce(unique[2].attrs, function (curr, elem) {
        return _.union(curr, _.map(elem.split(','), function (s) {
            return s.trim().toLowerCase();
        }));
    }, []);

    var nearestPower = function (n) {
        return Math.pow(10, n.toString().length - 1);
    };

    //Get range of graph sizes
    unique[3].attrs = _.reduce(_.groupBy(unique[3].attrs, nearestPower), function (iter, arr, key) {
        iter.labels.push(key);
        iter.data.push(arr.length);
        return iter;
    }, {labels: [], data: []});

    unique[4].attrs = _.reduce(_.groupBy(unique[4].attrs, nearestPower), function (iter, arr, key) {
        iter.labels.push(key);
        iter.data.push(arr.length);
        return iter;
    }, {labels: [], data: []});

    unique[5].attrs = _.reduce(_.groupBy(unique[5].attrs, nearestPower), function (iter, arr, key) {
        iter.labels.push(key);
        iter.data.push(arr.length);
        return iter;
    }, {labels: [], data: []});

    unique[6].attrs = _.reduce(_.groupBy(unique[6].attrs, nearestPower), function (iter, arr, key) {
        iter.labels.push(key);
        iter.data.push(arr.length);
        return iter;
    }, {labels: [], data: []});

    unique = _.map(unique, function (o) {
        if (o.attrs.constructor != Array && typeof(o.attrs) === 'object') {
            o.attrs['state'] = '';
            if (o.attrCat.indexOf('max') == -1) {
                o.attrs['comparison'] = 'gte';
            } else {
                o.attrs['comparison'] = 'lte';
            }
        } else {
            o.attrs = _.map(o.attrs, function (a) {
                return {value: a, state: ''}
            })
        }
        return o;
    });

    var toRet = {
        checkbox: unique.slice(0, 3),
        size: unique.slice(3, unique.length)
    };

    return cb(null, toRet);
}
