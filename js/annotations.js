const annotationData = [
    {
        className: "average-note",
        note: {title: "The average", label: "On average " + averageBabies + " babies are born per minute", wrap: 140 },
        data: {births: averageBabies, time: 1310},
        type: d3.annotationCallout,
        dy: -70,
        dx: -70,
        connector: { end: "dot" }
    },{
        note: {title: "The night dip", label: "In the evening far fewer babies are born per minute, even when compared to only natural births throughout the day", wrap: 270 },
        data: {births: 6, time: 210},
        type: d3.annotationCallout,
        dy: -40,
        dx: 60,
        connector: { end: "dot" }
    },{
        note: {title: "The early morning peak", label: "Several factors combine for an explosion of babies starting around at 7:45am", wrap: 230 },
        data: {births: 11.5, time: 485},
        type: d3.annotationCallout,
        dy: -30,
        dx: 40,
        connector: { end: "dot" }
    },{
        note: {title: "The after-lunch boom", label: "Afternoon planned c-sections cause another very distinct bump in the number of babies born", wrap: 280 },
        data: {births: 10, time: 770},
        type: d3.annotationCallout,
        dy: 30,
        dx: -40,
        connector: { end: "dot" }
    }
]