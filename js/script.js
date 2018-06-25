////////////////////////////////////////////////////////////// 
//////////////////////// Constants /////////////////////////// 
////////////////////////////////////////////////////////////// 

const pi2 = 2 * Math.PI
const pi1_2 = Math.PI / 2

const numData = 1440 // = 60 * 24 -> minutes per day
const dotRadius = 1 //in pixels

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
    left: 20,
    top: 20,
    right: 20,
    bottom: 20,
}
const width = 1250 - margin.left - margin.right
const height = 900 - margin.top - margin.bottom

const svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + [margin.left + width/2, margin.bottom + height/2] + ")")

//////////////////////////////////////////////////////////////
////////////////////// Create scales /////////////////////////
//////////////////////////////////////////////////////////////

const timeScale = d3.scaleLinear()
    .domain([0, numData-1])
    .range([0.025 * pi2, (1 - 0.025) * pi2])

const birthScale = d3.scaleLinear()
    .domain([0, maxBabies])
    .range([0, height/2])

const line = d3.radialLine()
    .angle(d => timeScale(d.time))
    .radius(d => birthScale(d.line))

const areaScale = d3.radialArea()
    .angle(d => timeScale(d.time))
    .innerRadius(d => birthScale(d.line))
    .outerRadius(() => birthScale(averageBabies))


////////////////////////////////////////////////////////////// 
///////////////////// Create SVG effects ///////////////////// 
//////////////////////////////////////////////////////////////

const defs = svg.append("defs")

const filter = defs.append("filter")
    .attr("id", "shadow")

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
    .attr("class", "chart-area")
    .attr("r", birthScale(outerCircleShadow))
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
// const times = ["midnight","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","noon","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"]

// const timeLabels = svg.append("g").attr("class", "time-label-group")

// const pie

// const arc


//.attr("class", "time-axis")

//.attr("class", "time-axis-text")

//////////////////////////////////////////////////////////////
/////////////////////// Read in data /////////////////////////
//////////////////////////////////////////////////////////////

//data: data/SciAm_minute_per_day_2014.csv
d3.csv("data/SciAm_minute_per_day_2014.csv").then(babyData => {

    //////////////////////////////////////////////////////////////
    ///////////////////// Final data prep ////////////////////////
    //////////////////////////////////////////////////////////////

    babyData.forEach(d => {
        d.time = +d.time
        d.births = +d.births
        d.line = +d.line
    })
    console.table(babyData[0])

    //////////////////////////////////////////////////////////////
    /////////////////////// Draw circles /////////////////////////
    //////////////////////////////////////////////////////////////

    // //When you know the radius and angle, you get back to x & y pixels by:
    // x = radius * cos(angle)
    // y = radius * sin(angle)

    //class: circle-group
    const circles = svg.append("g").attr("class", "circle-group")

    circles.selectAll(".circle")
        .data(babyData)
        .enter().append("circle")
        .attr("class","circle")
        .attr("cx", d => birthScale(d.births) * Math.cos(timeScale(d.time) - pi1_2))
        .attr("cy", d => birthScale(d.births) * Math.sin(timeScale(d.time) - pi1_2))
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
    ////////////////////// Draw LOESS line ///////////////////////
    //////////////////////////////////////////////////////////////

    // const loessLine = svg.append("path")
    //     .attr("d", line(babyData))
    //     .style("fill", "none")
    //     .style("stroke", "hotpink")
    //     .style("stroke-width", 3)

    //////////////////////////////////////////////////////////////
    //////////////////////// Draw areas //////////////////////////
    //////////////////////////////////////////////////////////////

    const area = svg.append("g").attr("class", "area-group")
        .attr("clip-path", "url(#clip-area)")

    area.selectAll(".color-circle-above")
        .data(colorsRed.reverse())
        .enter().append("circle")
        .attr("class", "color-circle-above")
        .attr("r", (d,i) => birthScale(maxBabies) - (birthScale(maxBabies) - birthScale(averageBabies))/colorsRed.length * i)
        .style("fill", d => d)
        .style("filter", "url(#shadow)")
        

    area.selectAll(".color-circle-below")
        .data(colorsBlue.reverse())
        .enter().append("circle")
        .attr("class", "color-circle-below")
        .attr("r", (d,i) => birthScale(averageBabies) - (birthScale(averageBabies) - birthScale(minBabies))/colorsBlue.length * i)
        .style("fill", d => d)
        .style("filter", "url(#shadow)")

    //////////////////////////////////////////////////////////////
    ///////////////////// Draw gridlines /////////////////////////
    //////////////////////////////////////////////////////////////

    // const gridLines = svg.append("g").attr("class", "gridline-group")

    //.attr("class","axis-line")

    //.attr("class","axis-number")

    //////////////////////////////////////////////////////////////
    /////////////////////// Draw circles /////////////////////////
    //////////////////////////////////////////////////////////////

    // const circlesTop = svg.append("g").attr("class", "circle-group")
    //class: circle-top

    const circlesTop = svg.append("g").attr("class", "circle-group")
        .attr("clip-path", "url(#clip-area)")

    circlesTop.selectAll(".circle-top")
        .data(babyData)
        .enter().append("circle")
        .attr("class","circle-top")
        .attr("cx", d => birthScale(d.births) * Math.cos(timeScale(d.time) - pi1_2))
        .attr("cy", d => birthScale(d.births) * Math.sin(timeScale(d.time) - pi1_2))
        .attr("r", dotRadius)

    //////////////////////////////////////////////////////////////
    ///////////////////////// Draw lines /////////////////////////
    //////////////////////////////////////////////////////////////

    const averageLine = svg.append("path")
        .attr("class", "average-line")
        .attr("d", arcPath(birthScale(averageBabies)))

    ////////////////////////////////////////////////////////////// 
    ///////////////////////// Annotations ////////////////////////
    ////////////////////////////////////////////////////////////// 

    // const annotations = svg.append("g").attr("class", "annotation-group")

    // const annotationData
    
    // const makeAnnotations

})

////////////////////////////////////////////////////////////// 
/////////////////////// Helper functions /////////////////////
////////////////////////////////////////////////////////////// 

function arcPath(r) {
    // //When you know the radius and angle, you get back to x & y pixels by:
    // x = radius * cos(angle)
    // y = radius * sin(angle)
    let xStart = r * Math.cos(timeScale(0) - pi1_2)
    let yStart = r * Math.sin(timeScale(0) - pi1_2)
    let xEnd = r * Math.cos(timeScale(numData-1) - pi1_2)
    let yEnd = r * Math.sin(timeScale(numData-1) - pi1_2)

    //M start-x, start-y A radius-x, radius-y, x-axis-rotation, large-arc-flag, sweep-flag, end-x, end-y //(0 1 1)
    return "M" + [xStart, yStart] + " A " + [r,r] + " 0 1 1 " + [xEnd, yEnd]

}//function arcPath