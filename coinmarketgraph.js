//Get the price graph from CoinMarketCap through my own server to bypass cross-domain restrictions
async function getGraph(id) {
    try {
        let response = await fetch("./api/coinmarketcap_graph.php?coin=" + id);
        //For local testing
        //let response = await fetch("http://shawntabrizi.com/coinmarketgraph/api/coinmarketcap_graph.php?coin=" + id);
        let data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

//Unpack a multi-dimensional array
function unpack(rows, index) {
    return rows.map(function (row) {
        return row[index];
    });
}


//Create graph using Plotly.js
function createGraph(data, data2) {
    var graph = document.getElementById('graph');

    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: "Bitcoin - USD",
        x: unpack(data.price_usd, 0),
        y: unpack(data.price_usd, 1),
        line: {
            color: '#17BECF'
        }
    }

    var trace2 = {
        type: "scatter",
        mode: "lines",
        name: "Ethereum - USD",
        x: unpack(data2.price_usd, 0),
        y: unpack(data2.price_usd, 1),
        line: {
            color: '#7F7F7F'
        },
        //this plot gets its own y axis
        yaxis: "y2"
    }

    var data = [trace1, trace2];

    var layout = {
        title: 'Bitcoin vs Ethereum',
        xaxis: {
            autorange: true,
            rangeselector: {
                buttons: [
                    {
                        count: 1,
                        label: '1m',
                        step: 'month',
                        stepmode: 'backward'
                    },
                    {
                        count: 3,
                        label: '3m',
                        step: 'month',
                        stepmode: 'backward'
                    },
                    {
                        count: 6,
                        label: '6m',
                        step: 'month',
                        stepmode: 'backward'
                    },
                    { step: 'all' }
                ]
            },
            rangeslider: {},
            type: 'date'
        },
        yaxis: {
            autorange: true,
            type: 'linear'
        },
        yaxis2: {
            autorange: true,
            type: 'linear',
            overlaying: "y",
            side: "right"
        }
    };


    Plotly.plot(graph, data, layout);
}

async function printGraph() {
    var data = await getGraph("bitcoin");
    var data2 = await getGraph("ethereum");

    if (data) {
        createGraph(data, data2);
    }

}

printGraph();