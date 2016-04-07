/**
 *
 * Created by Matthias on 2/28/16.
 */

var _ = require('lodash'),
    blc = require('broken-link-checker'),
    mongoose = require('mongoose'),
    async = require('async'),
    Networks = mongoose.model('Network');

var links = [];

function storeLink(result, customData) {

    if (result.broken) {
        links.push({
            networkTitle: customData.networkTitle,
            type: customData.type,
            url: customData.url,
            brokenLinkResult: result,
            _id: customData.networkId
        });
    }

}

function end() {
    async.each(links, function (result, cb) {
        Networks.findById(result._id, function (err, doc) {
            console.log('Saving: ' + doc.title);

            if (err) {
                console.log(err);
                cb(err);
                return;
            }

            if (doc.brokenLinks) {
                doc.brokenLinks.push({
                    networkTitle: result.networkTitle,
                    linkType: result.type,
                    url: result.url,
                    brokenLinkResult: result.brokenLinkResult,
                    reason: result.brokenLinkResult.brokenReason
                });
            } else {
                doc.brokenLinks = [{
                    networkTitle: result.networkTitle,
                    linkType: result.type,
                    url: result.url,
                    brokenLinkResult: result.brokenLinkResult,
                    reason: result.brokenLinkResult.brokenReason
                }];
            }

            doc.save(function (err, res) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Added or Updated: ' + doc.networkTitle);
                }
                cb(err);
            });

        });
    }, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Done with link sync');
        }
    });
    console.log('Not Running async');
}

module.exports = function () {


    var urlChecker = new blc.UrlChecker({requestMethod: 'get'}, {
        link: storeLink,
        end: end
    });

    function check(network) {
        urlChecker.enqueue(network.sourceUrl, '', {
            type: 'sourceUrl',
            url: network.sourceUrl,
            networkId: network._id,
            networkTitle: network.title
        });

        _.forEach(network.graphs, function (graph) {
            urlChecker.enqueue(graph.downloadLink, '', {
                type: 'graphDownloadUrl',
                url: graph.downloadLink,
                networkId: network._id,
                networkTitle: graph.name
            });
        });

    }

    Networks.find({}, function (err, res) {
        if (err) {
            console.error('Error loading Networks for link detection');
            return;
        }
        _.forEach(res, function (network) {

             if(network.brokenLinks && network.brokenLinks.length > 0){
                 network.brokenLinks = [];
                 network.save(function(err, ret){
                     if(!err){
                         check(network);
                     }
                 });
             }else{
                 check(network);
             }

        });
    });
};

