$(function() { // on dom ready

    var cy = cytoscape({
        container: document.getElementById('cy'),

        boxSelectionEnabled: false,
        autounselectify: true,
        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(id)'
            })
            .selector('edge')
            .css({
                'width': 6,
                'target-arrow-shape': 'triangle',
                'line-color': '#ffaaaa',
                'target-arrow-color': '#ffaaaa',
                'curve-style': 'bezier'
            })
            .selector('.secondHighlight')
            .css({
                'background-color': '#FF3333',
                'line-color': '#FF3333',
                'target-arrow-color': '#FF3333',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            })
            .selector('.resetHighlight')
            .css({
                'background-color': '#C0C0C0',
                'line-color': '#C0C0C0',
                'target-arrow-color': '#C0C0C0',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            })
            .selector('.highlighted')
            .css({
                'background-color': '#0000CC',
                'line-color': '#0000CC',
                'target-arrow-color': '#0000CC',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            }),
        //       zoomingEnabled: false,
        // userPanningEnabled: false,
        // boxSelectionEnabled: false,
        // autoungrabify: true,

        elements: {
            nodes: [
                { data: { id: 'ClientRequest' } },
                { data: { id: 'LoadBalancing' } },
                { data: { id: 'Server1' } },
                { data: { id: 'Server2' } },
                { data: { id: 'Server3' } },
            ],

            edges: [
                { data: { id: 'Load BalancerS1', weight: 1, source: 'ClientRequest', target: 'LoadBalancing' } },
                { data: { id: 'Load BalancerS2', weight: 1, source: 'LoadBalancing', target: 'Server1' } },
                { data: { id: 'Load BalancerS3', weight: 1, source: 'LoadBalancing', target: 'Server2' } },
                { data: { id: 'Load BalancerS4', weight: 1, source: 'LoadBalancing', target: 'Server3' } },
            ]
        },

        layout: {
            name: 'breadthfirst',
            directed: true,
            roots: '#ClientRequest',
            padding: 10
        }

    }); // cy init

    // cy.viewport({
    //   zoom: 1,
    //   pan: { x: 300, y: 75}
    // });

    // on tap to start process
    cy.on('tap', 'node', function() {
        /////////////////////////// Functions needed ///////////////////////////////////////////////////
        function iteration(step, node1Conn, node2Conn, node3Conn, currentNode, latency, cpu, region) {
            this.step = step;
            this.node1Conn = node1Conn;
            this.node2Conn = node2Conn;
            this.node3Conn = node3Conn;
            this.currentNode = currentNode;
            this.latency = latency;
            this.cpu = cpu;
            this.region = region;
        }

        var graph = [];

        function roundRobin(array) {
            //constructor(step, node1Conn, node2Conn, node3Conn, currentNode, latency, cpu, region )

            var node1 = 1;
            var node2 = 2;
            var node3 = 3;
            var node1Conn = 0;
            var node2Conn = 0;
            var node3Conn = 0;
            var n = 1;

            for (var i = 0; i < 20; i++, n++) {
                var it;

                if (n > 3)
                    n = 1;

                if (n === 1) {
                    node1Conn++;
                    it = new iteration(i, node1Conn, node2Conn, node3Conn, node1, 0, 0, "USA");
                } else if (n === 2) {
                    node2Conn++;
                    it = new iteration(i, node1Conn, node2Conn, node3Conn, node2, 0, 0, "USA");
                } else if (n === 3) {
                    node3Conn++;
                    it = new iteration(i, node1Conn, node2Conn, node3Conn, node3, 0, 0, "USA");
                }

                array.push(it);
            }
            printResults(array);
            return array;
        }

        roundRobin(graph);

        // start of first node
        var bfs = cy.elements().bfs('#ClientRequest', function() {}, true);

        // set counters for the set and remove elements
        function isOdd(num) {
            return num % 2; }
        var set = 1;
        var i = 0;
        remove = 0;
        var serv1 = 3;
        var serv2 = 5;
        var serv3 = 7;

        //Function to read from array and output to graph
        var highlightNextEle = function() {
            // Add edge highlight
            if (i < graph.length && isOdd(set) == 1) {
                // test for all three servers
                if (graph[i].currentNode == 1) {
                    server = serv1;
                    remove = serv1;
                }
                if (graph[i].currentNode == 2) {
                    server = serv2;
                    remove = serv2;
                }
                if (graph[i].currentNode == 3) {
                    server = serv3;
                    remove = serv3;

                }
                bfs.path[server].addClass('highlighted');
                set++;
                i++;
                setTimeout(highlightNextEle, 1000);


            }
            // Remove edge highlight
            else if (i < graph.length && isOdd(set) == 0) {
                bfs.path[remove].removeClass('highlighted');
                set++;
                setTimeout(highlightNextEle, 1000);
            }
        };

        bfs.path[4].addClass('resetHighlight');
        bfs.path[6].addClass('resetHighlight');
        bfs.path[8].addClass('resetHighlight');
        //bfs.path[2].addClass('secondHighlight');
        highlightNextEle();

        //////////////////////////////////////////////////////////////////////////////////////////////////


    }); // on tap

}); // on dom ready
