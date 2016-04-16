var Graph = function() {
	this.svg = d3.select("#contents")
		.append("svg")
		.attr("width", 500)
		.attr("height", 300);

	// ru 33.6 132.1
	// ld 30.9 129.2

	this.dataReset();
	this.xScale = d3.scale.linear()
		.domain([129.2, 132.1])
		.range([0, 500]);
	this.yScale = d3.scale.linear()
		.domain([30.9, 33.6])
		.range([0, 300]);
	this.colorScale = d3.scale.linear()
		.domain([0, 20])
		.range(["blue","red"]);
};

Graph.prototype.dataReset = function() {
	this.data = [];
	for (var year = 2016; year < 2017; year ++) {
		for (var month = 4; month < 5; month ++) {
			for (var day = 16; day < 17; day ++) {
				for (var hour = 0; hour < 24; hour ++) {
					this.data.push({
						date: new Date(year, month, day, hour),
						log: []
					});
				}
			}
		}
	}
};

Graph.prototype.dataSet = function(db) {
	var ptr = 0;

	this.dataReset();

	jQuery.each(db, function(i, d) {
		for (; ptr < this.data.length; ptr++) {
			if (d.date.getTime() < this.data[ptr].date.getTime()) {
				this.data[ptr].log.push(d);
				break;
			}
		}
	}.bind(this));

	console.log(this.data);
};

Graph.prototype.update = function(dataset) {
	this.svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", function(d) { return this.xScale(d[0]); }.bind(this))
		.attr("cy", function(d) { return this.yScale(d[1]); }.bind(this))
		.attr("r",  function(d) { return d[2]; }.bind(this))
		.attr("fill",  function(d) { return this.colorScale(d[2]); }.bind(this))
};

Graph.prototype.show = function(idx) {
	console.log(this.data[idx].log);

	$.each(this.data[idx].log, function(i, v) {
		console.log({x: v.lat, y: v.lng});
	});

	// ru 33.6 132.1
	// ld 30.9 129.2

	var log = [
		{lat: 129.3, lng: 31.0, level: 5},
		{lat: 132.0, lng: 33.5, level: 5},
	];


//		.data(log)
	this.svg.selectAll("circle")
		.data(this.data[idx].log)
		.enter()
		.append("circle")
		.attr("cx", function(d) { return this.xScale(d.lat); }.bind(this))
		.attr("cy", function(d) { return this.yScale(d.lng); }.bind(this))
		.attr("r",  function(d) { return 1; d.level; }.bind(this))
		.attr("fill",  function(d) { return this.colorScale(d.level); }.bind(this))
};

var Apl = function() {
	this.db = [];
};

Apl.prototype.getData = function() {
	this.graph = new Graph();

	$.get('./data.dat', function(data) {
		var d = data.split('\r\n');
		jQuery.each(d, function(i, val) {
			var d = val.split(',');
			// skip if log data is not about earth quake
			if (d[1] != 'QUA') return;
			var t = d[2].split('/');
			// skip if lat, lng info is empty
			if (t[8] == '') return;
			var match_result = t[0].match(/(\d+)[^\d](\d+)[^\d](\d+)[^\d]/);
//			console.log(t[0]);
			var date = {
				year: 2016,
				month: 4,
				day: parseInt(match_result[1]),
				hour: parseInt(match_result[2]),
				munite: parseInt(match_result[3]),
			}
//			console.log(date);
			var data = {
				date: new Date(date.year, date.month, date.day,
							   date.hour, date.munite),
				level: t[1][0],
				lng: t[8].substring(1),
				lat: t[9].substring(1),
			};
			this.db.push(data);
//			console.log(data.date);
		}.bind(this));
		this.graph.dataSet(this.db);
//		this.showDB();

		this.graph.show(2);
	}.bind(this));
};

Apl.prototype.showDB = function() {
	return;

	var html = '<table border="1">';
	jQuery.each(this.db, function(i, d) {
		html += '<tr><td>' + d.date + '</td><td>' + d.level + '</td><td>' +
			d.lng + '</td><td>' + d.lat + '</td></tr>';
	});
	html += '</table>';

	$('#data').append(html);
};

Apl.prototype.showGraph = function() {
	var dataset = [
        [   5,   20 ,  3],
        [ 480,   90 ,  4],
        [ 250,   50 ,  5],
        [ 100,   33 , 10],
        [ 330,   95 , 12],
        [ 410,   12 ,  5],
        [ 475,   44 ,  1],
        [  25,   67 ,  8],
        [  85,   21 ,  5],
        [ 220,   88 ,  6]
    ];

//	this.graph.update(dataset);
};

$(function() {
	var apl = new Apl();
	apl.getData();
//	apl.showGraph();
});
