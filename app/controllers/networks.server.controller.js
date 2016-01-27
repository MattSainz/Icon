/**
 *
 * Created by Matthias on 11/3/15.
 */

'use strict';

var _ = require('lodash'),
        errorHandler = require('./errors.server.controller.js'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        networkModel = require('../models/network.server.model.js'),
        Networks = mongoose.model('Network'),
        async = require('async');

var fs = require('fs');

var uniqueAttrs = [
    'networkDomain',
    'subDomain',
    'graphProperties',
    'maxEdges',
    'minEdges',
    'maxNodes',
    'minNodes'
];

exports.addNetwork = function(req, res){
    var newData = new Networks(req.body._source);
    newData.save(function(err){
        console.log(err);
        if(err){
           return res.status(500).send({
             message: errorHandler.getErrorMessage(err)
           });
        }else{
           return res.status(200).send({
               message: 'Networks Successfully Added'
           });
        }
    });
};

exports.deleteNetwork = function(req, res){
    Networks.findById(req.body.id, function(err, doc){
        if(err){
           return res.status(500).send(err);
        }else{
            if(doc){
                 doc.remove(function(err){
                     if(err) return res.status(500).send(err);
                         return res.status(200).send({message:'Document Deleted'});
                });
            }else{
                return res.status(500).send({message:'Document not found'});
            }
        }
    });
};

exports.updateNetwork = function(req, res){

    if(!req.body){
        return res.status(500).send({
            message:'No Content provided'
        });
    }

    Networks.findById(req.body.id, function(err, doc){

        if(err) return res.status(500).send(err);

        if(doc) {
            _.forEach(req.body.data, function(val, key){
                doc[key] = val;
            });

            doc.save(function (err) {
                if (err) return res.status(500).send(err);
                return res.status(200).send({message: 'Document updated'});
            });
        }else{
            return res.status(500).send({message:'document not found'});
        }
    });


};

exports.getUniqueAttrs = function(req, res){
    async.map(uniqueAttrs, function(attr, cb){
        Networks.find().distinct(attr, function(err, uniqAttrs){
            if(err){
               return cb(err, null);
            }else{
                var toRet = {};
                toRet['attrCat'] = attr;
                toRet['attrs'] = uniqAttrs;
                return cb(null, toRet);
            }
        });
    },function(err, unique){
       if(err){
           return res.status(500).send({
               message: err
           });
       }else{

            processAttributes(unique, function(err, data){
               if(err){
                    return res.status(500).send({
                       message: err
                    });
               }else{
                   return res.status(200).send(data);
               }
            });

       }
    });

};

exports.getNetworks = function(req, res){

    if(!req.body.query){
        return res.status(500).send({
            message:'No query supplied'
        });
    }
    Networks.search(req.body.query, req.body.options, function(err, content){
        if( err ){
           return res.status(500).send({
             message: err
           });
        }else{
           return res.status(200).send({
               message: content
           });
        }
    });

};


//TODO move to model
exports.loadFromFile = function(req, res){
    console.log("Trying to read from file?");
    fs.readFile('/Users/Matthias/Code/Icon/app/controllers/codebeautify.json','utf8', function(err, data){

        if( err ){
            res.status(500).send({
              message: err
            });
        }else{
            var dataJson = JSON.parse(data)['data-sets']['data-set'];
            var groups = _.groupBy(dataJson, function(o){
               return o['GroupId'].replace('\ \g', '')
            });
            var result = [];
            var hostedBy = '';
            _.forEach(groups, function(value, key){
                console.log(value);
                console.log(key);

                var graphs = [];
                var maxEdges = 0;
                var maxNodes = 0;
                var minEdges = Number.MAX_VALUE;
                var minNodes = Number.MAX_VALUE;
                var fileFormat = '';
                var newFileType = '';

                _.forEach(value, function(g){
                    var nodes = Number.parseInt(g['Nodes']['__text']);
                    var edges = Number.parseInt(g['Edges']['__text']);

                    if( maxEdges < edges ) maxEdges = edges;
                    if( maxNodes < nodes) maxNodes = nodes;
                    if( minEdges > edges ) minEdges = edges;
                    if( minNodes > nodes) minNodes = nodes;

                    fileFormat = 'unknown';
                    newFileType = g.FileType;
                    switch(g.FileType.trim().toLowerCase()){
                        case 'gml':
                            fileFormat = 'gml';
                            newFileType  = 'txt';
                            break;
                        case 'graphml':
                            fileFormat = 'graphML';
                            newFileType = 'txt';
                            break;
                        case 'edgelist':
                            fileFormat = 'edgelist';
                            newFileType = 'txt';
                            break;
                        case 'xml':
                            fileFormat = 'edgelist';
                            newFileType = 'xml';
                            break;
                    }

                    graphs.push({
                        name: g.Name,
                        nodes: g['Nodes']['__text'],
                        edges: g['Edges']['__text'],
                        fileSize: g.FileSize,
                        fileType: newFileType,
                        fileFormat: fileFormat,
                        downloadLink: g.DataLink
                    });
                });
                var groupInfo = value[0];

                hostedBy = groupInfo.GroupDescription.match(/\.\s*(data|hosted|collected)\s.+by.*/gi);
                if(hostedBy) hostedBy = String(hostedBy).replace(/\./g, '');
                var newDesc = groupInfo.GroupDescription.replace(/\.\s*(data|hosted|collected)\s.+by.*/gi,'');

                result.push({
                      title:           key,
                      networkDomain:   groupInfo.Domain.trim(),
                      subDomain:       groupInfo.SubDomain.trim(),
                      description:     newDesc,
                      hostedBy:        hostedBy,
                      nodeType:        groupInfo.NodeType.trim(),
                      edgeType:        groupInfo.EdgeType.trim(),
                      graphProperties: groupInfo.GraphProperties.trim(),
                      sourceUrl:       groupInfo.InfoLink.trim(),
                      citation:        groupInfo.Citation.trim(),
                      maxNodes:        maxNodes,
                      maxEdges:        maxEdges,
                      minNodes:        minNodes,
                      minEdges:        minEdges,
                      graphs: graphs
                });
            });

            Networks.collection.insert(result, function(err, docs){
                if(err){
                    console.error(err)
                }else{
                    console.info('%d documents were added', docs.length);
                }
            });

            return res.status(200).send({
                message: 'This maybe worked...'
            });

        }

    });
};

exports.syncElastic = function(req, res){
    var stream = Networks.synchronize();

    var counter = 0;
    stream.on('data', function(err, doc){
       counter++;
    });

    stream.on('close', function(){
        console.log('Indexed: ' + counter);
    });

    stream.on('error', function(err){
        console.error(err);
    });

};


/* Helper functions */

//TODO move to model
function processAttributes(unique, cb){
   //Get unique graph properties
   unique[2].attrs = _.reduce(unique[2].attrs, function(curr, elem){
       return _.union(curr, _.map(elem.split(','), function(s){
           return s.trim();
       }));
   },[]);

   var nearestPower = function(n){
        return Math.pow(10, n.toString().length - 1);
   };

   //Get range of graph sizes
   unique[3].attrs = _.reduce(_.groupBy(unique[3].attrs, nearestPower), function(iter, arr, key){
       iter.labels.push(key);
       iter.data.push(arr.length);
       return iter;
   },{labels:[], data:[]});

   unique[4].attrs = _.reduce(_.groupBy(unique[4].attrs, nearestPower), function(iter, arr, key){
       iter.labels.push(key);
       iter.data.push(arr.length);
       return iter;
   },{labels:[], data:[] });

   unique[5].attrs = _.reduce(_.groupBy(unique[5].attrs, nearestPower), function(iter, arr, key){
       iter.labels.push(key);
       iter.data.push(arr.length);
       return iter;
   },{labels:[], data:[] });

   unique[6].attrs = _.reduce(_.groupBy(unique[6].attrs, nearestPower), function(iter, arr, key){
       iter.labels.push(key);
       iter.data.push(arr.length);
       return iter;
   },{labels:[], data:[] });

   unique = _.map(unique, function( o ){
       if(o.attrs.constructor != Array && typeof(o.attrs) === 'object'){
           o.attrs['state']  = '';
           if(o.attrCat.indexOf('max') == -1 ){
               o.attrs['comparison'] = 'gte';
           }else{
               o.attrs['comparison'] = 'lte';
           }
       }else{
           o.attrs = _.map(o.attrs, function(a){
               return {value:a, state:''}
           })
       }
       return o;
   });

   var toRet = {
        checkbox:unique.slice(0,3),
        size: unique.slice(3,unique.length)
   };

   return cb(null, toRet);
}
