$(document).ready(function(){

  $( "#loan_years" ).change(function() {
    var years = parseFloat($( "#loan_years" ).val());
    $("#loan_months").val( years*12 )
  });

  $( "#loan_months" ).change(function() {
    var months = parseFloat($( "#loan_months" ).val());
    $("#loan_years").val( (months/12).toFixed(3) )
  });

  var loanArray = [];

  $( "#submit_button" ).click(function() {
    var principal = parseFloat($("#loan_amount").val());
    var loanMonths = parseFloat($("#loan_months").val());
    var effectiveInterest = parseFloat($("#interest_rate").val())/1200;
    var oneMonthInterest = (1+(effectiveInterest));



    var amountOwed = principal;
    var monthlyPayment = (principal*(effectiveInterest/(1-(1 + effectiveInterest)**(-1*loanMonths)))).toFixed(2);


    for (i=1; i< loanMonths; i++) {
      amountOwed *= oneMonthInterest;
      amountOwed -= monthlyPayment;
      var oneObject = {index: i, width: 24, amount: amountOwed, monthly: monthlyPayment};
      loanArray.push(oneObject);
    }

    d3Plot(loanArray);

  });

  function test(loanArray) {
    console.log(loanArray);
  }

  // After 1 month:

  function d3Plot(loanArray) {

    var w= 1000;
    var h= 500;

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
        .data(loanArray)
        .enter()
        .append('rect')
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr('width', function(d,i){
            return d.width
        })
        .attr('height', function(d,i){
            return d.amount/100;
        })
        .attr('x', function(d,i){
            return (d.index) * (d.width+6)
        })
        .attr('y', function(d,i){
            return (h/2) - d.amount/100;
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
        .attr('y', (h/2) - d.amount/80)
        .attr('height', d.amount/80);

      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html("<strong> Month: </strong>" + d.index + "<br/> <strong> Amount Still Owed: </strong>" + d.amount.toFixed(2) + "<br/> <strong> Monthly Payment: </strong>" + d.monthly)
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
            return d.amount/100;
        })
        .attr('x', function(d,i){
            return (d.index) * (d.width+6)
        })
        .attr('y', function(d,i){
            return (h/2) - d.amount/100
        })
        .attr('fill', 'red');

      div.transition()
        .duration(500)
        .style("opacity", 0);
      // d3.select(this)
      //     .attr('fill', 'red');
    };

  }






});
