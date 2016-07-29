//utilities
var red = '#e74c3c';
var blue = '#2980b9';
var gray = '#6a7059';

function drawChart(d, chart, x) {
	var data = google.visualization.arrayToDataTable(d);
	var options = {
		chartArea : {
			left : 100,
			top : 60,
			right : 200,
			bottom : 100
		},
		colors : [blue, red, gray],
		curveType : 'function',
		explorer : {
			actions : ['dragToZoom', 'rightClickToReset'],
			axis : 'horizontal'
		},
		focusTarget : 'category',
		fontName : 'Lato',
		hAxis : {
			gridlines : {
				color : '#eee'
			},
			format : 'MMM, yyyy',
			title : 'Poll Date'
		},
		title : 'Drag your cursor to zoom in. Right click to zoom out.',
		vAxis : {
			gridlines : {
				color : '#fff'
			},
			ticks : [0, 15, 30, 45, 60],
			title : 'Weighted Polling Average (%)',
		},
	}

	var dater = new google.visualization.DateFormat({
		formatType : 'long'
	});
	dater.format(data, 0);

	var formatter = new google.visualization.NumberFormat({
		fractionDigits : 1,
		suffix : '%'
	});
	formatter.format(data, 1);
	formatter.format(data, 2);
	formatter.format(data, 3);

	var chart = new google.visualization.LineChart(document.getElementById(chart));
	chart.draw(data, options);
}

function round(n) {

	var num1 = Math.max(Math.round(n * 10) / 10, 2.8).toFixed(2);
	var num2 = Number(num1);
	return num2;

}

function parse(d) {

	var data = d.estimates_by_date;
	var len = data.length;
	var array = [];
	var headers = ['Date', d.estimates[0].first_name + " " + d.estimates[0].last_name, d.estimates[1].first_name + " " + d.estimates[1].last_name, 'Other/Undecided'];
	array.push(headers);
	for (var i = 0; i < len; i++) {
		var curr = data[i];
		var currArray = [moment(curr.date)._d, round(curr.estimates[0].value), round(curr.estimates[1].value), round(curr.estimates[2].value + curr.estimates[3].value)]
		array.push(currArray);
	}
	return array;

}

function get() {

	var x = $(window).width();

	window.pollsterChart = function(d) {

		var p = parse(d);
		var c = 'general-chart';
		drawChart(p, c, x);
		$(window).resize(function() {
			drawChart(p, c, x);
		});

	};

	var url = 'http://elections.huffingtonpost.com/pollster/api/charts/2016-general-election-trump-vs-clinton.json'

	$.ajax({
		url : url + '?callback=pollsterChart',
		dataType : 'script',
		type : 'GET',
		cache : true,
		success : function() {

		}
	});

}

function init() {
	google.charts.load('current', {
		'packages' : ['corechart']
	});
	google.charts.setOnLoadCallback(get);

}


$(document).ready(init);
