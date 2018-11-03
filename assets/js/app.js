// Run HTTP Server
// python -m http.server --cgi 8000
// http://0.0.0.0:8000

// SVG Wrapper Dimensions
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = svgWidth - margin.eft - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold chart
var svg = d3
    .select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG Group, shift by left and top margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "income";
var chosenYAxis = "noHealthInsurance";

// Function for updating x-scale upon click on axis label
function xScale(stateData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);

    return xLinearScale;
}

// Function for updating y-scale upon click on axis label
function yScale(stateData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
        d3.max(stateData, d => d[chosenYAxis]) * 1.2])
        .range([0, width]);

    return yLinearScale;
}

// Function used for updating xAxis
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

// Function used for updating yAxis
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
}

// Function used to update circles group with new CX attribute
function renderCirclesCX(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// Function used to update circles group with new CX attribute
function renderCirclesCY(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// Function used to update circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "hair_length") {
        var label = "Hair Length:";
    }
    else {
        var label = "# of Albums:";
    }

    // Setting up Tooltip with mouseover and mouseout
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.rockband}<br>${label}${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

// Retrieve data from CSV
var file = "../data/data.csv"
console.log(d3.csv(file))
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
    throw error;
}

// Data Columns: id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh

function successHandle(stateData) {
    // Parse Data
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

    // Create Scale Functions
    var xLinearScale = xScale(stateData, chosenXAxis);
    var yLinearScale = yScale(stateData, chosenYAxis);

    // Create Initial Axis Functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append X Axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append Y Axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Append Initial Circles
    var circlesGroup = chartGroup.selectAll("circles")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "navy")
        .attr("opacity", ".7");

    // Group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var xLabel1 = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "income")
        .classed("active", true)
        .text("Median Household Income");

    var xLabel2 = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

    var xLabel3 = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age")
        .classed("active", true)
        .text("Median Age");

    // Group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)

    var yLabel1 = yLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)")

    var yLabel2 = yLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "obesity")
        .classed("active", true)
        .text("Obesity (%)")

    var yLabel3 = yLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "smokes")
        .classed("active", true)
        .text("Smokes (%)")

    // Update ToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

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
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

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
}














