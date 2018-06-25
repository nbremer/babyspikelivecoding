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

//Hour label data
const times = ["midnight","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","noon","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"]

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
    .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")")

//////////////////////////////////////////////////////////////
////////////////////// Create Scales /////////////////////////
//////////////////////////////////////////////////////////////

//x axis scale for the time
const timeScale = d3.scaleLinear()
    .domain([0, numData-1])
    .range([0, width])

//y axis scale for the number of births
const birthScale = d3.scaleLinear()
    .domain([0, maxBabies])
    .range([height, 0])

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

    // //Literal data to pixel
    // circles.selectAll(".circle")
    //     .data(babyData)
    //     .enter().append("circle")
    //     .attr("class", "circle")
    //     .attr("cx", d => d.time )
    //     .attr("cy", d => d.births )
    //     .attr("r", dotRadius)

    //Using scales in x & y fashion
    circles.selectAll(".circle")
        .data(babyData)
        .enter().append("circle")
        .attr("class", "circle")
        .attr("cx", d => timeScale(d.time) )
        .attr("cy", d => birthScale(d.births) )
        .attr("r", dotRadius)
            
})//d3.csv