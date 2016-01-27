/**
 *
 * Created by Matthias on 1/13/16.
 */

angular.module('networks').factory('networkTemplate',[function(){
    return {
        _id:'new',
        state:'edit',
        _source:{
            citation:'Where you found this network(s)',
            description:'Something about these networks ',
            hostedBy: 'Who is hosting the actual data',
            edgeType:'Edge Tybe',
            fileType: null,
            graphProperties: "i.e Directed",
            graphs: [{
               downloadLink:'http://',
               edges:0,
               nodes:0,
               fileSize:'0',
               fileType:'txt',
               fileFormat:'edgelist',
               name:'New Network'
            }],
            maxEdges: 0,
            maxNodes: 0,
            networkDomain: "New",
            nodeType: "New",
            sourceUrl: "URL to where more info is",
            subDomain: "New",
            title: "New"
        }
    }
}]);
