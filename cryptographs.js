//Get the price graph from CoinMarketCap through my own server to bypass cross-domain restrictions
async function getCoinmarketcapGraph(id) {
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

//General Call API Function
async function callApi (url) {
    try {
        let response = await fetch(url);
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
function createGraph(trace1, trace2, title, type = "linear") {
    var graph = document.getElementById('graph');

    Plotly.purge(graph);

    var data = [trace1, trace2];

    var layout = {
        title: title,
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
            type: type
        },
        yaxis2: {
            autorange: true,
            type: type,
            overlaying: "y",
            side: "right"
        }
    };


    Plotly.plot(graph, data, layout);
}

async function compareCoins() {
    var data1 = await getCoinmarketcapGraph("bitcoin");
    var data2 = await getCoinmarketcapGraph("ethereum");

    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: "Bitcoin",
        x: unpack(data1.price_usd, 0),
        y: unpack(data1.price_usd, 1),
        line: {
            color: '#17BECF'
        }
    }

    var trace2 = {
        type: "scatter",
        mode: "lines",
        name: "Ethereum",
        x: unpack(data2.price_usd, 0),
        y: unpack(data2.price_usd, 1),
        line: {
            color: '#7F7F7F'
        },
        //this plot gets its own y axis
        yaxis: "y2"
    }

    createGraph(trace1, trace2, "Bitcoin VS Ethereum", "linear");

}

function squareData(data) {
    for (v in data.values) {
        let value = data.values[v];
        value.y = Math.pow(value.y, 2);
        data.values[v] = value;
    }

    data.name += " Squared";

    return data;
}

async function mLawBitcoin() {
    var price = await callApi('https://api.blockchain.info/charts/market-price?cors=true&timespan=all&format=json&lang=en');
    var txs = await callApi('https://api.blockchain.info/charts/n-transactions?cors=true&timespan=all&format=json&lang=en')

    var txsSquared = squareData(txs)

    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: price.name,
        x: unpack(price.values, 'x').map(x => x * 1000),
        y: unpack(price.values, 'y'),
        line: {
            color: '#17BECF'
        }
    }

    var trace2 = {
        type: "scatter",
        mode: "lines",
        name: txsSquared.name,
        x: unpack(txsSquared.values, 'x').map( x => x * 1000),
        y: unpack(txsSquared.values, 'y'),
        line: {
            color: '#7F7F7F'
        },
        //this plot gets its own y axis
        yaxis: "y2"
    }

    createGraph(trace1, trace2, "Metcalfe's Law: Bitcoin", "log");

}

async function mLawEthereum() {
    var price = await callApi('https://api.blockchain.info/charts/market-price?cors=true&timespan=all&format=json&lang=en');
    var txs = await callApi('https://api.blockchain.info/charts/n-transactions?cors=true&timespan=all&format=json&lang=en')

    var txsSquared = squareData(txs)

    console.log(price);
    console.log(txsSquared);

    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: price.name,
        x: unpack(price.values, 'x').map(x => x * 1000),
        y: unpack(price.values, 'y'),
        line: {
            color: '#17BECF'
        }
    }

    var trace2 = {
        type: "scatter",
        mode: "lines",
        name: txsSquared.name,
        x: unpack(txsSquared.values, 'x').map(x => x * 1000),
        y: unpack(txsSquared.values, 'y'),
        line: {
            color: '#7F7F7F'
        },
        //this plot gets its own y axis
        yaxis: "y2"
    }

    createGraph(trace1, trace2, "Metcalfe's Law: Bitcoin", "log");

}

//When page loads
window.onload = function () {

    //Add function calls to each link in sidebar
    var sidebarLinks = document.getElementById('sidebarMenu').getElementsByTagName('a');

    for (let i = 0; i < sidebarLinks.length; i++) {
        let link = sidebarLinks[i];

        //When you click a sidebar link, it calls a function with the same name as the link id
        link.onclick = function () {
            window[link.id]();
        }
    }
}