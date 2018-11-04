/// Function for updating x-scale upon click on axis label
function xScale(stateData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]) * .8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.1])
        .range([0, width]);
    return xLinearScale;
}

/// Function for updating y-scale upon click on axis label
function yScale(stateData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
        d3.max(stateData, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);
    return yLinearScale;
}

/// Function used for updating xAxis
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

// Function used to update circles group with new Circle attribute
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}

// Function used to update State Abbreviations group with new X attributes
function renderAbbrX(abbrGroup, newXScale, chosenXAxis) {
    abbrGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));
    return abbrGroup;
}

// Function used to update circles group with new CY attribute
function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}

// Function used to update State Abbreviations group with new Y attributes
function renderAbbrY(abbrGroup, newYScale, chosenYAxis) {
    abbrGroup.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis]));
    return abbrGroup;
}

/// Function used to update circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "income") {
        var xLabel = "Household Income (Median):";
    }
    else if (chosenXAxis === "poverty") {
        var xLabel = "In Poverty (%):";
    }
    else {
        var xLabel = "Median Age:"
    }

    if (chosenYAxis === "noHealthInsurance") {
        var yLabel = "Lacks Healthcare (%):";
    }
    else if (chosenYAxis === "obesity") {
        var yLabel = "Obesity (%):";
    }
    else {
        var yLabel = "Smokes (%):"
    }

    /// Setting up Tooltip with mouseover and mouseout
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([105, 0])
        .html(function(d) {
            return (`<b>${d["state"]}</b><br>${xLabel} <b>${d[chosenXAxis]}</b><br>${yLabel} <b>${d[chosenYAxis]}</b>`)
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

/// Function used to update abbr group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, abbrGroup) {

    if (chosenXAxis === "income") {
        var xLabel = "Household Income (Median):";
    }
    else if (chosenXAxis === "poverty") {
        var xLabel = "In Poverty (%):";
    }
    else {
        var xLabel = "Median Age:"
    }

    if (chosenYAxis === "noHealthInsurance") {
        var yLabel = "Lacks Healthcare (%):";
    }
    else if (chosenYAxis === "obesity") {
        var yLabel = "Obesity (%):";
    }
    else {
        var yLabel = "Smokes (%):"
    }

    /// Setting up Tooltip with mouseover and mouseout
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([105, 0])
        .html(function(d) {
            return (`<b>${d["state"]}</b><br>${xLabel} <b>${d[chosenXAxis]}</b><br>${yLabel} <b>${d[chosenYAxis]}</b>`)
        });
        
    abbrGroup.call(toolTip);
    abbrGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return abbrGroup;
}