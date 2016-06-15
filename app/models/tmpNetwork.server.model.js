/**
 *
 * Created by Matthias on 5/11/16.
 */

'use strict';

var mongoose = require('mongoose'),
    mongoosastic = require('mongoosastic'),
    config = require('../../config/config'),
    _ = require('lodash'),
    mw = require('nodemw');

var client = new mw(config.wiki);

module.exports = function (app) {

    var Schema = mongoose.Schema;

    var TmpNetworkSchema = new Schema({
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
        brokenLinks: [{
            networkTitle: String,
            linkType: String,
            url: String,
            reason: String,
            brokenLinkResult: {}
        }],
        updateDate: {type: Date, default: Date.now},
        gml: {
            name: String,
            path: String
        },
        suggestedBy:String,
        suggestedByUrl: String,
        email: String

    });

    mongoose.model('TmpNetwork', TmpNetworkSchema);
};
