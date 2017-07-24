$(document).ready(function(){



  var sampleSVG = d3.select("#viz")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 1000);

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



  $( "#loan_years" ).change(function() {
    var years = parseFloat($( "#loan_years" ).val());
    $("#loan_months").val( years*12 )
  });

  $( "#loan_months" ).change(function() {
    var months = parseFloat($( "#loan_months" ).val());
    $("#loan_years").val( (months/12).toFixed(3) )
  });




});
