function generatePoints(maxX, maxY) {
  var points = [];

  for (var i = 0; i < 100; i++) {
    var randomX = Math.floor(Math.random() * maxX);
    var randomY = Math.floor(Math.random() * maxY);

    points.push({
      x: randomX,
      y: randomY,
    });
  }

  return points;
}

function drawScatterPlot() {
  var width = 500;
  var height = 500;

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  var xAxis = d3.scaleLinear().range([0, width]).domain([0, width]);
  var yAxis = d3.scaleLinear().range([0, height]).domain([0, height]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xAxis));
  svg.append("g").call(d3.axisLeft(yAxis));

  var points = generatePoints(width, height);
  
  svg.append('g')
    .selectAll("dot")
    .data(points)
    .enter()
    .append("circle")
      .attr("cx", function (point) { return xAxis(point.x); } )
      .attr("cy", function (point) { return yAxis(point.y); } )
      .attr("r", 2)
      .style("fill", "black")

}

function drawPie() {
var width = 500;
  var height = 500;

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var radius = Math.min(width, height) / 2.5;
  var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var color = d3.scaleOrdinal([
    'gray', 'green', 'brown', 'orange', 'yellow', 'red', 'purple'
  ]);
 
  var path = d3.arc()
    .outerRadius(radius - 10).innerRadius(20);
            
  var label = d3.arc()
    .outerRadius(radius).innerRadius(radius - 80);
            
            
  d3.csv("titanic.csv").then (
    function (data) {
      var binSize = 5;
      var ageGroups = d3.group(data, function(d) {
        if (d.Age === "") return -1; // it means that there is no written age in csv
        return Math.floor(d.Age / binSize) * binSize;
      });

      var bins = Array.from(ageGroups, function([bin, data]) {
        return {
          bin: bin,
          count: data.length,
          data: data
        };
      }).filter(({bin}) => {
        return bin !== -1; // removing data that does not have written age
      });

      var pie = d3.pie()
        .value(function(d) { return d.count; })(bins);
      

      var arc = g.selectAll ('.arc')
        .data (pie)
        .enter().append ('g')
        .attr('class','arc');

      arc.append('path')
        .attr('d',path)
        .attr('fill', function(d) {console.log(d); return color(d.data.bin);});      

      arc.append("text").attr("transform", function(d) { 
        return "translate(" + label.centroid(d) + ")"; 
      })         
        .text(function(d) { return d.data.bin + " - " + (d.data.bin + binSize); })
      });
           
      svg.append("g")
        .attr("transform", "translate(" + (width / 2 - 120) + "," + 30 + ")")
        .append("text").text("Age distribution in titanic")
        .attr("class", "title")
  
}


function load() {
  drawScatterPlot();
  drawPie();
}
