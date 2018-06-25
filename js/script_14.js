////////////////////////////////////////////////////////////// 
//////////////////////// Constants /////////////////////////// 
////////////////////////////////////////////////////////////// 

const pi2 = 2 * Math.PI
const pi1_2 = Math.PI / 2

const numData = 1440 // = 60 * 24 -> minutes per day
const dotRadius = 1

//Locations of visual elements based on the data
const averageBabies = 7.3
const maxBabies = 14.8
const minBabies = 4.8
const axisLocation = 10.5
const gridLineData = [6,9]
const outerCircleShadow = 12.5

//Colors
const colorsRed = ['#ffa500', '#fb9200', '#f58200', '#ee7000', '#e65e00', '#dd4c01', '#d13a01', '#c12e03', '#b02404', '#9f1905', '#8e1005', '#7d0603', '#6b0101']
const colorsBlue = ['#0d4982','#1d6092','#2c79a1','#3294a5','#1ab29d']

////////////////////////////////////////////////////////////// 
//////////////////////// Create SVG //////////////////////////
////////////////////////////////////////////////////////////// 

const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
}
const width = 1250 - margin.left - margin.right
const height = 900 - margin.top - margin.bottom

//SVG container - using d3's margin convention
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")")

//////////////////////////////////////////////////////////////
////////////////////// Create scales /////////////////////////
//////////////////////////////////////////////////////////////

//Angle scale for the time
const timeScale = d3.scaleLinear()
    .domain([0, numData-1])
    .range([0.025 * pi2, 0.975 * pi2])

//Radius scale for the number of births
const birthScale = d3.scaleLinear()
    .domain([0, maxBabies])
    .range([0, height/2])

//Area between the loess line and the average line
const areaScale = d3.radialArea()
    .angle(d => timeScale(d.time) )
    .innerRadius(d => birthScale(d.line))
    .outerRadius(d => birthScale(averageBabies))

////////////////////////////////////////////////////////////// 
///////////////////// Create SVG effects ///////////////////// 
//////////////////////////////////////////////////////////////

const defs = svg.append("defs")

//Create a shadow filter
const filter = defs.append("filter").attr("id","shadow")
filter.append("feColorMatrix")
    .attr("type", "matrix")
    .attr("values", "0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0 0.1 0")
filter.append("feGaussianBlur")
    .attr("stdDeviation","5")
    .attr("result","coloredBlur")
const feMerge = filter.append("feMerge")
feMerge.append("feMergeNode").attr("in","coloredBlur")
feMerge.append("feMergeNode").attr("in","SourceGraphic")

//Create background "chart-area" circle
svg.append("circle")
    .attr("r", birthScale(outerCircleShadow))
    .style("fill", "white")
    .style("filter", "url(#shadow)")
        
//////////////////////////////////////////////////////////////
///////////////////////// Add title //////////////////////////
//////////////////////////////////////////////////////////////

svg.append("text")
    .attr("class", "title-top")
    .attr("y", -5)
    .text("Minutes")

svg.append("text")
    .attr("class", "title-bottom")
    .attr("y", 15)
    .text("per day")

//////////////////////////////////////////////////////////////
////////////////////// Draw time labels //////////////////////
//////////////////////////////////////////////////////////////

//Hour label data
const times = ["midnight","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","noon","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"]

//Draw the hour labels
const timeLabels = svg.append("g")
    .attr("class", "time-label-group")

//Will calculate starting and ending angles
const pie = d3.pie()
    .startAngle(timeScale(0)) //Because we're not using a full 2*pi circle
    .endAngle(timeScale(numData-1)) //Because we're not using a full 2*pi circle
    .value(60) //Each hour is 60 minutes long
    .padAngle(.01) //A bit of space between each slice
    .sort(null) //Don't sort, but keep the order as in the data

//Will create the SVG arc path formulas
const arc = d3.arc()
    .innerRadius(birthScale(axisLocation)) 
    .outerRadius(birthScale(axisLocation)*1.005) //Make it a very thin donut chart

//Draw the arc	
timeLabels.selectAll(".time-axis")
    .data(pie(times))
    .enter().append("path")
    .attr("class", "time-axis")
    .attr("id", (d,i) => "time-label-" + i)
    .attr("d", arc)
    
//Append the time labels
timeLabels.selectAll(".time-axis-text")
    .data(times)
    .enter().append("text")
    .attr("class", "time-axis-text")
    .attr("dy", 12)
    .append("textPath")
    .attr("xlink:href", (d,i) => "#time-label-" + i)
    .text(d => d)

//////////////////////////////////////////////////////////////
/////////////////////// Read in data /////////////////////////
//////////////////////////////////////////////////////////////

d3.csv("data/SciAm_minute_per_day_2014.csv").then((babyData) => {

    //Turn strings into actual numbers
    babyData.forEach(d => {
        d.time = +d.time
        d.births = +d.births
        d.line = +d.line
    })

    //////////////////////////////////////////////////////////////
    /////////////////////// Draw circles /////////////////////////
    //////////////////////////////////////////////////////////////

    const circles = svg.append("g")
        .attr("class", "circle-group")

    //Using scales in radial
    circles.selectAll(".circle")
        .data(babyData)
        .enter().append("circle")
        .attr("class", "circle")
        .attr("cx", d => birthScale(d.births) * Math.cos(timeScale(d.time) - pi1_2) ) //radius * cos(angle)
        .attr("cy", d => birthScale(d.births) * Math.sin(timeScale(d.time) - pi1_2) ) //radius * sin(angle)
        .attr("r", dotRadius)

    //////////////////////////////////////////////////////////////
    ////////////////////// Create clip paths /////////////////////
    //////////////////////////////////////////////////////////////

    const clips = svg.append("g").attr("class", "clip-group")

    clips.append("clipPath")
        .attr("id", "clip-area")
        .append("path")
        .attr("d", areaScale(babyData))

    //////////////////////////////////////////////////////////////
    ///////////////////////// Draw areas /////////////////////////
    //////////////////////////////////////////////////////////////

    const area = svg.append("g")
        .attr("class", "area-group")
        .attr("clip-path", "url(#clip-area)")

    //Create the circles but have them clipped by the area
    area.selectAll(".color-circle-above")
        .data(colorsRed.reverse())
        .enter().append("circle")
        .attr("class", "color-circle-above")
        .attr("r", (d,i) => birthScale(maxBabies) - (birthScale(maxBabies) - birthScale(averageBabies))/colorsRed.length * i )
        .style("fill", d => d)
        .style("filter", "url(#shadow)")

    //Create the circles but have them clipped by the area
    area.selectAll(".color-circle-below")
        .data(colorsBlue.reverse())
        .enter().append("circle")
        .attr("class", "color-circle-below")
        .attr("r", (d,i) => birthScale(averageBabies) - (birthScale(averageBabies) - birthScale(minBabies))/colorsBlue.length * i )
        .style("fill", d => d)
        .style("filter", "url(#shadow)")

    //////////////////////////////////////////////////////////////
    ///////////////////// Draw gridlines /////////////////////////
    //////////////////////////////////////////////////////////////

    const gridLines = svg.append("g")
        .attr("class", "gridline-group")

    //Add the axis lines
    gridLines.selectAll(".axis-line")
        .data(gridLineData)
        .enter().append("path")
        .attr("class", "axis-line")
        .attr("d", d => arcPath(birthScale(d)))

    //Add the numbers in between
    gridLines.selectAll(".axis-number")
        .data(gridLineData)
        .enter().append("text")
        .attr("class", "axis-number")
        .attr("y", d => -birthScale(d))
        .attr("dy", "0.4em")
        .text(d => d)
            
    //////////////////////////////////////////////////////////////
    /////////////////////// Draw circles /////////////////////////
    //////////////////////////////////////////////////////////////

    const circlesTop = svg.append("g")
        .attr("class", "circle-group")
        .attr("clip-path", "url(#clip-area)")

    //Using scales in radial
    circlesTop.selectAll(".circle-top")
        .data(babyData)
        .enter().append("circle")
        .attr("class", "circle-top")
        .attr("cx", d => birthScale(d.births) * Math.cos(timeScale(d.time) - pi1_2) ) //radius * cos(angle)
        .attr("cy", d => birthScale(d.births) * Math.sin(timeScale(d.time) - pi1_2) ) //radius * sin(angle)
        .attr("r", dotRadius)

    //////////////////////////////////////////////////////////////
    ///////////////////////// Draw lines /////////////////////////
    //////////////////////////////////////////////////////////////

    //Draw an average line
    const averageLine = svg.append("path")
        .attr("class", "average-line")
        .attr("d", arcPath(birthScale(averageBabies)))
            
})//d3.csv

////////////////////////////////////////////////////////////// 
/////////////////////// Helper functions /////////////////////
////////////////////////////////////////////////////////////// 

function arcPath(r) {
    let xStart = r * Math.cos(timeScale(0) - pi1_2)
    let yStart = r * Math.sin(timeScale(0) - pi1_2)
    let xEnd = r * Math.cos(timeScale(numData-1) - pi1_2)
    let yEnd = r * Math.sin(timeScale(numData-1) - pi1_2)

    return "M" + [xStart, yStart] + " A" + [r,r] + " 0 1 1 " + [xEnd, yEnd] 
}//function arcPath