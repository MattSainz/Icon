/**
 * Created by Matthias on 1/13/16.
 */

angular.module('networks').service('dataService', ['socket', '$window', 'fileSCon', function(socket, $window, fileSCon){
    var _ = $window._;
    var subscribers = [];
    var hits = 0.0;

    function Data(){
        this.networks = [];
        this.loadingProgress = 0;
        this.isLoading = true;
        this.numNetworks = 0;
        this.domains = { data: [[]], labels:[]};
        this.properties = { data: [[]], labels:[]};
        this.sizeDist = {data:[[]], labels:[]};
    }

    var data = new Data();

    this.subscribe = function(cb){
       subscribers.push(cb);
       cb(null, data);
    };

    this.reset = function(){
        data = new Data();
        hits = 0.0;
    };

    function update(){
        _.forEach(subscribers, function(cb){
           cb(null, data);
        });
    }

    socket.on('dataSegment', function(newNetworks){
        hits += newNetworks.hits.hits.length;
        data.loadingProgress = (hits / newNetworks.hits.total)*100;
        data.networks = _.union(data.networks, processRawNetworks(newNetworks.hits.hits));

        socket.emit('scroll', newNetworks._scroll_id);

        if(hits === newNetworks.hits.total){
            data.numNetworks = newNetworks.hits.total;
            data.isLoading = false;
            genNetworkStats();
        }

        update();
    });

    //Do any needed conversions and add any frontend required variables
    function processRawNetworks(networks){
        return _.map(networks, function(network){
            network.state = 'list';
                //sets ui state to list view instead of expanded tab

            //converts raw file size from bytes to mb or gb
            _.map(network._source.graphs, function(graph){
                graph.fileSize = fileSCon.convert(graph.fileSize);
                return graph;
            });

            var len = network._source.graphs.length;
            network.avgNodes = _.reduce(network._source.graphs, function(accum, g){
                accum += g.nodes;
                return accum;
            },0) / len;
            network.avgEdges = _.reduce(network._source.graphs, function(accum, g){
                accum += g.edges;
                return accum;
            },0) / len;

            return network;
        });
    }

    /*
        Get stats about number of domains for this query
        and other info and format it in a way it can be rendered by chart.js
        ...should probability be done within mongodb using stored javascript
     */
    function genNetworkStats(){

       //Get the counts of unique domains
       data.domains = _.reduce(_.groupBy(data.networks, function(n){
           return n._source.networkDomain;
       }), function(toRet, val, key){
           toRet.labels.push(key);
           toRet.data[0].push(val.length);
           return toRet;
       }, data.domains);

       //Get the counts of unique graph properties (Stored as a string of comma separated
       //properties
       data.properties = _.reduce(_.groupBy(_.reduce(data.networks, function(arr, n){
           return arr.concat(_.map(n._source.graphProperties.split(','), function(nTrim){
               return nTrim.trim();
           }));
       },[]), function(n){
           return n;
       }), function(toRet, val, key){
           toRet.labels.push(key);
           toRet.data[0].push(val.length);
           return toRet;
       }, data.properties);

       var nearestPower = function(n){
           return Math.pow(10, n.toString().length - 1);
       };

       var individualGraphs = _.flatten(_.reduce(data.networks, function(toRet, n){
          toRet.push(n._source.graphs);
          return toRet;
       },[]));

       //Get range of graph sizes for the current data
       var nodes = _.map(individualGraphs, function(n){ return n.nodes });
       var edges = _.map(individualGraphs, function(n){ return n.edges});
       var sizeDistNodes = _.reduce(_.groupBy(nodes , nearestPower), function(iter, arr, key){
           iter.labels.push(key);
           iter.data.push(arr.length);
           return iter;
       },{labels:[], data:[]});

       var sizeDistEdges = _.reduce(_.groupBy(edges, nearestPower), function(iter, arr, key){
           iter.labels.push(key);
           iter.data.push(arr.length);
           return iter;
       },{labels:[], data:[]});

       data.sizeDist = {
            data: [sizeDistNodes.data, sizeDistEdges.data],
            labels: sizeDistNodes.labels
       };
    }

}]);
