/**
 *
 * Created by Matthias on 11/3/15.
 */
'use strict';

var mongoose = require('mongoose'),
    mongoosastic = require('mongoosastic'),
    config = require('../../config/config'),
    _ = require('lodash'),
    mw = require('nodemw');

var client = new mw(config.wiki);

module.exports = function (app) {

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
        inWiki: {
            type: Boolean,
            default: false
        },
        oldTitle: {
            type: String,
            default: ''
        },
        graphs: [{
            name: String,
            nodes: Number,
            edges: Number,
            fileSize: String,
            fileType: String,
            fileFormat: String,
            downloadLink: String
        }],
        brokenLinks:[{
            networkTitle: String,
            linkType: String,
            url:String,
            reason: String,
            brokenLinkResult: {}
        }],
        updateDate:{ type:Date },
        gml:{
            name:String,
            path:String
        },
        suggestedBy:String,
        suggestedByUrl: String,
        email: String
    });
/*
    NetworkSchema.post('save', function (doc) {
        if (!client || (doc == undefined)) return;
//
        var linkRot = _.reduce(doc.brokenLinks, function(accum, b){
            console.log('B!!');
            console.log(b);
            var bP = JSON.parse(b);
            console.log(bP);
            return accum  +
                'Reason: '+ bP.brokenLinkResult.brokenReason +
                ' Type: ' + bP.type                    +
                ' Url: '  + bP.url +'\n';
        },'');
        //

        var linkRot = '';

        _.forEach(doc.brokenLinks, function(b){
            if(b){
               console.log(b);
               linkRot +=
                    'Reason: '+ b.brokenLinkResult.brokenReason+
                    ' Type: ' + b.linkType +
                    ' Url: '  + b.url +'\n';
            }
        });

        var infoBox = '== Network == \n ' +
            '{{Infobox \n' +
            '  | title  = '           + doc.title + '\n' +
            '  | label1 = Network Domain \n' +
            '  | data1  = '   + doc.networkDomain + '\n' +
            '  | label2 = Sub Domain \n' +
            '  | data2  = '       + doc.subDomain + '\n' +
            '  | label3 = Description \n' +
            '  | data4  = '     + doc.description + '\n' +
            '  | label5 = Hosted By \n' +
            '  | data5  = '        + doc.hostedBy + '\n' +
            '  | label6 = Node Type \n' +
            '  | data6  = '        + doc.nodeType + '\n' +
            '  | label7 = Edge Type \n' +
            '  | data7  = '        + doc.edgeType + '\n' +
            '  | label8 = Graph Properties \n' +
            '  | data8  = ' + doc.graphProperties + '\n' +
            '  | label9 = Source Url \n' +
            '  | data9  = '       + doc.sourceUrl + '\n' +
            '  | label10 = Citation  \n' +
            '  | data10  = '        + doc.citation + '\n' +
            '  | label11 = Min Nodes \n' +
            '  | data11  = '        + doc.minNodes + '\n' +
            '  | label12 = Max Nodes \n' +
            '  | data12  = '        + doc.maxNodes + '\n' +
            '  | label13 = Min Edges  \n' +
            '  | data13  = '       + doc.minEdges + '\n' +
            '  | label14 = Max Edges  \n' +
            '  | data14  = '       + doc.maxEdges + '\n' +
            '  | label15 = Update Date \n' +
            '  | data15  = '      + doc.updateDate + '\n' +
            '}}\n' ;

        var graphsBoxes = '== Graphs == \n';
        _.forEach(doc.graphs, function(g){
            graphsBoxes +=
                '  Nodes ='       + g.nodes         + '\n' +
                'Edges ='       + g.edges         + '\n' +
                'File Size ='   + g.fileSize      + '\n' +
                'File Type ='    + g.fileType      + '\n' +
                'File Format =' + g.fileFormat    + '\n' +
                'Download Link =' + g.downloadLink + '\n' +
                '}}';
        });

        var content =
            '== Description == \n' +
            doc.description.trim() + '\n' +
            infoBox +
            graphsBoxes +
            '== Link Rot ==\n' +
            linkRot +
            '<noinclude>[[Category:networks-readOnly]]</noinclude>';


        //Checks if document is already in wiki
        if (doc.inWiki) {

            //TODO fix title change logic
            if (doc.oldTitle != '' && doc.title != doc.oldTitle) {
                console.log(doc.title + ' old: ' + doc.oldTitle);
                //Copy old public portion of page and then delete it
                client.getArticle(doc.oldTitle, function (err, oldContent) {
                    oldContent = oldContent.replace('{{:'+ doc.oldTitle + 'readOnly}}', '{{:'+ doc.title + 'readOnly}}');
                    client.edit(doc.title, oldContent, doc.description.trim(), function (err, ret) {
                        console.log('Should not be editing');
                        if (!err) {
                            client.purge([doc.oldTitle, doc.oldTitle + 'readOnly'], 'Title Change', function (err, ret) {
                                if (err) console.error(err);
                            });
                        } else {
                            console.error(err);
                        }
                    })
                });
            }
            //


            client.edit(doc.title + 'readOnly', content, doc.description.trim(), function(err,ret){
                console.error(err);
            });

        } else {

            var publicContent =
                '{{:' + doc.title + 'readOnly}}' +
                '[[Category:networks]]';

            client.edit(doc.title + 'readOnly', content, doc.description.trim(), function (err, res) {
                console.log('Should this be running');
                if (!err) {
                    client.edit(doc.title, publicContent, doc.description.trim(), function (err, res) {
                        console.log(err);
                    })
                }
            });
        }
    });

    NetworkSchema.post('remove', function (doc) {
        if (!client || !doc) return;
        console.log('removing from wiki');
        client.delete(doc.title, 'removed from site', function (err, res) {
            if (err) console.error(err);
        });
    });
*/

    
    NetworkSchema.plugin(mongoosastic, {
        hydrate: true,
        esClient: elasticClient
    });

    var Networks = mongoose.model('Network', NetworkSchema);

/*
    var stream = Networks.synchronize();

     var counter = 0;
     stream.on('data', function (err, doc) {
        counter++;
     });

     stream.on('close', function () {
        console.log('Indexed: ' + counter);
     });

     stream.on('error', function (err) {
        console.error(err);
     });
*/
};

