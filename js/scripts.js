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
    loanArray = [];
    var principal = parseFloat($("#loan_amount").val());
    var loanMonths = parseFloat($("#loan_months").val());
    var effectiveInterest = parseFloat($("#interest_rate").val())/1200;
    var oneMonthInterest = (1+(effectiveInterest));



    var amountOwed = principal;
    var principalCompounded = principal;
    var monthlyPayment = (principal*(effectiveInterest/(1-(1 + effectiveInterest)**(-1*loanMonths)))).toFixed(2);
    var totalInterest = 0;

    for (i=1; i< loanMonths; i++) {
      // var oneMonthInterest = amountOwed * effectiveInterest;
      // totalInterest += oneMonthInterest;
      principalCompounded *= oneMonthInterest;
      amountOwed *= oneMonthInterest;
      amountOwed -= monthlyPayment;
      var oneObject = {index: i, width: 10, amount: amountOwed, monthly: monthlyPayment, principal: principalCompounded};
      loanArray.push(oneObject);
    }

    // console.log(totalInterest);

    d3Plot(loanArray, principal);

  });


  // After 1 month:
  var loanRepayments = true;

  function d3Plot(loanArray, principal) {

    var w = 2000;
    var h = principal/60;

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
            return h - d.amount/100;
        })
        .attr('fill', 'red');

    allBars.on("mouseover", function(d) {

      if (loanRepayments) {
        allBars
          .transition()
          .duration(300)
          .attr('fill', 'SteelBlue');

        d3.select(this)
          .style("stroke", "DarkMagenta").style("stroke-width", 2)
          .transition()
          .duration(300)
          .attr('fill', 'BlueViolet')
          .attr('width', 14)
          .attr('x', function(d,i){
              return ((d.index) * (d.width+6))-2
          })
          .attr('y', h - d.amount/80)
          .attr('height', d.amount/80);

        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("<strong> Month: </strong>" + d.index + "<br/> <strong> Amount Still Owed: </strong>" + d.amount.toFixed(2) + "<br/> <strong> Monthly Payment: </strong>" + d.monthly)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      } else if (!loanRepayments) {
        

      }
    })

    allBars.on("mouseout", hideData);

    function hideData(){

      if (loanRepayments) {
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
              return h - d.amount/100
          })
          .attr('fill', 'red');

        div.transition()
          .duration(500)
          .style("opacity", 0);
      }
    };




    allBars.on("click", function(d) {

      if (loanRepayments) {
        loanRepayments = false;

        allBars
          .transition()
          .duration(300)
          .attr('fill', 'red')
          .attr('y', h - d.principal/100)
          .attr('x', function(d,i){
              return (d.index) * (d.width+6)
          })
          .attr('height', d.principal/100)
          .attr('width', d.width)
          ;

        div.html("<strong> Month: </strong>" + d.index + "<br/> <strong> Amount Owed Without Payment: </strong>" + d.principal.toFixed(2) + "<br/> <strong> Monthly Payment: </strong>" + d.monthly)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      } else if (!loanRepayments) {
        loanRepayments = true;

        allBars
          .transition()
          .duration(300)
          .attr('fill', 'red')
          .attr('y', function(d,i){
              return h - d.amount/100;
          })
          .attr('x', function(d,i){
              return (d.index) * (d.width+6)
          })

          .attr('height', function(d,i){
              return d.amount/100;
          })
          ;


        div.html("<strong> Month: </strong>" + d.index + "<br/> <strong> Amount Still Owed: </strong>" + d.amount.toFixed(2) + "<br/> <strong> Monthly Payment: </strong>" + d.monthly)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      }



    })

  }






});
