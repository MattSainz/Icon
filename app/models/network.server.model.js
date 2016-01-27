/**
 *
 * Created by Matthias on 11/3/15.
 */
'use strict';

var mongoose     = require('mongoose'),
    mongoosastic = require('mongoosastic'),
    config       = require('../../config/config'),
    _            = require('lodash');


module.exports = function(app) {

    var elasticClient = app.settings['elastic'];
    var Schema = mongoose.Schema;

    var NetworkSchema = new Schema({
        title: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            dropDups: true
        },
        networkDomain: {
            type: String,
            trim: true
        },
        subDomain: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        hostedBy: {
            type: String,
            trim: true
        },
        nodeType: {
            type: String,
            trim: true
        },
        edgeType: {
            type: String,
            trim: true
        },
        graphProperties: {
            type: String,
            trim: true
        },
        sourceUrl: {
            type: String,
            trim: true
        },
        citation: {
            type: String,
            trim: true
        },
        minNodes: {
            type: Number,
            default: 0
        },
        minEdges: {
            type: Number,
            default: 0
        },
        maxNodes: {
            type: Number,
            default: 0
        },
        maxEdges: {
            type: Number,
            default: 0
        },
        graphs: [{
            name: String,
            nodes: Number,
            edges: Number,
            fileSize: String,
            fileType: String,
            fileFormat: String,
            downloadLink: String
        }]
    });


    NetworkSchema.plugin(mongoosastic, {
        hydrate: true,
        esClient: elasticClient
    });

    var Networks = mongoose.model('Network', NetworkSchema);

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

    /*
    var functions ={
        updateDoc:function(toUpdate, id, cb){
            var Networks = mongoose.model('Network');
            Networks.findById(id, function(err, doc){
            if(err) return cb(err, null);

            _.forEach(toUpdate, function(val, key){
                doc[key] = val;
            });

            doc.save(function(err){
               if(err) cb(err, null);
                   return cb(null, doc);
               });
            });
        },
        updateElastic:function(){
             var stream = Networks.synchronize();

             var counter = 0;
             stream.on('data', function(err, doc){
                 counter++;
                 console.log(counter);
             });

             stream.on('close', function(){
                console.log('Indexed: ' + counter);
             });

             stream.on('error', function(err){
                console.error(err);
             });
        }
    };
    */


};

