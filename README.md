# Graph Layouter Interactive

This is a tool to create visualizations of graphs. It aims at making it easier to create diagrams documenting software designs. It is inspired by PlantUML and d3-force layout.

## How to use
- Edit [architecture.js](src/architecture.js) and document the graph you want to visualise by changing the yaml text in there
- use `npm start` to start the application
- use the mouse to drag the nodes to where you want them
- use "Save SVG" button, then click on "Download" to get the SVG image. (Tip: Using right-click and "open link in new tab" usually works best here.)
## Features
- Consume a formal graph description of nodes and edges (currently UML)
- Produce a diagram, with a simulation which tries to disentangle nodes and edges
- Snap to grid
- Save the layout in local browser storage
- When re-loading a modified graph with more or less nodes and edges, the saved layout can again be applied
- Export as self-contained, styled SVG



This is a work in progress.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
