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
      var currentInterest = amountOwed * effectiveInterest;

      principalPayment = monthlyPayment - currentInterest;
      interestPayment = currentInterest;

      principalCompounded *= oneMonthInterest;
      amountOwed *= oneMonthInterest;
      amountOwed -= monthlyPayment;
      var oneObject = {index: i, width: 10, amount: amountOwed, monthly: monthlyPayment, principal: principalCompounded, base: principalPayment, interest: interestPayment};
      if (i % 3 === 0) {
        loanArray.push(oneObject);
      }
    }

    d3Plot(loanArray, principal);

  });


  // After 1 month:
  var loanRepayments = true;

  function d3Plot(loanArray) {

    var w = 1250;
    var h = 500;
    var padding = 20;

    var xScale = d3.scaleLinear()
      .domain([0, (loanArray.length+1)*3])
      .range([padding, (.75*w - padding)]);

    var yScale = d3.scaleLinear()
      .domain([ padding , d3.max(loanArray, function(d,i) { return d.amount; })+500 ])
      .range([padding, (h - padding)]);

    var yScaleAxis = d3.scaleLinear()
      .domain([ d3.max(loanArray, function(d,i) { return d.amount; }), padding ])
      .range([padding, (h - padding)]);

    var xAxis = d3.axisBottom()
      .scale(xScale);

    var yAxis = d3.axisLeft()
      .scale(yScaleAxis);

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
        .style("stroke-width", 2)
        .style("opacity", .9)
        .attr('width', function(d,i){
            return (.75*w / loanArray.length)-4
        })
        .attr('x', function(d,i){
            // return (d.index) * (d.width+6);
            return xScale(i)*3 - (.8*padding);
        })
        .attr('height', function(d,i){
            return 0;
        })
        .attr('y', function(d,i){
            return h;
        })
        .attr("fill", function(d,i) {
          return "rgb( " + 0 + "," + 0 + "," + (100 + i*10) + ")";
        });

    allBars.transition()
        .duration(600)
        .attr('height', function(d,i){
            return yScale(d.amount);
        })
        .attr('y', function(d,i){
            return h - yScale(d.amount) - (1.1*padding);
        });

    svg.append("g")
      .attr("transform", "translate(" + padding + "," + (h-20) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("transform", "translate(" + 2*padding + "," + 0 + ")")
      .call(yAxis);

    allBars.on("mouseover", function(d) {

      if (loanRepayments) {
        allBars
          .transition()
          .duration(300)
          .attr('fill', 'SteelBlue');

        d3.select(this)
          .style("stroke", "Gold").style("stroke-width", 3)
          .transition()
          .duration(300)
          .attr('fill', 'BlueViolet')

          .attr('height', function(d,i){
              return yScale(d.amount)*1.2;
          })
          .attr('y', function(d,i){
              return h - yScale(d.amount)*1.2 - (1.1*padding);
          });

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
      div.transition()
        .duration(500)
        .style("opacity", 0);

      if (loanRepayments) {

        allBars
          .style("stroke", "black")
          .style("stroke-width", 2)
          .attr('height', function(d,i){
              return yScale(d.amount);
          })
          .attr('y', function(d,i){
              return h - yScale(d.amount) - (1.1*padding);
          })
          .attr("fill", function(d,i) {
            return "rgb( " + 0 + "," + 0 + "," + (100 + i*10) + ")";
          })
          .attr('width', function(d,i){
              return (.75*w / loanArray.length)-4
          })
          .attr('x', function(d,i){
              // return (d.index) * (d.width+6);
              return xScale(i)*3 - (.8*padding);
          })
          .style("opacity", .9)
          .attr('rx', 0)
          .attr('ry', 0)

          ;
      }
    };




    allBars.on("click", function(d) {

      // loanRepayments = false;

      d3.select(this).transition()
        .duration(500)
        .attr('height', (Math.min(w, h) / 1.5))
        .attr('width', (Math.min(w, h) / 1.5))
        .attr('fill', 'steelblue')
        .style("opacity", .5)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr('rx', 20)
        .attr('ry', 20)
        .attr('y', (h / 3)-(Math.min(w, h) / 3))
        .attr('x', (w * .85)-(Math.min(w, h) / 3))
        .on('end', function(d,i){
          setTimeout(function(){
             showPie(d.interest, d.base);
          }, 100);


        });







      // if (loanRepayments) {
    //     loanRepayments = false;
    //
    //     allBars
    //       .transition()
    //       .duration(300)
    //       .attr('fill', 'red')
    //       .attr('x', function(d,i){
    //           return (d.index) * (d.width+6);
    //       })
    //       .attr('y', function(d,i){
    //           return h - d.principal/500;
    //       })
    //       .attr('height', function(d,i){
    //           return d.principal/500;
    //       })
    //       .attr('width', d.width)
    //       ;
    //
    //     div.html("<strong> Month: </strong>" + d.index + "<br/> <strong> Amount Owed Without Payment: </strong>" + d.principal.toFixed(2) + "<br/> <strong> Monthly Payment: </strong>" + d.monthly)
    //       .style("left", (d3.event.pageX) + "px")
    //       .style("top", (d3.event.pageY - 28) + "px");
    //   } else if (!loanRepayments) {
    //     loanRepayments = true;
    //
    //     allBars
    //       .transition()
    //       .duration(300)
    //       .attr('fill', 'red')
    //       .attr('y', function(d,i){
    //           return h - d.amount/100;
    //       })
    //       .attr('x', function(d,i){
    //           return (d.index) * (d.width+6)
    //       })
    //
    //       .attr('height', function(d,i){
    //           return d.amount/100;
    //       })
    //       ;
    //
    //
    //     div.html("<strong> Month: </strong>" + d.index + "<br/> <strong> Amount Still Owed: </strong>" + d.amount.toFixed(2) + "<br/> <strong> Monthly Payment: </strong>" + d.monthly)
    //       .style("left", (d3.event.pageX) + "px")
    //       .style("top", (d3.event.pageY - 28) + "px");
    //   }
  });


    function showPie(interest, base) {

      var data = [{
                     label: 'Interest',
                     count: interest
                   }, {
                     label: 'Principal',
                     count: base
                   }
                 ];

      radius = Math.min(w, h) / 3,
      g = svg.append("g").attr("transform", "translate(" + w * .85 + "," + h / 3 + ")");

      // var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

      var color = d3.scaleOrdinal()
        .domain([0, 1])
        .range(["red" , "blue"]);

      var pie = d3.pie()
       .value(function(d) {
         return d.count;
       })
       .sort(null);

      var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(20);

      var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

      var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .style("opacity", .8)
        .style("stroke", "Gold").style("stroke-width", 1)
        .style("font-size", "20px");

      arc.append("path")
        .attr("d", path)

        .attr("fill", function(d,i) { return color(i); });
        // .attr("fill", 'red');


      arc.append("text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .text(function(d) { return d.data.label; });

    }
  }






});
