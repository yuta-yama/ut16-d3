/// Run HTTP Server
/// python -m http.server --cgi 8000
/// http://0.0.0.0:8000

/// SVG Wrapper Dimensions
var svgWidth = 960;
var svgHeight = 600;

var margin = {
    top: 30,
    right: 30,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

/// Create an SVG wrapper, append an SVG group that will hold chart
var svg = d3
    .select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

/// Append an SVG Group, shift by left and top margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

/// Initial Params
var chosenXAxis = "income";
var chosenYAxis = "noHealthInsurance";

/// Retrieve data from CSV
// Data Columns: id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh
var file = "../data/data.csv"
console.log(d3.csv(file))
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
    throw error;
}

function successHandle(stateData) {
    /// Parse Data
    stateData.forEach(function(data) {
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.noHealthInsurance = +data.noHealthInsurance;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    /// Create Scale Functions
    var xLinearScale = xScale(stateData, chosenXAxis);
    var yLinearScale = yScale(stateData, chosenYAxis);

    /// Create Initial Axis Functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    /// Append X Axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    /// Append Y Axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    var circleRadius = 15;

    /// Append Initial Circles
    var circlesGroup = chartGroup.selectAll("circles")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", circleRadius)
        .attr("fill", "steelblue")
        .style("stroke", "grey")
        .attr("opacity", ".7")
        .text(function(d) {
            return d.abbr;
        })

    /// Append State Abbreviations to Circles
    var abbrGroup = chartGroup.selectAll("texts")
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("class","stateText")
    .text(function(d) {
        return d.abbr;
    })

    /// Group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var xLabel1 = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "income")
        .attr("class", "axis-text")
        .classed("active", true)
        .classed("inactive", false)
        .text("Median Household Income");

    var xLabel2 = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty")
        .attr("class", "axis-text")
        .classed("active", false)
        .classed("inactive", true)
        .text("In Poverty (%)");

    var xLabel3 = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age")
        .attr("class", "axis-text")
        .classed("active", false)
        .classed("inactive", true)
        .text("Median Age");

    /// Group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - margin.left)
        .attr("dy", "1em")
        .classed("axis-text", true)

    var yLabel1 = yLabelsGroup.append("text")
        .attr("x", 0 - height / 2)
        .attr("y", 0 -  margin.left + 20)
        .attr("value", "noHealthInsurance")
        .attr("class", "axis-text")
        .classed("active", true)
        .classed("inactive", false)
        .text("Lacks Healthcare (%)")

    var yLabel2 = yLabelsGroup.append("text")
        .attr("x", 0 - height / 2)
        .attr("y", 0 -  margin.left + 40)
        .attr("value", "obesity")
        .attr("class", "axis-text")
        .classed("active", false)
        .classed("inactive", true)
        .text("Obesity (%)")

    var yLabel3 = yLabelsGroup.append("text")
        .attr("x", 0 - height / 2)
        .attr("y", 0 -  margin.left + 60)
        .attr("value", "smokes")
        .attr("class", "axis-text")
        .classed("active", false)
        .classed("inactive", true)
        .text("Smokes (%)")

    // Update ToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    var abbrGroup = updateToolTip(chosenXAxis, chosenYAxis, abbrGroup);

    // X axis labels event listener
    xLabelsGroup.selectAll("text").on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

        // updates state abbreviations with new x values
        abbrGroup = renderAbbrX(abbrGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        abbrGroup = updateToolTip(chosenXAxis, chosenYAxis, abbrGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
            xLabel1
                .classed("active", true)
                .classed("inactive", false);
            xLabel2
                .classed("active", false)
                .classed("inactive", true);
            xLabel3
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (chosenXAxis === "poverty") {
            xLabel1
                .classed("active", false)
                .classed("inactive", true);
            xLabel2
                .classed("active", true)
                .classed("inactive", false);
            xLabel3
                .classed("active", false)
                .classed("inactive", true);
        }
        else {
            xLabel1
                .classed("active", false)
                .classed("inactive", true);
            xLabel2
                .classed("active", false)
                .classed("inactive", true);
            xLabel3
                .classed("active", true)
                .classed("inactive", false);
            }
        }
    });

    // Y axis labels event listener
    yLabelsGroup.selectAll("text").on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
    
            // replaces chosenXAxis with value
            chosenYAxis = value;
    
            // updates y scale for new data
            yLinearScale = yScale(stateData, chosenYAxis);
    
            // updates y axis with transition
            yAxis = renderYAxis(yLinearScale, yAxis);
    
            // updates circles with new y values
            circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

            // updates state abbreviations with new y values
            abbrGroup = renderAbbrY(abbrGroup, yLinearScale, chosenYAxis);
    
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            abbrGroup = updateToolTip(chosenXAxis, chosenYAxis, abbrGroup);
    
            // changes classes to change bold text
            if (chosenYAxis === "healthcare") {
                yLabel1
                    .classed("active", true)
                    .classed("inactive", false);
                yLabel2
                    .classed("active", false)
                    .classed("inactive", true);
                yLabel3
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === "obesity") {
                yLabel1
                    .classed("active", false)
                    .classed("inactive", true);
                yLabel2
                    .classed("active", true)
                    .classed("inactive", false);
                yLabel3
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                yLabel1
                    .classed("active", false)
                    .classed("inactive", true);
                yLabel2
                    .classed("active", false)
                    .classed("inactive", true);
                yLabel3
                    .classed("active", true)
                    .classed("inactive", false);
                }
            }
        });
}