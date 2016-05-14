/**
 *
 * Created by Matthias on 1/13/16.
 */

angular.module('networks').factory('networkTemplate',[function(){
    return {
        _id:'new',
        state:'edit',
        _source:{
            citation:'Bibliographic entry, e.g., Lastname, Firstinitial, et al., "Title of paper." Journal Name 1(1), pageX - pageY (YYYY)',
            description:'Something about these networks ',
            hostedBy: 'Who is hosting the actual data',
            edgeType:'Edge Type',
            fileType: null,
            graphProperties: "New",
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
            sourceUrl: "URL for the reference listed below",
            subDomain: "New",
            title: "New",
            gml:{
                name:'',
                path:'n/a'
            },
            updateDate: Date.now()
        }
    }
}]);
