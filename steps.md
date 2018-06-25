## Steps - Dataviz from Scratch

- We're going to make a chart about the number of babies born per minute in the US
- Show the simple `index.html` that creates a div and calling a script
- Show the simple `style.css` quickly, only note that it's simple styles

**script_1.js | Start**
- Start with `script.js` that only has the constants & commented sections

**script_2.js | Create SVG**
- Create SVG and show that it's there by making its background red
- Explain the margin convention -> show URL

**script_3.js | Read in data**
- Read in the data
  - Console log the data
  - Convert to numeric

**script_4.js | Timeline plot**
- Draw circles for the actual births
  - First use time for `x` and births for `y`, so literal data -> pixel transformation -> Makes no sense
  - Create a `timeScale` and `birthScale` as an `x` and `y` scale

**script_5.js | Radial plot**
- Turn the scales into radial ones
  - Move the overall `g` group to the middle
  - First with full `2pi` circle
  - Then create small gap
  - Adjust `cx` & `cy` formulas to have gap on top

**script_6.js | Loess & average line**
- Add loess line -> Show URL of radial line and loess line
- Difficult to tell how these lines compare to each other, so we add an average line
- Create average line by using the SVG arc path in separate function -> Show arc-path URL

**script_7.js | Area chart**
- Copy the loess line scale into an area scale
- Create simple area chart

**script_8.js | Concentric color fills**
- Use the area scale to create a `clip-path`
- Create two new groups: area below & above and apply the clip path
- Fill the above clip path with concentric circles
- Fill the below clip path with concentric circles

**script_9.js | Shadow filter**
- Create a shadow filter (take from `filter.js`)
- Add outer "chart-area" circle and note that it "breaks the chart"
- Add a shadow to each concentric circle through "filter"

**script_10.js | Circles on top**
- We want to show the exact minute datapoints that lie below the area as well
- First move the current circles to the front -> doesn't look good
  - Darker when they are on the white background, and almost white when they fall on the area
- Move the background grey ones back
- Copy the circles to a layer on top and apply clip path

**script_11.js | Titles**
- Add title and subtitle to chart

**script_12.js | Time arcs**
- Want to add hour labels around the edge
- Going to create a very thin donut chart to do this - Show default donut chart URL & d3-shape URL
- For a donut chart we need d3 to help in creating the arcs
  - First we use the pie layout to divide the circle up into 24 equal areas in terms of start and end angle
  - Then we create an arc function that can turn the pie data into SVG paths
  - Then we draw those arcs

**script_13.js | Time labels**
- Add an `id` to the arc segments
- Create texts for each of the time labels and append a `textpath`

**script_14.js | Gridlines**
- Create the gridline paths by using the average line path function
- Create the gridline labels

**script_15.js | Annotations**
- Add annotations
  - Go to Susie's website to show what it is
  - Get the annotationData (from `annotations.js`)
  - Create the `makeAnnotations` function & call it on the group

**Final | Show end results**
  - My end result of 3 charts
  - Portfolio for printed end result
  - Zan's SciAm blog for deeper analysis
  - Zan & my write-up for much more in-depth explanation of the idea, design & creation process
