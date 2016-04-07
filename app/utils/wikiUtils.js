/**
 *
 * Created by Matthias on 2/22/16.
 */

var mw = require('nodemw'),
    mongoose = require('mongoose'),
    Networks = mongoose.model('Network'),
    blc = require('broken-link-checker'),
    _ = require('lodash');

var client = new mw({
    server: 'localhost',
    path: '',
    debug: true
});


function syncDb() {
    var urlChecker = new blc.UrlChecker({
        requestMethod:'get'
    }, {
        link: function(result){
            if(result.broken) console.log(result);
        },
        end: function () {
            console.log('done')
        }
    });
    Networks.find({}, function (err, results) {
        _.forEach(results, function (doc) {
            var objText = JSON.stringify(doc, null, 2);
            var content =
                '== Description == \n' +
                '<code> ' + doc.description.trim() + ' </code> \n' +
                '== JSON Entry ==  \n' +
                ' <syntaxhighlight lang="json">' + objText + '</syntaxhighlight>\n' +
                '== Link Rot ==\n' +
                '[[Category:networks]]';

            /*
             client.edit(doc.title, content, doc.description.trim(), function(err, res){
             (err) ? console.log(err) : console.log(res);
             });
             */
             urlChecker.enqueue(doc.sourceUrl);

        });
    });
}

module.exports = {
    syncDb: syncDb
};
