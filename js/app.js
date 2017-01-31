/**
 * Created by ְֳִּ 3 on 31.01.2017.
 */

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json', false);
xhr.send();
if (xhr.status != 200) {
    alert(xhr.status + ': ' + xhr.statusText);
} else {
    var response = JSON.parse(xhr.responseText);
}
var countries = response.nodes.map(function(item){return item.country;});
var links = response.links.map(function(item){
    item.target = countries[item.target];
    item.source = countries[item.source];
    return item;
});
var flags = response.nodes.map(function(item){
return 'flag-'+item.code;
});
var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

var width = 1460,
    height = 900;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(20)
    .charge(-100)
    .on("tick", tick)
    .start();

var svg = d3.select(".graph").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link")
    .data(force.links())
    .enter().append("line")
    .attr("class", "link");

var node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .call(force.drag);

node.append("circle")
    .attr("r", 8);
var flags = d3.select(".flags").selectAll(".node")
    .data(force.nodes())
    .enter().append("image")
    //.attr('dx',-9)
    .attr("dy", ".35em")
    .attr("xlink:href","../img/blank.gif")
    .attr('class', 'flag flag-ao')
    .call(force.drag);

node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

function tick() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function mouseover() {
    d3.select(this).select("image").transition()
        .duration(750);
        //.attr("r", 16);
}

function mouseout() {
    d3.select(this).select("image").transition()
        .duration(750);
//        .attr("r", 8);
}
