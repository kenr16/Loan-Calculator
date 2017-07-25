$(document).ready(function(){



  var sampleSVG = d3.select("#viz")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 500);

  sampleSVG.append("circle")
      .style("stroke", "gray")
      .style("fill", "white")
      .attr("r", 40)
      .attr("cx", 50)
      .attr("cy", 50)
      .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
      .on("mouseout", function(){d3.select(this).style("fill", "white");})
      .on("mousedown", animateFirstStep);

  function animateFirstStep(){
      d3.select(this)
        .transition()
          .delay(0)
          .duration(1000)
          .attr("cx", 500)
          .attr("r", 10)
          .style("fill", "lightgreen")
          .on("end", animateSecondStep);
  };

  function animateSecondStep(){
      d3.select(this)
        .transition()
          .duration(1000)
          .attr("cy", 500)
          .on("end", animateThirdStep);
  };

  function animateThirdStep(){
      d3.select(this)
        .transition()
          .duration(1000)
          .attr("r", 40)
          .attr("cx", 50)
          .attr("cy", 50)
          .attr("r", 40)
          .style("fill", "white")
          // .each("end", animateThirdStep)
          ;
  };



  var loan_data = [
    {"width":24,"height":83,"color":"red","index":0},
    {"width":24,"height":97,"color":"red","index":1},
    {"width":24,"height":77,"color":"red","index":2},
    {"width":24,"height":73,"color":"red","index":3},
    {"width":24,"height":89,"color":"red","index":4},
    {"width":24,"height":94,"color":"red","index":5},
    {"width":24,"height":97,"color":"red","index":6},
    {"width":24,"height":74,"color":"red","index":7},
    {"width":24,"height":91,"color":"red","index":8},
    {"width":24,"height":80,"color":"red","index":9},
    {"width":24,"height":86,"color":"red","index":10},
    {"width":24,"height":77,"color":"red","index":11},
    {"width":24,"height":80,"color":"red","index":12},
    {"width":24,"height":67,"color":"red","index":13},
    {"width":24,"height":79,"color":"red","index":14},
    {"width":24,"height":73,"color":"red","index":15},
    {"width":24,"height":84,"color":"red","index":16},
    {"width":24,"height":97,"color":"red","index":17},
    {"width":24,"height":98,"color":"red","index":18},
    {"width":24,"height":94,"color":"red","index":19},
  ]

  var w= 600;
  var h= 600;

  var svg = d3.select("#graphDiv")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .style("stroke", "black")
      .style("stroke-width", 1);

  let div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var allBars = svg.selectAll('rect.colorBar')
      .data(loan_data)
      .enter()
      .append('rect')
      .style("stroke", "black")
      .style("stroke-width", 1)
      .attr('width', function(d,i){
          return d.width
      })
      .attr('height', function(d,i){
          return d.height*2
      })
      .attr('x', function(d,i){
          return (d.index) * (d.width+6)
      })
      .attr('y', function(d,i){
          return (h/2) - d.height*2
      })
      .attr('fill', 'red');

  allBars.on("mouseover", function(d) {

    allBars
      .transition()
      .duration(300)
      .attr('fill', 'SteelBlue');


    d3.select(this)
      .style("stroke", "DarkMagenta").style("stroke-width", 2)
      .transition()
      .duration(300)
      .attr('fill', 'BlueViolet')
      .attr('width', 32)
      .attr('x', function(d,i){
          return ((d.index) * (d.width+6))-4
      })
      .attr('y', (h/2) - d.height*3)
      .attr('height', d.height*3);

    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html("<strong> Month: </strong>" + d.index + "<br/> <strong> Color: </strong>" + d.color)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");


  })

  allBars.on("mouseout", hideData);

  function hideData(){

    allBars
      .transition()
      .style("stroke", "black")
      .style("stroke-width", 1)
      .transition()
      .duration(300)
      .attr('width', function(d,i){
          return d.width
      })
      .attr('height', function(d,i){
          return d.height*2
      })
      .attr('x', function(d,i){
          return (d.index) * (d.width+6)
      })
      .attr('y', function(d,i){
          return (h/2) - d.height*2
      })
      .attr('fill', 'red');

    div.transition()
      .duration(500)
      .style("opacity", 0);
    // d3.select(this)
    //     .attr('fill', 'red');
  };



  $( "#loan_years" ).change(function() {
    var years = parseFloat($( "#loan_years" ).val());
    $("#loan_months").val( years*12 )
  });

  $( "#loan_months" ).change(function() {
    var months = parseFloat($( "#loan_months" ).val());
    $("#loan_years").val( (months/12).toFixed(3) )
  });




});
