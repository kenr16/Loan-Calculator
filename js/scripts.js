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
          .each("end", animateSecondStep);
  };

  function animateSecondStep(){
      d3.select(this)
        .transition()
          .duration(1000)
          .attr("cy", 500)
          .each("end", animateThirdStep);
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
          .each("end", animateThirdStep);
  };



  var tomatoes = [
    {"width":25,"height":83,"color":"red"},
    {"width":25,"height":97,"color":"red"},
    {"width":25,"height":77,"color":"red"},
    {"width":25,"height":73,"color":"red"},
    {"width":25,"height":89,"color":"red"},
    {"width":25,"height":94,"color":"red"},
    {"width":25,"height":97,"color":"red"},
    {"width":25,"height":74,"color":"red"},
    {"width":25,"height":91,"color":"red"},
    {"width":25,"height":80,"color":"red"},
    {"width":25,"height":86,"color":"red"},
    {"width":25,"height":77,"color":"red"},
    {"width":25,"height":80,"color":"red"},
    {"width":25,"height":67,"color":"red"},
    {"width":25,"height":79,"color":"red"},
    {"width":25,"height":73,"color":"red"},
    {"width":25,"height":84,"color":"red"},
    {"width":25,"height":97,"color":"red"},
    {"width":25,"height":98,"color":"red"},
    {"width":25,"height":94,"color":"red"},
  ]

  var w= 535;
  var h= 250;

  var svg = d3.select("#graphDiv")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 1000);

  svg.selectAll('rect.colorBar')
      .data(tomatoes)
      .enter()
      .append('rect')
      .attr('width', function(d,i){
          return d.width
      })
      .attr('height', function(d,i){
          return d.height*2
      })
      .attr('x', function(d,i){
          return i * (d.width+2)
      })
      .attr('y', function(d,i){
          return h - d.height*2
      })
      .attr('fill', 'red');



  $( "#loan_years" ).change(function() {
    var years = parseFloat($( "#loan_years" ).val());
    $("#loan_months").val( years*12 )
  });

  $( "#loan_months" ).change(function() {
    var months = parseFloat($( "#loan_months" ).val());
    $("#loan_years").val( (months/12).toFixed(3) )
  });




});
