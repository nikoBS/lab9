let randomPoints = [];

for (let i = 0; i < 100; i++) {
    let x = Math.round(Math.random()*99-1);
    let y = Math.round(Math.random()*99-1);
    let point = [];
    point.push(x);
    point.push(y);
    randomPoints.push(point);
}

let svg = d3.select("#random"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin

let xScale = d3.scaleLinear().domain([0, 100]).range([0, width]),
    yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);


svg.append('text')
.attr('x', width/2 + 100)
.attr('y', 100)
.attr('text-anchor', 'middle')
.style('font-family', 'Helvetica')
.style('font-size', 20)
.text('Random Scatter Plot');

svg.append("g")
    .attr("transform", "translate(" + 95 + ", " + 405 + ")")
    .call(d3.axisBottom(xScale));

svg.append("g")    
    .attr("transform", "translate(" + 95 + ", " + 105 + ")")
    .call(d3.axisLeft(yScale));

svg.append('g')
    .selectAll("dot")
    .data(randomPoints)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d[0]); } )
    .attr("cy", function (d) { return yScale(d[1]); } )
    .attr("r", 2)
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .style("fill", "#CC0000");


// pie chart
let svg2 = d3.select("#pie");
width = +svg2.attr("width");
height = +svg2.attr("height");
let radius = Math.min(width, height)/2;
let g = svg2.append("g").attr('transform', `translate(${width/2}, ${height/2})`);




let pie = d3.pie().value(function(d) { 
    return d.share; 
});

let path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

let label = d3.arc()
          .outerRadius(radius*1.5)
          .innerRadius(0);


let label2 = d3.arc()
          .outerRadius(radius*1.75)
          .innerRadius(0);

let ages = new Map();
let size = new Map();
size.set('size', 0);
let dataArr = [];
d3.csv("titanic.csv", function(data) {
    size.set('size', size.get('size')+1);
    let unroundedKey = data.Age;
    let key;
    if (!unroundedKey) key = 'unknown';
    else key = Math.round(unroundedKey); 
    if (!ages.get(key)) ages.set(key, 1);
    else ages.set(key, ages.get(key)+1);
    if (+size.get('size') == 891) {
        ages.forEach((value, key, map) => {
            dataArr.push({name: key, share: value/891*100});
        });
        console.log(dataArr);
        let colors = [];
        for (let i = 0; i < 72; i++) {
            let color = '#'
                    +(Math.round(Math.random()*155+100)).toString(16).toUpperCase()
                    +(Math.round(Math.random()*155+100)).toString(16).toUpperCase()
                    +(Math.round(Math.random()*155+100)).toString(16).toUpperCase();
            colors.push(color);
        }
        console.log(colors);
            
        
        let arc = g.selectAll("arc")
        .data(pie(dataArr))
        .enter();

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d) { return colors[d.index]; });

        arc.append("text")
           .attr("transform", function(d) { 
                    return "translate(" + label.centroid(d) + ")"; 
            })
           .text(function(d) { return d.data.name; })
           .style("font-family", "arial")
           .style("font-size", 7);

        arc.append("text")
           .attr("transform", function(d) { 
                    return "translate(" + label2.centroid(d) + ")"; 
            })
           .text(function(d) { return (+d.data.share).toFixed(2) + "%"; })
           .style("font-family", "arial")
           .style("font-size", 7);
    }
})
