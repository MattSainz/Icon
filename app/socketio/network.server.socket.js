/**
 * Created by Matthias on 11/14/15.
 */

'use strict';

var _ = require('lodash'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        Networks = mongoose.model('Network'),
        async = require('async');


module.exports = function(app){
  var io = app.get('io');
  var elastic = app.get('elastic');

  io.on('connection', function(socket){

      socket.on('doSearch', function(query){
          var hits = 0;
          elastic.search({
             index:'networks',
             body: query,
             size: 25,
             scroll: '30s'
          }, function getSection(err, response){
              if(err){
                 console.error(err);
              }else{
                  hits += response.hits.hits.length;

                  socket.emit('dataSegment', response);

                  if(hits !== response.hits.total ){
                      elastic.scroll({
                          scrollId: response._scroll_id,
                          scroll: '30s'
                      }, getSection);
                  }
              }

          });

      });

  });
};
